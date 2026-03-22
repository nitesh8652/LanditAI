import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Github, Lock, Mail, ArrowRight, Chrome, Zap, User } from "lucide-react";
import { useSearchParams } from "react-router";
import { useAuth } from "../Hooks/Hooks";
import Loader from "../Components/Ui/Loader";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { loading, loginHandler, registerHandler, googleLoginHandler } = useAuth();

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (message, type = "error", action = null) => {
    setToast({ message, type, action });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Google login ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleError("");
    try {
      await googleLoginHandler();
      navigate("/ResumeBuilder");
    } catch (err) {
      setGoogleError("Google sign-in failed. Please try again.");
    }
  };

  // ── Field change handler (was broken — this is all it should do) ─────────────
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (activeTab === "signup" && !formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (activeTab === "signup" && !agreeTerms) {
      newErrors.terms = "You must agree to the terms.";
    }
    return newErrors;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMsg("");

    try {
      if (activeTab === "login") {
        await loginHandler({ email: formData.email, password: formData.password });
      } else {
        await registerHandler({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/ResumeBuilder");
    } catch (err) {
      if (err.code === "USER_NOT_FOUND") {
        showToast(
          "No account found with this email.",
          "error",
          { label: "Sign up instead", onClick: () => switchTab("signup") }
        );
      } else if (err.code === "INVALID_PASSWORD") {
        showToast("Incorrect password. Please try again.", "error");
      } else {
        showToast("No user found, SignUp first", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Tab switcher ─────────────────────────────────────────────────────────────
  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
    setSuccessMsg("");
    setRememberMe(false);
    setAgreeTerms(false);
  };

  // ── Sync tab from URL query param ────────────────────────────────────────────
  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab === "signup" ? "signup" : "login");
  }, [searchParams]);

  // ── Particle animation ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    let ps = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.3 + 0.05,
      o: Math.random() * 0.25 + 0.08,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 10000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 20;
          p.v = Math.random() * 0.3 + 0.05;
          p.o = Math.random() * 0.25 + 0.08;
        }
        ctx.fillStyle = `rgba(236,78,2,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.8, 2.5);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };
    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0c0b" }}>
        <Loader />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0d0c0b", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field {
          width: 100%; height: 44px; padding: 0 12px 0 40px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #f5f0e8; font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.25s ease;
        }
        .input-field::placeholder { color: rgba(245,240,232,0.3); }
        .input-field:focus {
          border-color: rgba(236,78,2,0.5); background: rgba(236,78,2,0.04);
          box-shadow: 0 0 0 3px rgba(236,78,2,0.08);
        }
        .tab-btn {
          flex: 1; padding: 8px 0; border: none; background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
          cursor: pointer; border-radius: 8px; transition: all 0.25s ease;
        }
        .social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px; height: 42px; border-radius: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(245,240,232,0.75); font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.25s ease;
        }
        .social-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); color: #f5f0e8; }
        .submit-btn {
          width: 100%; height: 48px; border-radius: 12px; background: #EC4E02;
          border: none; color: #f5f0e8; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 500; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 0 20px rgba(236,78,2,0.3);
        }
        .submit-btn:hover { background: #d44400; transform: scale(1.02); box-shadow: 0 0 32px rgba(236,78,2,0.5); }
        .submit-btn:active { transform: scale(0.98); }
        .card-in { animation: cardUp 0.7s cubic-bezier(.22,.61,.36,1) both; }
        @keyframes cardUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .blob-bg { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>

      {/* Background */}
      <div className="blob-bg" style={{ width: 500, height: 400, background: "radial-gradient(ellipse, rgba(236,78,2,0.12) 0%, transparent 70%)", top: -100, left: -80 }} />
      <div className="blob-bg" style={{ width: 400, height: 350, background: "radial-gradient(ellipse, rgba(236,78,2,0.08) 0%, transparent 70%)", bottom: -80, right: -60 }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(80% 60% at 50% 30%, rgba(236,78,2,0.04), transparent 60%)" }} />
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.6, mixBlendMode: "screen", pointerEvents: "none" }} />

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "16px 16px 0" }}>
        <div style={{ width: "100%", maxWidth: 1100, padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(13,12,11,0.65)", backdropFilter: "blur(20px) saturate(1.4)", boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#EC4E02,#b83300)", boxShadow: "0 0 16px rgba(236,78,2,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} fill="#f5f0e8" color="#f5f0e8" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#f5f0e8", letterSpacing: "-0.02em" }}>
              Landit<span style={{ color: "#EC4E02" }}>.AI</span>
            </span>
          </a>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(245,240,232,0.7)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            ← Back<span className="hidden sm:inline"> to Home</span>
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 40px", position: "relative", zIndex: 10 }}>
        <div className="card-in" style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 500, color: "#f5f0e8", letterSpacing: "-0.02em", marginBottom: 8 }}>
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ color: "rgba(245,240,232,0.45)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {activeTab === "login" ? "Sign in to continue to Landit.AI" : "Start your AI writing journey today"}
            </p>
          </div>

          <div style={{ background: "rgba(17,16,9,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", overflow: "hidden" }}>

            {/* Tab switcher */}
            <div style={{ display: "flex", padding: "12px 12px 0", gap: 4 }}>
              {["login", "signup"].map((tab) => (
                <button key={tab} type="button" className="tab-btn" onClick={() => switchTab(tab)}
                  style={{ color: activeTab === tab ? "#f5f0e8" : "rgba(245,240,232,0.4)", background: activeTab === tab ? "rgba(236,78,2,0.12)" : "transparent", border: activeTab === tab ? "1px solid rgba(236,78,2,0.25)" : "1px solid transparent", boxShadow: activeTab === tab ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none" }}>
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ padding: "24px" }}>

                {/* General error banner */}
                {errors.general && (
                  <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem", color: "#fca5a5" }}>
                    {errors.general}
                  </div>
                )}

                {successMsg && (
                  <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem", color: "#86efac" }}>
                    {successMsg}
                  </div>
                )}

                {/* Social buttons */}
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <button type="button" className="social-btn"><Github size={15} /> GitHub</button>
                  <button type="button" className="social-btn" onClick={handleGoogleLogin} disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                    <Chrome size={15} /> Google
                  </button>
                </div>

                {googleError && (
                  <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "8px 14px", marginBottom: 12, fontSize: "0.8rem", color: "#fca5a5" }}>
                    {googleError}
                  </div>
                )}

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(245,240,232,0.3)", textTransform: "uppercase" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Name — signup only */}
                  {activeTab === "signup" && (
                    <div>
                      <label htmlFor="name" style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)", marginBottom: 6 }}>Full Name</label>
                      <div style={{ position: "relative" }}>
                        <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                        <input id="name" name="name" type="text" autoComplete="name" placeholder="John Doe"
                          value={formData.name} onChange={handleChange} className="input-field"
                          style={errors.name ? { borderColor: "rgba(220,38,38,0.5)" } : {}} />
                      </div>
                      {errors.name && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.name}</p>}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)", marginBottom: 6 }}>Email Address</label>
                    <div style={{ position: "relative" }}>
                      <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                      <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                        value={formData.email} onChange={handleChange} className="input-field"
                        style={errors.email ? { borderColor: "rgba(220,38,38,0.5)" } : {}} />
                    </div>
                    {errors.email && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label htmlFor="password" style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)" }}>Password</label>
                      {activeTab === "login" && (
                        <a href="/forgot-password" style={{ fontSize: "0.75rem", color: "#EC4E02", textDecoration: "none", opacity: 0.85 }}>Forgot password?</a>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                      <input id="password" name="password" type={showPassword ? "text" : "password"}
                        autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                        placeholder="••••••••" value={formData.password} onChange={handleChange}
                        className="input-field" style={{ paddingRight: 40, ...(errors.password ? { borderColor: "rgba(220,38,38,0.5)" } : {}) }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(245,240,232,0.4)", cursor: "pointer", padding: 4 }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.password}</p>}
                  </div>

                  {/* Remember me */}
                  {activeTab === "login" && (
                    <label htmlFor="rememberMe" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input id="rememberMe" name="rememberMe" type="checkbox" checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ width: 15, height: 15, accentColor: "#EC4E02" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)" }}>Remember me for 30 days</span>
                    </label>
                  )}

                  {/* Terms */}
                  {activeTab === "signup" && (
                    <div>
                      <label htmlFor="agreeTerms" style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                        <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={agreeTerms}
                          onChange={(e) => { setAgreeTerms(e.target.checked); setErrors((p) => ({ ...p, terms: "" })); }}
                          style={{ width: 15, height: 15, accentColor: "#EC4E02", marginTop: 2 }} />
                        <span style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", lineHeight: 1.5 }}>
                          I agree to the <a href="/terms" style={{ color: "#EC4E02", textDecoration: "none" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#EC4E02", textDecoration: "none" }}>Privacy Policy</a>
                        </span>
                      </label>
                      {errors.terms && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.terms}</p>}
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={isLoading} className="submit-btn"
                    style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}>
                    {isLoading ? "Please wait..." : activeTab === "login" ? "Sign In" : "Create Account"}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "rgba(245,240,232,0.38)" }}>
                  {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => switchTab(activeTab === "login" ? "signup" : "login")}
                    style={{ background: "transparent", border: "none", color: "#EC4E02", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                    {activeTab === "login" ? "Create one" : "Sign in"}
                  </button>
                </p>

              </div>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.72rem", color: "rgba(245,240,232,0.2)", letterSpacing: "0.03em" }}>
            End-to-end encryption · Landit.AI © 2026
          </p>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 14, background: "rgba(17,16,9,0.92)", border: "1px solid rgba(239,68,68,0.35)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", backdropFilter: "blur(20px)", minWidth: 280, maxWidth: 420, animation: "toastIn 0.35s cubic-bezier(0.22,0.68,0,1.2) both" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" fill="none" stroke="#f87171" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.82rem", color: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{toast.message}</p>
            {toast.action && (
              <button type="button" onClick={() => { setToast(null); toast.action.onClick(); }}
                style={{ marginTop: 4, background: "transparent", border: "none", color: "#EC4E02", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {toast.action.label} →
              </button>
            )}
          </div>
          <button type="button" onClick={() => setToast(null)}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(245,240,232,0.3)", padding: 4, flexShrink: 0 }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}