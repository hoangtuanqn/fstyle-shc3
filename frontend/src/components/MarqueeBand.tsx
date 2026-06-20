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
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}
  >
    {SEGMENTS.map((seg, i) => (
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: 16,
            color: 'var(--bg)',
            letterSpacing: '.04em',
            padding: '0 16px',
          }}
        >
          {seg}
        </span>
        <span style={{ color: 'var(--orange)', fontSize: 16 }}>✦</span>
      </span>
    ))}
  </div>
);

const MarqueeBand = () => {
  return (
    <div
      style={{
        height: 52,
        background: 'var(--gold)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'ma 22s linear infinite',
        }}
      >
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
};

export default MarqueeBand;
