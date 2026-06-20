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
    <section id="partners" className="sec bg-bg2">
      <div className="con">
        <div className="rv mb-14 text-center">
          <span className="ey">Đồng Hành Cùng SHC3</span>
          <h2 className="st">
            Đối Tác <em className="st-em">&amp; Tài Trợ</em>
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {partners.map((p, i) => {
            const isHover = hovered === i;
            return (
              <div
                key={p.name}
                className={`rv d${(i % 4) + 1} rounded-2xl bg-[rgba(255,255,255,.03)] px-5 pb-6 pt-7 text-center transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(.22,.8,.42,1)]`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  border: p.highlight
                    ? '1px solid rgba(46,204,113,.25)'
                    : '1px solid rgba(255,255,255,.07)',
                  transform: isHover ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHover
                    ? `0 16px 48px ${p.hoverGlow}`
                    : p.highlight
                      ? '0 0 24px rgba(46,204,113,.1)'
                      : 'none',
                }}
              >
                <div
                  className="mx-auto mb-[18px] flex h-[100px] w-[100px] items-center justify-center rounded-full p-1.5"
                  style={{ background: p.logoBg }}
                >
                  <img src={p.logo} alt={p.name} className="h-full w-full rounded-full object-contain" />
                </div>

                <h3 className="mb-2 font-anton text-[22px] tracking-[.03em] text-text">{p.name}</h3>

                <div
                  className="mb-3 text-[10px] font-extrabold uppercase tracking-[.22em]"
                  style={{ color: p.roleColor }}
                >
                  {p.role}
                </div>

                <p className="text-[12.5px] leading-[1.68] text-dim">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
