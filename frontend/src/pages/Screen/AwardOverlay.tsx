import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

import type { AwardType } from "~/types/award";

type Tier = 1 | 2 | 3 | 4 | 5;

function getAnimationTier(name: string): Tier {
  const n = name.toLowerCase();
  if (n.includes("quán quân")) return 5;
  if (n.includes("á quân") || n.includes("khuyến khích")) return 4;
  if (n.includes("yêu thích")) return 3;
  if (
    n.includes("kỹ thuật") ||
    n.includes("biên đạo") ||
    n.includes("phong cách") ||
    n.includes("trưởng nhóm")
  )
    return 2;
  return 1;
}

const TIER_COLORS: Record<
  Tier,
  { primary: string; glow: string; overlay: string }
> = {
  1: {
    primary: "#ffffff",
    glow: "rgba(255,255,255,0.35)",
    overlay: "rgba(4,3,2,0.92)",
  },
  2: {
    primary: "#fb8c05",
    glow: "rgba(251,140,5,0.55)",
    overlay: "rgba(5,3,1,0.92)",
  },
  3: {
    primary: "#f472b6",
    glow: "rgba(244,114,182,0.55)",
    overlay: "rgba(8,1,6,0.93)",
  },
  4: {
    primary: "#d4d4d4",
    glow: "rgba(212,212,212,0.55)",
    overlay: "rgba(3,3,5,0.93)",
  },
  5: {
    primary: "#FEE622",
    glow: "rgba(254,230,34,0.75)",
    overlay: "rgba(2,1,0,0.95)",
  },
};

/* Overlay entrances */
const OVERLAY_ANIM: Record<Tier, string> = {
  1: "ao-fade .4s ease-out",
  2: "ao-slide-up .5s cubic-bezier(.22,.68,0,1.2)",
  3: "ao-wipe .55s ease-out",
  4: "ao-silver-enter .55s ease-out forwards",
  5: "ao-champ .7s ease-out forwards",
};

/* Award name entrances */
const NAME_ANIM: Record<Tier, string> = {
  1: "ao-up .5s .2s both",
  2: "ao-side .55s .18s both",
  3: "ao-scale .5s .2s both",
  4: "ao-stamp .65s .2s both",
  5: "ao-bang .7s .18s both",
};

/* Winner name entrances (tier 4/5 get persistent glow chained) */
const WINNER_ANIM: Record<Tier, string> = {
  1: "ao-up .5s .52s both",
  2: "ao-up .5s .48s both",
  3: "ao-rise .55s .48s both",
  4: "ao-shine .6s .52s both, ao-winner-glow-4 2.8s 1.3s ease-in-out infinite",
  5: "ao-sub .55s .72s both, ao-winner-glow-5 2.8s 1.5s ease-in-out infinite",
};

type ConfettiProps = { tier: Tier };

const ConfettiCanvas = ({ tier }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const GOLD = ["#FEE622", "#FFD700", "#fb8c05", "#fff5a0", "#ffd060"];
    const SILVER = ["#e8e8e8", "#c0c0c0", "#a0a0a0", "#ffffff", "#d8d8d8"];
    const colors = tier === 5 ? GOLD : SILVER;
    const count = tier === 5 ? 280 : 160;

    type Piece = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      drot: number;
      col: string;
      w: number;
      h: number;
      shape: "rect" | "circle";
    };
    const pieces: Piece[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 3.5,
      vy: 1.8 + Math.random() * 3.2,
      rot: Math.random() * Math.PI * 2,
      drot: (Math.random() - 0.5) * 0.16,
      col: colors[Math.floor(Math.random() * colors.length)],
      w: 6 + Math.random() * 9,
      h: 3 + Math.random() * 5,
      shape: Math.random() > 0.75 ? "circle" : "rect",
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
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
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
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

type Props = { award: AwardType; onDismiss: () => void };

export const AwardOverlay = ({ award, onDismiss }: Props) => {
  const tier = getAnimationTier(award.name);
  const colors = TIER_COLORS[tier];
  const winnerNames = award.winners
    .map((w) => w.winnerName)
    .filter(Boolean) as string[];

  const [nameRevealed, setNameRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setNameRevealed(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: colors.overlay,
    animation: OVERLAY_ANIM[tier],
    textAlign: "center",
    padding: "40px 24px",
    overflow: "hidden",
    cursor: "pointer",
    WebkitFontSmoothing: "antialiased",
  };

  return (
    <>
      <style>{`
        /* ── Overlay entrances ── */
        @keyframes ao-fade      { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ao-slide-up  { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: none } }
        @keyframes ao-wipe      { from { opacity: 0; clip-path: inset(50% 0 50% 0) } to { opacity: 1; clip-path: inset(0% 0 0% 0) } }

        /* Tier 4 — silver strobe flash */
        @keyframes ao-silver-enter {
          0%   { opacity: 0; }
          6%   { opacity: 1; filter: brightness(3.5) saturate(0); }
          18%  { filter: brightness(1.6) saturate(.4); }
          38%  { filter: brightness(1.15) saturate(.8); }
          100% { filter: brightness(1) saturate(1); }
        }

        /* Tier 5 — gold flash: blinding white → gold → dark settle */
        @keyframes ao-champ {
          0%   { background: #ffffff; }
          10%  { background: rgba(254,230,34,.75); }
          28%  { background: rgba(100,70,0,.65); }
          55%  { background: rgba(20,14,0,.82); }
          100% { background: rgba(2,1,0,.95); }
        }

        /* ── Award name entrances ── */
        @keyframes ao-up    { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: none } }
        @keyframes ao-side  { from { opacity: 0; transform: translateX(-60px) skewX(-6deg) } to { opacity: 1; transform: none } }
        @keyframes ao-scale { from { opacity: 0; transform: scale(.55) } to { opacity: 1; transform: scale(1) } }
        @keyframes ao-stamp {
          0%   { opacity: 0; transform: translateY(-60px) scale(1.3) rotate(-2deg) }
          50%  { opacity: 1; transform: translateY(8px) scale(.96) rotate(.6deg) }
          72%  { transform: translateY(-4px) scale(1.02) }
          100% { transform: none }
        }
        @keyframes ao-bang {
          0%   { opacity: 0; transform: scale(2.6) rotate(-1.5deg); filter: blur(10px) }
          35%  { opacity: 1; transform: scale(.92); filter: blur(0) }
          55%  { transform: scale(1.07) }
          75%  { transform: scale(.97) }
          100% { transform: scale(1) }
        }

        /* ── Winner name entrances ── */
        @keyframes ao-rise  { from { opacity: 0; transform: translateY(24px); filter: blur(4px) } to { opacity: 1; transform: none; filter: blur(0) } }
        @keyframes ao-shine { from { opacity: 0; filter: brightness(3.5) blur(3px) } to { opacity: 1; filter: brightness(1) blur(0) } }
        @keyframes ao-sub   { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }

        /* Tier 4 winner — silver pulse glow */
        @keyframes ao-winner-glow-4 {
          0%, 100% { text-shadow: 0 2px 0 rgba(0,0,0,.6), 0 0 18px rgba(212,212,212,.35); }
          50%       { text-shadow: 0 2px 0 rgba(0,0,0,.5), 0 0 52px rgba(212,212,212,.9), 0 0 90px rgba(212,212,212,.3); }
        }

        /* Tier 5 winner — gold pulse glow */
        @keyframes ao-winner-glow-5 {
          0%, 100% { text-shadow: 0 2px 0 rgba(0,0,0,.6), 0 0 22px rgba(254,230,34,.45); }
          50%       { text-shadow: 0 2px 0 rgba(0,0,0,.5), 0 0 65px rgba(254,230,34,1), 0 0 120px rgba(254,230,34,.4); }
        }

        /* Shockwave ring */
        @keyframes ao-shockring {
          0%   { transform: scale(.05); opacity: .95; }
          100% { transform: scale(3.8); opacity: 0; }
        }

        /* Horizontal light streak (tier 5) */
        @keyframes ao-streak {
          0%   { transform: translateX(-115%) skewX(-18deg); opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: .65; }
          100% { transform: translateX(115%) skewX(-18deg); opacity: 0; }
        }

        /* Content shake (tier 5) */
        @keyframes ao-shake {
          0%,100% { transform: none; }
          8%   { transform: translateX(-11px) rotate(-.5deg); }
          18%  { transform: translateX(10px) rotate(.4deg); }
          28%  { transform: translateX(-8px); }
          40%  { transform: translateX(6px); }
          52%  { transform: translateX(-4px); }
          64%  { transform: translateX(2px); }
          76%  { transform: translateX(-1px); }
        }

        /* Shared */
        @keyframes ao-ring       { from { opacity: 0; transform: scale(.25) } to { opacity: 1; transform: scale(1) } }
        @keyframes ao-glow-pulse { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }
        @keyframes ao-shimmer {
          0%   { background-position: -700px 0; }
          100% { background-position: 700px 0; }
        }

        /* ── Radial light burst from center ── */
        @keyframes ao-door-burst {
          0%   { clip-path: circle(0% at 50% 50%);   filter: brightness(18) saturate(0); opacity: 1; }
          6%   { clip-path: circle(4% at 50% 50%);   filter: brightness(16) saturate(0); }
          18%  { clip-path: circle(22% at 50% 50%);  filter: brightness(12) saturate(.2); }
          34%  { clip-path: circle(55% at 50% 50%);  filter: brightness(7)  saturate(.5); }
          52%  { clip-path: circle(120% at 50% 50%); filter: brightness(4)  saturate(.8); opacity: 1; }
          70%  { filter: brightness(2); opacity: 0.75; }
          86%  { opacity: 0.2;  filter: brightness(1.2); }
          100% { opacity: 0;   filter: brightness(1); clip-path: circle(120% at 50% 50%); }
        }
        @keyframes ao-door-rays {
          0%   { opacity: 0;    transform: scale(0.05); filter: brightness(6); }
          12%  { opacity: 1;    transform: scale(0.4);  filter: brightness(5); }
          40%  { opacity: 0.7;  transform: scale(1.1);  filter: brightness(2); }
          75%  { opacity: 0.25; transform: scale(1.3); }
          100% { opacity: 0;    transform: scale(1.5); }
        }
      `}</style>

      <div
        style={overlayStyle}
        onClick={onDismiss}
        role="button"
        aria-label="Bỏ qua"
      >
        {/* ── Radial light burst from center ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: tier === 5
              ? "radial-gradient(circle at 50% 50%, #fffde0 0%, #ffffff 30%, #fffbe0 60%, #fff8c0 100%)"
              : tier === 4
                ? "radial-gradient(circle at 50% 50%, #ffffff 0%, #e8e8e8 40%, #c0c0c0 100%)"
                : "radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f0f0 50%, #d8d8d8 100%)",
            zIndex: 30,
            pointerEvents: "none",
            animation: "ao-door-burst 1.6s cubic-bezier(.12,.8,.3,1) forwards",
          }}
        />
        {/* Halo glow expanding from center */}
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            background: `radial-gradient(circle at 50% 50%, ${
              tier === 5 ? "rgba(254,230,34,0.9)" : tier === 4 ? "rgba(240,240,240,0.8)" : "rgba(255,255,255,0.7)"
            } 0%, transparent 55%)`,
            zIndex: 29,
            pointerEvents: "none",
            animation: "ao-door-rays 1.8s ease-out forwards",
          }}
        />

        {tier >= 4 && <ConfettiCanvas tier={tier} />}

        {/* Expanding shockwave rings (tier 4+) */}
        {tier >= 4 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {([0, 1, 2] as const).map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: tier === 5 ? 320 + i * 220 : 240 + i * 170,
                  height: tier === 5 ? 320 + i * 220 : 240 + i * 170,
                  borderRadius: "50%",
                  border: `${Math.max(1, 3 - i)}px solid ${colors.primary}`,
                  animation: `ao-shockring ${0.9 + i * 0.13}s ${0.04 + i * 0.22}s ease-out forwards`,
                }}
              />
            ))}
          </div>
        )}

        {/* Static radial glow (tier 4+) */}
        {tier >= 4 && (
          <div
            style={{
              position: "absolute",
              width: tier === 5 ? 720 : 520,
              height: tier === 5 ? 720 : 520,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.glow.replace(/[\d.]+\)$/, "0.18)")} 0%, transparent 65%)`,
              pointerEvents: "none",
              animation: "ao-ring 1.1s .12s both",
            }}
          />
        )}

        {/* Horizontal light streaks (tier 5 only) */}
        {tier === 5 &&
          ([0, 1, 2] as const).map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "145%",
                height: i === 1 ? 3 : 2,
                left: "-22%",
                top: `${26 + i * 24}%`,
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                opacity: 0,
                pointerEvents: "none",
                animation: `ao-streak ${0.44 + i * 0.06}s ${0.06 + i * 0.13}s ease-out forwards`,
              }}
            />
          ))}

        {/* Content — tier 5 gets shake after entrance */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            ...(tier === 5 ? { animation: "ao-shake .7s .52s both" } : {}),
          }}
        >
          {/* Medal image (tier 4-5) */}
          {(() => {
            const n = award.name.toLowerCase();
            const src = n.includes("quán quân")
              ? "/assets/images/gold-medal.png"
              : n.includes("á quân")
                ? "/assets/images/silver-medal.png"
                : n.includes("khuyến khích")
                  ? "/assets/images/bronze-medal.png"
                  : null;
            return src ? (
              <img
                src={src}
                alt=""
                style={{
                  width: "clamp(80px, 12vw, 140px)",
                  height: "clamp(80px, 12vw, 140px)",
                  objectFit: "contain",
                  margin: "0 auto 20px",
                  display: "block",
                  filter: `drop-shadow(0 0 24px ${colors.glow})`,
                  animation: "ao-up .55s .02s both",
                }}
              />
            ) : null;
          })()}

          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: "clamp(11px, 1.4vw, 15px)",
              fontWeight: 800,
              letterSpacing: ".42em",
              textTransform: "uppercase",
              color: colors.primary,
              margin: "0 0 30px",
              animation: "ao-up .45s .06s both",
            }}
          >
            <Trophy size={18} strokeWidth={2.5} />
            GIẢI THƯỞNG
          </div>

          {/* Award name */}
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(44px, 8.5vw, 100px)",
              lineHeight: 1,
              color: colors.primary,
              textShadow: `0 2px 0 rgba(0,0,0,.5), 0 0 32px ${colors.glow}`,
              letterSpacing: ".04em",
              animation: NAME_ANIM[tier],
              margin: "0 0 24px",
            }}
          >
            {award.name.toUpperCase()}
          </h2>

          {/* Divider */}
          <div
            style={{
              width: 72,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              margin: "0 auto 28px",
              animation: "ao-up .4s .44s both",
            }}
          />

          {/* Shimmer placeholder → winner names */}
          {!nameRevealed ? (
            winnerNames.length >= 8 ? (
              <div
                style={{
                  display: "flex",
                  gap: "clamp(24px, 5vw, 60px)",
                  justifyContent: "center",
                  animation: "ao-up .5s .52s both",
                }}
              >
                {[winnerNames.slice(0, 7), winnerNames.slice(7)].map((col, ci) => (
                  <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: "clamp(130px, 22vw, 260px)",
                          height: "clamp(20px, 3vw, 36px)",
                          borderRadius: 7,
                          background: `linear-gradient(90deg, transparent 0%, ${colors.glow} 35%, rgba(255,255,255,.88) 50%, ${colors.glow} 65%, transparent 100%)`,
                          backgroundSize: "700px 100%",
                          animation: `ao-shimmer 1.7s ${(ci * 7 + i) * 0.1}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  alignItems: "center",
                  animation: "ao-up .5s .52s both",
                }}
              >
                {(winnerNames.length > 0 ? winnerNames : [""]).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width:
                        winnerNames.length <= 1
                          ? "clamp(240px, 48vw, 440px)"
                          : "clamp(180px, 36vw, 360px)",
                      height:
                        winnerNames.length <= 1
                          ? "clamp(42px, 6.5vw, 78px)"
                          : "clamp(30px, 4.5vw, 58px)",
                      borderRadius: 10,
                      background: `linear-gradient(90deg, transparent 0%, ${colors.glow} 35%, rgba(255,255,255,.88) 50%, ${colors.glow} 65%, transparent 100%)`,
                      backgroundSize: "700px 100%",
                      animation: `ao-shimmer 1.7s ${i * 0.18}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            )
          ) : (
            <>
              {winnerNames.length === 1 && (
                <p
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: "clamp(30px, 5.5vw, 68px)",
                    color: "#ffffff",
                    letterSpacing: ".04em",
                    lineHeight: 1.15,
                    margin: 0,
                    animation: WINNER_ANIM[tier],
                  }}
                >
                  {winnerNames[0]}
                </p>
              )}
              {winnerNames.length >= 2 && winnerNames.length < 8 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {winnerNames.map((name, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: "clamp(24px, 4vw, 52px)",
                        color: "#ffffff",
                        letterSpacing: ".04em",
                        lineHeight: 1.15,
                        margin: 0,
                        animation: `ao-sub .5s ${i * 0.12}s both${tier >= 4 ? `, ao-winner-glow-${tier} 2.8s ${0.6 + i * 0.12}s ease-in-out infinite` : ""}`,
                      }}
                    >
                      {name}
                    </p>
                  ))}
                </div>
              )}
              {winnerNames.length >= 8 && (
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(24px, 5vw, 60px)",
                    justifyContent: "center",
                  }}
                >
                  {[winnerNames.slice(0, 7), winnerNames.slice(7)].map((col, ci) => (
                    <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {col.map((name, i) => (
                        <p
                          key={i}
                          style={{
                            fontFamily: "'Anton', sans-serif",
                            fontSize: "clamp(16px, 2.2vw, 30px)",
                            color: "#ffffff",
                            letterSpacing: ".04em",
                            lineHeight: 1.2,
                            margin: 0,
                            textAlign: "left",
                            animation: `ao-sub .5s ${(ci * 7 + i) * 0.07}s both`,
                          }}
                        >
                          {name}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tier === 5 && (
            <p
              style={{
                marginTop: 28,
                fontSize: "clamp(10px, 1.1vw, 13px)",
                letterSpacing: ".32em",
                color: "rgba(254,230,34,.55)",
                animation: "ao-up .5s 1.1s both",
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
