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
    <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[rgba(254,230,34,.07)] border border-[rgba(254,230,34,.18)]">
      {icon}
    </div>
    <div>
      <div className="text-[15px] font-bold text-[var(--text)]">{title}</div>
      <div className="text-[13px] text-[var(--dim)] mt-0.5">{sub}</div>
    </div>
  </div>
);

const About = () => {
  return (
    <section id="event" className="sec bg-[var(--bg)]">
      <div className="con about-grid grid grid-cols-2 gap-20 items-center">
        {/* CỘT TRÁI */}
        <div className="rv">
          <span className="ey">Về Sự Kiện</span>
          <h2 className="st mb-7">
            Heatwave Showcase <em>#3</em>
          </h2>

          <p className="text-[16px] leading-[1.85] text-[var(--dim)] mb-[18px]">
            Dự án thường niên của FStyle Crew, tổ chức mỗi mùa hè. Không chỉ là sân khấu trình diễn, mà còn là hành trình
            rèn luyện tư duy sáng tạo, kỹ năng biên đạo và bản lĩnh sân khấu.
          </p>
          <p className="text-[16px] leading-[1.85] text-[var(--dim)] mb-[18px]">
            Mùa 3 mang chủ đề APOCALYPSE, lấy cảm hứng từ Book of Revelation. Bốn đội thi hiện thân Tứ Kỵ Sĩ Khải Huyền,
            kể câu chuyện về sự sụp đổ và tái sinh qua ngôn ngữ vũ đạo.
          </p>

          <InfoRow
            icon={<CalendarIcon />}
            title="Chủ Nhật, 05 tháng 07 năm 2026"
            sub="Bắt đầu lúc 18:00"
          />
          <InfoRow
            icon={<LocationIcon />}
            title="Hall A, FPT University HCM Campus"
            sub="Lô E2a-7, Đường D1, TP. Thủ Đức"
          />
          <InfoRow
            icon={<TeamsIcon />}
            title="4 Đội Thi Tranh Tài
"
            sub="SHIRO KURO · Apex Aura · SLATT · ANTI-X"
          />
        </div>

        {/* CỘT PHẢI */}
        <div className="rv d2 relative">
          <img
            src="/assets/images/manh-vo.png"
            alt=""
            aria-hidden="true"
            className="absolute -top-10 -right-5 w-[100px] opacity-90 z-[2] [animation:fs_7s_ease-in-out_infinite] pointer-events-none"
          />
          <img
            src="/assets/images/artboard1.png"
            alt="Heatwave Showcase #3 APOCALYPSE"
            className="w-full block rounded-[20px] shadow-[0_0_80px_rgba(254,230,34,.2)] border border-[rgba(254,230,34,.22)]"
          />
          <img
            src="/assets/images/manhvo-do.png"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-9 [left:-22px] w-[90px] opacity-[.85] z-[2] [animation:fs_9s_3s_ease-in-out_infinite] pointer-events-none"
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
