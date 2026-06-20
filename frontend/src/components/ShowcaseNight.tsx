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
    <section className="sec" style={{ background: 'var(--bg2)' }}>
      <div className="con">
        <span className="ey rv">Đêm Diễn</span>
        <h2 className="st rv">
          Showcase <em>Night</em>
        </h2>

        <div
          className="sn-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            marginTop: 52,
          }}
        >
          {/* LEFT — Program */}
          <div className="rv">
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.2em',
                color: 'var(--orange)',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              Chương Trình Biểu Diễn
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {performances.map((p, i) => (
                <div
                  key={p.num}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,.03)',
                    border: `1px solid ${hoveredRow === i ? 'rgba(254,230,34,.2)' : 'rgba(255,255,255,.07)'}`,
                    transition: 'border-color .3s',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 20,
                      color: p.teamColor || 'var(--dim)',
                      minWidth: 30,
                    }}
                  >
                    {p.num}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--dim)', marginTop: 3 }}>{p.by}</div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      padding: '5px 11px',
                      borderRadius: 100,
                      whiteSpace: 'nowrap',
                      color: p.teamColor || p.tagColor || 'var(--dim)',
                      background:
                        p.tagBg ||
                        (p.teamColor
                          ? 'rgba(255,255,255,.04)'
                          : 'rgba(255,255,255,.04)'),
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
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '.2em',
                color: 'var(--orange)',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              Ban Giám Khảo
            </div>

            <div
              className="judges-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
              }}
            >
              {judges.map((j, i) => (
                <div
                  key={j.name}
                  onMouseEnter={() => setHoveredJudge(i)}
                  onMouseLeave={() => setHoveredJudge(null)}
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.07)',
                    transform: hoveredJudge === i ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'transform .4s cubic-bezier(.22,.8,.42,1)',
                  }}
                >
                  <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
                    <img
                      src={j.img}
                      alt={j.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        filter: hoveredJudge === i ? 'grayscale(0%)' : 'grayscale(30%)',
                        transition: 'filter .4s',
                        display: 'block',
                      }}
                    />
                  </div>
                  <div style={{ padding: '14px 12px 16px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Anton, sans-serif', fontSize: 18, color: 'var(--text)' }}>
                      {j.name}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: '.16em',
                        textTransform: 'uppercase',
                        color: 'var(--orange)',
                        margin: '6px 0 3px',
                      }}
                    >
                      {j.role}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--dim)' }}>{j.crew}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote box */}
            <div
              style={{
                marginTop: 24,
                border: '1px solid rgba(254,230,34,.15)',
                background: 'rgba(254,230,34,.05)',
                borderRadius: 14,
                padding: '22px 26px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 20,
                  color: 'var(--gold)',
                  textShadow: '0 0 18px rgba(254,230,34,.4)',
                  marginBottom: 8,
                }}
              >
                🏆 Team Được Yêu Thích Nhất
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--dim)', lineHeight: 1.7 }}>
                Giải bình chọn dựa trên 50% vote online từ khán giả và 50% bình chọn trực tiếp tại đêm
                diễn. Hãy cùng cổ vũ cho team bạn yêu thích nhất!
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sn-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 600px) {
          .judges-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default ShowcaseNight;
