import { motion, useReducedMotion } from "framer-motion";

export function Cloud({ className = "", delay = 0, duration = 20 }: { className?: string, delay?: number, duration?: number }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute text-slate-300/60 dark:text-slate-600/30 drop-shadow-lg blur-[1px] ${className}`}
            initial={{ x: "-10vw", opacity: 0 }}
            animate={
                shouldReduceMotion
                    ? { opacity: 0.5, x: "20vw" }
                    : { x: ['-20vw', '120vw'], opacity: [0, 0.7, 0.7, 0] }
            }
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
            }}
        >
            <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.1332 20.1764 10.1916 17.8646 10.0163C17.3486 7.18184 14.9216 5 12 5C8.95679 5 6.4258 7.33129 6.04288 10.3013C3.7663 10.7417 2 12.7214 2 15.15C2 17.8284 4.17157 20 6.85 20H17.5V19Z" />
        </motion.svg>
    );
}
