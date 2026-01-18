import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { FilterPanel } from './components/FilterPanel'
import { FlightCard } from './components/FlightCard'
import { PriceTrendChart } from './components/PriceTrendChart'
import { SearchForm } from './components/SearchForm'
import { useFlightSearch } from './hooks/useFlightSearch'
import type { FilterState, PricePoint, SearchParams } from './types'

const defaultSearch: SearchParams = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  passengerCounts: { adults: 1, children: 0, infants: 0 },
  cabin: 'economy',
  tripType: 'roundtrip',
}

const initialFilters: FilterState = {
  priceRange: [150, 1200],
  stops: new Set(),
  airlines: new Set(),
  excludeAirlines: false,
  sortBy: 'none',
}

function App() {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearch)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [page, setPage] = useState(1)
  const pageSize = 6

  const { data: flights = [], isFetching } = useFlightSearch(searchParams)

  const priceBounds = useMemo<[number, number]>(() => {
    if (!flights.length) return [150, 1200]
    const prices = flights.map((flight) => flight.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [flights])

  const [priceMin, priceMax] = priceBounds

  const effectivePriceRange = useMemo<[number, number]>(() => {
    const [min, max] = filters.priceRange
    return [Math.max(min, priceMin), Math.min(max, priceMax)]
  }, [filters.priceRange, priceMin, priceMax])

  const updateFilters = (next: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters(next)
    setPage(1)
  }

  const availableAirlines = useMemo(() => Array.from(new Set(flights.map((flight) => flight.airline))), [flights])

  const filteredFlights = useMemo(() => {
    const [minPrice, maxPrice] = effectivePriceRange
    const hasStopFilter = filters.stops.size > 0
    const hasAirlineFilter = filters.airlines.size > 0

    const filtered = [...flights]
      .filter((flight) => flight.price >= minPrice && flight.price <= maxPrice)
      .filter((flight) => (!hasStopFilter ? true : filters.stops.has(Math.min(flight.stops, 2))))
      .filter((flight) => {
        if (!hasAirlineFilter) return true
        return filters.excludeAirlines ? !filters.airlines.has(flight.airline) : filters.airlines.has(flight.airline)
      })

    if (filters.sortBy === 'none') return filtered

    return filtered.sort((a, b) => {
      if (filters.sortBy === 'price') return a.price - b.price
      if (filters.sortBy === 'duration') return a.durationMinutes - b.durationMinutes
      return a.departureDate.localeCompare(b.departureDate)
    })
  }, [flights, filters, effectivePriceRange])

  const totalPages = Math.max(1, Math.ceil(filteredFlights.length / pageSize))
  const paginatedFlights = filteredFlights.slice((page - 1) * pageSize, page * pageSize)

  const pricePoints: PricePoint[] = useMemo(() => {
    if (!filteredFlights.length) return []
    const groups = filteredFlights.reduce<Record<string, number[]>>((acc, flight) => {
      const key = flight.departureDate
      acc[key] = acc[key] ? [...acc[key], flight.price] : [flight.price]
      return acc
    }, {})

    return Object.entries(groups)
      .map(([isoDate, prices]) => ({
        isoDate,
        date: format(new Date(isoDate), 'MMM d'),
        averagePrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
        lowestPrice: Math.min(...prices),
      }))
      .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime())
      .map(({ date, averagePrice, lowestPrice }) => ({ date, averagePrice, lowestPrice }))
  }, [filteredFlights])

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({
      ...initialFilters,
      priceRange: priceBounds,
    })
    setPage(1)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="relative z-[20]">
      <SearchForm initialParams={searchParams} onSubmit={handleSearch} isLoading={isFetching} />
      </div>

      <section className="grid gap-5 lg:grid-cols-[320px,1fr]">
        <div className="flex flex-col gap-4 lg:sticky lg:top-4">
          <FilterPanel
            filters={filters}
            priceBounds={priceBounds}
            currentPriceRange={effectivePriceRange}
            availableAirlines={availableAirlines}
            onChange={updateFilters}
            onReset={resetFilters}
          />
          <PriceTrendChart data={pricePoints} />
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Results</p>
              <h3 className="m-0 text-xl font-semibold text-white">
                {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found
              </h3>
              <p className="m-0 text-sm text-white/70">
                Filters update both the list and the live graph. Pulls from mock data by default; wire Amadeus to go live.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
              {isFetching ? 'Refreshing…' : 'Fresh'}
            </span>
          </div>

          {filteredFlights.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-white/70">
              No flights match your filters. Loosen the sliders to explore more options.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {paginatedFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}

          {filteredFlights.length > pageSize && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="text-sm text-white/80">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
