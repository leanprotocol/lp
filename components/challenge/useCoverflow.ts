"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CoverflowOptions {
  count: number;
  cardWidth: number;
  intervalMs?: number;
}

interface CardStyle {
  transform: string;
  zIndex: number;
  opacity: number;
  filter: string;
  pointerEvents: "auto" | "none";
  isActive: boolean;
}

export function useCoverflow({ count, cardWidth, intervalMs = 4400 }: CoverflowOptions) {
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const stageRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const downRef = useRef(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + count) % count), [count]);
  const goTo = useCallback((i: number) => setIdx(((i % count) + count) % count), [count]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % count);
    }, intervalMs);
  }, [count, intervalMs]);

  const rest = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const getX = (e: PointerEvent | TouchEvent) =>
      "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;

    const onPointerDown = (e: PointerEvent) => {
      downRef.current = true;
      startXRef.current = getX(e);
      movedRef.current = false;
      stop();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!downRef.current) return;
      const dx = getX(e) - startXRef.current;
      if (Math.abs(dx) > 55 && !movedRef.current) {
        movedRef.current = true;
        dx < 0 ? next() : prev();
      }
    };
    const onPointerUp = () => {
      if (downRef.current) {
        downRef.current = false;
        start();
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      downRef.current = true;
      startXRef.current = getX(e);
      movedRef.current = false;
      stop();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!downRef.current) return;
      const dx = getX(e) - startXRef.current;
      if (Math.abs(dx) > 45 && !movedRef.current) {
        movedRef.current = true;
        dx < 0 ? next() : prev();
      }
    };
    const onTouchEnd = () => {
      downRef.current = false;
      start();
    };
    const onMouseEnter = () => stop();
    const onMouseLeave = () => start();

    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: true });
    stage.addEventListener("touchend", onTouchEnd);
    stage.addEventListener("mouseenter", onMouseEnter);
    stage.addEventListener("mouseleave", onMouseLeave);

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("mouseenter", onMouseEnter);
      stage.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [next, prev, start, stop]);

  function getDims() {
    const vw = mounted && typeof window !== "undefined" ? window.innerWidth : 1200;
    const s = vw < 560 ? 0.82 : vw < 900 ? 0.9 : 1;
    return { spacing: cardWidth * 0.6 * s, depth: 240 * s, rot: 42, scale: s };
  }

  function getCardStyle(i: number): CardStyle {
    const d = getDims();
    let o = i - idx;
    if (o > count / 2) o -= count;
    else if (o < -count / 2) o += count;
    const ao = Math.abs(o);
    const sign = o < 0 ? 1 : -1;
    const x = o * d.spacing;
    const z = o === 0 ? 60 : -d.depth - (ao - 1) * 70 * d.scale;
    const ry = o === 0 ? 0 : sign * d.rot;
    const sc = (o === 0 ? 1 : 0.82) * d.scale;

    return {
      transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`,
      zIndex: 100 - ao,
      opacity: ao > 2 ? 0 : o === 0 ? 1 : 0.6,
      filter: o === 0 ? "none" : "brightness(.72)",
      pointerEvents: o === 0 ? "auto" : "none",
      isActive: o === 0,
    };
  }

  return { idx, goTo, next, prev, rest, stageRef, getCardStyle };
}