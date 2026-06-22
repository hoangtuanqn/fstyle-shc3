import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';

const links = [
  { id: 'about', label: 'Sự Kiện' },
  { id: 'concept', label: 'Concept' },
  { id: 'teams', label: 'Đội Thi' },
  { id: 'fcode', label: 'F-Code' },
  { id: 'partners', label: 'Đối Tác' },
  { id: 'club', label: 'CLB' },
];

const allPageLinks = [
  { to: '/leaderboard', label: 'Leaderboard', roles: [RoleType.ADMIN, RoleType.MC] },
  { to: '/voting-leaderboard', label: 'Vote', roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE, RoleType.MC] },
  { to: '/awards', label: 'BTC', roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE] },
  { to: '/scoring', label: 'Scoring', roles: [RoleType.ADMIN] },
];

const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userRole = user?.role ?? '';
  const pageLinks = allPageLinks.filter((pl) => pl.roles.includes(userRole as RoleType));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSectionClick = (id: string) => {
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          height: 68,
          transition: 'background .35s, backdrop-filter .35s, border-color .35s',
          background: scrolled || menuOpen ? 'rgba(5,3,1,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled || menuOpen ? '1px solid rgba(254,230,34,.1)' : '1px solid transparent',
        }}
      >
        {/* Logo zone — fixed-width left panel */}
        <div
          className="nav-logo-zone"
          style={{
            width: 220,
            minWidth: 220,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 48,
            borderRight: '1px solid rgba(254,230,34,.08)',
          }}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              src="/assets/images/FStyle.jpg"
              alt="FStyle Crew"
              className="nav-logo"
              style={{
                display: 'block',
                width: 42,
                height: 42,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(254,230,34,.35)',
                boxShadow: '0 0 12px rgba(254,230,34,.25)',
              }}
            />
          </a>
        </div>

        {/* Menu zone — fills remaining space */}
        <div
          className="nav-menu-zone"
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 48,
          }}
        >
          {/* Nav links */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
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
            {pageLinks.length > 0 && (
              <>
                <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,.12)' }} />
                {pageLinks.map((pl) => (
                  <Link
                    key={pl.to}
                    to={pl.to}
                    onMouseEnter={() => setHovered(pl.to)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '.18em',
                      textTransform: 'uppercase',
                      color: hovered === pl.to ? 'var(--gold)' : 'var(--dim)',
                      transition: 'color .25s',
                      fontFamily: 'Montserrat, sans-serif',
                      textDecoration: 'none',
                    }}
                  >
                    {pl.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right section */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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

            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                  }}
                >
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  style={{
                    padding: '8px 18px',
                    background: 'transparent',
                    border: '1px solid rgba(254,230,34,.4)',
                    borderRadius: 6,
                    color: 'var(--gold)',
                    fontSize: 11,
                    fontWeight: 800,
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background .25s, border-color .25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(254,230,34,.1)';
                    e.currentTarget.style.borderColor = 'rgba(254,230,34,.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(254,230,34,.4)';
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
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
            )}
          </div>
        </div>

        {/* Hamburger button — mobile only (hidden via CSS on desktop) */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            width: 40,
            height: 40,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 22,
              height: 2,
              background: 'var(--gold)',
              borderRadius: 2,
              transition: 'transform .3s, opacity .3s',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: 22,
              height: 2,
              background: 'var(--gold)',
              borderRadius: 2,
              transition: 'opacity .3s',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: 22,
              height: 2,
              background: 'var(--gold)',
              borderRadius: 2,
              transition: 'transform .3s, opacity .3s',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: 68,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(5,3,1,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '32px 28px 40px',
          overflowY: 'auto',
          transition: 'opacity .3s, transform .3s',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-12px)',
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
        className="nav-mobile-menu"
      >
        {/* Section links */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', marginBottom: 16 }}>
            Trang chủ
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '12px 0',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  fontFamily: 'Montserrat, sans-serif',
                  borderBottom: '1px solid rgba(255,255,255,.06)',
                  transition: 'color .2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page links */}
        {pageLinks.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.25)', marginBottom: 16 }}>
              Trang
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {pageLinks.map((pl) => (
                <Link
                  key={pl.to}
                  to={pl.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    fontFamily: 'Montserrat, sans-serif',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,.06)',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                >
                  {pl.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Auth section */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.08)' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(254,230,34,.15)',
                    border: '1px solid rgba(254,230,34,.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 800,
                    color: 'var(--gold)',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)', fontFamily: 'Montserrat, sans-serif', letterSpacing: '.06em' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--dim)' }}>{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                style={{
                  padding: '12px',
                  background: 'rgba(254,230,34,.08)',
                  border: '1px solid rgba(254,230,34,.25)',
                  borderRadius: 8,
                  color: 'var(--gold)',
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '14px',
                background: 'var(--gold)',
                borderRadius: 8,
                color: '#050301',
                fontSize: 13,
                fontWeight: 800,
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Date */}
        <div
          style={{
            marginTop: 20,
            fontFamily: 'Anton, sans-serif',
            color: 'rgba(254,230,34,.3)',
            fontSize: 14,
            letterSpacing: '.12em',
            textAlign: 'center',
          }}
        >
          SHOWCASE NIGHT — 05.07.2026
        </div>
      </div>

      <style>{`
        .nav-hamburger { display: none; }
        @media (max-width: 1024px) {
          .nav-logo-zone {
            width: auto !important;
            min-width: 0 !important;
            padding-left: 20px !important;
            border-right: none !important;
            flex: 1;
          }
          .nav-menu-zone { display: none !important; }
          .nav-hamburger { display: flex; padding-right: 20px; }
          .nav-logo { width: 36px !important; height: 36px !important; }
        }
        @media (min-width: 1025px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Nav;
