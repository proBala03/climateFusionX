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
  ComposedChart,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface HumidityRainfallChartProps {
  daily: DailyWeatherPoint[];
  forecast?: ForecastPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; dateLabel?: string; humidity?: number; rainfall?: number; value?: number; lowerBound?: number; upperBound?: number; isForecast?: boolean };
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
          <p className="text-secondary">Forecast Value: {Number(p.value ?? 0).toFixed(1)}</p>
          {p.lowerBound != null && p.upperBound != null && (
            <p className="text-muted-foreground text-xs">
              95% CI: {Number(p.lowerBound).toFixed(1)} - {Number(p.upperBound).toFixed(1)}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-primary">Humidity: {Number(p.humidity ?? 0).toFixed(0)}%</p>
          <p className="text-muted-foreground">Rainfall: {Number(p.rainfall ?? 0).toFixed(1)} mm</p>
        </>
      )}
    </div>
  );
};

export function HumidityRainfallChart({ daily, forecast }: HumidityRainfallChartProps) {
  const hasHumidity = daily.some(
    (d) => d.humidity != null && !Number.isNaN(d.humidity)
  );
  
  const hasForecast = forecast && forecast.length > 0;
  
  if (!daily.length || !hasHumidity) return null;

  if (hasForecast) {
    // Combined historical and forecast view
    const historical = daily.map((d) => ({
      date: d.date,
      dateLabel: d.date.slice(5),
      humidity: d.humidity ?? 0,
      rainfall: d.rainfall ?? 0,
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
            <linearGradient id="humidityForecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis yAxisId="humidity" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          
          {/* Forecast confidence interval */}
          <Area
            yAxisId="humidity"
            type="monotone"
            dataKey="lowerBound"
            fill="url(#humidityForecastGradient)"
            stroke="none"
            name="Forecast 95% CI"
            isAnimationActive={false}
          />
          
          {/* Historical humidity */}
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            name="Humidity Historical (%)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          
          {/* Forecast value */}
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="value"
            name="Forecast Value"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          
          {/* Rainfall */}
          <Line
            yAxisId="rain"
            type="monotone"
            dataKey="rainfall"
            name="Rainfall (mm)"
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
    humidity: d.humidity ?? 0,
    rainfall: d.rainfall ?? 0,
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
        <YAxis yAxisId="humidity" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          yAxisId="humidity"
          type="monotone"
          dataKey="humidity"
          name="Humidity (%)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="rain"
          type="monotone"
          dataKey="rainfall"
          name="Rainfall (mm)"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
