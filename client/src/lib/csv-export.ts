import type { DataPoint, ForecastPoint } from "@shared/schema";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

function escapeCsvCell(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportChartToCsv(
  historical: DataPoint[],
  forecast: ForecastPoint[],
  filename: string
): void {
  const headers = ["year", "type", "value", "lowerBound", "upperBound"];
  const rows: string[][] = [headers];

  for (const d of historical) {
    rows.push([
      String(d.year),
      "historical",
      String(d.value),
      "",
      "",
    ].map(escapeCsvCell));
  }
  for (const d of forecast) {
    rows.push([
      String(d.year),
      "forecast",
      String(d.value),
      String(d.lowerBound),
      String(d.upperBound),
    ].map(escapeCsvCell));
  }

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportWeatherToCsv(
  daily: DailyWeatherPoint[],
  filename: string
): void {
  const headers = ["date", "avgTemp", "rainfall"];
  const rows: string[][] = [headers];

  for (const d of daily) {
    rows.push([d.date, String(d.avgTemp), String(d.rainfall)].map(escapeCsvCell));
  }

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
