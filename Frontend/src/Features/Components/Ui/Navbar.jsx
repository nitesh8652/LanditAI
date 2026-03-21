import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { useAuth } from "../../Hooks/Hooks.js";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
 
];

export default function Navbar() {
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logoutHandler } = useAuth();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logoutHandler();
  };

  const initials = user?.username?.charAt(0).toUpperCase() ?? "U";


  //for disabling scoll effect in mobile devices
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        className="w-full max-w-6xl transition-all duration-500"
        style={{
          background: (scrolled || isMobile) ? "rgba(13, 12, 11, 0.72)" : "rgba(13, 12, 11, 0.0)",
          backdropFilter: (scrolled || isMobile) ? "blur(20px) saturate(1.4)" : "none",
          WebkitBackdropFilter: (scrolled || isMobile) ? "blur(20px) saturate(1.4)" : "none",
          border: (scrolled || isMobile) ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          borderRadius: "18px",
          padding: "10px 20px",
          boxShadow: (scrolled || isMobile) ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 select-none group">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #EC4E02, #b83300)",
                boxShadow: "0 0 16px rgba(236,78,2,0.4)",
              }}
            >
              <Zap size={16} fill="#f5f0e8" color="#f5f0e8" />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
              }}
            >
              Landit
              <span style={{ color: "#EC4E02" }}>.AI</span>
            </span>
          </a>

          {/* Desktop Nav Links - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = active === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: isActive
                      ? "rgba(245,240,232,0.95)"
                      : "rgba(245,240,232,0.5)",
                    background: isActive
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.15)"
                      : "1px solid transparent",
                    backdropFilter: isActive ? "blur(12px)" : "none",
                    WebkitBackdropFilter: isActive ? "blur(12px)" : "none",
                    boxShadow: isActive
                      ? "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(245,240,232,0.8)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(245,240,232,0.5)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#EC4E02" }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                {/* Login */}
                <a
                  href="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(245,240,232,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(245,240,232,0.95)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(245,240,232,0.7)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Sign In
                </a>

                {/* Sign Up */}
                <a
                  href="/login?tab=signup"
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f5f0e8",
                    background: "#EC4E02",
                    border: "1px solid #EC4E02",
                    boxShadow: "0 0 16px rgba(236,78,2,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d44400";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(236,78,2,0.45)";
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#EC4E02";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(236,78,2,0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Sign Up
                </a>
              </>
            ) : (
              // ── LOGGED IN: show Logout button THEN avatar + name ────────────────────────
              <div className="flex items-center gap-3">


                {/* User Info Capsule */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "5px 12px 5px 5px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Profile picture or initial fallback */}
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.username}
                      referrerPolicy="no-referrer"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid rgba(236,78,2,0.4)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#EC4E02,#b83300)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#f5f0e8",
                        border: "1.5px solid rgba(236,78,2,0.4)",
                      }}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Username */}
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "rgba(245,240,232,0.85)",
                      fontFamily: "'DM Sans', sans-serif",
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f5f0e8",
                    background: "#EC4E02",
                    border: "1px solid #EC4E02",
                    boxShadow: "0 0 16px rgba(236,78,2,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d44400";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(236,78,2,0.45)";
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#EC4E02";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(236,78,2,0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Logout
                </button>

              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f5f0e8",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden mt-3 pt-3 flex flex-col gap-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {navLinks.map((link) => {
              const isActive = active === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActive(link.label);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: isActive
                      ? "rgba(245,240,232,0.95)"
                      : "rgba(245,240,232,0.55)",
                    background: isActive
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid transparent",
                    backdropFilter: isActive ? "blur(12px)" : "none",
                  }}
                >
                  {link.label}
                </a>
              );
            })}
            {/* <div className="flex gap-2 mt-2 pb-1">
              <a
                href="/login"
                className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "rgba(245,240,232,0.75)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Login
              </a>
              <a
                href="/signup"
                className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#f5f0e8",
                  background: "#EC4E02",
                  border: "1px solid #EC4E02",
                }}
              >
                Sign Up
              </a>
            </div> */}

            {!user ? (
              <>
                {/* Login */}
                <a
                  href="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(245,240,232,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(245,240,232,0.95)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(245,240,232,0.7)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Sign In
                </a>

                {/* Sign Up */}
                <a
                  href="/login?tab=signup"
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f5f0e8",
                    background: "#EC4E02",
                    border: "1px solid #EC4E02",
                    boxShadow: "0 0 16px rgba(236,78,2,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d44400";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(236,78,2,0.45)";
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#EC4E02";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(236,78,2,0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Sign Up
                </a>
              </>
            ) : (
              // ── LOGGED IN: show Logout button THEN avatar + name ────────────────────────
              <div className="flex items-center gap-3">


                {/* User Info Capsule */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "5px 12px 5px 5px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {/* Profile picture or initial fallback */}
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.username}
                      referrerPolicy="no-referrer"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid rgba(236,78,2,0.4)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#EC4E02,#b83300)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#f5f0e8",
                        border: "1.5px solid rgba(236,78,2,0.4)",
                      }}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Username */}
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "rgba(245,240,232,0.85)",
                      fontFamily: "'DM Sans', sans-serif",
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f5f0e8",
                    background: "#EC4E02",
                    border: "1px solid #EC4E02",
                    boxShadow: "0 0 16px rgba(236,78,2,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d44400";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(236,78,2,0.45)";
                    e.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#EC4E02";
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(236,78,2,0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        )}
      </div>
    </nav>
  );
}