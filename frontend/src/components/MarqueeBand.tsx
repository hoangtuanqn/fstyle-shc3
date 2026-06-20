const SEGMENTS = [
  'NEVER STOP TRYING',
  'HEATWAVE SHOWCASE #3',
  'APOCALYPSE',
  '05·07·2026',
  'FPT UNIVERSITY HCM',
  'HALL A',
  '18:00',
  'FSTYLE CREW',
];

const MarqueeContent = () => (
  <div className="flex shrink-0 items-center whitespace-nowrap">
    {SEGMENTS.map((seg, i) => (
      <span key={i} className="inline-flex items-center">
        <span className="px-4 font-anton text-base tracking-[.04em] text-bg">{seg}</span>
        <span className="text-base text-orange">✦</span>
      </span>
    ))}
  </div>
);

const MarqueeBand = () => {
  return (
    <div className="flex h-[52px] items-center overflow-hidden bg-gold">
      <div className="flex animate-marquee items-center">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

export default MarqueeBand;
