import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageBackground from "@/Features/Components/Ui/PageBackground";
import Footer from "@/Features/Components/Ui/Footer";
import { useInterview } from "@/Features/Hooks/useInterview";

/* ─────────────────────────────────────────
   ICONS (inline SVG helpers)
───────────────────────────────────────── */
const Icon = {
  chevronDown: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  technical: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  behavioural: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  roadmap: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  intention: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  answer: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  star: (
    <svg width="14" height="14" fill="#EC4E02" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" fill="none" stroke="#EC4E02" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  gap: (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

/* ─────────────────────────────────────────
   SEVERITY CONFIG
───────────────────────────────────────── */
const severity = {
  high:   { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",  text: "#f87171", dot: "#ef4444", label: "High" },
  medium: { bg: "rgba(236,78,2,0.12)",   border: "rgba(236,78,2,0.35)",  text: "#EC4E02", dot: "#EC4E02", label: "Medium" },
  low:    { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)", text: "#34d399", dot: "#34d399", label: "Low" },
};




/* ─────────────────────────────────────────
   SCORE RING
───────────────────────────────────────── */
function ScoreRing({ score }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(245,240,232,0.06)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke="#EC4E02" strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ filter: "drop-shadow(0 0 6px rgba(236,78,2,0.5))" }}
        />
        <text x="36" y="41" textAnchor="middle" fill="#f5f0e8"
          style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 10, color: "rgba(245,240,232,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Match
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   ACCORDION CARD (Technical / Behavioural)
───────────────────────────────────────── */
function QuestionCard({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 0.68, 0, 1.2] }}
      style={{
        backgroundColor: "#111009",
        border: `1px solid ${isOpen ? "rgba(236,78,2,0.28)" : "rgba(245,240,232,0.07)"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.25s",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start gap-3 p-4"
        style={{ background: "none", cursor: "pointer" }}
      >
        {/* Index badge */}
        <span
          style={{
            minWidth: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6,
            backgroundColor: isOpen ? "rgba(236,78,2,0.18)" : "rgba(245,240,232,0.05)",
            border: `1px solid ${isOpen ? "rgba(236,78,2,0.35)" : "rgba(245,240,232,0.1)"}`,
            fontSize: 11, fontWeight: 700,
            color: isOpen ? "#EC4E02" : "rgba(245,240,232,0.4)",
            transition: "all 0.25s",
            flexShrink: 0,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="flex-1 text-sm leading-relaxed"
          style={{
            color: isOpen ? "#f5f0e8" : "rgba(245,240,232,0.75)",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isOpen ? 500 : 400,
            transition: "color 0.2s",
          }}
        >
          {item.question}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: isOpen ? "#EC4E02" : "rgba(245,240,232,0.3)", marginTop: 2, flexShrink: 0 }}
        >
          {Icon.chevronDown}
        </motion.span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 flex flex-col gap-3" style={{ paddingLeft: "3rem" }}>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(236,78,2,0.15)" }} />

              {/* Intention */}
              <div
                className="rounded-lg p-3 flex gap-2.5"
                style={{
                  backgroundColor: "rgba(59,130,246,0.07)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                <span style={{ color: "#93c5fd", marginTop: 1, flexShrink: 0 }}>{Icon.intention}</span>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#93c5fd", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
                    Why they ask this
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(147,197,253,0.8)", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                    {item.intention}
                  </p>
                </div>
              </div>

              {/* Answer */}
              <div
                className="rounded-lg p-3 flex gap-2.5"
                style={{
                  backgroundColor: "rgba(236,78,2,0.06)",
                  border: "1px solid rgba(236,78,2,0.15)",
                }}
              >
                <span style={{ color: "#EC4E02", marginTop: 1, flexShrink: 0 }}>{Icon.answer}</span>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#EC4E02", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
                    Model Answer
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(245,240,232,0.65)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ROAD MAP CARD
───────────────────────────────────────── */
function RoadMapCard({ day, index }) {
  const [open, setOpen] = useState(false);
  const isLast = index === 7;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
        <div
          style={{
            width: 32, height: 32,
            borderRadius: "50%",
            backgroundColor: open ? "rgba(236,78,2,0.2)" : "rgba(245,240,232,0.05)",
            border: `1.5px solid ${open ? "#EC4E02" : "rgba(245,240,232,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.25s",
            boxShadow: open ? "0 0 12px rgba(236,78,2,0.25)" : "none",
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: open ? "#EC4E02" : "rgba(245,240,232,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            {day.day}
          </span>
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: 1.5, marginTop: 4, background: "rgba(245,240,232,0.07)", minHeight: 16 }} />
        )}
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1, marginBottom: isLast ? 0 : 12,
          backgroundColor: "#111009",
          border: `1px solid ${open ? "rgba(236,78,2,0.25)" : "rgba(245,240,232,0.07)"}`,
          borderRadius: 12,
          overflow: "hidden",
          transition: "border-color 0.25s",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-center justify-between p-3.5 gap-3"
          style={{ background: "none", cursor: "pointer" }}
        >
          <div>
            <p style={{ fontSize: 10, color: "rgba(236,78,2,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>
              Day {day.day}
            </p>
            <p style={{ fontSize: 13, fontWeight: 500, color: open ? "#f5f0e8" : "rgba(245,240,232,0.75)", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>
              {day.focus}
            </p>
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: open ? "#EC4E02" : "rgba(245,240,232,0.25)", flexShrink: 0 }}
          >
            {Icon.chevronDown}
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="tasks"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="px-3.5 pb-3.5 flex flex-col gap-2">
                <div style={{ height: 1, background: "rgba(236,78,2,0.12)", marginBottom: 4 }} />
                {day.tasks.map((task, ti) => (
                  <div key={ti} className="flex items-start gap-2.5">
                    <span
                      style={{
                        width: 18, height: 18, flexShrink: 0, marginTop: 1,
                        borderRadius: 4,
                        backgroundColor: "rgba(236,78,2,0.1)",
                        border: "1px solid rgba(236,78,2,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {Icon.check}
                    </span>
                    <p style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                      {task}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
// export default function InterviewReport({ data }) {
export default function InterviewReport({ data: propData }) {

  const [activeTab, setActiveTab] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);
  const {report} = useInterview()
  // if (!data) return null;


  // const data = propData ?? {
  //   resume: "John Doe",
  //   matchScore: 78,
  //   createdAt: null,
  //   technicalQuestion: [
  //     { question: "Explain the virtual DOM in React.", intention: "Tests core React knowledge.", answer: "Virtual DOM is a lightweight copy of the real DOM. React uses it to batch updates and minimize actual DOM manipulations for better performance." },
  //     { question: "What is event delegation?", intention: "Tests JavaScript fundamentals.", answer: "Event delegation attaches a single event listener to a parent element instead of multiple listeners on children, using event bubbling." },
  //   ],
  //   behaviouralQuestion: [
  //     { question: "Tell me about a time you handled a tight deadline.", intention: "Tests time management and pressure handling.", answer: "Use the STAR method: describe the Situation, Task, Action you took, and the Result achieved." },
  //     { question: "How do you handle disagreements with teammates?", intention: "Tests communication and collaboration skills.", answer: "Focus on listening actively, finding common ground, and keeping the team goal in mind." },
  //   ],
  //   skillGaps: [
  //     { skill: "System Design", severity: "high" },
  //     { skill: "TypeScript", severity: "medium" },
  //     { skill: "Testing (Jest)", severity: "low" },
  //   ],
  //   preparationPlan: [
  //     { day: 1, focus: "Data Structures", tasks: ["Revise arrays and linked lists", "Solve 5 LeetCode easy problems"] },
  //     { day: 2, focus: "System Design", tasks: ["Read system design primer", "Design a URL shortener"] },
  //     { day: 3, focus: "React Deep Dive", tasks: ["Revise hooks", "Build a small project using useReducer"] },
  //   ],
  // }


  const tabs = [
    {
      id: "technical",
      label: "Technical Questions",
      icon: Icon.technical,
      count: data.technicalQuestion?.length ?? 0,
    },
    {
      id: "behavioural",
      label: "Behavioural Questions",
      icon: Icon.behavioural,
      count: data.behaviouralQuestion?.length ?? 0,
    },
    {
      id: "roadmap",
      label: "Road Map",
      icon: Icon.roadmap,
      count: data.preparationPlan?.length ?? 0,
    },
  ];

  const activeQuestions =
    activeTab === "technical"
      ? data.technicalQuestion
      : activeTab === "behavioural"
      ? data.behaviouralQuestion
      : null;

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#0d0c0b", fontFamily: "'DM Sans', sans-serif", color: "#f5f0e8" }}
    >
      <PageBackground glowTopLeft={false} glowBottomRight={false} />

      {/* Subtle centre glow */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "50%",
          background: "radial-gradient(ellipse, rgba(236,78,2,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Shell ── */}
      <div className="relative z-10 flex-1 flex flex-col" style={{ padding: "24px 20px" }}>

        {/* ── Top meta bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-5"
          style={{
            backgroundColor: "#111009",
            border: "1px solid rgba(245,240,232,0.07)",
            borderRadius: 14,
            padding: "10px 18px",
          }}
        >
          <div>
            <p style={{ fontSize: 10, color: "rgba(245,240,232,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>
              Interview Report
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "#f5f0e8" }}>
              {data.resume?.split("\n")[0] ?? "Candidate"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Stars for match score visual */}
            <div className="hidden md:flex items-center gap-1" style={{ opacity: 0.7 }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ opacity: i < Math.round((data.matchScore / 100) * 5) ? 1 : 0.2 }}>
                  {Icon.star}
                </span>
              ))}
            </div>

            <ScoreRing score={data.matchScore} />

            <div
              style={{
                height: 36, width: 1,
                background: "rgba(245,240,232,0.07)",
              }}
            />

            <div className="text-right hidden sm:block">
              <p style={{ fontSize: 10, color: "rgba(245,240,232,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Prepared
              </p>
              <p style={{ fontSize: 12, color: "rgba(245,240,232,0.6)", marginTop: 1 }}>
                {new Date(data.createdAt?.$date ?? Date.now()).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 3-Column Layout ── */}
        <div
          className="flex-1 grid gap-3"
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 220px",
            gridTemplateRows: "1fr",
            minHeight: 0,
            height: "calc(100vh - 160px)",
          }}
        >

          {/* ══ LEFT SIDEBAR ══ */}
          <motion.nav
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
            style={{
              backgroundColor: "#111009",
              border: "1px solid rgba(245,240,232,0.07)",
              borderRadius: 16,
              padding: "16px 12px",
              gap: 6,
            }}
          >
            <p style={{ fontSize: 9, color: "rgba(245,240,232,0.25)", letterSpacing: "0.18em", textTransform: "uppercase", paddingLeft: 8, marginBottom: 6 }}>
              Sections
            </p>

            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOpenQuestion(null); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 w-full text-left transition-all duration-200"
                  style={{
                    backgroundColor: active ? "rgba(236,78,2,0.14)" : "transparent",
                    border: `1px solid ${active ? "rgba(236,78,2,0.3)" : "transparent"}`,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute", left: 0, top: "50%",
                        transform: "translateY(-50%)",
                        width: 3, height: "60%",
                        backgroundColor: "#EC4E02",
                        borderRadius: "0 4px 4px 0",
                        boxShadow: "0 0 8px rgba(236,78,2,0.6)",
                      }}
                    />
                  )}

                  <span style={{ color: active ? "#EC4E02" : "rgba(245,240,232,0.35)", transition: "color 0.2s" }}>
                    {tab.icon}
                  </span>

                  <span
                    className="flex-1 text-xs font-medium truncate"
                    style={{ color: active ? "#f5f0e8" : "rgba(245,240,232,0.5)", transition: "color 0.2s" }}
                  >
                    {tab.label}
                  </span>

                  <span
                    className="text-xs font-semibold rounded-md px-1.5 py-0.5 shrink-0"
                    style={{
                      backgroundColor: active ? "rgba(236,78,2,0.2)" : "rgba(245,240,232,0.05)",
                      color: active ? "#EC4E02" : "rgba(245,240,232,0.25)",
                      fontSize: 10,
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}

            {/* ── Divider ── */}
            <div style={{ flex: 1 }} />
            <div style={{ height: 1, background: "rgba(245,240,232,0.06)", margin: "4px 0" }} />

            {/* Tips footer */}
            <div
              className="rounded-xl p-3"
              style={{
                backgroundColor: "rgba(236,78,2,0.07)",
                border: "1px solid rgba(236,78,2,0.15)",
              }}
            >
              <p style={{ fontSize: 10, color: "#EC4E02", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Pro Tip
              </p>
              <p style={{ fontSize: 11, color: "rgba(245,240,232,0.45)", lineHeight: 1.55 }}>
                Use the STAR method for all behavioural questions.
              </p>
            </div>
          </motion.nav>

          {/* ══ MAIN CONTENT ══ */}
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col"
            style={{
              backgroundColor: "#111009",
              border: "1px solid rgba(245,240,232,0.07)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Content header */}
            <div
              className="flex items-center justify-between px-5 py-3.5 shrink-0"
              style={{ borderBottom: "1px solid rgba(245,240,232,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ color: "#EC4E02" }}>
                  {tabs.find((t) => t.id === activeTab)?.icon}
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: "#f5f0e8" }}>
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h3>
              </div>
              <span style={{ fontSize: 11, color: "rgba(245,240,232,0.3)" }}>
                {tabs.find((t) => t.id === activeTab)?.count} items
              </span>
            </div>

            {/* Scrollable body */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(236,78,2,0.2) transparent",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3"
                >
                  {/* Technical / Behavioural */}
                  {activeQuestions?.map((item, i) => (
                    <QuestionCard
                      key={i}
                      item={item}
                      index={i}
                      isOpen={openQuestion === i}
                      onToggle={() => setOpenQuestion(openQuestion === i ? null : i)}
                    />
                  ))}

                  {/* Road Map */}
                  {activeTab === "roadmap" && data.preparationPlan?.map((day, i) => (
                    <RoadMapCard key={day.day} day={day} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.main>

          {/* ══ RIGHT SIDEBAR ══ */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3"
            style={{
              backgroundColor: "#111009",
              border: "1px solid rgba(245,240,232,0.07)",
              borderRadius: 16,
              padding: "16px 14px",
              overflow: "hidden",
            }}
          >
            {/* Skill Gaps */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: "#EC4E02" }}>{Icon.gap}</span>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.05em" }}>
                  Skill Gaps
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {data.skillGaps?.map((gap, i) => {
                  const sev = severity[gap.severity] ?? severity.low;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 + 0.3 }}
                      className="rounded-xl p-3"
                      style={{
                        backgroundColor: sev.bg,
                        border: `1px solid ${sev.border}`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          style={{
                            width: 6, height: 6, borderRadius: "50%",
                            backgroundColor: sev.dot,
                            boxShadow: `0 0 5px ${sev.dot}`,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 9, fontWeight: 700, color: sev.text,
                            textTransform: "uppercase", letterSpacing: "0.12em",
                          }}
                        >
                          {sev.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(245,240,232,0.65)", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                        {gap.skill}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(245,240,232,0.06)" }} />

            {/* Quick stats */}
            <div>
              <p style={{ fontSize: 9, color: "rgba(245,240,232,0.25)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
                Quick Stats
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Technical", value: data.technicalQuestion?.length },
                  { label: "Behavioural", value: data.behaviouralQuestion?.length },
                  { label: "Plan Days", value: data.preparationPlan?.length },
                  { label: "Skill Gaps", value: data.skillGaps?.length },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-2.5 text-center"
                    style={{ backgroundColor: "rgba(245,240,232,0.03)", border: "1px solid rgba(245,240,232,0.07)" }}
                  >
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#EC4E02", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
                      {s.value}
                    </p>
                    <p style={{ fontSize: 9, color: "rgba(245,240,232,0.35)", marginTop: 3, letterSpacing: "0.06em" }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(245,240,232,0.06)" }} />

            {/* Match score breakdown */}
            <div>
              <p style={{ fontSize: 9, color: "rgba(245,240,232,0.25)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
                Match Analysis
              </p>
              {[
                { label: "Technical Fit", pct: Math.min(data.matchScore + 5, 100) },
                { label: "Experience",    pct: data.matchScore - 5 },
                { label: "Skill Overlap", pct: data.matchScore + 2 > 100 ? 98 : data.matchScore + 2 },
              ].map((bar, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: 11, color: "rgba(245,240,232,0.5)" }}>{bar.label}</span>
                    <span style={{ fontSize: 11, color: "#EC4E02", fontWeight: 600 }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, backgroundColor: "rgba(245,240,232,0.06)", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: [0.22, 0.68, 0, 1.2] }}
                      style={{
                        height: "100%", borderRadius: 4,
                        background: "linear-gradient(90deg, rgba(236,78,2,0.6), #EC4E02)",
                        boxShadow: "0 0 8px rgba(236,78,2,0.35)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* CTA */}
            <button
              className="w-full rounded-xl py-2.5 text-xs font-semibold tracking-wide transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(236,78,2,0.8), rgba(236,78,2,0.6))",
                border: "1px solid rgba(236,78,2,0.4)",
                color: "#f5f0e8",
                letterSpacing: "0.06em",
                boxShadow: "0 0 16px rgba(236,78,2,0.2)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(236,78,2,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(236,78,2,0.2)"; }}
            >
              Export Report
            </button>
          </motion.aside>
        </div>
      </div>
      <Footer/>
    </div>

  );
}
