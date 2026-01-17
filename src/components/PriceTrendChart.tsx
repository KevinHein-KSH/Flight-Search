import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { PricePoint } from '../types'

interface PriceTrendChartProps {
  data: PricePoint[]
}

export function PriceTrendChart({ data }: PriceTrendChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Price graph</p>
          </div>
          <span className="text-sm text-white/70">0 days</span>
        </div>
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-white/70">
          No data yet—run a search or loosen filters to populate the graph.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur min-h-[320px]">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Price graph</p>
        </div>
        <span className="text-sm text-white/70">{data.length} days</span>
      </div>
      <div className="min-h-[260px]" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6dd5ed" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2193b0" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip<number, string> content={(props) => <CustomTooltip {...props} />} />
            <Area
              type="monotone"
              dataKey="averagePrice"
              stroke="#1a9cef"
              strokeWidth={3}
              fill="url(#priceGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as PricePoint
  return (
    <div className="chart-tooltip">
      <p className="m-0 text-xs uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="m-0 text-sm text-white">${point.averagePrice.toFixed(0)} avg</p>
      <p className="m-0 text-xs text-white/70">Low ${point.lowestPrice.toFixed(0)}</p>
    </div>
  )
}
