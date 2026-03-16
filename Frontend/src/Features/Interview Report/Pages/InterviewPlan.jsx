import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/Features/Components/Ui/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 0.68, 0, 1.2] },
  }),
};

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

    // Particle factory
    const spawn = () => ({
      x:       Math.random() * canvas.width,
      y:       canvas.height + Math.random() * 60,        // start below fold
      r:       Math.random() * 1.2 + 0.2,                 // radius 0.5 – 2.7
      opacity: Math.random() * 0.55 + 0.08,               // 0.08 – 0.63
      speed:   Math.random() * 0.55 + 0.18,               // upward drift speed
      drift:   (Math.random() - 0.5) * 0.28,              // horizontal sway
      wobble:  Math.random() * Math.PI * 2,               // phase offset
      wobbleSpeed: Math.random() * 0.018 + 0.006,         // sway frequency
      // colour: amber → deep orange spectrum
      hue:     Math.random() * 22 + 18,                   // 18 – 40 (amber-orange)
      sat:     Math.random() * 20 + 80,                   // 80 – 100 %
      lum:     Math.random() * 20 + 50,                   // 50 – 70 %
    });

    // Seed initial particles spread across the canvas height
    for (let i = 0; i < 68; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;   // scatter vertically at start
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Gentle sinusoidal sway
        p.wobble += p.wobbleSpeed;
        p.x += p.drift + Math.sin(p.wobble) * 0.35;
        p.y -= p.speed;

        // Recycle when fully above the top
        if (p.y + p.r < -10) Object.assign(p, spawn());

        // Fade in near bottom, fade out near top
        const fadeZone = 80;
        const fromBottom = canvas.height - p.y;
        const fromTop    = p.y;
        let alpha = p.opacity;
        if (fromBottom < fadeZone) alpha *= fromBottom / fadeZone;
        if (fromTop    < fadeZone) alpha *= fromTop    / fadeZone;

        // Radial gradient for a soft glowing ember look
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
      style={{ opacity: 1 }}
    />
  );
}

/* ─── Main Component ─── */
export default function InterviewPlan() {
  const [jdText, setJdText] = useState("");
  const [selfDesc, setSelfDesc] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) return alert("Only PDF or DOCX files are supported.");
    if (file.size > 5 * 1024 * 1024) return alert("File must be under 5MB.");
    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleGenerate = () => {
    if (!jdText.trim()) return alert("Please paste a job description.");
    if (!uploadedFile && !selfDesc.trim())
      return alert("Please upload a resume or add a self-description.");
    console.log("Generating strategy...", { jdText, selfDesc, uploadedFile });
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#0d0c0b", fontFamily: "'DM Sans', sans-serif", color: "#f5f0e8" }}
    >
      {/* ── Floating amber particles ── */}
      <AmberParticles />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,240,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "10%", left: "-5%", width: "40%", height: "40%",
          background: "radial-gradient(circle, rgba(236,78,2,0.13) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none z-0"
        style={{
          bottom: "-10%", right: "-5%", width: "35%", height: "35%",
          background: "radial-gradient(circle, rgba(236,78,2,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 md:px-8 pt-10 pb-0 max-w-4xl w-full mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-9"
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
        >
          <h1
            className="text-3xl md:text-4xl font-semibold mb-3 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create Your Custom{" "}
            <span style={{ color: "#EC4E02" }}>Interview Plan</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.45)" }}>
            Let our AI analyze the job requirements and your unique profile
            <br className="hidden md:block" /> to build a winning strategy.
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

          {/* ── LEFT: Job Description ── */}
          <motion.div
            className="flex flex-col rounded-2xl p-5"
            style={{ backgroundColor: "#111009", border: "1px solid rgba(245,240,232,0.08)" }}
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            whileHover={{ borderColor: "rgba(236,78,2,0.22)" }}
            transition={{ borderColor: { duration: 0.25 } }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#f5f0e8" }}>
                <svg width="15" height="15" fill="none" stroke="rgba(245,240,232,0.45)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M8 9h8M8 13h5" />
                </svg>
                Target Job Description
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
                style={{
                  backgroundColor: "rgba(236,78,2,0.15)",
                  color: "#EC4E02",
                  border: "1px solid rgba(236,78,2,0.3)",
                  letterSpacing: "0.08em",
                }}
              >
                Required
              </span>
            </div>

            <textarea
              className="flex-1 min-h-[200px] rounded-lg p-3.5 text-sm resize-none outline-none transition-colors duration-200"
              style={{
                backgroundColor: "rgba(245,240,232,0.03)",
                border: "1px solid rgba(245,240,232,0.08)",
                color: "rgba(245,240,232,0.55)",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: "1.6",
              }}
              placeholder={`Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(236,78,2,0.4)";
                e.target.style.color = "#f5f0e8";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(245,240,232,0.08)";
                e.target.style.color = "rgba(245,240,232,0.55)";
              }}
            />
            <p className="mt-2 text-right text-xs" style={{ color: "rgba(245,240,232,0.25)" }}>
              {jdText.length} / 5000 chars
            </p>
          </motion.div>

          {/* ── RIGHT: Your Profile ── */}
          <motion.div
            className="flex flex-col rounded-2xl p-5 gap-3"
            style={{ backgroundColor: "#111009", border: "1px solid rgba(245,240,232,0.08)" }}
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            whileHover={{ borderColor: "rgba(236,78,2,0.22)" }}
            transition={{ borderColor: { duration: 0.25 } }}
          >
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#f5f0e8" }}>
              <svg width="15" height="15" fill="none" stroke="rgba(245,240,232,0.45)" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" />
              </svg>
              Your Profile
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: "rgba(245,240,232,0.55)" }}>
                Upload Resume
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "rgba(52,211,153,0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.25)",
                  letterSpacing: "0.08em",
                }}
              >
                Best Results
              </span>
            </div>

            <motion.div
              className="rounded-xl p-6 text-center cursor-pointer transition-colors duration-200"
              style={{
                border: `1.5px dashed ${isDragging ? "rgba(236,78,2,0.6)" : uploadedFile ? "rgba(236,78,2,0.4)" : "rgba(245,240,232,0.12)"}`,
                backgroundColor: isDragging || uploadedFile ? "rgba(236,78,2,0.05)" : "transparent",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              whileHover={{ backgroundColor: "rgba(236,78,2,0.04)", borderColor: "rgba(236,78,2,0.35)" }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {uploadedFile ? (
                <>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: "rgba(236,78,2,0.15)", border: "1px solid rgba(236,78,2,0.4)" }}
                  >
                    <svg width="16" height="16" fill="none" stroke="#EC4E02" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>{uploadedFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(236,78,2,0.7)" }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: "rgba(236,78,2,0.1)", border: "1px solid rgba(236,78,2,0.2)" }}
                  >
                    <svg width="16" height="16" fill="none" stroke="#EC4E02" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M8 8l4-4 4 4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>Click to upload or drag & drop</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.3)" }}>PDF or DOCX (Max 5MB)</p>
                </>
              )}
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,240,232,0.07)" }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(245,240,232,0.25)" }}>or</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,240,232,0.07)" }} />
            </div>

            <span className="text-xs font-medium" style={{ color: "rgba(245,240,232,0.55)" }}>
              Quick Self-Description
            </span>
            <textarea
              className="rounded-lg p-3 text-xs resize-none outline-none transition-colors duration-200"
              style={{
                minHeight: "80px",
                backgroundColor: "rgba(245,240,232,0.03)",
                border: "1px solid rgba(245,240,232,0.08)",
                color: "rgba(245,240,232,0.55)",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: "1.6",
              }}
              placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              value={selfDesc}
              onChange={(e) => setSelfDesc(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(236,78,2,0.4)";
                e.target.style.color = "#f5f0e8";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(245,240,232,0.08)";
                e.target.style.color = "rgba(245,240,232,0.55)";
              }}
            />

            <div
              className="rounded-lg px-3 py-2.5 flex items-start gap-2 text-xs leading-relaxed"
              style={{
                backgroundColor: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.18)",
                color: "rgba(147,197,253,0.85)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: "#3b82f6" }}
              />
              Either a Resume or a
              Self Description is required to generate a personalized plan.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bar */}
      <Footer />
    </div>
  );
}
