# SmartWaste — ML-Based Predictive Waste Collection & Smart Bin Monitoring System

A professional, modern, responsive web dashboard built as a **B.Tech final-year project** frontend prototype. It visualizes smart-bin monitoring, ML fill-level predictions, dynamic route optimization, vehicle tracking, alerts, and analytics for a municipal waste collection command center.

> **All data shown is illustrative demo data.** No real IoT devices, ML models, vehicle GPS trackers, or Google OR-Tools route optimization are connected in this prototype. Every screen clearly labels its data as demo. A dedicated API layer is included so a real backend can be connected later without touching the UI.

## Location context

All demo coordinates are realistic points around **Visakhapatnam, Andhra Pradesh, India**.

## Tech stack

- **React** (with Vite)
- **JavaScript** (pages/components) + TypeScript entry (`App.tsx`)
- **Tailwind CSS** for styling
- **Recharts** for graphs
- **Lucide React** for icons
- **React Leaflet** + **OpenStreetMap** for interactive maps
- **Axios** for future backend integration (stubbed today)

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Type-check:

```bash
npm run typecheck
```

## Project structure

```
src/
├── components/          Reusable UI building blocks
│   ├── Sidebar.jsx         Navigation (9 sections)
│   ├── Topbar.jsx          Title, search, notifications, profile
│   ├── KPICard.jsx         Metric cards
│   ├── Card.jsx            Generic container card
│   ├── Badges.jsx          Fill / priority / status badges + fill bar
│   ├── ChartTooltip.jsx    Shared Recharts tooltip
│   ├── DemoBanner.jsx      "Demo data" notice banner
│   ├── MapView.jsx         React Leaflet map (bins + trucks + routes)
│   └── BinDetailModal.jsx  Bin detail (history, readings, predictions, collections)
├── pages/               One file per dashboard section
│   ├── Overview.jsx
│   ├── BinMonitoring.jsx
│   ├── LiveMap.jsx
│   ├── Predictions.jsx
│   ├── RouteOptimization.jsx
│   ├── VehicleTracking.jsx
│   ├── Alerts.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── data/                Demo dataset (clearly separated from UI)
│   ├── constants.js        Thresholds, colors, enums, city config
│   ├── bins.js             30 demo bins + fill/collection history generators
│   ├── vehicles.js         5 demo collection vehicles
│   ├── analytics.js        KPIs, weekly/daily trends, alerts, area data
│   └── routes.js           Demo route simulation (nearest-neighbor)
├── services/
│   └── api.js             API integration layer (axios). Stubs return demo data;
│                          flip USE_DEMO to false and point VITE_API_BASE_URL
│                          at the real backend to go live.
├── App.tsx               Shell: sidebar + topbar + page routing + modal
├── main.tsx              React entry
└── index.css             Tailwind + base styles + Leaflet tweaks
```

## Dashboard sections

1. **Overview** — KPI cards (total/full/medium/normal bins, active vehicles, bins requiring collection), weekly accumulation graph, actual vs predicted fill chart, bin status doughnut, recent collection activity, critical alerts, top bins requiring collection.
2. **Smart Bin Monitoring** — sortable/filterable/searchable table with color-coded fill bars (green < 50%, orange 50–79%, red ≥ 80%). Click a row for a detailed bin view (24h fill history, current & predicted readings, collection history).
3. **Live Map** — interactive OpenStreetMap with color-coded bin markers, truck markers, priority filters, and popups with bin details. Clearly labelled demo data.
4. **ML Predictions** — current fill, predicted fill after 2/4/6 hours, actual vs predicted graph, bins likely to overflow, priority distribution, and model performance (MAE, RMSE, R²) clearly labelled as illustrative.
5. **Dynamic Route Optimization** — select a vehicle, select bins requiring collection, generate a demo optimized route (nearest-neighbor simulation). Shows route sequence, total distance, travel time, and stops on the map. **Intended backend: Google OR-Tools VRP solver** (not yet connected).
6. **Vehicle Tracking** — vehicle cards with driver, status, route, completed/remaining stops, fuel, load, and simulated GPS markers on the map.
7. **Alerts and Notifications** — overflow risk, high fill, sensor offline, weak signal, low battery, collection overdue/pending/completed. Filterable by severity, type, and read state.
8. **Analytics and Reports** — daily/weekly trends, area-wise generation, route distances, collection efficiency, fuel estimates, collection history, date filters, and downloadable CSV reports.
9. **Settings** — admin profile, fill thresholds, refresh interval, notification preferences, and integration status for the planned data-flow architecture.

## Data flow architecture (planned)

```
Ultrasonic Sensor → ESP32 → LoRa Communication → Gateway → Backend → Database
→ ML Prediction → Collection Priority → Route Optimization → Dashboard
```

The frontend is designed to eventually receive:
- Real-time IoT readings from the backend
- Historical bin readings from the database
- Fill-level predictions from the ML API
- Optimized routes from the OR-Tools API

## Connecting a real backend

All data access goes through `src/services/api.js`. Today every method returns demo data because `USE_DEMO = true`. To connect the real backend:

1. Set `VITE_API_BASE_URL` in your environment (e.g. `https://your-backend.example.com/api`).
2. Set `USE_DEMO = false` in `src/services/api.js`.
3. Implement the endpoints referenced in `api.js` (`/bins`, `/bins/:id/history`, `/predictions`, `/vehicles`, `/alerts`, `/routes/optimize`, etc.).

No UI changes are required — the pages already consume the `apiService` methods.

## Disclaimer

This is an academic prototype. The ML metrics, predictions, GPS locations, and route optimizations are simulated for demonstration and are **not** from real systems. Each affected screen displays a "demo data" notice.
