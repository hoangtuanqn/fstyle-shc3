import { useCountdown } from "../hooks/useCountdown";
import ParticleCanvas from "./ParticleCanvas";

const TARGET = new Date("2026-07-05T18:00:00+07:00").getTime();

const metaItems = [
  { label: "Ngày", value: "05.07.2026" },
  { label: "Địa điểm", value: "Hall A · FPT HCM" },
  { label: "Bắt đầu", value: "18:00" },
];

const Hero = () => {
  const { days, hours, minutes, seconds } = useCountdown(TARGET);

  const countItems = [
    { label: "Ngày", value: days },
    { label: "Giờ", value: hours },
    { label: "Phút", value: minutes },
    { label: "Giây", value: seconds },
  ];

  const colon = (
    <span
      className="text-[26px] sm:text-[40px] leading-none mx-0.5 sm:mx-[2px] text-[var(--gold)] [animation:cb_1s_step-end_infinite] font-anton"
    >
      :
    </span>
  );

  return (
    <section id="hero" className="relative w-full h-screen min-h-[740px] overflow-hidden">
      {/* Layer 1 - background */}
      <div className="absolute inset-0 [background:url('/assets/images/bggg.png')_center_top/cover_no-repeat] [animation:hzoom_22s_ease-in-out_infinite_alternate] [filter:saturate(1.2)_contrast(1.05)]" />
      {/* Layer 2 - overlay */}
      <div className="absolute inset-0 [background:url('/assets/images/vungtoi.png')_center_bottom/cover_no-repeat] opacity-60" />
      {/* Layer 3 - gradient */}
      <div className="absolute inset-0 [background:linear-gradient(to_bottom,rgba(5,3,1,.15)_0%,rgba(5,3,1,.02)_20%,rgba(5,3,1,.12)_55%,rgba(5,3,1,.94)_100%)]" />
      {/* Layer 4 - particles */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* 1. Eyebrow */}
        <span className="text-[10px] font-extrabold tracking-[.38em] text-[var(--gold)] uppercase [text-shadow:rgba(0,0,0,0.95)_0px_0px_6px,rgb(0_0_0/85%)_0px_0px_18px] [animation:fu_.9s_.1s_both]">
          FStyle Crew · Never Stop Trying!
        </span>

        {/* 2. Logo */}
        <div className="relative [width:min(580px,84vw)] mt-[22px] [animation:fu_1s_.3s_both]">
          {/* Stage light bloom */}
          <div
            className="absolute pointer-events-none [inset:-90px_-50px] [background:radial-gradient(ellipse_75%_55%_at_50%_50%,rgba(254,230,34,.55)_0%,rgba(251,140,5,.28)_45%,transparent_70%)] [filter:blur(32px)]"
          />
          {/* Light shafts */}
          <div
            className="absolute pointer-events-none [inset:-20px_-60px] [background:conic-gradient(from_260deg_at_50%_50%,transparent_0deg,rgba(254,220,20,.12)_10deg,transparent_20deg,transparent_50deg,rgba(254,220,20,.1)_60deg,transparent_70deg,transparent_360deg)] [filter:blur(18px)]"
          />
          {/* Orbit ring */}
          <div className="logo-orbit-ring pointer-events-none absolute [inset:-18px_-10px]" />
          <img
            src="/assets/images/typography-apocalypse-gold.png"
            alt="APOCALYPSE"
            className="relative w-full [filter:drop-shadow(0_0_2px_rgba(255,255,255,1))_drop-shadow(0_0_10px_rgba(255,255,210,1))_drop-shadow(0_0_30px_rgba(254,230,34,1))_drop-shadow(0_0_70px_rgba(254,200,10,.9))_drop-shadow(0_0_140px_rgba(251,140,5,.7))]"
          />
        </div>

        {/* 3. Tagline */}
        <p className="italic text-[14px] text-[rgba(242,237,224,.92)] mt-[18px] [text-shadow:0_0_20px_rgba(255,255,255,.35),0_1px_8px_rgba(0,0,0,.8)] [animation:fu_.9s_.5s_both]">
          Heatwave Showcase mùa 3: Apocalypse - Nơi sinh viên kể chuyện bằng
          ngôn ngữ vũ đạo.
        </p>

        {/* 3b. Featured on HTV badge */}
        <a
          href="https://htv.vn/heatwave-showcase-mua-3-apocalypse-noi-sinh-vien-ke-chuyen-bang-ngon-ngu-vu-dao-222260611214349823.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="htv-badge inline-flex items-center gap-[10px] mt-4 [padding:8px_20px_8px_12px] bg-[rgba(0,0,0,.5)] border border-[rgba(254,230,34,.2)] rounded-[100px] backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)] no-underline [animation:fu_.9s_.6s_both] [transition:border-color_.3s,box-shadow_.3s]"
        >
          <img
            src="/assets/images/htv.png"
            alt="HTV"
            className="h-[22px] w-auto object-contain shrink-0"
          />
          <span className="w-px h-4 bg-[rgba(254,230,34,.25)] shrink-0" />
          <span className="text-[10px] font-bold tracking-[.12em] uppercase text-[var(--dim)]">
            Được đưa tin trên <span className="text-[var(--gold)]">HTV</span>
          </span>
        </a>

        {/* 4. Meta bar */}
        <div className="hero-meta flex bg-[rgba(0,0,0,.45)] border border-[rgba(254,230,34,.28)] rounded-xl backdrop-blur-[8px] [-webkit-backdrop-filter:blur(8px)] overflow-hidden mt-[34px] [animation:fu_.9s_.7s_both]">
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              className="py-[14px] px-[26px] text-center"
              style={{
                borderRight:
                  i < metaItems.length - 1
                    ? "1px solid rgba(254,230,34,.18)"
                    : "none",
              }}
            >
              <div className="text-[9px] font-extrabold tracking-[.3em] text-[var(--orange)] uppercase mb-[6px]">
                {item.label}
              </div>
              <div
                className="text-[17px] text-[var(--gold)] [text-shadow:0_0_16px_rgba(254,230,34,.5)] font-anton"
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Countdown */}
        <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-1.5 mt-9 [animation:fu_.9s_.9s_both]">
          {countItems.map((item, i) => (
            <div key={item.label} className="flex items-center gap-1 sm:gap-1.5">
              <div className="flex flex-col items-center rounded-[10px] bg-[rgba(0,0,0,.4)] border border-[rgba(254,230,34,.22)] [min-width:clamp(52px,13vw,72px)] [padding:clamp(10px,2vw,14px)_clamp(7px,1.5vw,10px)]">
                <span
                  className="text-[30px] sm:text-[40px] leading-none text-[var(--gold)] [text-shadow:0_0_20px_rgba(254,230,34,.6)] font-anton"
                >
                  {item.value}
                </span>
                <span className="text-[8px] sm:text-[9px] font-extrabold tracking-[.24em] uppercase mt-1.5 sm:mt-2 text-[var(--dim)]">
                  {item.label}
                </span>
              </div>
              {i < countItems.length - 1 && colon}
            </div>
          ))}
        </div>

        {/* 6. Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px]">
          <span className="text-[9px] font-extrabold tracking-[.3em] text-[var(--dim)] uppercase">
            Cuộn xuống
          </span>
          <span className="w-3 h-3 border-r-2 border-r-[var(--gold)] border-b-2 border-b-[var(--gold)] block [animation:ab_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        .logo-orbit-ring {
          border-radius: 50% / 28%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 295deg,
            rgba(255,230,80,.5) 315deg,
            rgba(255,255,210,1) 336deg,
            rgba(255,255,255,1) 342deg,
            rgba(254,230,34,.8) 352deg,
            transparent 360deg
          );
          -webkit-mask: radial-gradient(ellipse calc(100% - 10px) calc(100% - 10px) at 50% 50%, transparent 95%, black 100%);
          mask: radial-gradient(ellipse calc(100% - 10px) calc(100% - 10px) at 50% 50%, transparent 95%, black 100%);
          animation: logo-orbit 7s linear infinite;
          filter: blur(1px) brightness(1.4);
        }
        @keyframes logo-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .htv-badge:hover {
          border-color: rgba(254,230,34,.45) !important;
          box-shadow: 0 0 20px rgba(254,230,34,.12), 0 0 40px rgba(254,230,34,.06);
        }
        @media (max-width: 600px) {
          .hero-meta {
            flex-direction: column;
            width: min(280px, 84vw);
          }
          .hero-meta > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(254,230,34,.18);
          }
          .hero-meta > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
