import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface RainfallHistogramChartProps {
  daily: DailyWeatherPoint[];
  forecast?: ForecastPoint[];
}

const BINS = [
  { label: "0–5 mm", min: 0, max: 5 },
  { label: "5–10 mm", min: 5, max: 10 },
  { label: "10–20 mm", min: 10, max: 20 },
  { label: "20+ mm", min: 20, max: Infinity },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { bin: string; count: number; forecastCount?: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? { bin: "", count: 0, forecastCount: 0 };
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.bin}</p>
      <p className="text-primary">Historical Days: {p.count}</p>
      {p.forecastCount != null && <p className="text-secondary">Forecast Days (est.): {p.forecastCount}</p>}
    </div>
  );
};

export function RainfallHistogramChart({ daily, forecast }: RainfallHistogramChartProps) {
  if (!daily.length) return null;

  const hasForecast = forecast && forecast.length > 0;

  const chartData = BINS.map((bin) => {
    const count = daily.filter((d) => {
      const r = d.rainfall ?? 0;
      return r >= bin.min && r < bin.max;
    }).length;
    
    let forecastCount = 0;
    if (hasForecast) {
      forecastCount = Math.round(forecast.reduce((sum, f) => {
        const r = f.value ?? 0;
        return r >= bin.min && r < bin.max ? sum + 1 : sum;
      }, 0) / Math.max(1, (daily.length / forecast.length)));
    }
    
    return { bin: bin.label, count, forecastCount };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="bin"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        {hasForecast && <Legend wrapperStyle={{ fontSize: 10 }} />}
        <Bar
          dataKey="count"
          name="Historical Days"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
        {hasForecast && (
          <Bar
            dataKey="forecastCount"
            name="Forecast Days (est.)"
            fill="hsl(var(--secondary))"
            radius={[4, 4, 0, 0]}
            opacity={0.6}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
