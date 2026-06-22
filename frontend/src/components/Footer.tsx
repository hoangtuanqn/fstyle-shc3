const teamDots = ["var(--shiro)", "var(--apex)", "var(--slatt)", "var(--anti)"];

const Footer = () => {
  return (
    <footer
      style={{
        background: "#030201",
        borderTop: "1px solid rgba(254,230,34,.1)",
        padding: "52px 0 28px",
      }}
    >
      <div className="con">
        {/* TOP SECTION */}
        <div
          className="footer-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <div>
            <img
              src="/assets/images/logo-ngang.png"
              alt="FStyle Crew"
              className="footer-logo-top"
              style={{
                height: 28,
                opacity: 0.9,
                display: "block",
                marginBottom: 16,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {teamDots.map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c,
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: 18,
                color: "var(--gold)",
                textShadow: "0 0 18px rgba(254,230,34,.5)",
                marginBottom: 8,
              }}
            >
              Heatwave Showcase #3: APOCALYPSE
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--dim)",
                marginBottom: 8,
                lineHeight: 1.6,
              }}
            >
              05 tháng 07 năm 2026 · 18:00 / Hall A, FPT University HCM Campus
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "var(--orange)",
              }}
            >
              Never Stop Trying!
            </div>
          </div>
        </div>

        {/* SPONSORS BAR */}
        <div
          style={{
            margin: "44px 0",
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: ".3em",
              textTransform: "uppercase",
              color: "var(--dim)",
              marginBottom: 20,
            }}
          >
            Đơn vị tổ chức &amp; đối tác
          </div>
          <img
            src="/assets/images/logo-ngang.png"
            alt="Đơn vị tổ chức & đối tác"
            style={{
              maxWidth: 680,
              width: "100%",
              opacity: 0.55,
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* BOTTOM */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(242,237,224,.22)" }}>
            © 2026 FStyle Crew · FPT University HCM Campus · All rights reserved
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(242,237,224,.4)",
              marginTop: 10,
            }}
          >
            Website được phát triển bởi{" "}
            <a
              href="https://www.facebook.com/fcodeclub"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              CLB F-Code
            </a>{" "}
            x {" "}
            <a
              href="https://www.facebook.com/mstsoftware.vn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              MST Software - Giải pháp Công nghệ MMO
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .footer-top { flex-direction: column; }
          .footer-top > div:last-child { text-align: left !important; }
          .footer-logo-top { max-width: 140px; height: auto !important; object-fit: contain; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
