type Pill = {
  label: string;
  color: string;
};

const pills: Pill[] = [
  { label: 'EMPTINESS', color: 'var(--shiro)' },
  { label: 'AWAKENING', color: 'var(--slatt)' },
  { label: 'INNER CONFLICT', color: 'var(--apex)' },
  { label: 'LETTING GO', color: 'var(--anti)' },
];

const ConceptPill = ({ pill }: { pill: Pill }) => (
  <span
    className="inline-flex items-center rounded-full px-[26px] py-[11px] text-[12px] font-[800] tracking-[.2em] uppercase cursor-default bg-[color-mix(in_srgb,transparent_92%,currentColor)] hover:-translate-y-1 transition-transform duration-300"
    style={{ color: pill.color, border: `1px solid ${pill.color}` }}
  >
    {pill.label}
  </span>
);

const Concept = () => {
  return (
    <section id="concept" className="sec bg-bg2 text-center relative overflow-hidden">
      {/* Background mờ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/assets/images/bggg.png')] bg-center bg-cover bg-no-repeat opacity-[0.06] pointer-events-none"
      />

      <div className="con relative z-2">
        <span className="ey rv">Concept &middot; Khải Huyền</span>

        <h2 className="rv font-anton text-[clamp(26px,3.8vw,52px)] leading-[1.08] tracking-[.02em] mb-[22px]">
          The category is <em className="st-em">DANCE</em> or <em className="st-em">APOCALYPSE</em>
        </h2>

        <p className="rv d1 text-[16px] leading-[1.8] text-dim max-w-[720px] mx-auto">
          Bốn đội thi hiện thân bốn Kỵ Sĩ Khải Huyền — mỗi đội mang một trạng thái cảm xúc tận cùng, kể câu chuyện về sự
          sụp đổ và tái sinh của con người qua ngôn ngữ vũ đạo.
        </p>

        <img
          src="/assets/images/typography-banner-dark-tagline.png"
          alt="Heatwave Showcase #3 APOCALYPSE"
          className="rv d2 block mx-auto my-12 w-[min(500px,80vw)] animate-logo-pulse"
        />

        {/* 4 concept pills */}
        <div className="rv d2 flex flex-wrap gap-[14px] justify-center mb-14">
          {pills.map((pill) => (
            <ConceptPill key={pill.label} pill={pill} />
          ))}
        </div>

        {/* Revelation box */}
        <div className="rv d3 card-gold max-w-[780px] mx-auto rounded-2xl px-9 py-7 text-left">
          <h3 className="font-anton text-[18px] tracking-[.04em] text-gold gold-glow mb-[14px]">
            &#10022; NGUỒN CẢM HỨNG: BOOK OF REVELATION
          </h3>
          <p className="text-[14.5px] leading-[1.85] text-dim">
            Book of Revelation (Sách Khải Huyền) là chương cuối của Kinh Thánh Tân Ước, kể về ngày tận thế qua những hình
            ảnh biểu tượng đầy sức mạnh. Bảy Ấn (Seven Seals) lần lượt được mở ra, báo hiệu sự phán xét cuối cùng. Khi
            bốn Ấn đầu tiên được mở, Tứ Kỵ Sĩ Khải Huyền (Four Horsemen of the Apocalypse) xuất hiện — hiện thân cho
            những thử thách tận cùng mà nhân loại phải đối mặt trước khi bước vào sự tái sinh.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Concept;
