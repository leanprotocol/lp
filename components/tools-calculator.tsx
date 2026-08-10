"use client"

import { useState } from "react"
import * as C from "@/content/tools"

/**
 * The three health calculators, in one tabbed panel.
 *
 * Rendered by /bmi-calculator, /bmr-calculator and /waist-to-hip-calculator,
 * each passing its own defaultTab. Keeping three routes preserves the search
 * ranking each has built, while giving visitors one place to move between
 * the tools.
 *
 * Thresholds are Asian-Indian, from content/tools.ts. See the note there
 * before changing any of them.
 */
const TONE = {
  green: { bg: "rgba(200,217,167,.16)", bd: "rgba(200,217,167,.5)", fg: "#C8D9A7" },
  gold: { bg: "rgba(201,168,76,.14)", bd: "rgba(201,168,76,.45)", fg: "#E0C271" },
  red: { bg: "rgba(200,90,66,.14)", bd: "rgba(200,90,66,.45)", fg: "#E08B72" },
}

type Slider = {
  label: string
  display: string
  min: number
  max: number
  value: number
  set: (n: number) => void
}

export default function ToolsCalculator({ defaultTab = 0 }: { defaultTab?: number }) {
  const [tab, setTab] = useState(defaultTab)
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(78)
  const [age, setAge] = useState(32)
  const [sex, setSex] = useState<"male" | "female">("male")
  const [activity, setActivity] = useState(1)
  const [waist, setWaist] = useState(92)
  const [hip, setHip] = useState(100)

  const bmiVal = weight / Math.pow(height / 100, 2)
  const bmrVal =
    sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161
  const tdee = bmrVal * C.ACTIVITIES[activity][2]
  const whrVal = waist / hip

  const inr = (n: number) => Math.round(n).toLocaleString("en-IN")

  let result = ""
  let band = ""
  let bandNote = ""
  let tone = TONE.green
  let scale: Array<[string, string, string, boolean]> = []
  let sliders: Slider[] = []

  if (tab === 0) {
    result = bmiVal.toFixed(1)
    const b = bmiVal < 18.5 ? 0 : bmiVal < 23 ? 1 : bmiVal < 25 ? 2 : 3
    band = C.bmi.bands[b]
    bandNote = C.bmi.notes[b]
    tone = [TONE.gold, TONE.green, TONE.gold, TONE.red][b]
    scale = C.bmi.scale.map((r, i) => [r[0], r[1], r[2], i === b])
    sliders = [
      { label: "HEIGHT", display: `${height} cm`, min: 130, max: 210, value: height, set: setHeight },
      { label: "WEIGHT", display: `${weight} kg`, min: 35, max: 180, value: weight, set: setWeight },
    ]
  } else if (tab === 1) {
    result = inr(tdee)
    band = C.ACTIVITIES[activity][0]
    bandNote = `Your resting metabolic rate is about ${inr(bmrVal)} kcal. The figure above adds your activity level ${"\u2014"} it is roughly what you burn in a day.`
    tone = TONE.green
    scale = [
      ["Resting (BMR)", `${inr(bmrVal)} kcal`, "#A8BEB7", false],
      ["Maintenance", `${inr(tdee)} kcal`, "#C8D9A7", true],
      ["Gentle deficit", `${inr(tdee - 400)} kcal`, "#C9A84C", false],
      ["Protein target", `${Math.round(weight * 1.6)} g/day`, "#C9A84C", false],
    ]
    sliders = [
      { label: "HEIGHT", display: `${height} cm`, min: 130, max: 210, value: height, set: setHeight },
      { label: "WEIGHT", display: `${weight} kg`, min: 35, max: 180, value: weight, set: setWeight },
      { label: "AGE", display: `${age} yrs`, min: 16, max: 85, value: age, set: setAge },
    ]
  } else {
    result = whrVal.toFixed(2)
    const male = sex === "male"
    const b = male
      ? whrVal < 0.9 ? 0 : whrVal < 1 ? 1 : 2
      : whrVal < 0.8 ? 0 : whrVal < 0.85 ? 1 : 2
    band = C.whr.bands[b]
    bandNote = C.whr.notes[b]
    tone = [TONE.green, TONE.gold, TONE.red][b]
    scale = (male ? C.whr.scaleMale : C.whr.scaleFemale).map((r, i) => [r[0], r[1], r[2], i === b])
    sliders = [
      { label: "WAIST", display: `${waist} cm`, min: 55, max: 160, value: waist, set: setWaist },
      { label: "HIP", display: `${hip} cm`, min: 60, max: 170, value: hip, set: setHip },
    ]
  }

  const tool = C.tools[tab]
  const showSex = tab === 1 || tab === 2
  const showActivity = tab === 1

  return (
    <>
      {/* ---------- hero ---------- */}
      <section
        className="relative overflow-hidden px-5 pb-11 pt-[70px] sm:px-7"
        style={{ background: "linear-gradient(180deg,#0E0E0F,#193231)" }}
      >
        <div
          aria-hidden
          className="tc-glow absolute -left-[110px] -top-[170px] h-[520px] w-[520px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(200,217,167,.2),transparent 65%)" }}
        />
        <div className="relative z-[2] mx-auto max-w-[1360px]">
          <div className="text-[12.5px] font-bold tracking-[0.16em] text-accent">
            {C.hero.eyebrow}
          </div>
          <h1
            className="m-0 mt-[22px] max-w-[15ch] font-extrabold leading-[0.96] tracking-[-0.035em] text-lp-bg"
            style={{ fontSize: "clamp(36px,7vw,104px)" }}
          >
            {C.hero.headingA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-accent">
              {C.hero.headingB}
            </span>
          </h1>
          <p
            className="m-0 mt-6 max-w-[56ch] leading-[1.55] text-accent2"
            style={{ fontSize: "clamp(15.5px,1.6vw,20px)" }}
          >
            {C.hero.body}
          </p>
        </div>
      </section>

      {/* ---------- tabs ---------- */}
      <section className="bg-dark px-5 pb-0 pt-3.5 sm:px-7">
        <div
          role="tablist"
          aria-label="Calculator"
          className="mx-auto flex max-w-[1360px] flex-wrap gap-2.5"
        >
          {C.TAB_NAMES.map((n, i) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className="rounded-full border-[1.5px] px-5 py-3 text-[14.5px] font-bold transition-colors sm:px-[26px] sm:text-[15.5px]"
              style={{
                background: i === tab ? "#C8D9A7" : "transparent",
                color: i === tab ? "#193231" : "#A8BEB7",
                borderColor: i === tab ? "#C8D9A7" : "rgba(249,247,242,.16)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- calculator ---------- */}
      <section className="bg-dark px-5 pb-[90px] pt-10 sm:px-7">
        <div className="mx-auto grid max-w-[1360px] items-start gap-[clamp(24px,4vw,64px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">

          {/* inputs */}
          <div
            className="rounded-[30px] border border-accent/25 bg-lp-bg/5 p-[clamp(22px,3vw,44px)]"
            style={{ boxShadow: "0 34px 90px rgba(0,0,0,.35)" }}
          >
            <h2
              className="m-0 mb-2 font-extrabold tracking-[-0.03em] text-lp-bg"
              style={{ fontSize: "clamp(24px,3vw,40px)" }}
            >
              {tool.title}
            </h2>
            <p className="m-0 mb-7 text-[16.5px] leading-[1.55] text-accent2">
              {tool.blurb}
            </p>

            {showSex && (
              <div className="mb-7">
                <div className="mb-3 text-[12.5px] font-bold tracking-[0.12em] text-accent2">
                  SEX
                </div>
                <div className="flex gap-2.5">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      aria-pressed={sex === s}
                      className="flex-1 rounded-[14px] border-[1.5px] p-3.5 text-center text-base font-bold capitalize transition-colors"
                      style={{
                        background: sex === s ? "rgba(200,217,167,.16)" : "transparent",
                        color: sex === s ? "#C8D9A7" : "#F9F7F2",
                        borderColor: sex === s ? "rgba(200,217,167,.6)" : "rgba(249,247,242,.16)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sliders.map((s) => (
              <div key={s.label} className="mb-7">
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <span className="text-[12.5px] font-bold tracking-[0.12em] text-accent2">
                    {s.label}
                  </span>
                  <span className="text-[26px] font-extrabold tracking-[-0.02em] text-lp-bg">
                    {s.display}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={1}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  aria-label={s.label.toLowerCase()}
                  className="block h-2 w-full cursor-pointer appearance-none rounded-full bg-lp-bg/20"
                  style={{ accentColor: "#C8D9A7" }}
                />
              </div>
            ))}

            {showActivity && (
              <div>
                <div className="mb-3 text-[12.5px] font-bold tracking-[0.12em] text-accent2">
                  ACTIVITY LEVEL
                </div>
                <div className="grid gap-2.5">
                  {C.ACTIVITIES.map((a, i) => (
                    <button
                      key={a[0]}
                      type="button"
                      onClick={() => setActivity(i)}
                      aria-pressed={i === activity}
                      className="flex items-center justify-between gap-3.5 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left transition-colors sm:px-[18px]"
                      style={{
                        background: i === activity ? "rgba(200,217,167,.16)" : "rgba(249,247,242,.04)",
                        borderColor: i === activity ? "rgba(200,217,167,.55)" : "rgba(249,247,242,.1)",
                      }}
                    >
                      <span
                        className="text-[15px] font-bold sm:text-[15.5px]"
                        style={{ color: i === activity ? "#C8D9A7" : "#F9F7F2" }}
                      >
                        {a[0]}
                      </span>
                      <span
                        className="text-right text-[13px] sm:text-[13.5px]"
                        style={{ color: i === activity ? "rgba(200,217,167,.8)" : "rgba(168,190,183,.65)" }}
                      >
                        {a[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* result */}
          <div>
            <div
              className="rounded-[30px] border border-accent/25 p-[clamp(24px,3vw,44px)] text-center"
              style={{
                background: "linear-gradient(165deg,#22453c,#0E1512)",
                boxShadow: "0 34px 90px rgba(0,0,0,.45)",
              }}
            >
              <div className="text-[12.5px] font-bold tracking-[0.14em] text-accent2">
                {tool.resultLabel}
              </div>
              <div
                className="mb-1.5 mt-3.5 font-extrabold leading-none tracking-[-0.04em] text-accent"
                style={{ fontSize: "clamp(52px,9vw,120px)" }}
              >
                {result}
              </div>
              <div className="text-[17px] font-semibold text-lp-bg">{tool.resultUnit}</div>

              <div
                className="mt-[22px] inline-block rounded-full border px-6 py-[11px] text-base font-extrabold"
                style={{ background: tone.bg, borderColor: tone.bd, color: tone.fg }}
              >
                {band}
              </div>

              <p className="m-0 mt-[22px] text-[15.5px] leading-[1.55] text-accent2">
                {bandNote}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {scale.map(([name, range, dot, active]) => (
                <div
                  key={name}
                  className="flex items-center gap-3.5 rounded-2xl border px-5 py-3.5"
                  style={{
                    background: active ? "rgba(200,217,167,.12)" : "rgba(249,247,242,.04)",
                    borderColor: active ? "rgba(200,217,167,.45)" : "rgba(249,247,242,.09)",
                  }}
                >
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 flex-none rounded-full"
                    style={{ background: dot }}
                  />
                  <span
                    className="flex-1 text-[15.5px] font-bold"
                    style={{ color: active ? "#F9F7F2" : "#A8BEB7" }}
                  >
                    {name}
                  </span>
                  <span
                    className="text-[14.5px] tabular-nums"
                    style={{ color: active ? "#C8D9A7" : "rgba(168,190,183,.6)" }}
                  >
                    {range}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-dashed border-accent/40 bg-lp-bg/5 px-6 py-[22px]">
              <p className="m-0 mb-4 text-[15.5px] leading-[1.55] text-accent2">
                {tool.footnote}
              </p>
              <a
                href={C.cta.href}
                className="inline-block rounded-full bg-accent px-7 py-3.5 text-[15.5px] font-extrabold text-dark transition-colors hover:bg-white"
              >
                {C.cta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- limits ---------- */}
      <section className="rounded-t-[44px] bg-lp-bg px-5 py-[100px] sm:px-7">
        <div className="mx-auto max-w-[1360px]">
          <h2
            className="m-0 mb-3 font-extrabold tracking-[-0.03em] text-lp-dark"
            style={{ fontSize: "clamp(26px,3.8vw,52px)" }}
          >
            {C.limits.headingA}{" "}
            <span className="font-serif font-normal italic tracking-normal text-lp-green">
              {C.limits.headingB}
            </span>
          </h2>
          <p className="m-0 mb-11 max-w-[60ch] text-[17px] leading-[1.55] text-lp-dark/60 sm:text-[18px]">
            {C.limits.body}
          </p>

          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
            {C.limits.cards.map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-lp-dark/10 bg-white px-7 py-[30px]"
                style={{ boxShadow: "0 12px 34px rgba(25,50,49,.07)" }}
              >
                <h3 className="m-0 mb-2.5 text-xl font-extrabold tracking-[-0.02em] text-lp-dark">
                  {c.title}
                </h3>
                <p className="m-0 text-base leading-[1.55] text-lp-dark/65">{c.text}</p>
              </div>
            ))}
          </div>

          <p className="m-0 mt-10 text-[11.5px] leading-relaxed text-lp-dark/50">
            {C.disclaimer}
          </p>
        </div>
      </section>

      <style jsx>{`
        .tc-glow {
          animation: tcGlow 9s ease-in-out infinite;
        }
        @keyframes tcGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tc-glow {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
