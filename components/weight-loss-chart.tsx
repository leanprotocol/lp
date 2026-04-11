"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceDot,
} from "recharts"

const data = [
  { label: "Day 1",   lean: 0,   diet: 0    },
  { label: "Month 1", lean: -4,  diet: -1.5 },
  { label: "Month 2", lean: -9,  diet: -2.5 },
  { label: "Month 3", lean: -14, diet: -3.5 },
  { label: "Month 4", lean: -18, diet: -4.5 },
  { label: "Month 5", lean: -20, diet: -5.5 },
  { label: "Month 6", lean: -22, diet: -6   },
]

// Lean Protocol rendered first (big teal area, fills from 0 down to lean line).
// Diet & Exercise rendered on top (smaller pink area, fills from 0 down to diet line).
// Overlap zone (0 → diet line) shows pink; exposed lean zone (diet → lean line) shows teal.
// Together this creates the "gap" look from the reference image.

const LEAN_COLOR = "#2D5A56"
const DIET_COLOR = "#E8847A"

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark text-white rounded-xl px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="font-semibold">{label}</p>
      {[...payload].reverse().map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

export function WeightLossChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-10">

        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            Clinical outcomes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-dark leading-snug">
            Your weight over 6 months
          </h2>
          <p className="text-sm text-muted-foreground mt-2 italic">
            Flagship protocol with Ozempic / Mounjaro / Semaglutide-based products
          </p>
        </div>

        {/* Chart */}
        <div ref={ref} className="mt-8 h-72 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <defs>
                {/* Lean: transparent at 0% baseline, opaque at the lean line (bottom of its fill) */}
                <linearGradient id="leanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={LEAN_COLOR} stopOpacity={0.0}  />
                  <stop offset="100%" stopColor={LEAN_COLOR} stopOpacity={0.65} />
                </linearGradient>
                {/* Diet: same — transparent at 0%, opaque toward diet line */}
                <linearGradient id="dietGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={DIET_COLOR} stopOpacity={0.0}  />
                  <stop offset="28%"  stopColor={DIET_COLOR} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={DIET_COLOR} stopOpacity={0.55} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                domain={[-25, 2]}
                ticks={[0, -5, -10, -15, -20, -25]}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* 1. Lean Protocol — behind, big teal region */}
              <Area
                type="monotone"
                dataKey="lean"
                name="Lean Protocol"
                stroke={LEAN_COLOR}
                strokeWidth={2.5}
                fill="url(#leanGrad)"
                dot={false}
                isAnimationActive={inView}
                animationDuration={1600}
                animationEasing="ease-out"
              />

              {/* 2. Diet & Exercise — in front, smaller pink region covers top of lean */}
              <Area
                type="monotone"
                dataKey="diet"
                name="Diet & Exercise"
                stroke={DIET_COLOR}
                strokeWidth={2.5}
                fill="url(#dietGrad)"
                dot={false}
                isAnimationActive={inView}
                animationDuration={1200}
                animationEasing="ease-out"
              />

              {/* End-point dots */}
              <ReferenceDot x="Month 6" y={-22} r={5} fill={LEAN_COLOR} stroke="white" strokeWidth={2} />
              <ReferenceDot x="Month 6" y={-6}  r={5} fill={DIET_COLOR} stroke="white" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 bg-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: "#A8BEB7" }} />
            −22% with Lean Protocol
          </div>
          <div
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border"
            style={{ borderColor: DIET_COLOR + "60", color: DIET_COLOR }}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DIET_COLOR }} />
            −6% Diet &amp; Exercise alone
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground/50 text-center mt-4 leading-relaxed max-w-2xl mx-auto">
          Results based on clinical trial data. Individual results may vary. Medication is prescribed at a doctor&apos;s discretion.
        </p>

      </div>
    </section>
  )
}
