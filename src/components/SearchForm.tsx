import { useEffect, useState } from "react";
import { useCitySearch } from "../hooks/useCitySearch";
import type { CabinType, SearchParams } from "../types";
import clsx from "clsx";

interface SearchFormProps {
  initialParams: SearchParams;
  onSubmit: (params: SearchParams) => void;
  isLoading?: boolean;
}

const cabinOptions: { label: string; value: CabinType }[] = [
  { label: "Economy", value: "economy" },
  { label: "Premium", value: "premium" },
  { label: "Business", value: "business" },
  { label: "First", value: "first" },
];

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

export function SearchForm({
  initialParams,
  onSubmit,
  isLoading,
}: SearchFormProps) {
  const CITY_SEARCH_ENABLED = import.meta.env.VITE_ENABLE_CITY_API !== "false";
  const [form, setForm] = useState<SearchParams>(initialParams);
  const [showPassengers, setShowPassengers] = useState(false);
  const [originInput, setOriginInput] = useState(initialParams.origin);
  const [destinationInput, setDestinationInput] = useState(
    initialParams.destination,
  );
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [originQuery, setOriginQuery] = useState(initialParams.origin);
  const [destinationQuery, setDestinationQuery] = useState(
    initialParams.destination,
  );
  const { data: originCities = [] } = useCitySearch(
    originQuery,
    CITY_SEARCH_ENABLED,
  );
  const { data: destinationCities = [] } = useCitySearch(
    destinationQuery,
    CITY_SEARCH_ENABLED,
  );

  useEffect(() => {
    setForm(initialParams);
  }, [initialParams]);

  useEffect(() => {
    const t = setTimeout(() => setOriginQuery(originInput), 300);
    return () => clearTimeout(t);
  }, [originInput]);

  useEffect(() => {
    const t = setTimeout(() => setDestinationQuery(destinationInput), 300);
    return () => clearTimeout(t);
  }, [destinationInput]);

  const handleChange = (key: keyof SearchParams, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSwap = () => {
    setForm((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setOriginInput(destinationInput);
    setDestinationInput(originInput);
  };

  const handlePassengerChange = (
    key: keyof SearchParams["passengerCounts"],
    delta: number,
  ) => {
    setForm((prev) => {
      const nextCount = Math.max(0, prev.passengerCounts[key] + delta);
      const nextCounts = { ...prev.passengerCounts, [key]: nextCount };
      // enforce at least 1 adult
      if (key === "adults" && nextCount === 0 && delta < 0) {
        nextCounts.adults = 1;
      }
      const total =
        nextCounts.adults + nextCounts.children + nextCounts.infants;
      return {
        ...prev,
        passengerCounts: nextCounts,
        passengers: Math.max(1, total),
      };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const originCode = resolveCode(originInput, originCities);
    const destinationCode = resolveCode(destinationInput, destinationCities);
    const payload: SearchParams = {
      ...form,
      origin: originCode,
      destination: destinationCode,
      passengers:
        form.passengerCounts.adults +
          form.passengerCounts.children +
          form.passengerCounts.infants || form.passengers,
      returnDate: form.tripType === "oneway" ? "" : form.returnDate,
    };

    if (payload.tripType === "roundtrip" && !payload.returnDate) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      origin: originInput,
      destination: destinationInput,
    }));

    onSubmit(payload);
  };

  const passengerSummary = () => {
    const { adults, children, infants } = form.passengerCounts;
    const total = adults + children + infants;
    const parts = [
      `${adults} adult${adults !== 1 ? "s" : ""}`,
      children ? `${children} child${children > 1 ? "ren" : ""}` : null,
      infants ? `${infants} infant${infants > 1 ? "s" : ""}` : null,
    ].filter(Boolean);
    return `${total} pax · ${parts.join(", ")}`;
  };

  const openPicker = (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (input.showPicker) {
      input.showPicker();
    }
  };

  const resolveCode = (input: string, suggestions: { iataCode: string }[]) => {
    const trimmed = input.trim();
    const parenMatch = trimmed.match(/\(([A-Z]{3})\)$/i);
    if (parenMatch) return parenMatch[1].toUpperCase();
    const codeMatch = trimmed.match(/^([A-Z]{3})$/i);
    if (codeMatch) return codeMatch[1].toUpperCase();
    if (suggestions.length)
      return (
        suggestions[0].iataCode?.toUpperCase() ??
        trimmed.toUpperCase().slice(0, 3)
      );
    return trimmed.toUpperCase().slice(0, 3);
  };

  return (
    <form
      className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-black/40 backdrop-blur md:p-6 space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div className="flex flex-wrap gap-2">
          {(["oneway", "roundtrip"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                form.tripType === option
                  ? "border-cyan-300/60 bg-cyan-300/20 text-cyan-100 shadow"
                  : "border-white/15 bg-white/10 text-white",
              )}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  tripType: option,
                  returnDate: option === "oneway" ? "" : prev.returnDate,
                }))
              }
            >
              {option === "oneway" ? "One way" : "Round trip"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 md:justify-self-end">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-white shadow-sm hover:border-cyan-200/50"
            onClick={() => setShowPassengers((v) => !v)}
            aria-label="Select passengers"
          >
            <span className="flex items-center gap-2">
              <PersonIcon />
              {passengerSummary()}
            </span>
            <span className="text-sm text-white/70">▾</span>
          </button>
          {showPassengers && (
            <div className="absolute left-0 right-0 mt-2 rounded-xl border border-white/15 bg-slate-900/90 p-3 shadow-xl backdrop-blur">
              {(["adults", "children", "infants"] as const).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-1.5"
                >
                  <div>
                    <p className="m-0 text-sm font-semibold text-white">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <p className="m-0 text-xs text-white/60">
                      {key === "adults" && "18+ yrs"}
                      {key === "children" && "2-18 yrs"}
                      {key === "infants" && "Under 2"}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
                      onClick={() => handlePassengerChange(key, -1)}
                    >
                      −
                    </button>
                    <span className="text-white">
                      {form.passengerCounts[key]}
                    </span>
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
                      onClick={() => handlePassengerChange(key, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <label
          className="flex flex-col gap-1 text-sm font-medium text-white/70 md:justify-self-end"
          aria-label="Cabin"
        >
          <select
            className="w-full rounded-xl border border-white/25 bg-slate-900/70 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            value={form.cabin}
            onChange={(e) => handleChange("cabin", e.target.value as CabinType)}
          >
            {cabinOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <label
          className="relative flex flex-col gap-1 text-sm font-semibold text-white/80"
          htmlFor="origin"
        >
          <span>Origin</span>
          <input
            id="origin"
            type="text"
            placeholder="e.g. San Francisco"
            value={originInput}
            onFocus={() => setOriginOpen(true)}
            onBlur={() => setTimeout(() => setOriginOpen(false), 120)}
            onChange={(e) => {
              const value = e.target.value;
              setOriginInput(value);
              handleChange("origin", value);
            }}
            required
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm placeholder:text-white/50 focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {CITY_SEARCH_ENABLED &&
            originOpen &&
            originQuery.length >= 3 &&
            originCities.length > 0 && (
              <div className="absolute left-0 mt-16 w-full max-w-xl rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-xl">
                {originCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="flex w-full flex-col rounded-lg px-2 py-1.5 text-left text-sm text-white hover:bg-white/10"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setOriginInput(`${city.name} (${city.iataCode})`);
                      handleChange("origin", city.iataCode);
                      setOriginOpen(false);
                    }}
                  >
                    <span className="font-semibold">
                      {city.name} ({city.iataCode})
                    </span>
                    <span className="text-xs text-white/60">
                      {city.country || city.cityCode} · {city.subType}
                    </span>
                  </button>
                ))}
              </div>
            )}
        </label>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center justify-self-center rounded-full border border-white/25 bg-white/10 text-lg text-white shadow-sm hover:border-cyan-200/70"
          onClick={handleSwap}
          aria-label="Swap origin and destination"
        >
          ⇆
        </button>

        <label
          className="relative flex flex-col gap-1 text-sm font-semibold text-white/80"
          htmlFor="destination"
        >
          <span>Destination</span>
          <input
            id="destination"
            type="text"
            placeholder="e.g. New York"
            value={destinationInput}
            onFocus={() => setDestinationOpen(true)}
            onBlur={() => setTimeout(() => setDestinationOpen(false), 120)}
            onChange={(e) => {
              const value = e.target.value;
              setDestinationInput(value);
              handleChange("destination", value);
            }}
            required
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm placeholder:text-white/50 focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          {CITY_SEARCH_ENABLED &&
            destinationOpen &&
            destinationQuery.length >= 3 &&
            destinationCities.length > 0 && (
              <div className="absolute left-0 mt-16 w-full max-w-xl rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-xl">
                {destinationCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="flex w-full flex-col rounded-lg px-2 py-1.5 text-left text-sm text-white hover:bg-white/10"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setDestinationInput(`${city.name} (${city.iataCode})`);
                      handleChange("destination", city.iataCode);
                      setDestinationOpen(false);
                    }}
                  >
                    <span className="font-semibold">
                      {city.name} ({city.iataCode})
                    </span>
                    <span className="text-xs text-white/60">
                      {city.country || city.cityCode} · {city.subType}
                    </span>
                  </button>
                ))}
              </div>
            )}
        </label>

        <label
          className="flex flex-col gap-1 text-sm font-semibold text-white/80"
          htmlFor="depart"
        >
          <span>Depart</span>
          <input
            id="depart"
            type="date"
            value={form.departureDate}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            onClick={openPicker}
            required
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </label>
        <label
          className="flex flex-col gap-1 text-sm font-semibold text-white/80"
          htmlFor="return"
        >
          <span>Return</span>
          <input
            id="return"
            type="date"
            value={form.returnDate ?? ""}
            onChange={(e) => handleChange("returnDate", e.target.value)}
            onClick={openPicker}
            required={form.tripType === "roundtrip"}
            disabled={form.tripType === "oneway"}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-sm focus:border-cyan-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:border-white/15 disabled:bg-white/10 disabled:text-white/50"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex min-w-[150px] justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:shadow-xl disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Searching…" : "Search flights"}
        </button>
      </div>
    </form>
  );
}
