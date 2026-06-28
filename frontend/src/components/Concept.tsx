import { useState } from 'react';
import type { CSSProperties } from 'react';

type Pill = {
  label: string;
  color: string;
};

const pills: Pill[] = [
  { label: 'EMPTINESS', color: 'var(--shiro)' },
  { label: 'AWAKENING', color: 'var(--slatt)' },
  { label: 'INNER CONFLICT', color: 'var(--apex)' },
  { label: 'LETTING GO', color: 'var(--anti)' },
];

const ConceptPill = ({ pill }: { pill: Pill }) => {
  const [hover, setHover] = useState(false);
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '100px',
    padding: '11px 26px',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '.2em',
    textTransform: 'uppercase',
    color: pill.color,
    border: `1px solid ${pill.color}`,
    background: 'color-mix(in srgb, transparent 92%, currentColor)',
    cursor: 'default',
    transform: hover ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform .3s ease',
  };
  return (
    <span
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {pill.label}
    </span>
  );
};

const Concept = () => {
  return (
    <section
      id="concept"
      className="sec"
      style={{
        background: 'var(--bg2)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background mờ */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: "url('/assets/images/bggg.png') center / cover no-repeat",
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      <div className="con" style={{ position: 'relative', zIndex: 2 }}>
        <span className="ey rv">Concept · Khải Huyền</span>

        <h2
          className="rv"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(26px, 3.8vw, 52px)',
            lineHeight: 1.08,
            letterSpacing: '.02em',
            marginBottom: '22px',
          }}
        >
          The category is{' '}
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', textShadow: '0 0 30px rgba(254,230,34,.5)' }}>
            DANCE
          </em>{' '}
          or{' '}
          <em style={{ color: 'var(--gold)', fontStyle: 'normal', textShadow: '0 0 30px rgba(254,230,34,.5)' }}>
            APOCALYPSE
          </em>
        </h2>

        <p
          className="rv d1"
          style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: 'var(--dim)',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          Bốn đội thi hiện thân Tứ Kỵ Sĩ Khải Huyền, mỗi đội mang một trạng thái cảm xúc tận cùng, kể câu chuyện về
          sự sụp đổ và tái sinh qua ngôn ngữ vũ đạo.
        </p>

        <img
          src="/assets/images/typography-banner-dark-tagline.png"
          alt="Heatwave Showcase #3 APOCALYPSE"
          className="rv d2"
          style={{
            width: 'min(500px, 80vw)',
            display: 'block',
            margin: '48px auto',
            animation: 'lp 4s ease-in-out infinite',
          }}
        />

        {/* 4 concept pills */}
        <div
          className="rv d2"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            marginBottom: '56px',
          }}
        >
          {pills.map((pill) => (
            <ConceptPill key={pill.label} pill={pill} />
          ))}
        </div>

        {/* Revelation box */}
        <div
          className="rv d3"
          style={{
            maxWidth: '780px',
            margin: '0 auto',
            border: '1px solid rgba(254,230,34,.2)',
            background: 'rgba(254,230,34,.04)',
            borderRadius: '16px',
            padding: '28px 36px',
            textAlign: 'left',
          }}
        >
          <h3
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: '18px',
              letterSpacing: '.04em',
              color: 'var(--gold)',
              marginBottom: '14px',
              textShadow: '0 0 20px rgba(254,230,34,.4)',
            }}
          >
            ✦ NGUỒN CẢM HỨNG: BOOK OF REVELATION
          </h3>
          <p style={{ fontSize: '14.5px', lineHeight: 1.85, color: 'var(--dim)' }}>
            Concept lấy cảm hứng từ Book of Revelation, xoay quanh Seven Seals, bảy ấn phong giữ cân bằng thế giới,
            dần bị con người phá vỡ bởi tham lam và xung đột, kéo theo các kiếp nạn phản ánh sự sụp đổ nội tại. Khi bốn
            ấn đầu mở ra, Four Horsemen of the Apocalypse xuất hiện như những thực thể thanh lọc, đẩy thế giới đến giới
            hạn cuối cùng. Sụp đổ không phải là kết thúc, mà là khởi đầu cho tái sinh và một vòng cân bằng mới.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Concept;
