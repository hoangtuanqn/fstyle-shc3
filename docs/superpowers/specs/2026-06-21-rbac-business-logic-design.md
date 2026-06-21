# RBAC & Business Logic — Design Spec

Full role-based authorization and business logic implementation for HEATWAVE SHOWCASE #3: APOCALYPSE.

## Scope

- Full-stack: Backend APIs + Frontend integration
- Approach: Feature-by-feature vertical slices
- Features: Voting, Scoring, Awards, Leaderboard, Socket.io realtime

## Permission Matrix

| Action | MEMBER | MC | BTC_FSTYLE | ADMIN |
|--------|--------|----|------------|-------|
| Login/Logout | ✓ | ✓ | ✓ | ✓ |
| Vote Nỗ lực | ✓ (own team, max 2, no self) | ✗ | ✓ (all teams, max 2/team) | ✗ |
| Xem candidates vote | Own team only | ✗ | All teams | ✗ |
| Nhập điểm BGK | ✗ | ✗ | ✗ | ✓ (3 BGK × 4 teams) |
| Nhập điểm BTC | ✗ | ✗ | ✗ | ✓ |
| Nhập giải thưởng | ✗ | ✗ | ✓ (manual awards) | ✓ (all awards) |
| Xem leaderboard | ✓ | ✓ | ✓ | ✓ |
| Xem thống kê điểm | ✗ | ✗ | ✗ | ✓ |
| Realtime updates | ✓ (receive) | ✓ (receive) | ✓ (receive) | ✓ (receive + trigger) |

---

## Feature 1: Voting (Giải Nỗ lực)

### Backend API

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/v1/voting/candidates` | ✓ | MEMBER, BTC_FSTYLE | Get votable candidates. MEMBER: own team only. BTC_FSTYLE: all teams grouped. |
| GET | `/api/v1/voting/my-votes` | ✓ | MEMBER, BTC_FSTYLE | Get current user's active votes |
| POST | `/api/v1/voting/vote` | ✓ | MEMBER, BTC_FSTYLE | Cast vote for a candidate |
| DELETE | `/api/v1/voting/vote/:candidateId` | ✓ | MEMBER, BTC_FSTYLE | Remove a vote |

### Business Rules

1. **Time-gated**: 29/6/2026 00:00 → 3/7/2026 23:59 (reject outside window)
2. **MEMBER**:
   - See only members in own team (same `teamId`)
   - Max 2 votes total (2 different people)
   - Cannot vote for self (`voterId !== candidateId`)
   - Can change votes within period (remove + re-vote)
3. **BTC_FSTYLE**:
   - See all 4 teams
   - Max 2 votes per team
   - Can change votes within period

### Backend Layers

- **Route**: `voting.routes.ts` — auth + isRole([MEMBER, BTC_FSTYLE]) + validate
- **Controller**: `voting.controllers.ts` — extract userId/role from req, call service
- **Service**: `voting.service.ts` — enforce all business rules, throw ErrorWithStatus on violation
- **Repository**: `voting.repository.ts` — Drizzle queries on `effortVotes` table
- **Zod Schema**: `voting.schema.ts` — validate `{ candidateId: string }`

### Frontend Integration

- **API Client**: `voting.requests.ts` — VotingApi class with static methods
- **Dashboard page**: Replace mock data with `useQuery` → VotingApi.getCandidates
- **Vote state**: `useQuery` for my-votes, `useMutation` for vote/unvote
- **UI**: MEMBER sees own team list; BTC_FSTYLE sees tabs per team

### DB Table (exists)

```
effortVotes: id, voterId (FK users), candidateId (FK users), createdAt
Unique index: (voterId, candidateId)
```

---

## Feature 2: Scoring (Chấm điểm BGK)

### Backend API

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/v1/scoring/teams` | ✓ | ADMIN | All teams with current score summaries |
| GET | `/api/v1/scoring/teams/:teamId` | ✓ | ADMIN | Detailed scores for one team (3 BGK + BTC) |
| PUT | `/api/v1/scoring/judge-scores/:teamId` | ✓ | ADMIN | Upsert judge scores for a team |
| PUT | `/api/v1/scoring/btc-scores/:teamId` | ✓ | ADMIN | Upsert BTC discipline score |
| GET | `/api/v1/scoring/statistics` | ✓ | ADMIN | Full breakdown: all teams, all judges, averages |

### Business Rules

1. **Only ADMIN** can read/write scores
2. **Judge scores** (per team, per judge 1-3):
   - 5 criteria: ideaConcept, choreography, synchronization, performance, costume
   - Each criterion: 0-19 points
   - Max per judge per team: 95 points
3. **BTC score** (per team):
   - 1 criterion: discipline
   - Max: 5 points
4. **Total score** = average(judge1 + judge2 + judge3) + btcScore → max 100
5. **Upsert pattern**: insert if not exists, update if exists (unique on teamId+judgeNumber)
6. **Socket.io**: Emit `scores:updated` on every save

### Backend Layers

- **Route**: `scoring.routes.ts` — auth + isRole([ADMIN]) + validate
- **Controller**: `scoring.controllers.ts`
- **Service**: `scoring.service.ts` — validate score ranges, upsert, calculate averages, emit socket
- **Repository**: `scoring.repository.ts` — Drizzle queries on `judgeScores` + `btcScores`
- **Zod Schema**: `scoring.schema.ts` — validate score objects with min/max constraints

### Frontend Integration

- **API Client**: `scoring.requests.ts` — ScoringApi class
- **Scoring page**: Replace localStorage with API calls
- **Auto-save**: Debounced `useMutation` on input change + manual save button
- **Socket.io**: Listen `scores:updated` → invalidate query cache

### DB Tables (exist)

```
judgeScores: id, teamId, judgeNumber(1-3), ideaConcept, choreography, synchronization, performance, costume, createdAt, updatedAt
  Unique: (teamId, judgeNumber)

btcScores: id, teamId(unique), discipline, createdAt, updatedAt
```

---

## Feature 3: Awards (Giải thưởng)

### Backend API

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/v1/awards` | ✓ | ALL | Get all awards with current winners |
| PUT | `/api/v1/awards/:awardId` | ✓ | ADMIN, BTC_FSTYLE | Update award winner (manual awards) |
| POST | `/api/v1/awards/auto-calculate` | ✓ | ADMIN | Auto-calculate ranking awards from scores |

### Business Rules

1. **10 awards total** (seeded in DB):
   - Auto (1-3): Quán Quân, Á Quân, Khuyến khích — calculated from scores
   - Manual (4-9): Yêu thích, Kỹ thuật, Biên đạo, Trưởng nhóm, Phong cách, Nỗ lực
   - N/A (10): Tri ân Mentor — not in system
2. **Auto-calculate** (POST /auto-calculate):
   - Sort teams by total average score (desc)
   - Rank 1 → Quán Quân, Rank 2 → Á Quân, Rank 3-4 → Khuyến khích
   - Only ADMIN triggers
3. **Manual awards**:
   - ADMIN + BTC_FSTYLE can set winner (team or individual)
   - Winner can be a team (`winnerTeamId`) or individual (`winnerUserId` + `winnerName`)
4. **Socket.io**: Emit `awards:updated` on every change

### Backend Layers

- **Route**: `award.routes.ts`
- **Controller**: `award.controllers.ts`
- **Service**: `award.service.ts` — auto-calculation logic, winner assignment, emit socket
- **Repository**: `award.repository.ts` — Drizzle queries on `awards` table

### Frontend Integration

- **API Client**: `award.requests.ts` — AwardApi class
- **Awards page**: Replace localStorage with API calls
- **Role-based UI**: Both ADMIN and BTC_FSTYLE see award entry form
- **Socket.io**: Listen `awards:updated` → invalidate query cache

### DB Table (exists)

```
awards: id, name, type(AUTO/MANUAL), winnerType(TEAM/INDIVIDUAL), winnerTeamId, winnerUserId, winnerName, quantity, prize, displayOrder, createdAt, updatedAt
```

---

## Feature 4: Leaderboard

### Backend API

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/v1/leaderboard` | ✓ | ALL | Team rankings + all awards |

### Response Shape

```typescript
{
  rankings: [
    {
      team: { id, name, concept, color },
      avgScore: number,        // average of 3 judges + BTC
      judgeScores: [...],      // detail per judge (ADMIN only)
      btcScore: number,
      rank: number,
    }
  ],
  awards: [
    {
      id, name, type, winnerType,
      winnerTeam?: { id, name },
      winnerUser?: { id, name },
      winnerName?: string,
    }
  ]
}
```

### Business Rules

1. All logged-in users can view leaderboard
2. ADMIN sees extra `judgeScores` detail in rankings
3. Rankings sorted by avgScore descending
4. Awards show current winners (may be null if not yet assigned)

### Frontend Integration

- **API Client**: `leaderboard.requests.ts` — LeaderboardApi class
- **Leaderboard page**: Replace localStorage with useQuery
- **Socket.io**: Listen both `scores:updated` + `awards:updated` → refetch

---

## Feature 5: Socket.io Realtime

### Events

| Event | Direction | Trigger | Payload | Who receives |
|-------|-----------|---------|---------|--------------|
| `scores:updated` | Server → Client | Admin saves judge/BTC scores | `{ teamId, type: 'judge'|'btc' }` | All connected |
| `awards:updated` | Server → Client | Any award updated | `{ awardId, award }` | All connected |

### Implementation

- **Backend**: Import existing socket instance from `configs/socket.ts`
- **Emit**: In scoring.service and award.service after successful DB write
- **Frontend**: Socket hook connects on auth, listens events, invalidates React Query cache

---

## File List (New Files)

### Backend (8 new files)

```
backend/src/routes/voting.routes.ts
backend/src/routes/scoring.routes.ts
backend/src/routes/award.routes.ts
backend/src/routes/leaderboard.routes.ts
backend/src/controllers/voting.controllers.ts
backend/src/controllers/scoring.controllers.ts
backend/src/controllers/award.controllers.ts
backend/src/controllers/leaderboard.controllers.ts
backend/src/services/voting.service.ts
backend/src/services/scoring.service.ts
backend/src/services/award.service.ts
backend/src/services/leaderboard.service.ts
backend/src/repositories/voting.repository.ts
backend/src/repositories/scoring.repository.ts
backend/src/repositories/award.repository.ts
backend/src/schemas/voting.schema.ts
backend/src/schemas/scoring.schema.ts
backend/src/schemas/award.schema.ts
```

### Backend (modified)

```
backend/src/routes/root.routes.ts       — register new routers
backend/src/configs/socket.ts           — add emit helpers (if needed)
```

### Frontend (new)

```
frontend/src/api-requests/voting.requests.ts
frontend/src/api-requests/scoring.requests.ts
frontend/src/api-requests/award.requests.ts
frontend/src/api-requests/leaderboard.requests.ts
```

### Frontend (modified)

```
frontend/src/pages/Dashboard/index.tsx   — replace mock with API
frontend/src/pages/Scoring/index.tsx     — replace localStorage with API
frontend/src/pages/Awards/index.tsx      — replace localStorage with API
frontend/src/pages/Leaderboard/index.tsx — replace localStorage with API + socket
frontend/src/App.tsx                     — update ProtectedRoute roles if needed
```

---

## Implementation Order

1. **Voting** — backend vertical slice + frontend integration
2. **Scoring** — backend vertical slice + frontend integration
3. **Awards** — backend vertical slice + frontend integration
4. **Leaderboard** — backend API + frontend integration
5. **Socket.io** — wire into scoring + awards services, frontend listeners
