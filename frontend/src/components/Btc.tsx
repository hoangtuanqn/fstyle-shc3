import { useState } from "react";

const btcMembers = [
  {
    name: "Nguyễn Thế Hiển",
    role: "Trưởng BTC",
    img: "/assets/images/members/btc-nguyen-the-hien-1.webp",
  },
  {
    name: "Nguyễn Hoàng Gia Phúc",
    role: "Phó BTC",
    img: "/assets/images/members/btc-nguyen-hoang-gia-phuc-1.webp",
  },
  {
    name: "Nguyễn Thanh Lâm",
    role: "Thành viên BTC",
    img: "/assets/images/members/btc-nguyen-thanh-lam-1.webp",
  },
  {
    name: "Phạm Hải Yến",
    role: "Thành viên BTC",
    img: "/assets/images/members/btc-pham-hai-yen-1.webp",
  },
];

const Btc = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="btc" className="sec" style={{ background: "var(--bg)" }}>
      <div className="con">
        <div style={{ textAlign: "center", marginBottom: 40 }} className="rv">
          <span className="ey">Đứng Sau Sân Khấu</span>
          <h2 className="st">
            BTC <em>FStyle</em>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--dim)",
              maxWidth: 480,
              margin: "16px auto 0",
              lineHeight: 1.75,
            }}
          >
            Đội ngũ tổ chức FStyle SHC3 - những người làm việc không ngừng nghỉ
            để đêm Showcase diễn ra hoàn hảo.
          </p>
        </div>

        <div
          className="btc-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          {btcMembers.map((m, i) => (
            <div
              key={m.name}
              className="rv"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${hovered === i ? "rgba(254,230,34,.2)" : "rgba(255,255,255,.07)"}`,
                transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
                transition: "transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s, border-color .3s",
                transitionDelay: `${i * 0.07}s`,
                boxShadow: hovered === i ? "0 12px 32px rgba(254,230,34,.08)" : "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  background: "rgba(255,255,255,.03)",
                }}
              >
                <img
                  src={m.img}
                  alt={m.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: hovered === i ? "grayscale(0%)" : "grayscale(20%)",
                    transform: hovered === i ? "scale(1.05)" : "scale(1)",
                    transition: "filter .4s, transform .4s",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(5,3,1,.75) 0%, transparent 55%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div style={{ padding: "14px 12px 16px", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: 16,
                    color: "var(--text)",
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    opacity: 0.75,
                  }}
                >
                  {m.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .btc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
};

export default Btc;
