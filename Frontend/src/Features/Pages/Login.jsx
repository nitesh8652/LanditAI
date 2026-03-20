import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Github, Lock, Mail, ArrowRight, Chrome, Zap, User } from "lucide-react";
import { useSearchParams } from "react-router";
import { useAuth } from "../Hooks/Hooks";
import Loader from "../Components/Ui/Loader";
import { useNavigate } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Services/Firebase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate()

  const { loading, loginHandler, registerHandler, googleLoginHandler } = useAuth()

  // Add a state for Google-specific errors:
  const [googleError, setGoogleError] = useState("");

  const handleGoogleLogin = async () => {
    setGoogleError("")

    try {
      await googleLoginHandler()
      navigate("/ResumeBuilder")
    } catch (err) {
      setGoogleError("Google sign-in failed. Please try again.");
    }
  }
  // stores input data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // input handle changer Update form values when the user types.
  const handleChange = (e) => {
    const { id, value } = e.target;
    // prev → previous state
    // ...prev → keep existing fields
    // [id] → update the changed field
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Ensure user inputs are valid before submitting.
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

  // Form submit handler
  /**
  * @function handleSubmit
  * @description Form submission handler.
  * Order of operations:
  *  1. Prevent browser default (page reload).
  *  2. Validate fields — abort early if invalid.
  *  3. Call the appropriate auth handler.
  *  4. Navigate ONLY on success.
  *
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── 1. Validate first ──
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // abort — do not touch the API
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

      // ── 2. Navigate only after successful auth ──
      navigate("/ResumeBuilder");
    } catch (err) {
      // loginHandler / registerHandler re-throw on failure
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  // Reset form when switching tabs login and sign up
  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormData({ name: "", email: "", password: "" }); // resets form fields
    setErrors({});
    setSuccessMsg("");
    setRememberMe(false);
    setAgreeTerms(false);
  };
  const canvasRef = useRef(null);

  // Particle animation
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

    window.addEventListener("resize", () => { setSize(); init(); });
    init();
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  //if opened for signup the /login will open with the selected signin tab
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "signup") {
      setActiveTab("signup")
    } else {
      setActiveTab("login")
    }
  }, [searchParams])

  //display loading
  if (loading) {
    //aligning loader to center
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0c0b"
      }}>
        <Loader />
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0c0b", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .input-field {
          width: 100%;
          height: 44px;
          padding: 0 12px 0 40px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #f5f0e8;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .input-field::placeholder { color: rgba(245,240,232,0.3); }
        .input-field:focus {
          border-color: rgba(236,78,2,0.5);
          background: rgba(236,78,2,0.04);
          box-shadow: 0 0 0 3px rgba(236,78,2,0.08);
        }

        .tab-btn {
          flex: 1;
          padding: 8px 0;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.25s ease;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(245,240,232,0.75);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: #f5f0e8;
        }

        .submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          background: #EC4E02;
          border: none;
          color: #f5f0e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 0 20px rgba(236,78,2,0.3);
        }
        .submit-btn:hover {
          background: #d44400;
          transform: scale(1.02);
          box-shadow: 0 0 32px rgba(236,78,2,0.5);
        }
        .submit-btn:active { transform: scale(0.98); }

        .card-in {
          animation: cardUp 0.7s cubic-bezier(.22,.61,.36,1) both;
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .blob-bg {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
      `}</style>

      {/* Background blobs */}
      <div className="blob-bg" style={{ width: 500, height: 400, background: "radial-gradient(ellipse, rgba(236,78,2,0.12) 0%, transparent 70%)", top: -100, left: -80 }} />
      <div className="blob-bg" style={{ width: 400, height: 350, background: "radial-gradient(ellipse, rgba(236,78,2,0.08) 0%, transparent 70%)", bottom: -80, right: -60 }} />

      {/* Radial vignette */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(80% 60% at 50% 30%, rgba(236,78,2,0.04), transparent 60%)" }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: 0.6, mixBlendMode: "screen", pointerEvents: "none" }} />

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "center", padding: "16px 16px 0" }}>
        <div style={{
          width: "100%", maxWidth: 1100, padding: "10px 20px",
          borderRadius: 999, border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(13,12,11,0.65)",
          backdropFilter: "blur(20px) saturate(1.4)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#EC4E02,#b83300)", boxShadow: "0 0 16px rgba(236,78,2,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} fill="#f5f0e8" color="#f5f0e8" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#f5f0e8", letterSpacing: "-0.02em" }}>
              Landit<span style={{ color: "#EC4E02" }}>.AI</span>
            </span>
          </a>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(245,240,232,0.7)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 16px 40px", position: "relative", zIndex: 10 }}>
        <div className="card-in" style={{ width: "100%", maxWidth: 420 }}>

          {/* Badge */}


          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 500, color: "#f5f0e8", letterSpacing: "-0.02em", marginBottom: 8 }}>
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ color: "rgba(245,240,232,0.45)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {activeTab === "login"
                ? "Sign in to continue to Landit.AI"
                : "Start your AI writing journey today"}
            </p>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(17,16,9,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", overflow: "hidden" }}>

            {/* Tab switcher */}
            <div style={{ display: "flex", padding: "12px 12px 0", gap: 4 }}>
              {["login", "signup"].map((tab) => (
                <button key={tab} type="button" className="tab-btn" onClick={() => switchTab(tab)}
                  style={{
                    color: activeTab === tab ? "#f5f0e8" : "rgba(245,240,232,0.4)",
                    background: activeTab === tab ? "rgba(236,78,2,0.12)" : "transparent",
                    border: activeTab === tab ? "1px solid rgba(236,78,2,0.25)" : "1px solid transparent",
                    boxShadow: activeTab === tab ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
                  }}>
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form — onSubmit with e.preventDefault inside handleSubmit */}
            <form id={activeTab === "login" ? "login-form" : "signup-form"} onSubmit={handleSubmit} noValidate>
              <div style={{ padding: "24px" }} />

              {/* General error */}
              {errors.general && (
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem", color: "#fca5a5" }}>
                  {errors.general}
                </div>
              )}

              {/* Success message */}
              {successMsg && (
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem", color: "#86efac" }}>
                  {successMsg}
                </div>
              )}

              {/* Social buttons */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button type="button" className="social-btn">
                  <Github size={15} /> GitHub
                </button>
                <button
                  type="button"
                  className="social-btn"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  <Chrome size={15} /> Google
                </button>

                {googleError && (
                  <div style={{
                    background: "rgba(220,38,38,0.1)",
                    border: "1px solid rgba(220,38,38,0.3)",
                    borderRadius: 10, padding: "8px 14px",
                    marginBottom: 12, fontSize: "0.8rem", color: "#fca5a5"
                  }}>
                    {googleError}

                  </div>

                )}

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(245,240,232,0.3)", textTransform: "uppercase" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* ── Name (signup only) ── */}
                  {activeTab === "signup" && (
                    <div>
                      {/* htmlFor links label to input by matching id */}
                      <label htmlFor="name" style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)", marginBottom: 6, letterSpacing: "0.03em" }}>
                        Full Name
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                        <input
                          id="name"               // ← id used by handleChange & htmlFor
                          name="name"             // ← name for form serialization
                          type="text"
                          autoComplete="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-field"
                          style={errors.name ? { borderColor: "rgba(220,38,38,0.5)" } : {}}
                        />
                      </div>
                      {errors.name && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.name}</p>}
                    </div>
                  )}

                  {/* ── Email ── */}
                  <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)", marginBottom: 6, letterSpacing: "0.03em" }}>
                      Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                      <input
                        id="email"               // ← id
                        name="email"
                        type="email"             // ← correct input type
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        style={errors.email ? { borderColor: "rgba(220,38,38,0.5)" } : {}}
                      />
                    </div>
                    {errors.email && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.email}</p>}
                  </div>

                  {/* ── Password ── */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label htmlFor="password" style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(245,240,232,0.6)", letterSpacing: "0.03em" }}>
                        Password
                      </label>
                      {activeTab === "login" && (
                        <a href="/forgot-password" style={{ fontSize: "0.75rem", color: "#EC4E02", textDecoration: "none", opacity: 0.85 }}>Forgot password?</a>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <Lock size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(245,240,232,0.35)" }} />
                      <input
                        id="password"            // ← id
                        name="password"
                        type={showPassword ? "text" : "password"}  // ← toggles between text/password
                        autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="input-field"
                        style={{ paddingRight: 40, ...(errors.password ? { borderColor: "rgba(220,38,38,0.5)" } : {}) }}
                      />
                      <button
                        type="button"            // ← type="button" prevents form submission
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "rgba(245,240,232,0.4)", cursor: "pointer", padding: 4 }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.password}</p>}
                  </div>

                  {/* ── Remember me (login only) ── */}
                  {activeTab === "login" && (
                    <label htmlFor="rememberMe" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ width: 15, height: 15, accentColor: "#EC4E02" }}
                      />
                      <span style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)" }}>Remember me for 30 days</span>
                    </label>
                  )}

                  {/* ── Terms (signup only) ── */}
                  {activeTab === "signup" && (
                    <div>
                      <label htmlFor="agreeTerms" style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => { setAgreeTerms(e.target.checked); setErrors((p) => ({ ...p, terms: "" })); }}
                          style={{ width: 15, height: 15, accentColor: "#EC4E02", marginTop: 2 }}
                        />
                        <span style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.4)", lineHeight: 1.5 }}>
                          I agree to the <a href="/terms" style={{ color: "#EC4E02", textDecoration: "none" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#EC4E02", textDecoration: "none" }}>Privacy Policy</a>
                        </span>
                      </label>
                      {errors.terms && <p style={{ marginTop: 4, fontSize: "0.72rem", color: "#fca5a5" }}>{errors.terms}</p>}
                    </div>
                  )}

                  {/* ── Submit button ── type="submit" triggers handleSubmit → e.preventDefault */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-btn"
                    style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
                  >
                    {isLoading ? "Please wait..." : activeTab === "login" ? "Sign In" : "Create Account"}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
                </div>

                {/* Footer link */}
                <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "rgba(245,240,232,0.38)" }}>
                  {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => switchTab(activeTab === "login" ? "signup" : "login")}
                    style={{ background: "transparent", border: "none", color: "#EC4E02", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                  >
                    {activeTab === "login" ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom note */}
          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.72rem", color: "rgba(245,240,232,0.2)", letterSpacing: "0.03em" }}>
            Protected by end-to-end encryption · Landit.AI © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
