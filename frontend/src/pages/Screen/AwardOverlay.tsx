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

type ConfettiProps = { tier: Tier };

const ConfettiCanvas = ({ tier }: ConfettiProps) => {
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

    type Piece = { x: number; y: number; vx: number; vy: number; rot: number; drot: number; col: string; w: number; h: number };
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.5,
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
    cursor: 'pointer',
  };

  const glowRingStyle: CSSProperties =
    tier === 5
      ? {
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(254,230,34,.18) 0%, transparent 65%)',
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
        @keyframes ao-sub { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }
      `}</style>

      <div style={overlayStyle} onClick={onDismiss} role="button" aria-label="Bỏ qua">
        {tier >= 4 && <ConfettiCanvas tier={tier} />}
        {tier === 5 && <div style={glowRingStyle} />}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p
            style={{
              fontSize: 'clamp(12px, 1.5vw, 16px)',
              fontWeight: 800,
              letterSpacing: '.4em',
              textTransform: 'uppercase',
              color: colors.primary,
              opacity: 0.75,
              marginBottom: 16,
              margin: '0 0 16px',
              animation: 'ao-up .5s .1s both',
            }}
          >
            🏆 GIẢI THƯỞNG
          </p>

          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(42px, 8vw, 96px)',
              lineHeight: 1,
              color: colors.primary,
              textShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
              letterSpacing: '.04em',
              animation: tier >= 5 ? 'ao-bang .6s .15s both' : tier >= 3 ? 'ao-scale .5s .2s both' : 'ao-up .5s .2s both',
              margin: '0 0 28px',
            }}
          >
            {award.name.toUpperCase()}
          </h2>

          <div
            style={{
              width: 80,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              margin: '0 auto 28px',
              animation: 'ao-up .4s .4s both',
            }}
          />

          {winnerNames.length === 1 && (
            <p
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: 'clamp(28px, 5vw, 64px)',
                color: '#ffffff',
                letterSpacing: '.03em',
                lineHeight: 1.2,
                animation: 'ao-up .5s .5s both',
                textShadow: tier >= 4 ? `0 0 30px ${colors.glow}` : 'none',
                margin: 0,
              }}
            >
              {winnerNames[0]}
            </p>
          )}

          {winnerNames.length >= 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {winnerNames.map((name, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 'clamp(22px, 3.5vw, 48px)',
                    color: '#ffffff',
                    letterSpacing: '.03em',
                    lineHeight: 1.2,
                    textShadow: tier >= 4 ? `0 0 30px ${colors.glow}` : 'none',
                    margin: 0,
                    animation: `ao-sub .5s ${0.5 + i * 0.12}s both`,
                  }}
                >
                  {name}
                </p>
              ))}
            </div>
          )}

          {tier === 5 && (
            <p
              style={{
                marginTop: 24,
                fontSize: 'clamp(10px, 1.2vw, 14px)',
                letterSpacing: '.3em',
                color: 'rgba(254,230,34,.5)',
                animation: 'ao-up .5s 1s both',
              }}
            >
              HEATWAVE SHOWCASE #3 · APOCALYPSE
            </p>
          )}
        </div>
      </div>
    </>
  );
};
