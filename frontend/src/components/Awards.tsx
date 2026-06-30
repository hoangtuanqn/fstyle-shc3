import { Clapperboard, Crown, Flame, GraduationCap, Sparkles } from 'lucide-react';
import { type ReactNode, useState } from 'react';

type MainAward = {
  medal: string;
  rank: string;
  prize: string;
  color: string;
  borderColor: string;
  condition: string;
};

type SubAward = {
  icon: ReactNode;
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
    condition: 'Điểm TB cao nhất từ 03 BGK',
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
  { icon: <span className="text-[20px]">💃</span>, name: 'Kỹ Thuật', qty: '01 giải', desc: 'TB điểm Kỹ thuật cao nhất từ 03 BGK.' },
  { icon: <Clapperboard size={20} strokeWidth={1.75} className="text-[#c084fc]" />, name: 'Biên Đạo', qty: '01 giải', desc: 'TB điểm Biên dựng cao nhất từ 03 BGK.' },
  { icon: <Crown size={20} strokeWidth={1.75} className="text-[#fbbf24]" />, name: 'Trưởng Nhóm', qty: '01 giải', desc: 'Điểm quá trình cao nhất + BTC đánh giá.' },
  { icon: <Sparkles size={20} strokeWidth={1.75} className="text-[#f472b6]" />, name: 'Phong Cách', qty: '01 giải', desc: 'TB điểm Phục trang cao nhất từ 03 BGK.' },
  {
    icon: <Flame size={20} strokeWidth={1.75} className="text-[#fb923c]" />,
    name: 'Nỗ Lực',
    qty: '04 giải · Never Stop Trying!',
    desc: 'Chuyên cần 30% + BTC 30% + thành viên vote 40%. Mỗi team 1 người.',
    highlight: true,
  },
  { icon: <GraduationCap size={20} strokeWidth={1.75} className="text-[#34d399]" />, name: 'Tri Ân Mentor', qty: '13 giải', desc: 'Team Mentor tự động nhận quà từ Ban Tổ Chức.' },
];

const Awards = () => {
  const [hoveredMain, setHoveredMain] = useState<number | null>(null);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);

  return (
    <section id="awards" className="sec bg-[var(--bg2)]">
      <div className="con">
        <div className="rv text-center mb-14">
          <span className="ey">Vinh Danh</span>
          <h2 className="st">
            Cơ Cấu <em>Giải Thưởng</em>
          </h2>
        </div>

        {/* 4 giải chính */}
        <div className="awards-main-grid grid grid-cols-4 gap-[18px] mb-14">
          {mainAwards.map((a, i) => {
            const isHover = hoveredMain === i;
            return (
              <div
                key={a.rank}
                className={`rv d${(i % 4) + 1} rounded-[18px] pt-[28px] px-5 pb-6 bg-[rgba(255,255,255,.03)] text-center [transition:transform_.4s_cubic-bezier(.22,.8,.42,1),box-shadow_.4s]`}
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
                  className="w-20 h-20 object-contain mx-auto mb-4 block"
                />
                <div
                  className="text-[22px] tracking-[.03em] mb-[10px] font-anton"
                  style={{ color: a.color }}
                >
                  {a.rank}
                </div>
                <div className="text-[14px] font-bold text-[var(--text)] mb-3">
                  {a.prize}
                </div>
                <p className="text-[12px] leading-[1.6] text-[var(--dim)]">{a.condition}</p>
              </div>
            );
          })}
        </div>

        {/* 6 giải phụ */}
        <div className="awards-sub-grid grid grid-cols-3 gap-[18px]">
          {subAwards.map((s, i) => {
            const isHover = hoveredSub === i;
            return (
              <div
                key={s.name}
                className={`rv d${(i % 4) + 1} rounded-[14px] py-[22px] px-5 flex gap-4 items-start [transition:transform_.4s_cubic-bezier(.22,.8,.42,1),box-shadow_.4s,border-color_.4s]`}
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
                  className="shrink-0 w-[42px] h-[42px] rounded-[11px] flex items-center justify-center"
                  style={{
                    background: s.highlight ? 'rgba(254,230,34,.1)' : 'rgba(255,255,255,.04)',
                    border: s.highlight ? '1px solid rgba(254,230,34,.25)' : '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="text-[19px] tracking-[.02em] mb-1 font-anton"
                    style={{
                      color: s.highlight ? 'var(--gold)' : 'var(--text)',
                      textShadow: s.highlight ? '0 0 18px rgba(254,230,34,.4)' : 'none',
                    }}
                  >
                    {s.name}
                  </div>
                  <div className="text-[10px] font-extrabold tracking-[.16em] uppercase text-[var(--orange)] mb-2">
                    {s.qty}
                  </div>
                  <p className="text-[12px] leading-[1.6] text-[var(--dim)]">{s.desc}</p>
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
