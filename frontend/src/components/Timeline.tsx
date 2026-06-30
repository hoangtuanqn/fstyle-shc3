import { useState } from 'react';
import { Megaphone, Target, Camera, GraduationCap, Vote, Clapperboard, Flame } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type TimelineEvent = {
  date: string;
  name: string;
  desc: string;
  highlight?: boolean;
  Icon: LucideIcon;
};

const events: TimelineEvent[] = [
  {
    date: '27/05',
    name: 'Mở Đơn Đăng Ký',
    desc: 'Công bố chính thức SHC3: APOCALYPSE.',
    Icon: Megaphone,
  },
  {
    date: '06/06',
    name: 'Information Day',
    desc: 'Gặp gỡ BTC, nhận thông tin, thi đấu giành concept.',
    Icon: Target,
  },
  {
    date: '07/06',
    name: 'Photoshooting Day',
    desc: 'Chụp ảnh Team phục vụ truyền thông và bình chọn.',
    Icon: Camera,
  },
  {
    date: '08·10·13/06',
    name: 'Sharing Sessions',
    desc: '3 buổi workshop cùng Chấy, Bon và Tường Milo.',
    Icon: GraduationCap,
  },
  {
    date: '29/06 → 03/07',
    name: 'Bình Chọn Online',
    desc: 'Vote giải "Team Được Yêu Thích Nhất" (50% kết quả).',
    Icon: Vote,
  },
  {
    date: '04/07',
    name: 'Tổng Duyệt',
    desc: 'Tổng duyệt tại Hall A, FPT University HCM.',
    Icon: Clapperboard,
  },
  {
    date: '05/07 · 18:00',
    name: 'SHOWCASE NIGHT',
    desc: 'Cháy hết mình tại Hall A. Công bố kết quả.',
    highlight: true,
    Icon: Flame,
  },
];

const Timeline = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="timeline" className="sec bg-[var(--bg3)]">
      <div className="con">
        <div className="rv text-center mb-14">
          <span className="ey">Lộ Trình</span>
          <h2 className="st">
            Hành Trình <em>SHC3</em>
          </h2>
        </div>

        <div className="tl-wrap rv d1 relative max-w-[900px] mx-auto">
          {/* Center line */}
          <div className="tl-line absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-[linear-gradient(to_bottom,var(--orange),var(--gold),transparent)]" />

          {events.map((ev, i) => {
            const isLeft = i % 2 === 0;
            const isHover = hovered === i;
            return (
              <div
                key={ev.name}
                className="tl-item rv flex items-start"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  marginBottom: i === events.length - 1 ? 0 : 40,
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {/* Card */}
                <div
                  className="tl-card w-[calc(50%-32px)] py-[18px] px-5 rounded-[14px] transition-[transform_.35s_cubic-bezier(.22,.8,.42,1),border-color_.3s]"
                  style={{
                    background: ev.highlight ? 'rgba(254,230,34,.06)' : 'rgba(255,255,255,.03)',
                    border: `1px solid ${ev.highlight ? 'rgba(254,230,34,.2)' : isHover ? 'rgba(254,230,34,.15)' : 'rgba(255,255,255,.07)'}`,
                    textAlign: isLeft ? 'right' : 'left',
                    transform: isHover ? `translateX(${isLeft ? '-6px' : '6px'})` : 'translateX(0)',
                  }}
                >
                  <ev.Icon size={16} color={ev.highlight ? 'var(--gold)' : 'var(--orange)'} className="mb-2" />
                  <div className="text-[10px] font-extrabold tracking-[.2em] text-[var(--orange)] uppercase mb-[6px]">
                    {ev.date}
                  </div>
                  <div
                    className="text-[17px] mb-[6px] font-anton"
                    style={{
                      color: ev.highlight ? 'var(--gold)' : 'var(--text)',
                      textShadow: ev.highlight ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                    }}
                  >
                    {ev.name}
                  </div>
                  <div className="text-[12.5px] text-[var(--dim)] leading-[1.6]">{ev.desc}</div>
                </div>

                {/* Dot on center line */}
                <div className="w-16 flex justify-center shrink-0 pt-[18px]">
                  <div
                    className="rounded-full bg-[var(--gold)] transition-[box-shadow_.3s]"
                    style={{
                      width: ev.highlight ? 16 : 12,
                      height: ev.highlight ? 16 : 12,
                      boxShadow: ev.highlight
                        ? '0 0 22px rgba(254,230,34,1)'
                        : isHover
                          ? '0 0 18px rgba(254,230,34,.9)'
                          : '0 0 10px rgba(254,230,34,.6)',
                    }}
                  />
                </div>

                {/* Spacer for the other side */}
                <div className="tl-spacer w-[calc(50%-32px)]" />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tl-line { left: 20px !important; }
          .tl-item { flex-direction: row-reverse !important; }
          .tl-card { width: 100% !important; text-align: left !important; }
          .tl-spacer { display: none !important; }
          .tl-item > div:nth-child(2) { position: absolute; left: 13px; }
          .tl-wrap { padding-left: 48px; }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
