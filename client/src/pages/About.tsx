import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export default function About() {
  return (
    <div className="min-h-screen relative p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-display font-black">About ClimateFusionX</h1>
        </div>

        <GlassCard className="p-6 space-y-4">
          <p className="text-foreground">
            ClimateFusionX is a climate change trend analysis and forecasting platform. It combines
            historical climate data with predictive models to project temperature anomalies, CO2
            levels, and sea level changes across global, Indian, and USA regions.
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="text-xl font-display font-black border-b-2 border-border pb-2">
            Forecast model
          </h2>
          <p className="text-foreground">
            The projection engine uses an <strong>ensemble</strong> approach, blending multiple
            methods (including ARIMA and Gradient Boosting–style regression) to produce forecasts.
            Metrics such as <strong>RMSE</strong> (Root Mean Square Error) and{" "}
            <strong>MAE</strong> (Mean Absolute Error) summarize how well the model fits historical
            data and indicate typical prediction error magnitude.
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h2 className="text-xl font-display font-black border-b-2 border-border pb-2">
            Indian weather data
          </h2>
          <p className="text-foreground">
            City-level weather (temperature, humidity, rainfall, wind, AQI, pressure, cloud cover) is
            sourced from the <strong>Indian Climate Dataset 2024–2025</strong> (CSV). The Analysis
            Engine lets you view current weather or historical summaries by month and year, compare
            cities, and export data to CSV.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
