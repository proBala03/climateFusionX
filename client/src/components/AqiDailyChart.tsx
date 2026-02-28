import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface AqiDailyChartProps {
  daily: DailyWeatherPoint[];
  forecast?: ForecastPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; dateLabel?: string; aqi?: number; value?: number; lowerBound?: number; upperBound?: number; isForecast?: boolean };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  const isForecast = p.isForecast;
  
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date || p.dateLabel}</p>
      {isForecast ? (
        <>
          <p className="text-secondary">AQI (forecast): {Number(p.value ?? 0).toFixed(0)}</p>
          {p.lowerBound != null && p.upperBound != null && (
            <p className="text-muted-foreground text-xs">
              95% CI: {Number(p.lowerBound).toFixed(0)} - {Number(p.upperBound).toFixed(0)}
            </p>
          )}
        </>
      ) : (
        <p className="text-primary">AQI: {Number(p.aqi ?? 0).toFixed(0)}</p>
      )}
    </div>
  );
};

export function AqiDailyChart({ daily, forecast }: AqiDailyChartProps) {
  const hasAqi = daily.some((d) => d.aqi != null && !Number.isNaN(d.aqi));
  
  const hasForecast = forecast && forecast.length > 0;
  
  if (!daily.length || !hasAqi) return null;

  if (hasForecast) {
    // Combined historical and forecast view
    const historical = daily.map((d) => ({
      date: d.date,
      dateLabel: d.date.slice(5),
      aqi: d.aqi ?? 0,
      isForecast: false,
    }));

    const forecastData = forecast.map((f) => ({
      date: f.date,
      dateLabel: f.date.slice(5),
      value: f.value,
      lowerBound: f.lowerBound,
      upperBound: f.upperBound,
      isForecast: true,
    }));

    const chartData = [...historical, ...forecastData];

    return (
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aqiForecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          
          {/* AQI forecast confidence interval */}
          <Area
            type="monotone"
            dataKey="lowerBound"
            fill="url(#aqiForecastGradient)"
            stroke="none"
            name="AQI 95% CI"
            isAnimationActive={false}
          />
          
          {/* Historical AQI */}
          <Line
            type="monotone"
            dataKey="aqi"
            name="AQI Historical"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          
          {/* Forecast AQI */}
          <Line
            type="monotone"
            dataKey="value"
            name="AQI Forecast"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // Original view without forecast
  const chartData = daily.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
    aqi: d.aqi ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="aqi"
          name="AQI"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
