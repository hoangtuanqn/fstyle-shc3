import { useEffect, useState } from 'react';
import { Link } from 'react-router';

const links = [
  { id: 'about', label: 'Sự Kiện' },
  { id: 'concept', label: 'Concept' },
  { id: 'teams', label: 'Đội Thi' },
  { id: 'fcode', label: 'F-Code' },
  { id: 'partners', label: 'Đối Tác' },
  { id: 'club', label: 'CLB' },
];

const pageLinks = [
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/awards', label: 'BTC' },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-14 max-lg:px-7 h-[68px] transition-all duration-350"
      style={{
        background: scrolled ? 'rgba(5,3,1,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(254,230,34,.1)' : '1px solid transparent',
      }}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center"
      >
        <img src="/assets/images/logo-ngang.png" height={40} alt="FStyle Crew" className="block h-10" />
      </a>

      <div className="flex items-center gap-[30px] max-lg:hidden">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => handleClick(link.id)}
            className="bg-transparent border-none cursor-pointer text-[11px] font-extrabold tracking-[.18em] uppercase text-dim hover:text-gold transition-colors duration-250 font-montserrat"
          >
            {link.label}
          </button>
        ))}
        <span className="w-px h-[18px] bg-[rgba(255,255,255,.12)]" />
        {pageLinks.map((pl) => (
          <Link
            key={pl.to}
            to={pl.to}
            className="text-[11px] font-extrabold tracking-[.18em] uppercase text-dim hover:text-gold transition-colors duration-250 font-montserrat no-underline"
          >
            {pl.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <div className="font-anton text-gold text-[18px] tracking-[.04em] gold-glow max-lg:hidden">05.07.2026</div>

        <Link
          to="/login"
          className="py-2 px-[22px] bg-gold border-none rounded-md text-[#050301] text-[11px] font-extrabold font-montserrat tracking-[.14em] uppercase no-underline cursor-pointer transition-all duration-250 shadow-[0_0_20px_rgba(254,230,34,.25)] inline-block hover:bg-[#ffe94a] hover:-translate-y-px hover:shadow-[0_0_30px_rgba(254,230,34,.45)]"
        >
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
