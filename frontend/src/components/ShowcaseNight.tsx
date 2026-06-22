import { useState } from 'react';
import { MapPin, Theater, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Performance = {
  num: string;
  name: string;
  by: string;
  tag: string;
  tagColor?: string;
  tagBg?: string;
  teamColor?: string;
  image?: string;
};

const performances: Performance[] = [
  {
    num: '01',
    name: 'Earth Song',
    by: 'Trần Ngọc Vi Lam · Top 18 Sing Out Loud 2026',
    tag: 'Mở màn',
    tagColor: 'var(--gold)',
    tagBg: 'rgba(254,230,34,.1)',
    image: '/assets/pptx-extracted/performer-vilam.png',
  },
  {
    num: '02',
    name: 'Tứ Kỵ Sĩ Khải Huyền',
    by: 'SHIRO KURO · Emptiness',
    tag: 'Team',
    teamColor: 'var(--shiro)',
    image: '/assets/pptx-extracted/team-shiro-kuro.png',
  },
  {
    num: '03',
    name: 'Tứ Kỵ Sĩ Khải Huyền',
    by: 'Apex Aura · Inner Conflict',
    tag: 'Team',
    teamColor: 'var(--apex)',
    image: '/assets/pptx-extracted/team-apex-aura.png',
  },
  {
    num: '04',
    name: 'Tứ Kỵ Sĩ Khải Huyền',
    by: 'SLATT · Awakening',
    tag: 'Team',
    teamColor: 'var(--slatt)',
    image: '/assets/pptx-extracted/team-slatt.png',
  },
  {
    num: '05',
    name: 'Tứ Kỵ Sĩ Khải Huyền',
    by: 'ANTI-X · Letting Go',
    tag: 'Team',
    teamColor: 'var(--anti)',
    image: '/assets/pptx-extracted/team-anti-x.png',
  },
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
    image: '/assets/pptx-extracted/performer-mtu.png',
  },
  { num: '08', name: 'Sự Tĩnh Lặng Từ Thiên Đường', by: 'Remix One Crew', tag: 'Finale' },
];

const judges = [
  { name: 'BIGG', role: 'Judge', crew: 'Choreographer', img: '/assets/pptx-extracted/judge-bigg.png' },
  { name: 'BON', role: 'Judge', crew: 'JustMove Crew · BClass Dance', img: '/assets/pptx-extracted/judge-bon.png' },
  { name: 'CHẤY', role: 'Judge', crew: 'C.O Crew', img: '/assets/pptx-extracted/judge-chay.png' },
];

const ShowcaseNight = () => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredJudge, setHoveredJudge] = useState<number | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  return (
    <section id="showcase" className="sec" style={{ background: 'var(--bg2)', padding: 0, overflow: 'hidden' }}>
      {/* ── HERO BANNER ── */}
      <div
        className="showcase-hero"
        style={{
          position: 'relative',
          minHeight: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src="/assets/pptx-extracted/golden-gate.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,3,1,.3) 0%, rgba(5,3,1,.6) 40%, rgba(10,7,3,1) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, padding: '80px 28px' }} className="rv">
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '.5em',
              color: 'var(--orange)',
              textTransform: 'uppercase',
              marginBottom: 20,
              textShadow: '0 0 16px rgba(251,140,5,.5)',
            }}
          >
            Chủ Nhật, 05/07/2026 · 18:00
          </div>
          <h2
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(42px, 6vw, 80px)',
              lineHeight: 1,
              letterSpacing: '.04em',
              color: 'var(--text)',
              marginBottom: 16,
            }}
          >
            SHOWCASE{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'normal', textShadow: '0 0 40px rgba(254,230,34,.6)' }}>
              NIGHT
            </em>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--dim)',
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Đêm trình diễn và thi đấu vũ đạo chính thức. Bốn đội thi cháy hết mình
            trên sân khấu Hall A, FPT University HCM.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 24,
              justifyContent: 'center',
              marginTop: 28,
              flexWrap: 'wrap',
            }}
          >
            <InfoChip Icon={MapPin} text="Hall A, FPT University HCM" />
            <InfoChip Icon={Theater} text="8 Tiết mục · 4 Đội thi" />
            <InfoChip Icon={Scale} text="3 Ban Giám Khảo" />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="con" style={{ paddingTop: 64, paddingBottom: 100 }}>
        <div className="sn-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* LEFT — Program with image preview */}
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
                  className="rv"
                  onMouseEnter={() => {
                    setHoveredRow(i);
                    if (p.image) setPreviewImg(p.image);
                  }}
                  onMouseLeave={() => {
                    setHoveredRow(null);
                    setPreviewImg(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 18px',
                    borderRadius: 12,
                    background: hoveredRow === i ? 'rgba(254,230,34,.03)' : 'rgba(255,255,255,.03)',
                    border: `1px solid ${hoveredRow === i ? (p.teamColor || 'rgba(254,230,34,.2)') : 'rgba(255,255,255,.07)'}`,
                    transition: 'all .3s',
                    transitionDelay: `${i * 0.06}s`,
                    cursor: p.image ? 'pointer' : 'default',
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

                  {p.image && (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: `1px solid ${p.teamColor || 'rgba(255,255,255,.12)'}`,
                      }}
                    >
                      <img
                        src={p.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}

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

          {/* RIGHT — Preview image + Judges */}
          <div className="rv d2">
            {/* Image preview area */}
            <div
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 28,
                border: '1px solid rgba(254,230,34,.12)',
                background: 'rgba(255,255,255,.02)',
                position: 'relative',
              }}
            >
              {previewImg ? (
                <img
                  src={previewImg}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    animation: 'showcaseImgIn .4s ease-out',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                  }}
                >
                  <img
                    src="/assets/pptx-extracted/golden-gate.png"
                    alt="Showcase Night"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      opacity: 0.5,
                      position: 'absolute',
                      inset: 0,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10,7,3,.95) 0%, rgba(10,7,3,.4) 100%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center',
                      padding: 28,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Anton', sans-serif",
                        fontSize: 28,
                        color: 'var(--gold)',
                        textShadow: '0 0 30px rgba(254,230,34,.5)',
                        marginBottom: 10,
                      }}
                    >
                      SHOWCASE NIGHT
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.7 }}>
                      Hover lên từng tiết mục bên trái để xem hình ảnh
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Judges section */}
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
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
            >
              {judges.map((j, i) => (
                <div
                  key={j.name}
                  className="rv"
                  onMouseEnter={() => setHoveredJudge(i)}
                  onMouseLeave={() => setHoveredJudge(null)}
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.07)',
                    transform: hoveredJudge === i ? 'translateY(-6px)' : 'translateY(0)',
                    transition: 'transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s',
                    transitionDelay: `${i * 0.1}s`,
                    boxShadow: hoveredJudge === i ? '0 12px 32px rgba(254,230,34,.08)' : 'none',
                  }}
                >
                  <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: 'rgba(255,255,255,.03)' }}>
                    <img
                      src={j.img}
                      alt={j.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        filter: hoveredJudge === i ? 'grayscale(0%)' : 'grayscale(30%)',
                        transition: 'filter .4s, transform .4s',
                        transform: hoveredJudge === i ? 'scale(1.05)' : 'scale(1)',
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
                Team Được Yêu Thích Nhất
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--dim)', lineHeight: 1.7 }}>
                Giải bình chọn dựa trên 50% vote online từ khán giả và 50% bình chọn trực tiếp tại đêm diễn.
                Hãy cùng cổ vũ cho team bạn yêu thích nhất!
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes showcaseImgIn {
          from { opacity: 0; transform: scale(1.05); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 1024px) {
          .sn-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .showcase-hero { min-height: 360px !important; }
        }
        @media (max-width: 600px) {
          .judges-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .showcase-hero { min-height: 320px !important; }
        }
      `}</style>
    </section>
  );
};

const InfoChip = ({ Icon, text }: { Icon: LucideIcon; text: string }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--dim)',
      background: 'rgba(255,255,255,.05)',
      border: '1px solid rgba(255,255,255,.1)',
      borderRadius: 100,
      padding: '8px 16px',
    }}
  >
    <Icon size={14} color="var(--gold)" /> {text}
  </span>
);

export default ShowcaseNight;
