# ClimateFusionX

A Climate Change Trend Analysis & Forecasting Web App with a dark futuristic UI featuring neon blue + purple gradients and glassmorphism design.

## Features

- **Landing Page**: Hero section with "ClimateFusionX" branding and "Launch Dashboard" CTA
- **Dashboard**: Interactive climate data visualization with:
  - Climate variable selection (Temperature, CO2, Sea Level)
  - Region selection (Global, India, USA)
  - Forecast horizon control (12, 24, 36 months)
  - Historical data charts with forecast overlays (dashed lines)
  - Confidence interval visualization (shaded areas)
  - Performance metrics (RMSE, MAE, Model Used)

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Recharts for data visualization
- Tailwind CSS with custom dark theme
- Framer Motion for animations
- Glassmorphism UI design

### Backend
- Express.js with TypeScript
- PostgreSQL database (Drizzle ORM)
- REST API with Zod validation
- Algorithmic forecast generation

## Database Schema

- **climate_data**: Stores historical climate observations
  - variable (temperature, co2, sea_level)
  - region (global, india, usa)
  - year
  - value

## API Endpoints

- `GET /api/series/:variable/:region` - Fetch historical data
- `POST /api/forecast` - Generate forecast with confidence intervals
- `GET /api/metrics` - Get model performance metrics

## Data

The database is seeded with realistic climate data from 1980-2023 for all variable/region combinations. The forecast algorithm simulates ensemble model predictions with:
- Trend analysis from historical data
- Seasonal variations
- Confidence intervals (95%)
- Variable-specific trend multipliers

## Design

Dark futuristic aesthetic with:
- Neon blue primary color (HSL: 190 100% 50%)
- Electric purple secondary color (HSL: 270 100% 60%)
- Glassmorphism cards with backdrop blur
- Gradient background overlays
- Text glow effects
- Custom scrollbar styling
