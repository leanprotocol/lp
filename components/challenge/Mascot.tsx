"use client";

import { useEffect, useState } from "react";

const HOOKS = [
  "Spin to win 🎉",
  "Lose up to 22%! 🔥",
  "₹3,999 for 30 days",
  "10,000+ joined ✨",
  "Tap me to play!",
];

export function Mascot() {
  const [hookIndex, setHookIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [bubbleKey, setBubbleKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHookIndex((i) => (i + 1) % HOOKS.length);
      setBubbleKey((k) => k + 1); // forces the pop-in animation to replay
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const scrollToSpin = () => {
    document.getElementById("spin")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mascot-wrap">
      <button className="mascot-close" aria-label="Close" onClick={() => setVisible(false)}>
        ×
      </button>
      <div className="mascot-bubble" key={bubbleKey}>
        {HOOKS[hookIndex]}
      </div>
      <svg
        className="mascot"
        viewBox="0 0 120 150"
        width="128"
        role="button"
        aria-label="Lean coach"
        onClick={scrollToSpin}
      >
        <ellipse cx="60" cy="94" rx="46" ry="48" fill="#22392F" stroke="#C9A24B" strokeWidth="3" />
        <circle cx="60" cy="100" r="22" fill="#1A2D26" />
        <text x="60" y="106" textAnchor="middle" fontFamily="Oswald,sans-serif" fontSize="17" fill="#C9A24B" fontWeight="700">
          LP
        </text>
        <g className="arm">
          <rect x="96" y="70" width="13" height="34" rx="6" fill="#22392F" stroke="#C9A24B" strokeWidth="2" />
        </g>
        <rect x="11" y="80" width="13" height="30" rx="6" fill="#22392F" stroke="#C9A24B" strokeWidth="2" />
        <circle cx="60" cy="40" r="30" fill="#22392F" stroke="#C9A24B" strokeWidth="3" />
        <circle cx="50" cy="40" r="4" fill="#F4F0E6" className="eye" />
        <circle cx="70" cy="40" r="4" fill="#F4F0E6" className="eye" />
        <path d="M50 51 Q60 60 70 51" stroke="#C9A24B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="46" cy="140" rx="12" ry="7" fill="#15241E" />
        <ellipse cx="74" cy="140" rx="12" ry="7" fill="#15241E" />
      </svg>
    </div>
  );
}
