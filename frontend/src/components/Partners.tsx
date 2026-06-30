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
    desc: 'Cung cấp nền tảng chấm điểm trực tiếp & Đơn vị Kiểm toán độc lập, đảm bảo tính minh bạch và công bằng.',
    highlight: true,
    hoverGlow: 'rgba(46,204,113,.2)',
  },
  {
    logo: '/assets/pptx-images/image2.png',
    name: 'Cóc Sài Gòn',
    logoBg: '#FEE622',
    role: 'Truyền Thông & Hình Ảnh',
    roleColor: '#FEE622',
    desc: 'Phụ trách sản xuất hình ảnh, cung cấp nhân sự và thiết bị quay/chụp trong suốt chương trình.',
    hoverGlow: 'rgba(254,230,34,.15)',
  },
  {
    logo: '/assets/pptx-images/image3.png',
    name: 'FPT Event Club',
    logoBg: '#5b2d8a',
    role: 'Vận Hành Onsite',
    roleColor: '#b87de8',
    desc: 'Cung cấp nhân sự vận hành onsite, bao gồm PG, hậu cần và điều phối sự kiện.',
    hoverGlow: 'rgba(120,60,180,.15)',
  },
  {
    logo: '/assets/pptx-images/image6.png',
    name: 'SiTi Group',
    logoBg: 'white',
    role: 'Cộng Đồng Tình Nguyện',
    roleColor: '#ff6090',
    desc: 'Cộng đồng Sinh viên Tình nguyện hỗ trợ vận hành, xử lý tình huống phát sinh trong ngày tổ chức.',
    hoverGlow: 'rgba(255,80,120,.1)',
  },
];

const Partners = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="partners" className="sec bg-[var(--bg2)]">
      <div className="con">
        <div className="rv text-center mb-14">
          <span className="ey">Đồng Hành Cùng SHC3</span>
          <h2 className="st">
            Đối Tác <em>&amp; Tài Trợ</em>
          </h2>
        </div>

        <div className="partners-grid grid grid-cols-4 gap-5">
          {partners.map((p, i) => {
            const isHover = hovered === i;
            return (
              <div
                key={p.name}
                className={`rv d${(i % 4) + 1} rounded-2xl bg-[rgba(255,255,255,.03)] pt-7 px-5 pb-6 text-center transition-[transform_.4s_cubic-bezier(.22,.8,.42,1),box-shadow_.4s]`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  border: p.highlight ? '1px solid rgba(46,204,113,.25)' : '1px solid rgba(255,255,255,.07)',
                  transform: isHover ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHover
                    ? `0 16px 48px ${p.hoverGlow}`
                    : p.highlight
                      ? '0 0 24px rgba(46,204,113,.1)'
                      : 'none',
                }}
              >
                <div
                  className="w-[100px] h-[100px] rounded-full p-[6px] mx-auto mb-[18px] flex items-center justify-center"
                  style={{ background: p.logoBg }}
                >
                  <img src={p.logo} alt={p.name} className="object-contain w-full h-full rounded-full" />
                </div>

                <h3 className="text-[22px] tracking-[.03em] mb-2 text-[var(--text)] font-anton">
                  {p.name}
                </h3>

                <div className="text-[10px] font-extrabold tracking-[.22em] uppercase mb-3" style={{ color: p.roleColor }}>
                  {p.role}
                </div>

                <p className="text-[12.5px] leading-[1.68] text-[var(--dim)]">{p.desc}</p>
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
