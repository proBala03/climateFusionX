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

export interface SeasonSummary {
  label: string;
  avgTemp: number;
  totalRainfall: number;
  avgAqi: number;
}

interface SeasonCompareChartProps {
  summaries: SeasonSummary[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: SeasonSummary }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.label}</p>
      <p className="text-primary">Avg temp: {p.avgTemp.toFixed(1)}°C</p>
      <p className="text-muted-foreground">Rainfall: {p.totalRainfall.toFixed(1)} mm</p>
      <p className="text-muted-foreground">Avg AQI: {p.avgAqi.toFixed(0)}</p>
    </div>
  );
};

export function SeasonCompareChart({ summaries }: SeasonCompareChartProps) {
  if (!summaries.length) return null;

  const chartData = summaries.map((s) => ({
    ...s,
    name: s.label,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="20%"
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar
          dataKey="avgTemp"
          name="Avg temp (°C)"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="totalRainfall"
          name="Rainfall (mm)"
          fill="hsl(var(--secondary))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="avgAqi"
          name="Avg AQI"
          fill="hsl(var(--accent))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
