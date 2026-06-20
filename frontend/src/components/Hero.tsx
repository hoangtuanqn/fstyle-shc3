import { useCountdown } from '../hooks/useCountdown';
import ParticleCanvas from './ParticleCanvas';

const TARGET = new Date('2026-07-05T18:00:00+07:00').getTime();

const metaItems = [
  { label: 'Ngày', value: '05.07.2026' },
  { label: 'Địa điểm', value: 'Hall A · FPT HCM' },
  { label: 'Bắt đầu', value: '18:00' },
];

const Hero = () => {
  const { days, hours, minutes, seconds } = useCountdown(TARGET);

  const countItems = [
    { label: 'Ngày', value: days },
    { label: 'Giờ', value: hours },
    { label: 'Phút', value: minutes },
    { label: 'Giây', value: seconds },
  ];

  const colon = (
    <span className="font-anton text-[40px] text-gold animate-colon-blink leading-none mx-[2px]">:</span>
  );

  return (
    <section id="hero" className="relative w-full h-screen min-h-[740px] overflow-hidden">
      {/* Layer 1 — background */}
      <div className="absolute inset-0 bg-[url('/assets/images/bggg.png')] bg-center bg-top bg-cover bg-no-repeat animate-hzoom saturate-[1.2] contrast-[1.05]" />
      {/* Layer 2 — overlay */}
      <div className="absolute inset-0 bg-[url('/assets/images/vungtoi.png')] bg-center bg-bottom bg-cover bg-no-repeat opacity-60" />
      {/* Layer 3 — gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,3,1,.15)_0%,rgba(5,3,1,.02)_20%,rgba(5,3,1,.12)_55%,rgba(5,3,1,.94)_100%)]" />
      {/* Layer 4 — particles */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* 1. Eyebrow */}
        <span
          className="text-[11px] font-extrabold tracking-[.42em] text-orange uppercase animate-fu"
          style={{ textShadow: '0 0 20px rgba(251,140,5,.8)', animationDelay: '.1s' }}
        >
          FStyle Crew · Never Stop Trying!
        </span>

        {/* 2. Logo */}
        <img
          src="/assets/images/typography-apocalypse-gold.png"
          alt="APOCALYPSE"
          className="w-[min(580px,84vw)] mt-[22px] animate-fu"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(254,230,34,.7)) drop-shadow(0 0 20px rgba(251,140,5,.5))',
            animationDelay: '.3s',
          }}
        />

        {/* 3. Tagline */}
        <p
          className="text-[14px] italic text-[rgba(242,237,224,.7)] mt-[18px] animate-fu"
          style={{ animationDelay: '.5s' }}
        >
          The category is DANCE or APOCALYPSE
        </p>

        {/* 4. Meta bar */}
        <div
          className="flex max-sm:flex-col max-sm:w-[min(280px,84vw)] bg-[rgba(0,0,0,.45)] border border-[rgba(254,230,34,.28)] rounded-xl backdrop-blur-[8px] overflow-hidden mt-[34px] animate-fu"
          style={{ animationDelay: '.7s' }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              className={`py-[14px] px-[26px] text-center max-sm:border-r-0 ${
                i < metaItems.length - 1
                  ? 'border-r border-r-[rgba(254,230,34,.18)] max-sm:border-b max-sm:border-b-[rgba(254,230,34,.18)]'
                  : ''
              }`}
            >
              <div className="label-upper text-orange mb-[6px] tracking-[.3em]">{item.label}</div>
              <div className="font-anton text-[17px] text-gold gold-glow">{item.value}</div>
            </div>
          ))}
        </div>

        {/* 5. Countdown */}
        <div
          className="flex items-center gap-[6px] mt-9 flex-wrap justify-center animate-fu"
          style={{ animationDelay: '.9s' }}
        >
          {countItems.map((item, i) => (
            <div key={item.label} className="flex items-center gap-[6px]">
              <div className="flex flex-col items-center min-w-[72px] py-[14px] px-[10px] bg-[rgba(0,0,0,.4)] border border-[rgba(254,230,34,.22)] rounded-[10px]">
                <span className="font-anton text-[40px] leading-none text-gold" style={{ textShadow: '0 0 20px rgba(254,230,34,.6)' }}>
                  {item.value}
                </span>
                <span className="label-upper text-dim mt-2 tracking-[.24em]">{item.label}</span>
              </div>
              {i < countItems.length - 1 && colon}
            </div>
          ))}
        </div>

        {/* 6. Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px]">
          <span className="label-upper text-dim tracking-[.3em]">Cuộn xuống</span>
          <span className="block w-3 h-3 border-r-2 border-b-2 border-gold animate-arrow-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
