"use client";

import { useEffect, useState } from "react";

export interface MonthSummary {
  month: number;
  avgTemp: number;
  totalRainfall: number;
  avgAqi: number;
}

interface UseWeatherYearSummaryResult {
  data: MonthSummary[];
  isLoading: boolean;
  error: string | null;
}

export function useWeatherYearSummary(
  city: string,
  year: number
): UseWeatherYearSummaryResult {
  const [data, setData] = useState<MonthSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled =
    Boolean(city?.trim()) &&
    Number.isInteger(year) &&
    year >= 2020 &&
    year <= 2030;

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchYearSummary() {
      setError(null);
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          city: city.trim(),
          year: String(year),
        });
        const response = await fetch(`/api/weather/year?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch year summary: ${response.statusText}`
          );
        }
        const json = await response.json();
        if (cancelled) return;
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        if (cancelled) return;
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setData([]);
        console.error("Weather year summary fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchYearSummary();
    return () => {
      cancelled = true;
    };
  }, [city, year, enabled]);

  return { data, isLoading, error };
}
