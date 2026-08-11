"use client";

// components/campaign/how-section.tsx
// Desktop: 440vh sticky section, horizontal track driven by scroll position
// read in JS, rAF-throttled (HANDOVER s4 - no CSS scroll-driven animations).
// Mobile (per mobile template): normal-height section, IMAGE-ONLY snap
// carousel (cropped 320/179 slides), segmented clickable progress bars,
// auto-advance that pauses 5s on touch, no step counter.
// prefers-reduced-motion: no auto-advance, no pinning; manual scroll only.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { steps, RESULTS_DISCLAIMER } from "@/content/campaign";
import styles from "./campaign.module.css";

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatch(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatch(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export function HowSection() {
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const desktop = useMedia("(min-width: 768px)");
  const pinned = desktop && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const [mobStep, setMobStep] = useState(0);
  const [maxShift, setMaxShift] = useState(0);

  // Desktop scroll driver
  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sec = sectionRef.current;
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
        setProg(p);
      });
    };
    const measure = () => {
      const el = trackRef.current;
      if (!el || !el.parentElement) return;
      setMaxShift(Math.max(0, el.scrollWidth - el.parentElement.clientWidth));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize, { passive: true });
    measure();
    onScroll();
    const t = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  // Mobile auto-advance (pauses 5s on touch)
  useEffect(() => {
    if (desktop || reduced) return;
    const el = mobileRef.current;
    if (!el) return;
    let paused = false;
    let resume: ReturnType<typeof setTimeout>;
    const pause = () => {
      paused = true;
      clearTimeout(resume);
      resume = setTimeout(() => {
        paused = false;
      }, 5000);
    };
    el.addEventListener("pointerdown", pause, { passive: true });
    el.addEventListener("touchmove", pause, { passive: true });
    const timer = setInterval(() => {
      if (paused) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const w = el.scrollWidth / steps.length;
      const next = (Math.round(el.scrollLeft / w) + 1) % steps.length;
      el.scrollTo({ left: Math.round(w * next), behavior: "smooth" });
    }, 3600);
    return () => {
      clearInterval(timer);
      clearTimeout(resume);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchmove", pause);
    };
  }, [desktop, reduced]);

  const onMobileScroll = () => {
    const el = mobileRef.current;
    if (!el || el.scrollWidth === 0) return;
    const w = el.scrollWidth / steps.length;
    const i = Math.min(
      steps.length - 1,
      Math.max(0, Math.round(el.scrollLeft / w))
    );
    if (i !== mobStep) setMobStep(i);
  };

  const scrollMobileTo = (i: number) => {
    const el = mobileRef.current;
    if (!el) return;
    const w = el.scrollWidth / steps.length;
    el.scrollTo({ left: Math.round(w * i), behavior: "smooth" });
  };

  const raw = prog * steps.length;
  const active = Math.min(steps.length - 1, Math.floor(raw));
  const within = Math.min(1, Math.max(0, raw - active));

  // ---------- Desktop (pinned) ----------
  if (pinned) {
    return (
      <section
        ref={sectionRef}
        className="relative bg-[#193231]"
        style={{ height: "440vh" }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-10">
          <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-7 px-7">
            <div>
              <div className="mb-3.5 text-[12.5px] font-bold tracking-[0.16em] text-[#C8D9A7]">
                HOW WE DO IT
              </div>
              <h2 className="mb-2.5 max-w-[22ch] text-[clamp(26px,3.4vw,50px)] font-extrabold leading-[1.03] tracking-[-0.035em] text-[#F9F7F2]">
                Scientific. Step by step.{" "}
                <span className="font-serif-accent italic text-[#C8D9A7]">
                  Evidence-led.
                </span>
              </h2>
              <p className="max-w-[52ch] text-[16.5px] leading-normal text-[#A8BEB7]">
                Six delivery steps, identical on both medication tracks {"\u2014"}{" "}
                keep scrolling.
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[clamp(38px,4vw,58px)] font-extrabold leading-none tracking-[-0.03em] text-[#C8D9A7]">
                {"0" + Math.min(6, active + 1)}
              </span>
              <span className="text-[17px] font-bold text-[rgba(168,190,183,0.6)]">
                / 06
              </span>
            </div>
          </div>
          <div className="mt-[clamp(24px,4vh,44px)] overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max gap-[clamp(16px,1.6vw,24px)] px-[clamp(28px,5vw,80px)] will-change-transform"
              style={{
                transform: "translateX(" + -Math.round(prog * maxShift) + "px)",
                transition: "transform 0.18s linear",
              }}
            >
              {steps.map((s, i) => {
                const near = Math.abs(i - active);
                return (
                  <div
                    key={s.num}
                    className="w-[clamp(280px,27vw,420px)] flex-none overflow-hidden rounded-[26px] border bg-[#0E1512] transition-[opacity,transform,border-color] duration-500"
                    style={{
                      opacity: near === 0 ? 1 : near === 1 ? 0.62 : 0.32,
                      transform: near === 0 ? "scale(1)" : "scale(0.955)",
                      borderColor:
                        near === 0
                          ? "rgba(200,217,167,0.5)"
                          : "rgba(249,247,242,0.1)",
                      boxShadow:
                        near === 0
                          ? "0 30px 70px rgba(0,0,0,0.5)"
                          : "0 16px 40px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="relative h-[clamp(180px,26vh,260px)] overflow-hidden bg-[#22453c]">
                      <Image
                        src={s.img}
                        alt={s.title}
                        fill
                        sizes="27vw"
                        className="object-cover"
                      />
                      <div className="absolute left-3.5 top-3.5 rounded-full bg-[rgba(14,14,15,0.8)] px-3.5 py-1.5 text-[12.5px] font-extrabold tracking-[0.08em] text-[#C8D9A7] backdrop-blur-sm">
                        STEP {s.num}
                      </div>
                    </div>
</div>
                );
              })}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[1360px] px-7">
            <div className="mt-[clamp(20px,3.5vh,34px)] flex gap-2">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-[rgba(249,247,242,0.14)]"
                >
                  <div
                    className="h-full bg-[#C8D9A7] transition-[width] duration-200"
                    style={{
                      width:
                        (i < active
                          ? 100
                          : i === active
                            ? Math.round(within * 100)
                            : 0) + "%",
                    }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11.5px] text-[rgba(168,190,183,0.55)]">
              {RESULTS_DISCLAIMER}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ---------- Mobile / reduced-motion ----------
  return (
    <section ref={sectionRef} className="bg-[#193231] py-[46px]">
      <div className="px-4">
        <div className="mb-[11px] text-[11px] font-extrabold tracking-[0.15em] text-[#C8D9A7]">
          HOW WE DO IT
        </div>
        <h2 className="mb-2 text-[26px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#F9F7F2]">
          Scientific. Step by step.{" "}
          <span className="font-serif-accent italic text-[#C8D9A7]">
            Evidence-led.
          </span>
        </h2>
        <p className="mb-5 text-[14.5px] leading-normal text-[#A8BEB7]">
          Six delivery steps {"\u2014"} swipe through them.
        </p>
      </div>
      <div
        ref={mobileRef}
        onScroll={onMobileScroll}
        className={
          "flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 " +
          styles.noScrollbar
        }
      >
        {steps.map((s) => (
          <div
            key={s.num}
            className="min-w-0 flex-none snap-center overflow-hidden rounded-[20px] border border-[rgba(249,247,242,0.1)] bg-[#0E1512]"
            style={{ width: "min(calc(100vw - 56px), 320px)" }}
          >
            {/* Image-only slide, cropped per template (top offset crop) */}
            <div className="w-full overflow-hidden bg-[#22453c]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 px-4 pt-[18px]">
        {steps.map((s, i) => (
          <button
            key={s.num}
            type="button"
            aria-label={"Go to step " + s.num + ": " + s.title}
            onClick={() => scrollMobileTo(i)}
            className="h-[3px] flex-1 rounded-full transition-colors"
            style={{
              background:
                i === mobStep ? "#C8D9A7" : "rgba(249,247,242,0.18)",
            }}
          />
        ))}
      </div>
      <p className="mt-3.5 px-4 text-[11px] leading-relaxed text-[rgba(168,190,183,0.55)]">
        {RESULTS_DISCLAIMER}
      </p>
    </section>
  );
}
