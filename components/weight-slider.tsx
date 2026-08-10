"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import * as C from "@/content/home-v2"

/**
 * Weight estimate with an interactive six-month projection.
 *
 * The slider sets the starting weight; the curve redraws from it. Hovering
 * or dragging across the plot reads the same easing function the line is
 * drawn from, so the marker sits exactly on the path rather than near it.
 *
 * Touch is handled alongside mouse, with touch-action:none on the plot so a
 * drag across the chart does not scroll the page underneath it.
 */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

const VB_W = 320
const VB_H = 160
const PLOT_H = 210
const PLOT_H_SM = 168
const X_L = 6
const X_R = 314
const Y_TOP = 12
const Y_BOT = 140

export function WeightSlider() {
  const [weight, setWeight] = useState(C.estimate.initial)
  const [inView, setInView] = useState(false)
  const [touched, setTouched] = useState(false)
  const [hoverT, setHoverT] = useState<number | null>(null)
  const [narrow, setNarrow] = useState(false)
  const [view, setView] = useState<"curve" | "bars">("bars")

  /* Rendered on the server before hydration, `new Date()` would give the
     server's month and then disagree with the browser. Start from null and
     fill it in on mount, so the labels always reflect the visitor's today
     and roll forward on their own each month. */
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => setToday(new Date()), [])

  /* One breakpoint read, shared by the plot height and the axis labels.
     Cheaper than measuring in two places and cannot drift out of step. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)")
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const plotH = narrow ? PLOT_H_SM : PLOT_H

  const sectionRef = useRef<HTMLElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onHover = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const el = plotRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx =
      "touches" in e && e.touches[0]
        ? e.touches[0].clientX
        : (e as React.MouseEvent).clientX
    if (cx === undefined) return
    setHoverT(Math.min(1, Math.max(0, (cx - r.left) / r.width)))
  }, [])

  const onLeave = useCallback(() => setHoverT(null), [])

  /* ---------- geometry ---------- */
  const target = Math.round(weight * (1 - C.estimate.reductionPct))
  const lost = weight - target
  const pct = Math.round((lost / weight) * 100)

  const hiV = weight + 2
  const loV = target - 4
  const yFor = (v: number) => Y_TOP + ((hiV - v) / (hiV - loV)) * (Y_BOT - Y_TOP)
  const curve = (t: number) =>
    weight - (weight - target) * (1 - Math.pow(1 - t, 1.9))

  const base = today ?? new Date(2026, 0, 1)
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1)
    return { label: MONTHS[d.getMonth()], year: d.getFullYear() }
  })

  const pts = months.map((m, i) => {
    const t = i / 6
    return {
      i,
      label: m.label,
      x: Math.round(X_L + t * (X_R - X_L)),
      y: Math.round(yFor(curve(t)) * 10) / 10,
    }
  })

  let linePath = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const cx = (a.x + b.x) / 2
    linePath += ` C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`
  }
  const areaPath = `${linePath} L ${pts[6].x} ${Y_BOT} L ${pts[0].x} ${Y_BOT} Z`

  /* Bars share the curve's endpoints, so the two views can never disagree.
     The taller bar always fills the track, keeping the pair comparable at
     any starting weight. */
  const showBars = view === "bars"
  /* Measured against the slider maximum, not against each other. The
     reduction is a fixed percentage, so a bar-to-bar ratio is identical at
     every weight and nothing appears to move when you drag. */
  const barNow = Math.max(10, Math.round((weight / C.estimate.max) * 100))
  const barNew = Math.max(8, Math.round((target / C.estimate.max) * 100))
  const gridVals = [Math.round(hiV), Math.round((hiV + loV) / 2), Math.round(loV)]

  /* Hover readout, sampled from the same curve the line is drawn from. */
  let hover = { on: false, left: 0, top: 0, tipTop: 0, kg: 0, month: "" }
  let nearIdx = -1
  if (hoverT !== null) {
    const v = curve(hoverT)
    const y = yFor(v)
    nearIdx = Math.round(hoverT * 6)
    const m = months[Math.min(6, Math.max(0, nearIdx))]
    hover = {
      on: true,
      left: Math.round(hoverT * 1000) / 10,
      top: Math.round((y / VB_H) * plotH),
      tipTop: Math.max(4, Math.round((y / VB_H) * plotH) - 58),
      kg: Math.round(v * 10) / 10,
      month: `${m.label} ${m.year}`,
    }
  }

  const showHint = inView && !touched

  return (
    <section
      ref={sectionRef}
      id={C.estimate.id}
      className="px-7 pb-[120px] pt-[60px]"
      style={{ background: "linear-gradient(180deg,#0E0E0F,#193231)" }}
    >
      <div className="mx-auto max-w-[1000px] text-center">
        <h2
          className="m-0 mb-11 font-extrabold text-lp-bg"
          style={{ fontSize: "clamp(28px,3.8vw,50px)" }}
        >
          Your weight,{" "}
          <span className="font-serif italic tracking-normal text-accent">
            6 months from now.
          </span>
        </h2>

        <div
          className="grid items-center gap-10 rounded-[34px] border border-accent/25 bg-lp-bg/5 p-[clamp(24px,3.4vw,48px)] text-left [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]"
          style={{ boxShadow: "0 34px 90px rgba(0,0,0,.4)" }}
        >
          {/* Control */}
          <div>
            <div className="text-[13.5px] font-bold tracking-[0.1em] text-accent2">
              SELECT YOUR CURRENT WEIGHT
            </div>
            <div
              className="font-extrabold leading-[1.1] text-lp-bg"
              style={{ fontSize: "clamp(52px,5.6vw,84px)" }}
            >
              {weight} <span className="text-[0.4em] text-accent2">kg</span>
            </div>

            <div className="mb-8 mt-5">
              <input
                type="range"
                min={C.estimate.min}
                max={C.estimate.max}
                value={weight}
                onChange={(e) => {
                  setWeight(Number(e.target.value))
                  if (!touched) setTouched(true)
                }}
                onPointerDown={() => setTouched(true)}
                aria-label="Your current weight in kilograms"
                className="block h-2 w-full cursor-pointer appearance-none rounded-full bg-lp-bg/20"
                style={{ accentColor: "#C8D9A7" }}
              />
              <div
                aria-hidden
                className="mt-3 flex items-center justify-center gap-2 text-sm font-extrabold text-accent transition-opacity duration-500"
                style={{ opacity: showHint ? 1 : 0 }}
              >
                <span className="gw-nudge">{"\u2190"}</span>
                Drag to set your weight
                <span className="gw-nudge-r">{"\u2192"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-[10px] text-[16px] font-extrabold text-accent">
                {"\u2193"} {lost} kg*
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-lp-gold/40 bg-lp-gold/10 px-5 py-[10px] text-[16px] font-extrabold text-lp-gold">
                {pct}% of body weight*
              </span>
            </div>

            <p className="m-0 mt-5 text-[11.5px] text-accent2/60">
              {C.estimate.note}
            </p>
          </div>

          {/* Projection */}
          <div>
            <div
              role="tablist"
              aria-label="Chart view"
              className="mb-4 inline-flex rounded-full border border-accent/25 bg-lp-bg/5 p-1"
            >
              {([
                ["bars", C.estimate.tabB],
                ["curve", C.estimate.tabA],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={view === key}
                  onClick={() => setView(key)}
                  className="rounded-full px-4 py-2 text-[13px] font-extrabold transition-colors"
                  style={{
                    background: view === key ? "#C8D9A7" : "transparent",
                    color: view === key ? "#193231" : "rgba(168,190,183,.8)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-3 flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] font-bold tracking-[0.1em] text-accent2">
                {showBars ? "TODAY VS SIX MONTHS" : "PROJECTED"}
              </span>
              <span className="text-[15px] font-extrabold text-accent">
                {target} kg by {months[6].label} {months[6].year}
              </span>
            </div>

            {showBars ? (
              /* Bars grow with a CSS keyframe rather than a transition. A
                 transition depends on the browser painting the 0% state
                 first, which is unreliable when this is the opening view.
                 A keyframe with fill-mode:both always runs. */
              <div
                key={`bars-${view}`}
                className="flex items-end justify-center gap-[clamp(28px,5vw,52px)]"
                style={{ minHeight: plotH + 28 }}
              >
                {[
                  {
                    kg: weight,
                    pct: barNow,
                    label: C.estimate.labelNow,
                    tone: "text-accent2",
                    fill: "linear-gradient(180deg,rgba(168,190,183,.5),rgba(168,190,183,.14))",
                    border: "1px solid rgba(168,190,183,.4)",
                    glow: "none",
                    delay: "0ms",
                  },
                  {
                    kg: target,
                    pct: barNew,
                    label: C.estimate.labelNew,
                    tone: "text-accent",
                    fill: "linear-gradient(180deg,#C8D9A7,rgba(200,217,167,.22))",
                    border: "none",
                    glow: "0 14px 40px rgba(200,217,167,.2)",
                    delay: "180ms",
                  },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-3">
                    <div
                      className={`text-2xl font-extrabold ${b.tone}`}
                      style={{ animation: `lpBarNum .6s ease ${b.delay} both` }}
                    >
                      {b.kg} kg
                    </div>

                    <div
                      className="flex items-end"
                      style={{ height: plotH - 34, width: "clamp(64px,7.5vw,110px)" }}
                    >
                      <div
                        className="w-full rounded-t-[18px] rounded-b-[6px]"
                        style={{
                          height: `${b.pct}%`,
                          transformOrigin: "bottom",
                          animation: `lpBarGrow .9s cubic-bezier(.2,.7,.2,1) ${b.delay} both`,
                          transition: "height .35s cubic-bezier(.2,.7,.2,1)",
                          background: b.fill,
                          border: b.border,
                          boxShadow: b.glow,
                        }}
                      />
                    </div>

                    <div className={`max-w-[128px] text-center text-[13px] font-bold ${b.tone}`}>
                      {b.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="flex w-full gap-2 sm:gap-2.5">
              <div
                className="flex flex-none flex-col justify-between pb-7 pt-1 text-right"
                style={{ height: plotH + 28 }}
              >
                {gridVals.map((v) => (
                  <span key={v} className="text-[11px] font-bold leading-none text-accent2/50">
                    {v}
                  </span>
                ))}
              </div>

              <div
                ref={plotRef}
                onMouseMove={onHover}
                onMouseLeave={onLeave}
                onTouchStart={onHover}
                onTouchMove={onHover}
                onTouchEnd={onLeave}
                className="relative w-full min-w-0 flex-1 cursor-crosshair"
                style={{ touchAction: "pan-y" }}
              >
                {hover.on && (
                  <>
                    <div
                      className="pointer-events-none absolute bottom-[30px] top-0 z-[1] w-px bg-accent/40"
                      style={{ left: `${hover.left}%` }}
                    />
                    <div
                      className="pointer-events-none absolute z-[2] h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-black bg-lp-gold"
                      style={{ left: `${hover.left}%`, top: hover.top }}
                    />
                    <div
                      className="pointer-events-none absolute z-[3] -translate-x-1/2 whitespace-nowrap rounded-xl bg-black px-3 py-2"
                      style={{
                        left: `${hover.left}%`,
                        top: hover.tipTop,
                        boxShadow: "0 12px 28px rgba(0,0,0,.6)",
                      }}
                    >
                      <div className="text-[15px] font-extrabold leading-none text-accent">
                        {hover.kg} kg
                      </div>
                      <div className="mt-1 text-[11px] font-bold tracking-[0.06em] text-accent2">
                        {hover.month}
                      </div>
                    </div>
                  </>
                )}

                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  preserveAspectRatio="none"
                  className="block w-full"
                  style={{ height: plotH }}
                  role="img"
                  aria-label={`Projected weight from ${weight} to ${target} kilograms over six months.`}
                >
                  <defs>
                    <linearGradient id="lpEstFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8D9A7" stopOpacity=".3" />
                      <stop offset="100%" stopColor="#C8D9A7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {gridVals.map((v) => (
                    <line
                      key={v}
                      x1="0"
                      y1={Math.round(yFor(v))}
                      x2={VB_W}
                      y2={Math.round(yFor(v))}
                      stroke="rgba(249,247,242,.1)"
                      strokeWidth="1"
                      strokeDasharray="3 6"
                    />
                  ))}

                  <path d={areaPath} fill="url(#lpEstFill)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#C8D9A7"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {pts.map((p) => (
                    <circle
                      key={p.i}
                      cx={p.x}
                      cy={p.y}
                      r={p.i === 6 ? 5.5 : 4}
                      fill={p.i === 6 ? "#C9A84C" : "#C8D9A7"}
                      stroke="#0E0E0F"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>

                <div className="mt-2 flex justify-between">
                  {pts.map((p) => (
                    <span
                      key={p.i}
                      className="whitespace-nowrap text-[10px] font-extrabold transition-colors sm:text-[11px]"
                      hidden={narrow && p.i % 2 === 1}
                      style={{
                        color:
                          p.i === nearIdx
                            ? "#C8D9A7"
                            : p.i === 6
                            ? "#F9F7F2"
                            : "rgba(168,190,183,.45)",
                      }}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .gw-bar {
          height: var(--bar-h);
          animation: gwBarGrow 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .gw-bar-num {
          animation: gwBarNum 0.6s ease both;
        }
        @keyframes gwBarGrow {
          from {
            height: 0%;
          }
          to {
            height: var(--bar-h);
          }
        }
        @keyframes gwBarNum {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .gw-nudge {
          animation: gwNudge 1.1s ease-in-out infinite alternate;
        }
        .gw-nudge-r {
          animation: gwNudge 1.1s ease-in-out infinite alternate-reverse;
        }
        @keyframes gwNudge {
          from {
            transform: translateX(-4px);
          }
          to {
            transform: translateX(4px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gw-nudge,
          .gw-nudge-r,
          .gw-bar,
          .gw-bar-num {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
