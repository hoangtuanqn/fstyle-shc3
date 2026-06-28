import { useState, useEffect } from "react";
import { MapPin, Theater, Scale, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Performance = {
  num: string;
  name: string;
  by: string;
  teamColor?: string;
  image?: string;
};

const performances: Performance[] = [
  { num: "01", name: "Hotel California", by: "Lamie Trần x F# Live Music Club", image: "/assets/images/performers/lamie-x-f.webp" },
  { num: "02", name: "FREVKQU3NC!E", by: "IU ArTeam", image: "/assets/images/performers/iu-arteam.webp" },
  { num: "03", name: "Huyền Khúc Sử Việt", by: "SLATT from FStyle Crew", teamColor: "var(--slatt)" },
  { num: "04", name: "QUEEN NEVER CRY", by: "Apex Aura from FStyle Crew", teamColor: "var(--apex)" },
  { num: "05", name: "CARIBBEAN", by: "Giai Điệu Trẻ", image: "/assets/images/performers/giai-dieu-tre.webp" },
  { num: "06", name: "境界 (Kyōkai)", by: "Shiro Kuro from FStyle Crew", teamColor: "var(--shiro)" },
  { num: "07", name: "Girly Breaks Free", by: "Anti-X from FStyle Crew", teamColor: "var(--anti)" },
  { num: "08", name: "Detonex", by: "Jaeger Squad", image: "/assets/images/performers/jaeger-squad.webp" },
  { num: "09", name: "Wall to Wall", by: "The 07ERA", image: "/assets/images/performers/the-07era.webp" },
  { num: "10", name: "Sự Tĩnh Lặng Từ Thiên Đường", by: "Ca sĩ M Tú", image: "/assets/images/performers/m-tu.webp" },
  { num: "11", name: "Like We Own The Morning", by: "FStyle Crew", image: "/assets/images/performers/fstyle-crew.webp" },
];

const judges = [
  {
    name: "Đinh Võ Hoàng",
    role: "Ban Giám Khảo",
    crew: "",
    img: "/assets/images/members/bgk-dinh-vo-hoang-1.webp",
    img2: "/assets/images/members/bgk-dinh-vo-hoang-2.webp",
  },
  {
    name: "Trịnh Mai Phương",
    role: "Ban Giám Khảo",
    crew: "",
    img: "/assets/images/members/bgk-trinh-mai-phuong-1.webp",
    img2: null,
  },
  {
    name: "Võ Ngọc Toàn",
    role: "Ban Giám Khảo",
    crew: "",
    img: "/assets/images/members/bgk-vo-ngoc-toan-1.webp",
    img2: "/assets/images/members/bgk-vo-ngoc-toan-2.webp",
  },
];

const ShowcaseNight = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredJudge, setHoveredJudge] = useState<number | null>(null);
  const [modal, setModal] = useState<Performance | null>(null);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  return (
    <section
      id="showcase"
      className="sec"
      style={{ background: "var(--bg2)", padding: 0, overflow: "hidden" }}
    >
      {/* ── HERO BANNER ── */}
      <div
        className="showcase-hero"
        style={{
          position: "relative",
          minHeight: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="/assets/pptx-extracted/golden-gate.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,3,1,.3) 0%, rgba(5,3,1,.6) 40%, rgba(10,7,3,1) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{ position: "relative", zIndex: 2, padding: "80px 28px" }}
          className="rv"
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".5em",
              color: "var(--orange)",
              textTransform: "uppercase",
              marginBottom: 20,
              textShadow: "0 0 16px rgba(251,140,5,.5)",
            }}
          >
            Chủ Nhật, 05/07/2026 · 18:00
          </div>
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(42px, 6vw, 80px)",
              lineHeight: 1,
              letterSpacing: ".04em",
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            SHOWCASE{" "}
            <em
              style={{
                color: "var(--gold)",
                fontStyle: "normal",
                textShadow: "0 0 40px rgba(254,230,34,.6)",
              }}
            >
              NIGHT
            </em>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--dim)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Đêm trình diễn và thi đấu vũ đạo chính thức. Bốn đội thi cháy hết
            mình trên sân khấu Hall A, FPT University HCM.
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            <InfoChip Icon={MapPin} text="Hall A, FPT University HCM" />
            <InfoChip Icon={Theater} text="11 Tiết mục · 4 Đội thi" />
            <InfoChip Icon={Scale} text="3 Ban Giám Khảo" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="con" style={{ paddingTop: 56, paddingBottom: 100 }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".4em",
              color: "var(--orange)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Chương Trình Biểu Diễn
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.07)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {performances.map((p, i) => {
            const active = hoveredRow === i;
            const tc = p.teamColor || "var(--gold)";
            const clickable = !!p.image;
            return (
              <div
                key={p.num}
                className="rv perf-row"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => clickable && setModal(p)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: active ? "rgba(255,255,255,.04)" : "transparent",
                  border: `1px solid ${active ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.05)"}`,
                  transition: "background .2s, border-color .2s",
                  cursor: clickable ? "pointer" : "default",
                  overflow: "hidden",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: tc,
                    opacity: active ? 1 : 0.2,
                    transition: "opacity .2s",
                  }}
                />

                {/* Number */}
                <span
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: 20,
                    lineHeight: 1,
                    color: active ? tc : "rgba(255,255,255,.15)",
                    transition: "color .2s",
                    minWidth: 32,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {p.num}
                </span>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text)",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: active ? tc : "var(--dim)", marginTop: 2, transition: "color .2s" }}>
                    {p.by}
                  </div>
                </div>

                {/* Click hint for items with image */}
                {clickable && (
                  <span
                    style={{
                      fontSize: 10,
                      color: active ? "var(--gold)" : "rgba(255,255,255,.2)",
                      transition: "color .2s",
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── JUDGES - full-width centered ── */}
        <div style={{ marginTop: 64, textAlign: "center" }} className="rv">
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".2em",
              color: "var(--orange)",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Ban Giám Khảo
          </div>

          <div
            className="judges-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {judges.map((j, i) => (
              <div
                key={j.name}
                className="rv"
                onMouseEnter={() => setHoveredJudge(i)}
                onMouseLeave={() => setHoveredJudge(null)}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.07)",
                  transform:
                    hoveredJudge === i ? "translateY(-6px)" : "translateY(0)",
                  transition:
                    "transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s",
                  transitionDelay: `${i * 0.1}s`,
                  boxShadow:
                    hoveredJudge === i
                      ? "0 12px 32px rgba(254,230,34,.08)"
                      : "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                    background: "rgba(255,255,255,.03)",
                  }}
                >
                  <img
                    src={j.img}
                    alt={j.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter:
                        hoveredJudge === i ? "grayscale(0%)" : "grayscale(30%)",
                      transition: "filter .4s, transform .4s, opacity .45s ease",
                      transform:
                        hoveredJudge === i ? "scale(1.05)" : "scale(1)",
                      display: "block",
                      opacity: j.img2 && hoveredJudge === i ? 0 : 1,
                    }}
                  />
                  {j.img2 && (
                    <img
                      src={j.img2}
                      alt={j.name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        transition: "transform .4s, opacity .45s ease",
                        transform:
                          hoveredJudge === i ? "scale(1.05)" : "scale(1.08)",
                        display: "block",
                        opacity: hoveredJudge === i ? 1 : 0,
                      }}
                    />
                  )}
                </div>
                <div style={{ padding: "14px 12px 16px", textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "Anton, sans-serif",
                      fontSize: 18,
                      color: "var(--text)",
                    }}
                  >
                    {j.name}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "var(--orange)",
                      margin: "6px 0 3px",
                    }}
                  >
                    {j.role}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--dim)" }}>
                    {j.crew}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,.85)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            animation: "modalIn .25s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 560,
              width: "100%",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "0 32px 80px rgba(0,0,0,.7)",
            }}
          >
            {/* Image */}
            <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
              <img
                src={modal.image}
                alt={modal.by}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,3,1,1) 0%, rgba(5,3,1,.3) 50%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
              {/* Info overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px 28px",
                }}
              >
                <div
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: 11,
                    letterSpacing: ".3em",
                    color: "var(--gold)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    opacity: 0.8,
                  }}
                >
                  Tiết mục {modal.num}
                </div>
                <div
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: "clamp(22px, 4vw, 32px)",
                    color: "var(--text)",
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  {modal.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--dim)" }}>{modal.by}</div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setModal(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.15)",
              background: "rgba(255,255,255,.08)",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 600px) {
          .showcase-hero { min-height: 300px !important; }
          .judges-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .perf-row { padding: 9px 12px !important; }
        }
      `}</style>
    </section>
  );
};

const InfoChip = ({ Icon, text }: { Icon: LucideIcon; text: string }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      fontWeight: 600,
      color: "var(--dim)",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 100,
      padding: "8px 16px",
    }}
  >
    <Icon size={14} color="var(--gold)" /> {text}
  </span>
);

export default ShowcaseNight;
