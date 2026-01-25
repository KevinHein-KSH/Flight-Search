const cabinOptions = ["Economy", "Premium", "Business", "First"];

const PersonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M6 20.5c0-3.09 2.686-5.5 6-5.5s6 2.41 6 5.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export function SearchForm() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-black/40 backdrop-blur md:p-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div className="flex flex-wrap gap-2">
          {["One way", "Round trip"].map((option, index) => (
            <button
              key={option}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                index === 1
                  ? "border-cyan-300/60 bg-cyan-300/20 text-cyan-100 shadow"
                  : "border-white/15 bg-white/10 text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 md:justify-self-end">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-white shadow-sm"
            aria-label="Select passengers"
          >
            <span className="flex items-center gap-2">
              <PersonIcon />
              3 pax · 2 adults, 1 child
            </span>
            <span className="text-sm text-white/70">▾</span>
          </button>
          <div className="absolute left-0 right-0 mt-2 rounded-xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
            {["Adults", "Children", "Infants"].map((label, index) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <div>
                  <p className="m-0 text-sm font-semibold text-white">{label}</p>
                  <p className="m-0 text-xs text-white/60">
                    {index === 0 && "18+ yrs"}
                    {index === 1 && "2-18 yrs"}
                    {index === 2 && "Under 2"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-3">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
                  >
                    −
                  </button>
                  <span className="text-white">{index === 0 ? 2 : 1}</span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-white/70 md:justify-self-end" aria-label="Cabin">
          <select className="w-full rounded-xl border border-white/25 bg-slate-900/70 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300" defaultValue="Business">
            {cabinOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <label className="relative flex flex-col gap-1 text-sm font-semibold text-white/80" htmlFor="origin">
          <span>Origin</span>
          <input
            id="origin"
            type="text"
            placeholder="e.g. San Francisco"
            defaultValue="San Francisco (SFO)"
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm placeholder:text-white/50 focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <div className="absolute left-0 mt-16 w-full max-w-xl rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-xl">
            {["San Jose (SJC)", "San Francisco (SFO)", "Oakland (OAK)"].map((city) => (
              <button
                key={city}
                type="button"
                className="flex w-full flex-col rounded-lg px-2 py-1.5 text-left text-sm text-white hover:bg-white/10"
              >
                <span className="font-semibold">{city}</span>
                <span className="text-xs text-white/60">United States · AIRPORT</span>
              </button>
            ))}
          </div>
        </label>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center justify-self-center rounded-full border border-white/25 bg-white/10 text-lg text-white shadow-sm"
          aria-label="Swap origin and destination"
        >
          ⇆
        </button>

        <label className="relative flex flex-col gap-1 text-sm font-semibold text-white/80" htmlFor="destination">
          <span>Destination</span>
          <input
            id="destination"
            type="text"
            placeholder="e.g. New York"
            defaultValue="New York (JFK)"
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm placeholder:text-white/50 focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <div className="absolute left-0 mt-16 w-full max-w-xl rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-xl">
            {["Newark (EWR)", "New York (JFK)", "LaGuardia (LGA)"].map((city) => (
              <button
                key={city}
                type="button"
                className="flex w-full flex-col rounded-lg px-2 py-1.5 text-left text-sm text-white hover:bg-white/10"
              >
                <span className="font-semibold">{city}</span>
                <span className="text-xs text-white/60">United States · AIRPORT</span>
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold text-white/80" htmlFor="depart">
          <span>Depart</span>
          <input
            id="depart"
            type="date"
            defaultValue="2024-05-12"
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-white/80" htmlFor="return">
          <span>Return</span>
          <input
            id="return"
            type="date"
            defaultValue="2024-05-19"
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex min-w-[150px] justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-xl"
        >
          Search flights
        </button>
      </div>
    </div>
  );
}
