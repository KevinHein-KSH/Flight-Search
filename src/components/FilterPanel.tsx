import { useMemo } from 'react'
import clsx from 'clsx'
import type { FilterState } from '../types'

interface FilterPanelProps {
  filters: FilterState
  priceBounds: [number, number]
  currentPriceRange: [number, number]
  availableAirlines: string[]
  onChange: (next: FilterState) => void
  onReset: () => void
}

const stopOptions = [
  { label: 'Nonstop', value: 0 },
  { label: '1 Stop', value: 1 },
  { label: '2+ Stops', value: 2 },
]

export function FilterPanel({ filters, priceBounds, currentPriceRange, availableAirlines, onChange, onReset }: FilterPanelProps) {
  const [minPrice, maxPrice] = currentPriceRange
  const [floor, ceiling] = priceBounds

  const priceProgress = useMemo(() => {
    if (ceiling === floor) return 100
    return Math.round(((maxPrice - minPrice) / (ceiling - floor)) * 100)
  }, [minPrice, maxPrice, floor, ceiling])

  const toggleStop = (value: number) => {
    const next = new Set(filters.stops)
    next.has(value) ? next.delete(value) : next.add(value)
    onChange({ ...filters, stops: next })
  }

  const toggleAirline = (value: string) => {
    const next = new Set(filters.airlines)
    next.has(value) ? next.delete(value) : next.add(value)
    onChange({ ...filters, airlines: next })
  }

  const handlePriceChange = (index: number, value: number) => {
    const clamped = Math.min(Math.max(value, floor), ceiling)
    const next: [number, number] = [...filters.priceRange]
    next[index] = clamped
    if (next[0] > next[1]) {
      if (index === 0) next[1] = clamped
      else next[0] = clamped
    }
    onChange({ ...filters, priceRange: next })
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Filters</p>
        </div>
        <button
          className="text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white"
          onClick={onReset}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Price range</p>
          <button
            className="text-xs text-white/70 underline underline-offset-4 hover:text-white"
            type="button"
            onClick={() => onChange({ ...filters, priceRange: priceBounds })}
          >
            Clear
          </button>
        </div>
        <div className="flex gap-2">
          <input
            className="w-full accent-cyan-400"
            type="range"
            min={floor}
            max={ceiling}
            value={minPrice}
            onChange={(e) => handlePriceChange(0, Number(e.target.value))}
          />
          <input
            className="w-full accent-cyan-400"
            type="range"
            min={floor}
            max={ceiling}
            value={maxPrice}
            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span>${minPrice}</span>
          <div className="h-2 flex-1 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${priceProgress}%` }} />
          </div>
          <span>${maxPrice}</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Stops</p>
          <button
            className="text-xs text-white/70 underline underline-offset-4 hover:text-white"
            type="button"
            onClick={() => onChange({ ...filters, stops: new Set() })}
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stopOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                filters.stops.has(option.value)
                  ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100'
                  : 'border-white/15 bg-white/10 text-white',
              )}
              onClick={() => toggleStop(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-3">
            <p className="m-0 font-semibold">Airlines</p>
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={filters.excludeAirlines}
                onChange={(e) => onChange({ ...filters, excludeAirlines: e.target.checked })}
                className="accent-cyan-400"
              />
              <span>Exclude selected</span>
            </label>
          </div>
          <button
            className="text-xs text-white/70 underline underline-offset-4 hover:text-white"
            type="button"
            onClick={() => onChange({ ...filters, airlines: new Set(), excludeAirlines: false })}
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableAirlines.map((airline) => (
            <label
              key={airline}
              className={clsx(
                'cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold',
                filters.airlines.has(airline)
                  ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100'
                  : 'border-white/15 bg-white/10 text-white',
              )}
            >
              <input
                type="checkbox"
                className="mr-2 accent-cyan-400"
                checked={filters.airlines.has(airline)}
                onChange={() => toggleAirline(airline)}
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Sort</p>
          <button
            className="text-xs text-white/70 underline underline-offset-4 hover:text-white"
            type="button"
            onClick={() => onChange({ ...filters, sortBy: 'none' })}
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['price', 'duration', 'departure'] as FilterState['sortBy'][]).map((option) => (
            <button
              key={option}
              type="button"
              className={clsx(
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                filters.sortBy === option
                  ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100'
                  : 'border-white/15 bg-white/10 text-white',
              )}
              onClick={() => onChange({ ...filters, sortBy: filters.sortBy === option ? 'none' : option })}
            >
              {option === 'price' && 'Lowest price'}
              {option === 'duration' && 'Fastest'}
              {option === 'departure' && 'Early departures'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
