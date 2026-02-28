import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface WindCloudChartProps {
  daily: DailyWeatherPoint[];
  forecast?: ForecastPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; dateLabel?: string; windSpeed?: number; cloudCover?: number; value?: number; lowerBound?: number; upperBound?: number; isForecast?: boolean };
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
          <p className="text-secondary">Wind (forecast): {Number(p.value ?? 0).toFixed(1)} km/h</p>
          {p.lowerBound != null && p.upperBound != null && (
            <p className="text-muted-foreground text-xs">
              95% CI: {Number(p.lowerBound).toFixed(1)} - {Number(p.upperBound).toFixed(1)} km/h
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-primary">Wind: {Number(p.windSpeed ?? 0).toFixed(1)} km/h</p>
          <p className="text-muted-foreground">Cloud: {Number(p.cloudCover ?? 0).toFixed(0)}%</p>
        </>
      )}
    </div>
  );
};

export function WindCloudChart({ daily, forecast }: WindCloudChartProps) {
  const hasWindOrCloud = daily.some(
    (d) =>
      (d.windSpeed != null && !Number.isNaN(d.windSpeed)) ||
      (d.cloudCover != null && !Number.isNaN(d.cloudCover))
  );
  
  const hasForecast = forecast && forecast.length > 0;
  
  if (!daily.length || !hasWindOrCloud) return null;

  if (hasForecast) {
    // Combined historical and forecast view
    const historical = daily.map((d) => ({
      date: d.date,
      dateLabel: d.date.slice(5),
      windSpeed: d.windSpeed ?? 0,
      cloudCover: d.cloudCover ?? 0,
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
            <linearGradient id="windForecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis yAxisId="wind" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis yAxisId="cloud" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          
          {/* Wind forecast confidence interval */}
          <Area
            yAxisId="wind"
            type="monotone"
            dataKey="lowerBound"
            fill="url(#windForecastGradient)"
            stroke="none"
            name="Wind 95% CI"
            isAnimationActive={false}
          />
          
          {/* Historical wind */}
          <Line
            yAxisId="wind"
            type="monotone"
            dataKey="windSpeed"
            name="Wind Historical (km/h)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          
          {/* Forecast wind */}
          <Line
            yAxisId="wind"
            type="monotone"
            dataKey="value"
            name="Wind Forecast (km/h)"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          
          {/* Cloud cover */}
          <Line
            yAxisId="cloud"
            type="monotone"
            dataKey="cloudCover"
            name="Cloud (%)"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            dot={false}
            opacity={0.7}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  // Original view without forecast
  const chartData = daily.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
    windSpeed: d.windSpeed ?? 0,
    cloudCover: d.cloudCover ?? 0,
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
        <YAxis yAxisId="wind" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <YAxis yAxisId="cloud" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          yAxisId="wind"
          type="monotone"
          dataKey="windSpeed"
          name="Wind (km/h)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="cloud"
          type="monotone"
          dataKey="cloudCover"
          name="Cloud (%)"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
