"use client";

import { useEffect, useState } from "react";

export interface MonthForecastData {
  year: number;
  month: number;
  predictedTotalRainfall: number;
  predictedAvgTemp: number;
  predictedRainDays: number;
  willItRain: boolean;
  summary: string;
  basedOnYears: number[];
  lowerBoundRainfall?: number;
  upperBoundRainfall?: number;
}

interface UseWeatherForecastMonthResult {
  data: MonthForecastData | null;
  isLoading: boolean;
  error: string | null;
}

export function useWeatherForecastMonth(
  city: string,
  year: number,
  month: number
): UseWeatherForecastMonthResult {
  const [data, setData] = useState<MonthForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled =
    Boolean(city?.trim()) &&
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12;

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchForecast() {
      setError(null);
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          city: city.trim(),
          year: String(year),
          month: String(month),
        });
        const response = await fetch(`/api/weather/forecast/month?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch forecast: ${response.statusText}`
          );
        }
        const raw = await response.json();
        if (cancelled) return;
        setData({
          year: raw.year,
          month: raw.month,
          predictedTotalRainfall: Number(raw.predictedTotalRainfall ?? 0),
          predictedAvgTemp: Number(raw.predictedAvgTemp ?? 0),
          predictedRainDays: Number(raw.predictedRainDays ?? 0),
          willItRain: Boolean(raw.willItRain),
          summary: String(raw.summary ?? ""),
          basedOnYears: Array.isArray(raw.basedOnYears) ? raw.basedOnYears : [],
          lowerBoundRainfall: raw.lowerBoundRainfall != null ? Number(raw.lowerBoundRainfall) : undefined,
          upperBoundRainfall: raw.upperBoundRainfall != null ? Number(raw.upperBoundRainfall) : undefined,
        });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchForecast();
    return () => {
      cancelled = true;
    };
  }, [city, year, month, enabled]);

  return { data, isLoading, error };
}
