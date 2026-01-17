# Flight Search Engine (React + Vite)

A responsive flight search experience inspired by Google Flights but with a modern, opinionated UI. It includes a live price graph, instant filtering, and is wired for both mock data and the Amadeus Self-Service API (test env).

## Quick start

```bash
npm install
npm run dev
```

Then open the printed URL. The app boots with mock data so everything works without credentials.

## Environment variables

Copy `.env.example` to `.env` to configure live data:

```
VITE_ENABLE_LIVE_API=false
VITE_AMADEUS_API_KEY=your_key
VITE_AMADEUS_API_SECRET=your_secret
VITE_AMADEUS_API_BASE=https://test.api.amadeus.com
```

Set `VITE_ENABLE_LIVE_API=true` to query Amadeus; otherwise the UI stays on the bundled mock dataset.

## What’s included

- Search form with origin, destination, departure/return dates, passengers, and cabin selection.
- Complex filtering: price slider, stops, airline selection, plus sorting by price/duration/departure.
- Live price graph (Recharts) that updates instantly when filters change.
- Responsive layout (desktop grid with sticky filters + mobile single column).
- Data layer via React Query with mock data fallback and optional Amadeus integration (see `src/api/flights.ts`).

### Amadeus notes
- Uses the test environment (`https://test.api.amadeus.com`) with client credentials.
- Supports adults/children/infants counts and travel class; one-way searches omit `returnDate`.
- If the live API fails or creds are missing, the app automatically falls back to mock data so the UX remains functional.

## Project structure

- `src/App.tsx` — page composition and state wiring.
- `src/components/` — Search form, filter panel, price chart, and flight cards.
- `src/api/flights.ts` — live/mock flight search implementation and Amadeus mapping.
- `src/data/mockFlights.ts` — seeded sample data for offline work.
- `src/types.ts` — shared types.

## Scripts

- `npm run dev` — start Vite dev server.
- `npm run build` — production build.
- `npm run preview` — preview the production build locally.

## Notes

- The Amadeus search call uses the test environment and requests up to 20 flight offers. A small token cache avoids redundant auth calls.
- When live API calls fail or credentials are absent, the UI automatically falls back to mock data to keep the experience smooth.
