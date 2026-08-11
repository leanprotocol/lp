"use client";

// components/campaign/reveal.tsx
// IntersectionObserver entry animation. Replaces the design's
// `animation-timeline: view()` (unsupported in Safari/Firefox - HANDOVER s4).
// With prefers-reduced-motion, the CSS module renders content visible
// immediately, so this wrapper is inert.

import { useEffect, useRef, useState } from "react";
import styles from "./campaign.module.css";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        styles.reveal + " " + (seen ? styles.revealIn : "") + " " + className
      }
      style={delay ? { transitionDelay: delay + "ms" } : undefined}
    >
      {children}
    </div>
  );
}
