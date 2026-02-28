"use client";

import { useEffect, useState } from "react";

export interface DataPoint {
  year: number;
  value: number;
}

interface UseClimateSeriesResult {
  data: DataPoint[];
  isLoading: boolean;
  error: string | null;
}

export function useClimateSeries(
  variable: string,
  region: string
): UseClimateSeriesResult {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled = Boolean(variable?.trim()) && Boolean(region?.trim());

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchSeries() {
      setError(null);
      setIsLoading(true);
      try {
        const url = `/api/series/${encodeURIComponent(variable)}/${encodeURIComponent(region)}`;
        const response = await fetch(url);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch series: ${response.statusText}`
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
        console.error("Climate series fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSeries();
    return () => {
      cancelled = true;
    };
  }, [variable, region, enabled]);

  return { data, isLoading, error };
}
