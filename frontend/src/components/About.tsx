import type { CSSProperties, ReactNode } from 'react';

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TeamsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const paragraphStyle: CSSProperties = {
  fontSize: '16px',
  lineHeight: 1.85,
  color: 'var(--dim)',
  marginBottom: '18px',
};

type InfoRowProps = {
  icon: ReactNode;
  title: string;
  sub: string;
};

const InfoRow = ({ icon, title, sub }: InfoRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0' }}>
    <div
      style={{
        flexShrink: 0,
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(254,230,34,.07)',
        border: '1px solid rgba(254,230,34,.18)',
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--dim)', marginTop: '2px' }}>{sub}</div>
    </div>
  </div>
);

const About = () => {
  return (
    <section id="event" className="sec" style={{ background: 'var(--bg)' }}>
      <div
        className="con about-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* CỘT TRÁI */}
        <div className="rv">
          <span className="ey">Về Sự Kiện</span>
          <h2 className="st" style={{ marginBottom: '28px' }}>
            Heatwave Showcase <em>#3</em>
          </h2>

          <p style={paragraphStyle}>
            Heatwave Showcase là sự kiện thường niên quy mô lớn nhất của FStyle Crew — nơi các vũ công thể hiện đam mê,
            bản lĩnh và tinh thần không ngừng cố gắng trên sân khấu lớn.
          </p>
          <p style={paragraphStyle}>
            Mùa 3 mang chủ đề APOCALYPSE — lấy cảm hứng từ Sách Khải Huyền, nơi bốn đội thi hiện thân cho bốn Kỵ Sĩ
            mang theo những trạng thái cảm xúc tận cùng của con người.
          </p>
          <p style={{ ...paragraphStyle, marginBottom: '34px' }}>
            Sụp đổ không phải là kết thúc — mà là khởi đầu cho sự tái sinh.
          </p>

          <InfoRow
            icon={<CalendarIcon />}
            title="Chủ Nhật, 05 tháng 07 năm 2026"
            sub="Bắt đầu lúc 18:00"
          />
          <InfoRow
            icon={<LocationIcon />}
            title="Hall A – FPT University HCM Campus"
            sub="Lô E2a-7, Đường D1, TP. Thủ Đức"
          />
          <InfoRow
            icon={<TeamsIcon />}
            title="4 Đội Thi Tranh Tài"
            sub="SHIRO KURO · Apex Aura · SLATT · ANTI"
          />
        </div>

        {/* CỘT PHẢI */}
        <div className="rv d2" style={{ position: 'relative' }}>
          <img
            src="/assets/images/manh-vo.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-20px',
              width: '100px',
              opacity: 0.9,
              zIndex: 2,
              animation: 'fs 7s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
          <img
            src="/assets/images/artboard1.png"
            alt="Heatwave Showcase #3 APOCALYPSE"
            style={{
              width: '100%',
              display: 'block',
              borderRadius: '20px',
              boxShadow: '0 0 80px rgba(254,230,34,.2)',
              border: '1px solid rgba(254,230,34,.22)',
            }}
          />
          <img
            src="/assets/images/manhvo-do.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-36px',
              left: '-22px',
              width: '90px',
              opacity: 0.85,
              zIndex: 2,
              animation: 'fs 9s 3s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
