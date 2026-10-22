"use client";

// app/course/intro-video.tsx
// Hero video for /course.
//
// BANDWIDTH: this file previously used preload="auto" so the video could
// autoplay. That made every visitor download the whole file: in one 12-hour
// window, 8.7K requests for a 20.5 MB video used 75 GB and paused the Vercel
// deployment. Autoplay is gone. The browser now fetches only metadata, and
// the file is downloaded when someone actually presses play.
//
// The poster is shown until then, with a play button over it.
// Pure ASCII file.

import { useRef, useState } from "react";

type Props = { src: string; poster?: string; title?: string };

export default function IntroVideo({ src, poster, title }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => {
      /* If the browser refuses, the native controls are still there. */
    });
  };

  return (
    <div className="video-wrap">
      <video
        ref={ref}
        className="video"
        controls
        playsInline
        /* metadata only: a few KB until the visitor presses play */
        preload="metadata"
        poster={poster}
        title={title || "Course introduction"}
        onPlay={() => setStarted(true)}
      >
        <source src={src} type="video/mp4" />
        Your browser cannot play this video.
      </video>

      {!started && (
        <button type="button" className="play-btn" onClick={play} aria-label="Play the course introduction">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
          <span>Watch the introduction</span>
        </button>
      )}
    </div>
  );
}
