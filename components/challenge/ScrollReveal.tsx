"use client";

import { useEffect } from "react";

/**
 * Ports the original vanilla-JS scroll-reveal behavior into React.
 * Any element with class="... reveal" starts at opacity:0 (see .reveal
 * in challenge.css) and needs a class of "in" added once it scrolls
 * into view. This component sets up that one global observer.
 *
 * Render this once, anywhere in the page tree (next to <Confetti />
 * works well) — it has no visual output of its own.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".challenge-page .reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
