const stopOptions = ['Nonstop', '1 Stop', '2+ Stops']
const airlineOptions = ['SkyLift', 'Aurora Air', 'BlueNorth', 'Indigo']
const sortOptions = ['Lowest price', 'Fastest', 'Early departures']

export function FilterPanel() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Filters</p>
        </div>
        <span className="text-sm font-semibold text-white/60">Static</span>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Price range</p>
          <span className="text-xs text-white/60">Preview only</span>
        </div>
        <div className="flex gap-2">
          <input className="w-full accent-cyan-400" type="range" min={150} max={1200} defaultValue={260} />
          <input className="w-full accent-cyan-400" type="range" min={150} max={1200} defaultValue={680} />
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span>$260</span>
          <div className="h-2 flex-1 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '62%' }} />
          </div>
          <span>$680</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Stops</p>
          <span className="text-xs text-white/60">Pick a vibe</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {stopOptions.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                index === 0 ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100' : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-3">
            <p className="m-0 font-semibold">Airlines</p>
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input type="checkbox" className="accent-cyan-400" defaultChecked />
              <span>Exclude selected</span>
            </label>
          </div>
          <span className="text-xs text-white/60">Curated</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {airlineOptions.map((airline, index) => (
            <label
              key={airline}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold ${
                index % 2 === 0 ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100' : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              <input type="checkbox" className="mr-2 accent-cyan-400" defaultChecked={index % 2 === 0} />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-sm text-white/70">
          <p className="m-0 font-semibold">Sort</p>
          <span className="text-xs text-white/60">Demo state</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option, index) => (
            <button
              key={option}
              type="button"
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                index === 0 ? 'border-cyan-300/60 bg-cyan-300/20 text-cyan-100' : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
