# climateFusionX

**Climate change trend analysis and forecasting platform**

A modern full-stack web application for analyzing climate data and generating forecasts for temperature, CO2 levels, and sea level changes across different global regions.

## Features

- 📊 **Climate Data Visualization** - Interactive charts for temperature, CO2, and sea level trends
- 🔮 **Forecasting Engine** - Generate climate predictions based on historical data
- 🌍 **Multi-Region Support** - Analyze data for Global, India, and USA regions
- 📈 **Multiple Variables** - Track temperature, CO2 levels, and sea level rise
- ⚡ **In-Memory Storage** - Fast data access without database overhead
- 🎨 **Modern UI** - Built with React and Shadcn UI components
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** - Lightning-fast build tool
- **TanStack Query** - Server state management
- **Shadcn UI** - High-quality UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **TSX** - TypeScript execution runtime
- **In-Memory Storage** - Fast data management

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/proBala03/climateFusionX.git
   cd climateFusionX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production bundle
- `npm run start` - Start the production server
- `npm run check` - Run TypeScript type checking

## API Endpoints

### Get Climate Data Series
**GET** `/api/climate/series/:variable/:region`

Get historical climate data for a specific variable and region.

**Parameters:**
- `variable` - One of: `temperature`, `co2`, `sea_level`
- `region` - One of: `global`, `india`, `usa`

**Example:**
```bash
curl http://localhost:5000/api/climate/series/temperature/india
```

**Response:**
```json
[
  { "year": 2000, "value": 24.2 },
  { "year": 2005, "value": 24.5 },
  { "year": 2010, "value": 24.7 }
]
```

### Generate Climate Forecast
**POST** `/api/climate/forecast`

Generate climate predictions for a specific variable and region.

**Request Body:**
```json
{
  "variable": "temperature",
  "region": "global",
  "horizon": 12,
  "model": "ensemble"
}
```

**Parameters:**
- `variable` - Climate variable to forecast (required)
- `region` - Geographic region (required)
- `horizon` - Forecast horizon in years/months (required)
- `model` - Forecasting model, default: `ensemble` (optional)

**Response:**
```json
{
  "historical": [
    { "year": 2000, "value": 14.4 },
    { "year": 2025, "value": 15.1 }
  ],
  "forecast": [
    { "year": 2026, "value": 15.15, "lowerBound": 15.0, "upperBound": 15.3 },
    { "year": 2027, "value": 15.20, "lowerBound": 15.05, "upperBound": 15.35 }
  ],
  "metrics": {
    "rmse": 0.28,
    "mae": 0.15,
    "model": "ensemble"
  }
}
```

## Sample Data

The application comes with pre-loaded sample climate data including:

- **Temperature** (°C): Global, India, USA (2000-2025)
- **CO2** (ppm): Global measurements (2000-2025)
- **Sea Level** (mm): Global measurements relative to 2000 baseline (2000-2025)

## Project Structure

```
climateFusionX/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   ├── storage.ts        # In-memory storage
│   └── db.ts             # Database configuration
├── shared/                # Shared TypeScript types
│   ├── schema.ts         # Data schemas
│   └── routes.ts         # API route definitions
└── package.json
```

## Usage

1. **View Climate Trends**
   - Navigate to the Dashboard to see interactive charts of climate data
   - Select different variables and regions from the UI

2. **Generate Forecasts**
   - Use the forecast panel to predict future climate trends
   - Adjust the forecast horizon (1-36 years)
   - View historical data alongside predictions

3. **Compare Regions**
   - Switch between Global, India, and USA to compare regional trends
   - Analyze regional differences in climate change

## Development

### Building
```bash
npm run build
```

This creates optimized production bundles in the `dist/` directory.

### Type Checking
```bash
npm run check
```

### Adding New Features
1. Define new schemas in [shared/schema.ts](shared/schema.ts)
2. Add API routes in [server/routes.ts](server/routes.ts)
3. Create React components in [client/src/components/](client/src/components/)
4. Update the data storage in [server/storage.ts](server/storage.ts)

## Environment Variables

The application works without external configuration. Optional variables:

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for any bugs or feature requests.

## License

MIT License - See LICENSE file for details

## Contact & Support

For questions or support, please open an issue on the GitHub repository.

---

**Note:** This application uses in-memory storage, so all data will be reset when the server restarts. For production use with persistent data, consider integrating a database like PostgreSQL.
