import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface WindCloudChartProps {
  daily: DailyWeatherPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; windSpeed?: number; cloudCover?: number };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date}</p>
      <p className="text-primary">Wind: {Number(p.windSpeed ?? 0).toFixed(1)} km/h</p>
      <p className="text-muted-foreground">Cloud: {Number(p.cloudCover ?? 0).toFixed(0)}%</p>
    </div>
  );
};

export function WindCloudChart({ daily }: WindCloudChartProps) {
  const hasWindOrCloud = daily.some(
    (d) =>
      (d.windSpeed != null && !Number.isNaN(d.windSpeed)) ||
      (d.cloudCover != null && !Number.isNaN(d.cloudCover))
  );
  if (!daily.length || !hasWindOrCloud) return null;

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
