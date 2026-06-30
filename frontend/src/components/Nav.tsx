import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

import { RoleType } from "~/constants/enums";
import useAuth from "~/hooks/useAuth";

const links = [
  { id: "event", label: "Sự Kiện" },
  { id: "concept", label: "Concept" },
  { id: "timeline", label: "Lộ Trình" },
  { id: "teams", label: "Đội Thi" },
  { id: "showcase", label: "Đêm Diễn" },
  { id: "awards", label: "Giải Thưởng" },
  { id: "partners", label: "Đối Tác" },
  { id: "club", label: "CLB" },
];

const allPageLinks = [
  {
    to: "/dashboard",
    label: "Bình chọn",
    roles: [RoleType.MEMBER, RoleType.BTC_FSTYLE],
  },
  {
    to: "/leaderboard",
    label: "Xếp hạng giải thưởng",
    roles: [RoleType.ADMIN, RoleType.MC],
  },
  {
    to: "/voting-leaderboard",
    label: "Xếp hạng vote",
    roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE],
  },
  {
    to: "/awards",
    label: "Nhập giải thưởng",
    roles: [RoleType.ADMIN, RoleType.BTC_FSTYLE],
  },
  { to: "/scoring", label: "Chấm điểm", roles: [RoleType.ADMIN] },
];

const roleLabels: Record<string, string> = {
  [RoleType.ADMIN]: "Admin",
  [RoleType.BTC_FSTYLE]: "BTC FStyle",
  [RoleType.MC]: "MC",
  [RoleType.MEMBER]: "Thành viên",
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

  const userRole = user?.role ?? "";
  const pageLinks = allPageLinks.filter((pl) =>
    pl.roles.some((r) => r === userRole),
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 68, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] flex items-center h-[68px] [transition:background_.35s,backdrop-filter_.35s,border-color_.35s]"
        style={{
          background: scrolled || menuOpen ? "rgba(5,3,1,0.95)" : "transparent",
          backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
          borderBottom:
            scrolled || menuOpen
              ? "1px solid rgba(254,230,34,.1)"
              : "1px solid transparent",
        }}
      >
        {/* Logo zone - fixed-width left panel */}
        <div className="nav-logo-zone w-[220px] min-w-[220px] h-full flex items-center pl-12 border-r border-[rgba(254,230,34,.08)]">
          <a
            href="/"
            title="Về trang chủ"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              if (window.location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/assets/images/FStyle.jpg"
              alt="FStyle Crew"
              className="nav-logo block w-[42px] h-[42px] rounded-full object-cover border-2 border-[rgba(254,230,34,.35)] shadow-[0_0_12px_rgba(254,230,34,.25)] [transition:transform_.3s_ease,box-shadow_.3s_ease]"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow =
                  "0 0 22px rgba(254,230,34,.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 0 12px rgba(254,230,34,.25)";
              }}
            />
          </a>
        </div>

        {/* Menu zone - fills remaining space */}
        <div className="nav-menu-zone flex-1 h-full flex items-center justify-between pl-10 pr-12">
          {/* Nav links */}
          <div className="nav-links flex items-center gap-7">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
                className="bg-transparent border-none cursor-pointer text-[11px] font-extrabold tracking-[.18em] uppercase transition-colors duration-[250ms] font-montserrat"
                style={{ color: hovered === link.id ? "var(--gold)" : "var(--dim)" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="nav-right flex items-center gap-6">
            <div
              className="nav-date text-[var(--gold)] text-[18px] tracking-[.04em] [text-shadow:0_0_18px_rgba(254,230,34,.6)] font-anton"
            >
              05.07.2026
            </div>

            {isAuthenticated && user ? (
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {/* Avatar trigger */}
                <button
                  type="button"
                  className="flex items-center gap-[10px] pt-[5px] pr-3 pb-[5px] pl-[5px] rounded-[30px] cursor-pointer [transition:background_.25s,border-color_.25s]"
                  style={{
                    background: dropdownOpen
                      ? "rgba(254,230,34,.1)"
                      : "transparent",
                    border: `1px solid ${dropdownOpen ? "rgba(254,230,34,.5)" : "rgba(254,230,34,.2)"}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-[rgba(254,230,34,.15)] border border-[rgba(254,230,34,.3)] flex items-center justify-center text-[13px] font-extrabold text-[var(--gold)] font-montserrat"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="text-[11px] font-extrabold tracking-[.08em] uppercase text-[var(--gold)] max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap font-montserrat"
                  >
                    {user.name}
                  </span>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className="shrink-0 [transition:transform_.25s]"
                    style={{
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div
                  className="absolute top-[calc(100%+8px)] right-0 w-60 bg-[rgba(10,7,3,0.98)] border border-[rgba(254,230,34,.15)] rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,.6),0_0_20px_rgba(254,230,34,.08)] overflow-hidden z-[1001] backdrop-blur-[20px] [transition:opacity_.2s,transform_.2s]"
                  style={{
                    opacity: dropdownOpen ? 1 : 0,
                    transform: dropdownOpen
                      ? "translateY(0) scale(1)"
                      : "translateY(-8px) scale(0.97)",
                    pointerEvents: dropdownOpen ? "all" : "none",
                  }}
                >
                  {/* User info */}
                  <div className="px-[18px] py-4 border-b border-[rgba(255,255,255,.06)]">
                    <div className="flex items-center gap-[10px]">
                      <div
                        className="w-9 h-9 rounded-full bg-[rgba(254,230,34,.15)] border border-[rgba(254,230,34,.3)] flex items-center justify-center text-[14px] font-extrabold text-[var(--gold)] shrink-0 font-montserrat"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className="text-[13px] font-extrabold text-[var(--text)] tracking-[.04em] overflow-hidden text-ellipsis whitespace-nowrap font-montserrat"
                        >
                          {user.name}
                        </p>
                        <p className="text-[10px] font-bold tracking-[.12em] uppercase text-[var(--orange)] mt-[2px]">
                          {roleLabels[user.role] ?? user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Page links */}
                  {pageLinks.length > 0 && (
                    <div className="px-[6px] py-2 border-b border-[rgba(255,255,255,.06)]">
                      {pageLinks.map((pl) => {
                        const isActive = location.pathname === pl.to;
                        return (
                          <Link
                            key={pl.to}
                            to={pl.to}
                            onClick={() => setDropdownOpen(false)}
                            className="block px-3 py-[10px] rounded-[8px] no-underline text-[12px] font-bold tracking-[.06em] [transition:background_.2s,color_.2s] font-montserrat"
                            style={{
                              color: isActive ? "var(--gold)" : "var(--text)",
                              background: isActive
                                ? "rgba(254,230,34,.08)"
                                : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background =
                                  "rgba(255,255,255,.04)";
                                e.currentTarget.style.color = "var(--gold)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.color = "var(--text)";
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
                  <div className="px-[6px] py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="block w-full px-3 py-[10px] rounded-[8px] border-none text-left text-[12px] font-bold tracking-[.06em] text-[#D04047] cursor-pointer bg-transparent [transition:background_.2s] font-montserrat"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(208,64,71,.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
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
                className="px-[22px] py-2 border-none rounded-[6px] text-[#050301] text-[11px] font-extrabold tracking-[.14em] uppercase no-underline cursor-pointer inline-block bg-[var(--gold)] shadow-[0_0_20px_rgba(254,230,34,.25)] [transition:background_.25s,box-shadow_.25s,transform_.15s] font-montserrat"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffe94a";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(254,230,34,.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--gold)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(254,230,34,.25)";
                }}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Hamburger button - mobile only (hidden via CSS on desktop) */}
        <button
          className="nav-hamburger flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer p-1 rounded"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className="block w-[22px] h-[2px] bg-[var(--gold)] rounded-[2px] [transition:transform_.3s,opacity_.3s]"
            style={{
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-[22px] h-[2px] bg-[var(--gold)] rounded-[2px] [transition:opacity_.3s]"
            style={{
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-[22px] h-[2px] bg-[var(--gold)] rounded-[2px] [transition:transform_.3s,opacity_.3s]"
            style={{
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        ref={menuRef}
        className="nav-mobile-menu fixed top-[68px] left-0 right-0 bottom-0 z-[999] bg-[rgba(5,3,1,0.97)] flex flex-col pt-8 px-7 pb-10 overflow-y-auto backdrop-blur-[20px] [transition:opacity_.3s,transform_.3s]"
        style={{
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        {/* Section links */}
        <div className="mb-8">
          <p className="text-[10px] font-bold tracking-[.2em] uppercase text-[rgba(255,255,255,.25)] mb-4">
            Trang chủ
          </p>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                className="bg-transparent border-b border-[rgba(255,255,255,.06)] cursor-pointer text-left py-3 text-[22px] font-extrabold tracking-[.06em] uppercase text-[var(--text)] [transition:color_.2s] font-montserrat"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page links */}
        {pageLinks.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold tracking-[.2em] uppercase text-[rgba(255,255,255,.25)] mb-4">
              Trang
            </p>
            <div className="flex flex-col gap-1">
              {pageLinks.map((pl) => (
                <Link
                  key={pl.to}
                  to={pl.to}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[22px] font-extrabold tracking-[.06em] uppercase no-underline border-b border-[rgba(255,255,255,.06)] text-[var(--text)] [transition:color_.2s] font-montserrat"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text)";
                  }}
                >
                  {pl.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Auth section */}
        <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,.08)]">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-[10px]">
                <div
                  className="w-9 h-9 rounded-full bg-[rgba(254,230,34,.15)] border border-[rgba(254,230,34,.3)] flex items-center justify-center text-[14px] font-extrabold text-[var(--gold)] font-montserrat"
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    className="text-[13px] font-extrabold text-[var(--gold)] tracking-[.06em] font-montserrat"
                  >
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[var(--dim)]">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="p-3 bg-[rgba(254,230,34,.08)] border border-[rgba(254,230,34,.25)] rounded-[8px] text-[var(--gold)] text-[12px] font-extrabold tracking-[.14em] uppercase cursor-pointer font-montserrat"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block p-[14px] bg-[var(--gold)] rounded-[8px] text-[#050301] text-[13px] font-extrabold tracking-[.14em] uppercase no-underline text-center font-montserrat"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Date */}
        <div
          className="mt-5 text-[rgba(254,230,34,.3)] text-[14px] tracking-[.12em] text-center font-anton"
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
