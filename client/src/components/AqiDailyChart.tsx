import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface AqiDailyChartProps {
  daily: DailyWeatherPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { date?: string; aqi?: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date}</p>
      <p className="text-primary">AQI: {Number(p.aqi ?? 0).toFixed(0)}</p>
    </div>
  );
};

export function AqiDailyChart({ daily }: AqiDailyChartProps) {
  const hasAqi = daily.some((d) => d.aqi != null && !Number.isNaN(d.aqi));
  if (!daily.length || !hasAqi) return null;

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
