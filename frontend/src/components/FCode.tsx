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
    <section id="fcode" className="sec" style={{ background: 'var(--bg)' }}>
      <div className="con">
        <div
          className="fcode-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          {/* LEFT — Logo block */}
          <div
            className="rv"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 148,
                height: 148,
                borderRadius: 20,
                background: 'rgba(254,230,34,.04)',
                border: '1px solid rgba(254,230,34,.18)',
                boxShadow: '0 0 40px rgba(254,230,34,.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 18,
              }}
            >
              <img
                src="/assets/pptx-images/image1.png"
                alt="F-Code"
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            <div
              style={{
                fontFamily: 'Anton, sans-serif',
                fontSize: 28,
                color: 'var(--text)',
                letterSpacing: '.08em',
              }}
            >
              F-CODE
            </div>

            <div style={{ fontStyle: 'italic', fontSize: 12, color: 'var(--dim)' }}>
              "Code the dream"
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 100,
                padding: '8px 18px',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                border: '1px solid rgba(254,230,34,.2)',
                background: 'rgba(254,230,34,.04)',
              }}
            >
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
              CLB <em>F-Code</em>
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: 'var(--dim)',
                margin: '20px 0 28px',
                maxWidth: 620,
              }}
            >
              CLB F-Code đóng vai trò đơn vị kiểm toán độc lập và cung cấp nền tảng công nghệ chấm điểm
              cho Heatwave Showcase #3, đảm bảo kết quả minh bạch và công bằng tuyệt đối.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {features.map((f, i) => {
                const isHover = hovered === i;
                return (
                  <div
                    key={f.title}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px 18px',
                      borderRadius: 12,
                      border: `1px solid ${isHover ? 'rgba(254,230,34,.2)' : 'rgba(255,255,255,.07)'}`,
                      background: isHover ? 'rgba(254,230,34,.03)' : 'rgba(255,255,255,.02)',
                      transition: 'border-color .3s, background .3s, transform .35s',
                      transform: isHover ? 'translateX(6px)' : 'translateX(0)',
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(254,230,34,.07)',
                        border: '1px solid rgba(254,230,34,.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'var(--text)',
                          marginBottom: 4,
                        }}
                      >
                        {f.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--dim)', lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .fcode-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
};

export default FCode;
