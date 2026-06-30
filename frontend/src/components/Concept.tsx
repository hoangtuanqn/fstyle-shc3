import { useState } from 'react';

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
  return (
    <span
      className="inline-flex items-center rounded-[100px] py-[11px] px-[26px] text-[12px] font-extrabold tracking-[.2em] uppercase bg-[color-mix(in_srgb,transparent_92%,currentColor)] cursor-default [transition:transform_.3s_ease]"
      style={{
        color: pill.color,
        border: `1px solid ${pill.color}`,
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}
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
      className="sec bg-[var(--bg2)] text-center relative overflow-hidden"
    >
      {/* Background mờ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background:url('/assets/images/bggg.png')_center/cover_no-repeat] opacity-[.06] pointer-events-none"
      />

      <div className="con relative z-[2]">
        <span className="ey rv">Concept · Khải Huyền</span>

        <h2
          className="rv text-[clamp(26px,3.8vw,52px)] leading-[1.08] tracking-[.02em] mb-[22px] font-anton"
        >
          The category is{' '}
          <em className="text-[var(--gold)] not-italic [text-shadow:0_0_30px_rgba(254,230,34,.5)]">
            DANCE
          </em>{' '}
          or{' '}
          <em className="text-[var(--gold)] not-italic [text-shadow:0_0_30px_rgba(254,230,34,.5)]">
            APOCALYPSE
          </em>
        </h2>

        <p className="rv d1 text-base leading-[1.8] text-[var(--dim)] max-w-[720px] mx-auto">
          Bốn đội thi hiện thân Tứ Kỵ Sĩ Khải Huyền, mỗi đội mang một trạng thái cảm xúc tận cùng, kể câu chuyện về
          sự sụp đổ và tái sinh qua ngôn ngữ vũ đạo.
        </p>

        <img
          src="/assets/images/typography-banner-dark-tagline.png"
          alt="Heatwave Showcase #3 APOCALYPSE"
          className="rv d2 [width:min(500px,80vw)] block mx-auto my-12 [animation:lp_4s_ease-in-out_infinite]"
        />

        {/* 4 concept pills */}
        <div className="rv d2 flex flex-wrap gap-[14px] justify-center mb-14">
          {pills.map((pill) => (
            <ConceptPill key={pill.label} pill={pill} />
          ))}
        </div>

        {/* Revelation box */}
        <div className="rv d3 max-w-[780px] mx-auto border border-[rgba(254,230,34,.2)] bg-[rgba(254,230,34,.04)] rounded-2xl py-7 px-9 text-left">
          <h3
            className="text-[18px] tracking-[.04em] text-[var(--gold)] mb-[14px] [text-shadow:0_0_20px_rgba(254,230,34,.4)] font-anton"
          >
            ✦ NGUỒN CẢM HỨNG: BOOK OF REVELATION
          </h3>
          <p className="text-[14.5px] leading-[1.85] text-[var(--dim)]">
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
