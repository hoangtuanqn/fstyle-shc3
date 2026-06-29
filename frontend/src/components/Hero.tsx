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
      className="text-[26px] sm:text-[40px] leading-none mx-0.5 sm:mx-[2px]"
      style={{
        fontFamily: "Anton, sans-serif",
        color: "var(--gold)",
        animation: "cb 1s step-end infinite",
      }}
    >
      :
    </span>
  );

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 740,
        overflow: "hidden",
      }}
    >
      {/* Layer 1 - background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url('/assets/images/bggg.png') center top / cover no-repeat",
          animation: "hzoom 22s ease-in-out infinite alternate",
          filter: "saturate(1.2) contrast(1.05)",
        }}
      />
      {/* Layer 2 - overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url('/assets/images/vungtoi.png') center bottom / cover no-repeat",
          opacity: 0.6,
        }}
      />
      {/* Layer 3 - gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(5,3,1,.15) 0%, rgba(5,3,1,.02) 20%, rgba(5,3,1,.12) 55%, rgba(5,3,1,.94) 100%)",
        }}
      />
      {/* Layer 4 - particles */}
      <ParticleCanvas />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {/* 1. Eyebrow */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".38em",
            color: "var(--gold)",
            textTransform: "uppercase",
            textShadow:
              "rgba(0, 0, 0, 0.95) 0px 0px 6px, rgb(0 0 0 / 85%) 0px 0px 18px",
            animation: "fu .9s .1s both",
          }}
        >
          FStyle Crew · Never Stop Trying!
        </span>

        {/* 2. Logo */}
        <div
          className="relative"
          style={{
            width: "min(580px, 84vw)",
            marginTop: 22,
            animation: "fu 1s .3s both",
          }}
        >
          {/* Stage light bloom */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-90px -50px",
              background:
                "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(254,230,34,.55) 0%, rgba(251,140,5,.28) 45%, transparent 70%)",
              filter: "blur(32px)",
            }}
          />
          {/* Light shafts */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-20px -60px",
              background:
                "conic-gradient(from 260deg at 50% 50%, transparent 0deg, rgba(254,220,20,.12) 10deg, transparent 20deg, transparent 50deg, rgba(254,220,20,.1) 60deg, transparent 70deg, transparent 360deg)",
              filter: "blur(18px)",
            }}
          />
          {/* Orbit ring */}
          <div
            className="logo-orbit-ring pointer-events-none absolute"
            style={{ inset: "-18px -10px" }}
          />
          <img
            src="/assets/images/typography-apocalypse-gold.png"
            alt="APOCALYPSE"
            className="relative w-full"
            style={{
              filter:
                "drop-shadow(0 0 2px rgba(255,255,255,1)) drop-shadow(0 0 10px rgba(255,255,210,1)) drop-shadow(0 0 30px rgba(254,230,34,1)) drop-shadow(0 0 70px rgba(254,200,10,.9)) drop-shadow(0 0 140px rgba(251,140,5,.7))",
            }}
          />
        </div>

        {/* 3. Tagline */}
        <p
          className="italic text-white mt-5"
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "rgba(242,237,224,.92)",
            marginTop: 18,
            textShadow:
              "0 0 20px rgba(255,255,255,.35), 0 1px 8px rgba(0,0,0,.8)",
            animation: "fu .9s .5s both",
          }}
        >
          Heatwave Showcase mùa 3: Apocalypse - Nơi sinh viên kể chuyện bằng
          ngôn ngữ vũ đạo.
        </p>

        {/* 3b. Featured on HTV badge */}
        <a
          href="https://htv.vn/heatwave-showcase-mua-3-apocalypse-noi-sinh-vien-ke-chuyen-bang-ngon-ngu-vu-dao-222260611214349823.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="htv-badge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
            padding: "8px 20px 8px 12px",
            background: "rgba(0,0,0,.5)",
            border: "1px solid rgba(254,230,34,.2)",
            borderRadius: 100,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            textDecoration: "none",
            animation: "fu .9s .6s both",
            transition: "border-color .3s, box-shadow .3s",
          }}
        >
          <img
            src="/assets/images/htv.png"
            alt="HTV"
            style={{
              height: 22,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              width: 1,
              height: 16,
              background: "rgba(254,230,34,.25)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--dim)",
            }}
          >
            Được đưa tin trên <span style={{ color: "var(--gold)" }}>HTV</span>
          </span>
        </a>

        {/* 4. Meta bar */}
        <div
          className="hero-meta"
          style={{
            display: "flex",
            background: "rgba(0,0,0,.45)",
            border: "1px solid rgba(254,230,34,.28)",
            borderRadius: 12,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            overflow: "hidden",
            marginTop: 34,
            animation: "fu .9s .7s both",
          }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: "14px 26px",
                borderRight:
                  i < metaItems.length - 1
                    ? "1px solid rgba(254,230,34,.18)"
                    : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: ".3em",
                  color: "var(--orange)",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: 17,
                  color: "var(--gold)",
                  textShadow: "0 0 16px rgba(254,230,34,.5)",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Countdown */}
        <div
          className="flex items-center flex-wrap justify-center gap-1 sm:gap-1.5"
          style={{ marginTop: 36, animation: "fu .9s .9s both" }}
        >
          {countItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-1 sm:gap-1.5"
            >
              <div
                className="flex flex-col items-center rounded-[10px]"
                style={{
                  background: "rgba(0,0,0,.4)",
                  border: "1px solid rgba(254,230,34,.22)",
                  minWidth: "clamp(52px, 13vw, 72px)",
                  padding: "clamp(10px, 2vw, 14px) clamp(7px, 1.5vw, 10px)",
                }}
              >
                <span
                  className="text-[30px] sm:text-[40px] leading-none"
                  style={{
                    fontFamily: "Anton, sans-serif",
                    color: "var(--gold)",
                    textShadow: "0 0 20px rgba(254,230,34,.6)",
                  }}
                >
                  {item.value}
                </span>
                <span
                  className="text-[8px] sm:text-[9px] font-extrabold tracking-[.24em] uppercase mt-1.5 sm:mt-2"
                  style={{ color: "var(--dim)" }}
                >
                  {item.label}
                </span>
              </div>
              {i < countItems.length - 1 && colon}
            </div>
          ))}
        </div>

        {/* 6. Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: ".3em",
              color: "var(--dim)",
              textTransform: "uppercase",
            }}
          >
            Cuộn xuống
          </span>
          <span
            style={{
              width: 12,
              height: 12,
              borderRight: "2px solid var(--gold)",
              borderBottom: "2px solid var(--gold)",
              display: "block",
              animation: "ab 2s ease-in-out infinite",
            }}
          />
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
