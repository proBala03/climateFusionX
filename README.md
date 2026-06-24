# ClimateFusionX

ClimateFusionX is a full-stack climate and Indian weather analytics platform. It combines climate trend forecasting with city-level weather exploration for temperature, rainfall, AQI, humidity, wind, cloud cover, and seasonal comparisons.

## Current Improvements

- Expanded dashboard with climate forecasts and Indian city weather analytics in one workflow.
- Added city-level weather data from `attached_assets/Indian_Climate_Dataset_2024_2025.csv`.
- Added month/year weather summaries, date-range season presets, yearly summaries, and city comparisons.
- Added forecast views for future months and yearly weather projections.
- Added weather insight charts for AQI, temperature bands, humidity/rainfall, rainfall histogram, wind/cloud, monthly summaries, city comparison, climate variable comparison, and season comparison.
- Added CSV export for climate forecasts and daily weather chart data.
- Added animated weather/climate backgrounds and improved loading/error states.
- Added persisted dashboard controls through `localStorage`.

## Features

### Climate Forecasting

- Forecast temperature, CO2, and sea level trends.
- Compare global, India, and USA climate series.
- Generate 1-year, 2-year, and 3-year forecast horizons.
- Display confidence bounds and model metrics such as RMSE and MAE.
- Export historical and forecast data to CSV.

### Indian Weather Analytics

- Explore weather for Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Ahmedabad, Jaipur, Lucknow, and Bhopal.
- View current/latest weather or select a month and year.
- Compare one city against another for the selected month.
- Use monsoon and winter season presets for seasonal summaries.
- View 7-day synthetic outlooks based on recent city data.
- Forecast future monthly and yearly weather from historical seasonal averages.
- Export daily weather data to CSV.

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite
- Wouter routing
- TanStack Query
- Tailwind CSS
- Radix UI and Shadcn-style components
- Recharts
- Framer Motion
- Lucide React icons

### Backend

- Express 5
- TypeScript
- TSX development runtime
- In-memory storage
- Drizzle schema definitions
- Zod validation

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
git clone https://github.com/proBala03/climateFusionX.git
cd climateFusionX
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app runs at:

```text
http://localhost:5000
```

## Available Scripts

- `npm run dev` - Start the Express and Vite development server.
- `npm run build` - Build the production client and server bundles into `dist/`.
- `npm run start` - Start the production server from `dist/index.cjs`.
- `npm run check` - Run TypeScript type checking.
- `npm run db:push` - Push the Drizzle schema when using a configured database.

## API Endpoints

### Climate

#### Get Climate Series

```http
GET /api/series/:variable/:region
```

Parameters:

- `variable`: `temperature`, `co2`, or `sea_level`
- `region`: `global`, `india`, or `usa`

Example:

```bash
curl http://localhost:5000/api/series/temperature/india
```

#### Generate Climate Forecast

```http
POST /api/forecast
```

Request body:

```json
{
  "variable": "temperature",
  "region": "global",
  "horizon": 365,
  "model": "ensemble"
}
```

Notes:

- `horizon` is treated as days by the current forecast logic.
- Supported dashboard values are `365`, `730`, and `1095`.

#### Get Climate Metrics

```http
GET /api/metrics
```

### Weather

#### Latest Weather

```http
GET /api/weather/latest
GET /api/weather/latest?city=Mumbai
GET /api/weather/latest/:city
```

#### Weather by Month

```http
GET /api/weather/by-month?city=Mumbai&year=2025&month=6
```

Returns a monthly summary plus daily records.

#### Weather by Date Range

```http
GET /api/weather/range?city=Mumbai&from=2025-06-01&to=2025-09-30
```

Used by seasonal presets such as monsoon and winter.

#### Short-Term Forecast

```http
GET /api/weather/forecast?city=Mumbai&days=7
```

Returns a synthetic daily outlook based on recent city weather.

#### Monthly Forecast

```http
GET /api/weather/forecast/month?city=Mumbai&year=2026&month=7
```

Returns predicted rainfall, average temperature, rain days, and rainfall bounds.

#### Yearly Monthly Forecast

```http
GET /api/weather/forecast/monthly?city=Mumbai&year=2026
```

Returns 12 monthly forecast points.

#### Forecast Month Daily Series

```http
GET /api/weather/forecast/month/daily?city=Mumbai&year=2026&month=7
```

Returns historical daily data when available, otherwise generated daily forecast data.

#### Year Summary

```http
GET /api/weather/year?city=Mumbai&year=2025
```

Returns monthly average temperature, rainfall, and AQI summaries.

#### Weather Insight Forecasts

```http
GET /api/weather/forecast/wind-cloud?city=Mumbai&days=7
GET /api/weather/forecast/humidity-rainfall?city=Mumbai&days=7
GET /api/weather/forecast/rainfall-histogram?city=Mumbai&days=7
GET /api/weather/forecast/aqi?city=Mumbai&days=7
```

These endpoints return historical data plus forecast points for the dashboard insight charts.

## Data

The app uses in-memory storage and loads data at startup.

- Climate sample data is initialized in `server/storage.ts`.
- Additional seeded climate data is generated in `server/routes.ts`.
- Indian weather data is loaded from `attached_assets/Indian_Climate_Dataset_2024_2025.csv`.
- The weather CSV contains 7,890 daily records across the supported Indian cities for 2024 and 2025.

Because storage is in memory, runtime data resets whenever the server restarts.

## Project Structure

```text
climateFusionX/
|-- attached_assets/          # Indian weather CSV and supporting assets
|-- client/                   # React frontend
|   |-- src/
|   |   |-- components/       # Charts, UI, backgrounds, and shared components
|   |   |-- hooks/            # TanStack Query hooks
|   |   |-- lib/              # Utilities and CSV export helpers
|   |   `-- pages/            # Home, Dashboard, About, Not Found
|   `-- index.html
|-- script/                   # Build script
|-- server/                   # Express backend, routes, storage, static serving
|-- shared/                   # Shared schemas and API route definitions
|-- package.json
`-- README.md
```

## Environment Variables

- `PORT` - Server port. Defaults to `5000`.
- `NODE_ENV` - Runtime mode, usually `development` or `production`.

## Production Build

```bash
npm run build
npm run start
```

## Notes

- Forecasting is currently implemented with lightweight synthetic and ensemble-style calculations for local demos.
- The app does not require an external database for normal local usage.
- Drizzle and PostgreSQL-related packages are present for future persistence work, but the active runtime storage is in memory.
