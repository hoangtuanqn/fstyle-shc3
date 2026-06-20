import { useState } from 'react';

const features = [
  {
    title: 'Nền tảng chấm điểm trực tuyến',
    desc: 'Hệ thống website cho phép Ban Giám Khảo nhập điểm trực tiếp trong thời gian thực.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: 'Lưu trữ & bảo mật dữ liệu',
    desc: 'Toàn bộ dữ liệu đánh giá từ 03 BGK được mã hóa và lưu trữ an toàn.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Kiểm toán độc lập kết quả',
    desc: 'F-Code xác nhận và công bố kết quả cuối cùng, đảm bảo công bằng tuyệt đối.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

const FCode = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="fcode" className="sec bg-bg">
      <div className="con">
        <div className="grid grid-cols-[280px_1fr] gap-[72px] items-center max-lg:grid-cols-1 max-lg:gap-12">
          {/* LEFT — Logo block */}
          <div className="rv flex flex-col items-center gap-[18px]">
            <div className="w-[148px] h-[148px] rounded-[20px] bg-[rgba(254,230,34,.04)] border border-[rgba(254,230,34,.18)] shadow-[0_0_40px_rgba(254,230,34,.06)] flex items-center justify-center p-[18px]">
              <img src="/assets/pptx-images/image1.png" alt="F-Code" className="object-contain w-full h-full" />
            </div>

            <div className="font-anton text-[28px] text-text tracking-[.08em]">F-CODE</div>

            <div className="italic text-[12px] text-dim">"Code the dream"</div>

            <div className="inline-flex items-center gap-2 rounded-full px-[18px] py-2 text-[10px] font-extrabold tracking-[.22em] uppercase text-gold border border-[rgba(254,230,34,.2)] bg-[rgba(254,230,34,.04)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Kiểm Toán Độc Lập
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="rv d2">
            <span className="ey">Đối Tác Công Nghệ</span>
            <h2 className="st">
              CLB <em className="st-em">F-Code</em>
            </h2>
            <p className="text-[16px] leading-[1.85] text-dim my-5 mb-7 max-w-[620px]">
              CLB F-Code đóng vai trò đơn vị kiểm toán độc lập và cung cấp nền tảng công nghệ chấm điểm cho Heatwave
              Showcase #3, đảm bảo kết quả minh bạch và công bằng tuyệt đối.
            </p>

            <div className="flex flex-col gap-[14px]">
              {features.map((f, i) => {
                const isHover = hovered === i;
                return (
                  <div
                    key={f.title}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-center gap-4 px-[18px] py-4 rounded-xl transition-[border-color,background,transform] duration-300"
                    style={{
                      border: `1px solid ${isHover ? 'rgba(254,230,34,.2)' : 'rgba(255,255,255,.07)'}`,
                      background: isHover ? 'rgba(254,230,34,.03)' : 'rgba(255,255,255,.02)',
                      transform: isHover ? 'translateX(6px)' : 'translateX(0)',
                    }}
                  >
                    <div className="icon-box">{f.icon}</div>
                    <div>
                      <div className="text-[15px] font-bold text-text mb-1">{f.title}</div>
                      <div className="text-[13px] text-dim leading-[1.6]">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FCode;
