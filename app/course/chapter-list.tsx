"use client";

// app/course/chapter-list.tsx
// Chapter cards with one "Show more" button: the first click reveals the
// next group, the second reveals the rest, then the button goes away.
// Group sizes come from CHAPTER_GROUPS in content/course.ts.
// Pure ASCII file.

import { useState } from "react";

export type ListChapter = { slug: string; label: string; title: string; withDoctor?: boolean; thumb: boolean };

function Card({ c }: { c: ListChapter }) {
  return (
    <article className="card ch">
      <div className="thumb">
        {c.thumb ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`/course/thumbs/chapter-${c.slug}.webp`} alt="" width={1280} height={720} loading="lazy" />
        ) : (
          <span className="thumb-ph" aria-hidden="true"><small>{c.label}</small>{c.title}</span>
        )}
      </div>
      <div className="ch-body">
        <p className="ch-label">{c.label}</p>
        <h3>{c.title}</h3>
        {c.withDoctor && <span className="who">With Dr. Siddharth Garg</span>}
      </div>
    </article>
  );
}

export default function ChapterList({ chapters, groups }: { chapters: ListChapter[]; groups: number[] }) {
  const stops = [...groups, chapters.length];
  const [step, setStep] = useState(0);
  const visible = chapters.slice(0, stops[step]);
  const remaining = chapters.length - visible.length;
  const nextCount = step + 1 < stops.length ? stops[step + 1] - stops[step] : 0;

  return (
    <div>
      <div className="ch-grid">{visible.map((c) => <Card key={c.slug} c={c} />)}</div>
      {remaining > 0 && (
        <button type="button" className="showmore" onClick={() => setStep((s) => s + 1)} aria-label={`Show ${nextCount} more chapters`}>
          Show more chapters
          <span className="count">+{nextCount}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>
        </button>
      )}
    </div>
  );
}