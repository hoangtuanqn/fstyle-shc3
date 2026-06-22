# Award System Rebuild — Design Spec

**Date:** 2026-06-22
**Scope:** Full-stack rebuild of `/awards` feature with granular authorization and multi-winner support.

---

## Problem

Current award system has:
1. Authorization too broad — BTC FStyle can edit ALL manual awards, should only edit #4-8
2. No multi-winner support — awards with `quantity > 1` (Khuyến Khích ×2, Nỗ Lực ×4, Tri Ân Mentor ×13) only have one winner field
3. Stale UI — free text input only, no per-award permission feedback

## Business Rules (from docs/FSTYLE_SHOWCASE.md + docs/AWARD.md)

### Award Table

| # | Award | Type | WinnerType | Qty | Editable By |
|---|-------|------|------------|-----|-------------|
| 1 | Quán Quân | AUTO | TEAM | 1 | Auto-calculate (Admin triggers) |
| 2 | Á Quân | AUTO | TEAM | 1 | Auto-calculate (Admin triggers) |
| 3 | Khuyến Khích | AUTO | TEAM | 2 | Auto-calculate (Admin triggers) |
| 4 | Yêu Thích | MANUAL | TEAM | 1 | Admin, BTC FStyle |
| 5 | Kỹ Thuật | MANUAL | TEAM | 1 | Admin, BTC FStyle |
| 6 | Biên Đạo | MANUAL | TEAM | 1 | Admin, BTC FStyle |
| 7 | Trưởng Nhóm | MANUAL | INDIVIDUAL | 1 | Admin, BTC FStyle |
| 8 | Phong Cách | MANUAL | TEAM | 1 | Admin, BTC FStyle |
| 9 | Nỗ Lực | MANUAL | INDIVIDUAL | 4 | Admin only |
| 10 | Tri Ân Mentor | MANUAL | INDIVIDUAL | 13 | Admin only |

### Authorization Rules

- **Admin (BTC F-Code):** Full access — edit all awards, trigger auto-calculate
- **BTC FStyle:** Edit awards with `displayOrder` 4–8 only. All other awards displayed but inputs disabled.
- **MC, Member:** No access to `/awards` page (existing ProtectedRoute enforces this)

---

## Design

### 1. Database Schema Changes

#### Remove from `awards` table
```
winnerTeamId, winnerUserId, winnerName
```

#### New `award_winners` table
```sql
CREATE TABLE award_winners (
  id            VARCHAR(36) PRIMARY KEY,
  award_id      VARCHAR(36) NOT NULL REFERENCES awards(id),
  slot          TINYINT NOT NULL,           -- 1-based, max = award.quantity
  winner_team_id VARCHAR(36) REFERENCES teams(id),
  winner_user_id VARCHAR(36) REFERENCES users(id),
  winner_name   VARCHAR(255),               -- fallback display name
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
  UNIQUE(award_id, slot)
);
```

**Drizzle schema** in `backend/src/db/schema.ts`:
```typescript
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

### 2. Backend API Changes

#### `GET /awards` — all authenticated users
Returns awards with nested `winners` array:
```json
[
  {
    "id": "uuid",
    "name": "Nỗ Lực",
    "type": "MANUAL",
    "winnerType": "INDIVIDUAL",
    "quantity": 4,
    "prize": "Chứng nhận + Quà",
    "displayOrder": 9,
    "winners": [
      { "slot": 1, "winnerName": "Nguyễn A", "winnerTeamId": null, "winnerUserId": null },
      { "slot": 2, "winnerName": "Trần B", "winnerTeamId": null, "winnerUserId": null }
    ]
  }
]
```

Repository uses LEFT JOIN on `award_winners` and groups by award.

#### `PUT /awards/:awardId` — Admin + BTC FStyle (granular)
**Request body:**
```json
{
  "winners": [
    { "slot": 1, "winnerTeamId": "uuid" | null, "winnerUserId": "uuid" | null, "winnerName": "text" | null },
    { "slot": 2, "winnerName": "text" }
  ]
}
```

**Service logic:**
1. Find award by ID → 404 if not found
2. Check `award.type !== 'AUTO'` → 400 if auto
3. Check `canEditAward(req.role, award.displayOrder)` → 403 if not allowed
4. Validate `winners.length <= award.quantity` and all slots in range [1..quantity]
5. Upsert winners: delete existing for this award, insert new rows
6. Emit `awards:updated` via Socket.io

**Permission function:**
```typescript
function canEditAward(role: RoleType, displayOrder: number): boolean {
  if (role === RoleType.ADMIN) return true;
  if (role === RoleType.BTC_FSTYLE) return displayOrder >= 4 && displayOrder <= 8;
  return false;
}
```

#### `POST /awards/auto-calculate` — Admin only (unchanged)
- Calculates top teams from BGK scores
- Writes to `award_winners` table instead of `awards` table
- Quán Quân: slot 1 = highest scoring team
- Á Quân: slot 1 = 2nd highest
- Khuyến Khích: slot 1 = 3rd, slot 2 = 4th

### 3. Zod Validation Schema

```typescript
export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().min(1, 'awardId không hợp lệ!'),
  }),
  body: z.object({
    winners: z.array(
      z.object({
        slot: z.number().int().min(1),`
        winnerTeamId: z.string().trim().nullable().optional(),
        winnerUserId: z.string().trim().nullable().optional(),
        winnerName: z.string().trim().max(255).nullable().optional(),
      }),
    ).min(1),
  }),
});
```

### 4. Frontend Changes

#### Types (`src/types/award.ts`)
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

#### API Client (`src/api-requests/award.requests.ts`)
No structural changes — same endpoints, updated types.

#### Awards Page (`src/pages/Awards/index.tsx`)
- Each award card renders `quantity` input fields
- For qty=1: single input (existing UX)
- For qty>1: numbered inputs (e.g., "Slot 1", "Slot 2", ...)
- BTC_FSTYLE: inputs disabled for awards outside displayOrder [4-8]
- Admin: all inputs enabled
- Auto-calculate button: Admin only (unchanged)
- Save button per award: sends all winner slots at once

### 5. Socket.io

No changes. Existing `awards:updated` event + `useSocket` hook invalidation works.

### 6. Seeder Update

Remove `winnerTeamId/winnerUserId/winnerName` from award seed data (already no winners seeded, just remove the columns from schema).

---

## Files Changed

### Backend
| File | Action |
|------|--------|
| `src/db/schema.ts` | Remove winner cols from awards, add awardWinners table |
| `src/repositories/award.repository.ts` | Rewrite findAll (JOIN), add winner CRUD |
| `src/services/award.service.ts` | Add canEditAward(), rewrite updateAward/autoCalculate |
| `src/controllers/award.controllers.ts` | Pass req.role to service |
| `src/routes/award.routes.ts` | No structural changes |
| `src/schemas/award.schema.ts` | Update to winners array body |
| `drizzle/` | New migration |

### Frontend
| File | Action |
|------|--------|
| `src/types/award.ts` | Add AwardWinner type, update AwardType |
| `src/api-requests/award.requests.ts` | Update input type |
| `src/pages/Awards/index.tsx` | Multi-winner inputs, per-award disable logic |

---

## Not In Scope

- Dropdown selectors for teams/users (text input only for now)
- Leaderboard changes (consumes awards data — already works via socket)
- Landing page Awards component (`src/components/Awards.tsx`) — uses hardcoded static data, not API. No changes needed.
