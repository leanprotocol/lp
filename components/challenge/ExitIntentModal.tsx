"use client";

import { useEffect, useRef, useState } from "react";

export function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    function openOnce() {
      if (shownRef.current) return;
      shownRef.current = true;
      setShow(true);
    }

    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0 && !e.relatedTarget) openOnce();
    }

    document.addEventListener("mouseout", onMouseOut);
    const timer = setTimeout(openOnce, 45000);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(timer);
    };
  }, []);

  const close = () => setShow(false);

  const goToSpin = () => {
    close();
    document.getElementById("spin")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`modal-overlay ${show ? "show" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal">
        <button className="x" aria-label="Close" onClick={close}>
          ×
        </button>
        <h3>Wait — don&apos;t miss your reward! 🎉</h3>
        <p>Spin the wheel before you go and unlock an exclusive bonus on your 30 Days Hard Challenge.</p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={goToSpin}>
          Spin &amp; win now <span className="arrow">›</span>
        </button>
      </div>
    </div>
  );
}
