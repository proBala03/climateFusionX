import { db } from "./db";
import { climateData, type ClimateData, type InsertClimateData, type DataPoint, type ForecastPoint, type ForecastResponse } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getSeries(variable: string, region: string): Promise<DataPoint[]>;
  insertClimateData(data: InsertClimateData): Promise<ClimateData>;
  bulkInsertClimateData(data: InsertClimateData[]): Promise<void>;
  getAllData(): Promise<ClimateData[]>;
}

export class DatabaseStorage implements IStorage {
  async getSeries(variable: string, region: string): Promise<DataPoint[]> {
    const results = await db
      .select({
        year: climateData.year,
        value: climateData.value,
      })
      .from(climateData)
      .where(
        and(
          eq(climateData.variable, variable),
          eq(climateData.region, region)
        )
      )
      .orderBy(climateData.year);
    
    return results;
  }

  async insertClimateData(data: InsertClimateData): Promise<ClimateData> {
    const [result] = await db.insert(climateData).values(data).returning();
    return result;
  }

  async bulkInsertClimateData(data: InsertClimateData[]): Promise<void> {
    await db.insert(climateData).values(data);
  }

  async getAllData(): Promise<ClimateData[]> {
    return await db.select().from(climateData);
  }
}

export const storage = new DatabaseStorage();
