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
    <section className="sec" style={{ background: 'var(--bg3)' }}>
      <div className="con">
        <div className="rv" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="ey">Lộ Trình</span>
          <h2 className="st">
            Hành Trình <em>SHC3</em>
          </h2>
        </div>

        <div className="tl-wrap rv d1" style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          {/* Center line */}
          <div
            className="tl-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, var(--orange), var(--gold), transparent)',
            }}
          />

          {events.map((ev, i) => {
            const isLeft = i % 2 === 0;
            const isHover = hovered === i;
            return (
              <div
                key={ev.name}
                className={`tl-item rv`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: i === events.length - 1 ? 0 : 40,
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {/* Card */}
                <div
                  className="tl-card"
                  style={{
                    width: 'calc(50% - 32px)',
                    padding: '18px 20px',
                    borderRadius: 14,
                    background: ev.highlight ? 'rgba(254,230,34,.06)' : 'rgba(255,255,255,.03)',
                    border: `1px solid ${ev.highlight ? 'rgba(254,230,34,.2)' : isHover ? 'rgba(254,230,34,.15)' : 'rgba(255,255,255,.07)'}`,
                    textAlign: isLeft ? 'right' : 'left',
                    transition: 'transform .35s cubic-bezier(.22,.8,.42,1), border-color .3s',
                    transform: isHover ? `translateX(${isLeft ? '-6px' : '6px'})` : 'translateX(0)',
                  }}
                >
                  <ev.Icon
                    size={16}
                    color={ev.highlight ? 'var(--gold)' : 'var(--orange)'}
                    style={{ marginBottom: 8 }}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '.2em',
                      color: 'var(--orange)',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 17,
                      color: ev.highlight ? 'var(--gold)' : 'var(--text)',
                      textShadow: ev.highlight ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                      marginBottom: 6,
                    }}
                  >
                    {ev.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--dim)', lineHeight: 1.6 }}>{ev.desc}</div>
                </div>

                {/* Dot on center line */}
                <div
                  style={{
                    width: 64,
                    display: 'flex',
                    justifyContent: 'center',
                    flexShrink: 0,
                    paddingTop: 18,
                  }}
                >
                  <div
                    style={{
                      width: ev.highlight ? 16 : 12,
                      height: ev.highlight ? 16 : 12,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      boxShadow: ev.highlight
                        ? '0 0 22px rgba(254,230,34,1)'
                        : isHover
                          ? '0 0 18px rgba(254,230,34,.9)'
                          : '0 0 10px rgba(254,230,34,.6)',
                      transition: 'box-shadow .3s',
                    }}
                  />
                </div>

                {/* Spacer for the other side */}
                <div className="tl-spacer" style={{ width: 'calc(50% - 32px)' }} />
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
