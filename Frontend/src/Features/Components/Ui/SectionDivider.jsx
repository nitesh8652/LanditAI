/**
 * SectionDivider
 * A styled horizontal rule that matches the Ember Dark design system.
 *
 * Usage:
 *   <SectionDivider label="scroll to continue" />   // with centre label
 *   <SectionDivider />                               // plain glow line
 */
export default function SectionDivider({ label }) {
  return (
    <div
      className="relative flex items-center justify-center w-full"
      style={{ padding: "0 2rem", margin: "0 auto", maxWidth: "900px" }}
      aria-hidden="true"
    >
      {/* Left arm */}
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(236,78,2,0.25) 60%, rgba(236,78,2,0.45))",
        }}
      />

      {/* Centre ornament */}
      <div className="flex items-center gap-2.5 px-4 shrink-0">
        {/* Left chevron dot */}
        <span
          style={{
            display: "inline-block",
            width: 4, height: 4,
            borderRadius: "50%",
            backgroundColor: "rgba(236,78,2,0.5)",
            boxShadow: "0 0 6px 2px rgba(236,78,2,0.35)",
          }}
        />

        {/* Optional label */}
        {label ? (
          <span
            className="text-xs uppercase tracking-[0.2em] select-none"
            style={{
              color: "rgba(236,78,2,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.2em",
            }}
          >
            {label}
          </span>
        ) : (
          /* Ember icon when no label */
          <svg
            width="14" height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.55 }}
          >
            <path
              d="M7 1C7 1 4.5 4.5 4.5 7.5C4.5 9.433 5.567 11 7 11C8.433 11 9.5 9.433 9.5 7.5C9.5 4.5 7 1 7 1Z"
              fill="rgba(236,78,2,0.7)"
            />
            <circle cx="7" cy="11" r="1.5" fill="rgba(236,78,2,0.5)" />
          </svg>
        )}

        {/* Right chevron dot */}
        <span
          style={{
            display: "inline-block",
            width: 4, height: 4,
            borderRadius: "50%",
            backgroundColor: "rgba(236,78,2,0.5)",
            boxShadow: "0 0 6px 2px rgba(236,78,2,0.35)",
          }}
        />
      </div>

      {/* Right arm */}
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(236,78,2,0.25) 60%, rgba(236,78,2,0.45))",
        }}
      />
    </div>
  );
}
