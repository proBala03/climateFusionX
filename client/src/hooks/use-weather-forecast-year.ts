"use client";

import { useEffect, useState } from "react";

export interface MonthlyForecastPoint {
  month: number;
  year: number;
  predictedTotalRainfall: number;
  predictedAvgTemp: number;
  predictedRainDays: number;
  lowerBoundRainfall?: number;
  upperBoundRainfall?: number;
}

interface UseWeatherForecastYearResult {
  data: MonthlyForecastPoint[];
  isLoading: boolean;
  error: string | null;
}

export function useWeatherForecastYear(
  city: string,
  year: number
): UseWeatherForecastYearResult {
  const [data, setData] = useState<MonthlyForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled = Boolean(city?.trim()) && Number.isInteger(year);

  useEffect(() => {
    if (!enabled) {
      setData([]);
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
        });
        const response = await fetch(`/api/weather/forecast/monthly?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch forecast: ${response.statusText}`
          );
        }
        const raw = await response.json();
        if (cancelled) return;
        const list = Array.isArray(raw) ? raw : [];
        setData(
          list.map((item: Record<string, unknown>) => ({
            month: Number(item.month ?? 0),
            year: Number(item.year ?? year),
            predictedTotalRainfall: Number(item.predictedTotalRainfall ?? 0),
            predictedAvgTemp: Number(item.predictedAvgTemp ?? 0),
            predictedRainDays: Number(item.predictedRainDays ?? 0),
            lowerBoundRainfall: item.lowerBoundRainfall != null ? Number(item.lowerBoundRainfall) : undefined,
            upperBoundRainfall: item.upperBoundRainfall != null ? Number(item.upperBoundRainfall) : undefined,
          }))
        );
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setData([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchForecast();
    return () => {
      cancelled = true;
    };
  }, [city, year, enabled]);

  return { data, isLoading, error };
}
