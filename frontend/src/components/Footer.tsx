const teamDots = ['var(--shiro)', 'var(--apex)', 'var(--slatt)', 'var(--anti)'];

const Footer = () => {
  return (
    <footer className="border-t border-[rgba(254,230,34,.1)] bg-[#030201] pt-[52px] pb-7">
      <div className="con">
        {/* TOP SECTION */}
        <div className="flex flex-wrap items-start justify-between gap-8 max-sm:flex-col">
          <div>
            <img
              src="/assets/images/logo-ngang.png"
              alt="FStyle Crew"
              className="mb-4 block h-7 opacity-90"
            />
            <div className="flex gap-2">
              {teamDots.map((c, i) => (
                <span
                  key={i}
                  className="inline-block size-2 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="text-right max-sm:text-left">
            <div className="mb-2 font-anton text-lg text-gold [text-shadow:0_0_18px_rgba(254,230,34,.5)]">
              Heatwave Showcase #3: APOCALYPSE
            </div>
            <div className="mb-2 text-[13px] leading-[1.6] text-dim">
              05 tháng 07 năm 2026 · 18:00 / Hall A, FPT University HCM Campus
            </div>
            <div className="text-[11px] font-[800] uppercase tracking-[.16em] text-orange">
              Never Stop Trying!
            </div>
          </div>
        </div>

        {/* SPONSORS BAR */}
        <div className="my-11 border-t border-[rgba(255,255,255,.06)] pt-8 text-center">
          <div className="mb-5 text-[9px] font-[800] uppercase tracking-[.3em] text-dim">
            Đơn vị tổ chức &amp; đối tác
          </div>
          <img
            src="/assets/images/logo-ngang.png"
            alt="Đơn vị tổ chức & đối tác"
            className="mx-auto block w-full max-w-[680px] opacity-55"
          />
        </div>

        {/* BOTTOM */}
        <div className="text-center">
          <div className="text-[11px] text-[rgba(242,237,224,.22)]">
            © 2026 FStyle Crew · FPT University HCM Campus · All rights reserved
          </div>
          <div className="mt-1.5 text-[11px] text-[rgba(242,237,224,.18)]">
            Phần mềm được phát triển bởi CLB F-Code
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
