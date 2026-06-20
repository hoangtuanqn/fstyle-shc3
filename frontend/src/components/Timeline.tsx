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
    <section className="sec" style={{ background: 'var(--bg3)' }}>
      <div className="con">
        <span className="ey rv">Lộ Trình</span>
        <h2 className="st rv" style={{ marginBottom: 48 }}>
          Hành Trình <em>SHC3</em>
        </h2>

        <div
          className="rv d1"
          style={{
            position: 'relative',
            paddingLeft: 36,
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(to bottom, var(--orange), var(--gold), transparent)',
            }}
          />

          {events.map((ev) => {
            const dotSize = ev.highlight ? 18 : 14;
            return (
              <div
                key={ev.name}
                style={{
                  position: 'relative',
                  marginBottom: 28,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: ev.highlight ? -45 : -43,
                    top: 6,
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    boxShadow: ev.highlight
                      ? '0 0 22px rgba(254,230,34,1)'
                      : '0 0 14px rgba(254,230,34,.8)',
                  }}
                />

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.2em',
                    color: 'var(--orange)',
                    textTransform: 'uppercase',
                    marginBottom: 7,
                  }}
                >
                  {ev.date}
                </div>
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 20,
                    color: ev.highlight ? 'var(--gold)' : 'var(--text)',
                    textShadow: ev.highlight ? '0 0 24px rgba(254,230,34,.6)' : 'none',
                    marginBottom: 6,
                  }}
                >
                  {ev.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.65 }}>{ev.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
