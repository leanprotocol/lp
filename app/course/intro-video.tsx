"use client";

// app/course/intro-video.tsx
//
// The intro is hosted on YouTube, not on this server. It used to be a 20.5 MB
// file in public/, and with preload="auto" every visitor downloaded the whole
// thing: 8.7K requests and 75 GB in twelve hours, which paused the Vercel
// deployment in October 2026. Even compressed and without preload it was still
// 88% of all bandwidth, because people do watch it.
//
// This is a click-to-load embed, not a plain iframe. The poster is a local
// image; YouTube's player is only fetched when someone presses play. So:
//   - a visitor who does not watch costs a few KB, not a video
//   - YouTube sets no cookies and runs no tracking until there is a click
//   - the page stays fast, since the embed script is ~100 KB on its own
//
// youtube-nocookie.com is used for the same reason.
// Pure ASCII file.

import { useState } from "react";
import { COURSE } from "@/content/course";

type Props = { poster?: string; title?: string };

export default function IntroVideo({ poster, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const id = COURSE.intro.youtubeId;
  const still = poster || COURSE.intro.poster;
  const label = title || "Watch the introduction";

  if (!id) return null;

  return (
    <div className="video-wrap">
      {playing ? (
        <iframe
          className="video"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video facade" onClick={() => setPlaying(true)} aria-label={label}>
          <img src={still} alt="" loading="lazy" decoding="async" />
          <span className="facade-play" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </span>
          <span className="facade-label">{label}</span>
        </button>
      )}
    </div>
  );
}