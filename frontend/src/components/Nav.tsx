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

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 56px',
        height: 68,
        transition: 'background .35s, backdrop-filter .35s, border-color .35s',
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
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <img src="/assets/images/logo-ngang.png" height={40} alt="FStyle Crew" style={{ display: 'block', height: 40 }} />
      </a>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => handleClick(link.id)}
            onMouseEnter={() => setHovered(link.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: hovered === link.id ? 'var(--gold)' : 'var(--dim)',
              transition: 'color .25s',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div
          className="nav-date"
          style={{
            fontFamily: 'Anton, sans-serif',
            color: 'var(--gold)',
            fontSize: 18,
            letterSpacing: '.04em',
            textShadow: '0 0 18px rgba(254,230,34,.6)',
          }}
        >
          05.07.2026
        </div>

        <Link
          to="/login"
          className="nav-login"
          style={{
            padding: '8px 22px',
            background: 'var(--gold)',
            border: 'none',
            borderRadius: 6,
            color: '#050301',
            fontSize: 11,
            fontWeight: 800,
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background .25s, box-shadow .25s, transform .15s',
            boxShadow: '0 0 20px rgba(254,230,34,.25)',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffe94a';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(254,230,34,.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--gold)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(254,230,34,.25)';
          }}
        >
          Đăng nhập
        </Link>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          nav { padding: 0 28px !important; }
          .nav-links,
          .nav-date { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Nav;
