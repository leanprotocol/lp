"use client";

// components/campaign/plans-hero.tsx
// Core pricing section. ALL prices come from /api/plans via props (dbPlans).
// Buy CTA passes plan.id straight to onBuyNow - no name matching, no
// fallback plan. Consult goes to WhatsApp.
//
// Explorer tabs swap the poster image in the same frame (assets in
// /public/lp-assets). Selecting the Doctor Consultation tile shows
// consultPoster (/get-started.png).
//
// Sizing note: posters render as plain <img width:100%;height:auto> rather
// than next/image fill + aspect-ratio. A fill image needs a definite parent
// width; inside an auto-sized grid track that resolves to the file's
// intrinsic width (1054px) and forces the whole page to lay out at that
// width on mobile. width:100% sizes from the container instead, and also
// tolerates the explorer posters having different aspect ratios.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  tracks,
  planMeta,
  posters,
  planDisplayName,
  vizTabs,
  consultPoster,
  terms,
  disclaimer,
  consultMeta,
  WA_LINK,
  type MedTrack,
  type DurationKey,
} from "@/content/campaign";
import styles from "./campaign.module.css";

export type DbPlan = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  durationDays: number;
};

const DURATIONS: DurationKey[] = ["1 Month", "3 Months", "6 Months"];

const inr = (n: number) => "\u20B9" + Math.round(n).toLocaleString("en-IN");

function durationOf(p: DbPlan): DurationKey | "Consult" {
  if (p.durationDays <= 15 || p.name.toLowerCase().includes("doctor"))
    return "Consult";
  if (p.durationDays >= 180) return "6 Months";
  if (p.durationDays >= 90) return "3 Months";
  return "1 Month";
}

interface PlansHeroProps {
  med: MedTrack;
  onMedChange: (m: MedTrack) => void;
  showMedToggle: boolean;
  dbPlans: DbPlan[];
  plansLoading: boolean;
  onBuyNow: (planId: string) => void;
  isCheckoutLoading: boolean;
  onSelectedPlanChange?: (sel: {
    label: string;
    price: string;
    planId: string | null;
    isConsult: boolean;
  }) => void;
}

export function PlansHero({
  med,
  onMedChange,
  showMedToggle,
  dbPlans,
  plansLoading,
  onBuyNow,
  isCheckoutLoading,
  onSelectedPlanChange,
}: PlansHeroProps) {
  const [sel, setSel] = useState<DurationKey | "Consult">("1 Month");
  const [detailPlan, setDetailPlan] = useState<DurationKey>("1 Month");
  const [tab, setTab] = useState(-1);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const posterRowRef = useRef<HTMLDivElement>(null);

  const t = tracks[med];

  const byDuration = useMemo(() => {
    const m = new Map<DurationKey | "Consult", DbPlan>();
    for (const p of dbPlans) {
      const d = durationOf(p);
      if (!m.has(d)) m.set(d, p);
    }
    return m;
  }, [dbPlans]);

  const tiles = DURATIONS.filter((d) => byDuration.has(d)).map((d) => {
    const p = byDuration.get(d)!;
    const was = p.originalPrice || Math.round(p.price * 1.5);
    const off = Math.max(0, Math.round((1 - p.price / was) * 100));
    return {
      key: d as DurationKey | "Consult",
      duration: d,
      name: planMeta[d].title + " \u2014 " + planMeta[d].sub,
      featured: planMeta[d].featured,
      price: inr(p.price),
      was: inr(was),
      off: off + "%",
      planId: p.id,
    };
  });

  const consultDbPlan = byDuration.get("Consult");
  const consultTile = {
    key: "Consult" as const,
    duration: consultMeta.duration,
    name: consultMeta.name,
    featured: false,
    price: consultDbPlan ? inr(consultDbPlan.price) : consultMeta.fallbackPrice,
    was: consultDbPlan?.originalPrice
      ? inr(consultDbPlan.originalPrice)
      : consultMeta.fallbackWas,
    off: "",
    planId: consultDbPlan?.id ?? null,
  };

  const allTiles = [...tiles, consultTile];
  const selTile = allTiles.find((x) => x.key === sel) || allTiles[0];
  const isConsultSel = selTile?.key === "Consult";

  useEffect(() => {
    if (selTile && onSelectedPlanChange)
      onSelectedPlanChange({
        label: selTile.duration,
        price: selTile.price,
        planId: selTile.planId,
        isConsult: selTile.key === "Consult",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selTile?.price, selTile?.planId, sel]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const scrollPosterTo = (d: DurationKey) => {
    const row = posterRowRef.current;
    if (!row) return;
    const idx = DURATIONS.indexOf(d);
    row.scrollTo({ left: row.clientWidth * idx, behavior: "smooth" });
  };

  const pickSel = (key: DurationKey | "Consult") => {
    setSel(key);
    setTab(-1);
    if (key !== "Consult") {
      setDetailPlan(key);
      scrollPosterTo(key);
    }
  };

  const pickDot = (d: DurationKey) => {
    setDetailPlan(d);
    setTab(-1);
    setSel(d);
    scrollPosterTo(d);
  };

  const onPosterScroll = () => {
    const row = posterRowRef.current;
    if (!row || row.clientWidth === 0) return;
    const idx = Math.round(row.scrollLeft / row.clientWidth);
    const d = DURATIONS[Math.min(2, Math.max(0, idx))];
    if (d && d !== detailPlan) setDetailPlan(d);
  };

  const viz = tab >= 0 ? vizTabs[tab] : null;

  const activePoster = viz
    ? viz.image
    : isConsultSel
      ? consultPoster
      : posters[med][detailPlan];
  const activeCaption = viz
    ? viz.name
    : isConsultSel
      ? consultMeta.duration
      : planDisplayName[detailPlan];

  // Mobile shows the 3-poster swipe row only for plan posters
  const swipeMode = !viz && !isConsultSel;

  const explorerPills = [
    { name: isConsultSel ? "Consultation" : detailPlan + " Plan", i: -1 },
    ...vizTabs.map((v, i) => ({ name: v.name, i })),
  ];

  const dots = (extra: string) => (
    <div className={"flex items-center justify-center gap-2 " + extra}>
      {DURATIONS.map((d) => {
        const on = detailPlan === d && swipeMode;
        return (
          <button
            key={d}
            type="button"
            aria-label={"Show " + d + " plan poster"}
            onClick={() => pickDot(d)}
            className="h-2 rounded-full transition-all"
            style={{
              width: on ? 26 : 8,
              background: on ? "#2D5A4E" : "rgba(28,43,34,0.28)",
            }}
          />
        );
      })}
    </div>
  );

  // Poster frame. Plain img so width comes from the container.
  const posterCard = (src: string, caption: string) => (
    <div
      className="w-full cursor-zoom-in rounded-[22px] border border-[rgba(28,43,34,0.12)] bg-white p-2 shadow-[0_18px_44px_rgba(25,50,49,0.16)] md:rounded-[26px] md:p-2.5 md:shadow-[0_26px_62px_rgba(25,50,49,0.2)]"
      onClick={() => setLightbox(src)}
      role="button"
      aria-label={"Open " + caption + " full size"}
    >
      <div className="overflow-hidden rounded-[15px] bg-[#F7F5EF] md:rounded-[18px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={caption}
          loading="lazy"
          className={"block h-auto w-full " + styles.swap}
        />
      </div>
    </div>
  );

  if (plansLoading) {
    return (
      <section
        id="plans"
        className="bg-[#F9F7F2] px-4 pb-10 pt-[26px] md:px-7 md:pb-16 md:pt-12"
      >
        <div className="mx-auto max-w-[1360px]">
          <div className="h-4 w-56 animate-pulse rounded bg-[rgba(28,43,34,0.1)]" />
          <div className="mt-4 h-12 w-3/4 animate-pulse rounded bg-[rgba(28,43,34,0.1)]" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-[300px] animate-pulse rounded-[22px] bg-[rgba(28,43,34,0.08)]" />
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-[18px] bg-[rgba(28,43,34,0.08)]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="plans"
      className="overflow-x-hidden bg-[#F9F7F2] px-4 pb-10 pt-[26px] md:px-7 md:pb-[90px] md:pt-[52px]"
    >
      <div className="mx-auto w-full max-w-[1360px]">
        {/* Head */}
        <div className="md:flex md:items-end md:justify-between md:gap-8 md:border-b md:border-[rgba(28,43,34,0.12)] md:pb-[26px]">
          <div className="min-w-0 md:flex-1">
            <div className="mb-2.5 text-[11px] font-extrabold tracking-[0.15em] text-[#2D5A4E] md:mb-3.5 md:text-[12.5px] md:font-bold md:tracking-[0.16em]">
              DOCTOR-LED {"\u00B7"} PRESCRIPTION-ONLY
            </div>
            <h1
              key={"h-" + med}
              className={
                "mb-[18px] max-w-[24ch] text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#1C2B22] md:mb-0 md:text-[clamp(30px,4.2vw,60px)] md:leading-[1.02] md:tracking-[-0.035em] " +
                styles.swap
              }
            >
              {t.heroTitle}
            </h1>
            <p className="mt-3 hidden max-w-[56ch] text-[16px] leading-normal text-[rgba(28,43,34,0.6)] md:block">
              {t.heroSub}
            </p>
          </div>
          <div className="md:flex md:min-h-[128px] md:flex-none md:flex-col md:items-end md:justify-end md:gap-4">
            {showMedToggle && (
              <div className="grid grid-cols-2 gap-[5px] rounded-2xl border border-[rgba(28,43,34,0.12)] bg-white p-[5px] shadow-[0_10px_26px_rgba(25,50,49,0.08)]">
                {(Object.keys(tracks) as MedTrack[]).map((m) => {
                  const on = med === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onMedChange(m)}
                      className={
                        "min-w-0 rounded-xl px-2 py-[11px] text-center transition-colors md:px-5 md:py-[9px] " +
                        (on ? "bg-[#193231]" : "bg-transparent")
                      }
                    >
                      <div
                        className={
                          "text-[14.5px] font-extrabold tracking-[-0.01em] " +
                          (on ? "text-[#F9F7F2]" : "text-[rgba(28,43,34,0.6)]")
                        }
                      >
                        {tracks[m].name}
                      </div>
                      <div
                        className={
                          "mt-0.5 text-[10.5px] font-semibold md:text-[11px] " +
                          (on
                            ? "text-[rgba(200,217,167,0.9)]"
                            : "text-[rgba(28,43,34,0.4)]")
                        }
                      >
                        {tracks[m].molecule}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {selTile && (
              <div
                key={"sel-" + sel + selTile.price}
                className={
                  "hidden flex-wrap items-baseline justify-end gap-3 whitespace-nowrap md:flex " +
                  styles.swap
                }
              >
                <span className="text-[clamp(30px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.03em] text-[#2D5A4E]">
                  {selTile.price}
                </span>
                <span className="text-[18px] text-[rgba(28,43,34,0.4)] line-through">
                  {selTile.was}
                </span>
                {selTile.off && (
                  <span className="rounded-full bg-[#C9A84C] px-3.5 py-1.5 text-[12.5px] font-extrabold tracking-[0.05em] text-[#0E0E0F]">
                    {selTile.off} OFF
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 grid w-full grid-cols-1 items-start gap-0 md:mt-[30px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-[clamp(24px,3.4vw,54px)]">
          {/* Tiles */}
          <div
            key={"tiles-" + med}
            className={
              "order-2 mt-[26px] flex min-w-0 flex-col gap-[11px] md:order-1 md:mt-0 md:gap-4 " +
              styles.swap
            }
          >
            {allTiles.map((p) => {
              const on = sel === p.key;
              const dashed = p.key === "Consult" && !on;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => pickSel(p.key)}
                  className={
                    "relative flex w-full min-w-0 items-center gap-3.5 rounded-[18px] px-4 py-[18px] text-left transition-all md:gap-5 md:rounded-[22px] md:px-8 md:py-[34px] md:hover:translate-x-[5px] " +
                    (on
                      ? "border-[1.5px] border-[#C9A84C] bg-gradient-to-br from-[#22453c] to-[#12241f] shadow-[0_18px_44px_rgba(25,50,49,0.26)] md:shadow-[0_26px_60px_rgba(25,50,49,0.28)]"
                      : "border border-[rgba(28,43,34,0.14)] bg-white shadow-[0_8px_22px_rgba(25,50,49,0.06)] md:shadow-[0_12px_32px_rgba(25,50,49,0.08)]" +
                        (dashed ? " border-dashed md:border-solid" : ""))
                  }
                >
                  <div
                    className={
                      "h-5 w-5 flex-none rounded-full border-2 transition-all md:h-6 md:w-6 " +
                      (on
                        ? "border-[#C8D9A7] bg-[#C8D9A7]"
                        : "border-[rgba(28,43,34,0.28)] bg-transparent")
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-[7px] md:items-baseline md:gap-2.5">
                      <div
                        className={
                          "text-[17.5px] font-extrabold tracking-[-0.02em] md:text-[22px] " +
                          (on ? "text-[#F9F7F2]" : "text-[#1C2B22]")
                        }
                      >
                        {p.duration}
                      </div>
                      {p.featured && (
                        <span className="whitespace-nowrap rounded-full bg-[#C9A84C] px-2 py-[3px] text-[9.5px] font-extrabold tracking-[0.05em] text-[#0E0E0F] md:px-2.5 md:py-1 md:text-[10.5px] md:tracking-[0.06em]">
                          <span className="md:hidden">POPULAR</span>
                          <span className="hidden md:inline">MOST POPULAR</span>
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        "mt-[3px] truncate text-[12.5px] font-semibold md:mt-1 md:whitespace-normal md:text-[14.5px] " +
                        (on
                          ? "text-[rgba(168,190,183,0.85)]"
                          : "text-[rgba(28,43,34,0.55)]")
                      }
                    >
                      {p.name}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <div
                      className={
                        "text-[20px] font-extrabold leading-none tracking-[-0.03em] md:text-[clamp(26px,2.6vw,36px)] " +
                        (on ? "text-[#F9F7F2]" : "text-[#1C2B22]")
                      }
                    >
                      {p.price}
                    </div>
                    <div
                      className={
                        "mt-1 text-[12.5px] line-through md:mt-[5px] md:text-[15px] " +
                        (on
                          ? "text-[rgba(168,190,183,0.85)]"
                          : "text-[rgba(28,43,34,0.55)]")
                      }
                    >
                      {p.was}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Mobile selected-price card */}
            {selTile && (
              <div className="mt-[7px] flex w-full min-w-0 flex-wrap items-center gap-2.5 rounded-[18px] border border-[rgba(28,43,34,0.12)] bg-white p-4 md:hidden">
                <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#2D5A4E]">
                  {selTile.price}
                </span>
                <span className="text-[15px] text-[rgba(28,43,34,0.4)] line-through">
                  {selTile.was}
                </span>
                {selTile.off && (
                  <span className="rounded-full bg-[#C9A84C] px-3 py-[5px] text-[11.5px] font-extrabold tracking-[0.05em] text-[#0E0E0F]">
                    {selTile.off} OFF
                  </span>
                )}
              </div>
            )}

            {/* Desktop inline CTA */}
            {isConsultSel ? (
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 hidden rounded-full bg-[#2D5A4E] p-[18px] text-center text-[17.5px] font-extrabold text-[#F9F7F2] shadow-[0_18px_44px_rgba(45,90,78,0.28)] transition-colors hover:bg-[#193231] md:block"
              >
                Book consultation
              </a>
            ) : (
              <button
                type="button"
                onClick={() => selTile?.planId && onBuyNow(selTile.planId)}
                disabled={isCheckoutLoading || !selTile?.planId}
                className="mt-2 hidden rounded-full bg-[#2D5A4E] p-[18px] text-center text-[17.5px] font-extrabold text-[#F9F7F2] shadow-[0_18px_44px_rgba(45,90,78,0.28)] transition-colors hover:bg-[#193231] disabled:cursor-not-allowed disabled:opacity-60 md:block"
              >
                {isCheckoutLoading ? "Opening checkout\u2026" : "Get started now"}
              </button>
            )}
          </div>

          {/* Poster column */}
          <div className="order-1 w-full min-w-0 md:order-2 md:-mt-[42px]">
            {swipeMode ? (
              <>
                {/* Mobile swipe row */}
                <div className="md:hidden">
                  <div
                    ref={posterRowRef}
                    onScroll={onPosterScroll}
                    className={
                      "flex w-full snap-x snap-mandatory gap-3 overflow-x-auto py-0.5 " +
                      styles.noScrollbar
                    }
                  >
                    {DURATIONS.map((d) => (
                      <div
                        key={d}
                        className="w-full min-w-0 flex-none snap-center"
                      >
                        {posterCard(posters[med][d], planDisplayName[d])}
                      </div>
                    ))}
                  </div>
                  {dots("mt-3.5")}
                </div>
                {/* Desktop single frame */}
                <div className="hidden md:block">
                  {posterCard(activePoster, activeCaption)}
                  {dots("mt-3.5")}
                </div>
              </>
            ) : (
              <>
                {posterCard(activePoster, activeCaption)}
                {dots("mt-3.5")}
              </>
            )}

            {/* Explorer pills */}
            <div
              className={
                "flex w-full gap-2 overflow-x-auto pb-1 pt-3.5 md:gap-[9px] md:pb-3 " +
                styles.noScrollbar
              }
            >
              {explorerPills.map((e) => {
                const on = tab === e.i;
                return (
                  <button
                    key={e.i}
                    type="button"
                    onClick={() => setTab(e.i)}
                    className={
                      "flex-none whitespace-nowrap rounded-full border-[1.5px] px-[17px] py-2.5 text-[13.5px] font-bold transition-all md:px-[22px] md:py-3 md:text-[14.5px] " +
                      (on
                        ? "border-[#193231] bg-[#193231] text-[#F9F7F2]"
                        : "border-[rgba(28,43,34,0.16)] bg-white text-[rgba(28,43,34,0.68)] md:hover:border-[#2D5A4E]")
                    }
                  >
                    {e.name}
                  </button>
                );
              })}
            </div>

            {/* Caption + full size */}
            <div className="mt-2.5 flex w-full items-center justify-between gap-3">
              <div className="min-w-0 truncate text-[15px] font-extrabold tracking-[-0.02em] text-[#1C2B22] md:text-[16px]">
                {activeCaption}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(activePoster)}
                className="flex-none text-[13px] font-extrabold text-[#2D5A4E] md:text-[13.5px] md:font-bold"
              >
                Full size {"\u2197"}
              </button>
            </div>

            {viz?.note && (
              <p className="mt-2 text-[10.5px] leading-snug text-[rgba(28,43,34,0.5)] md:text-[11px]">
                {viz.note}
              </p>
            )}
          </div>
        </div>

        {/* Terms + disclaimer */}
        <div className="mt-[26px] border-t border-[rgba(28,43,34,0.12)] pt-5 md:mt-[52px] md:grid md:grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] md:gap-[26px] md:pt-10">
          <div className="min-w-0">
            <h3 className="mb-2.5 text-[10px] font-extrabold tracking-[0.14em] text-[#2D5A4E] md:mb-4 md:text-[13px] md:font-bold">
              TERMS & CONDITIONS
            </h3>
            <div className="flex flex-col gap-[7px] md:gap-3">
              {terms.map((tm, i) => (
                <div
                  key={i}
                  className="flex min-w-0 items-start gap-2 text-[11.5px] leading-normal text-[#4A5A50] md:gap-3 md:text-[15px] md:leading-relaxed md:text-[rgba(28,43,34,0.68)]"
                >
                  <span className="flex-none font-extrabold text-[#9c7d1f] md:text-[#C9A84C]">
                    {"\u2014"}
                  </span>
                  <span className="min-w-0">{tm}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3.5 min-w-0 rounded-[14px] border border-[rgba(28,43,34,0.1)] bg-white px-3.5 py-3 md:mt-0 md:rounded-[22px] md:px-7 md:py-[26px]">
            <h3 className="mb-1.5 text-[10px] font-extrabold tracking-[0.14em] text-[#2D5A4E] md:mb-3 md:text-[13px] md:font-bold">
              DISCLAIMER
            </h3>
            <p className="text-[11px] leading-normal text-[#4A5A50] md:text-[14.5px] md:leading-relaxed md:text-[rgba(28,43,34,0.65)]">
              {disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className={
            "fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-[rgba(14,14,15,0.94)] p-4 backdrop-blur-md md:p-7 " +
            styles.swap
          }
          role="dialog"
          aria-label="Poster, full size"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Poster full size"
            className="max-h-[88vh] max-w-[min(92vw,640px)] rounded-[14px] object-contain shadow-[0_40px_100px_rgba(0,0,0,0.7)] md:max-h-[90vh] md:rounded-[18px]"
          />
          <button
            type="button"
            aria-label="Close"
            className="absolute right-[18px] top-4 text-[28px] font-extrabold leading-none text-[#F9F7F2] md:right-7 md:top-6"
          >
            {"\u00D7"}
          </button>
        </div>
      )}
    </section>
  );
}
