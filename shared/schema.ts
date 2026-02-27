import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const climateData = pgTable("climate_data", {
  id: serial("id").primaryKey(),
  variable: text("variable").notNull(), // 'temperature', 'co2', 'sea_level'
  region: text("region").notNull(), // 'global', 'india', 'usa'
  year: integer("year").notNull(),
  value: real("value").notNull(),
});

// Zod schemas
export const insertClimateDataSchema = createInsertSchema(climateData).omit({ id: true });
export type ClimateData = typeof climateData.$inferSelect;
export type InsertClimateData = z.infer<typeof insertClimateDataSchema>;

// Request/Response types
export const forecastRequestSchema = z.object({
  variable: z.string(),
  region: z.string().optional(),
  horizon: z.number(), // e.g., 12, 24, 36 (treated as years/months)
  model: z.string().optional().default('ensemble'),
});

export type ForecastRequest = z.infer<typeof forecastRequestSchema>;

export interface DataPoint {
  year: number;
  value: number;
}

export interface ForecastPoint {
  year: number;
  value: number;
  lowerBound: number;
  upperBound: number;
}

export interface ForecastResponse {
  historical: DataPoint[];
  forecast: ForecastPoint[];
  metrics: {
    rmse: number;
    mae: number;
    model: string;
  };
}
