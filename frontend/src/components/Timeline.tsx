type TimelineEvent = {
  date: string;
  name: string;
  desc: string;
  highlight?: boolean;
};

const events: TimelineEvent[] = [
  {
    date: '27/05/2026',
    name: 'Thông Báo Mở Đơn Đăng Ký',
    desc: 'Chính thức công bố SHC3 và mở đơn đăng ký.',
  },
  {
    date: '06/06/2026',
    name: 'Information Day – Kick-Off',
    desc: 'Các Team gặp BTC, nhận thông tin, thi concept.',
  },
  {
    date: '07/06/2026',
    name: 'Concept Photoshooting Day',
    desc: 'Chụp ảnh Team phục vụ Truyền thông.',
  },
  {
    date: '08·10·13/06/2026',
    name: 'Sharing Sessions',
    desc: '3 buổi workshop với Chấy, Bon, Tường Milo.',
  },
  {
    date: '04/07/2026',
    name: 'Tổng Duyệt Chương Trình',
    desc: 'Chạy tổng duyệt tại Hall A, FPT University HCM.',
  },
  {
    date: '05/07/2026 · 18:00',
    name: '🔥 SHOWCASE NIGHT',
    desc: 'Cháy hết mình tại Hall A. Công bố kết quả.',
    highlight: true,
  },
];

const Timeline = () => {
  return (
    <section className="sec bg-bg3">
      <div className="con">
        <span className="ey rv">Lộ Trình</span>
        <h2 className="st rv mb-12">
          Hành Trình <em className="st-em">SHC3</em>
        </h2>

        <div className="rv d1 relative pl-9">
          {/* Vertical line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ background: 'linear-gradient(to bottom, var(--color-orange), var(--color-gold), transparent)' }}
          />

          {events.map((ev) => (
            <div key={ev.name} className="relative mb-7">
              {/* Dot */}
              <div
                className="absolute top-[6px] rounded-full bg-gold"
                style={{
                  left: ev.highlight ? -45 : -43,
                  width: ev.highlight ? 18 : 14,
                  height: ev.highlight ? 18 : 14,
                  boxShadow: ev.highlight
                    ? '0 0 22px rgba(254,230,34,1)'
                    : '0 0 14px rgba(254,230,34,.8)',
                }}
              />

              <div className="sub-label mb-[7px] text-[11px]">{ev.date}</div>
              <div
                className="mb-[6px] font-anton text-[20px]"
                style={{
                  color: ev.highlight ? 'var(--color-gold)' : 'var(--color-text)',
                  textShadow: ev.highlight ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                }}
              >
                {ev.name}
              </div>
              <div className="text-[13px] leading-[1.65] text-dim">{ev.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
