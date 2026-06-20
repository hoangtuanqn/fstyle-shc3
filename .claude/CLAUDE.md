# F-Style SHC3

F-Code recruitment system — Challenge 3 platform for F21 cohort. Full-stack monorepo with separate frontend and backend.

Reference repo: `hoangtuanqn/fcode-web-system-challenge-3`

## Project Structure

```
fstyle-shc3/
├── .claude/                    # Claude Code config & skills
├── .editorconfig               # Editor settings (2-space indent, LF, UTF-8)
├── .prettierrc                 # Prettier config (shared across monorepo)
├── .gitignore
├── docker-compose.yml          # MySQL 8 + phpMyAdmin + Redis 7
├── package.json                # Root workspace (Prettier plugins only)
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json           # strict, path alias ~/*, CommonJS target
│   ├── nodemon.json            # tsx runner, watches src + .env
│   ├── prisma/
│   │   ├── schema.prisma       # MySQL models
│   │   └── migrations/
│   └── src/
│       ├── index.ts            # Express app entry
│       ├── configs/            # env, prisma, redis, socket
│       ├── constants/          # enums, httpStatus, barems
│       ├── controllers/        # Request handlers (*.controllers.ts)
│       ├── services/           # Business logic (*.service.ts)
│       ├── repositories/       # Data access layer (*.repository.ts)
│       ├── routes/             # Express routers (*.routes.ts)
│       ├── middlewares/        # auth, error, success handlers
│       ├── schemas/            # Zod validation schemas
│       ├── rules/              # Auth rules & request validation
│       ├── queues/             # BullMQ job queues
│       ├── workers/            # Background job processors
│       ├── seeders/            # DB seed data
│       └── utils/              # Helpers (crypto, JWT, etc.)
│
└── frontend/
    ├── .env.development        # VITE_API_BACKEND_API, VITE_API_BACKEND
    ├── .env.production
    ├── package.json
    ├── tsconfig.json           # strict, path alias ~/*
    ├── tsconfig.app.json       # ES2022 target, react-jsx
    ├── tsconfig.node.json      # ES2023 for Vite config
    ├── vite.config.ts          # React + Tailwind + path alias
    ├── eslint.config.js        # Flat config: JS + TS + React Hooks + Refresh
    ├── components.json         # shadcn/ui: new-york style, lucide icons
    └── src/
        ├── main.tsx            # App entry
        ├── App.tsx             # Root routing
        ├── api-requests/       # API client classes (*.requests.ts)
        ├── assets/             # Images, SVGs
        ├── components/         # Shared components
        │   ├── Header/         # Nav variants (Admin, Candidate)
        │   ├── ui/             # shadcn/ui components
        │   └── ...             # Badge, Breadcrumb, Footer, Loading, etc.
        ├── constants/          # Enums, app constants
        ├── data/               # Static JSON data
        ├── features/           # Redux slices (userSlice, etc.)
        ├── hooks/              # Custom hooks (useAuth, useRedux)
        ├── layout/             # Layout components (MainLayout, ProtectedRoute)
        ├── lib/                # Utilities (cn, utils)
        ├── pages/              # Route pages by role
        │   ├── Home/
        │   ├── Login/
        │   ├── Candidate/
        │   ├── Judge/          # Barem/, Room/
        │   ├── Mentor/         # Barem/
        │   ├── Admin/          # Candidates/, Users/, Rooms/, Reports/
        │   ├── Teams/
        │   ├── Submissions/
        │   └── Present/
        ├── store/              # Redux store config
        ├── styles/             # Global CSS (Tailwind)
        ├── types/              # TypeScript type definitions
        └── utils/              # Helpers (axiosInstance, localStorage)
```

## Tech Stack

### Frontend
- **React 19** + **React Router 7** — SPA with role-based routing
- **Vite 7** — build tool with React plugin + Babel React Compiler
- **TypeScript** — strict mode, path alias `~/*` → `src/*`
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin
- **shadcn/ui** — Radix UI primitives, new-york style, lucide icons
- **Redux Toolkit** — global state (user auth)
- **TanStack React Query** — server state & caching
- **Axios** — HTTP client with interceptors (auto Bearer token, refresh queue)
- **Socket.io-client** — real-time communication
- **Sonner** — toast notifications
- **driver.js** — user onboarding tours
- **clsx + tailwind-merge + cva** — conditional class utilities

### Backend
- **Express 5** — REST API framework
- **TypeScript** — strict mode, path alias `~/*` → `src/*`, CommonJS output
- **Prisma 6** — ORM with MySQL 8
- **Redis 7** — caching + token store
- **BullMQ** — background job queue (email, etc.)
- **Socket.io** — WebSocket server
- **JWT** (jsonwebtoken) + **bcrypt** — authentication
- **Zod** — request validation schemas
- **Nodemailer + Handlebars** — email templates
- **express-rate-limit** — rate limiting

### Infrastructure
- **Docker Compose**: MySQL 8 (port 3306), phpMyAdmin (port 8080), Redis 7 (port 6379)
- **No CI/CD pipelines** — manual deployment
- **No pre-commit hooks** — Prettier run manually

## Architecture

### Backend: 3-Layer + Routes

```
Request → Route → Middleware → Controller → Service → Repository → Prisma/DB
                                                                  ↓
Response ← Middleware (error/success) ← Controller ← Service ← Repository
```

- **Routes** define endpoints and chain middleware
- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Repositories** handle Prisma queries only
- **Middlewares** handle auth verification, error formatting, success wrapping

### Frontend: Pages + Redux + React Query

```
App.tsx (Router)
  → Layout (MainLayout, ProtectedRoute)
    → Page (role-specific)
      → Components (shared UI)
      → Hooks (useAuth, custom)
      → API Requests (Axios classes)
      → Redux Store (global auth state)
      → React Query (server state cache)
```

## Naming Conventions

### Files
| Location | Convention | Example |
|----------|-----------|---------|
| Backend controllers | `entity.controllers.ts` | `user.controllers.ts` |
| Backend services | `entity.service.ts` | `team.service.ts` |
| Backend repositories | `entity.repository.ts` | `judge.repository.ts` |
| Backend routes | `entity.routes.ts` | `auth.routes.ts` |
| Frontend pages | `PascalCase/index.tsx` | `Login/index.tsx` |
| Frontend components | `PascalCase.tsx` | `NavLink.tsx` |
| Frontend hooks | `camelCase.ts` | `useAuth.ts` |
| Frontend API | `entity.requests.ts` | `auth.requests.ts` |
| Frontend Redux | `entitySlice.ts` | `userSlice.ts` |
| shadcn/ui | `kebab-case.tsx` | `alert-dialog.tsx` |

### Code
- **Functions/variables**: camelCase — `handleSwitchRole`, `showUserMenu`
- **React components**: PascalCase — `Header`, `ProtectedRoute`
- **Types/interfaces**: PascalCase with suffix — `UserType`, `LoginInput`, `LoginResponse`
- **Enums**: PascalCase name, UPPER_CASE values — `RoleType.CANDIDATE`
- **Constants**: UPPER_CASE — `HTTP_STATUS`, `USER_ROLE`
- **Classes**: PascalCase — `AuthService`, `UserRepository`, `AlgoJwt`

### Imports order
1. External libs (`express`, `react`, `@tanstack/react-query`)
2. Internal configs (`~/configs/*`)
3. Constants (`~/constants/*`)
4. Repositories/Services (`~/repositories/*`, `~/services/*`)
5. Components (`~/components/*`)
6. Hooks (`~/hooks/*`)
7. Utils (`~/utils/*`)
8. Types (at end, `import type`)

## Code Patterns

### Backend route definition
```typescript
router.post('/login', validate(loginSchema), authController.login);
router.get('/get-info', middlewareAuth.auth, authController.getInfo);
router.put('/update', middlewareAuth.auth, isRole([RoleType.ADMIN]), adminController.update);
```

### Backend response format
```typescript
return res.status(HTTP_STATUS.OK).json(
  new ResponseClient({
    message: 'Đăng nhập thành công!',
    result: { ...user, access_token, refresh_token }
  })
);
```

### Backend error handling
```typescript
throw new ErrorWithStatus({
  message: 'Token không hợp lệ!',
  status: HTTP_STATUS.UNAUTHORIZED,
});
```

### Frontend API client class
```typescript
class AuthApi {
  static login = async ({ email, password, role }: LoginInput) => {
    const response = await privateApi.post<LoginResponse>('/auth/login', { email, password, role });
    return response?.data || [];
  };
}
```

### Frontend Redux slice
```typescript
export const getInfo = createAsyncThunk('user/getInfo', async () => {
  return await AuthApi.getInfo();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { setUser: (state, action) => { ... } },
  extraReducers: (builder) => {
    builder.addCase(getInfo.fulfilled, (state, action) => { ... });
  },
});
```

### Frontend Axios interceptor (auto refresh token)
```typescript
privateApi.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Frontend protected route
```typescript
<Route element={<ProtectedRoute allowedRoles={[RoleType.ADMIN]} />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

## Auth Flow

1. User logs in → backend returns `access_token` + `refresh_token`
2. Tokens stored in localStorage
3. Axios interceptor adds Bearer token to every request
4. On 401 → interceptor queues requests, calls refresh endpoint, retries
5. `ProtectedRoute` component checks user roles before rendering pages
6. Account activation via email link with Redis-stored token (TTL)

## Development

### Setup
```bash
# 1. Root
npm install

# 2. Infrastructure
docker compose up -d

# 3. Backend
cd backend
npm install
cp .env.example .env          # Edit with your values
npx prisma db push
npx prisma generate
npm run dev                    # http://localhost:8000

# 4. Frontend
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

### Environment variables
**Backend** (`.env`):
- `PORT=8000`
- `DATABASE_URL=mysql://root:challenge_3_fcode@localhost:3306/challenge_3_fcode`
- `JWT_SECURE` — JWT signing secret
- `REDIS_HOST=localhost`, `REDIS_PORT=6379`
- `CLIENT_URL=http://localhost:5173`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Gmail SMTP

**Frontend** (`.env.development`):
- `VITE_API_BACKEND_API=http://localhost:8000/api/v1`
- `VITE_API_BACKEND=http://localhost:8000`

### Scripts
| Script | Location | What it does |
|--------|----------|-------------|
| `npm run dev` | frontend | Start Vite dev server |
| `npm run build` | frontend | TypeScript check + Vite build |
| `npm run lint` | frontend | ESLint check |
| `npm run dev` | backend | Nodemon with tsx (auto-reload) |
| `npm run build` | backend | `tsc && tsc-alias` |
| `npm start` | backend | Production mode (`node dist/index.js`) |

### Path aliases
Both frontend and backend use `~/*` → `src/*`:
```typescript
import { RoleType } from '~/constants/enums';
import userRepository from '~/repositories/user.repository';
```

## Formatting

- **Prettier**: 120 char width, 2-space indent, single quotes, trailing commas, semicolons
- **Plugins**: `prettier-plugin-organize-imports`, `prettier-plugin-jsdoc`, `prettier-plugin-tailwindcss` (frontend)
- **EditorConfig**: 2 spaces, LF line endings, UTF-8, trim trailing whitespace

## User Roles

System supports 4 roles with role-based routing:
- **Admin** — full system access (manage candidates, users, rooms, reports)
- **Judge** — scoring interface (barem scoring, room assignments)
- **Mentor** — candidate guidance (barem scoring)
- **Candidate** — submissions, team management, profile

## Harness: Landing Page Builder

**Goal:** Build Heatwave SHC3 APOCALYPSE landing page with parallel sub-agents from TASK.md specs.

**Trigger:** Landing page build/rebuild requests → use `build-landing-page` skill. Simple questions about components → answer directly.

**Change Log:**
| Date | Change | Target | Reason |
|------|--------|--------|--------|
| 2026-06-20 | Initial build | All | New harness for landing page |
