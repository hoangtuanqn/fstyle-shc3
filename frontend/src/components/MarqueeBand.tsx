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
  <div className="flex items-center flex-shrink-0 whitespace-nowrap">
    {SEGMENTS.map((seg, i) => (
      <span key={i} className="inline-flex items-center">
        <span
          className="text-[16px] text-[var(--bg)] tracking-[.04em] px-4 font-anton"
        >
          {seg}
        </span>
        <span className="text-[var(--orange)] text-[16px]">✦</span>
      </span>
    ))}
  </div>
);

const MarqueeBand = () => {
  return (
    <div className="h-[52px] bg-[var(--gold)] overflow-hidden flex items-center">
      <div className="flex items-center animate-[ma_22s_linear_infinite]">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

export default MarqueeBand;
