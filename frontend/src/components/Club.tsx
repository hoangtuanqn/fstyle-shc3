const Club = () => {
  return (
    <section id="club" className="sec" style={{ background: 'var(--bg)' }}>
      <div className="con">
        <div
          className="club-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* CỘT TRÁI */}
          <div className="rv">
            <img
              src="/assets/images/logo-chunhat.png"
              alt="FStyle Crew"
              style={{ height: 64, marginBottom: 28, display: 'block' }}
            />
            <span className="ey">Câu Lạc Bộ</span>
            <h2 className="st" style={{ marginBottom: 24 }}>
              FStyle <em>Crew</em>
            </h2>

            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--dim)', marginBottom: 18 }}>
              CLB Văn hoá Nghệ thuật của Trường Đại học FPT TP. HCM, Đơn vị Tổ chức chính của Heatwave Showcase.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--dim)' }}>
              Với kinh nghiệm triển khai biểu diễn, thi đấu và tổ chức sự kiện, CLB đảm nhận từ nội dung, nhân sự
              đến điều phối sân khấu, góp phần lan tỏa văn hóa nghệ thuật đường phố trong cộng đồng sinh viên.
            </p>

            <span
              style={{
                display: 'inline-block',
                background: 'var(--gold)',
                color: 'var(--bg)',
                fontFamily: 'Anton, sans-serif',
                fontSize: 17,
                letterSpacing: '.12em',
                padding: '14px 34px',
                borderRadius: 8,
                boxShadow: '0 0 40px rgba(254,230,34,.5), 0 0 80px rgba(254,230,34,.15)',
                marginTop: 36,
              }}
            >
              NEVER STOP TRYING !
            </span>
          </div>

          {/* CỘT PHẢI */}
          <div className="rv d2">
            <img
              src="/assets/images/nhom-nguoi-bi-an.png"
              alt="FStyle Crew"
              style={{
                width: '100%',
                display: 'block',
                borderRadius: 20,
                border: '1px solid rgba(254,230,34,.15)',
                boxShadow: '0 0 60px rgba(254,230,34,.1)',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .club-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
};

export default Club;
