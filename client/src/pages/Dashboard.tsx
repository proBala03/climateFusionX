import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowLeft, BarChart3, Download, Loader2, ThermometerSun, Zap } from "lucide-react";
import { Link } from "wouter";

import { useForecast } from "@/hooks/use-climate";
import { useLatestWeather } from "@/hooks/use-latest-weather";
import { useWeatherByMonthYear } from "@/hooks/use-weather-by-month";
import { useWeatherByRange } from "@/hooks/use-weather-by-range";
import { useWeatherForecast } from "@/hooks/use-weather-forecast";
import { useWeatherForecastMonth } from "@/hooks/use-weather-forecast-month";
import { useWeatherForecastYear } from "@/hooks/use-weather-forecast-year";
import { useWeatherYearSummary } from "@/hooks/use-weather-year-summary";
import { useClimateSeries } from "@/hooks/use-climate-series";
import { useWeatherForecastWindCloud } from "@/hooks/use-weather-forecast-wind-cloud";
import { useWeatherForecastHumidityRainfall } from "@/hooks/use-weather-forecast-humidity-rainfall";
import { useWeatherForecastRainfallHistogram } from "@/hooks/use-weather-forecast-rainfall-histogram";
import { useWeatherForecastAqi } from "@/hooks/use-weather-forecast-aqi";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { ClimateChart } from "@/components/ClimateChart";
import { ClimateBackground } from "@/components/ClimateBackground";
import { WeatherDailyChart } from "@/components/WeatherDailyChart";
import { AqiDailyChart } from "@/components/AqiDailyChart";
import { TempBandChart } from "@/components/TempBandChart";
import { MonthlyBarChart } from "@/components/MonthlyBarChart";
import { CompareCitiesChart } from "@/components/CompareCitiesChart";
import { HumidityRainfallChart } from "@/components/HumidityRainfallChart";
import { ClimateVariableComparisonChart } from "@/components/ClimateVariableComparisonChart";
import { SeasonCompareChart } from "@/components/SeasonCompareChart";
import { RainfallHistogramChart } from "@/components/RainfallHistogramChart";
import { WindCloudChart } from "@/components/WindCloudChart";
import { exportChartToCsv, exportWeatherToCsv } from "@/lib/csv-export";
import { getClimateConditionFromForecast } from "@/lib/climate-utils";
import { Skeleton } from "@/components/ui/skeleton";

const VARIABLE_OPTIONS = [
  { label: "Temperature Anomaly (°C)", value: "temperature" },
  { label: "CO2 (ppm)", value: "co2" },
  { label: "Sea Level (mm)", value: "sea_level" },
];

const REGION_OPTIONS = [
  { label: "Global", value: "global" },
  { label: "India", value: "india" },
  { label: "USA", value: "usa" },
];

const HORIZON_OPTIONS = [
  { label: "1 Year (365 Days)", value: 365 },
  { label: "2 Years (730 Days)", value: 730 },
  { label: "3 Years (1095 Days)", value: 1095 },
];

const STORAGE_KEY = "climateFusionX_dashboard";

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

const MONTH_OPTIONS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const YEAR_OPTIONS = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
];

const WEATHER_SOURCE_OPTIONS = [
  { label: "Current (latest)", value: "current" },
  { label: "Month / Year", value: "month" },
];

const SEASON_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Monsoon (Jun–Sep)", value: "monsoon" },
  { label: "Winter (Dec–Feb)", value: "winter" },
];

const currentMonth = new Date().getMonth() + 1;

function getSeasonRange(preset: string, year: string): { from: string; to: string } | null {
  const y = Number(year);
  if (preset === "monsoon") return { from: `${y}-06-01`, to: `${y}-09-30` };
  if (preset === "winter") return { from: `${y}-12-01`, to: `${y + 1}-02-28` };
  return null;
}

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const validRegion = REGION_OPTIONS.some((o) => o.value === parsed.region);
    const validVariable = VARIABLE_OPTIONS.some((o) => o.value === parsed.variable);
    const validHorizon = HORIZON_OPTIONS.some((o) => o.value === parsed.horizon);
    const validCity = CITY_OPTIONS.some((o) => o.value === parsed.selectedCity);
    const month = Number(parsed.selectedMonth);
    const validMonth = Number.isInteger(month) && month >= 1 && month <= 12;
    const year = Number(parsed.selectedYear);
    const validYear = Number.isInteger(year) && (year === 2024 || year === 2025 || year === 2026);
    if (
      validRegion &&
      validVariable &&
      validHorizon &&
      validCity &&
      validMonth &&
      validYear &&
      (parsed.weatherSource === "current" || parsed.weatherSource === "month")
    ) {
      return {
        variable: parsed.variable as string,
        region: parsed.region as string,
        horizon: Number(parsed.horizon),
        selectedCity: parsed.selectedCity as string,
        weatherSource: parsed.weatherSource as "current" | "month",
        selectedMonth: String(parsed.selectedMonth),
        selectedYear: String(parsed.selectedYear),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export default function Dashboard() {
  const [variable, setVariable] = useState(() => loadStoredState()?.variable ?? "temperature");
  const [region, setRegion] = useState(() => loadStoredState()?.region ?? "global");
  const [horizon, setHorizon] = useState(() => loadStoredState()?.horizon ?? 365);
  const [selectedCity, setSelectedCity] = useState(() => loadStoredState()?.selectedCity ?? "Mumbai");
  const [weatherSource, setWeatherSource] = useState<"current" | "month">(() => loadStoredState()?.weatherSource ?? "month");
  const [selectedMonth, setSelectedMonth] = useState(() => loadStoredState()?.selectedMonth ?? String(currentMonth));
  const [selectedYear, setSelectedYear] = useState(() => loadStoredState()?.selectedYear ?? "2025");
  const [seasonPreset, setSeasonPreset] = useState<"none" | "monsoon" | "winter">("none");
  const [compareCity, setCompareCity] = useState("");

  const forecastMutation = useForecast();
  const latestWeather = useLatestWeather(selectedCity);
  const monthWeather = useWeatherByMonthYear(
    selectedCity,
    Number(selectedYear),
    Number(selectedMonth)
  );
  const forecastMonth = useWeatherForecastMonth(
    selectedCity,
    Number(selectedYear),
    Number(selectedMonth)
  );

  const seasonRange = getSeasonRange(seasonPreset, selectedYear);
  const rangeWeather = useWeatherByRange(
    selectedCity,
    seasonRange?.from ?? "",
    seasonRange?.to ?? ""
  );

  const monthWeatherCompare = useWeatherByMonthYear(
    compareCity,
    Number(selectedYear),
    Number(selectedMonth)
  );

  const weatherForecast = useWeatherForecast(selectedCity, 7);
  const weatherYearSummary = useWeatherYearSummary(selectedCity, Number(selectedYear));
  const forecastYear = useWeatherForecastYear(selectedCity, Number(selectedYear));

  const weatherForecastWindCloud = useWeatherForecastWindCloud(selectedCity, 7);
  const weatherForecastHumidityRainfall = useWeatherForecastHumidityRainfall(selectedCity, 7);
  const weatherForecastRainfallHistogram = useWeatherForecastRainfallHistogram(selectedCity, 7);
  const weatherForecastAqi = useWeatherForecastAqi(selectedCity, 7);

  const seasonRangeLastYear = getSeasonRange(seasonPreset, String(Number(selectedYear) - 1));
  const rangeWeatherLastYear = useWeatherByRange(
    selectedCity,
    seasonRangeLastYear?.from ?? "",
    seasonRangeLastYear?.to ?? ""
  );

  const climateTemp = useClimateSeries("temperature", region);
  const climateCo2 = useClimateSeries("co2", region);
  const climateSeaLevel = useClimateSeries("sea_level", region);

  const lastYear = Number(selectedYear) - 1;
  const monthWeatherLastYear = useWeatherByMonthYear(
    selectedCity,
    lastYear,
    Number(selectedMonth)
  );

  const isSeasonMode = seasonPreset !== "none" && seasonRange != null;
  const isCurrentWeather = weatherSource === "current";
  const isForecastYear = Number(selectedYear) >= 2026;

  const condition = isSeasonMode
    ? rangeWeather.condition
    : isCurrentWeather
      ? latestWeather.condition
      : isForecastYear
        ? forecastMonth.data
          ? getClimateConditionFromForecast(
              forecastMonth.data.predictedTotalRainfall,
              forecastMonth.data.predictedAvgTemp,
              forecastMonth.data.predictedRainDays
            )
          : "Partly Cloudy"
        : monthWeather.condition;
  const data = isSeasonMode
    ? rangeWeather.data
    : isCurrentWeather
      ? latestWeather.data
      : isForecastYear && forecastMonth.data
        ? {
            city: selectedCity,
            state: "",
            avgTemp: forecastMonth.data.predictedAvgTemp,
            rainfall: forecastMonth.data.predictedTotalRainfall,
            humidity: 0,
            aqi: 0,
            aqiCategory: "",
          }
        : monthWeather.data;
  const weatherError = isSeasonMode
    ? rangeWeather.error
    : isCurrentWeather
      ? latestWeather.error
      : isForecastYear
        ? forecastMonth.error
        : monthWeather.error;
  const isLoading = isSeasonMode
    ? rangeWeather.isLoading
    : isCurrentWeather
      ? latestWeather.isLoading
      : isForecastYear
        ? forecastMonth.isLoading
        : monthWeather.isLoading;
  const weatherDaily = isSeasonMode ? rangeWeather.daily : isForecastYear ? [] : monthWeather.daily;

  const yearSummaryForCharts =
    isForecastYear && forecastYear.data.length > 0
      ? forecastYear.data.map((p) => ({
          month: p.month,
          avgTemp: p.predictedAvgTemp,
          totalRainfall: p.predictedTotalRainfall,
          avgAqi: 0,
        }))
      : weatherYearSummary.data;

  // Trigger initial fetch
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regenerate forecast when horizon changes
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horizon]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        variable,
        region,
        horizon,
        selectedCity,
        weatherSource,
        selectedMonth,
        selectedYear,
      })
    );
  }, [variable, region, horizon, selectedCity, weatherSource, selectedMonth, selectedYear]);

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
      case "co2": return <BarChart3 className="w-5 h-5 text-primary" />;
      case "sea_level": return <BarChart3 className="w-5 h-5 text-primary" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getVariableLabel = () => VARIABLE_OPTIONS.find(o => o.value === variable)?.label || variable;
  const getRegionLabel = () => REGION_OPTIONS.find(o => o.value === region)?.label || region;
  const getHorizonLabel = () => HORIZON_OPTIONS.find(o => o.value === horizon)?.label?.replace(/\s*\(.*\)$/, "") || `${horizon} Days`;

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
            <div className="flex items-center gap-3 mb-2">
              <Link href="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
              </Link>
              <Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
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
                  label="Weather"
                  value={weatherSource}
                  onChange={(e) => setWeatherSource((e.target.value === "current" ? "current" : "month"))}
                  options={WEATHER_SOURCE_OPTIONS}
                />

                <Select
                  label="Month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  options={MONTH_OPTIONS}
                  disabled={isCurrentWeather}
                />

                <Select
                  label="Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  options={YEAR_OPTIONS}
                  disabled={isCurrentWeather}
                />

                <Select
                  label="Season preset"
                  value={seasonPreset}
                  onChange={(e) => setSeasonPreset((e.target.value === "monsoon" ? "monsoon" : e.target.value === "winter" ? "winter" : "none") as "none" | "monsoon" | "winter")}
                  options={SEASON_OPTIONS}
                />

                <Select
                  label="Compare city (vs)"
                  value={compareCity}
                  onChange={(e) => setCompareCity(e.target.value)}
                  options={[{ label: "None", value: "" }, ...CITY_OPTIONS]}
                />

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

            {/* Weather for selected month/year */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-display font-black mb-4 flex items-center gap-2 border-b-2 border-border pb-3">
                  <ThermometerSun className="w-5 h-5 text-foreground" />
                  {isCurrentWeather
                    ? "Current Weather"
                    : isSeasonMode
                      ? seasonPreset === "monsoon"
                        ? `Monsoon ${selectedYear}`
                        : `Winter ${selectedYear}–${Number(selectedYear) + 1}`
                      : `Weather for ${MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ?? selectedMonth} ${selectedYear}`}
                </h3>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : weatherError ? (
                  <p className="text-sm text-destructive py-2">{weatherError}</p>
                ) : !data ? (
                  <p className="text-sm text-muted-foreground py-2">
                    {isCurrentWeather ? "No weather data." : isSeasonMode ? "No data for this season." : "No data for this month."}
                  </p>
                ) : (
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
                      <span className="font-semibold">{data.rainfall.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">AQI</span>
                      <span className="font-semibold flex items-center gap-2">
                        {data.aqi != null && !Number.isNaN(data.aqi) ? Math.round(data.aqi) : "—"}
                        {data.aqiCategory && (
                          <span
                            className={
                              data.aqiCategory.toLowerCase().includes("good") || data.aqiCategory.toLowerCase().includes("satisfactory")
                                ? "text-emerald-600 dark:text-emerald-400"
                                : data.aqiCategory.toLowerCase().includes("moderate")
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : data.aqiCategory.toLowerCase().includes("poor")
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-red-600 dark:text-red-400"
                            }
                          >
                            ({data.aqiCategory})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-semibold">{condition}</span>
                    </div>
                    {isForecastYear && forecastMonth.data && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rain days (est.)</span>
                          <span className="font-semibold">~{forecastMonth.data.predictedRainDays} days</span>
                        </div>
                        <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                          Based on 2024–2025 seasonal averages; actual weather may vary.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Will it rain? (forecast year only) */}
            {!isCurrentWeather && !isSeasonMode && isForecastYear && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.19 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-display font-black mb-4 flex items-center gap-2 border-b-2 border-border pb-3">
                    Will it rain in {MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ?? selectedMonth} {selectedYear}?
                  </h3>
                  {forecastMonth.isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : forecastMonth.error ? (
                    <p className="text-sm text-destructive py-2">{forecastMonth.error}</p>
                  ) : forecastMonth.data ? (
                    <div className="space-y-3 text-sm">
                      <p className="font-semibold text-foreground">
                        {forecastMonth.data.willItRain ? "Yes" : "No"} — {forecastMonth.data.summary}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on 2024–2025 seasonal averages; actual weather may vary.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">Select a city and month to see forecast.</p>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {/* 7-day outlook */}
            {weatherForecast.data.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.21 }}
              >
                <GlassCard className="p-4">
                  <h3 className="text-sm font-display font-black mb-3 border-b border-border pb-2">7-day outlook</h3>
                  {weatherForecast.isLoading ? (
                    <p className="text-xs text-muted-foreground">Loading…</p>
                  ) : (
                    <ul className="space-y-2 text-xs">
                      {weatherForecast.data.map((day) => (
                        <li key={day.date} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{day.date.slice(5)}</span>
                          <span className="font-semibold">{day.avgTemp.toFixed(1)}°C</span>
                          <span className="text-muted-foreground">{day.rainfall.toFixed(0)} mm</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {!isCurrentWeather && !isSeasonMode && compareCity && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <GlassCard className="p-4">
                  <h3 className="text-sm font-display font-black mb-3 border-b border-border pb-2">vs {compareCity}</h3>
                  {monthWeatherCompare.isLoading ? (
                    <p className="text-xs text-muted-foreground">Loading…</p>
                  ) : monthWeatherCompare.data ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg temp</span>
                        <span className="font-semibold">{monthWeatherCompare.data.avgTemp.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rainfall</span>
                        <span className="font-semibold">{monthWeatherCompare.data.rainfall.toFixed(1)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AQI</span>
                        <span className="font-semibold">{monthWeatherCompare.data.aqi != null ? Math.round(monthWeatherCompare.data.aqi) : "—"} ({monthWeatherCompare.data.aqiCategory || "—"})</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No data</p>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {!isCurrentWeather && !isSeasonMode && Number(selectedYear) > 2024 && data && monthWeatherLastYear.data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.23 }}
              >
                <GlassCard className="p-4">
                  <h3 className="text-sm font-display font-black mb-3 border-b border-border pb-2">
                    {MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ?? selectedMonth} {selectedYear} vs {lastYear}
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg temp</span>
                      <span className="font-semibold">
                        {(data.avgTemp - monthWeatherLastYear.data.avgTemp) >= 0 ? "+" : ""}
                        {(data.avgTemp - monthWeatherLastYear.data.avgTemp).toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rainfall</span>
                      <span className="font-semibold">
                        {(data.rainfall - monthWeatherLastYear.data.rainfall) >= 0 ? "+" : ""}
                        {(data.rainfall - monthWeatherLastYear.data.rainfall).toFixed(1)} mm
                      </span>
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
                        {getRegionLabel()} · {getHorizonLabel()} Horizon
                      </p>
                    </div>
                  </div>
                  {forecastMutation.data && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportChartToCsv(
                          forecastMutation.data!.historical,
                          forecastMutation.data!.forecast,
                          `climate-forecast-${variable}-${region}.csv`
                        )
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>

                <div className="flex-grow relative min-h-[400px]">
                  {forecastMutation.isPending ? (
                    <div className="absolute inset-0 flex flex-col gap-4 p-4 z-10">
                      <div className="flex gap-2 items-end flex-1">
                        {[40, 65, 45, 80, 55, 70, 50, 60, 75, 45].map((h, i) => (
                          <Skeleton key={i} className="flex-1 min-w-[8px]" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-2/3 mx-auto" />
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

            {!isCurrentWeather && weatherDaily.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-3 border-b-2 border-border pb-4">
                    <h3 className="text-lg font-display font-black">Daily weather</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportWeatherToCsv(
                          weatherDaily,
                          `weather-${selectedCity}-${selectedYear}-${selectedMonth}.csv`
                        )
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  <WeatherDailyChart daily={weatherDaily} />
                </GlassCard>
              </motion.div>
            )}

            {/* Weather insights / Charts */}
            {(weatherDaily.length > 0 || yearSummaryForCharts.length > 0 || (compareCity && monthWeather.daily.length > 0 && monthWeatherCompare.daily.length > 0) || (climateTemp.data.length > 0 && climateCo2.data.length > 0 && climateSeaLevel.data.length > 0) || (isSeasonMode && rangeWeather.data && rangeWeatherLastYear.data)) && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
              >
                <h3 className="text-lg font-display font-black border-b-2 border-border pb-2">Weather insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {weatherDaily.length > 0 && weatherDaily.some((d) => d.aqi != null) && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">AQI daily</h4>
                      <AqiDailyChart daily={weatherDaily} forecast={weatherForecastAqi.forecast} />
                    </GlassCard>
                  )}
                  {weatherDaily.length > 0 && weatherDaily.some((d) => d.minTemp != null || d.maxTemp != null) && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">Temp band (min–max)</h4>
                      <TempBandChart daily={weatherDaily} />
                    </GlassCard>
                  )}
                  {weatherDaily.length > 0 && weatherDaily.some((d) => d.humidity != null) && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">Humidity & rainfall</h4>
                      <HumidityRainfallChart daily={weatherDaily} forecast={weatherForecastHumidityRainfall.forecast} />
                    </GlassCard>
                  )}
                  {weatherDaily.length > 0 && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">Rainfall histogram</h4>
                      <RainfallHistogramChart daily={weatherDaily} forecast={weatherForecastRainfallHistogram.forecast} />
                    </GlassCard>
                  )}
                  {weatherDaily.length > 0 && weatherDaily.some((d) => d.windSpeed != null || d.cloudCover != null) && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">Wind & cloud</h4>
                      <WindCloudChart daily={weatherDaily} forecast={weatherForecastWindCloud.forecast} />
                    </GlassCard>
                  )}
                  {yearSummaryForCharts.length > 0 && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">
                        Monthly summary {selectedYear}
                        {isForecastYear && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">(forecast)</span>
                        )}
                      </h4>
                      <MonthlyBarChart data={yearSummaryForCharts} metric="avgTemp" />
                    </GlassCard>
                  )}
                  {yearSummaryForCharts.length > 0 && (
                    <GlassCard className="p-4">
                      <h4 className="text-sm font-semibold mb-2">
                        Monthly rainfall {selectedYear}
                        {isForecastYear && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">(forecast)</span>
                        )}
                      </h4>
                      <MonthlyBarChart data={yearSummaryForCharts} metric="totalRainfall" />
                    </GlassCard>
                  )}
                  {compareCity && monthWeather.daily.length > 0 && monthWeatherCompare.daily.length > 0 && (
                    <GlassCard className="p-4 md:col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Compare cities</h4>
                      <CompareCitiesChart
                        dailyA={monthWeather.daily}
                        dailyB={monthWeatherCompare.daily}
                        cityA={selectedCity}
                        cityB={compareCity}
                      />
                    </GlassCard>
                  )}
                  {climateTemp.data.length > 0 && climateCo2.data.length > 0 && climateSeaLevel.data.length > 0 && (
                    <GlassCard className="p-4 md:col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Climate variables (normalized)</h4>
                      <ClimateVariableComparisonChart
                        temperature={climateTemp.data}
                        co2={climateCo2.data}
                        seaLevel={climateSeaLevel.data}
                      />
                    </GlassCard>
                  )}
                  {isSeasonMode && rangeWeather.data && rangeWeatherLastYear.data && (
                    <GlassCard className="p-4 md:col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Season comparison</h4>
                      <SeasonCompareChart
                        summaries={[
                          {
                            label: seasonPreset === "monsoon" ? `Monsoon ${lastYear}` : `Winter ${lastYear}–${Number(selectedYear)}`,
                            avgTemp: rangeWeatherLastYear.data.avgTemp,
                            totalRainfall: rangeWeatherLastYear.data.rainfall,
                            avgAqi: rangeWeatherLastYear.data.aqi ?? 0,
                          },
                          {
                            label: seasonPreset === "monsoon" ? `Monsoon ${selectedYear}` : `Winter ${selectedYear}–${Number(selectedYear) + 1}`,
                            avgTemp: rangeWeather.data.avgTemp,
                            totalRainfall: rangeWeather.data.rainfall,
                            avgAqi: rangeWeather.data.aqi ?? 0,
                          },
                        ]}
                      />
                    </GlassCard>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
