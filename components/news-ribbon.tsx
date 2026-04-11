"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useAnimationFrame } from "framer-motion"

const outlets = [
  { name: "Money Control",     logo: "/press/moneycontrol.png" },
  { name: "Economic Times",    logo: "/press/et.png" },
  { name: "The Quint",         logo: "/press/thequint.png" },
  { name: "Financial Express", logo: "/press/financialexpress.png" },
  { name: "Times of India",    logo: "/press/toi.png" },
  { name: "Mint",              logo: "/press/mint.png" },
  { name: "Hindustan Times",   logo: "/press/hindustantimes.png" },
  { name: "CNBC TV18",         logo: "/press/cnbc.png" },
  { name: "Inc42",             logo: "/press/inc42.png" },
  { name: "ET Now",            logo: "/press/etnow.png" },
  { name: "Zee News",          logo: "/press/zeenews.png" },
]

const COPIES = 4
const items = Array.from({ length: COPIES }, () => outlets).flat()

function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function Ribbon() {
  const trackRef = useRef<HTMLDivElement>(null)
  const setWidth = useRef(0)
  const baseX = useMotionValue(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => { setWidth.current = el.scrollWidth / COPIES }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (!setWidth.current) return
    baseX.set(baseX.get() - 55 * (delta / 1000))
  })

  const x = useMotionValue("0px")
  baseX.on("change", (v) => {
    if (!setWidth.current) return
    x.set(`${wrap(-setWidth.current, 0, v)}px`)
  })

  return (
    <div className="overflow-hidden">
      <motion.div ref={trackRef} className="flex items-center gap-16 md:gap-24" style={{ x }}>
        {items.map((outlet, i) => (
          <div key={i} className="shrink-0 flex items-center gap-3 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={outlet.logo}
              alt={outlet.name}
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg"
              draggable={false}
            />
            <span className="font-sans text-base md:text-lg font-semibold text-dark/70 whitespace-nowrap">
              {outlet.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function NewsRibbon() {
  return (
    <section className="py-8 md:py-14 bg-background overflow-hidden">
      <div className="text-center mb-6 md:mb-8 px-4">
        <h2 className="font-serif text-2xl md:text-3xl text-dark">In the News</h2>
        <p className="text-sm text-muted-foreground mt-1">
          GLP-1 is the only clinically proven weight loss solution that works if your BMI is above 27
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10 bg-linear-to-l from-background to-transparent" />
        <Ribbon />
      </div>
    </section>
  )
}
