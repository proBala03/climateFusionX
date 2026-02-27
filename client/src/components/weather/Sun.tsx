import { motion, useReducedMotion } from "framer-motion";

export function Sun({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 blur-[2px] ${className}`}
      animate={
        shouldReduceMotion
          ? { opacity: 0.8 }
          : {
              scale: [1, 1.05, 1],
              rotate: [0, 90, 180, 270, 360],
            }
      }
      transition={{
        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
      }}
    >
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-yellow-200 to-orange-400 opacity-90 shadow-[0_0_60px_20px_rgba(250,204,21,0.3)] dark:shadow-[0_0_60px_20px_rgba(250,204,21,0.15)]" />
      {/* Inner Glow effect */}
      <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-50 animate-pulse" />
    </motion.div>
  );
}
