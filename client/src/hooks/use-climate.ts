import { useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { ForecastRequest, ForecastResponse } from "@shared/schema";

export function useForecast() {
  return useMutation({
    mutationFn: async (data: ForecastRequest): Promise<ForecastResponse> => {
      // Input validation using Zod schema from shared routes/schema
      const validated = api.climate.forecast.input.parse(data);
      
      const res = await fetch(api.climate.forecast.path, {
        method: api.climate.forecast.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to generate forecast");
      }

      // Parse the response using the defined schema
      // Since it's z.any() as z.ZodType<ForecastResponse> in the manifest, we can cast it after parsing
      const json = await res.json();
      return json as ForecastResponse;
    },
  });
}
