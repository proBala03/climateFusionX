import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Globe, Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-16 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary tracking-wide uppercase">Next-Gen Predictive Modeling</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-display text-glow">
            Climate<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Fusion</span>X
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
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <GlassCard hoverable glowColor="primary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Global Scope</h3>
              <p className="text-muted-foreground leading-relaxed">
                Analyze macroscopic trends across different regions with high-fidelity historical data integration.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassCard hoverable glowColor="secondary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 border border-secondary/30 text-secondary">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Ensemble Forecasting</h3>
              <p className="text-muted-foreground leading-relaxed">
                Utilize hybrid ARIMA/LSTM mock models to project future scenarios with calculated confidence bounds.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassCard hoverable glowColor="primary" className="p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 text-primary">
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
