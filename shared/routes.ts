import { z } from 'zod';
import { climateData, forecastRequestSchema, type ForecastResponse, type DataPoint } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  climate: {
    series: {
      method: 'GET' as const,
      path: '/api/series/:variable/:region' as const,
      responses: {
        200: z.array(z.object({ year: z.number(), value: z.number() })),
        404: errorSchemas.notFound,
      },
    },
    forecast: {
      method: 'POST' as const,
      path: '/api/forecast' as const,
      input: forecastRequestSchema,
      responses: {
        200: z.any() as z.ZodType<ForecastResponse>,
        400: errorSchemas.validation,
      },
    },
    metrics: {
      method: 'GET' as const,
      path: '/api/metrics' as const,
      responses: {
        200: z.object({
          rmse: z.number(),
          mae: z.number(),
          model: z.string()
        })
      }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
