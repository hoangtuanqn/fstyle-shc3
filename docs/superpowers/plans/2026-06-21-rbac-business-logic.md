# RBAC & Business Logic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full role-based authorization and business logic for voting, scoring, awards, and leaderboard with Socket.io realtime updates.

**Architecture:** Feature-by-feature vertical slices. Each feature builds a complete backend (repo → service → controller → route) then connects the existing frontend mock UI to real API calls. Socket.io wired as cross-cutting concern at the end.

**Tech Stack:** Express 5, Drizzle ORM (MySQL 8), Zod 4, Socket.io, React 19, TanStack React Query, Axios, Redux Toolkit

## Global Constraints

- Path alias: `~/*` → `src/*` in both backend and frontend
- Backend response wrapper: `new ResponseClient({ message, result })` from `~/rules/response`
- Backend error: `throw new ErrorWithStatus({ message, status })` from `~/rules/error`
- Zod schemas wrap `body`/`params`/`query` objects; validate middleware at `~/utils/validation`
- Frontend API responses typed as `ApiResponse<T>` from `~/types/auth`
- Frontend HTTP: `privateApi` from `~/utils/axiosInstance` (auto-refresh on 401)
- All user-facing messages in Vietnamese
- Prettier: 120 chars, 2 spaces, single quotes, trailing commas, semicolons
- No tests in this codebase — skip TDD cycle, verify via dev server

---

### Task 1: Voting Backend — Repository + Service + Zod

**Files:**
- Create: `backend/src/repositories/voting.repository.ts`
- Create: `backend/src/services/voting.service.ts`
- Create: `backend/src/schemas/voting.schema.ts`

**Interfaces:**
- Consumes: `db` from `~/configs/db`, `effortVotes` + `users` + `teams` from `~/db/schema`, `ErrorWithStatus` from `~/rules/error`, `HTTP_STATUS` from `~/constants/httpStatus`, `RoleType` from `~/constants/enums`
- Produces:
  - `votingRepository` (default export) with methods: `findVotesByVoter(voterId: string)`, `findVotesByVoterAndTeam(voterId: string, teamId: string)`, `findCandidatesByTeam(teamId: string)`, `findAllCandidatesGrouped()`, `createVote(voterId: string, candidateId: string)`, `deleteVote(voterId: string, candidateId: string)`, `countVotesByCandidate(candidateId: string)`
  - `votingService` (default export) with methods: `getCandidates(userId: string, role: RoleType, teamId: string | null)`, `getMyVotes(userId: string)`, `vote(userId: string, role: RoleType, teamId: string | null, candidateId: string)`, `removeVote(userId: string, candidateId: string)`
  - `voteBodySchema` (named export) — Zod schema for `{ body: { candidateId: string } }`
  - `voteParamsSchema` (named export) — Zod schema for `{ params: { candidateId: string } }`

- [ ] **Step 1: Create voting Zod schemas**

Create `backend/src/schemas/voting.schema.ts`:

```typescript
import { z } from 'zod';

export const voteBodySchema = z.object({
  body: z.object({
    candidateId: z.string().trim().uuid('candidateId không hợp lệ!'),
  }),
});

export const voteParamsSchema = z.object({
  params: z.object({
    candidateId: z.string().trim().uuid('candidateId không hợp lệ!'),
  }),
});
```

- [ ] **Step 2: Create voting repository**

Create `backend/src/repositories/voting.repository.ts`:

```typescript
import { and, eq, sql } from 'drizzle-orm';

import { db } from '~/configs/db';
import { effortVotes, users, teams } from '~/db/schema';

class VotingRepository {
  findVotesByVoter = async (voterId: string) => {
    return await db
      .select({
        id: effortVotes.id,
        candidateId: effortVotes.candidateId,
        createdAt: effortVotes.createdAt,
      })
      .from(effortVotes)
      .where(eq(effortVotes.voterId, voterId));
  };

  findVotesByVoterAndTeam = async (voterId: string, teamId: string) => {
    return await db
      .select({ candidateId: effortVotes.candidateId })
      .from(effortVotes)
      .innerJoin(users, eq(users.id, effortVotes.candidateId))
      .where(and(eq(effortVotes.voterId, voterId), eq(users.teamId, teamId)));
  };

  findCandidatesByTeam = async (teamId: string) => {
    return await db
      .select({
        id: users.id,
        name: users.name,
        teamId: users.teamId,
        voteCount: sql<number>`(SELECT COUNT(*) FROM effort_votes WHERE candidate_id = ${users.id})`.as('voteCount'),
      })
      .from(users)
      .where(and(eq(users.teamId, teamId), eq(users.role, 'MEMBER')));
  };

  findAllCandidatesGrouped = async () => {
    return await db
      .select({
        id: users.id,
        name: users.name,
        teamId: users.teamId,
        teamName: teams.name,
        teamColor: teams.color,
        voteCount: sql<number>`(SELECT COUNT(*) FROM effort_votes WHERE candidate_id = ${users.id})`.as('voteCount'),
      })
      .from(users)
      .innerJoin(teams, eq(users.teamId, teams.id))
      .where(eq(users.role, 'MEMBER'))
      .orderBy(teams.displayOrder);
  };

  createVote = async (voterId: string, candidateId: string) => {
    await db.insert(effortVotes).values({ voterId, candidateId });
  };

  deleteVote = async (voterId: string, candidateId: string) => {
    await db
      .delete(effortVotes)
      .where(and(eq(effortVotes.voterId, voterId), eq(effortVotes.candidateId, candidateId)));
  };
}

export default new VotingRepository();
```

- [ ] **Step 3: Create voting service**

Create `backend/src/services/voting.service.ts`:

```typescript
import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import userRepository from '~/repositories/user.repository';
import votingRepository from '~/repositories/voting.repository';

const VOTE_START = new Date('2026-06-29T00:00:00+07:00');
const VOTE_END = new Date('2026-07-03T23:59:59+07:00');
const MAX_VOTES_PER_SCOPE = 2;

class VotingService {
  getCandidates = async (userId: string, role: RoleType, teamId: string | null) => {
    if (role === RoleType.MEMBER) {
      if (!teamId) {
        throw new ErrorWithStatus({ message: 'Bạn chưa thuộc đội nào!', status: HTTP_STATUS.BAD_REQUEST });
      }
      return await votingRepository.findCandidatesByTeam(teamId);
    }
    return await votingRepository.findAllCandidatesGrouped();
  };

  getMyVotes = async (userId: string) => {
    return await votingRepository.findVotesByVoter(userId);
  };

  vote = async (userId: string, role: RoleType, teamId: string | null, candidateId: string) => {
    this.checkVotingPeriod();

    if (userId === candidateId) {
      throw new ErrorWithStatus({ message: 'Không thể vote cho chính mình!', status: HTTP_STATUS.BAD_REQUEST });
    }

    const candidate = await userRepository.findById(candidateId);
    if (!candidate || candidate.role !== RoleType.MEMBER) {
      throw new ErrorWithStatus({ message: 'Ứng viên không hợp lệ!', status: HTTP_STATUS.NOT_FOUND });
    }

    if (role === RoleType.MEMBER) {
      if (!teamId || candidate.teamId !== teamId) {
        throw new ErrorWithStatus({ message: 'Chỉ được vote thành viên trong team!', status: HTTP_STATUS.FORBIDDEN });
      }
      const existingVotes = await votingRepository.findVotesByVoter(userId);
      if (existingVotes.length >= MAX_VOTES_PER_SCOPE) {
        throw new ErrorWithStatus({ message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote!`, status: HTTP_STATUS.BAD_REQUEST });
      }
    }

    if (role === RoleType.BTC_FSTYLE) {
      const candidateTeamId = candidate.teamId!;
      const teamVotes = await votingRepository.findVotesByVoterAndTeam(userId, candidateTeamId);
      if (teamVotes.length >= MAX_VOTES_PER_SCOPE) {
        throw new ErrorWithStatus({
          message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote mỗi đội!`,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      }
    }

    await votingRepository.createVote(userId, candidateId);
  };

  removeVote = async (userId: string, candidateId: string) => {
    this.checkVotingPeriod();
    await votingRepository.deleteVote(userId, candidateId);
  };

  private checkVotingPeriod = () => {
    const now = new Date();
    if (now < VOTE_START || now > VOTE_END) {
      throw new ErrorWithStatus({
        message: 'Ngoài thời gian bình chọn! (29/6 → 3/7/2026)',
        status: HTTP_STATUS.FORBIDDEN,
      });
    }
  };
}

export default new VotingService();
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/schemas/voting.schema.ts backend/src/repositories/voting.repository.ts backend/src/services/voting.service.ts
git commit -m "feat: add voting repository, service, and zod schemas"
```

---

### Task 2: Voting Backend — Controller + Route + Register

**Files:**
- Create: `backend/src/controllers/voting.controllers.ts`
- Create: `backend/src/routes/voting.routes.ts`
- Modify: `backend/src/routes/root.routes.ts`

**Interfaces:**
- Consumes: `votingService` from `~/services/voting.service`, `voteBodySchema` + `voteParamsSchema` from `~/schemas/voting.schema`, `middlewareAuth` + `isRole` from `~/middlewares/auth.middlewares`, `validate` from `~/utils/validation`, `ResponseClient` from `~/rules/response`, `HTTP_STATUS` from `~/constants/httpStatus`, `RoleType` from `~/constants/enums`
- Produces: API endpoints mounted at `/api/v1/voting`

- [ ] **Step 1: Create voting controller**

Create `backend/src/controllers/voting.controllers.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import votingService from '~/services/voting.service';

import type { RoleType } from '~/constants/enums';

class VotingController {
  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getCandidates(req.userId!, req.role! as RoleType, req.tokenPayload?.teamId ?? null);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getMyVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getMyVotes(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.vote(req.userId!, req.role! as RoleType, req.tokenPayload?.teamId ?? null, req.body.candidateId);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Vote thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  removeVote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.removeVote(req.userId!, req.params.candidateId);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Đã hủy vote!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new VotingController();
```

**Note on `req.tokenPayload?.teamId`:** The JWT payload currently only stores `userId` and `role`. The controller needs the user's `teamId` for voting rules. Two approaches:
1. Add `teamId` to the JWT payload (requires updating `signAccessToken` in `auth.service.ts`)
2. Fetch the user from DB inside the service to get `teamId`

**Choose approach 2** (fetch from DB) to avoid changing auth flow. Update the controller to pass `null` for teamId and let the service fetch it:

Replace the controller with this version:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import votingService from '~/services/voting.service';

import type { RoleType } from '~/constants/enums';

class VotingController {
  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getCandidates(req.userId!, req.role! as RoleType);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getMyVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getMyVotes(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.vote(req.userId!, req.role! as RoleType, req.body.candidateId);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Vote thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  removeVote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.removeVote(req.userId!, req.params.candidateId);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Đã hủy vote!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new VotingController();
```

And update the voting service signatures from Task 1 accordingly — `vote` becomes `vote(userId, role, candidateId)` and fetches the user's teamId internally:

```typescript
// In voting.service.ts, update the vote method signature:
vote = async (userId: string, role: RoleType, candidateId: string) => {
  this.checkVotingPeriod();

  if (userId === candidateId) {
    throw new ErrorWithStatus({ message: 'Không thể vote cho chính mình!', status: HTTP_STATUS.BAD_REQUEST });
  }

  const voter = await userRepository.findById(userId);
  if (!voter) {
    throw new ErrorWithStatus({ message: 'Người dùng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
  }

  const candidate = await userRepository.findById(candidateId);
  if (!candidate || candidate.role !== RoleType.MEMBER) {
    throw new ErrorWithStatus({ message: 'Ứng viên không hợp lệ!', status: HTTP_STATUS.NOT_FOUND });
  }

  if (role === RoleType.MEMBER) {
    if (!voter.teamId || candidate.teamId !== voter.teamId) {
      throw new ErrorWithStatus({ message: 'Chỉ được vote thành viên trong team!', status: HTTP_STATUS.FORBIDDEN });
    }
    const existingVotes = await votingRepository.findVotesByVoter(userId);
    if (existingVotes.length >= MAX_VOTES_PER_SCOPE) {
      throw new ErrorWithStatus({ message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote!`, status: HTTP_STATUS.BAD_REQUEST });
    }
  }

  if (role === RoleType.BTC_FSTYLE) {
    const candidateTeamId = candidate.teamId!;
    const teamVotes = await votingRepository.findVotesByVoterAndTeam(userId, candidateTeamId);
    if (teamVotes.length >= MAX_VOTES_PER_SCOPE) {
      throw new ErrorWithStatus({
        message: `Tối đa ${MAX_VOTES_PER_SCOPE} lượt vote mỗi đội!`,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }
  }

  await votingRepository.createVote(userId, candidateId);
};

// Also update getCandidates to fetch teamId internally:
getCandidates = async (userId: string, role: RoleType) => {
  if (role === RoleType.MEMBER) {
    const user = await userRepository.findById(userId);
    if (!user?.teamId) {
      throw new ErrorWithStatus({ message: 'Bạn chưa thuộc đội nào!', status: HTTP_STATUS.BAD_REQUEST });
    }
    return await votingRepository.findCandidatesByTeam(user.teamId);
  }
  return await votingRepository.findAllCandidatesGrouped();
};
```

- [ ] **Step 2: Create voting route**

Create `backend/src/routes/voting.routes.ts`:

```typescript
import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import votingController from '~/controllers/voting.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { voteBodySchema, voteParamsSchema } from '~/schemas/voting.schema';
import { validate } from '~/utils/validation';

const votingRouter = Router();

votingRouter.get('/candidates', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), votingController.getCandidates);
votingRouter.get('/my-votes', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), votingController.getMyVotes);
votingRouter.post('/vote', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), validate(voteBodySchema), votingController.vote);
votingRouter.delete('/vote/:candidateId', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), validate(voteParamsSchema), votingController.removeVote);

export default votingRouter;
```

- [ ] **Step 3: Register voting route in root router**

Modify `backend/src/routes/root.routes.ts` — add:

```typescript
import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import votingRouter from '~/routes/voting.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);

export default rootRouter;
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/controllers/voting.controllers.ts backend/src/routes/voting.routes.ts backend/src/routes/root.routes.ts backend/src/services/voting.service.ts
git commit -m "feat: add voting controller, route, and register in root router"
```

---

### Task 3: Voting Frontend — API Client + Dashboard Integration

**Files:**
- Create: `frontend/src/api-requests/voting.requests.ts`
- Create: `frontend/src/types/voting.ts`
- Modify: `frontend/src/pages/Dashboard/index.tsx`

**Interfaces:**
- Consumes: `privateApi` from `~/utils/axiosInstance`, `ApiResponse` from `~/types/auth`, `useAuth` from `~/hooks/useAuth`, `RoleType` from `~/constants/enums`
- Produces: `VotingApi` (default export) with static methods: `getCandidates()`, `getMyVotes()`, `vote(candidateId)`, `removeVote(candidateId)`

- [ ] **Step 1: Create voting types**

Create `frontend/src/types/voting.ts`:

```typescript
export type CandidateType = {
  id: string;
  name: string;
  teamId: string;
  teamName?: string;
  teamColor?: string;
  voteCount: number;
};

export type VoteType = {
  id: string;
  candidateId: string;
  createdAt: string;
};
```

- [ ] **Step 2: Create voting API client**

Create `frontend/src/api-requests/voting.requests.ts`:

```typescript
import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { CandidateType, VoteType } from '~/types/voting';

class VotingApi {
  static getCandidates = async () => {
    const response = await privateApi.get<ApiResponse<CandidateType[]>>('/voting/candidates');
    return response.data;
  };

  static getMyVotes = async () => {
    const response = await privateApi.get<ApiResponse<VoteType[]>>('/voting/my-votes');
    return response.data;
  };

  static vote = async (candidateId: string) => {
    const response = await privateApi.post<ApiResponse<null>>('/voting/vote', { candidateId });
    return response.data;
  };

  static removeVote = async (candidateId: string) => {
    const response = await privateApi.delete<ApiResponse<null>>(`/voting/vote/${candidateId}`);
    return response.data;
  };
}

export default VotingApi;
```

- [ ] **Step 3: Rewrite Dashboard to use API**

Replace `frontend/src/pages/Dashboard/index.tsx` entirely. The new version:
- Fetches candidates via `useQuery` → `VotingApi.getCandidates`
- Fetches user's votes via `useQuery` → `VotingApi.getMyVotes`
- Uses `useMutation` for vote/unvote with query invalidation
- MEMBER sees only own team; BTC_FSTYLE sees all teams with filter tabs
- MC/ADMIN see nothing (route guard already blocks them, but fallback message)
- Shows loading state
- Vote button toggles between "VOTE" and "ĐÃ VOTE" based on my-votes data
- Keeps the existing visual design (teamMap colors, VoteCard, grid layout)

The full replacement file is large — implement it following the existing UI patterns from the current Dashboard code. Key changes:
- Remove `initialMembers` mock data
- Remove `useState` for members, replace with `useQuery`
- Add `useMutation` for vote/unvote
- Check `myVotes` array to determine voted state per candidate
- Import `useAuth` to get user role for conditional rendering
- Import `toast` from `sonner` for success/error feedback

```typescript
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CSSProperties } from 'react';

import VotingApi from '~/api-requests/voting.requests';
import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';

import type { CandidateType } from '~/types/voting';

// Keep existing teamMap, teamFilters, VoteCard from current code
// but update VoteCard to accept `isVoted` and `onToggleVote` props

// Dashboard component:
const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'votes' | 'name'>('votes');

  const { data: candidatesRes, isLoading: loadingCandidates } = useQuery({
    queryKey: ['voting-candidates'],
    queryFn: VotingApi.getCandidates,
  });

  const { data: myVotesRes } = useQuery({
    queryKey: ['voting-my-votes'],
    queryFn: VotingApi.getMyVotes,
  });

  const voteMutation = useMutation({
    mutationFn: VotingApi.vote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['voting-my-votes'] });
      toast.success('Vote thành công!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    },
  });

  const unvoteMutation = useMutation({
    mutationFn: VotingApi.removeVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['voting-my-votes'] });
      toast.success('Đã hủy vote!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    },
  });

  const candidates = candidatesRes?.result ?? [];
  const myVotedIds = new Set((myVotesRes?.result ?? []).map((v) => v.candidateId));

  // ... rest follows existing Dashboard layout pattern with API data
};

export default Dashboard;
```

The implementer should preserve the full existing visual design (VoteCard component, teamMap, team stats bar, filter chips, sort toggle, responsive grid) but wire it to API data instead of mock state.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/types/voting.ts frontend/src/api-requests/voting.requests.ts frontend/src/pages/Dashboard/index.tsx
git commit -m "feat: connect voting dashboard to backend API"
```

---

### Task 4: Scoring Backend — Repository + Service + Zod

**Files:**
- Create: `backend/src/repositories/scoring.repository.ts`
- Create: `backend/src/services/scoring.service.ts`
- Create: `backend/src/schemas/scoring.schema.ts`

**Interfaces:**
- Consumes: `db` from `~/configs/db`, `judgeScores` + `btcScores` + `teams` from `~/db/schema`, `ErrorWithStatus` from `~/rules/error`, `HTTP_STATUS` from `~/constants/httpStatus`
- Produces:
  - `scoringRepository` (default export) with methods: `findJudgeScoresByTeam(teamId)`, `findBtcScoreByTeam(teamId)`, `upsertJudgeScores(teamId, judgeNumber, scores)`, `upsertBtcScore(teamId, discipline)`, `findAllTeamsWithScores()`
  - `scoringService` (default export) with methods: `getTeams()`, `getTeamScores(teamId)`, `saveJudgeScores(teamId, data)`, `saveBtcScore(teamId, data)`, `getStatistics()`
  - Zod schemas: `judgeScoresSchema`, `btcScoreSchema`, `teamIdParamsSchema`

- [ ] **Step 1: Create scoring Zod schemas**

Create `backend/src/schemas/scoring.schema.ts`:

```typescript
import { z } from 'zod';

export const teamIdParamsSchema = z.object({
  params: z.object({
    teamId: z.string().trim().uuid('teamId không hợp lệ!'),
  }),
});

export const judgeScoresSchema = z.object({
  params: z.object({
    teamId: z.string().trim().uuid('teamId không hợp lệ!'),
  }),
  body: z.object({
    judgeNumber: z.number().int().min(1).max(3),
    ideaConcept: z.number().min(0).max(20),
    choreography: z.number().min(0).max(25),
    synchronization: z.number().min(0).max(20),
    performance: z.number().min(0).max(20),
    costume: z.number().min(0).max(10),
  }),
});

export const btcScoreSchema = z.object({
  params: z.object({
    teamId: z.string().trim().uuid('teamId không hợp lệ!'),
  }),
  body: z.object({
    discipline: z.number().min(0).max(5),
  }),
});
```

- [ ] **Step 2: Create scoring repository**

Create `backend/src/repositories/scoring.repository.ts`:

```typescript
import { eq, and } from 'drizzle-orm';

import { db } from '~/configs/db';
import { judgeScores, btcScores, teams } from '~/db/schema';

class ScoringRepository {
  findJudgeScoresByTeam = async (teamId: string) => {
    return await db.select().from(judgeScores).where(eq(judgeScores.teamId, teamId)).orderBy(judgeScores.judgeNumber);
  };

  findBtcScoreByTeam = async (teamId: string) => {
    const [result] = await db.select().from(btcScores).where(eq(btcScores.teamId, teamId));
    return result ?? null;
  };

  upsertJudgeScores = async (
    teamId: string,
    judgeNumber: number,
    scores: { ideaConcept: number; choreography: number; synchronization: number; performance: number; costume: number },
  ) => {
    const existing = await db
      .select()
      .from(judgeScores)
      .where(and(eq(judgeScores.teamId, teamId), eq(judgeScores.judgeNumber, judgeNumber)));

    if (existing.length > 0) {
      await db
        .update(judgeScores)
        .set({
          ideaConcept: String(scores.ideaConcept),
          choreography: String(scores.choreography),
          synchronization: String(scores.synchronization),
          performance: String(scores.performance),
          costume: String(scores.costume),
        })
        .where(and(eq(judgeScores.teamId, teamId), eq(judgeScores.judgeNumber, judgeNumber)));
    } else {
      await db.insert(judgeScores).values({
        teamId,
        judgeNumber,
        ideaConcept: String(scores.ideaConcept),
        choreography: String(scores.choreography),
        synchronization: String(scores.synchronization),
        performance: String(scores.performance),
        costume: String(scores.costume),
      });
    }
  };

  upsertBtcScore = async (teamId: string, discipline: number) => {
    const existing = await db.select().from(btcScores).where(eq(btcScores.teamId, teamId));
    if (existing.length > 0) {
      await db.update(btcScores).set({ discipline: String(discipline) }).where(eq(btcScores.teamId, teamId));
    } else {
      await db.insert(btcScores).values({ teamId, discipline: String(discipline) });
    }
  };

  findAllTeams = async () => {
    return await db.select().from(teams).orderBy(teams.displayOrder);
  };

  findAllJudgeScores = async () => {
    return await db.select().from(judgeScores).orderBy(judgeScores.teamId, judgeScores.judgeNumber);
  };

  findAllBtcScores = async () => {
    return await db.select().from(btcScores);
  };
}

export default new ScoringRepository();
```

- [ ] **Step 3: Create scoring service**

Create `backend/src/services/scoring.service.ts`:

```typescript
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import scoringRepository from '~/repositories/scoring.repository';

class ScoringService {
  getTeams = async () => {
    const teams = await scoringRepository.findAllTeams();
    const allJudgeScores = await scoringRepository.findAllJudgeScores();
    const allBtcScores = await scoringRepository.findAllBtcScores();

    return teams.map((team) => {
      const teamJudgeScores = allJudgeScores.filter((s) => s.teamId === team.id);
      const btcScore = allBtcScores.find((s) => s.teamId === team.id);
      const judgeTotal = this.calculateJudgeAverage(teamJudgeScores);
      const btcTotal = btcScore ? Number(btcScore.discipline) : 0;
      return { ...team, judgeAvg: judgeTotal, btcScore: btcTotal, totalScore: judgeTotal + btcTotal };
    });
  };

  getTeamScores = async (teamId: string) => {
    const judgeRows = await scoringRepository.findJudgeScoresByTeam(teamId);
    const btcRow = await scoringRepository.findBtcScoreByTeam(teamId);
    return { judgeScores: judgeRows, btcScore: btcRow };
  };

  saveJudgeScores = async (teamId: string, data: {
    judgeNumber: number;
    ideaConcept: number;
    choreography: number;
    synchronization: number;
    performance: number;
    costume: number;
  }) => {
    await scoringRepository.upsertJudgeScores(teamId, data.judgeNumber, {
      ideaConcept: data.ideaConcept,
      choreography: data.choreography,
      synchronization: data.synchronization,
      performance: data.performance,
      costume: data.costume,
    });
  };

  saveBtcScore = async (teamId: string, discipline: number) => {
    await scoringRepository.upsertBtcScore(teamId, discipline);
  };

  getStatistics = async () => {
    const teams = await scoringRepository.findAllTeams();
    const allJudgeScores = await scoringRepository.findAllJudgeScores();
    const allBtcScores = await scoringRepository.findAllBtcScores();

    return teams.map((team) => {
      const teamJudgeScores = allJudgeScores.filter((s) => s.teamId === team.id);
      const btcScore = allBtcScores.find((s) => s.teamId === team.id);
      const judgeDetails = teamJudgeScores.map((js) => ({
        judgeNumber: js.judgeNumber,
        ideaConcept: Number(js.ideaConcept),
        choreography: Number(js.choreography),
        synchronization: Number(js.synchronization),
        performance: Number(js.performance),
        costume: Number(js.costume),
        total: Number(js.ideaConcept) + Number(js.choreography) + Number(js.synchronization) + Number(js.performance) + Number(js.costume),
      }));
      const judgeAvg = this.calculateJudgeAverage(teamJudgeScores);
      const btcTotal = btcScore ? Number(btcScore.discipline) : 0;
      return {
        team: { id: team.id, name: team.name, concept: team.concept, color: team.color },
        judgeDetails,
        judgeAvg,
        btcScore: btcTotal,
        totalScore: judgeAvg + btcTotal,
      };
    });
  };

  private calculateJudgeAverage = (judgeRows: any[]) => {
    if (judgeRows.length === 0) return 0;
    const totals = judgeRows.map(
      (r) =>
        Number(r.ideaConcept) + Number(r.choreography) + Number(r.synchronization) + Number(r.performance) + Number(r.costume),
    );
    return Math.round((totals.reduce((s, t) => s + t, 0) / judgeRows.length) * 10) / 10;
  };
}

export default new ScoringService();
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/schemas/scoring.schema.ts backend/src/repositories/scoring.repository.ts backend/src/services/scoring.service.ts
git commit -m "feat: add scoring repository, service, and zod schemas"
```

---

### Task 5: Scoring Backend — Controller + Route

**Files:**
- Create: `backend/src/controllers/scoring.controllers.ts`
- Create: `backend/src/routes/scoring.routes.ts`
- Modify: `backend/src/routes/root.routes.ts`

**Interfaces:**
- Consumes: `scoringService` from `~/services/scoring.service`, `judgeScoresSchema` + `btcScoreSchema` + `teamIdParamsSchema` from `~/schemas/scoring.schema`, `middlewareAuth` + `isRole` from `~/middlewares/auth.middlewares`, `validate` from `~/utils/validation`, `ResponseClient` from `~/rules/response`, `HTTP_STATUS` from `~/constants/httpStatus`, `RoleType` from `~/constants/enums`
- Produces: API endpoints mounted at `/api/v1/scoring`

- [ ] **Step 1: Create scoring controller**

Create `backend/src/controllers/scoring.controllers.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import scoringService from '~/services/scoring.service';

class ScoringController {
  getTeams = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getTeams();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getTeamScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getTeamScores(req.params.teamId);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  saveJudgeScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scoringService.saveJudgeScores(req.params.teamId, req.body);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Lưu điểm BGK thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  saveBtcScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scoringService.saveBtcScore(req.params.teamId, req.body.discipline);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Lưu điểm BTC thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  getStatistics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getStatistics();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new ScoringController();
```

- [ ] **Step 2: Create scoring route**

Create `backend/src/routes/scoring.routes.ts`:

```typescript
import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import scoringController from '~/controllers/scoring.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { btcScoreSchema, judgeScoresSchema, teamIdParamsSchema } from '~/schemas/scoring.schema';
import { validate } from '~/utils/validation';

const scoringRouter = Router();

scoringRouter.get('/teams', middlewareAuth.auth, isRole([RoleType.ADMIN]), scoringController.getTeams);
scoringRouter.get('/teams/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(teamIdParamsSchema), scoringController.getTeamScores);
scoringRouter.put('/judge-scores/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(judgeScoresSchema), scoringController.saveJudgeScores);
scoringRouter.put('/btc-scores/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(btcScoreSchema), scoringController.saveBtcScore);
scoringRouter.get('/statistics', middlewareAuth.auth, isRole([RoleType.ADMIN]), scoringController.getStatistics);

export default scoringRouter;
```

- [ ] **Step 3: Register in root router**

Add to `backend/src/routes/root.routes.ts`:

```typescript
import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import votingRouter from '~/routes/voting.routes';
import scoringRouter from '~/routes/scoring.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);
rootRouter.use('/scoring', scoringRouter);

export default rootRouter;
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/controllers/scoring.controllers.ts backend/src/routes/scoring.routes.ts backend/src/routes/root.routes.ts
git commit -m "feat: add scoring controller, route, and register in root router"
```

---

### Task 6: Scoring Frontend — API Client + Page Integration

**Files:**
- Create: `frontend/src/api-requests/scoring.requests.ts`
- Create: `frontend/src/types/scoring.ts`
- Modify: `frontend/src/pages/Scoring/index.tsx`
- Modify: `frontend/src/App.tsx` (update scoring route to ADMIN only)

**Interfaces:**
- Consumes: `privateApi` from `~/utils/axiosInstance`, `ApiResponse` from `~/types/auth`
- Produces: `ScoringApi` (default export) with static methods: `getTeams()`, `getTeamScores(teamId)`, `saveJudgeScores(teamId, data)`, `saveBtcScore(teamId, data)`, `getStatistics()`

- [ ] **Step 1: Create scoring types**

Create `frontend/src/types/scoring.ts`:

```typescript
export type TeamScoreSummary = {
  id: string;
  name: string;
  concept: string;
  color: string;
  displayOrder: number;
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};

export type JudgeScoreRow = {
  id: string;
  teamId: string;
  judgeNumber: number;
  ideaConcept: string;
  choreography: string;
  synchronization: string;
  performance: string;
  costume: string;
};

export type BtcScoreRow = {
  id: string;
  teamId: string;
  discipline: string;
} | null;

export type TeamScoreDetail = {
  judgeScores: JudgeScoreRow[];
  btcScore: BtcScoreRow;
};

export type JudgeScoresInput = {
  judgeNumber: number;
  ideaConcept: number;
  choreography: number;
  synchronization: number;
  performance: number;
  costume: number;
};

export type BtcScoreInput = {
  discipline: number;
};

export type TeamStatistic = {
  team: { id: string; name: string; concept: string; color: string };
  judgeDetails: {
    judgeNumber: number;
    ideaConcept: number;
    choreography: number;
    synchronization: number;
    performance: number;
    costume: number;
    total: number;
  }[];
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};
```

- [ ] **Step 2: Create scoring API client**

Create `frontend/src/api-requests/scoring.requests.ts`:

```typescript
import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { BtcScoreInput, JudgeScoresInput, TeamScoreDetail, TeamScoreSummary, TeamStatistic } from '~/types/scoring';

class ScoringApi {
  static getTeams = async () => {
    const response = await privateApi.get<ApiResponse<TeamScoreSummary[]>>('/scoring/teams');
    return response.data;
  };

  static getTeamScores = async (teamId: string) => {
    const response = await privateApi.get<ApiResponse<TeamScoreDetail>>(`/scoring/teams/${teamId}`);
    return response.data;
  };

  static saveJudgeScores = async (teamId: string, data: JudgeScoresInput) => {
    const response = await privateApi.put<ApiResponse<null>>(`/scoring/judge-scores/${teamId}`, data);
    return response.data;
  };

  static saveBtcScore = async (teamId: string, data: BtcScoreInput) => {
    const response = await privateApi.put<ApiResponse<null>>(`/scoring/btc-scores/${teamId}`, data);
    return response.data;
  };

  static getStatistics = async () => {
    const response = await privateApi.get<ApiResponse<TeamStatistic[]>>('/scoring/statistics');
    return response.data;
  };
}

export default ScoringApi;
```

- [ ] **Step 3: Update Scoring page to use API**

Modify `frontend/src/pages/Scoring/index.tsx`. The page needs to:
- Add a team selector (tabs/dropdown) to pick which team to score
- Fetch teams via `useQuery` → `ScoringApi.getTeams`
- Fetch selected team's scores via `useQuery` → `ScoringApi.getTeamScores(selectedTeamId)`
- Add 3 judge tabs/columns (BGK 1, BGK 2, BGK 3)
- Use `useMutation` for save with debounce + manual save button
- Keep the existing criteria table UI design
- Load existing scores into form when team/judge changes
- Show toast feedback on save

Key structural change: the current page has one set of score inputs. New version needs:
1. Team selector at top
2. Judge number selector (1/2/3)
3. Score inputs pre-filled from API data for selected team+judge
4. BTC discipline score input (separate from judge scores)
5. Save button per section

- [ ] **Step 4: Update App.tsx route guard**

Modify `frontend/src/App.tsx` — change scoring route to ADMIN only:

```typescript
{/* Admin only — scoring */}
<Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN]} />}>
  <Route
    path="/scoring"
    element={
      <>
        <Nav />
        <main>
          <Scoring />
        </main>
        <Footer />
      </>
    }
  />
</Route>
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/scoring.ts frontend/src/api-requests/scoring.requests.ts frontend/src/pages/Scoring/index.tsx frontend/src/App.tsx
git commit -m "feat: connect scoring page to backend API with team/judge selectors"
```

---

### Task 7: Awards Backend — Repository + Service + Controller + Route

**Files:**
- Create: `backend/src/repositories/award.repository.ts`
- Create: `backend/src/services/award.service.ts`
- Create: `backend/src/controllers/award.controllers.ts`
- Create: `backend/src/routes/award.routes.ts`
- Create: `backend/src/schemas/award.schema.ts`
- Modify: `backend/src/routes/root.routes.ts`

**Interfaces:**
- Consumes: `db` from `~/configs/db`, `awards` + `teams` from `~/db/schema`, `scoringService` from `~/services/scoring.service`, `ErrorWithStatus` from `~/rules/error`, `HTTP_STATUS` from `~/constants/httpStatus`, `RoleType` from `~/constants/enums`
- Produces:
  - `awardRepository` (default export) with methods: `findAll()`, `findById(id)`, `updateWinner(id, data)`
  - `awardService` (default export) with methods: `getAll()`, `updateAward(awardId, data)`, `autoCalculate()`
  - API endpoints mounted at `/api/v1/awards`

- [ ] **Step 1: Create award Zod schema**

Create `backend/src/schemas/award.schema.ts`:

```typescript
import { z } from 'zod';

export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().uuid('awardId không hợp lệ!'),
  }),
  body: z.object({
    winnerTeamId: z.string().trim().uuid().nullable().optional(),
    winnerUserId: z.string().trim().uuid().nullable().optional(),
    winnerName: z.string().trim().max(255).nullable().optional(),
  }),
});
```

- [ ] **Step 2: Create award repository**

Create `backend/src/repositories/award.repository.ts`:

```typescript
import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { awards, teams, users } from '~/db/schema';

class AwardRepository {
  findAll = async () => {
    return await db.select().from(awards).orderBy(awards.displayOrder);
  };

  findById = async (id: string) => {
    const [result] = await db.select().from(awards).where(eq(awards.id, id));
    return result ?? null;
  };

  updateWinner = async (
    id: string,
    data: { winnerTeamId?: string | null; winnerUserId?: string | null; winnerName?: string | null },
  ) => {
    await db.update(awards).set(data).where(eq(awards.id, id));
  };

  findTeamById = async (teamId: string) => {
    const [result] = await db.select().from(teams).where(eq(teams.id, teamId));
    return result ?? null;
  };
}

export default new AwardRepository();
```

- [ ] **Step 3: Create award service**

Create `backend/src/services/award.service.ts`:

```typescript
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import awardRepository from '~/repositories/award.repository';
import scoringService from '~/services/scoring.service';

class AwardService {
  getAll = async () => {
    return await awardRepository.findAll();
  };

  updateAward = async (awardId: string, data: { winnerTeamId?: string | null; winnerUserId?: string | null; winnerName?: string | null }) => {
    const award = await awardRepository.findById(awardId);
    if (!award) {
      throw new ErrorWithStatus({ message: 'Giải thưởng không tồn tại!', status: HTTP_STATUS.NOT_FOUND });
    }
    if (award.type === 'AUTO') {
      throw new ErrorWithStatus({ message: 'Không thể chỉnh sửa giải tự động!', status: HTTP_STATUS.BAD_REQUEST });
    }
    await awardRepository.updateWinner(awardId, data);
    return await awardRepository.findById(awardId);
  };

  autoCalculate = async () => {
    const teamsWithScores = await scoringService.getTeams();
    const sorted = [...teamsWithScores].sort((a, b) => b.totalScore - a.totalScore);

    const allAwards = await awardRepository.findAll();
    const autoAwards = allAwards.filter((a) => a.type === 'AUTO').sort((a, b) => a.displayOrder - b.displayOrder);

    for (let i = 0; i < autoAwards.length && i < sorted.length; i++) {
      await awardRepository.updateWinner(autoAwards[i].id, {
        winnerTeamId: sorted[i].id,
        winnerName: sorted[i].name,
      });
    }

    return await awardRepository.findAll();
  };
}

export default new AwardService();
```

- [ ] **Step 4: Create award controller**

Create `backend/src/controllers/award.controllers.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import awardService from '~/services/award.service';

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
      const result = await awardService.updateAward(req.params.awardId, req.body);
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

- [ ] **Step 5: Create award route**

Create `backend/src/routes/award.routes.ts`:

```typescript
import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import awardController from '~/controllers/award.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { updateAwardSchema } from '~/schemas/award.schema';
import { validate } from '~/utils/validation';

const awardRouter = Router();

awardRouter.get('/', middlewareAuth.auth, awardController.getAll);
awardRouter.put('/:awardId', middlewareAuth.auth, isRole([RoleType.ADMIN, RoleType.BTC_FSTYLE]), validate(updateAwardSchema), awardController.updateAward);
awardRouter.post('/auto-calculate', middlewareAuth.auth, isRole([RoleType.ADMIN]), awardController.autoCalculate);

export default awardRouter;
```

- [ ] **Step 6: Register in root router**

Update `backend/src/routes/root.routes.ts`:

```typescript
import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import votingRouter from '~/routes/voting.routes';
import scoringRouter from '~/routes/scoring.routes';
import awardRouter from '~/routes/award.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);
rootRouter.use('/scoring', scoringRouter);
rootRouter.use('/awards', awardRouter);

export default rootRouter;
```

- [ ] **Step 7: Commit**

```bash
git add backend/src/schemas/award.schema.ts backend/src/repositories/award.repository.ts backend/src/services/award.service.ts backend/src/controllers/award.controllers.ts backend/src/routes/award.routes.ts backend/src/routes/root.routes.ts
git commit -m "feat: add awards backend — repository, service, controller, route"
```

---

### Task 8: Awards Frontend — API Client + Page Integration

**Files:**
- Create: `frontend/src/api-requests/award.requests.ts`
- Create: `frontend/src/types/award.ts`
- Modify: `frontend/src/pages/Awards/index.tsx`
- Modify: `frontend/src/App.tsx` (update awards route to ADMIN + BTC_FSTYLE)

**Interfaces:**
- Consumes: `privateApi` from `~/utils/axiosInstance`, `ApiResponse` from `~/types/auth`
- Produces: `AwardApi` (default export) with static methods: `getAll()`, `updateAward(awardId, data)`, `autoCalculate()`

- [ ] **Step 1: Create award types**

Create `frontend/src/types/award.ts`:

```typescript
export type AwardType = {
  id: string;
  name: string;
  type: 'AUTO' | 'MANUAL';
  winnerType: 'TEAM' | 'INDIVIDUAL';
  winnerTeamId: string | null;
  winnerUserId: string | null;
  winnerName: string | null;
  quantity: number;
  prize: string | null;
  displayOrder: number;
};

export type UpdateAwardInput = {
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};
```

- [ ] **Step 2: Create award API client**

Create `frontend/src/api-requests/award.requests.ts`:

```typescript
import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { AwardType, UpdateAwardInput } from '~/types/award';

class AwardApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<AwardType[]>>('/awards');
    return response.data;
  };

  static updateAward = async (awardId: string, data: UpdateAwardInput) => {
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

- [ ] **Step 3: Update Awards page to use API**

Modify `frontend/src/pages/Awards/index.tsx`:
- Replace `localStorage` read/write with `useQuery` → `AwardApi.getAll` and `useMutation` → `AwardApi.updateAward`
- Load awards from API on mount
- Each award row uses `useMutation` to save on change (or debounced save)
- Add "Tính giải tự động" button for ADMIN that calls `AwardApi.autoCalculate`
- Keep the existing visual design
- Remove `STORAGE_KEY`, `loadAwards`, `saveAwards` functions
- Show toast feedback on save/error

- [ ] **Step 4: Update App.tsx route guard**

Update awards route in `frontend/src/App.tsx` to restrict to ADMIN + BTC_FSTYLE:

```typescript
{/* Admin + BTC FStyle — awards management */}
<Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
  <Route
    path="/awards"
    element={
      <>
        <Nav />
        <main>
          <Awards />
        </main>
        <Footer />
      </>
    }
  />
</Route>
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/types/award.ts frontend/src/api-requests/award.requests.ts frontend/src/pages/Awards/index.tsx frontend/src/App.tsx
git commit -m "feat: connect awards page to backend API"
```

---

### Task 9: Leaderboard Backend + Frontend

**Files:**
- Create: `backend/src/controllers/leaderboard.controllers.ts`
- Create: `backend/src/services/leaderboard.service.ts`
- Create: `backend/src/routes/leaderboard.routes.ts`
- Modify: `backend/src/routes/root.routes.ts`
- Create: `frontend/src/api-requests/leaderboard.requests.ts`
- Create: `frontend/src/types/leaderboard.ts`
- Modify: `frontend/src/pages/Leaderboard/index.tsx`

**Interfaces:**
- Consumes: `scoringService` from `~/services/scoring.service`, `awardService` from `~/services/award.service`, `awardRepository` from `~/repositories/award.repository`
- Produces: `LeaderboardApi` (default export), API endpoint at `/api/v1/leaderboard`

- [ ] **Step 1: Create leaderboard service**

Create `backend/src/services/leaderboard.service.ts`:

```typescript
import scoringService from '~/services/scoring.service';
import awardService from '~/services/award.service';

import type { RoleType } from '~/constants/enums';

class LeaderboardService {
  getLeaderboard = async (role: RoleType) => {
    const teamsWithScores = await scoringService.getTeams();
    const awards = await awardService.getAll();

    const rankings = [...teamsWithScores]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((team, index) => ({
        rank: index + 1,
        team: { id: team.id, name: team.name, concept: team.concept, color: team.color },
        judgeAvg: team.judgeAvg,
        btcScore: team.btcScore,
        totalScore: team.totalScore,
      }));

    return { rankings, awards };
  };
}

export default new LeaderboardService();
```

- [ ] **Step 2: Create leaderboard controller**

Create `backend/src/controllers/leaderboard.controllers.ts`:

```typescript
import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import leaderboardService from '~/services/leaderboard.service';

import type { RoleType } from '~/constants/enums';

class LeaderboardController {
  getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await leaderboardService.getLeaderboard(req.role! as RoleType);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new LeaderboardController();
```

- [ ] **Step 3: Create leaderboard route and register**

Create `backend/src/routes/leaderboard.routes.ts`:

```typescript
import { Router } from 'express';

import leaderboardController from '~/controllers/leaderboard.controllers';
import { middlewareAuth } from '~/middlewares/auth.middlewares';

const leaderboardRouter = Router();

leaderboardRouter.get('/', middlewareAuth.auth, leaderboardController.getLeaderboard);

export default leaderboardRouter;
```

Update `backend/src/routes/root.routes.ts`:

```typescript
import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import votingRouter from '~/routes/voting.routes';
import scoringRouter from '~/routes/scoring.routes';
import awardRouter from '~/routes/award.routes';
import leaderboardRouter from '~/routes/leaderboard.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);
rootRouter.use('/scoring', scoringRouter);
rootRouter.use('/awards', awardRouter);
rootRouter.use('/leaderboard', leaderboardRouter);

export default rootRouter;
```

- [ ] **Step 4: Create frontend leaderboard types and API client**

Create `frontend/src/types/leaderboard.ts`:

```typescript
import type { AwardType } from '~/types/award';

export type TeamRanking = {
  rank: number;
  team: { id: string; name: string; concept: string; color: string };
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};

export type LeaderboardData = {
  rankings: TeamRanking[];
  awards: AwardType[];
};
```

Create `frontend/src/api-requests/leaderboard.requests.ts`:

```typescript
import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/auth';
import type { LeaderboardData } from '~/types/leaderboard';

class LeaderboardApi {
  static getLeaderboard = async () => {
    const response = await privateApi.get<ApiResponse<LeaderboardData>>('/leaderboard');
    return response.data;
  };
}

export default LeaderboardApi;
```

- [ ] **Step 5: Update Leaderboard page to use API**

Modify `frontend/src/pages/Leaderboard/index.tsx`:
- Remove all `localStorage` logic
- Use `useQuery` → `LeaderboardApi.getLeaderboard`
- Display team rankings table (rank, team name + color, avg score, total score)
- Display awards table (award name, winner name/team)
- Show loading state
- Keep the existing visual design patterns

- [ ] **Step 6: Commit**

```bash
git add backend/src/services/leaderboard.service.ts backend/src/controllers/leaderboard.controllers.ts backend/src/routes/leaderboard.routes.ts backend/src/routes/root.routes.ts frontend/src/types/leaderboard.ts frontend/src/api-requests/leaderboard.requests.ts frontend/src/pages/Leaderboard/index.tsx
git commit -m "feat: add leaderboard backend and connect frontend"
```

---

### Task 10: Socket.io Realtime — Backend Setup + Frontend Listener

**Files:**
- Create: `backend/src/configs/socket.ts`
- Modify: `backend/src/index.ts` (init socket)
- Modify: `backend/src/services/scoring.service.ts` (emit on save)
- Modify: `backend/src/services/award.service.ts` (emit on save)
- Create: `frontend/src/hooks/useSocket.ts`
- Modify: `frontend/src/pages/Leaderboard/index.tsx` (listen for updates)

**Interfaces:**
- Consumes: `http.Server` from Express app, `socket.io` library
- Produces: `getIO()` function from `~/configs/socket`, `useSocket` hook on frontend

- [ ] **Step 1: Create Socket.io backend config**

Create `backend/src/configs/socket.ts`:

```typescript
import { Server as SocketServer } from 'socket.io';

import type { Server as HttpServer } from 'http';

let io: SocketServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
```

- [ ] **Step 2: Initialize socket in Express app**

Modify `backend/src/index.ts` — add socket initialization:

```typescript
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';

import { env } from '~/configs/env';
import { initSocket } from '~/configs/socket';
import { defaultErrorHandler } from '~/middlewares/error.middlewares';
import rootRouter from '~/routes/root.routes';

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : env.CLIENT_URL,
    credentials: true,
  }),
);

app.use('/api/v1', rootRouter);

app.use(defaultErrorHandler);

server.listen(env.PORT, () => {
  console.log(`✓ Server running on http://localhost:${env.PORT}`);
});
```

- [ ] **Step 3: Emit socket events from scoring service**

Add to `backend/src/services/scoring.service.ts` — after each save method, emit:

```typescript
import { getIO } from '~/configs/socket';

// In saveJudgeScores, after the upsert:
getIO().emit('scores:updated', { teamId, type: 'judge' });

// In saveBtcScore, after the upsert:
getIO().emit('scores:updated', { teamId, type: 'btc' });
```

- [ ] **Step 4: Emit socket events from award service**

Add to `backend/src/services/award.service.ts` — after each update:

```typescript
import { getIO } from '~/configs/socket';

// In updateAward, after the DB update:
const updated = await awardRepository.findById(awardId);
getIO().emit('awards:updated', { awardId, award: updated });
return updated;

// In autoCalculate, after all updates:
getIO().emit('awards:updated', { type: 'auto-calculate' });
```

- [ ] **Step 5: Create frontend socket hook**

Create `frontend/src/hooks/useSocket.ts`:

```typescript
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

import type { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND;

const useSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('scores:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-teams'] });
    });

    socket.on('awards:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return socketRef.current;
};

export default useSocket;
```

- [ ] **Step 6: Wire socket into Leaderboard page**

Modify `frontend/src/pages/Leaderboard/index.tsx` — add `useSocket()` call at the top of the component:

```typescript
import useSocket from '~/hooks/useSocket';

const Leaderboard = () => {
  useSocket();
  // ... rest of component
};
```

Also add `useSocket()` to Dashboard, Scoring, and Awards pages so all pages receive realtime updates.

- [ ] **Step 7: Install socket.io if not present**

Check `backend/package.json` for `socket.io` dependency. If missing:

```bash
cd backend && npm install socket.io
```

Check `frontend/package.json` for `socket.io-client`. If missing:

```bash
cd frontend && npm install socket.io-client
```

- [ ] **Step 8: Commit**

```bash
git add backend/src/configs/socket.ts backend/src/index.ts backend/src/services/scoring.service.ts backend/src/services/award.service.ts frontend/src/hooks/useSocket.ts frontend/src/pages/Leaderboard/index.tsx
git commit -m "feat: add Socket.io realtime for scores and awards updates"
```

---

### Task 11: Route Guards Cleanup + Final App.tsx

**Files:**
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: All page components, `ProtectedRoute`, `RoleType`
- Produces: Final routing configuration matching the permission matrix

- [ ] **Step 1: Update App.tsx with correct role guards**

The final `frontend/src/App.tsx` should enforce:

| Route | Roles |
|-------|-------|
| `/` | Public |
| `/login` | Public |
| `/dashboard` | MEMBER, BTC_FSTYLE |
| `/scoring` | ADMIN |
| `/awards` | ADMIN, BTC_FSTYLE |
| `/leaderboard` | ADMIN, BTC_FSTYLE, MC, MEMBER |

```typescript
import { BrowserRouter, Routes, Route } from 'react-router';

import { RoleType } from '~/constants/enums';
import ProtectedRoute from '~/layout/ProtectedRoute';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scoring from './pages/Scoring';
import Leaderboard from './pages/Leaderboard';
import Awards from './pages/Awards';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <>
              <Nav />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Voting — MEMBER + BTC_FSTYLE only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.MEMBER, RoleType.BTC_FSTYLE]} />}>
          <Route
            path="/dashboard"
            element={
              <>
                <Nav />
                <main>
                  <Dashboard />
                </main>
                <Footer />
              </>
            }
          />
        </Route>

        {/* Scoring — ADMIN only */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN]} />}>
          <Route
            path="/scoring"
            element={
              <>
                <Nav />
                <main>
                  <Scoring />
                </main>
                <Footer />
              </>
            }
          />
        </Route>

        {/* Awards — ADMIN + BTC_FSTYLE */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
          <Route
            path="/awards"
            element={
              <>
                <Nav />
                <main>
                  <Awards />
                </main>
                <Footer />
              </>
            }
          />
        </Route>

        {/* Leaderboard — all authenticated roles */}
        <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE, RoleType.MC, RoleType.MEMBER]} />}>
          <Route
            path="/leaderboard"
            element={
              <>
                <Nav />
                <main>
                  <Leaderboard />
                </main>
                <Footer />
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "feat: finalize route guards matching permission matrix"
```
