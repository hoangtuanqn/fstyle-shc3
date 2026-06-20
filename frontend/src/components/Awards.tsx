import { useState } from 'react';

type MainAward = {
  medal: string;
  rank: string;
  prize: string;
  color: string;
  borderColor: string;
  condition: string;
};

type SubAward = {
  icon: string;
  name: string;
  qty: string;
  desc: string;
  highlight?: boolean;
};

const mainAwards: MainAward[] = [
  {
    medal: '/assets/images/gold-medal.png',
    rank: 'QUÁN QUÂN',
    prize: '1.500.000 VND',
    color: '#FEE622',
    borderColor: 'rgba(254,230,34,.3)',
    condition: 'Điểm TB cao nhất — 03 BGK',
  },
  {
    medal: '/assets/images/silver-medal.png',
    rank: 'Á QUÂN',
    prize: '1.000.000 VND',
    color: '#c0c0c0',
    borderColor: 'rgba(192,192,192,.2)',
    condition: 'Điểm TB cao nhì',
  },
  {
    medal: '/assets/images/bronze-medal.png',
    rank: 'KHUYẾN KHÍCH',
    prize: '500.000 VND × 2',
    color: '#cd7f32',
    borderColor: 'rgba(205,127,50,.2)',
    condition: 'Điểm TB cao ba',
  },
  {
    medal: '/assets/images/fragile.png',
    rank: 'YÊU THÍCH',
    prize: 'Bảng Khen',
    color: 'var(--orange)',
    borderColor: 'rgba(251,140,5,.2)',
    condition: '50% Vote Online + 50% Trực tiếp',
  },
];

const subAwards: SubAward[] = [
  { icon: '⚙️', name: 'Kỹ Thuật', qty: '01 giải', desc: 'TB điểm Kỹ thuật cao nhất từ 03 BGK.' },
  { icon: '🎭', name: 'Biên Đạo', qty: '01 giải', desc: 'TB điểm Biên dựng cao nhất từ 03 BGK.' },
  { icon: '👑', name: 'Trưởng Nhóm', qty: '01 giải', desc: 'Điểm quá trình cao nhất + BTC đánh giá.' },
  { icon: '✨', name: 'Phong Cách', qty: '01 giải', desc: 'TB điểm Phục trang cao nhất từ 03 BGK.' },
  {
    icon: '🔥',
    name: 'Nỗ Lực',
    qty: '04 giải — Never Stop Trying!',
    desc: 'Chuyên cần 30% + BTC 30% + thành viên vote 40%. Mỗi team 1 người.',
    highlight: true,
  },
  { icon: '🙏', name: 'Tri Ân Mentor', qty: '13 giải', desc: 'Team Mentor tự động nhận quà từ Ban Tổ Chức.' },
];

const Awards = () => {
  const [hoveredMain, setHoveredMain] = useState<number | null>(null);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);

  return (
    <section id="awards" className="sec" style={{ background: 'var(--bg2)' }}>
      <div className="con">
        <div className="rv" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="ey">Vinh Danh</span>
          <h2 className="st">
            Cơ Cấu <em>Giải Thưởng</em>
          </h2>
        </div>

        {/* 4 giải chính */}
        <div
          className="awards-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 18,
            marginBottom: 56,
          }}
        >
          {mainAwards.map((a, i) => {
            const isHover = hoveredMain === i;
            return (
              <div
                key={a.rank}
                className={`rv d${(i % 4) + 1}`}
                onMouseEnter={() => setHoveredMain(i)}
                onMouseLeave={() => setHoveredMain(null)}
                style={{
                  borderRadius: 18,
                  padding: '28px 20px 24px',
                  background: 'rgba(255,255,255,.03)',
                  border: `1px solid ${a.borderColor}`,
                  textAlign: 'center',
                  transition: 'transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s',
                  transform: isHover ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: isHover ? `0 18px 50px ${a.borderColor}` : 'none',
                }}
              >
                <img
                  src={a.medal}
                  alt={a.rank}
                  style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 16px', display: 'block' }}
                />
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 22,
                    letterSpacing: '.03em',
                    color: a.color,
                    marginBottom: 10,
                  }}
                >
                  {a.rank}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 12,
                  }}
                >
                  {a.prize}
                </div>
                <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--dim)' }}>{a.condition}</p>
              </div>
            );
          })}
        </div>

        {/* 6 giải phụ */}
        <div
          className="awards-sub-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 18,
          }}
        >
          {subAwards.map((s, i) => {
            const isHover = hoveredSub === i;
            return (
              <div
                key={s.name}
                className={`rv d${(i % 4) + 1}`}
                onMouseEnter={() => setHoveredSub(i)}
                onMouseLeave={() => setHoveredSub(null)}
                style={{
                  borderRadius: 14,
                  padding: '22px 20px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  background: s.highlight ? 'rgba(254,230,34,.05)' : 'rgba(255,255,255,.03)',
                  border: s.highlight ? '1px solid rgba(254,230,34,.3)' : '1px solid rgba(255,255,255,.07)',
                  transition: 'transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s, border-color .4s',
                  transform: isHover ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: isHover ? '0 14px 40px rgba(0,0,0,.35)' : 'none',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    background: s.highlight ? 'rgba(254,230,34,.1)' : 'rgba(255,255,255,.04)',
                    border: s.highlight ? '1px solid rgba(254,230,34,.25)' : '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 19,
                      letterSpacing: '.02em',
                      color: s.highlight ? 'var(--gold)' : 'var(--text)',
                      marginBottom: 4,
                      textShadow: s.highlight ? '0 0 18px rgba(254,230,34,.4)' : 'none',
                    }}
                  >
                    {s.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '.16em',
                      textTransform: 'uppercase',
                      color: 'var(--orange)',
                      marginBottom: 8,
                    }}
                  >
                    {s.qty}
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--dim)' }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .awards-main-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .awards-sub-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .awards-main-grid { grid-template-columns: 1fr !important; }
          .awards-sub-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Awards;
