import { FilterPanel } from './components/FilterPanel'
import { FlightCard, type FlightCardProps } from './components/FlightCard'
import { PriceTrendChart } from './components/PriceTrendChart'
import { SearchForm } from './components/SearchForm'
import { RadarFlightLoader } from './utils/flightRouteLoader'

const showcaseFlights: FlightCardProps['flight'][] = [
  {
    airline: 'SkyLift Airways',
    route: 'SFO → JFK',
    date: 'May 12 · Nonstop · 5h 35m',
    price: '$482',
    fareClass: 'Economy Light',
    segments: [
      { label: 'SkyLift 202', detail: 'SFO → JFK · 5h 35m' },
      { label: 'Terminal 2 · Gate C', detail: 'Boarding group 3' },
    ],
  },
  {
    airline: 'Aurora Air',
    route: 'LAX → CDG',
    date: 'Jun 2 · 1 stop · 13h 10m',
    price: '$1,120',
    fareClass: 'Premium Select',
    segments: [
      { label: 'Aurora 88', detail: 'LAX → JFK · 5h 10m' },
      { label: 'Aurora 214', detail: 'JFK → CDG · 7h 55m' },
    ],
  },
  {
    airline: 'BlueNorth',
    route: 'SEA → YYZ',
    date: 'Apr 28 · Nonstop · 4h 42m',
    price: '$368',
    fareClass: 'Flex',
    segments: [
      { label: 'BlueNorth 412', detail: 'SEA → YYZ · 4h 42m' },
      { label: 'In-seat power', detail: 'Snack service included' },
    ],
  },
  {
    airline: 'Indigo Atlantic',
    route: 'ORD → BCN',
    date: 'May 30 · 1 stop · 10h 45m',
    price: '$784',
    fareClass: 'Economy',
    segments: [
      { label: 'Indigo 60', detail: 'ORD → BOS · 2h 18m' },
      { label: 'Indigo 714', detail: 'BOS → BCN · 7h 59m' },
    ],
  },
]

function App() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="relative z-[20]">
        <SearchForm />
      </div>

      <section className="grid gap-5 lg:grid-cols-[320px,1fr]">
        <div className="flex flex-col gap-4 lg:sticky lg:top-4">
          <FilterPanel />
          <PriceTrendChart />
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Results</p>
              <h3 className="m-0 text-xl font-semibold text-white">Static UI preview</h3>
            </div>
            <span className="text-sm text-white/70">Hook up data to make this interactive.</span>
          </div>

          <div className="mt-4 flex justify-center">
            <RadarFlightLoader />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {showcaseFlights.map((flight, index) => (
              <FlightCard key={`${flight.airline}-${index}`} flight={flight} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm opacity-60"
              disabled
            >
              Prev
            </button>
            <span className="text-sm text-white/80">Page 1 of 3</span>
            <button
              type="button"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
