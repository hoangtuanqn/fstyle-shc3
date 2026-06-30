import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const allBtcMembers = [
  { name: "Nguyễn Thế Hiển", role: "Trưởng BTC", img: "/assets/images/members/btc-nguyen-the-hien-1.webp" },
  { name: "Nguyễn Hoàng Gia Phúc", role: "Phó BTC", img: "/assets/images/members/btc-nguyen-hoang-gia-phuc-1.webp" },
  { name: "Nguyễn Thanh Lâm", role: "Thành viên BTC", img: "/assets/images/members/btc-nguyen-thanh-lam-1.webp" },
  { name: "Phạm Hải Yến", role: "Thành viên BTC", img: "/assets/images/members/btc-pham-hai-yen-1.webp" },
  { name: "Phan Kim Phát (Miêu)", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-phan-kim-phat-1.webp" },
  { name: "Nguyễn Trần Đức", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-nguyen-tran-duc-1.webp" },
  { name: "Bùi Minh Châu", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-bui-minh-chau-1.webp" },
  { name: "Lương Thị Xuân", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-luong-thi-xuan-1.webp" },
  { name: "Đặng Ngọc Tú Anh", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-dang-ngoc-tu-anh-1.webp" },
  { name: "Nguyễn Hoàng Bảo Trân", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-nguyen-hoang-bao-tran-1.webp" },
  { name: "Nguyễn Thành Thu Ngân", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-nguyen-thanh-thu-ngan-1.webp" },
  { name: "Võ Thanh Trúc", role: "Thành viên BTC", img: "/assets/images/members/btc-fstyle-vo-thanh-truc-1.webp" },
];

const maskStyle: CSSProperties = {
  maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
};

type DragState = { active: boolean; startX: number; startPos: number };

const BtcCard = ({ m }: { m: (typeof allBtcMembers)[0] }) => {
  const isLead = m.role === "Trưởng BTC" || m.role === "Phó BTC";
  return (
    <div className="btc-card mr-6" style={{ width: isLead ? 150 : 130 }}>
      <div
        className="aspect-[3/4] rounded-[12px] overflow-hidden relative"
        style={{
          width: isLead ? 150 : 130,
          border: isLead ? "1.5px solid rgba(254,230,34,.55)" : "1px solid rgba(255,255,255,.08)",
          boxShadow: isLead ? "0 0 18px rgba(254,230,34,.18)" : "none",
        }}
      >
        <img
          src={m.img}
          alt={m.name}
          draggable={false}
          className="w-full h-full object-cover object-top block pointer-events-none"
        />
        {isLead && (
          <div className="absolute top-2 left-2 bg-[var(--gold)] text-[#0a0804] text-[7px] font-black tracking-[.12em] uppercase px-[7px] py-[3px] rounded-[4px]">
            {m.role}
          </div>
        )}
      </div>
      <div className="text-center mt-[10px]">
        <div
          style={{
            fontSize: isLead ? 14 : 13,
            color: isLead ? "var(--gold)" : "var(--text)",
          }}
          className="leading-[1.3] whitespace-nowrap font-anton"
        >
          {m.name}
        </div>
        {!isLead && (
          <div className="text-[8px] font-extrabold tracking-[.15em] uppercase text-[var(--gold)] opacity-50 mt-1">
            {m.role}
          </div>
        )}
      </div>
    </div>
  );
};

const Btc = () => {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const pos1 = useRef(0);
  const pos2 = useRef(0);
  const rafRef = useRef(0);
  const drag1 = useRef<DragState>({ active: false, startX: 0, startPos: 0 });
  const drag2 = useRef<DragState>({ active: false, startX: 0, startPos: 0 });

  useEffect(() => {
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!t1 || !t2) return;

    // Row 2 starts mid-track so first frame has no jump
    pos2.current = t2.scrollWidth / 4;

    const tick = () => {
      const half1 = t1.scrollWidth / 2;
      const half2 = t2.scrollWidth / 2;

      if (!drag1.current.active) {
        pos1.current = (pos1.current + 0.5) % half1;
        t1.style.transform = `translateX(-${pos1.current}px)`;
      }
      if (!drag2.current.active) {
        pos2.current = ((pos2.current - 0.5) % half2 + half2) % half2;
        t2.style.transform = `translateX(-${pos2.current}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const makeDrag = (
    drag: React.MutableRefObject<DragState>,
    trackRef: React.RefObject<HTMLDivElement | null>,
    pos: React.MutableRefObject<number>,
  ) => ({
    onMouseDown: (e: React.MouseEvent) => {
      drag.current = { active: true, startX: e.clientX, startPos: pos.current };
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (!drag.current.active || !trackRef.current) return;
      const half = trackRef.current.scrollWidth / 2;
      const delta = drag.current.startX - e.clientX;
      pos.current = ((drag.current.startPos + delta) % half + half) % half;
      trackRef.current.style.transform = `translateX(-${pos.current}px)`;
    },
    onMouseUp: () => { drag.current.active = false; },
    onMouseLeave: () => { drag.current.active = false; },
    onTouchStart: (e: React.TouchEvent) => {
      drag.current = { active: true, startX: e.touches[0].clientX, startPos: pos.current };
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!drag.current.active || !trackRef.current) return;
      const half = trackRef.current.scrollWidth / 2;
      const delta = drag.current.startX - e.touches[0].clientX;
      pos.current = ((drag.current.startPos + delta) % half + half) % half;
      trackRef.current.style.transform = `translateX(-${pos.current}px)`;
    },
    onTouchEnd: () => { drag.current.active = false; },
  });

  const row1Members = allBtcMembers.filter((_, i) => i % 2 === 0);
  const row2Members = allBtcMembers.filter((_, i) => i % 2 !== 0);

  return (
    <section id="btc" className="sec bg-[var(--bg)]">
      <div className="con">
        <div className="rv text-center mb-12">
          <span className="ey">Đứng Sau Sân Khấu</span>
          <h2 className="st">
            BTC <em>FStyle</em>
          </h2>
          <p className="text-[15px] text-[var(--dim)] max-w-[480px] mt-4 mx-auto leading-[1.75]">
            Đội ngũ tổ chức FStyle SHC3 - những người làm việc không ngừng nghỉ để đêm Showcase diễn ra hoàn hảo.
          </p>
        </div>

        {/* Row 1 — left to right */}
        <div style={maskStyle} className="btc-wrapper overflow-hidden max-w-[900px] mx-auto mb-4" {...makeDrag(drag1, track1Ref, pos1)}>
          <div ref={track1Ref} className="btc-track">
            {[...row1Members, ...row1Members].map((m, i) => (
              <BtcCard key={i} m={m} />
            ))}
          </div>
        </div>

        {/* Row 2 — right to left (reversed order for visual variety) */}
        <div style={maskStyle} className="btc-wrapper overflow-hidden max-w-[900px] mx-auto" {...makeDrag(drag2, track2Ref, pos2)}>
          <div ref={track2Ref} className="btc-track">
            {[...row2Members, ...row2Members].map((m, i) => (
              <BtcCard key={i} m={m} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .btc-wrapper {
          cursor: grab;
          user-select: none;
        }
        .btc-wrapper:active {
          cursor: grabbing;
        }
        .btc-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .btc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};

export default Btc;
