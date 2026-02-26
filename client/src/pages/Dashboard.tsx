import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowLeft, BarChart3, Database, Loader2, ThermometerSun, Zap } from "lucide-react";
import { Link } from "wouter";

import { useForecast } from "@/hooks/use-climate";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { ClimateChart } from "@/components/ClimateChart";

const VARIABLE_OPTIONS = [
  { label: "Temperature Anomaly (°C)", value: "temperature" },
  { label: "CO2 Concentration (ppm)", value: "co2" },
  { label: "Sea Level Rise (mm)", value: "sea_level" },
];

const REGION_OPTIONS = [
  { label: "Global Average", value: "global" },
  { label: "United States", value: "usa" },
  { label: "India", value: "india" },
  { label: "United Kingdom", value: "uk" },
  { label: "France", value: "france" },
  { label: "Germany", value: "germany" },
  { label: "China", value: "china" },
  { label: "Argentina", value: "argentina" },
  { label: "South Africa", value: "south africa" },
  { label: "Australia", value: "australia" },
  { label: "Indonesia", value: "indonesia" },
  { label: "Brazil", value: "brazil" },
  { label: "Russia", value: "russia" },
  { label: "Canada", value: "canada" },
  { label: "Japan", value: "japan" },
  { label: "Mexico", value: "mexico" },
];

const HORIZON_OPTIONS = [
  { label: "12 Years", value: 12 },
  { label: "24 Years", value: 24 },
  { label: "36 Years", value: 36 },
];

export default function Dashboard() {
  const [variable, setVariable] = useState("temperature");
  const [region, setRegion] = useState("global");
  const [horizon, setHorizon] = useState(24);

  const forecastMutation = useForecast();

  // Trigger initial fetch and on parameter changes
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    forecastMutation.mutate({
      variable,
      region,
      horizon: Number(horizon),
      model: "ensemble",
    });
  };

  const getVariableIcon = () => {
    switch (variable) {
      case "temperature": return <ThermometerSun className="w-5 h-5 text-primary" />;
      case "co2": return <AlertTriangle className="w-5 h-5 text-secondary" />;
      case "sea_level": return <Database className="w-5 h-5 text-primary" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getVariableLabel = () => VARIABLE_OPTIONS.find(o => o.value === variable)?.label || variable;

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-display font-bold text-glow">Analysis Engine</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">System Online</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls Sidebar */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Database className="w-5 h-5 text-primary" />
                Model Parameters
              </h2>
              
              <div className="space-y-5">
                <Select 
                  label="Climate Variable"
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  options={VARIABLE_OPTIONS}
                />
                
                <Select 
                  label="Region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  options={REGION_OPTIONS}
                />
                
                <Select 
                  label="Forecast Horizon"
                  value={horizon}
                  onChange={(e) => setHorizon(Number(e.target.value))}
                  options={HORIZON_OPTIONS}
                />

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={handleGenerate}
                    disabled={forecastMutation.isPending}
                  >
                    {forecastMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Running Model...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-5 w-5" />
                        Generate Forecast
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Visuals */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Metrics Row */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard glowColor="primary" className="p-5 overflow-visible">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Model Architecture</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {forecastMutation.data?.metrics?.model || "Ensemble"}
                  </h3>
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4 text-primary" />
                  </motion.div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">RMSE Error</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {forecastMutation.isPending ? "--" : forecastMutation.data?.metrics?.rmse?.toFixed(4) || "0.0000"}
                  </h3>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-emerald-400">
                    High Accuracy
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">MAE Variance</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold font-display text-white">
                    {forecastMutation.isPending ? "--" : forecastMutation.data?.metrics?.mae?.toFixed(4) || "0.0000"}
                  </h3>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-white/10 text-blue-400">
                    Stable
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Chart Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 relative min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      {getVariableIcon()}
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-semibold text-white">
                        {getVariableLabel()} Projection
                      </h2>
                      <p className="text-sm text-muted-foreground capitalize">
                        {REGION_OPTIONS.find(r => r.value === region)?.label} Region • {horizon} Year Horizon
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow relative">
                  {forecastMutation.isPending ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-xl">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                      <p className="text-primary font-medium tracking-widest uppercase animate-pulse">Computing Matrix...</p>
                    </div>
                  ) : forecastMutation.isError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive">
                      <AlertTriangle className="w-12 h-12 mb-4" />
                      <p className="font-medium">Failed to generate forecast</p>
                      <p className="text-sm opacity-80 mt-1">{forecastMutation.error.message}</p>
                      <Button className="mt-4" variant="outline" onClick={handleGenerate}>Try Again</Button>
                    </div>
                  ) : forecastMutation.data ? (
                    <ClimateChart 
                      historical={forecastMutation.data.historical}
                      forecast={forecastMutation.data.forecast}
                      variableName={getVariableLabel()}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Initialize model parameters to view projection.
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
