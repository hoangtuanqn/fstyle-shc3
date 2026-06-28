# Animated Award Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Real-time animated award reveal system — MC bấm nút trên `/leaderboard` → Socket.io broadcast → `/screen` (public) hiển thị animation cinematic từng giải theo tier.

**Architecture:** Backend thêm socket middleware xác thực JWT từ cookie, lưu `revealedAwardIds[]` in-memory, broadcast `award:revealed`. Frontend tạo trang `/screen` public (không Nav/Footer) nhận socket events và render animated overlay. MC button thêm vào `/leaderboard` hiện tại.

**Tech Stack:** Socket.io (existing), React 19, CSS keyframes animation, jsonwebtoken (existing), cookie-parser (existing).

## Global Constraints

- Auth dùng cookie `access_token` (không phải Authorization header)
- Socket connect dùng `withCredentials: true` (gửi cookie tự động)
- Chỉ role ADMIN và MC được emit `award:reveal`
- `/screen` public — không cần auth để xem, nhưng socket vẫn kết nối
- Không dùng thư viện animation bên ngoài — chỉ CSS keyframes
- Awards sắp xếp theo `displayOrder` từ backend
- In-memory state reset khi server restart (đúng với use case 1 đêm)
- Tất cả error messages tiếng Việt
- Không thay đổi DB schema

---

### Task 1: Backend — Socket middleware + award reveal handler

**Files:**
- Modify: `backend/src/configs/socket.ts`

**Interfaces:**
- Produces socket events:
  - `leaderboard:init` → `{ revealedAwardIds: string[] }`
  - `award:revealed` → `{ awardId: string, revealedAwardIds: string[] }`
- Consumes socket event:
  - `award:reveal` ← `{ awardId: string }` (chỉ ADMIN/MC)

- [ ] **Step 1: Cập nhật `backend/src/configs/socket.ts`**

Thay toàn bộ nội dung file:

```typescript
import cookie from 'cookie';
import type { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { RoleType, TokenType } from '~/constants/enums';
import { AlgoJwt } from '~/utils/jwt';
import { Helpers } from '~/utils/helpers';

let io: SocketServer;

// In-memory state — resets on server restart (sufficient for single-event use)
const revealedAwardIds: string[] = [];

export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Auth middleware — extracts role from cookie JWT, non-blocking (public viewers allowed)
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next();

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.access_token;
      if (!token) return next();

      const payload = await AlgoJwt.verifyToken(token);
      if (Helpers.isTypeToken(payload, TokenType.AccessToken)) {
        socket.data.userId = payload.userId;
        socket.data.role = payload.role;
      }
    } catch {
      // Invalid/expired token — still allow connection for public viewing
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id} role=${socket.data.role ?? 'guest'}`);

    // Send current reveal state to newly connected client
    socket.emit('leaderboard:init', { revealedAwardIds: [...revealedAwardIds] });

    socket.on('award:reveal', ({ awardId }: { awardId: string }) => {
      const role = socket.data.role as RoleType | undefined;
      if (role !== RoleType.ADMIN && role !== RoleType.MC) {
        socket.emit('award:reveal:error', { message: 'Bạn không có quyền thực hiện hành động này!' });
        return;
      }

      if (!awardId || typeof awardId !== 'string') {
        socket.emit('award:reveal:error', { message: 'awardId không hợp lệ!' });
        return;
      }

      if (revealedAwardIds.includes(awardId)) {
        socket.emit('award:reveal:error', { message: 'Giải này đã được công bố!' });
        return;
      }

      revealedAwardIds.push(awardId);
      io.emit('award:revealed', { awardId, revealedAwardIds: [...revealedAwardIds] });
      console.log(`✓ Award revealed: ${awardId} by ${socket.data.userId}`);
    });

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

- [ ] **Step 2: Cài package `cookie` (parse cookie header)**

```bash
cd backend && npm install cookie && npm install --save-dev @types/cookie
```

- [ ] **Step 3: Restart backend và verify logs**

```bash
npm run dev
```

Expected log khi client connect: `✓ Socket connected: <id> role=guest`
Expected log sau khi test emit (dùng browser console): `✓ Award revealed: <id>`

- [ ] **Step 4: Commit**

```bash
cd backend
git add src/configs/socket.ts package.json package-lock.json
git commit -m "feat(socket): add JWT auth middleware and award reveal handler"
```

---

### Task 2: Frontend — AwardOverlay component (5 animation tiers)

**Files:**
- Create: `frontend/src/pages/Screen/AwardOverlay.tsx`

**Interfaces:**
- Consumes: `AwardType` from `~/types/award`
- Props: `award: AwardType | null`, `onDismiss: () => void`
- Tier map function: `getAnimationTier(awardName: string): 1 | 2 | 3 | 4 | 5`

- [ ] **Step 1: Tạo `frontend/src/pages/Screen/AwardOverlay.tsx`**

```tsx
import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import type { AwardType } from '~/types/award';

type Tier = 1 | 2 | 3 | 4 | 5;

function getAnimationTier(name: string): Tier {
  const n = name.toLowerCase();
  if (n.includes('quán quân')) return 5;
  if (n.includes('á quân') || n.includes('khuyến khích')) return 4;
  if (n.includes('yêu thích')) return 3;
  if (n.includes('kỹ thuật') || n.includes('biên đạo') || n.includes('phong cách') || n.includes('trưởng nhóm')) return 2;
  return 1;
}

const TIER_COLORS: Record<Tier, { primary: string; glow: string; overlay: string }> = {
  1: { primary: '#ffffff', glow: 'rgba(255,255,255,0.3)', overlay: 'rgba(5,3,1,0.88)' },
  2: { primary: '#fb8c05', glow: 'rgba(251,140,5,0.5)', overlay: 'rgba(5,3,1,0.88)' },
  3: { primary: '#f472b6', glow: 'rgba(244,114,182,0.5)', overlay: 'rgba(10,2,8,0.9)' },
  4: { primary: '#c0c0c0', glow: 'rgba(192,192,192,0.6)', overlay: 'rgba(3,3,5,0.9)' },
  5: { primary: '#FEE622', glow: 'rgba(254,230,34,0.7)', overlay: 'rgba(2,1,0,0.92)' },
};

// Canvas-based confetti for tier 4+
const ConfettiCanvas = ({ tier }: { tier: Tier }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const GOLD = ['#FEE622', '#FFD700', '#fb8c05', '#fff5a0'];
    const SILVER = ['#e8e8e8', '#c0c0c0', '#a0a0a0', '#ffffff'];
    const colors = tier === 5 ? GOLD : SILVER;
    const count = tier === 5 ? 220 : 120;

    type Piece = { x: number; y: number; r: number; vx: number; vy: number; rot: number; drot: number; col: string; w: number; h: number };
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.5,
      r: 0,
      vx: (Math.random() - 0.5) * 3,
      vy: 1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      drot: (Math.random() - 0.5) * 0.15,
      col: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 4,
    }));

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.drot;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(rafId);
  }, [tier]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
    />
  );
};

type Props = { award: AwardType; onDismiss: () => void };

export const AwardOverlay = ({ award, onDismiss }: Props) => {
  const tier = getAnimationTier(award.name);
  const colors = TIER_COLORS[tier];
  const winnerNames = award.winners.map((w) => w.winnerName).filter(Boolean) as string[];

  // Auto-dismiss: tier 1-2 after 5s, tier 3-4 after 7s, tier 5 after 10s
  const dismissDelay = tier <= 2 ? 5000 : tier <= 4 ? 7000 : 10000;
  useEffect(() => {
    const t = setTimeout(onDismiss, dismissDelay);
    return () => clearTimeout(t);
  }, [dismissDelay, onDismiss]);

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.overlay,
    animation: tier >= 5 ? 'ao-flash .25s ease-out' : 'ao-fade .4s ease-out',
    textAlign: 'center',
    padding: '40px 24px',
    overflow: 'hidden',
  };

  const labelStyle: CSSProperties = {
    fontSize: 'clamp(12px, 1.5vw, 16px)',
    fontWeight: 800,
    letterSpacing: '.4em',
    textTransform: 'uppercase',
    color: colors.primary,
    opacity: 0.75,
    marginBottom: 16,
    animation: 'ao-up .5s .1s both',
  };

  const nameStyle: CSSProperties = {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(42px, 8vw, 96px)',
    lineHeight: 1,
    color: colors.primary,
    textShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
    letterSpacing: '.04em',
    animation: tier >= 5 ? 'ao-bang .6s .15s both' : tier >= 3 ? 'ao-scale .5s .2s both' : 'ao-up .5s .2s both',
    marginBottom: 28,
  };

  const dividerStyle: CSSProperties = {
    width: 80,
    height: 2,
    background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
    marginBottom: 28,
    animation: 'ao-up .4s .4s both',
  };

  const winnerStyle: CSSProperties = {
    fontFamily: "'Anton', sans-serif",
    fontSize: 'clamp(28px, 5vw, 64px)',
    color: '#ffffff',
    letterSpacing: '.03em',
    lineHeight: 1.2,
    animation: 'ao-up .5s .5s both',
    textShadow: tier >= 4 ? `0 0 30px ${colors.glow}` : 'none',
  };

  // Tier 5: extra glow ring behind text
  const glowRingStyle: CSSProperties =
    tier === 5
      ? {
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(254,230,34,.18) 0%, transparent 65%)`,
          pointerEvents: 'none',
          animation: 'ao-ring 1s .1s both',
        }
      : {};

  return (
    <>
      <style>{`
        @keyframes ao-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ao-flash { 0% { background: #fff } 30% { background: rgba(254,230,34,.4) } 100% { background: ${colors.overlay} } }
        @keyframes ao-up { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: none } }
        @keyframes ao-scale { from { opacity: 0; transform: scale(.6) } to { opacity: 1; transform: scale(1) } }
        @keyframes ao-bang { 0% { opacity: 0; transform: scale(2.5) } 40% { opacity: 1; transform: scale(.95) } 60% { transform: scale(1.04) } 100% { transform: scale(1) } }
        @keyframes ao-ring { from { opacity: 0; transform: scale(.3) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      <div style={overlayStyle} onClick={onDismiss} role="button" aria-label="Bỏ qua">
        {/* Confetti for tier 4+ */}
        {tier >= 4 && <ConfettiCanvas tier={tier} />}

        {/* Tier 5 glow ring */}
        {tier === 5 && <div style={glowRingStyle} />}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={labelStyle}>🏆 GIẢI THƯỞNG</p>
          <h2 style={nameStyle}>{award.name.toUpperCase()}</h2>
          <div style={dividerStyle} />
          {winnerNames.length === 1 && <p style={winnerStyle}>{winnerNames[0]}</p>}
          {winnerNames.length >= 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {winnerNames.map((name, i) => (
                <p key={i} style={{ ...winnerStyle, fontSize: 'clamp(22px, 3.5vw, 48px)', animationDelay: `${0.5 + i * 0.12}s` }}>
                  {name}
                </p>
              ))}
            </div>
          )}
          {tier === 5 && (
            <p style={{ marginTop: 24, fontSize: 'clamp(10px, 1.2vw, 14px)', letterSpacing: '.3em', color: 'rgba(254,230,34,.5)', animation: 'ao-up .5s 1s both' }}>
              HEATWAVE SHOWCASE #3 · APOCALYPSE
            </p>
          )}
        </div>
      </div>
    </>
  );
};
```

- [ ] **Step 2: Commit**

```bash
cd frontend
git add src/pages/Screen/AwardOverlay.tsx
git commit -m "feat(screen): add AwardOverlay component with 5 animation tiers"
```

---

### Task 3: Frontend — `/screen` public display page

**Files:**
- Create: `frontend/src/pages/Screen/index.tsx`

**Interfaces:**
- Consumes:
  - `AwardOverlay` from `./AwardOverlay`
  - `AwardType` from `~/types/award`
  - `TeamRanking` from `~/types/leaderboard`
  - `LeaderboardApi.getLeaderboard` from `~/api-requests/leaderboard.requests`
  - Socket events: `leaderboard:init`, `award:revealed`, `scores:updated`, `awards:updated`

- [ ] **Step 1: Tạo `frontend/src/pages/Screen/index.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import LeaderboardApi from '~/api-requests/leaderboard.requests';
import type { AwardType } from '~/types/award';
import type { TeamRanking } from '~/types/leaderboard';
import { AwardOverlay } from './AwardOverlay';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const thS: CSSProperties = {
  padding: '16px 20px',
  textAlign: 'left',
  fontWeight: 800,
  fontSize: 11,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: 'var(--orange)',
  borderBottom: '2px solid rgba(251,140,5,.25)',
  whiteSpace: 'nowrap',
};
const tdS: CSSProperties = {
  padding: '18px 20px',
  color: 'var(--text)',
  borderBottom: '1px solid rgba(255,255,255,.06)',
  verticalAlign: 'middle',
};

const Screen = () => {
  const queryClient = useQueryClient();
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [overlayAward, setOverlayAward] = useState<AwardType | null>(null);

  const { data } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: LeaderboardApi.getLeaderboard,
    refetchInterval: 30_000,
  });

  const rankings: TeamRanking[] = data?.result?.rankings ?? [];
  const awards: AwardType[] = data?.result?.awards ?? [];
  const visibleRankings = rankings.filter((r) => r.totalScore > 0);
  const revealedAwards = awards
    .filter((a) => revealedIds.includes(a.id))
    .sort((a, b) => revealedIds.indexOf(a.id) - revealedIds.indexOf(b.id));

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('leaderboard:init', ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
    });

    socket.on('award:revealed', ({ awardId, revealedAwardIds }: { awardId: string; revealedAwardIds: string[] }) => {
      setRevealedIds(revealedAwardIds);
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      // Show overlay — wait for data refresh then find award
      setTimeout(() => {
        setOverlayAward((prev) => {
          // get latest data from queryClient cache
          const cached = queryClient.getQueryData<{ result: { awards: AwardType[] } }>(['leaderboard']);
          const found = cached?.result?.awards.find((a) => a.id === awardId) ?? null;
          return found ?? prev;
        });
      }, 400);
    });

    socket.on('scores:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    });

    socket.on('awards:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    });

    return () => { socket.disconnect(); };
  }, [queryClient]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'inherit' }}>
      {/* Header */}
      <section style={{ padding: '60px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,var(--orange))' }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.42em', textTransform: 'uppercase', color: 'var(--orange)' }}>
            LIVE RESULTS
          </span>
          <span style={{ width: 60, height: 1, background: 'linear-gradient(90deg,var(--orange),transparent)' }} />
        </div>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', letterSpacing: '.04em', margin: 0, lineHeight: 1 }}>
          BẢNG XẾP <em style={{ color: 'var(--orange)', fontStyle: 'italic' }}>HẠNG</em>
        </h1>
        <p style={{ marginTop: 10, fontSize: 13, color: 'var(--dim)', letterSpacing: '.1em' }}>
          HEATWAVE SHOWCASE #3 · APOCALYPSE
        </p>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Rankings */}
        <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,.08)', background: 'var(--bg2)', marginBottom: 40 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                <th style={{ ...thS, width: '8%' }}>Rank</th>
                <th style={thS}>Đội</th>
                <th style={{ ...thS, textAlign: 'right' }}>Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {visibleRankings.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ ...tdS, textAlign: 'center', color: 'var(--dim)', padding: 32 }}>
                    Chưa có thông tin kết quả
                  </td>
                </tr>
              )}
              {visibleRankings.map((row) => {
                const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
                const isFirst = row.rank === 1;
                const isTop3 = row.rank <= 3;
                return (
                  <tr key={row.team.id} style={{ transition: 'background .2s' }}>
                    <td style={{ ...tdS, fontWeight: 900, fontSize: 22, color: isTop3 ? 'var(--orange)' : 'var(--dim)' }}>
                      {medals[row.rank] ?? `#${row.rank}`}
                    </td>
                    <td style={tdS}>
                      <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 22, letterSpacing: '.03em', color: isFirst ? 'var(--orange)' : 'var(--text)' }}>
                        {row.team.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 3 }}>{row.team.concept}</div>
                    </td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: "'Anton', sans-serif", fontSize: isFirst ? 28 : 22, color: isFirst ? 'var(--orange)' : 'var(--text)' }}>
                      {row.totalScore.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Revealed Awards */}
        {revealedAwards.length > 0 && (
          <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,.08)', background: 'var(--bg2)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(251,140,5,.06)' }}>
                  <th style={{ ...thS, width: '40%' }}>Giải</th>
                  <th style={thS}>Tên đội / Người nhận</th>
                </tr>
              </thead>
              <tbody>
                {revealedAwards.map((award, idx) => {
                  const names = award.winners.map((w) => w.winnerName).filter(Boolean) as string[];
                  return (
                    <tr key={award.id} style={{ animation: `ao-up .5s ${idx * 0.07}s both` }}>
                      <td style={{ ...tdS, fontWeight: 700, fontSize: 16 }}>{award.name}</td>
                      <td style={tdS}>
                        {names.length === 1 && (
                          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 20, letterSpacing: '.03em' }}>{names[0]}</span>
                        )}
                        {names.length >= 2 && (
                          <ol style={{ margin: 0, paddingLeft: 20 }}>
                            {names.map((n, i) => (
                              <li key={i} style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, marginBottom: i < names.length - 1 ? 4 : 0 }}>{n}</li>
                            ))}
                          </ol>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Award reveal overlay */}
      {overlayAward && <AwardOverlay award={overlayAward} onDismiss={() => setOverlayAward(null)} />}

      <style>{`
        @keyframes ao-up { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
};

export default Screen;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Screen/index.tsx
git commit -m "feat(screen): add public display page with real-time socket"
```

---

### Task 4: Frontend — Route + MC button on `/leaderboard`

**Files:**
- Modify: `frontend/src/routes/index.tsx`
- Modify: `frontend/src/pages/Leaderboard/index.tsx`
- Modify: `frontend/src/hooks/useSocket.ts`

**Interfaces:**
- `useSocket` hiện tại trả về `socketRef.current` (Socket | null) — dùng để emit

- [ ] **Step 1: Thêm `/screen` route vào `frontend/src/routes/index.tsx`**

Thêm import ở đầu file:
```tsx
import Screen from '~/pages/Screen';
```

Thêm route public (không cần layout, không cần auth) — đặt TRƯỚC các route khác:
```tsx
{/* Public screen display — no auth, no layout */}
<Route path="/screen" element={<Screen />} />
```

Full file sau khi sửa:
```tsx
import { Route } from 'react-router';

import { RoleType } from '~/constants/enums';
import MainLayout from '~/layout/MainLayout';
import ProtectedRoute from '~/layout/ProtectedRoute';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import Scoring from '~/pages/Scoring';
import Leaderboard from '~/pages/Leaderboard';
import VotingLeaderboard from '~/pages/VotingLeaderboard';
import Awards from '~/pages/Awards';
import Screen from '~/pages/Screen';

export const AppRoutes = () => (
  <>
    {/* Public screen display — no auth, no layout */}
    <Route path="/screen" element={<Screen />} />

    {/* Public */}
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
    </Route>
    <Route path="/login" element={<Login />} />

    {/* Members + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.MEMBER, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Route>

    {/* Admin + MC */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.MC]} />}>
      <Route element={<MainLayout />}>
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Route>

    {/* Admin + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/voting-leaderboard" element={<VotingLeaderboard />} />
      </Route>
    </Route>

    {/* Admin + BTC FStyle */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN, RoleType.BTC_FSTYLE]} />}>
      <Route element={<MainLayout />}>
        <Route path="/awards" element={<Awards />} />
      </Route>
    </Route>

    {/* Admin only */}
    <Route element={<ProtectedRoute roleAccess={[RoleType.ADMIN]} />}>
      <Route element={<MainLayout />}>
        <Route path="/scoring" element={<Scoring />} />
      </Route>
    </Route>
  </>
);
```

- [ ] **Step 2: Cập nhật `frontend/src/hooks/useSocket.ts` để trả về socket instance**

```typescript
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

import type { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND as string;

const useSocket = () => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on('scores:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-teams'] });
      queryClient.invalidateQueries({ queryKey: ['scoring-team-scores'] });
    });

    socket.on('awards:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['awards'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return socketRef;
};

export default useSocket;
```

> **Lưu ý:** `useSocket` giờ trả về `socketRef` (Ref object) thay vì `socketRef.current` để tránh stale closure khi emit. Tất cả nơi dùng `useSocket()` cần check `socketRef.current?....` thay vì `socket?....`.

- [ ] **Step 3: Kiểm tra các file dùng useSocket, cập nhật nếu cần**

Chạy:
```bash
grep -r "useSocket" frontend/src --include="*.tsx" --include="*.ts" -l
```

Với mỗi file sử dụng `useSocket`, thay `const socket = useSocket()` thành `const socketRef = useSocket()` và dùng `socketRef.current` khi cần emit (nếu có).

- [ ] **Step 4: Thêm MC control button vào `frontend/src/pages/Leaderboard/index.tsx`**

Thêm các imports sau vào đầu file (sau các import hiện có):
```tsx
import { useRef, useState, useCallback } from 'react';
import useAuth from '~/hooks/useAuth';
import { RoleType } from '~/constants/enums';
```

Thay `useSocket()` call hiện tại:
```tsx
// Cũ:
useSocket();
// Mới:
const socketRef = useSocket();
```

Thêm state và logic MC button sau dòng `const awards = data?.result?.awards ?? [];`:
```tsx
const { user } = useAuth();
const isMC = user?.role === RoleType.ADMIN || user?.role === RoleType.MC;

// Awards sorted by displayOrder — determines reveal sequence
const sortedAwards = [...(data?.result?.awards ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
const [revealedIds, setRevealedIds] = useState<string[]>([]);
const [isRevealing, setIsRevealing] = useState(false);

// Sync revealedIds from leaderboard:init socket event
useEffect(() => {
  const socket = socketRef.current;
  if (!socket) return;
  const handler = ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
    setRevealedIds(revealedAwardIds);
  };
  socket.on('leaderboard:init', handler);
  socket.on('award:revealed', ({ revealedAwardIds }: { revealedAwardIds: string[] }) => {
    setRevealedIds(revealedAwardIds);
  });
  return () => {
    socket.off('leaderboard:init', handler);
  };
}, [socketRef]);

const nextAward = sortedAwards.find((a) => !revealedIds.includes(a.id));

const handleReveal = useCallback(() => {
  if (!nextAward || isRevealing) return;
  setIsRevealing(true);
  socketRef.current?.emit('award:reveal', { awardId: nextAward.id });
  setTimeout(() => setIsRevealing(false), 1000);
}, [nextAward, isRevealing, socketRef]);
```

Thêm MC control section vào cuối JSX (trước `<style>` tag):
```tsx
{isMC && (
  <section style={{ paddingBottom: 40, paddingTop: 8 }}>
    <div className="con" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid rgba(251,140,5,.25)',
          borderRadius: 14,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em', color: 'var(--orange)', textTransform: 'uppercase', margin: 0 }}>
          MC Control
        </p>
        {nextAward ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--dim)', margin: 0 }}>
              Giải tiếp theo: <strong style={{ color: 'var(--text)' }}>{nextAward.name}</strong>
            </p>
            <button
              onClick={handleReveal}
              disabled={isRevealing}
              style={{
                padding: '14px 24px',
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '.05em',
                background: isRevealing ? 'rgba(251,140,5,.3)' : 'var(--orange)',
                color: '#000',
                border: 'none',
                borderRadius: 10,
                cursor: isRevealing ? 'not-allowed' : 'pointer',
                transition: 'all .2s',
              }}
            >
              {isRevealing ? '⏳ Đang công bố...' : `🏆 Công bố: ${nextAward.name}`}
            </button>
          </>
        ) : (
          <p style={{ fontSize: 14, color: 'var(--dim)', margin: 0 }}>
            ✅ Đã công bố tất cả giải thưởng
          </p>
        )}
        <p style={{ fontSize: 12, color: 'var(--dim)', margin: 0 }}>
          {revealedIds.length}/{sortedAwards.length} giải đã công bố
        </p>
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 5: Kiểm tra `useAuth` hook trả về `user` với field `role`**

```bash
cat frontend/src/hooks/useAuth.ts
```

Nếu `useAuth()` không trả về `user.role`, điều chỉnh destructure cho phù hợp với codebase.

- [ ] **Step 6: Build check**

```bash
cd frontend && npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors. Fix bất kỳ type error nào trước khi commit.

- [ ] **Step 7: Commit**

```bash
git add src/routes/index.tsx src/hooks/useSocket.ts src/pages/Leaderboard/index.tsx
git commit -m "feat(leaderboard): add MC award reveal control button and /screen route"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|---|---|
| Socket JWT auth từ cookie | Task 1 |
| Chỉ ADMIN/MC được reveal | Task 1 |
| `leaderboard:init` khi connect | Task 1 |
| `award:revealed` broadcast | Task 1 |
| In-memory state | Task 1 |
| `/screen` public page | Task 3 |
| Landing-page visual style | Task 3 |
| 5 animation tiers | Task 2 |
| Tier 5 Quán Quân: gold explosion | Task 2 |
| Tier 4: confetti + shimmer | Task 2 |
| Auto-dismiss overlay | Task 2 |
| Rankings chỉ hiện score > 0 | Task 3 |
| MC button mobile-friendly | Task 4 |
| MC button hiện giải tiếp theo | Task 4 |
| `revealedIds` sync từ socket | Task 4 |
| `/screen` route public | Task 4 |
| No Nav/Footer trên /screen | Task 3 |

### Type consistency

- `AwardType` — dùng từ `~/types/award` (đã tồn tại) ✓
- `TeamRanking` — dùng từ `~/types/leaderboard` (đã tồn tại) ✓
- `revealedAwardIds: string[]` — consistent giữa backend và frontend ✓
- `socketRef` (Ref object) — trả về từ `useSocket`, dùng `.current` khi cần ✓
- `getAnimationTier` function defined trong Task 2, consumed trong Task 2 ✓

### Potential issues

1. `useAuth` hook — cần verify trả về `user.role`. Step 5 của Task 4 có hướng dẫn kiểm tra.
2. `award:revealed` event trong `/screen` dùng `setTimeout(400ms)` để đợi query cache update — có thể cần tăng nếu network chậm.
3. `useEffect` với `socketRef` dependency trong Leaderboard — socketRef là Ref object nên stable, không trigger re-render vô hạn.
