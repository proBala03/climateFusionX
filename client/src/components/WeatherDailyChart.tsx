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

interface WeatherDailyChartProps {
  daily: DailyWeatherPoint[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { date?: string; avgTemp?: number; rainfall?: number } }> }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date}</p>
      <p className="text-primary">Avg temp: {Number(p.avgTemp).toFixed(1)}°C</p>
      <p className="text-muted-foreground">Rainfall: {Number(p.rainfall).toFixed(1)} mm</p>
    </div>
  );
};

export function WeatherDailyChart({ daily }: WeatherDailyChartProps) {
  if (!daily.length) return null;

  const chartData = daily.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
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
        <YAxis yAxisId="temp" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          yAxisId="temp"
          type="monotone"
          dataKey="avgTemp"
          name="Avg temp (°C)"
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
