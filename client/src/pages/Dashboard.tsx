import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, BarChart3, Loader2, ThermometerSun, Zap } from "lucide-react";
import { Link } from "wouter";

import { useForecast } from "@/hooks/use-climate";
import { useLatestWeather } from "@/hooks/use-latest-weather";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { ClimateChart } from "@/components/ClimateChart";
import { ClimateBackground } from "@/components/ClimateBackground";

const VARIABLE_OPTIONS = [
  { label: "Temperature Anomaly (°C)", value: "temperature" },
];



const HORIZON_OPTIONS = [
  { label: "1 Year (365 Days)", value: 365 },
];

const CITY_OPTIONS = [
  { label: "Mumbai", value: "Mumbai" },
  { label: "Delhi", value: "Delhi" },
  { label: "Bengaluru", value: "Bengaluru" },
  { label: "Chennai", value: "Chennai" },
  { label: "Kolkata", value: "Kolkata" },
  { label: "Hyderabad", value: "Hyderabad" },
  { label: "Ahmedabad", value: "Ahmedabad" },
  { label: "Jaipur", value: "Jaipur" },
  { label: "Lucknow", value: "Lucknow" },
  { label: "Bhopal", value: "Bhopal" },
];

export default function Dashboard() {
  const [variable, setVariable] = useState("temperature");
  const [horizon, setHorizon] = useState(365);
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  const forecastMutation = useForecast();
  const { condition, data, isLoading } = useLatestWeather(selectedCity);

  // Trigger initial fetch
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regenerate forecast when horizon changes
  useEffect(() => {
    if (horizon !== 365) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horizon]);

  const handleGenerate = () => {
    forecastMutation.mutate({
      variable,
      horizon: Number(horizon),
      model: "ensemble",
    });
  };

  const getVariableIcon = () => {
    switch (variable) {
      case "temperature": return <ThermometerSun className="w-5 h-5 text-primary" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getVariableLabel = () => VARIABLE_OPTIONS.find(o => o.value === variable)?.label || variable;

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      {/* Climate animated background */}
      <ClimateBackground condition={condition} isLoading={isLoading} />

      {/* Background gradients */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rotate-[12deg] bg-secondary/35 border-2 border-border neo-shadow-lg -z-20" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rotate-[-10deg] bg-primary/30 border-2 border-border neo-shadow-lg -z-20" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Link href="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl font-display font-black neo-text-shadow">Analysis Engine</h1>
          </div>
          <div className="neo-surface neo-shadow bg-card px-3 py-2 rounded-md flex items-center gap-3">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-sm h-3 w-3 bg-accent border-2 border-border"></span>
            </div>
            <span className="text-sm font-black uppercase tracking-wider">System Online</span>
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
              <h2 className="text-lg font-display font-black mb-6 flex items-center gap-2 border-b-2 border-border pb-4">
                <BarChart3 className="w-5 h-5 text-foreground" />
                Model Parameters
              </h2>
              
              <div className="space-y-5">
                <Select 
                  label="Indian City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  options={CITY_OPTIONS}
                />

                <Select 
                  label="Climate Variable"
                  value={variable}
                  onChange={(e) => setVariable(e.target.value)}
                  options={VARIABLE_OPTIONS}
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

            {/* Current Weather Card */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-display font-black mb-4 flex items-center gap-2 border-b-2 border-border pb-3">
                    <ThermometerSun className="w-5 h-5 text-foreground" />
                    Current Weather
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-semibold">{data.city}, {data.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Temp</span>
                      <span className="font-semibold">{data.avgTemp.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity</span>
                      <span className="font-semibold">{data.humidity.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rainfall</span>
                      <span className="font-semibold">{data.rainfall.toFixed(1)}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-semibold">{condition}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
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
                  <h3 className="text-2xl font-black font-display text-foreground">
                    {forecastMutation.data?.metrics?.model || "Ensemble"}
                  </h3>
                  <motion.div 
                    className="w-8 h-8 rounded-md bg-primary text-primary-foreground border-2 border-border neo-shadow flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">RMSE Error</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-black font-display text-foreground">
                    {forecastMutation.isPending ? "--" : forecastMutation.data?.metrics?.rmse?.toFixed(4) || "0.0000"}
                  </h3>
                  <div className="text-xs font-black px-2 py-1 rounded-md border-2 border-border bg-background">
                    High Accuracy
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">MAE Variance</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-black font-display text-foreground">
                    {forecastMutation.isPending ? "--" : forecastMutation.data?.metrics?.mae?.toFixed(4) || "0.0000"}
                  </h3>
                  <div className="text-xs font-black px-2 py-1 rounded-md border-2 border-border bg-background">
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
                <div className="flex items-center justify-between mb-8 border-b-2 border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md neo-surface neo-shadow bg-card">
                      {getVariableIcon()}
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-black text-foreground">
                        {getVariableLabel()} Projection
                      </h2>
                      <p className="text-sm text-muted-foreground capitalize">
                        {horizon} Year Horizon
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow relative">
                  {forecastMutation.isPending ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10 rounded-md border-2 border-border neo-shadow">
                      <Loader2 className="w-12 h-12 text-foreground animate-spin mb-4" />
                      <p className="text-foreground font-black tracking-widest uppercase animate-pulse">Computing Matrix...</p>
                    </div>
                  ) : forecastMutation.isError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive">
                      <Zap className="w-12 h-12 mb-4" />
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
