# Award System Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the award system with a normalized `award_winners` table, granular role-based authorization (BTC FStyle edits awards 4-8 only), and multi-winner support for awards with quantity > 1.

**Architecture:** New `award_winners` table replaces the winner columns on `awards`. Backend service enforces per-award edit permissions via `canEditAward(role, displayOrder)`. Frontend renders dynamic winner inputs per award and disables inputs based on user role. Leaderboard adapts to read winners from the new nested array.

**Tech Stack:** Drizzle ORM (MySQL), Express 5, Zod 4, React 19, TanStack React Query, Socket.io, TypeScript strict mode.

## Global Constraints

- Path alias `~/*` → `src/*` in both frontend and backend
- Prettier: 120 char width, 2-space indent, single quotes, trailing commas
- Vietnamese user-facing messages, English code
- No `any` — use `unknown` then narrow
- All API responses wrapped in `ResponseClient`
- Errors thrown as `ErrorWithStatus`
- Frontend uses `privateApi` (auto Bearer token) for all requests
- No test framework configured — verify manually via dev server + API calls

---

## File Map

### Backend — Modified
| File | Responsibility |
|------|---------------|
| `backend/src/db/schema.ts` | Remove winner cols from `awards`, add `awardWinners` table |
| `backend/src/repositories/award.repository.ts` | Rewrite findAll with JOIN, add winner CRUD methods |
| `backend/src/services/award.service.ts` | Add `canEditAward()`, rewrite `updateAward()` for winners array, rewrite `autoCalculate()` to write `award_winners` |
| `backend/src/controllers/award.controllers.ts` | Pass `req.role` to service methods |
| `backend/src/schemas/award.schema.ts` | Update Zod schema for `{ winners: [...] }` body |
| `backend/src/seeders/seed.ts` | No change needed (seed data doesn't include winners) |

### Backend — Read-only (no changes needed)
| File | Reason |
|------|--------|
| `backend/src/routes/award.routes.ts` | Route-level auth already correct (ADMIN + BTC_FSTYLE on PUT) |
| `backend/src/services/leaderboard.service.ts` | Calls `awardService.getAll()` which will return new shape |
| `backend/src/controllers/leaderboard.controllers.ts` | Passes through unchanged |

### Frontend — Modified
| File | Responsibility |
|------|---------------|
| `frontend/src/types/award.ts` | Add `AwardWinner` type, update `AwardType` with `winners[]`, update `UpdateAwardInput` |
| `frontend/src/api-requests/award.requests.ts` | Update `updateAward` input type |
| `frontend/src/pages/Awards/index.tsx` | Multi-winner inputs, per-award disable logic for BTC_FSTYLE |
| `frontend/src/pages/Leaderboard/index.tsx` | Read winners from `winners[]` array instead of `winnerName` |
| `frontend/src/types/leaderboard.ts` | No change — imports `AwardType` which will update automatically |

### Frontend — No changes needed
| File | Reason |
|------|--------|
| `frontend/src/components/Awards.tsx` | Static hardcoded data for landing page, not API-driven |
| `frontend/src/hooks/useSocket.ts` | Already invalidates `['awards']` + `['leaderboard']` on `awards:updated` |

---

## Task 1: Database Schema — Add `awardWinners` table, remove winner cols from `awards`

**Files:**
- Modify: `backend/src/db/schema.ts:53-67`

**Produces:**
- `awardWinners` table export — used by Tasks 2, 3
- Updated `awards` table without `winnerTeamId`, `winnerUserId`, `winnerName` columns

- [ ] **Step 1: Update `backend/src/db/schema.ts`**

Remove the three winner columns from `awards` table and add the new `awardWinners` table. Replace lines 53-67 with:

```typescript
// ── Awards ─────────────────────────────────────────────
export const awards = mysqlTable('awards', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['AUTO', 'MANUAL']).notNull(),
  winnerType: mysqlEnum('winner_type', ['TEAM', 'INDIVIDUAL']).notNull(),
  quantity: tinyint('quantity').notNull().default(1),
  prize: varchar('prize', { length: 500 }),
  displayOrder: tinyint('display_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ── Award Winners ─────────────────────────────────────
export const awardWinners = mysqlTable(
  'award_winners',
  {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    awardId: varchar('award_id', { length: 36 }).notNull().references(() => awards.id),
    slot: tinyint('slot').notNull(),
    winnerTeamId: varchar('winner_team_id', { length: 36 }).references(() => teams.id),
    winnerUserId: varchar('winner_user_id', { length: 36 }).references(() => users.id),
    winnerName: varchar('winner_name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex('award_slot_idx').on(table.awardId, table.slot)],
);
```

- [ ] **Step 2: Generate and run migration**

```bash
cd backend
npm run db:generate
npm run db:migrate
```

Expected: Drizzle generates a migration that drops 3 columns from `awards` and creates `award_winners` table. Migration runs successfully.

**⚠️ Important:** If the DB has existing winner data, it will be lost. This is acceptable since awards have no winners yet (event hasn't happened). If there IS existing data, manually back it up before migrating.

- [ ] **Step 3: Commit**

```bash
git add backend/src/db/schema.ts backend/drizzle/
git commit -m "feat(db): add award_winners table, remove winner cols from awards"
```

---

## Task 2: Backend Repository — Rewrite award data access for multi-winner

**Files:**
- Modify: `backend/src/repositories/award.repository.ts` (full rewrite)

**Consumes:**
- `awards` table, `awardWinners` table from `backend/src/db/schema.ts` (Task 1)

**Produces:**
- `findAll()` → returns awards with nested `winners[]` array
- `findById(id)` → returns single award with `winners[]`
- `deleteWinnersByAwardId(awardId)` → clears all winners for an award
- `insertWinners(rows)` → bulk insert winner rows
- `findTeamById(teamId)` → unchanged

- [ ] **Step 1: Rewrite `backend/src/repositories/award.repository.ts`**

Replace entire file:

```typescript
import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { awards, awardWinners, teams } from '~/db/schema';

type AwardWinnerInput = {
  awardId: string;
  slot: number;
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};

class AwardRepository {
  findAll = async () => {
    const allAwards = await db.select().from(awards).orderBy(awards.displayOrder);
    const allWinners = await db.select().from(awardWinners).orderBy(awardWinners.slot);

    return allAwards.map((award) => ({
      ...award,
      winners: allWinners.filter((w) => w.awardId === award.id),
    }));
  };

  findById = async (id: string) => {
    const [award] = await db.select().from(awards).where(eq(awards.id, id));
    if (!award) return null;

    const winners = await db
      .select()
      .from(awardWinners)
      .where(eq(awardWinners.awardId, id))
      .orderBy(awardWinners.slot);

    return { ...award, winners };
  };

  deleteWinnersByAwardId = async (awardId: string) => {
    await db.delete(awardWinners).where(eq(awardWinners.awardId, awardId));
  };

  insertWinners = async (rows: AwardWinnerInput[]) => {
    if (rows.length === 0) return;
    await db.insert(awardWinners).values(rows);
  };

  findTeamById = async (teamId: string) => {
    const [result] = await db.select().from(teams).where(eq(teams.id, teamId));
    return result ?? null;
  };
}

export default new AwardRepository();
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd backend
npx tsc --noEmit
```

Expected: May fail due to service/controller still using old API — that's OK, fixed in Task 3.

- [ ] **Step 3: Commit**

```bash
git add backend/src/repositories/award.repository.ts
git commit -m "feat(award): rewrite repository for award_winners table"
```

---

## Task 3: Backend Service — Granular authorization + multi-winner logic

**Files:**
- Modify: `backend/src/services/award.service.ts` (full rewrite)

**Consumes:**
- `awardRepository.findAll()`, `findById()`, `deleteWinnersByAwardId()`, `insertWinners()` from Task 2
- `scoringService.getTeams()` from `backend/src/services/scoring.service.ts` (existing)
- `RoleType` enum from `backend/src/constants/enums.ts`
- `getIO()` from `backend/src/configs/socket.ts`

**Produces:**
- `getAll()` → awards with winners (unchanged signature, new shape)
- `updateAward(awardId, role, winners)` → now takes `role: RoleType` and `winners` array
- `autoCalculate()` → writes to `award_winners` table
- `canEditAward(role, displayOrder)` → permission check function

- [ ] **Step 1: Rewrite `backend/src/services/award.service.ts`**

Replace entire file:

```typescript
import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { getIO } from '~/configs/socket';
import { ErrorWithStatus } from '~/rules/error';
import awardRepository from '~/repositories/award.repository';
import scoringService from '~/services/scoring.service';

type WinnerInput = {
  slot: number;
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};

const canEditAward = (role: RoleType, displayOrder: number): boolean => {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE) return displayOrder >= 4 && displayOrder <= 8;
  return false;
};

class AwardService {
  getAll = async () => {
    return await awardRepository.findAll();
  };

  updateAward = async (awardId: string, role: RoleType, winners: WinnerInput[]) => {
    const award = await awardRepository.findById(awardId);
    if (!award) {
      throw new ErrorWithStatus({ message: 'Giải thưởng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    if (award.type === 'AUTO') {
      throw new ErrorWithStatus({ message: 'Không thể chỉnh sửa giải tự động!', status: HTTP_STATUS.BAD_REQUEST });
    }
    if (!canEditAward(role, award.displayOrder)) {
      throw new ErrorWithStatus({ message: 'Bạn không có quyền chỉnh sửa giải thưởng này!', status: HTTP_STATUS.FORBIDDEN });
    }

    const invalidSlots = winners.filter((w) => w.slot < 1 || w.slot > award.quantity);
    if (invalidSlots.length > 0) {
      throw new ErrorWithStatus({
        message: `Slot không hợp lệ! Giải "${award.name}" chỉ có ${award.quantity} slot.`,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const slots = winners.map((w) => w.slot);
    if (new Set(slots).size !== slots.length) {
      throw new ErrorWithStatus({ message: 'Không được trùng slot!', status: HTTP_STATUS.BAD_REQUEST });
    }

    await awardRepository.deleteWinnersByAwardId(awardId);
    await awardRepository.insertWinners(
      winners.map((w) => ({
        awardId,
        slot: w.slot,
        winnerTeamId: w.winnerTeamId ?? null,
        winnerUserId: w.winnerUserId ?? null,
        winnerName: w.winnerName ?? null,
      })),
    );

    const updated = await awardRepository.findById(awardId);
    getIO().emit('awards:updated', { awardId, award: updated });
    return updated;
  };

  autoCalculate = async () => {
    const teamsWithScores = await scoringService.getTeams();
    const sorted = [...teamsWithScores].sort((a, b) => b.totalScore - a.totalScore);

    const allAwards = await awardRepository.findAll();
    const autoAwards = allAwards.filter((a) => a.type === 'AUTO').sort((a, b) => a.displayOrder - b.displayOrder);

    let teamCursor = 0;
    for (const award of autoAwards) {
      await awardRepository.deleteWinnersByAwardId(award.id);

      const winnersToInsert: { awardId: string; slot: number; winnerTeamId: string; winnerName: string }[] = [];

      for (let slot = 1; slot <= award.quantity && teamCursor < sorted.length; slot++) {
        winnersToInsert.push({
          awardId: award.id,
          slot,
          winnerTeamId: sorted[teamCursor].id,
          winnerName: sorted[teamCursor].name,
        });
        teamCursor++;
      }

      await awardRepository.insertWinners(winnersToInsert);
    }

    getIO().emit('awards:updated', { type: 'auto-calculate' });
    return await awardRepository.findAll();
  };
}

export default new AwardService();
```

**Note on `autoCalculate` logic:** Uses a `teamCursor` that advances through `sorted` teams across all auto awards sequentially:
- Quán Quân slot 1 → sorted[0] (highest), cursor → 1
- Á Quân slot 1 → sorted[1] (2nd), cursor → 2
- Khuyến Khích slot 1 → sorted[2] (3rd), cursor → 3
- Khuyến Khích slot 2 → sorted[3] (4th), cursor → 4

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd backend
npx tsc --noEmit
```

Expected: May still fail due to controller passing wrong args — fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add backend/src/services/award.service.ts
git commit -m "feat(award): add canEditAward auth + multi-winner updateAward/autoCalculate"
```

---

## Task 4: Backend Controller + Schema — Pass role, update Zod validation

**Files:**
- Modify: `backend/src/controllers/award.controllers.ts` (full rewrite)
- Modify: `backend/src/schemas/award.schema.ts` (full rewrite)

**Consumes:**
- `awardService.updateAward(awardId, role, winners)` from Task 3
- `awardService.autoCalculate()` from Task 3
- `awardService.getAll()` from Task 3
- `req.role` set by `middlewareAuth.auth` middleware

**Produces:**
- Updated HTTP handlers that pass `req.role` to service
- Zod schema validating `{ winners: [{slot, winnerTeamId?, winnerUserId?, winnerName?}] }` body

- [ ] **Step 1: Rewrite `backend/src/schemas/award.schema.ts`**

Replace entire file:

```typescript
import { z } from 'zod';

export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().min(1, 'awardId không hợp lệ!'),
  }),
  body: z.object({
    winners: z
      .array(
        z.object({
          slot: z.number().int().min(1, 'Slot phải >= 1'),
          winnerTeamId: z.string().trim().nullable().optional(),
          winnerUserId: z.string().trim().nullable().optional(),
          winnerName: z.string().trim().max(255).nullable().optional(),
        }),
      )
      .min(1, 'Cần ít nhất 1 winner!'),
  }),
});
```

- [ ] **Step 2: Rewrite `backend/src/controllers/award.controllers.ts`**

Replace entire file:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import awardService from '~/services/award.service';

import type { RoleType } from '~/constants/enums';

class AwardController {
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.getAll();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  updateAward = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.updateAward(
        req.params.awardId as string,
        req.role as RoleType,
        req.body.winners,
      );
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật giải thưởng thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  autoCalculate = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.autoCalculate();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Tính giải tự động thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new AwardController();
```

- [ ] **Step 3: Verify full backend compiles**

```bash
cd backend
npx tsc --noEmit
```

Expected: PASS — all backend files should compile cleanly now.

- [ ] **Step 4: Test backend manually**

Start the dev server and test with curl/Postman:

```bash
cd backend && npm run dev
```

1. `GET /api/v1/awards` (with valid auth cookie) → should return awards with empty `winners: []` arrays
2. `PUT /api/v1/awards/:id` with `{ "winners": [{ "slot": 1, "winnerName": "Test" }] }` → should work for MANUAL awards
3. Same PUT with a BTC_FSTYLE token on award #9 (Nỗ Lực, displayOrder 9) → should return 403

- [ ] **Step 5: Commit**

```bash
git add backend/src/controllers/award.controllers.ts backend/src/schemas/award.schema.ts
git commit -m "feat(award): update controller to pass role, update Zod for winners array"
```

---

## Task 5: Frontend Types + API Client — Update for multi-winner

**Files:**
- Modify: `frontend/src/types/award.ts` (full rewrite)
- Modify: `frontend/src/api-requests/award.requests.ts` (minor update)

**Produces:**
- `AwardWinner` type — used by Tasks 6, 7
- `AwardType` with `winners: AwardWinner[]` — used by Tasks 6, 7 and by `frontend/src/types/leaderboard.ts` (imports `AwardType`)
- `UpdateAwardInput` with `winners` array — used by Task 6

- [ ] **Step 1: Rewrite `frontend/src/types/award.ts`**

Replace entire file:

```typescript
export type AwardWinner = {
  slot: number;
  winnerTeamId: string | null;
  winnerUserId: string | null;
  winnerName: string | null;
};

export type AwardType = {
  id: string;
  name: string;
  type: 'AUTO' | 'MANUAL';
  winnerType: 'TEAM' | 'INDIVIDUAL';
  quantity: number;
  prize: string | null;
  displayOrder: number;
  winners: AwardWinner[];
};

export type UpdateAwardInput = {
  winners: AwardWinner[];
};
```

- [ ] **Step 2: Update `frontend/src/api-requests/award.requests.ts`**

No change needed — the existing `updateAward` method already sends `{ awardId, data }` where `data` is `UpdateAwardInput`. The type change propagates automatically since `UpdateAwardInput` now has `winners` instead of individual fields.

Verify the file still matches:

```typescript
import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { AwardType, UpdateAwardInput } from '~/types/award';

class AwardApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<AwardType[]>>('/awards');
    return response.data;
  };

  static updateAward = async ({ awardId, data }: { awardId: string; data: UpdateAwardInput }) => {
    const response = await privateApi.put<ApiResponse<AwardType>>(`/awards/${awardId}`, data);
    return response.data;
  };

  static autoCalculate = async () => {
    const response = await privateApi.post<ApiResponse<AwardType[]>>('/awards/auto-calculate');
    return response.data;
  };
}

export default AwardApi;
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/award.ts
git commit -m "feat(award): update frontend types for multi-winner"
```

---

## Task 6: Frontend Awards Page — Multi-winner inputs + per-award authorization

**Files:**
- Modify: `frontend/src/pages/Awards/index.tsx` (full rewrite)

**Consumes:**
- `AwardType`, `AwardWinner`, `UpdateAwardInput` from `frontend/src/types/award.ts` (Task 5)
- `AwardApi` from `frontend/src/api-requests/award.requests.ts` (Task 5)
- `RoleType` from `frontend/src/constants/enums.ts`
- `useAuth` from `frontend/src/hooks/useAuth.ts`
- `useSocket` from `frontend/src/hooks/useSocket.ts`

**Produces:**
- Awards page with multi-winner inputs and per-award disable logic

- [ ] **Step 1: Rewrite `frontend/src/pages/Awards/index.tsx`**

Replace entire file:

```tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import AwardApi from '~/api-requests/award.requests';
import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import useSocket from '~/hooks/useSocket';

import type { CSSProperties } from 'react';
import type { AwardType, AwardWinner } from '~/types/award';

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.1)',
  background: 'rgba(255,255,255,.04)',
  color: 'var(--text)',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color .2s, box-shadow .2s',
};

const disabledInputStyle: CSSProperties = {
  ...inputStyle,
  opacity: 0.4,
  cursor: 'not-allowed',
};

const canEdit = (role: string, displayOrder: number): boolean => {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE) return displayOrder >= 4 && displayOrder <= 8;
  return false;
};

const Awards = () => {
  useSocket();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userRole = user?.role ?? '';

  const { data: awardsRes, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: AwardApi.getAll,
  });
  const awards = awardsRes?.result ?? [];

  // drafts keyed by `${awardId}-${slot}`
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const getDraft = (awardId: string, slot: number, winners: AwardWinner[]) => {
    const key = `${awardId}-${slot}`;
    if (drafts[key] !== undefined) return drafts[key];
    const existing = winners.find((w) => w.slot === slot);
    return existing?.winnerName ?? '';
  };

  const setDraft = (awardId: string, slot: number, value: string) => {
    setDrafts((prev) => ({ ...prev, [`${awardId}-${slot}`]: value }));
  };

  const updateMutation = useMutation({
    mutationFn: AwardApi.updateAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      toast.success('Đã cập nhật giải thưởng!');
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra!',
      );
    },
  });

  const autoCalcMutation = useMutation({
    mutationFn: AwardApi.autoCalculate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['awards'] });
      toast.success('Tính giải tự động thành công!');
    },
    onError: (err: unknown) => {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Có lỗi xảy ra!',
      );
    },
  });

  const handleSaveAward = (award: AwardType) => {
    const winners: AwardWinner[] = [];
    for (let slot = 1; slot <= award.quantity; slot++) {
      const name = getDraft(award.id, slot, award.winners).trim();
      if (name) {
        winners.push({ slot, winnerTeamId: null, winnerUserId: null, winnerName: name });
      }
    }
    if (winners.length === 0) {
      toast.error('Cần nhập ít nhất 1 người/đội nhận giải!');
      return;
    }
    updateMutation.mutate({ awardId: award.id, data: { winners } });
  };

  const autoAwards = awards.filter((a) => a.type === 'AUTO');
  const manualAwards = awards.filter((a) => a.type === 'MANUAL');

  const renderWinnerInputs = (award: AwardType) => {
    const editable = canEdit(userRole, award.displayOrder);
    const slots = Array.from({ length: award.quantity }, (_, i) => i + 1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {slots.map((slot) => (
          <input
            key={slot}
            type="text"
            placeholder={
              award.winnerType === 'TEAM'
                ? `Nhập tên đội${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ''}...`
                : `Nhập tên${award.quantity > 1 ? ` (${slot}/${award.quantity})` : ''}...`
            }
            value={getDraft(award.id, slot, award.winners)}
            onChange={(e) => setDraft(award.id, slot, e.target.value)}
            disabled={!editable}
            style={editable ? inputStyle : disabledInputStyle}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 108 }}>
      <section style={{ paddingBottom: 48 }}>
        <div className="con" style={{ textAlign: 'center' }}>
          <span className="ey">🔧 BTC Panel</span>
          <h1 className="st" style={{ marginBottom: 12 }}>
            NHẬP <em>GIẢI THƯỞNG</em>
          </h1>
          <p style={{ color: 'var(--dim)', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
            Nhập tên đội / cá nhân cho từng hạng giải — dữ liệu sẽ hiển thị trên trang Leaderboard
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="con" style={{ maxWidth: 720, margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--dim)', padding: '40px 0', fontSize: 14 }}>
              Đang tải danh sách giải thưởng...
            </div>
          ) : (
            <>
              {/* Manual Awards */}
              {manualAwards.length > 0 && (
                <div
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(254,230,34,.15)',
                    background: 'var(--bg2)',
                    padding: '32px 28px',
                    marginBottom: 28,
                    boxShadow: '0 8px 40px rgba(0,0,0,.5)',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 22,
                      letterSpacing: '.04em',
                      color: 'var(--gold)',
                      marginBottom: 6,
                    }}
                  >
                    🏆 GIẢI THƯỞNG
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
                    Nhập tên đội / cá nhân nhận giải
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {manualAwards.map((award) => (
                      <div key={award.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{ minWidth: 160, fontSize: 13, fontWeight: 700, color: 'var(--text)', paddingTop: 10 }}>
                          {award.name}
                          {award.quantity > 1 && (
                            <span style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>
                              {' '}
                              ×{award.quantity}
                            </span>
                          )}
                          {award.prize && (
                            <div style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>{award.prize}</div>
                          )}
                        </div>
                        {renderWinnerInputs(award)}
                        {canEdit(userRole, award.displayOrder) && (
                          <button
                            onClick={() => handleSaveAward(award)}
                            disabled={updateMutation.isPending}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              border: 'none',
                              background: 'var(--gold)',
                              color: '#050301',
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              marginTop: 0,
                            }}
                          >
                            Lưu
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto Awards */}
              {autoAwards.length > 0 && (
                <div
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(251,140,5,.15)',
                    background: 'var(--bg2)',
                    padding: '32px 28px',
                    marginBottom: 28,
                    boxShadow: '0 8px 40px rgba(0,0,0,.5)',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      fontSize: 22,
                      letterSpacing: '.04em',
                      color: 'var(--orange)',
                      marginBottom: 6,
                    }}
                  >
                    ⚡ GIẢI TỰ ĐỘNG
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 28 }}>
                    Tính toán tự động từ điểm số BGK — chỉ Admin mới có thể kích hoạt
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {autoAwards.map((award) => (
                      <div key={award.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <div style={{ minWidth: 160, fontSize: 13, fontWeight: 700, color: 'var(--text)', paddingTop: 4 }}>
                          {award.name}
                          {award.quantity > 1 && (
                            <span style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>
                              {' '}
                              ×{award.quantity}
                            </span>
                          )}
                          {award.prize && (
                            <div style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 400 }}>{award.prize}</div>
                          )}
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {award.winners.length > 0 ? (
                            award.winners.map((w) => (
                              <div
                                key={w.slot}
                                style={{ fontSize: 14, color: 'var(--gold)' }}
                              >
                                {award.quantity > 1 && (
                                  <span style={{ color: 'var(--dim)', fontSize: 11 }}>{w.slot}. </span>
                                )}
                                {w.winnerName}
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 14, color: 'var(--dim)', fontStyle: 'italic' }}>Chưa tính</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                {userRole === RoleType.ADMIN && (
                  <button
                    type="button"
                    onClick={() => autoCalcMutation.mutate()}
                    disabled={autoCalcMutation.isPending}
                    style={{
                      padding: '14px 40px',
                      borderRadius: 10,
                      border: 'none',
                      background: autoCalcMutation.isPending ? 'rgba(89,115,179,.6)' : 'rgba(89,115,179,1)',
                      color: '#fff',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      cursor: autoCalcMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'all .3s',
                      boxShadow: '0 0 20px rgba(89,115,179,.3)',
                    }}
                  >
                    {autoCalcMutation.isPending ? 'Đang tính...' : '⚡ TÍNH GIẢI TỰ ĐỘNG'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .con { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default Awards;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend
npx tsc --noEmit
```

Expected: May fail on Leaderboard page — fixed in Task 7.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Awards/index.tsx
git commit -m "feat(award): rebuild Awards page with multi-winner inputs and per-award auth"
```

---

## Task 7: Frontend Leaderboard — Adapt to multi-winner data shape

**Files:**
- Modify: `frontend/src/pages/Leaderboard/index.tsx:37,147-159`

**Consumes:**
- `AwardType` with `winners: AwardWinner[]` from Task 5

The Leaderboard page currently reads `award.winnerName` directly (lines 37, 152-159). It needs to read from `award.winners[]` instead.

- [ ] **Step 1: Update `frontend/src/pages/Leaderboard/index.tsx`**

**Change 1 — line 37:** Update `hasAny` check from `winnerName` to `winners`:

Find:
```typescript
  const hasAny = rankings.length > 0 || awards.some((a) => a.winnerName);
```

Replace with:
```typescript
  const hasAny = rankings.length > 0 || awards.some((a) => a.winners.length > 0);
```

**Change 2 — lines 147-159:** Update the award winner display cell.

Find:
```tsx
                    {awards.map((award) => (
                      <tr key={award.id}>
                        <td style={{ ...tdStyle, fontWeight: 700 }}>{award.name}</td>
                        <td
                          style={{
                            ...tdStyle,
                            fontFamily: award.winnerName ? "'Anton', sans-serif" : undefined,
                            fontSize: award.winnerName ? 20 : undefined,
                            letterSpacing: award.winnerName ? '.03em' : undefined,
                            color: award.winnerName ? 'var(--text)' : 'var(--dim)',
                          }}
                        >
                          {award.winnerName ?? 'Chưa công bố'}
                        </td>
                      </tr>
                    ))}
```

Replace with:
```tsx
                    {awards.map((award) => {
                      const hasWinners = award.winners.length > 0;
                      const winnerNames = award.winners.map((w) => w.winnerName).filter(Boolean).join(', ');
                      return (
                        <tr key={award.id}>
                          <td style={{ ...tdStyle, fontWeight: 700 }}>{award.name}</td>
                          <td
                            style={{
                              ...tdStyle,
                              fontFamily: hasWinners ? "'Anton', sans-serif" : undefined,
                              fontSize: hasWinners ? 20 : undefined,
                              letterSpacing: hasWinners ? '.03em' : undefined,
                              color: hasWinners ? 'var(--text)' : 'var(--dim)',
                            }}
                          >
                            {hasWinners ? winnerNames : 'Chưa công bố'}
                          </td>
                        </tr>
                      );
                    })}
```

- [ ] **Step 2: Verify full frontend compiles**

```bash
cd frontend
npx tsc --noEmit
```

Expected: PASS — all frontend files compile cleanly.

- [ ] **Step 3: Verify in browser**

```bash
cd frontend && npm run dev
```

1. Navigate to `/leaderboard` — awards should display "Chưa công bố" (no winners yet)
2. Navigate to `/awards` (logged in as Admin) — should see multi-winner inputs for Nỗ Lực (4 fields), Tri Ân Mentor (13 fields)
3. Log in as BTC_FSTYLE — awards #4-8 should be editable, #9-10 should show disabled inputs
4. Enter a winner name and save — check Leaderboard updates via Socket.io

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Leaderboard/index.tsx
git commit -m "feat(leaderboard): adapt to multi-winner award data shape"
```

---

## Verification Checklist

After all tasks complete, verify end-to-end:

1. **Backend compiles:** `cd backend && npx tsc --noEmit` → PASS
2. **Frontend compiles:** `cd frontend && npx tsc --noEmit` → PASS
3. **DB migration applied:** `award_winners` table exists, `awards` table no longer has winner columns
4. **GET /awards:** Returns awards with `winners: []` arrays
5. **PUT /awards/:id (Admin):** Can edit any MANUAL award (all displayOrders)
6. **PUT /awards/:id (BTC_FSTYLE):** Can edit awards 4-8, gets 403 on awards 9-10
7. **PUT /awards/:id (AUTO award):** Returns 400 regardless of role
8. **Multi-winner:** Nỗ Lực (qty 4) accepts up to 4 winner slots
9. **Auto-calculate:** Creates correct winners in `award_winners` (1st → Quán Quân, 2nd → Á Quân, 3rd+4th → Khuyến Khích)
10. **Socket.io:** Saving/auto-calculating emits `awards:updated`, Leaderboard + Awards pages refresh
11. **Leaderboard:** Displays winner names from `winners[]` array, shows "Chưa công bố" when empty
12. **Frontend auth:** BTC_FSTYLE sees disabled inputs for awards outside [4-8], no Save button for disabled awards
