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
    <section id="awards" className="sec bg-bg2">
      <div className="con">
        <div className="rv mb-14 text-center">
          <span className="ey">Vinh Danh</span>
          <h2 className="st">
            Cơ Cấu <em className="st-em">Giải Thưởng</em>
          </h2>
        </div>

        {/* 4 giải chính */}
        <div className="mb-14 grid grid-cols-4 gap-[18px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {mainAwards.map((a, i) => {
            const isHover = hoveredMain === i;
            return (
              <div
                key={a.rank}
                className={`rv d${(i % 4) + 1} rounded-[18px] bg-[rgba(255,255,255,.03)] px-5 pb-6 pt-7 text-center transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.22,.8,.42,1)]`}
                onMouseEnter={() => setHoveredMain(i)}
                onMouseLeave={() => setHoveredMain(null)}
                style={{
                  border: `1px solid ${a.borderColor}`,
                  transform: isHover ? 'translateY(-10px)' : 'translateY(0)',
                  boxShadow: isHover ? `0 18px 50px ${a.borderColor}` : 'none',
                }}
              >
                <img
                  src={a.medal}
                  alt={a.rank}
                  className="mx-auto mb-4 block h-[80px] w-[80px] object-contain"
                />
                <div
                  className="mb-2.5 font-anton text-[22px] tracking-[.03em]"
                  style={{ color: a.color }}
                >
                  {a.rank}
                </div>
                <div className="mb-3 text-[14px] font-bold text-text">{a.prize}</div>
                <p className="text-[12px] leading-[1.6] text-dim">{a.condition}</p>
              </div>
            );
          })}
        </div>

        {/* 6 giải phụ */}
        <div className="grid grid-cols-3 gap-[18px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {subAwards.map((s, i) => {
            const isHover = hoveredSub === i;
            return (
              <div
                key={s.name}
                className={`rv d${(i % 4) + 1} flex items-start gap-4 rounded-[14px] px-5 py-[22px] transition-[transform,box-shadow,border-color] duration-400 ease-[cubic-bezier(.22,.8,.42,1)]`}
                onMouseEnter={() => setHoveredSub(i)}
                onMouseLeave={() => setHoveredSub(null)}
                style={{
                  background: s.highlight ? 'rgba(254,230,34,.05)' : 'rgba(255,255,255,.03)',
                  border: s.highlight ? '1px solid rgba(254,230,34,.3)' : '1px solid rgba(255,255,255,.07)',
                  transform: isHover ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: isHover ? '0 14px 40px rgba(0,0,0,.35)' : 'none',
                }}
              >
                <div
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] text-[20px]"
                  style={{
                    background: s.highlight ? 'rgba(254,230,34,.1)' : 'rgba(255,255,255,.04)',
                    border: s.highlight ? '1px solid rgba(254,230,34,.25)' : '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="mb-1 font-anton text-[19px] tracking-[.02em]"
                    style={{
                      color: s.highlight ? 'var(--color-gold)' : 'var(--color-text)',
                      textShadow: s.highlight ? '0 0 18px rgba(254,230,34,.4)' : 'none',
                    }}
                  >
                    {s.name}
                  </div>
                  <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-orange">
                    {s.qty}
                  </div>
                  <p className="text-[12px] leading-[1.6] text-dim">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Awards;
