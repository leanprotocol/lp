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
import * as C from "@/content/home-v2"

/**
 * Clinical outcomes.
 *
 * Same structure as the original: two overlapping Recharts areas plotting
 * percentage change from zero, so no starting weight is implied.
 *
 * Lean Protocol is drawn first as the larger area; diet and exercise sits on
 * top as the smaller one. The exposed band between the two lines is the whole
 * point of the chart - it is the difference the protocol makes.
 *
 * Retinted for the dark page: sage replaces the teal, gold replaces the pink.
 */
const LEAN_COLOR = "#C8D9A7"
const DIET_COLOR = "#C9A84C"

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="space-y-1 rounded-xl border border-accent/25 bg-black px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-lp-bg">{label}</p>
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

  const data = C.chart.data
  const endpoint = data[data.length - 1]

  return (
    /* The weight estimate above ends on #193231, so this starts there and
       fades to black. Without it the two sections meet on a hard edge. */
    <section
      className="px-7 py-12 md:py-20"
      style={{ background: "linear-gradient(180deg,#193231,#0E0E0F 46%)" }}
    >
      <div ref={ref} className="mx-auto max-w-4xl">
        <div className="mb-2 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            {C.chart.eyebrow}
          </p>
          <h2
            className="font-extrabold leading-snug text-lp-bg"
            style={{ fontSize: "clamp(28px,3.6vw,44px)" }}
          >
            {C.chart.heading}{" "}
            <span className="font-serif italic tracking-normal text-accent">
              {C.chart.headingAccent}
            </span>
          </h2>
        </div>

        {/* Legend */}
        <div className="mb-6 mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="flex items-center gap-2.5 text-sm font-bold text-accent">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: LEAN_COLOR }}
            />
            {C.chart.seriesA}
          </span>
          <span className="flex items-center gap-2.5 text-sm font-semibold text-lp-gold">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: DIET_COLOR }}
            />
            {C.chart.seriesB}
          </span>
        </div>

        <div
          className="rounded-[26px] border border-accent/20 p-4 md:p-6"
          style={{
            background: "linear-gradient(160deg,#141416,#0E0E0F)",
            boxShadow: "0 30px 80px rgba(0,0,0,.5)",
          }}
        >
          <div className="h-[280px] w-full md:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="lpLeanFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={LEAN_COLOR} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={LEAN_COLOR} stopOpacity={0.42} />
                  </linearGradient>
                  <linearGradient id="lpDietFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={DIET_COLOR} stopOpacity={0.05} />
                    <stop offset="100%" stopColor={DIET_COLOR} stopOpacity={0.34} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgba(168,190,183,.6)", fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(249,247,242,.12)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "rgba(168,190,183,.5)", fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[-26, 0]}
                  ticks={[0, -5, -10, -15, -20, -25]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(249,247,242,.2)" }} />

                {/* Lean first, so the diet area layers over it and the
                    exposed band between the two lines stays visible. */}
                <Area
                  type="monotone"
                  dataKey="lean"
                  name={C.chart.seriesA}
                  stroke={LEAN_COLOR}
                  strokeWidth={3}
                  fill="url(#lpLeanFill)"
                  isAnimationActive={inView}
                  animationDuration={1600}
                  animationEasing="ease-out"
                  dot={false}
                  activeDot={{ r: 5, fill: LEAN_COLOR, stroke: "#0E0E0F", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="diet"
                  name={C.chart.seriesB}
                  stroke={DIET_COLOR}
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  fill="url(#lpDietFill)"
                  isAnimationActive={inView}
                  animationDuration={1600}
                  animationBegin={200}
                  animationEasing="ease-out"
                  dot={false}
                  activeDot={{ r: 5, fill: DIET_COLOR, stroke: "#0E0E0F", strokeWidth: 2 }}
                />

                <ReferenceDot
                  x={endpoint.label}
                  y={endpoint.lean}
                  r={6}
                  fill={DIET_COLOR}
                  stroke="#0E0E0F"
                  strokeWidth={2}
                  isFront
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-[11.5px] leading-relaxed text-accent2/55">
          {C.chart.note}
        </p>
      </div>
    </section>
  )
}
