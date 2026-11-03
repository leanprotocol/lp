"use client";

// components/campaign/quick-start-modal.tsx
//
// Two fields between "Get started now" and Razorpay, in place of the OTP
// login the /pro page used to show.
//
// The identity cannot simply be dropped: /api/payment/create-order writes
// the Subscription and Payment rows against a userId. This collects the
// least that lets those exist, then opens Razorpay immediately.
//
// Pure ASCII file.

import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReady: () => void;
};

export default function QuickStartModal({ isOpen, onClose, onReady }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      const t = window.setTimeout(() => nameRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ready = name.trim().length > 1 && /^[6-9]\d{9}$/.test(phone);

  async function submit() {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/quick-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), mobileNumber: phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Could not continue. Please try again.");
      }
      onReady();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not continue. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qs-title"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,20,19,.68)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        fontFamily: "var(--font-sans, Inter), Inter, system-ui, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 420,
          background: "#F9F7F2", borderRadius: 24, padding: "32px 28px 28px",
          boxShadow: "0 30px 80px rgba(0,0,0,.4)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 16,
            width: 36, height: 36, border: 0, background: "transparent",
            fontSize: 24, lineHeight: 1, color: "#5A6A62", cursor: "pointer",
            borderRadius: 999,
          }}
        >
          &times;
        </button>

        <h2 id="qs-title" style={{ margin: "0 0 6px", fontSize: 25, lineHeight: 1.15, letterSpacing: "-.025em", fontWeight: 800, color: "#193231" }}>
          Almost there.
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 14.5, lineHeight: 1.55, color: "rgba(28,43,34,.62)" }}>
          We need these to set up your plan and send your confirmation.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label htmlFor="qs-name" style={{ fontSize: 13, fontWeight: 600, color: "#3F4F46" }}>Your name</label>
            <input
              id="qs-name" ref={nameRef} type="text" autoComplete="name"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              style={{
                width: "100%", boxSizing: "border-box", minHeight: 52,
                background: "#fff", border: "1.5px solid rgba(28,43,34,.14)",
                borderRadius: 14, padding: "0 16px", fontSize: 16,
                color: "#193231", outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label htmlFor="qs-phone" style={{ fontSize: 13, fontWeight: 600, color: "#3F4F46" }}>Mobile number</label>
            <div style={{ display: "flex", gap: 9 }}>
              <span style={{
                display: "flex", alignItems: "center", minHeight: 52,
                background: "#fff", border: "1.5px solid rgba(28,43,34,.14)",
                borderRadius: 14, padding: "0 14px", fontSize: 16,
                fontWeight: 600, color: "#3F4F46",
              }}>+91</span>
              <input
                id="qs-phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => { if (e.key === "Enter" && ready) void submit(); }}
                placeholder="10-digit mobile"
                style={{
                  flexGrow: 1, minWidth: 0, boxSizing: "border-box", minHeight: 52,
                  background: "#fff", border: "1.5px solid rgba(28,43,34,.14)",
                  borderRadius: 14, padding: "0 16px", fontSize: 16,
                  color: "#193231", outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
            <span style={{ fontSize: 12, color: "rgba(28,43,34,.55)" }}>
              Your plan is unlocked on this number, so please check it.
            </span>
          </div>

          {error && <p role="alert" style={{ margin: 0, fontSize: 13.5, color: "#B3402F" }}>{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={!ready || busy}
            style={{
              width: "100%", border: 0, borderRadius: 999, padding: 18,
              fontSize: 16.5, fontWeight: 800, fontFamily: "inherit",
              background: "#193231", color: "#F9F7F2",
              cursor: ready && !busy ? "pointer" : "default",
              opacity: ready && !busy ? 1 : .45,
              marginTop: 4,
            }}
          >
            {busy ? "Opening payment..." : "Continue to payment"}
          </button>

          <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.55, textAlign: "center", color: "rgba(28,43,34,.5)" }}>
            Secure payment by Razorpay. By continuing you accept our{" "}
            <a href="/terms-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "#2D5A4E" }}>Terms</a>
            {" and "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#2D5A4E" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}