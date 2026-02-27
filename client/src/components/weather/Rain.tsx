import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function Rain({ count = 20 }: { count?: number }) {
    const shouldReduceMotion = useReducedMotion();
    const [drops, setDrops] = useState<{ id: number; left: string; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate random raindrops only on the client side
        const generatedDrops = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: Math.random() * 2,
            duration: 0.6 + Math.random() * 0.4, // Fast falling drops
        }));
        setDrops(generatedDrops);
    }, [count]);

    if (shouldReduceMotion) {
        return null; // Don't render rain if user prefers reduced motion
    }

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {drops.map((drop) => (
                <motion.div
                    key={drop.id}
                    className="absolute top-0 w-[1.5px] h-16 bg-gradient-to-b from-transparent via-blue-400/50 to-blue-500/20 dark:via-blue-500/40 dark:to-blue-400/10 rounded-full transform -rotate-12"
                    style={{ left: drop.left }}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: ['-10vh', '110vh'], opacity: [0, 1, 0] }}
                    transition={{
                        duration: drop.duration,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
