import type { ReactNode } from 'react';

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

type InfoRowProps = {
  icon: ReactNode;
  title: string;
  sub: string;
};

const InfoRow = ({ icon, title, sub }: InfoRowProps) => (
  <div className="flex items-center gap-4 py-3">
    <div className="icon-box">{icon}</div>
    <div>
      <div className="text-[15px] font-bold text-text">{title}</div>
      <div className="mt-0.5 text-[13px] text-dim">{sub}</div>
    </div>
  </div>
);

const About = () => {
  return (
    <section id="event" className="sec bg-bg">
      <div className="con grid grid-cols-2 items-center gap-20 max-lg:grid-cols-1 max-lg:gap-14">
        {/* CỘT TRÁI */}
        <div className="rv">
          <span className="ey">Về Sự Kiện</span>
          <h2 className="st mb-7">
            Heatwave Showcase <em className="st-em">#3</em>
          </h2>

          <p className="paragraph">
            Heatwave Showcase là sự kiện thường niên quy mô lớn nhất của FStyle Crew — nơi các vũ công thể hiện đam mê,
            bản lĩnh và tinh thần không ngừng cố gắng trên sân khấu lớn.
          </p>
          <p className="paragraph">
            Mùa 3 mang chủ đề APOCALYPSE — lấy cảm hứng từ Sách Khải Huyền, nơi bốn đội thi hiện thân cho bốn Kỵ Sĩ
            mang theo những trạng thái cảm xúc tận cùng của con người.
          </p>
          <p className="paragraph mb-[34px]">
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
        <div className="rv d2 relative">
          <img
            src="/assets/images/manh-vo.png"
            alt=""
            aria-hidden="true"
            className="absolute -top-10 -right-5 z-2 w-[100px] animate-float-shard opacity-90 pointer-events-none"
          />
          <img
            src="/assets/images/artboard1.png"
            alt="Heatwave Showcase #3 APOCALYPSE"
            className="block w-full rounded-[20px] shadow-[0_0_80px_rgba(254,230,34,.2)] border border-[rgba(254,230,34,.22)]"
          />
          <img
            src="/assets/images/manhvo-do.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-9 -left-[22px] z-2 w-[90px] opacity-85 pointer-events-none"
            style={{ animation: 'fs 9s 3s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
