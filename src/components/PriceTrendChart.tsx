const sampleChart = [
  { label: 'Mon', average: '$420', lowest: '$360', barHeight: 48 },
  { label: 'Tue', average: '$380', lowest: '$340', barHeight: 44 },
  { label: 'Wed', average: '$460', lowest: '$410', barHeight: 54 },
  { label: 'Thu', average: '$520', lowest: '$470', barHeight: 62 },
  { label: 'Fri', average: '$610', lowest: '$550', barHeight: 72 },
]

export function PriceTrendChart() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur min-h-[320px]">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Price graph</p>
          <p className="m-0 text-sm text-white/70">Static illustration</p>
        </div>
        <span className="text-sm text-white/70">{sampleChart.length} days</span>
      </div>

      <div className="flex h-56 items-end gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        {sampleChart.map((point) => (
          <div key={point.label} className="relative flex-1 rounded-lg bg-white/10">
            <div
              className="absolute inset-x-1 bottom-0 rounded-lg bg-gradient-to-t from-cyan-400/80 to-blue-500/70 shadow-[0_10px_30px_-12px_rgba(56,189,248,0.6)]"
              style={{ height: `${point.barHeight}%` }}
            />
            <div className="absolute -top-10 left-1/2 w-full -translate-x-1/2 text-center text-xs text-white/80">
              <strong className="block text-sm text-white">{point.average}</strong>
              <span className="text-white/60">Low {point.lowest}</span>
            </div>
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.14em] text-white/60">
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
