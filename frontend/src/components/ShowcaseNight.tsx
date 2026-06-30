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
  {
    num: "01",
    name: "Hotel California",
    by: "Lamie Trần x F# Live Music Club",
    image: "/assets/images/performers/lamie-x-f.webp",
  },
  {
    num: "02",
    name: "FREVKQU3NC!E",
    by: "IU ArTeam",
    image: "/assets/images/performers/iu-arteam.webp",
  },
  {
    num: "03",
    name: "Huyền Khúc Sử Việt",
    by: "SLATT from FStyle Crew",
    teamColor: "var(--slatt)",
  },
  {
    num: "04",
    name: "QUEEN NEVER CRY",
    by: "Apex Aura from FStyle Crew",
    teamColor: "var(--apex)",
  },
  {
    num: "05",
    name: "CARIBBEAN",
    by: "Giai Điệu Trẻ",
    image: "/assets/images/performers/giai-dieu-tre.webp",
  },
  {
    num: "06",
    name: "境界 (Kyōkai)",
    by: "Shiro Kuro from FStyle Crew",
    teamColor: "var(--shiro)",
  },
  {
    num: "07",
    name: "Girly Breaks Free",
    by: "Anti-X from FStyle Crew",
    teamColor: "var(--anti)",
  },
  {
    num: "08",
    name: "Detonex",
    by: "Jaeger Squad",
    image: "/assets/images/performers/jaeger-squad.webp",
  },
  {
    num: "09",
    name: "Wall to Wall",
    by: "The 07ERA",
    image: "/assets/images/performers/the-07era.webp",
  },
  {
    num: "10",
    name: "Sự Tĩnh Lặng Từ Thiên Đường",
    by: "Ca sĩ M Tú",
    image: "/assets/images/performers/m-tu.webp",
  },
  {
    num: "11",
    name: "Like We Own The Morning",
    by: "FStyle Crew",
    image: "/assets/images/performers/fstyle-crew.webp",
  },
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
    img2: "/assets/images/members/bgk-trinh-mai-phuong-2.webp",
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  return (
    <section id="showcase" className="sec bg-[var(--bg2)] p-0 overflow-hidden">
      {/* ── HERO BANNER ── */}
      <div className="showcase-hero relative min-h-[480px] flex items-center justify-center text-center overflow-hidden">
        <img
          src="/assets/pptx-extracted/golden-gate.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_top] opacity-[.35] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 [background:linear-gradient(to_bottom,rgba(5,3,1,.3)_0%,rgba(5,3,1,.6)_40%,rgba(10,7,3,1)_100%)] pointer-events-none"
        />
        <div className="rv relative z-[2] py-20 px-7">
          <div className="text-[10px] font-extrabold tracking-[.5em] text-[var(--orange)] uppercase mb-5 [text-shadow:0_0_16px_rgba(251,140,5,.5)]">
            Chủ Nhật, 05/07/2026 · 18:00
          </div>
          <h2
            className="text-[clamp(42px,6vw,80px)] leading-none tracking-[.04em] text-[var(--text)] mb-4 font-anton"
          >
            SHOWCASE{" "}
            <em className="text-[var(--gold)] not-italic [text-shadow:0_0_40px_rgba(254,230,34,.6)]">
              NIGHT
            </em>
          </h2>
          <p className="text-[15px] text-[var(--dim)] max-w-[560px] mx-auto leading-[1.75]">
            Đêm trình diễn và thi đấu vũ đạo chính thức. Bốn đội thi cháy hết
            mình trên sân khấu Hall A, FPT University HCM.
          </p>
          <div className="flex gap-6 justify-center mt-7 flex-wrap">
            <InfoChip Icon={MapPin} text="Hall A, FPT University HCM" />
            <InfoChip Icon={Theater} text="11 Tiết mục · 4 Đội thi" />
            <InfoChip Icon={Scale} text="3 Ban Giám Khảo" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="con pt-14 pb-[100px]">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-7">
          <div className="text-[10px] font-extrabold tracking-[.4em] text-[var(--orange)] uppercase whitespace-nowrap">
            Chương Trình Biểu Diễn
          </div>
          <div className="flex-1 h-px bg-[rgba(255,255,255,.07)]" />
        </div>

        <div className="flex flex-col gap-1">
          {performances.map((p, i) => {
            const active = hoveredRow === i;
            const tc = p.teamColor || "var(--gold)";
            const clickable = !!p.image;
            return (
              <div
                key={p.num}
                className="rv perf-row relative flex items-center gap-[14px] py-[10px] px-4 rounded-[10px] [transition:background_.2s,border-color_.2s] overflow-hidden"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => clickable && setModal(p)}
                style={{
                  background: active ? "rgba(255,255,255,.04)" : "transparent",
                  border: `1px solid ${active ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.05)"}`,
                  cursor: clickable ? "pointer" : "default",
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] [transition:opacity_.2s]"
                  style={{
                    background: tc,
                    opacity: active ? 1 : 0.2,
                  }}
                />

                {/* Number */}
                <span
                  className="text-[20px] leading-none [transition:color_.2s] min-w-8 text-right shrink-0 font-anton"
                  style={{ color: active ? tc : "rgba(255,255,255,.15)" }}
                >
                  {p.num}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--text)] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </div>
                  <div
                    className="text-[11.5px] mt-0.5 [transition:color_.2s]"
                    style={{ color: active ? tc : "var(--dim)" }}
                  >
                    {p.by}
                  </div>
                </div>

                {/* Click hint for items with image */}
                {clickable && (
                  <span
                    className="text-[10px] [transition:color_.2s] shrink-0"
                    style={{ color: active ? "var(--gold)" : "rgba(255,255,255,.2)" }}
                  >
                    ↗
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── JUDGES - full-width centered ── */}
        <div className="rv mt-16 text-center">
          <div className="text-xs font-extrabold tracking-[.2em] text-[var(--orange)] uppercase mb-[18px]">
            Ban Giám Khảo
          </div>

          <div className="judges-grid grid grid-cols-3 gap-4 max-w-[720px] mx-auto">
            {judges.map((j, i) => (
              <div
                key={j.name}
                className="rv rounded-[14px] overflow-hidden bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] [transition:transform_.4s_cubic-bezier(.22,.8,.42,1),box-shadow_.4s]"
                onMouseEnter={() => setHoveredJudge(i)}
                onMouseLeave={() => setHoveredJudge(null)}
                style={{
                  transform: hoveredJudge === i ? "translateY(-6px)" : "translateY(0)",
                  transitionDelay: `${i * 0.1}s`,
                  boxShadow: hoveredJudge === i ? "0 12px 32px rgba(254,230,34,.08)" : "none",
                }}
              >
                <div className="relative aspect-square overflow-hidden bg-[rgba(255,255,255,.03)]">
                  <img
                    src={j.img}
                    alt={j.name}
                    className="absolute inset-0 w-full h-full object-cover object-[center_top] [transition:filter_.4s,transform_.4s,opacity_.45s_ease] block"
                    style={{
                      filter: hoveredJudge === i ? "grayscale(0%)" : "grayscale(30%)",
                      transform: hoveredJudge === i ? "scale(1.05)" : "scale(1)",
                      opacity: j.img2 && hoveredJudge === i ? 0 : 1,
                    }}
                  />
                  {j.img2 && (
                    <img
                      src={j.img2}
                      alt={j.name}
                      className="absolute inset-0 w-full h-full object-cover object-[center_top] [transition:transform_.4s,opacity_.45s_ease] block"
                      style={{
                        transform: hoveredJudge === i ? "scale(1.05)" : "scale(1.08)",
                        opacity: hoveredJudge === i ? 1 : 0,
                      }}
                    />
                  )}
                </div>
                <div className="[padding:14px_12px_16px] text-center">
                  <div
                    className="text-[18px] text-[var(--text)] font-anton"
                  >
                    {j.name}
                  </div>
                  <div className="text-[9px] font-extrabold tracking-[.16em] uppercase text-[var(--orange)] [margin:6px_0_3px]">
                    {j.role}
                  </div>
                  <div className="text-[11.5px] text-[var(--dim)]">{j.crew}</div>
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
          className="fixed inset-0 z-[1000] bg-[rgba(0,0,0,.85)] backdrop-blur-[10px] flex items-center justify-center p-6 [animation:modalIn_.25s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[560px] w-full rounded-[20px] overflow-hidden border border-[rgba(255,255,255,.12)] shadow-[0_32px_80px_rgba(0,0,0,.7)]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3]">
              <img
                src={modal.image}
                alt={modal.by}
                className="w-full h-full object-cover object-[center_top] block"
              />
              <div className="absolute inset-0 [background:linear-gradient(to_top,rgba(5,3,1,1)_0%,rgba(5,3,1,.3)_50%,transparent_100%)] pointer-events-none" />
              {/* Info overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 py-6 px-7">
                <div
                  className="text-[11px] tracking-[.3em] text-[var(--gold)] uppercase mb-2 opacity-80 font-anton"
                >
                  Tiết mục {modal.num}
                </div>
                <div
                  className="text-[clamp(22px,4vw,32px)] text-[var(--text)] leading-[1.1] mb-2 font-anton"
                >
                  {modal.name}
                </div>
                <div className="text-sm text-[var(--dim)]">{modal.by}</div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setModal(null)}
            className="fixed top-5 right-5 w-10 h-10 rounded-full border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.08)] text-[var(--text)] flex items-center justify-center cursor-pointer backdrop-blur-[8px]"
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
  <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--dim)] bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-[100px] py-2 px-4">
    <Icon size={14} color="var(--gold)" /> {text}
  </span>
);

export default ShowcaseNight;
