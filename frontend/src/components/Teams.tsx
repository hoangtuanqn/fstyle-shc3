import { useState } from "react";
import type { CSSProperties } from "react";

type Team = {
  id: string;
  name: string;
  concept: string;
  color: string;
  desc: string;
  image: string;
  avatar: string;
  weapon: { img: string; name: string };
  topBar: string;
  glowColor: string;
  glowHover: string;
};

const teams: Team[] = [
  {
    id: "shiro",
    name: "SHIRO KURO",
    concept: "EMPTINESS",
    color: "var(--shiro)",
    desc: "Trống rỗng. Khi mọi sắc màu tan biến, chỉ còn lại đen và trắng. Sự hư vô thuần khiết nhất.",
    image: "/assets/pptx-images/image10.png",
    avatar: "/assets/images/avatar-emptiness.png",
    weapon: { img: "/assets/images/vuokhi-can.png", name: "Cân Công Lý" },
    topBar: "linear-gradient(90deg,#444,#ddd,#444)",
    glowColor: "rgba(200,200,200,.25)",
    glowHover: "rgba(200,200,200,.45)",
  },
  {
    id: "apex",
    name: "APEX AURA",
    concept: "INNER CONFLICT",
    color: "var(--apex)",
    desc: "Mâu thuẫn nội tâm. Ngọn lửa đỏ thiêu đốt từ bên trong, cuộc chiến không hồi kết với chính mình.",
    image: "/assets/pptx-images/image11.png",
    avatar: "/assets/images/avatar-inner-conflict.png",
    weapon: { img: "/assets/images/vuokhi-kiem.png", name: "Huyết Kiếm" },
    topBar: "linear-gradient(90deg,#D04047,#ff9a9e,#D04047)",
    glowColor: "rgba(208,64,71,.25)",
    glowHover: "rgba(208,64,71,.5)",
  },
  {
    id: "slatt",
    name: "SLATT",
    concept: "AWAKENING",
    color: "var(--slatt)",
    desc: "Thức tỉnh. Ánh sáng xanh lam xuyên qua màn đêm hỗn loạn, khoảnh khắc bừng sáng sau cơn mê.",
    image: "/assets/pptx-images/image9.png",
    avatar: "/assets/images/avatar-awakening.png",
    weapon: { img: "/assets/images/vuokhi-cung.png", name: "Thần Cung" },
    topBar: "linear-gradient(90deg,#5973B3,#a8baec,#5973B3)",
    glowColor: "rgba(89,115,179,.25)",
    glowHover: "rgba(89,115,179,.5)",
  },
  {
    id: "anti-x",
    name: "ANTI-X",
    concept: "LETTING GO",
    color: "var(--anti)",
    desc: "Buông bỏ. Sự giải phóng thanh thản nhất, khi bạn chấp nhận và để mọi thứ trôi đi.",
    image: "/assets/pptx-images/image12.png",
    avatar: "/assets/images/avatar-letting-go.png",
    weapon: { img: "/assets/images/vuokhi-liem.png", name: "Linh Liềm" },
    topBar: "linear-gradient(90deg,#5EAF7C,#a8dbb9,#5EAF7C)",
    glowColor: "rgba(94,175,124,.25)",
    glowHover: "rgba(94,175,124,.5)",
  },
];

const TeamCard = ({ team }: { team: Team }) => {
  const [hover, setHover] = useState(false);

  const cardStyle: CSSProperties = {
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.08)",
    background: "var(--bg2)",
    boxShadow: hover
      ? `0 18px 50px ${team.glowHover}, 0 0 0 1px ${team.glowHover} inset`
      : `0 0 30px ${team.glowColor}, 0 0 0 1px ${team.glowColor} inset`,
    transform: hover ? "translateY(-10px)" : "translateY(0)",
    transition: "transform .4s cubic-bezier(.22,.8,.42,1), box-shadow .4s",
  };

  const imgStyle: CSSProperties = {
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    objectPosition: "center top",
    display: "block",
    transform: hover ? "scale(1.04)" : "scale(1)",
    transition: "transform .5s ease",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top accent bar */}
      <div className="h-[4px]" style={{ background: team.topBar }} />

      {/* Ảnh photoshoot */}
      <div className="overflow-hidden">
        <img src={team.image} alt={team.name} style={imgStyle} />
      </div>

      {/* Content */}
      <div className="pt-[22px] px-5 pb-[26px]">
        <div
          className="text-[9px] font-extrabold tracking-[.28em] uppercase mb-2"
          style={{ color: team.color }}
        >
          {team.concept}
        </div>

        <h3
          className="text-[26px] tracking-[.04em] mb-3 font-anton"
        >
          {team.name}
        </h3>

        <p className="h-[90px] text-[12.5px] text-[var(--dim)] leading-[1.68] mb-5">
          {team.desc}
        </p>

        {/* Weapon row */}
        <div className="flex items-center gap-3 pt-4 border-t border-[rgba(255,255,255,.07)]">
          <img
            src={team.weapon.img}
            alt={team.weapon.name}
            className="w-[52px] h-[52px] object-contain shrink-0"
          />
          <div>
            <div className="text-[9px] font-extrabold tracking-[.22em] uppercase text-[var(--dim)] mb-[3px]">
              Vũ khí
            </div>
            <div className="text-[14px] font-bold text-[var(--text)]">
              {team.weapon.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Teams = () => {
  return (
    <section id="teams" className="sec bg-[var(--bg3)]">
      <div className="con">
        <div className="mb-12">
          <span className="ey rv">Đội Thi Tranh Tài</span>
          <h2 className="st rv">
            Đội Thi <em>SHC3</em>
          </h2>
        </div>

        <div className="teams-grid grid grid-cols-4 gap-5">
          {teams.map((team, i) => (
            <div
              key={team.id}
              className="rv rv-strong"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .teams-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .teams-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Teams;
