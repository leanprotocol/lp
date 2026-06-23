"use client";

import { useEffect, useRef, useState } from "react";

interface StatDef {
  to: number;
  suffix: string;
  decimals?: number;
  label: string;
}

const STATS: StatDef[] = [
  { to: 22, suffix: "%", label: "Avg. weight loss" },
  { to: 98, suffix: "%", label: "Success rate" },
  { to: 2.6, suffix: "%", decimals: 1, label: "Avg. HbA1c drop" },
  { to: 10000, suffix: "+", label: "Transformations" },
];

function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return value.toFixed(decimals);
}

function Stat({ stat, active }: { stat: StatDef; active: boolean }) {
  const value = useCountUp(stat.to, stat.decimals ?? 0, active);
  return (
    <div className="stat">
      <div className="n">
        {value}
        {stat.suffix}
      </div>
      <div className="l">{stat.label}</div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      <div className="wrap stats-grid">
        {STATS.map((stat, i) => (
          <Stat key={i} stat={stat} active={active} />
        ))}
      </div>
    </div>
  );
}
