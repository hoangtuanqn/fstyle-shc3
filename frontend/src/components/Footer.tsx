const teamDots = ["var(--shiro)", "var(--apex)", "var(--slatt)", "var(--anti)"];

const Footer = () => {
  return (
    <footer className="bg-[#030201] border-t border-[rgba(254,230,34,.1)] pt-[52px] pb-[28px]">
      <div className="con">
        {/* TOP SECTION */}
        <div className="flex justify-between items-start gap-8 flex-wrap max-[600px]:flex-col">
          <div>
            <img
              src="/assets/images/logo-ngang.png"
              alt="FStyle Crew"
              className="h-7 opacity-90 mb-4"
            />
            <div className="flex gap-2">
              {teamDots.map((c, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="text-right max-[600px]:text-left">
            <div
              className="text-[18px] text-(--gold) text-shadow-[0_0_18px_rgba(254,230,34,.5)] mb-2 font-anton"
            >
              Heatwave Showcase #3: APOCALYPSE
            </div>
            <div className="text-[13px] text-[var(--dim)] mb-2 leading-[1.6]">
              05 tháng 07 năm 2026 · 18:00 / Hall A, FPT University HCM Campus
            </div>
            <div className="text-[11px] font-extrabold tracking-[.16em] uppercase text-[var(--orange)]">
              Never Stop Trying!
            </div>
          </div>
        </div>

        {/* SPONSORS BAR */}
        <div className="my-[44px] pt-8 border-t border-[rgba(255,255,255,.06)] text-center">
          <div className="text-[9px] font-extrabold tracking-[.3em] uppercase text-[var(--dim)] mb-5">
            Đơn vị tổ chức &amp; đối tác
          </div>
          <img
            src="/assets/images/logo-ngang.png"
            alt="Đơn vị tổ chức & đối tác"
            className="max-w-[680px] w-full opacity-55 block mx-auto"
          />
        </div>

        {/* BOTTOM */}
        <div className="text-center">
          <div className="text-[11px] text-[rgba(242,237,224,.22)]">
            © 2026 FStyle Crew · FPT University HCM Campus · All rights reserved
          </div>
          <div className="text-[12px] text-[rgba(242,237,224,.4)] mt-[10px]">
            Website được phát triển bởi{" "}
            <a
              href="https://www.facebook.com/fcodeclub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--gold) no-underline font-bold"
            >
              CLB F-Code
            </a>{" "}
            x{" "}
            <a
              href="https://www.facebook.com/mstsoftware.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--gold) no-underline font-bold"
            >
              MST Software Co., Ltd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
