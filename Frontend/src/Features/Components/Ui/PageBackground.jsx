import { useRef, useEffect } from "react";

/* ─── Floating Amber Particles ─── */
function AmberParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => ({
      x:           Math.random() * canvas.width,
      y:           canvas.height + Math.random() * 60,
      r:           Math.random() * 1.2 + 0.2,
      opacity:     Math.random() * 0.55 + 0.08,
      speed:       Math.random() * 0.55 + 0.18,
      drift:       (Math.random() - 0.5) * 0.28,
      wobble:      Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.018 + 0.006,
      hue:         Math.random() * 22 + 18,
      sat:         Math.random() * 20 + 80,
      lum:         Math.random() * 20 + 50,
    });

    for (let i = 0; i < 68; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.35;
        p.y -= p.speed;

        if (p.y + p.r < -10) Object.assign(p, spawn());

        const fadeZone = 80;
        const fromBottom = canvas.height - p.y;
        const fromTop    = p.y;
        let alpha = p.opacity;
        if (fromBottom < fadeZone) alpha *= fromBottom / fadeZone;
        if (fromTop    < fadeZone) alpha *= fromTop    / fadeZone;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
        grd.addColorStop(0,   `hsla(${p.hue}, ${p.sat}%, ${p.lum}%, ${alpha})`);
        grd.addColorStop(0.5, `hsla(${p.hue}, ${p.sat}%, ${p.lum * 0.8}%, ${alpha * 0.6})`);
        grd.addColorStop(1,   `hsla(${p.hue}, ${p.sat}%, ${p.lum * 0.6}%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

/* ─── Page Background ─── */
// Props:
//   glowTopLeft    {bool} – show top-left ambient glow   (default: true)
//   glowBottomRight {bool} – show bottom-right ambient glow (default: true)
export default function PageBackground({
  glowTopLeft     = true,
  glowBottomRight = true,
}) {
  return (
    <>
      {/* Amber particles */}
      <AmberParticles />

      {/* Dot / line grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,240,232,0.04) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(245,240,232,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top-left ambient glow */}
      {glowTopLeft && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            top: "10%", left: "-5%",
            width: "40%", height: "40%",
            background:
              "radial-gradient(circle, rgba(236,78,2,0.13) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      )}

      {/* Bottom-right ambient glow */}
      {glowBottomRight && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            bottom: "-10%", right: "-5%",
            width: "35%", height: "35%",
            background:
              "radial-gradient(circle, rgba(236,78,2,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      )}
    </>
  );
}
