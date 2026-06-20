import { useState } from 'react';

type Performance = {
  num: string;
  name: string;
  by: string;
  tag: string;
  tagColor?: string;
  tagBg?: string;
  teamColor?: string;
};

const performances: Performance[] = [
  {
    num: '01',
    name: 'Earth Song',
    by: 'Trần Ngọc Vi Lam · Top 18 Sing Out Loud 2026',
    tag: 'Mở màn',
    tagColor: 'var(--gold)',
    tagBg: 'rgba(254,230,34,.1)',
  },
  { num: '02', name: 'Tứ Kỵ Sĩ Khải Huyền', by: 'SHIRO KURO · Emptiness', tag: 'Team', teamColor: 'var(--shiro)' },
  { num: '03', name: 'Tứ Kỵ Sĩ Khải Huyền', by: 'Apex Aura · Inner Conflict', tag: 'Team', teamColor: 'var(--apex)' },
  { num: '04', name: 'Tứ Kỵ Sĩ Khải Huyền', by: 'SLATT · Awakening', tag: 'Team', teamColor: 'var(--slatt)' },
  { num: '05', name: 'Tứ Kỵ Sĩ Khải Huyền', by: 'ANTI · Letting Go', tag: 'Team', teamColor: 'var(--anti)' },
  {
    num: '06',
    name: 'Công Lý',
    by: 'FStyle Crew · Performer',
    tag: 'FStyle',
    tagColor: 'var(--orange)',
    tagBg: 'rgba(251,140,5,.08)',
  },
  {
    num: '07',
    name: 'Special Guest Performance',
    by: 'M Tú',
    tag: '★ Guest',
    tagColor: 'var(--gold)',
    tagBg: 'rgba(254,230,34,.1)',
  },
  { num: '08', name: 'Sự Tĩnh Lặng Từ Thiên Đường', by: 'Remix One Crew', tag: 'Finale' },
];

const judges = [
  { name: 'CHẤY', role: 'Judge', crew: 'C.O Crew', img: '/assets/pptx-images/image19.png' },
  { name: 'BON', role: 'Judge', crew: 'JustMove Crew', img: '/assets/pptx-images/image21.png' },
  { name: 'M TÚ', role: 'Special Guest', crew: 'Performer', img: '/assets/pptx-images/image20.png' },
];

const ShowcaseNight = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredJudge, setHoveredJudge] = useState<number | null>(null);

  return (
    <section className="sec bg-bg2">
      <div className="con">
        <span className="ey rv">Đêm Diễn</span>
        <h2 className="st rv">
          Showcase <em className="st-em">Night</em>
        </h2>

        <div className="mt-[52px] grid grid-cols-2 gap-16 max-lg:grid-cols-1 max-lg:gap-12">
          {/* LEFT — Program */}
          <div className="rv">
            <div className="sub-label mb-[18px]">Chương Trình Biểu Diễn</div>
            <div className="flex flex-col gap-2.5">
              {performances.map((p, i) => (
                <div
                  key={p.num}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="flex items-center gap-4 rounded-xl bg-[rgba(255,255,255,.03)] px-[18px] py-[14px] transition-[border-color] duration-300"
                  style={{
                    border: `1px solid ${hoveredRow === i ? 'rgba(254,230,34,.2)' : 'rgba(255,255,255,.07)'}`,
                  }}
                >
                  <span
                    className="min-w-[30px] font-anton text-[20px]"
                    style={{ color: p.teamColor || 'var(--dim)' }}
                  >
                    {p.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-bold text-text">{p.name}</div>
                    <div className="mt-[3px] text-[12.5px] text-dim">{p.by}</div>
                  </div>
                  <span
                    className="whitespace-nowrap rounded-full px-[11px] py-[5px] text-[10px] font-extrabold uppercase tracking-[.1em]"
                    style={{
                      color: p.teamColor || p.tagColor || 'var(--dim)',
                      background: p.tagBg || 'rgba(255,255,255,.04)',
                      border: `1px solid ${p.teamColor || p.tagColor || 'rgba(255,255,255,.12)'}`,
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Judges + Vote */}
          <div className="rv d2">
            <div className="sub-label mb-[18px]">Ban Giám Khảo</div>

            <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2">
              {judges.map((j, i) => (
                <div
                  key={j.name}
                  onMouseEnter={() => setHoveredJudge(i)}
                  onMouseLeave={() => setHoveredJudge(null)}
                  className="overflow-hidden rounded-[14px] bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] transition-transform duration-400 ease-[cubic-bezier(.22,.8,.42,1)]"
                  style={{
                    transform: hoveredJudge === i ? 'translateY(-6px)' : 'translateY(0)',
                  }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={j.img}
                      alt={j.name}
                      className="block h-full w-full object-cover object-top transition-[filter] duration-400"
                      style={{
                        filter: hoveredJudge === i ? 'grayscale(0%)' : 'grayscale(30%)',
                      }}
                    />
                  </div>
                  <div className="px-3 pb-4 pt-[14px] text-center">
                    <div className="font-anton text-[18px] text-text">{j.name}</div>
                    <div className="mx-0 mb-[3px] mt-[6px] text-[9px] font-extrabold uppercase tracking-[.16em] text-orange">
                      {j.role}
                    </div>
                    <div className="text-[11.5px] text-dim">{j.crew}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote box */}
            <div className="mt-6 rounded-[14px] border border-[rgba(254,230,34,.15)] bg-[rgba(254,230,34,.05)] px-[26px] py-[22px]">
              <div className="mb-2 font-anton text-[20px] text-gold [text-shadow:0_0_18px_rgba(254,230,34,.4)]">
                🏆 Team Được Yêu Thích Nhất
              </div>
              <div className="text-[13.5px] leading-[1.7] text-dim">
                Giải bình chọn dựa trên 50% vote online từ khán giả và 50% bình chọn trực tiếp tại đêm diễn. Hãy cùng
                cổ vũ cho team bạn yêu thích nhất!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseNight;
