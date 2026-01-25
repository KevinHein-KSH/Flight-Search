export interface FlightCardProps {
  flight: {
    airline: string
    route: string
    date: string
    price: string
    fareClass: string
    segments: { label: string; detail: string }[]
  }
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/30 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">{flight.airline}</p>
          <h4 className="my-1 text-lg font-semibold text-white">{flight.route}</h4>
          <p className="m-0 text-sm text-white/70">{flight.date}</p>
        </div>
        <div className="text-right">
          <strong className="block text-xl text-white">{flight.price}</strong>
          <span className="text-sm text-white/60">{flight.fareClass}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {flight.segments.map((segment, index) => (
          <div
            key={segment.label + index}
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white"
          >
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.18em] text-white/60">{segment.label}</p>
              <p className="m-0">{segment.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
