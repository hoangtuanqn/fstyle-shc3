import { useCountdown } from '../hooks/useCountdown';
import ParticleCanvas from './ParticleCanvas';

const TARGET = new Date('2026-07-05T18:00:00+07:00').getTime();

const metaItems = [
  { label: 'Ngày', value: '05.07.2026' },
  { label: 'Địa điểm', value: 'Hall A · FPT HCM' },
  { label: 'Bắt đầu', value: '18:00' },
];

const Hero = () => {
  const { days, hours, minutes, seconds } = useCountdown(TARGET);

  const countItems = [
    { label: 'Ngày', value: days },
    { label: 'Giờ', value: hours },
    { label: 'Phút', value: minutes },
    { label: 'Giây', value: seconds },
  ];

  const colon = (
    <span
      style={{
        fontFamily: 'Anton, sans-serif',
        fontSize: 40,
        color: 'var(--gold)',
        animation: 'cb 1s step-end infinite',
        lineHeight: 1,
        margin: '0 2px',
      }}
    >
      :
    </span>
  );

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 740,
        overflow: 'hidden',
      }}
    >
      {/* Layer 1 — background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: "url('/assets/images/bggg.png') center top / cover no-repeat",
          animation: 'hzoom 22s ease-in-out infinite alternate',
          filter: 'saturate(1.2) contrast(1.05)',
        }}
      />
      {/* Layer 2 — overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: "url('/assets/images/vungtoi.png') center bottom / cover no-repeat",
          opacity: 0.6,
        }}
      />
      {/* Layer 3 — gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(5,3,1,.15) 0%, rgba(5,3,1,.02) 20%, rgba(5,3,1,.12) 55%, rgba(5,3,1,.94) 100%)',
        }}
      />
      {/* Layer 4 — particles */}
      <ParticleCanvas />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* 1. Eyebrow */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '.42em',
            color: 'var(--orange)',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(251,140,5,.8)',
            animation: 'fu .9s .1s both',
          }}
        >
          FStyle Crew · Never Stop Trying!
        </span>

        {/* 2. Logo */}
        <img
          src="/assets/images/typography-apocalypse-gold.png"
          alt="APOCALYPSE"
          style={{
            width: 'min(580px, 84vw)',
            marginTop: 22,
            filter: 'drop-shadow(0 0 60px rgba(254,230,34,.7)) drop-shadow(0 0 20px rgba(251,140,5,.5))',
            animation: 'fu 1s .3s both',
          }}
        />

        {/* 3. Tagline */}
        <p
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: 'rgba(242,237,224,.7)',
            marginTop: 18,
            animation: 'fu .9s .5s both',
          }}
        >
          Heatwave Showcase mùa 3: Apocalypse - Nơi sinh viên kể chuyện bằng ngôn ngữ vũ đạo.
        </p>

        {/* 3b. Featured on HTV badge */}
        <a
          href="https://htv.vn/heatwave-showcase-mua-3-apocalypse-noi-sinh-vien-ke-chuyen-bang-ngon-ngu-vu-dao-222260611214349823.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="htv-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 16,
            padding: '8px 20px 8px 12px',
            background: 'rgba(0,0,0,.5)',
            border: '1px solid rgba(254,230,34,.2)',
            borderRadius: 100,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            textDecoration: 'none',
            animation: 'fu .9s .6s both',
            transition: 'border-color .3s, box-shadow .3s',
          }}
        >
          <img
            src="/assets/images/htv.png"
            alt="HTV"
            style={{
              height: 22,
              width: 'auto',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              width: 1,
              height: 16,
              background: 'rgba(254,230,34,.25)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: 'var(--dim)',
            }}
          >
            Được đưa tin trên{' '}
            <span style={{ color: 'var(--gold)' }}>HTV</span>
          </span>
        </a>

        {/* 4. Meta bar */}
        <div
          className="hero-meta"
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,.45)',
            border: '1px solid rgba(254,230,34,.28)',
            borderRadius: 12,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            overflow: 'hidden',
            marginTop: 34,
            animation: 'fu .9s .7s both',
          }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: '14px 26px',
                borderRight: i < metaItems.length - 1 ? '1px solid rgba(254,230,34,.18)' : 'none',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: '.3em',
                  color: 'var(--orange)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 17,
                  color: 'var(--gold)',
                  textShadow: '0 0 16px rgba(254,230,34,.5)',
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 5. Countdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 36,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fu .9s .9s both',
          }}
        >
          {countItems.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 72,
                  padding: '14px 10px',
                  background: 'rgba(0,0,0,.4)',
                  border: '1px solid rgba(254,230,34,.22)',
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 40,
                    lineHeight: 1,
                    color: 'var(--gold)',
                    textShadow: '0 0 20px rgba(254,230,34,.6)',
                  }}
                >
                  {item.value}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: '.24em',
                    color: 'var(--dim)',
                    textTransform: 'uppercase',
                    marginTop: 8,
                  }}
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
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: '.3em',
              color: 'var(--dim)',
              textTransform: 'uppercase',
            }}
          >
            Cuộn xuống
          </span>
          <span
            style={{
              width: 12,
              height: 12,
              borderRight: '2px solid var(--gold)',
              borderBottom: '2px solid var(--gold)',
              display: 'block',
              animation: 'ab 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
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
