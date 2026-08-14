"use client";

// components/workshop/certificate.tsx
// Draws the designed background, then overlays only the participant's name
// (and optionally the date and a signature). Everything happens on a canvas
// in the browser, so 300 people generate 300 certificates with no server
// involvement.
//
// Assets:
//   /public/workshop/certificate-bg.png   required - the designed template
//   /public/workshop/signature.png        optional - transparent PNG, drawn
//                                         above the signature rule if present
//
// Positions are fractions of the image height, so they hold if the template
// is re-exported at a different resolution.

import { useEffect, useRef, useState } from "react";

const NAME_Y = 0.46; // baseline, in the clear space inside the wreath
const DATE_Y = 0.515; // small date under the name
const SIGN_BOTTOM_Y = 0.845; // just above the printed signature rule
const NAME_MAX_WIDTH = 0.66; // of canvas width
const DARK = "#193231";
const MUTED = "rgba(28,43,34,0.55)";

const SHOW_DATE = true; // set false to print the name alone

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function Certificate({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const [bg, sign, logo] = await Promise.all([
        loadImage("/workshop/certificate-bg.png"),
        loadImage("/workshop/signature.png"),
        loadImage("/logo.png"),
      ]);
      if (cancelled) return;

      if (!bg) {
        setFailed(true);
        return;
      }

      const W = bg.naturalWidth;
      const H = bg.naturalHeight;
      canvas.width = W;
      canvas.height = H;

      ctx.drawImage(bg, 0, 0, W, H);
      ctx.textAlign = "center";

      // ---- company logo, above the title ----
      if (logo) {
        const lw = W * 0.13;
        const lh = (logo.naturalHeight / logo.naturalWidth) * lw;
        ctx.drawImage(logo, (W - lw) / 2, H * 0.075, lw, lh);
      }

      // ---- participant name ----
      // Shrinks to fit rather than overflowing the wreath on long names.
      let size = Math.round(H * 0.082);
      const maxW = W * NAME_MAX_WIDTH;
      const font = (px: number) => "700 " + px + 'px Georgia, "Times New Roman", serif';

      ctx.font = font(size);
      while (ctx.measureText(name).width > maxW && size > Math.round(H * 0.035)) {
        size -= 2;
        ctx.font = font(size);
      }

      ctx.fillStyle = DARK;
      ctx.fillText(name, W / 2, H * NAME_Y);

      // ---- date ----
      if (SHOW_DATE) {
        const dateStr = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        ctx.fillStyle = MUTED;
        ctx.font =
          "400 " + Math.round(H * 0.026) + 'px Georgia, "Times New Roman", serif';
        ctx.fillText(dateStr, W / 2, H * DATE_Y);
      }

      // ---- signature, if the asset exists ----
      if (sign) {
        const sw = W * 0.2;
        const sh = (sign.naturalHeight / sign.naturalWidth) * sw;
        ctx.drawImage(sign, (W - sw) / 2, H * SIGN_BOTTOM_Y - sh, sw, sh);
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [name]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safe =
      name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "certificate";
    const link = document.createElement("a");
    link.download = "Lean-Protocol-Certificate-" + safe + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (failed) {
    return (
      <div className="rounded-[18px] border border-[#f3c2c2] bg-[#fdf1f1] p-6 text-center">
        <p className="text-[15px] text-[#a02525]">
          The certificate template could not be loaded. Please contact the
          workshop team, who can issue it manually.
        </p>
        <button
          onClick={onBack}
          className="mt-4 text-[14px]"
          style={{ color: "rgba(28,43,34,0.6)" }}
        >
          Back to results
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 text-center">
        <h2 className="text-[22px] font-extrabold">Your certificate</h2>
        <p className="mt-1 text-[14px]" style={{ color: "rgba(28,43,34,0.6)" }}>
          Download it now while your session is active.
        </p>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[rgba(28,43,34,0.14)] bg-white shadow-[0_18px_44px_rgba(25,50,49,0.14)]">
        <canvas ref={canvasRef} className="block h-auto w-full" />
      </div>

      <button
        onClick={download}
        disabled={!ready}
        className="mt-5 w-full rounded-full py-[16px] text-[16.5px] font-extrabold text-white disabled:opacity-50"
        style={{ background: "#2D5A4E" }}
      >
        {ready ? "Download certificate" : "Preparing\u2026"}
      </button>

      <button
        onClick={onBack}
        className="mt-3 w-full text-center text-[14px]"
        style={{ color: "rgba(28,43,34,0.6)" }}
      >
        Back to results
      </button>
    </div>
  );
}
