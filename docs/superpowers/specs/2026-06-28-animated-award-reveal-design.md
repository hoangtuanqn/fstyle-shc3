# Animated Award Reveal System

**Date:** 2026-06-28
**Status:** Approved

## Overview

Hệ thống công bố giải thưởng real-time cho đêm Showcase. MC bấm nút trên điện thoại (trang `/leaderboard` đã auth) → Socket.io broadcast → trang `/screen` (public, chiếu lên màn hình lớn) hiển thị animation reveal từng giải.

## User Story

- MC đứng cầm điện thoại, mở `/leaderboard` (đã đăng nhập role MC/Admin)
- Màn hình lớn chiếu `/screen` (public, không cần auth)
- MC bấm "Công bố giải tiếp theo" → màn hình lớn animate reveal giải đó
- Mỗi lần bấm = reveal 1 giải theo thứ tự từ nhỏ → lớn
- Quán Quân là giải cuối, animation hoành tráng nhất

## Architecture

### Two Pages

| Page | Auth | Role |
|------|------|------|
| `/leaderboard` (existing) | Required | MC control — bảng xếp hạng + nút công bố |
| `/screen` (new) | None | Public display — chiếu lên màn hình lớn |

### Socket.io Event Flow

```
MC bấm nút
  → client emit: award:reveal { awardId }
  → server validate role (MC/Admin)
  → server lưu awardId vào revealedAwardIds[] (in-memory)
  → server broadcast: award:revealed { award, revealedAwardIds }

New client connects to /screen
  → server emit: leaderboard:init { rankings, awards, revealedAwardIds }
```

### Server State (in-memory)

```typescript
let revealedAwardIds: string[] = [];
```

Reset khi restart server. Đủ cho use case sự kiện 1 đêm.

## Pages

### `/screen` — Public Display

**Layout:** Full-width dark, font Anton, orange accent — consistent với landing page.

**Sections:**
1. Header: "LIVE RESULTS · BẢNG XẾP HẠNG" — particle effect nhẹ (reuse ParticleCanvas)
2. Rankings table — lớn hơn, đẹp hơn hiện tại, top 3 nổi bật
3. Awards section — chỉ hiện giải đã được reveal, animate vào khi xuất hiện

**Award reveal overlay:** Khi nhận `award:revealed` event:
- Fullscreen overlay đè lên toàn bộ trang
- Hiển thị tên giải + tên người/đội nhận
- Tự dismiss sau 6s
- Animation theo tier (xem bên dưới)

### `/leaderboard` — MC Control (existing, add button)

Thêm vào cuối trang (chỉ hiện với role MC/Admin):
- Nút lớn, mobile-friendly: `[🏆 Công bố: <tên giải tiếp theo> →]`
- Khi hết giải: disabled, text "Đã công bố tất cả giải"
- Không thêm gì khác — trang này giữ nguyên cấu trúc

## Animation Tiers

Thứ tự reveal: Tri ân Mentor → Nỗ lực → Kỹ thuật → Biên đạo → Phong cách → Trưởng nhóm → Yêu thích → Khuyến khích → Á Quân → **Quán Quân**

| Tier | Giải | Animation |
|------|------|-----------|
| 1 | Tri ân Mentor, Nỗ lực | Fade in + slide up từ dưới, overlay tối đơn giản |
| 2 | Kỹ thuật, Biên đạo, Phong cách, Trưởng nhóm | Scale in từ trung tâm + color glow pulse |
| 3 | Yêu thích | Sparkle burst hiệu ứng lửa/orange, flash nhẹ |
| 4 | Khuyến khích, Á Quân | Confetti rơi + shimmer (bronze/silver theo giải) |
| 5 | **Quán Quân** | Screen flash trắng → gold particle explosion toàn màn → text reveal dần với glow vàng chói |

Animation tier được map từ `award.name` trên frontend (không cần field mới ở backend).

## Backend Changes

### New Socket.io events

**`award:reveal`** (MC → server):
```typescript
socket.on('award:reveal', ({ awardId }) => {
  // validate user role from socket auth (JWT)
  // push to revealedAwardIds[]
  // broadcast award:revealed
});
```

**`award:revealed`** (server → all clients):
```typescript
io.emit('award:revealed', {
  award: AwardType,         // full award object với winners
  revealedAwardIds: string[]
});
```

**`leaderboard:init`** (server → new client on connect):
```typescript
socket.emit('leaderboard:init', {
  rankings: TeamRanking[],
  awards: AwardType[],
  revealedAwardIds: string[]
});
```

### No DB changes

State lưu in-memory, đủ cho sự kiện 1 đêm.

## Frontend Components

### New files
- `frontend/src/pages/Screen/index.tsx` — public display page
- `frontend/src/pages/Screen/AwardOverlay.tsx` — fullscreen reveal overlay với 5 animation tiers
- `frontend/src/pages/Screen/RankingsDisplay.tsx` — bảng xếp hạng đẹp cho màn hình lớn
- `frontend/src/pages/Screen/AwardsDisplay.tsx` — danh sách giải đã reveal

### Modified files
- `frontend/src/pages/Leaderboard/index.tsx` — thêm MC control button
- `frontend/src/hooks/useSocket.ts` — thêm handler cho `award:revealed`, `leaderboard:init`
- `frontend/src/App.tsx` — thêm route `/screen` (public, no ProtectedRoute)
- `backend/src/configs/socket.ts` — thêm event handlers

## Award Order

Thứ tự công bố (index trong mảng `awards` từ backend — server cần đảm bảo đúng thứ tự):

```
Tri ân Mentor → Nỗ lực → Kỹ thuật → Biên đạo → Phong cách
→ Trưởng nhóm → Yêu thích → Khuyến khích → Á Quân → Quán Quân
```

Frontend dùng `revealedAwardIds.length` để biết giải tiếp theo là gì (theo index trong mảng).

## Constraints

- Không dùng thư viện confetti bên ngoài — implement bằng CSS animation + canvas
- Animation toàn bằng CSS keyframes + inline style, không cần framer-motion
- `/screen` không cần auth, không render Nav header
- Socket auth: dùng JWT từ localStorage (giống useSocket hiện tại)
