import HyperTextParagraph from "@/Features/Components/Ui/hyper-text-with-decryption"
import { motion } from "framer-motion";

export default function HyperTextDemo() {
  const bio =
    "Landit.AI helps candidates land better opportunities faster. Our AI analyses resumes, detects skill gaps, and optimises profiles for success.";

  const triggers = ["Landit.AI", "opportunities","AI", "skill","optimises.", "success."];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden"
      style={{ backgroundColor: "#0d0c0b" }}
    >
      {/* Ember Dark ambient glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236,78,2,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[15%] right-[-5%] w-[40%] h-[40%] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236,78,2,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Subtle warm grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,240,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-4xl w-full relative z-10"
      >
        {/* Header pill */}
      

        {/* Card */}
        <div
          className="rounded-4xl p-8 md:p-16 border backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(17,16,9,0.75)",
            borderColor: "rgba(245,240,232,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(236,78,2,0.05)",
          }}
        >
          <HyperTextParagraph
            text={bio}
            highlightWords={triggers}
            className="text-2xl md:text-4xl font-normal leading-[1.6]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          />
        </div>

        {/* Footer hint */}
        <p
          className="text-center mt-8 text-sm font-mono"
          style={{ color: "rgba(245,240,232,0.3)" }}
        >
          hover the{" "}
          <span style={{ color: "#EC4E02" }}>orange keywords</span>{" "}
          to decrypt!
        </p>
      </motion.div>
    </div>
  );
}