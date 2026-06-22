import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

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
  { to: '/dashboard', label: 'Bình chọn', roles: [RoleType.MEMBER, RoleType.BTC_FSTYLE] },
  { to: '/leaderboard', label: 'Xếp hạng giải thưởng', roles: [RoleType.ADMIN, RoleType.MC] },
  { to: '/voting-leaderboard', label: 'Xếp hạng vote', roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE, RoleType.MC] },
  { to: '/awards', label: 'Nhập giải thưởng', roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE] },
  { to: '/scoring', label: 'Chấm điểm', roles: [RoleType.ADMIN] },
];

const roleLabels: Record<string, string> = {
  [RoleType.ADMIN]: 'Admin',
  [RoleType.BTC_FSTYLE]: 'BTC FStyle',
  [RoleType.MC]: 'MC',
  [RoleType.MEMBER]: 'Thành viên',
};

const Nav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

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
              <div
                ref={dropdownRef}
                style={{ position: 'relative' }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {/* Avatar trigger */}
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '5px 12px 5px 5px',
                    background: dropdownOpen ? 'rgba(254,230,34,.1)' : 'transparent',
                    border: `1px solid ${dropdownOpen ? 'rgba(254,230,34,.5)' : 'rgba(254,230,34,.2)'}`,
                    borderRadius: 30,
                    cursor: 'pointer',
                    transition: 'background .25s, border-color .25s',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(254,230,34,.15)',
                      border: '1px solid rgba(254,230,34,.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: 'var(--gold)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      fontFamily: 'Montserrat, sans-serif',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.name}
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    style={{
                      transition: 'transform .25s',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                      flexShrink: 0,
                    }}
                  >
                    <path d="M1 1L5 5L9 1" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: 240,
                    background: 'rgba(10,7,3,0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(254,230,34,.15)',
                    borderRadius: 14,
                    boxShadow: '0 12px 40px rgba(0,0,0,.6), 0 0 20px rgba(254,230,34,.08)',
                    overflow: 'hidden',
                    opacity: dropdownOpen ? 1 : 0,
                    transform: dropdownOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
                    pointerEvents: dropdownOpen ? 'all' : 'none',
                    transition: 'opacity .2s, transform .2s',
                    zIndex: 1001,
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
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
                          flexShrink: 0,
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: 'var(--text)',
                            fontFamily: 'Montserrat, sans-serif',
                            letterSpacing: '.04em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.name}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '.12em',
                            textTransform: 'uppercase',
                            color: 'var(--orange)',
                            marginTop: 2,
                          }}
                        >
                          {roleLabels[user.role] ?? user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Page links */}
                  {pageLinks.length > 0 && (
                    <div style={{ padding: '8px 6px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                      {pageLinks.map((pl) => {
                        const isActive = location.pathname === pl.to;
                        return (
                          <Link
                            key={pl.to}
                            to={pl.to}
                            onClick={() => setDropdownOpen(false)}
                            style={{
                              display: 'block',
                              padding: '10px 12px',
                              borderRadius: 8,
                              textDecoration: 'none',
                              fontSize: 12,
                              fontWeight: 700,
                              fontFamily: 'Montserrat, sans-serif',
                              letterSpacing: '.06em',
                              color: isActive ? 'var(--gold)' : 'var(--text)',
                              background: isActive ? 'rgba(254,230,34,.08)' : 'transparent',
                              transition: 'background .2s, color .2s',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'rgba(255,255,255,.04)';
                                e.currentTarget.style.color = 'var(--gold)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text)';
                              }
                            }}
                          >
                            {pl.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Logout */}
                  <div style={{ padding: '8px 6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: 'Montserrat, sans-serif',
                        letterSpacing: '.06em',
                        color: '#D04047',
                        cursor: 'pointer',
                        transition: 'background .2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(208,64,71,.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
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
          SHOWCASE NIGHT · 05.07.2026
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
