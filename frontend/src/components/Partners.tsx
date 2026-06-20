import { useState } from 'react';

type Partner = {
  logo: string;
  name: string;
  logoBg: string;
  role: string;
  roleColor: string;
  desc: string;
  highlight?: boolean;
  hoverGlow: string;
};

const partners: Partner[] = [
  {
    logo: '/assets/pptx-images/image1.png',
    name: 'F-Code',
    logoBg: 'white',
    role: 'Đối tác Công nghệ',
    roleColor: 'var(--fcode)',
    desc: 'Cung cấp nền tảng chấm điểm & Kiểm toán độc lập kết quả.',
    highlight: true,
    hoverGlow: 'rgba(46,204,113,.2)',
  },
  {
    logo: '/assets/pptx-images/image2.png',
    name: 'Cóc Sài Gòn',
    logoBg: '#FEE622',
    role: 'Truyền Thông & Hình Ảnh',
    roleColor: '#FEE622',
    desc: 'Phụ trách sản xuất hình ảnh, nhân sự & thiết bị quay/chụp.',
    hoverGlow: 'rgba(254,230,34,.15)',
  },
  {
    logo: '/assets/pptx-images/image3.png',
    name: 'FPT Event Club',
    logoBg: '#5b2d8a',
    role: 'Vận Hành Onsite',
    roleColor: '#b87de8',
    desc: 'Cung cấp nhân sự PG, hậu cần & điều phối toàn bộ sự kiện.',
    hoverGlow: 'rgba(120,60,180,.15)',
  },
  {
    logo: '/assets/pptx-images/image6.png',
    name: 'SiTi Group',
    logoBg: 'white',
    role: 'Cộng Đồng Tình Nguyện',
    roleColor: '#ff6090',
    desc: 'Cộng đồng Sinh viên Tình nguyện hỗ trợ vận hành sự kiện.',
    hoverGlow: 'rgba(255,80,120,.1)',
  },
];

const Partners = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="partners" className="sec" style={{ background: 'var(--bg2)' }}>
      <div className="con">
        <div className="rv" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="ey">Đồng Hành Cùng SHC3</span>
          <h2 className="st">
            Đối Tác <em>&amp; Tài Trợ</em>
          </h2>
        </div>

        <div
          className="partners-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}
        >
          {partners.map((p, i) => {
            const isHover = hovered === i;
            return (
              <div
                key={p.name}
                className={`rv d${(i % 4) + 1}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: 16,
                  background: 'rgba(255,255,255,.03)',
                  border: p.highlight
                    ? '1px solid rgba(46,204,113,.25)'
                    : '1px solid rgba(255,255,255,.07)',
                  padding: '28px 20px 24px',
                  textAlign: 'center',
                  transition: 'transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s',
                  transform: isHover ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHover
                    ? `0 16px 48px ${p.hoverGlow}`
                    : p.highlight
                      ? '0 0 24px rgba(46,204,113,.1)'
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: p.logoBg,
                    padding: 6,
                    margin: '0 auto 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 22,
                    letterSpacing: '.03em',
                    marginBottom: 8,
                    color: 'var(--text)',
                  }}
                >
                  {p.name}
                </h3>

                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    color: p.roleColor,
                    marginBottom: 12,
                  }}
                >
                  {p.role}
                </div>

                <p style={{ fontSize: 12.5, lineHeight: 1.68, color: 'var(--dim)' }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .partners-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .partners-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

export default Partners;
