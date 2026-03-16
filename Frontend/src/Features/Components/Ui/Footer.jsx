import { useEffect, useRef } from "react";

// ── Inline SVG icons (no extra deps) ──────────────────────────────────────────
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

// ── AI Badge (consistent with previous badge) ─────────────────────────────────
const AIBadge = () => (
  <div className="ai-badge">
    <span className="ai-badge__dot" />
    <span className="ai-badge__label">AI Powered</span>
  </div>
);

// ── Main Footer ────────────────────────────────────────────────────────────────
export default function Footer() {
  const canvasRef = useRef(null);

  // Subtle animated ember particles on the glassmorphism surface
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.35 + 0.1),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random(),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 4;
          p.life = 1;
          p.alpha = Math.random() * 0.5 + 0.1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,78,2,${p.alpha * p.life})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const socials = [
    {
      icon: <GithubIcon />,
      label: "GitHub",
      href: "https://github.com/nitesh8652",
    },
    {
      icon: <LinkedinIcon />,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nitesh-salian-4792602a4/",
    },
    {
      icon: <InstagramIcon />,
      label: "Instagram",
      href: "https://www.instagram.com/_niteeesh?igsh=MXJtY2xwaWkxMXRycw==",
    },
  ];

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── CSS variables ── */
        :root {
          --bg:        #0d0c0b;
          --surface:   #111009;
          --accent:    #EC4E02;
          --accent-lo: rgba(236,78,2,0.12);
          --fg:        #f5f0e8;
          --fg-muted:  rgba(245,240,232,0.45);
          --fg-faint:  rgba(245,240,232,0.12);
          --border:    rgba(245,240,232,0.07);
          --glass-bg:  rgba(17,16,9,0.55);
          --glass-bdr: rgba(236,78,2,0.18);
        }

        /* ── Footer shell ── */
        .ld-footer {
          position: relative;
          width: 100%;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* top separator line */
        .ld-footer__line {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--accent) 30%,
            rgba(236,78,2,0.3) 60%,
            transparent 100%
          );
        }

        /* ember canvas */
        .ld-footer__canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Glassmorphism card ── */
        .ld-footer__glass {
          position: relative;
          z-index: 1;
          margin: 28px 32px 28px;
          padding: 28px 36px;
          background: var(--glass-bg);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid var(--glass-bdr);
          border-radius: 16px;
          box-shadow:
            0 0 0 1px rgba(236,78,2,0.06) inset,
            0 8px 32px rgba(0,0,0,0.45),
            0 2px 8px rgba(236,78,2,0.07);
        }

        /* inner glow edge */
        .ld-footer__glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(
            ellipse 80% 50% at 50% 0%,
            rgba(236,78,2,0.07) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        /* ── Layout ── */
        .ld-footer__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        /* ── Left block ── */
        .ld-footer__left {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ld-footer__brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ld-footer__logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--fg);
          letter-spacing: -0.3px;
          line-height: 1;
        }

        .ld-footer__logo span {
          color: var(--accent);
        }

        .ld-footer__byline {
          font-size: 12px;
          font-weight: 300;
          color: var(--fg-muted);
          letter-spacing: 0.04em;
        }

        .ld-footer__byline strong {
          color: rgba(245,240,232,0.72);
          font-weight: 500;
        }

        /* ── AI Badge ── */
        .ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 11px 4px 8px;
          background: rgba(236,78,2,0.1);
          border: 1px solid rgba(236,78,2,0.28);
          border-radius: 100px;
          width: fit-content;
        }

        .ai-badge__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--accent); }
          50%       { opacity: 0.6; box-shadow: 0 0 12px var(--accent); }
        }

        .ai-badge__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
        }

        /* ── Divider (vertical) ── */
        .ld-footer__divider {
          width: 1px;
          height: 64px;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--border) 30%,
            var(--border) 70%,
            transparent
          );
          flex-shrink: 0;
        }

        /* ── Social links ── */
        .ld-footer__socials {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ld-footer__social {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          color: var(--fg-muted);
          text-decoration: none;
          border: 1px solid transparent;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: color 0.22s, background 0.22s, border-color 0.22s, transform 0.18s;
          background: rgba(245,240,232,0.03);
        }

        .ld-footer__social:hover {
          color: var(--fg);
          background: rgba(236,78,2,0.1);
          border-color: rgba(236,78,2,0.3);
          transform: translateY(-2px);
        }

        .ld-footer__social svg {
          flex-shrink: 0;
          transition: color 0.22s;
        }

        .ld-footer__social:hover svg {
          color: var(--accent);
        }

        /* ── Bottom micro bar ── */
        .ld-footer__bottom {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 32px 20px;
          gap: 6px;
        }

        .ld-footer__copy {
          font-size: 11px;
          color: var(--fg-faint);
          letter-spacing: 0.05em;
        }

        .ld-footer__copy-accent {
          color: rgba(236,78,2,0.4);
          font-size: 11px;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .ld-footer__glass {
            margin: 20px 16px;
            padding: 22px 20px;
          }
          .ld-footer__inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .ld-footer__divider { display: none; }
          .ld-footer__socials { flex-wrap: wrap; }
          .ld-footer__social span { display: none; }
          .ld-footer__social { padding: 9px; }
        }
      `}</style>

      <footer className="ld-footer">
        {/* top accent line */}
    

        {/* floating ember particles */}
        <canvas ref={canvasRef} className="ld-footer__canvas" />

        {/* glassmorphism card */}
        <div className="ld-footer__glass">
          <div className="ld-footer__inner">

            {/* ── Left: brand + badge + byline ── */}
            <div className="ld-footer__left">
              <div className="ld-footer__brand">
                <div className="ld-footer__logo">
                  Landit<span>.AI</span>
                </div>
                <AIBadge />
              </div>
              <p className="ld-footer__byline">
                Made by — <strong>Nitesh Salian</strong>
              </p>
            </div>

            {/* vertical separator */}
            <div className="ld-footer__divider" />

            {/* ── Right: social links ── */}
            <nav className="ld-footer__socials" aria-label="Social links">
              {socials.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ld-footer__social"
                  aria-label={label}
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </nav>

          </div>
        </div>

        {/* micro copyright bar */}
        {/* <div className="ld-footer__bottom">
          <span className="ld-footer__copy">© {new Date().getFullYear()} Landit.AI</span>
          <span className="ld-footer__copy-accent">·</span>
          <span className="ld-footer__copy">All rights reserved</span>
        </div> */}
      </footer>
    </>
  );
}