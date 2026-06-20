# PROMPT CHO CLAUDE CODE
# Landing Page: Heatwave Showcase #3 APOCALYPSE — FStyle Crew (React + Vite)

---

Hãy build cho tôi một React landing page hoàn chỉnh cho sự kiện vũ đạo **Heatwave Showcase #3: APOCALYPSE** của CLB FStyle Crew — FPT University HCM. Trang chỉ giới thiệu sự kiện, **không có nút Đặt Vé**.

---

## SETUP

```bash
npm create vite@latest heatwave-shc3 -- --template react
cd heatwave-shc3
npm install
```

Sau khi giải nén file zip assets, copy nguyên thư mục vào:
```
public/
└── assets/
    ├── fonts/
    ├── images/
    └── pptx-images/
```

Dùng đường dẫn `/assets/...` trong `src=""` / `url()` (không import file ảnh).

---

## CẤU TRÚC FILE

```
src/
├── main.jsx
├── App.jsx
├── index.css            ← global tokens + reset + keyframes
├── components/
│   ├── Nav.jsx
│   ├── Hero.jsx
│   ├── ParticleCanvas.jsx
│   ├── MarqueeBand.jsx
│   ├── About.jsx
│   ├── Concept.jsx
│   ├── Teams.jsx
│   ├── FCode.jsx
│   ├── ShowcaseNight.jsx
│   ├── Timeline.jsx
│   ├── Partners.jsx
│   ├── Awards.jsx
│   ├── Club.jsx
│   └── Footer.jsx
└── hooks/
    ├── useCountdown.js
    └── useScrollReveal.js
```

---

## index.css — GLOBAL TOKENS + RESET

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');

@font-face {
  font-family: 'HuntersKPop';
  src: url('/assets/fonts/Hunters K-Pop.otf') format('opentype');
}
@font-face {
  font-family: 'Oracul';
  src: url('/assets/fonts/Oracul Decorative Regular.otf') format('opentype');
}
@font-face {
  font-family: 'Cinzel';
  src: url('/assets/fonts/Cinzel-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'Cinzel';
  src: url('/assets/fonts/Cinzel-Bold.ttf') format('truetype');
  font-weight: 700;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold: #FEE622;
  --orange: #FB8C05;
  --bg: #050301;
  --bg2: #0a0703;
  --bg3: #080502;
  --text: #f2ede0;
  --dim: rgba(242, 237, 224, 0.52);
  --shiro: #d0d0d0;
  --apex: #D04047;
  --slatt: #5973B3;
  --anti: #5EAF7C;
  --fcode: #2ecc71;
}

html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── Shared utilities ── */
.sec { padding: 100px 0; }
.con { max-width: 1200px; margin: 0 auto; padding: 0 56px; }

.ey {
  font-size: 10px; font-weight: 800; letter-spacing: .4em;
  color: var(--orange); text-transform: uppercase; margin-bottom: 14px;
  text-shadow: 0 0 16px rgba(251,140,5,.5); display: block;
}
.st {
  font-family: 'Anton', sans-serif;
  font-size: clamp(36px, 4.2vw, 62px);
  line-height: 1.03; letter-spacing: .02em;
}
.st em { color: var(--gold); font-style: normal; text-shadow: 0 0 30px rgba(254,230,34,.5); }

/* Scroll reveal */
.rv { opacity: 0; transform: translateY(36px); transition: opacity .9s, transform .9s; }
.rv.on { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: .1s; }
.d2 { transition-delay: .2s; }
.d3 { transition-delay: .3s; }
.d4 { transition-delay: .4s; }

/* ── Keyframes ── */
@keyframes hzoom {
  from { transform: scale(1); }
  to   { transform: scale(1.08); }
}
@keyframes fu {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ma {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes ab {
  0%,100% { transform: rotate(45deg) translate(0,0); }
  50%     { transform: rotate(45deg) translate(3px,3px); }
}
@keyframes cb {
  0%,100% { opacity: .5; }
  50%     { opacity: .12; }
}
@keyframes fs {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50%     { transform: translateY(-14px) rotate(6deg); }
}
@keyframes lp {
  0%,100% { filter: drop-shadow(0 0 40px rgba(254,230,34,.5)); }
  50%     { filter: drop-shadow(0 0 70px rgba(254,230,34,.9)); }
}
@keyframes fcpulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: .4; transform: scale(1.04); }
}

/* Responsive */
@media (max-width: 1024px) {
  .con { padding: 0 28px; }
}
```

---

## HOOKS

### `src/hooks/useCountdown.js`
```js
import { useState, useEffect } from 'react';

export function useCountdown(target) {
  const pad = n => String(n).padStart(2, '0');
  const calc = () => {
    const d = target - Date.now();
    if (d <= 0) return { days:'00', hours:'00', minutes:'00', seconds:'00' };
    return {
      days:    pad(Math.floor(d / 86400000)),
      hours:   pad(Math.floor((d % 86400000) / 3600000)),
      minutes: pad(Math.floor((d % 3600000) / 60000)),
      seconds: pad(Math.floor((d % 60000) / 1000)),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

### `src/hooks/useScrollReveal.js`
```js
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    const ob = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach(el => ob.observe(el));
    return () => ob.disconnect();
  }, []);
}
```

---

## COMPONENTS

### `Nav.jsx`
```jsx
// Fixed nav, transparent → scrolled (background + blur) khi scrollY > 60
// Style khi scrolled: background rgba(5,3,1,0.9), backdrop-filter blur(16px),
//                     border-bottom 1px solid rgba(254,230,34,.1)
// Left:  <img src="/assets/images/logo-ngang.png" height={30} />
// Center links: Sự Kiện · Concept · Đội Thi · F-Code · Đối Tác · CLB
//   → font-size 11px, weight 800, letter-spacing .18em, uppercase, color var(--dim)
//   → hover: color var(--gold)
//   → onClick: window.scrollTo({ top: document.getElementById(id).offsetTop - 68, behavior:'smooth' })
// Right: "05.07.2026" → font Anton, color var(--gold), text-shadow glow vàng
// useEffect: window.addEventListener('scroll', handler, { passive:true })
// QUAN TRỌNG: cleanup removeEventListener khi unmount
```

### `ParticleCanvas.jsx`
```jsx
// useRef(canvasRef), useEffect
// Tạo 110 particles, mỗi particle:
//   { x, y, r: 0.3+random*2.4, vx: (random-.5)*.38, vy: -(random*.75+.15),
//     life: random*maxLife, maxLife: 100+random*180,
//     col: random chọn từ ['#FEE622','#FB8C05','#fff5a0','#FFD700','#ff9800'] }
// Draw loop (requestAnimationFrame):
//   - clearRect toàn canvas
//   - Mỗi particle: x+=vx, y+=vy, life--
//   - alpha = (life/maxLife)*.8
//   - fillStyle = col + alpha hex (dùng Math.round(a*255).toString(16).padStart(2,'0'))
//   - vẽ arc
//   - nếu life<=0: reset particle về vị trí ngẫu nhiên ở bottom
// Resize: canvas.width = window.innerWidth, canvas.height = window.innerHeight
// Style canvas: position absolute, inset 0, pointerEvents none, zIndex 1
// CLEANUP: cancelAnimationFrame + removeEventListener resize
```

### `Hero.jsx`
```jsx
// position relative, width 100%, height 100vh, minHeight 740px, overflow hidden

// Background layers (position absolute, inset 0):
// Layer 1 — bggg.png:
//   background: url('/assets/images/bggg.png') center top / cover no-repeat
//   animation: hzoom 22s ease-in-out infinite alternate
//   filter: saturate(1.2) contrast(1.05)
//
// Layer 2 — vungtoi.png:
//   background: url('/assets/images/vungtoi.png') center bottom / cover no-repeat
//   opacity: 0.6
//
// Layer 3 — gradient overlay:
//   background: linear-gradient(to bottom,
//     rgba(5,3,1,.15) 0%, rgba(5,3,1,.02) 20%,
//     rgba(5,3,1,.12) 55%, rgba(5,3,1,.94) 100%)
//
// Layer 4 — <ParticleCanvas />

// Content (position relative, zIndex 10, flex column center, text-align center):

// 1. Eyebrow text: "FStyle Crew · Never Stop Trying!"
//    font-size 11px, weight 800, letter-spacing .42em, color var(--orange)
//    text-shadow: 0 0 20px rgba(251,140,5,.8)
//    animation: fu .9s .1s both

// 2. Logo APOCALYPSE:
//    <img src="/assets/images/apocalypse-gold.png" />  ← dùng bản vàng
//    width min(580px, 84vw)
//    filter: drop-shadow(0 0 60px rgba(254,230,34,.7)) drop-shadow(0 0 20px rgba(251,140,5,.5))
//    animation: fu 1s .3s both

// 3. Tagline (italic):
//    "The category is DANCE or APOCALYPSE"
//    font-size 14px, font-style italic, color rgba(242,237,224,.7)
//    animation: fu .9s .5s both

// 4. Meta bar (glassmorphism):
//    display flex, background rgba(0,0,0,.45), border 1px solid rgba(254,230,34,.28)
//    border-radius 12px, backdrop-filter blur(8px), overflow hidden
//    animation: fu .9s .7s both
//    3 ô ngăn bằng border-right: (Ngày | Địa điểm | Bắt đầu)
//    label: 9px, weight 800, letter-spacing .3em, color var(--orange), uppercase
//    value: font Anton, 17px, color var(--gold), text-shadow glow

// 5. Countdown:
//    const { days, hours, minutes, seconds } = useCountdown(new Date('2026-07-05T18:00:00+07:00'))
//    4 ô vuông (Ngày/Giờ/Phút/Giây), font Anton 40px, color var(--gold), glow vàng
//    Dấu ":" giữa các ô: animation cb 1s step-end infinite
//    animation: fu .9s .9s both

// 6. Scroll indicator (position absolute bottom 28px):
//    "Cuộn xuống" text nhỏ + mũi tên xoay 45deg
//    mũi tên: animation ab 2s ease-in-out infinite

// ASSET PATHS:
//   background hero: /assets/images/bggg.png
//   overlay:         /assets/images/vungtoi.png
//   logo APOCALYPSE: /assets/images/typography-apocalypse-gold.png
```

### `MarqueeBand.jsx`
```jsx
// height 52px, background var(--gold), overflow hidden
// Nội dung (lặp 2 lần để tạo vòng lặp):
//   NEVER STOP TRYING ✦ HEATWAVE SHOWCASE #3 ✦ APOCALYPSE ✦ 05·07·2026
//   ✦ FPT UNIVERSITY HCM ✦ HALL A ✦ 18:00 ✦ FSTYLE CREW ✦
// animation: ma 22s linear infinite
// Text: font Anton, 16px, color var(--bg)
// Dấu ✦: color var(--orange)
```

### `About.jsx`
```jsx
// background var(--bg)
// Grid 2 cột (1fr 1fr), gap 80px, align-items center

// CỘT TRÁI (scroll reveal .rv):
//   <span className="ey">Về Sự Kiện</span>
//   <h2 className="st">Heatwave Showcase <em>#3</em></h2>
//   3 đoạn text (font-size 16px, line-height 1.85, color var(--dim)):
//     P1: "Heatwave Showcase là sự kiện thường niên quy mô lớn nhất của FStyle Crew..."
//     P2: "Mùa 3 mang chủ đề APOCALYPSE — lấy cảm hứng từ Sách Khải Huyền..."
//     P3: "Sụp đổ không phải là kết thúc — mà là khởi đầu cho sự tái sinh."
//   3 info rows (icon SVG vàng + text):
//     📅 "Chủ Nhật, 05 tháng 07 năm 2026" / "Bắt đầu lúc 18:00"
//     📍 "Hall A – FPT University HCM Campus" / "Lô E2a-7, Đường D1, TP. Thủ Đức"
//     👥 "4 Đội Thi Tranh Tài" / "SHIRO KURO · Apex Aura · SLATT · ANTI"

// CỘT PHẢI (scroll reveal .rv .d2, position relative):
//   Decoration float trên phải: /assets/images/manh-vo.png (width 100px, opacity .9)
//     animation: fs 7s ease-in-out infinite
//   Ảnh chính: /assets/images/artboard1.png
//     border-radius 20px
//     box-shadow: 0 0 80px rgba(254,230,34,.2)
//     border: 1px solid rgba(254,230,34,.22)
//   Decoration float dưới trái: /assets/images/manhvo-do.png (width 90px, opacity .85)
//     animation: fs 9s 3s ease-in-out infinite
```

### `Concept.jsx`
```jsx
// background var(--bg2), text-align center, position relative, overflow hidden
// Background mờ: /assets/images/bggg.png, opacity .06, absolute inset 0

// Content:
//   <span className="ey">Concept · Khải Huyền</span>
//   Quote (font Anton, clamp(26px,3.8vw,52px)):
//     "The category is <em>DANCE</em> or <em>APOCALYPSE</em>"
//   Subtitle (16px, color var(--dim), max-width 720px, margin auto):
//     "Bốn đội thi hiện thân bốn Kỵ Sĩ Khải Huyền..."
//
//   Logo typography:
//     <img src="/assets/images/typography-banner-dark-tagline.png" />
//     width min(500px, 80vw), animation: lp 4s ease-in-out infinite
//
//   4 concept pills (border-radius 100px, inline-flex):
//     EMPTINESS   → color/border/bg var(--shiro)
//     AWAKENING   → color/border/bg var(--slatt)
//     INNER CONFLICT → color/border/bg var(--apex)
//     LETTING GO  → color/border/bg var(--anti)
//     Hover: translateY(-4px)
//
//   Revelation box (max-width 780px, margin auto):
//     border: 1px solid rgba(254,230,34,.2), background rgba(254,230,34,.04)
//     border-radius 16px, padding 28px 36px, text-align left
//     Title: "✦ NGUỒN CẢM HỨNG: BOOK OF REVELATION"
//     Text: giới thiệu Book of Revelation, Seven Seals, Four Horsemen of the Apocalypse
```

### `Teams.jsx`
```jsx
// background var(--bg3)
// <h2 className="st">Đội Thi <em>SHC3</em></h2>
// Grid 4 cột đều nhau, gap 20px

const teams = [
  {
    id: 'shiro',
    name: 'SHIRO KURO',
    concept: 'EMPTINESS',
    color: 'var(--shiro)',
    desc: 'Trống rỗng — khi mọi sắc màu tan biến, chỉ còn lại đen và trắng. Sự hư vô thuần khiết nhất.',
    image: '/assets/pptx-images/image10.png',   // ảnh photoshoot chính thức
    avatar: '/assets/images/avatar-emptiness.png', // avatar concept (vũ khí + typography)
    weapon: { img: '/assets/images/vuokhi-can.png', name: 'Cân Công Lý' },
    topBar: 'linear-gradient(90deg,#444,#ddd,#444)',
    glowColor: 'rgba(200,200,200,.25)',
    glowHover: 'rgba(200,200,200,.45)',
  },
  {
    id: 'apex',
    name: 'APEX AURA',
    concept: 'INNER CONFLICT',
    color: 'var(--apex)',
    desc: 'Mâu thuẫn nội tâm — ngọn lửa đỏ thiêu đốt từ bên trong. Cuộc chiến không hồi kết với chính mình.',
    image: '/assets/pptx-images/image11.png',
    avatar: '/assets/images/avatar-inner-conflict.png',
    weapon: { img: '/assets/images/vuokhi-kiem.png', name: 'Huyết Kiếm' },
    topBar: 'linear-gradient(90deg,#D04047,#ff9a9e,#D04047)',
    glowColor: 'rgba(208,64,71,.25)',
    glowHover: 'rgba(208,64,71,.5)',
  },
  {
    id: 'slatt',
    name: 'SLATT',
    concept: 'AWAKENING',
    color: 'var(--slatt)',
    desc: 'Thức tỉnh — ánh sáng xanh lam xuyên qua màn đêm hỗn loạn. Khoảnh khắc bừng sáng sau cơn mê.',
    image: '/assets/pptx-images/image9.png',
    avatar: '/assets/images/avatar-awakening.png',
    weapon: { img: '/assets/images/vuokhi-cung.png', name: 'Thần Cung' },
    topBar: 'linear-gradient(90deg,#5973B3,#a8baec,#5973B3)',
    glowColor: 'rgba(89,115,179,.25)',
    glowHover: 'rgba(89,115,179,.5)',
  },
  {
    id: 'anti',
    name: 'ANTI',
    concept: 'LETTING GO',
    color: 'var(--anti)',
    desc: 'Buông bỏ — sự giải phóng thanh thản nhất. Khi bạn chấp nhận và để mọi thứ trôi đi.',
    image: '/assets/pptx-images/image12.png',
    avatar: '/assets/images/avatar-letting-go.png',
    weapon: { img: '/assets/images/vuokhi-liem.png', name: 'Linh Liềm' },
    topBar: 'linear-gradient(90deg,#5EAF7C,#a8dbb9,#5EAF7C)',
    glowColor: 'rgba(94,175,124,.25)',
    glowHover: 'rgba(94,175,124,.5)',
  },
];

// MỖI CARD:
//   border-radius 18px, overflow hidden
//   border: 1px solid rgba(255,255,255,.08)
//   box-shadow luôn bật: 0 0 30px glowColor, 0 0 0 1px glowColor inset
//   hover: translateY(-10px), box-shadow mạnh hơn (glowHover)
//   transition: transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s
//
//   - Top accent bar: height 4px, background topBar
//   - Ảnh: aspect-ratio 3/4, objectFit cover, objectPosition 'center top'
//     hover: scale(1.04), transition .5s
//   - Content padding 22px 20px 26px:
//     - Concept label: 9px, weight 800, letter-spacing .28em, uppercase, màu team
//     - Tên đội: Anton, 26px, letter-spacing .04em
//     - Mô tả: 12.5px, color var(--dim), line-height 1.68
//     - Weapon row: flex, gap 12px, ảnh 52×52, label "Vũ khí" + tên vũ khí
//   KHÔNG hiển thị mã màu hex
```

### `FCode.jsx`
```jsx
// background var(--bg)
// Grid 2 cột: '280px 1fr', gap 72px, align-items center

// CỘT TRÁI (center, gap 16px):
//   Logo box: 152×152px, border-radius 20px, background white,
//             box-shadow 0 8px 36px rgba(0,0,0,.3)
//     <img src="/assets/pptx-images/image1.png" width={116} height={116} objectFit contain />
//   Tên: "F-CODE" — Anton 28px, color var(--text), letter-spacing .08em
//   Slogan: '"Code the dream"' — italic, 12px, color var(--dim)
//   Badge: "⚖️ Kiểm Toán Độc Lập"
//     border 1px solid rgba(46,204,113,.25), border-radius 100px
//     color rgba(46,204,113,.8), background rgba(46,204,113,.05)

// CỘT PHẢI:
//   <span className="ey">Đối Tác Công Nghệ</span>
//   <h2 className="st">CLB <em>F-Code</em></h2>
//   Mô tả: "CLB F-Code đóng vai trò đơn vị kiểm toán độc lập và cung cấp nền tảng công nghệ..."
//   3 feature rows (icon + title + desc):
//     🖥️  Nền tảng chấm điểm trực tuyến
//         "Hệ thống website cho phép Ban Giám Khảo nhập điểm trực tiếp trong thời gian thực."
//     🔒  Lưu trữ & bảo mật dữ liệu
//         "Toàn bộ dữ liệu đánh giá từ 03 BGK được mã hóa và lưu trữ an toàn."
//     ⚖️  Kiểm toán độc lập kết quả
//         "F-Code xác nhận và công bố kết quả cuối cùng, đảm bảo công bằng tuyệt đối."
//   Feature row style: flex, gap 16px, padding 16px 18px, border-radius 11px
//     border 1px solid rgba(255,255,255,.07), background rgba(255,255,255,.02)
//     hover: border-color rgba(46,204,113,.18)
//   Icon box: 36×36px, border-radius 9px,
//     background rgba(46,204,113,.09), border 1px solid rgba(46,204,113,.18)
```

### `ShowcaseNight.jsx`
```jsx
// background var(--bg2)
// Grid 2 cột (1fr 1fr), gap 64px, margin-top 52px

// CỘT TRÁI — Chương trình biểu diễn:
const performances = [
  { num:'01', name:'Earth Song', by:'Trần Ngọc Vi Lam · Top 18 Sing Out Loud 2026', tag:'Mở màn', tagColor:'var(--gold)', tagBg:'rgba(254,230,34,.1)' },
  { num:'02', name:'Tứ Kỵ Sĩ Khải Huyền', by:'SHIRO KURO · Emptiness', tag:'Team', teamColor:'var(--shiro)' },
  { num:'03', name:'Tứ Kỵ Sĩ Khải Huyền', by:'Apex Aura · Inner Conflict', tag:'Team', teamColor:'var(--apex)' },
  { num:'04', name:'Tứ Kỵ Sĩ Khải Huyền', by:'SLATT · Awakening', tag:'Team', teamColor:'var(--slatt)' },
  { num:'05', name:'Tứ Kỵ Sĩ Khải Huyền', by:'ANTI · Letting Go', tag:'Team', teamColor:'var(--anti)' },
  { num:'06', name:'Công Lý', by:'FStyle Crew · Performer', tag:'FStyle', tagColor:'var(--orange)', tagBg:'rgba(251,140,5,.08)' },
  { num:'07', name:'Special Guest Performance', by:'M Tú', tag:'★ Guest', tagColor:'var(--gold)', tagBg:'rgba(254,230,34,.1)' },
  { num:'08', name:'Sự Tĩnh Lặng Từ Thiên Đường', by:'Remix One Crew', tag:'Finale' },
];
// Mỗi row: padding 14px 18px, border-radius 12px
//   background rgba(255,255,255,.03), border 1px solid rgba(255,255,255,.07)
//   hover: border-color rgba(254,230,34,.2)

// CỘT PHẢI — Ban Giám Khảo:
const judges = [
  { name:'CHẤY', role:'Judge', crew:'C.O Crew', img:'/assets/pptx-images/image19.png' },
  { name:'BON',  role:'Judge', crew:'JustMove Crew', img:'/assets/pptx-images/image21.png' },
  { name:'M TÚ', role:'Special Guest', crew:'Performer', img:'/assets/pptx-images/image20.png' },
];
// Grid 3 cột, ảnh vuông aspect-ratio 1/1, grayscale(30%) → hover grayscale(0%)
// hover card: translateY(-6px)

// Box bình chọn (bên dưới judges):
//   border: 1px solid rgba(254,230,34,.15), background rgba(254,230,34,.05)
//   Giải "Team Được Yêu Thích Nhất" — 50% vote online
```

### `Timeline.jsx`
```jsx
// background var(--bg3)
// Vertical timeline, padding-left 36px
// Đường line: ::before position absolute left 0, top 0, bottom 0, width 2px
//   background linear-gradient(to bottom, var(--orange), var(--gold), transparent)

const events = [
  { date:'27/05/2026', name:'Thông Báo Mở Đơn Đăng Ký', desc:'Chính thức công bố SHC3 và mở đơn đăng ký.' },
  { date:'06/06/2026', name:'Information Day – Kick-Off', desc:'Các Team gặp BTC, nhận thông tin, thi concept.' },
  { date:'07/06/2026', name:'Concept Photoshooting Day', desc:'Chụp ảnh Team phục vụ Truyền thông.' },
  { date:'08·10·13/06/2026', name:'Sharing Sessions', desc:'3 buổi workshop với Chấy, Bon, Tường Milo.' },
  { date:'04/07/2026', name:'Tổng Duyệt Chương Trình', desc:'Chạy tổng duyệt tại Hall A, FPT University HCM.' },
  { date:'05/07/2026 · 18:00', name:'🔥 SHOWCASE NIGHT', desc:'Cháy hết mình tại Hall A. Công bố kết quả.', highlight: true },
];

// Mỗi item: position relative, margin-bottom 28px
//   Dot (::before): width 14px, height 14px, border-radius 50%
//     background var(--gold), box-shadow 0 0 14px rgba(254,230,34,.8)
//     position absolute, left -43px, top 6px
//   highlight item: dot lớn hơn (18px), tên màu var(--gold), text-shadow glow
//   Date: 11px, weight 800, letter-spacing .2em, color var(--orange), uppercase
//   Name: Anton 20px
//   Desc: 13px, color var(--dim), line-height 1.65
```

### `Partners.jsx`
```jsx
// background var(--bg2)
// Grid 4 cột, gap 20px

const partners = [
  {
    logo: '/assets/pptx-images/image1.png',
    name: 'F-Code',
    logoBg: 'white',
    role: 'Đối tác Công nghệ',
    roleColor: 'var(--fcode)',
    desc: 'Cung cấp nền tảng chấm điểm & Kiểm toán độc lập kết quả.',
    highlight: true, // border + glow xanh lá đặc biệt
    hoverGlow: 'rgba(46,204,113,.2)',
  },
  {
    logo: '/assets/pptx-images/image2.png',
    name: 'Cóc Sài Gòn',
    logoBg: '#FEE622',
    role: 'Truyền Thông & Hình Ảnh',
    roleColor: '#FEE622',
    desc: 'Phụ trách sản xuất hình ảnh, nhân sự & thiết bị quay/chụp.',
    hoverGlow: 'rgba(254,230,34,.15)',
  },
  {
    logo: '/assets/pptx-images/image3.png',
    name: 'FPT Event Club',
    logoBg: '#5b2d8a',
    role: 'Vận Hành Onsite',
    roleColor: '#b87de8',
    desc: 'Cung cấp nhân sự PG, hậu cần & điều phối toàn bộ sự kiện.',
    hoverGlow: 'rgba(120,60,180,.15)',
  },
  {
    logo: '/assets/pptx-images/image6.png',
    name: 'SiTi Group',
    logoBg: 'white',
    role: 'Cộng Đồng Tình Nguyện',
    roleColor: '#ff6090',
    desc: 'Cộng đồng Sinh viên Tình nguyện hỗ trợ vận hành sự kiện.',
    hoverGlow: 'rgba(255,80,120,.1)',
  },
];

// Mỗi card: border-radius 16px, background rgba(255,255,255,.03)
//   border 1px solid rgba(255,255,255,.07), padding 28px 20px 24px, text-align center
//   hover: translateY(-8px), box-shadow 0 16px 48px hoverGlow
// Logo wrapper: 100×100px, border-radius 50%, background logoBg, padding 6px, margin auto
// Logo img: object-fit contain, width 100%, height 100%
// highlight (F-Code): border-color rgba(46,204,113,.25), box-shadow 0 0 24px rgba(46,204,113,.1)
```

### `Awards.jsx`
```jsx
// background var(--bg2)
// --- 4 giải chính: grid 4 cột, gap 18px ---
const mainAwards = [
  { medal:'/assets/images/gold-medal.png',   rank:'QUÁN QUÂN',     prize:'1.500.000 VND', color:'#FEE622', borderColor:'rgba(254,230,34,.3)', condition:'Điểm TB cao nhất — 03 BGK' },
  { medal:'/assets/images/silver-medal.png', rank:'Á QUÂN',         prize:'1.000.000 VND', color:'#c0c0c0', borderColor:'rgba(192,192,192,.2)', condition:'Điểm TB cao nhì' },
  { medal:'/assets/images/bronze-medal.png', rank:'KHUYẾN KHÍCH',   prize:'500.000 VND × 2', color:'#cd7f32', borderColor:'rgba(205,127,50,.2)', condition:'Điểm TB cao ba' },
  { medal:'/assets/images/fragile.png',      rank:'YÊU THÍCH',      prize:'Bảng Khen', color:'var(--orange)', borderColor:'rgba(251,140,5,.2)', condition:'50% Vote Online + 50% Trực tiếp' },
];
// Card: border-radius 18px, padding 28px 20px 24px
//   background rgba(255,255,255,.03), border borderColor
//   hover: translateY(-10px), box-shadow glow

// --- 6 giải phụ: grid 3 cột ---
const subAwards = [
  { icon:'⚙️', name:'Kỹ Thuật',    qty:'01 giải', desc:'TB điểm Kỹ thuật cao nhất từ 03 BGK.' },
  { icon:'🎭', name:'Biên Đạo',    qty:'01 giải', desc:'TB điểm Biên dựng cao nhất từ 03 BGK.' },
  { icon:'👑', name:'Trưởng Nhóm', qty:'01 giải', desc:'Điểm quá trình cao nhất + BTC đánh giá.' },
  { icon:'✨', name:'Phong Cách',  qty:'01 giải', desc:'TB điểm Phục trang cao nhất từ 03 BGK.' },
  { icon:'🔥', name:'Nỗ Lực',     qty:'04 giải — Never Stop Trying!', desc:'Chuyên cần 30% + BTC 30% + thành viên vote 40%. Mỗi team 1 người.', highlight: true },
  { icon:'🙏', name:'Tri Ân Mentor', qty:'13 giải', desc:'Team Mentor tự động nhận quà từ Ban Tổ Chức.' },
];
// highlight (Nỗ Lực): border/bg vàng nhẹ
```

### `Club.jsx`
```jsx
// background var(--bg)
// Grid 2 cột (1fr 1fr), gap 80px

// CỘT TRÁI:
//   Logo: /assets/images/logo-chunhat.png, height 64px, margin-bottom 28px
//   <span className="ey">Câu Lạc Bộ</span>
//   <h2 className="st">FStyle <em>Crew</em></h2>
//   3 đoạn text mô tả CLB
//   Slogan badge:
//     "NEVER STOP TRYING !"
//     display inline-block, background var(--gold), color var(--bg)
//     font Anton, 17px, letter-spacing .12em, padding 14px 34px
//     border-radius 8px
//     box-shadow: 0 0 40px rgba(254,230,34,.5), 0 0 80px rgba(254,230,34,.15)
//     margin-top 36px

// CỘT PHẢI:
//   /assets/images/nhom-nguoi-bi-an.png
//   border-radius 20px, border 1px solid rgba(254,230,34,.15)
//   box-shadow 0 0 60px rgba(254,230,34,.1)
```

### `Footer.jsx`
```jsx
// background #030201, border-top 1px solid rgba(254,230,34,.1)
// padding 52px 0 28px

// TOP SECTION (flex, space-between):
//   Trái:
//     Logo /assets/images/logo-ngang.png, height 28px, opacity .9
//     4 dots màu team (8px, border-radius 50%):
//       var(--shiro) · var(--apex) · var(--slatt) · var(--anti)
//   Phải:
//     Tên: "Heatwave Showcase #3: APOCALYPSE" (Anton 18px, var(--gold), glow)
//     Chi tiết: "05 tháng 07 năm 2026 · 18:00 / Hall A, FPT University HCM Campus"
//     Slogan: "Never Stop Trying!" (11px, weight 800, var(--orange), uppercase)

// SPONSORS BAR:
//   Label: "Đơn vị tổ chức & đối tác" (9px, weight 800, letter-spacing .3em, color var(--dim))
//   <img src="/assets/images/logo-ngang.png" /> max-width 680px, opacity .55

// BOTTOM:
//   "© 2026 FStyle Crew · FPT University HCM Campus · All rights reserved"
//   (font-size 11px, color rgba(242,237,224,.22), text-align center)
//
//   "Phần mềm được phát triển bởi CLB F-Code"
//   (font-size 11px, color rgba(242,237,224,.18), text-align center, margin-top 6px)
```

---

## App.jsx

```jsx
import { useScrollReveal } from './hooks/useScrollReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import MarqueeBand from './components/MarqueeBand';
import About from './components/About';
import Concept from './components/Concept';
import Teams from './components/Teams';
import FCode from './components/FCode';
import ShowcaseNight from './components/ShowcaseNight';
import Timeline from './components/Timeline';
import Partners from './components/Partners';
import Awards from './components/Awards';
import Club from './components/Club';
import Footer from './components/Footer';

export default function App() {
  useScrollReveal(); // Init IntersectionObserver sau khi DOM render

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MarqueeBand />
        <About />
        <Concept />
        <Teams />
        <FCode />
        <ShowcaseNight />
        <Timeline />
        <Partners />
        <Awards />
        <Club />
      </main>
      <Footer />
    </>
  );
}
```

---

## ASSET PATH MAPPING (sau khi copy zip về public/)

| Dùng trong code | File gốc trong zip |
|---|---|
| `/assets/images/logo-ngang.png` | `images/logo-ngang.png` |
| `/assets/images/logo-chunhat.png` | `images/logo-chunhat.png` |
| `/assets/images/bggg.png` | `images/bggg.png` |
| `/assets/images/vungtoi.png` | `images/vungtoi.png` |
| `/assets/images/artboard1.png` | `images/artboard1.png` |
| `/assets/images/typography-apocalypse-gold.png` | `images/typography-apocalypse-gold.png` |
| `/assets/images/typography-banner-dark-tagline.png` | `images/typography-banner-dark-tagline.png` |
| `/assets/images/avatar-emptiness.png` | `images/avatar-emptiness.png` |
| `/assets/images/avatar-awakening.png` | `images/avatar-awakening.png` |
| `/assets/images/avatar-inner-conflict.png` | `images/avatar-inner-conflict.png` |
| `/assets/images/avatar-letting-go.png` | `images/avatar-letting-go.png` |
| `/assets/images/vuokhi-can.png` | `images/vuokhi-can.png` |
| `/assets/images/vuokhi-kiem.png` | `images/vuokhi-kiem.png` |
| `/assets/images/vuokhi-cung.png` | `images/vuokhi-cung.png` |
| `/assets/images/vuokhi-liem.png` | `images/vuokhi-liem.png` |
| `/assets/images/gold-medal.png` | `images/gold-medal.png` |
| `/assets/images/silver-medal.png` | `images/silver-medal.png` |
| `/assets/images/bronze-medal.png` | `images/bronze-medal.png` |
| `/assets/images/fragile.png` | `images/fragile.png` |
| `/assets/images/manh-vo.png` | `images/manh-vo.png` |
| `/assets/images/manhvo-do.png` | `images/manhvo-do.png` |
| `/assets/images/nhom-nguoi-bi-an.png` | `images/nhom-nguoi-bi-an.png` |
| `/assets/pptx-images/image1.png` | `pptx-images/image1.png` ← Logo F-Code |
| `/assets/pptx-images/image2.png` | `pptx-images/image2.png` ← Cóc Sài Gòn |
| `/assets/pptx-images/image3.png` | `pptx-images/image3.png` ← FPT Event Club |
| `/assets/pptx-images/image6.png` | `pptx-images/image6.png` ← SiTi Group |
| `/assets/pptx-images/image9.png` | `pptx-images/image9.png` ← SLATT team |
| `/assets/pptx-images/image10.png` | `pptx-images/image10.png` ← SHIRO KURO team |
| `/assets/pptx-images/image11.png` | `pptx-images/image11.png` ← APEX AURA team |
| `/assets/pptx-images/image12.png` | `pptx-images/image12.png` ← ANTI team |
| `/assets/pptx-images/image19.png` | `pptx-images/image19.png` ← BGK Chấy |
| `/assets/pptx-images/image20.png` | `pptx-images/image20.png` ← M Tú |
| `/assets/pptx-images/image21.png` | `pptx-images/image21.png` ← BGK Bon |
| `/assets/fonts/Hunters K-Pop.otf` | `fonts/Hunters K-Pop.otf` |
| `/assets/fonts/Oracul Decorative Regular.otf` | `fonts/Oracul Decorative Regular.otf` |
| `/assets/fonts/Cinzel-Regular.ttf` | `fonts/Cinzel-Regular.ttf` |
| `/assets/fonts/Cinzel-Bold.ttf` | `fonts/Cinzel-Bold.ttf` |

---

## RESPONSIVE BREAKPOINTS

```css
/* 1024px */
@media (max-width: 1024px) {
  .con { padding: 0 28px; }
  /* Tất cả grid 2 cột → 1 cột */
  /* Teams grid → 2 cột */
  /* Partners grid → 2 cột */
  /* Nav: ẩn menu links + date text */
}

/* 600px */
@media (max-width: 600px) {
  /* Teams → 1 cột */
  /* Partners → 1 cột */
  /* Hero meta bar → flex-direction column */
  /* Countdown → flex-wrap */
  /* Judges → 2 cột */
}
```

---

## LƯU Ý CUỐI

1. **KHÔNG có nút Đặt Vé** — thuần giới thiệu
2. Màu team **CHÍNH XÁC**: SHIRO #d0d0d0 · APEX #D04047 · SLATT #5973B3 · ANTI #5EAF7C
3. F-Code màu `#2ecc71` — dùng nhẹ, không màu mè
4. Ảnh team card: `objectPosition: 'center top'` để hiện mặt người
5. `useScrollReveal` phải gọi **sau** khi tất cả components đã render (trong App.jsx)
6. Cleanup tất cả: `cancelAnimationFrame`, `clearInterval`, `removeEventListener`
7. Particle canvas cần resize khi window thay đổi kích thước
