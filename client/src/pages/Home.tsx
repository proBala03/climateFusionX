import { Link } from "wouter";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Activity, Globe, Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { WeatherBackground } from "@/components/weather/WeatherBackground";

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 28, scale: 0.99, filter: "blur(10px)" },
    animate: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: shouldReduceMotion
      ? { duration: 0.2 }
      : { type: "spring", stiffness: 140, damping: 18, mass: 0.9 }
  } as const;

  const staggerContainer: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0.04 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      <WeatherBackground />
      {/* Decorative background elements */}
      <motion.div
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rotate-[14deg] bg-primary/50 border-2 border-border neo-shadow-lg -z-10"
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 18, -10, 0], y: [0, -14, 10, 0], rotate: [14, 10, 16, 14] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rotate-[-10deg] bg-accent/40 border-2 border-border neo-shadow-lg -z-10"
        aria-hidden
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -22, 12, 0], y: [0, 12, -16, 0], rotate: [-10, -6, -14, -10] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md neo-surface neo-shadow mb-8 bg-card"
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 260, damping: 18 }}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-accent border-2 border-border" />
            <span className="text-sm font-black tracking-wide uppercase">Next-Gen Predictive Modeling</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black mb-6 leading-[0.95] font-display"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 180, damping: 16 }}
          >
            <span className="neo-text-shadow">Climate</span>{" "}
            <span className="inline-block neo-surface neo-shadow bg-secondary text-secondary-foreground px-3 py-1 -rotate-1">
              FusionX
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Hybrid AI Engine for Climate Trend Analysis & Forecasting.
            Leveraging ensemble models to predict global shifts with unprecedented accuracy.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto group text-lg">
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg" onClick={() => window.open('https://github.com', '_blank')}>
              View Documentation
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
        >
          <motion.div
            variants={fadeInUp}
            whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02 }}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 240, damping: 18 }}
          >
            <GlassCard hoverable glowColor="primary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center mb-6 border-2 border-border neo-shadow">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Global Scope</h3>
              <p className="text-muted-foreground leading-relaxed">
                Analyze macroscopic trends across different regions with high-fidelity historical data integration.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02 }}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 240, damping: 18 }}
          >
            <GlassCard hoverable glowColor="secondary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center mb-6 border-2 border-border neo-shadow">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Ensemble Forecasting</h3>
              <p className="text-muted-foreground leading-relaxed">
                Utilize hybrid ARIMA/LSTM mock models to project future scenarios with calculated confidence bounds.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02 }}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 240, damping: 18 }}
          >
            <GlassCard hoverable glowColor="primary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-md bg-accent text-accent-foreground flex items-center justify-center mb-6 border-2 border-border neo-shadow">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Real-time Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lightning-fast metric computation delivering RMSE and MAE analysis on the fly for immediate insights.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
