import { format } from 'date-fns'
import type { Flight } from '../types'
import { formatCurrency, formatDuration } from '../utils/format'

interface FlightCardProps {
  flight: Flight
}

export function FlightCard({ flight }: FlightCardProps) {
  const formattedDepart = format(new Date(flight.departureDate), 'MMM d')
  const formattedReturn = flight.returnDate ? format(new Date(flight.returnDate), 'MMM d') : null
  const stopsLabel = flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`

  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/30 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">{flight.airline}</p>
          <h4 className="my-1 text-lg font-semibold text-white">
            {flight.origin} → {flight.destination}
          </h4>
          <p className="m-0 text-sm text-white/70">
            {formattedDepart}
            {formattedReturn ? ` · Return ${formattedReturn}` : ''} · {stopsLabel} · {formatDuration(flight.durationMinutes)}
          </p>
        </div>
        <div className="text-right">
          <strong className="block text-xl text-white">{formatCurrency(flight.price, flight.currency)}</strong>
          <span className="text-sm text-white/60">{flight.fareClass}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {flight.segments.map((segment, index) => (
          <div
            key={segment.flightNumber + index}
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.18em] text-white/60">
                {segment.airline} · {segment.flightNumber}
              </p>
              <p className="m-0">
                {segment.origin} → {segment.destination}
              </p>
            </div>
            <div className="text-sm text-white/70">{formatDuration(segment.durationMinutes)}</div>
          </div>
        ))}
      </div>
    </article>
  )
}
