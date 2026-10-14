"use client";

// app/course/intro-video.tsx
// Hero video for /course. Browsers block autoplay WITH sound until the visitor
// has interacted with the page, so this:
//   1. tries to play with sound (allowed on some desktops for returning visitors)
//   2. if refused, plays muted and shows a "Tap for sound" button
//   3. does not autoplay at all for reduce-motion or data-saver visitors
// Pure ASCII file.

import { useEffect, useRef, useState } from "react";

type Props = { src: string; poster?: string; title?: string };

export default function IntroVideo({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsSound, setNeedsSound] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reduceMotion || saveData) return; // leave it on the poster with normal controls

    let cancelled = false;
    v.muted = false;
    v.play().catch(() => {
      if (cancelled) return;
      // Sound was blocked: fall back to muted autoplay and offer sound.
      v.muted = true;
      setNeedsSound(true); // show the sound button straight away, not after buffering
      v.play().catch(() => {
        // Autoplay fully blocked: poster and normal controls remain.
        if (!cancelled) setNeedsSound(false);
      });
    });
    return () => { cancelled = true; };
  }, []);

  const turnOnSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    if (v.paused) v.play().catch(() => {});
    setNeedsSound(false);
  };

  return (
    <div className="video-wrap">
      <video
        ref={ref}
        className="video"
        controls
        playsInline
        preload="auto"
        poster={poster}
        title={title || "Course introduction"}
        onVolumeChange={(e) => { if (!e.currentTarget.muted) setNeedsSound(false); }}
      >
        <source src={src} type="video/mp4" />
        Your browser cannot play this video.
      </video>
      {needsSound && (
        <button type="button" className="unmute" onClick={turnOnSound}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M15.5 8.5a5 5 0 0 1 0 7"></path>
            <path d="M19 5a10 10 0 0 1 0 14"></path>
          </svg>
          Tap for sound
        </button>
      )}
    </div>
  );
}