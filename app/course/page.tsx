// app/course/page.tsx
// GLP weight loss master class landing page. The course is watched in the
// Lean Protocol app; buying (Rs 99) happens at /course/checkout.
//
// Copy and settings: content/course.ts. Images and video: public/course/.
// Own stylesheet (every rule under .lpc) so site-wide styles cannot change it.
// Pure ASCII file: symbols are \u escapes.

import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  ABOUT, ACHIEVE, CHAPTERS, CHAPTER_GROUPS, COMPANY, COURSE, FAQ, GLANCE, INSTRUCTORS, OFFER, isReady,
} from "@/content/course";
import IntroVideo from "./intro-video";
import OfferCountdown from "./offer-countdown";
import OfferTimer from "./offer-timer";
import ChapterList from "./chapter-list";
import AttributionCapture from "./attribution";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "The GLP Weight Loss Master Class | Lean Protocol",
  description:
    "13 video chapters on GLP weight loss by a senior health coach and a physician, on the Lean Protocol app. The full master class for Rs 99.",
  alternates: { canonical: "https://www.leanprotocol.in/course" },
  openGraph: {
    title: "The GLP Weight Loss Master Class | Lean Protocol",
    description: "13 video chapters on the Lean Protocol app. The full master class for Rs 99.",
    url: "https://www.leanprotocol.in/course",
    siteName: "Lean Protocol",
    type: "website",
    images: [COURSE.intro.poster],
  },
};

const RUPEE = "\u20b9";
const DOT = "\u00b7";

const CSS = `
.lpc{font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif;color:#1C2B22;background:#F9F7F2;line-height:1.5;-webkit-font-smoothing:antialiased}
.lpc *{box-sizing:border-box}
.lpc a{color:inherit}
.lpc .w{max-width:1240px;margin:0 auto}
.lpc .serif{font-family:var(--font-serif,'Libre Baskerville'),'Libre Baskerville',Georgia,serif;font-style:italic;font-weight:400}
.lpc .eyebrow{margin:0;font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#2D5A4E}
.lpc .dark .eyebrow{color:#C8D9A7}
.lpc h1,.lpc h2,.lpc h3{font-family:inherit;margin:0;text-transform:none}
.lpc h2{font-size:clamp(28px,3.4vw,42px);line-height:1.12;letter-spacing:-.03em;font-weight:800}
.lpc h2 .serif{color:#2D5A4E}.lpc .dark h2 .serif{color:#C8D9A7}
.lpc .muted{color:#4A5A52}
.lpc .card{background:#fff;border:1px solid rgba(28,43,34,.1);border-radius:22px}
.lpc .sec{padding:88px 24px}
.lpc .dark{background:#193231;color:#F9F7F2}
.lpc .tint{background:#F3F1EA}
.lpc .pill{display:inline-flex;align-items:center;justify-content:center;min-height:44px;border-radius:999px;font-weight:800;text-decoration:none}
.lpc .stack{display:flex;flex-direction:column}
/* header */
.lpc .hdr{background:#193231;padding:18px 24px}
.lpc .hdr .w{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.lpc .brand{display:flex;align-items:center;gap:10px;color:#F9F7F2;text-decoration:none;font-weight:800;font-size:18px}
.lpc .brand img{height:38px;width:auto}
.lpc .nav{display:flex;gap:24px;align-items:center;flex-wrap:wrap}
.lpc .nav a{color:#C8D9A7;text-decoration:none;font-weight:600;font-size:15px}
.lpc .nav .pill{background:#C8D9A7;color:#193231;padding:12px 22px}
/* hero */
.lpc .hero{padding:56px 24px 88px}
.lpc .hero .w{display:flex;flex-direction:column;gap:36px}
.lpc .hero-head{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}
.lpc h1{font-size:clamp(38px,5.4vw,68px);line-height:1.03;letter-spacing:-.035em;font-weight:800;max-width:18ch}
.lpc h1 .serif{color:#C8D9A7}
.lpc .hero-sub{margin:0;font-size:19px;color:#C9D6D1;max-width:62ch}
.lpc .hero-sub b{color:#F9F7F2}
.lpc .video-wrap{position:relative}
.lpc .video{width:100%;aspect-ratio:16/9;border-radius:24px;background:#0F1F1E;border:1px solid rgba(200,217,167,.18);display:block}
.lpc .unmute{position:absolute;left:50%;bottom:72px;transform:translateX(-50%);display:inline-flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#C8D9A7;color:#193231;font:inherit;font-weight:800;font-size:17px;padding:14px 24px;border-radius:999px;box-shadow:0 12px 32px rgba(0,0,0,.35);min-height:48px}
.lpc .stores{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.lpc .store{display:inline-flex;align-items:center;gap:12px;background:#C8D9A7;color:#193231;text-decoration:none;padding:12px 24px;border-radius:16px;min-height:56px}
.lpc .store:hover{background:#d6e4b9}
.lpc .store small{display:block;font-size:12px;font-weight:600;line-height:1.1}
.lpc .store b{display:block;font-size:18px;font-weight:800;line-height:1.15}
.lpc .hero-note{margin:0;text-align:center;font-size:15px;color:#C9D6D1}
/* achieve */
.lpc .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.lpc .ach{padding:28px;display:flex;flex-direction:column;gap:10px}
.lpc .ach .no{font-size:15px;font-weight:800;color:#C8D9A7;background:#193231;width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center}
.lpc .ach h3{font-size:21px;line-height:1.25;font-weight:800;letter-spacing:-.015em}
.lpc .ach p{margin:0}
/* about */
.lpc .about .w{display:flex;gap:56px;flex-wrap:wrap}
.lpc .about-text{flex:1 1 460px;min-width:0;display:flex;flex-direction:column;gap:18px}
.lpc .about-text p{margin:0;font-size:18px}
.lpc .ticks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.lpc .ticks li{display:flex;gap:12px;align-items:flex-start;font-size:18px;font-weight:600}
.lpc .tick{flex:none;width:26px;height:26px;border-radius:999px;background:#2D5A4E;color:#F9F7F2;display:flex;align-items:center;justify-content:center;margin-top:1px}
.lpc .glance{flex:1 1 360px;min-width:0;align-self:stretch;padding:30px 32px;display:flex;flex-direction:column;gap:14px;border-radius:24px}
.lpc .glance ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;flex:1;justify-content:space-between}
.lpc .glance li{display:flex;align-items:center;gap:0;padding:14px 0;border-top:1px solid rgba(28,43,34,.12)}
.lpc .glance li:first-child{border-top:0}
.lpc .glance b{flex:none;width:200px;padding-right:18px;font-size:32px;font-weight:800;letter-spacing:-.03em;color:#2D5A4E;line-height:1.15;white-space:nowrap}
/* a long value (e.g. "Community") shrinks to fit its column instead of wrapping */
.lpc .glance b.long{font-size:clamp(18px,1.95vw,27px)}
.lpc .glance span{color:#4A5A52;font-size:16px;padding-left:18px;border-left:1.5px solid rgba(28,43,34,.15);align-self:stretch;display:flex;align-items:center}
/* instructors */
.lpc .people{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}
.lpc .person{overflow:hidden;border-radius:28px;display:flex;flex-direction:column}
.lpc .person img{width:100%;aspect-ratio:4/3;object-fit:cover;object-position:center top;display:block;background:#B49A6C}
.lpc .person div{padding:28px 30px 32px;display:flex;flex-direction:column;gap:8px}
.lpc .person h3{font-size:28px;line-height:1.15;letter-spacing:-.025em;font-weight:800}
.lpc .person .role{margin:0;font-size:17px;font-weight:600;color:#2D5A4E}
.lpc .person .bio{margin:8px 0 0;font-size:17px;color:#4A5A52}
/* chapters */
.lpc .ch-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
@media (max-width:1100px){.lpc .ch-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:620px){.lpc .ch-grid{grid-template-columns:minmax(0,1fr)}}
.lpc .ch{overflow:hidden;display:flex;flex-direction:column}
.lpc .thumb{position:relative;aspect-ratio:16/9;background:#193231}
.lpc .thumb img{width:100%;height:100%;object-fit:cover;display:block}
.lpc .thumb-ph{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:20px 22px;color:#F9F7F2;font-weight:800;font-size:18px;line-height:1.2;letter-spacing:-.02em;background:radial-gradient(120% 120% at 85% 20%,#2D5A4E 0%,#193231 60%)}
.lpc .thumb-ph small{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#C8D9A7}
.lpc .ch-body{padding:18px 22px 22px;display:flex;flex-direction:column;gap:6px}
.lpc .ch-label{margin:0;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2D5A4E}
.lpc .ch-body h3{font-size:17px;line-height:1.3;font-weight:800}
.lpc .who{align-self:flex-start;margin-top:4px;background:rgba(45,90,78,.1);color:#2D5A4E;font-weight:700;font-size:12px;padding:4px 10px;border-radius:999px}
.lpc .showmore{display:flex;align-items:center;justify-content:center;gap:10px;margin:22px auto 0;border:0;cursor:pointer;background:#193231;color:#F9F7F2;font:inherit;font-weight:800;font-size:16px;padding:15px 28px;border-radius:999px;min-height:48px}
.lpc .showmore:hover{background:#2D5A4E}
.lpc .showmore .count{background:#C8D9A7;color:#193231;border-radius:999px;padding:2px 10px;font-size:13px}
/* offer */
.lpc .offer{position:relative;overflow:hidden;background:radial-gradient(90% 120% at 50% 0%,#2D5A4E 0%,#193231 55%,#0F1F1E 100%)}
.lpc .offer .w{max-width:880px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:26px}
.lpc .offer h2{font-size:clamp(34px,4.6vw,56px)}
.lpc .offer-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;text-align:left;width:100%;max-width:640px}
.lpc .offer-list li{display:flex;gap:14px;align-items:flex-start;font-size:19px;font-weight:600;color:#F9F7F2}
.lpc .offer-list .tick{background:#3FA34D;width:30px;height:30px}
.lpc .price{width:100%;max-width:640px;background:#F9F7F2;color:#193231;border-radius:24px;padding:26px 28px;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.lpc .price .was{font-size:22px;font-weight:700;color:#7A867F}
.lpc .price .was s{text-decoration-thickness:2px}
.lpc .price .now{font-size:clamp(56px,8vw,80px);font-weight:800;letter-spacing:-.04em;line-height:1}
.lpc .price .tag{font-size:15px;font-weight:700;color:#2D5A4E}
.lpc .buy{width:100%;max-width:640px;background:#C8D9A7;color:#193231;font-size:20px;padding:20px 28px}
.lpc .buy:hover{background:#d6e4b9}
.lpc .countdown{display:flex;flex-direction:column;align-items:center;gap:4px}
.lpc .cd-label{margin:0;font-size:13px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#FF7A7A}
.lpc .cd-time{margin:0;font-variant-numeric:tabular-nums;color:#FF5A5A;display:flex;align-items:baseline;gap:4px}
.lpc .cd-time b{font-size:40px;font-weight:800;letter-spacing:-.02em}
.lpc .cd-time small{font-size:15px;font-weight:700;margin-right:10px}
.lpc .cd-valid{margin:0;font-size:15px;font-weight:700;color:#FF9A9A}
/* get the app */
.lpc .getapp .w{max-width:1040px;display:flex;gap:48px;flex-wrap:wrap;align-items:center;justify-content:space-between}
/* faq */
.lpc details.qa{background:#fff;border-radius:18px;padding:20px 24px}
.lpc details.qa summary{cursor:pointer;list-style:none;font-weight:700;font-size:17px}
.lpc details.qa summary::-webkit-details-marker{display:none}
.lpc details.qa p{margin:12px 0 0;color:#4A5A52}
/* footer */
.lpc .ftr{background:#0F1F1E;color:#A8BEB7;padding:56px 24px 40px}
.lpc .ftr .cols{display:flex;gap:40px;flex-wrap:wrap;justify-content:space-between}
.lpc .ftr h4{margin:0 0 12px;color:#F9F7F2;font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
.lpc .ftr-brand{max-width:340px}
.lpc .ftr-brand img{height:44px;width:auto;margin-bottom:12px}
.lpc .ftr p{margin:0 0 6px;font-size:14px}
.lpc .ftr a{color:#C8D9A7;text-decoration:none}
.lpc .ftr a:hover{text-decoration:underline}
.lpc .social{display:flex;gap:10px;flex-wrap:wrap}
.lpc .social a{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(200,217,167,.3);border-radius:999px;padding:8px 14px;font-weight:700;font-size:14px;min-height:40px}
.lpc .ftr .legal{border-top:1px solid rgba(200,217,167,.15);margin-top:32px;padding-top:24px}
.lpc .ftr .legal p{font-size:13px;max-width:90ch}
/* phone-only sticky bar */
.lpc .mcta{display:none}
@media (max-width:720px){
  .lpc .mcta{display:flex;position:fixed;left:12px;right:12px;bottom:12px;z-index:50;align-items:center;justify-content:space-between;gap:12px;background:#C8D9A7;color:#193231;text-decoration:none;padding:12px 14px 12px 22px;border-radius:999px;box-shadow:0 12px 32px rgba(15,31,30,.35);min-height:56px}
  .lpc .ftr{padding-bottom:110px}
  .lpc .nav a:not(.pill){display:none}
  .lpc .glance{padding:24px 20px}
  .lpc .glance b{width:112px;padding-right:12px;font-size:22px}
  .lpc .glance b.long{font-size:17px}
  .lpc .glance span{padding-left:12px;font-size:14.5px}
  .lpc .glance span{padding-left:12px}
}
.lpc a:focus-visible,.lpc summary:focus-visible,.lpc button:focus-visible{outline:3px solid #C8D9A7;outline-offset:3px}
`;

const Tick = () => (
  <span className="tick" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
  </span>
);

function StoreButtons() {
  const items = [
    { name: "App Store", icon: <rect x="6" y="2" width="12" height="20" rx="2.5"></rect> },
    { name: "Google Play", icon: <path d="M5 3.5v17l14-8.5z"></path> },
  ];
  return (
    <div className="stores">
      {items.map((s) => (
        <a key={s.name} className="store" href={COURSE.checkoutPath}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#193231" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
          <span><small>Avail it on</small><b>{s.name}</b></span>
        </a>
      ))}
    </div>
  );
}

function hasThumb(slug: string) {
  return existsSync(join(process.cwd(), "public", "course", "thumbs", `chapter-${slug}.webp`));
}

export default function CoursePage() {
  const price = `${RUPEE}${COURSE.priceInr}`;
  const chapters = CHAPTERS.map((c) => ({ ...c, thumb: hasThumb(c.slug) }));
  const socials = Object.entries(COMPANY.social).filter(([, url]) => isReady(url));
  const socialName: Record<string, string> = { instagram: "Instagram", youtube: "YouTube", linkedin: "LinkedIn", facebook: "Facebook", x: "X" };

  return (
    <main className="lpc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <AttributionCapture />

      <header className="hdr">
        <div className="w">
          <a href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-cropped.png" alt="" />
            Lean Protocol
          </a>
          <nav className="nav" aria-label="Master class page">
            <a href="#chapters">Chapters</a>
            <a href="#offer">Offer</a>
            <a href={COURSE.checkoutPath} className="pill">Get it for {price}</a>
          </nav>
        </div>
      </header>

      <section className="hero dark" id="top">
        <div className="w">
          <div className="hero-head">
            <h1>The GLP weight loss <span className="serif">master class.</span></h1>
            <p className="hero-sub">
              Exclusively by <b>Abhinav Dobrial</b>, senior health coach, and <b>Dr. Siddharth Garg</b>, MBBS, MD (Internal Medicine).
            </p>
          </div>
          <IntroVideo src={COURSE.intro.video} poster={COURSE.intro.poster} title="Master class introduction" />
          <StoreButtons />
          <p className="hero-note">The full master class for {price}, watched in the Lean Protocol app.</p>
        </div>
      </section>

      <section className="sec" style={{ paddingBottom: 24 }}>
        <div className="w stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 10 }}>
            <p className="eyebrow">Outcomes</p>
            <h2>What you will <span className="serif">achieve.</span></h2>
          </div>
          <div className="grid3">
            {ACHIEVE.map((a, i) => (
              <div className="card ach" key={a.title}>
                <span className="no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec about" id="about">
        <div className="w">
          <div className="about-text">
            <p className="eyebrow">About the master class</p>
            <h2>{ABOUT.heading.replace(" involves", "")} <span className="serif">involves.</span></h2>
            <p className="muted">{ABOUT.lead}</p>
            <ul className="ticks">
              {ABOUT.points.map((p) => <li key={p}><Tick />{p}</li>)}
            </ul>
          </div>
          <aside className="card glance" aria-label="At a glance">
            <p className="eyebrow">At a glance</p>
            <ul>
              {GLANCE.filter((g) => isReady(g.big)).map((g) => (
                <li key={g.big}><b className={g.big.length > 7 ? "long" : undefined}>{g.big}</b><span>{g.text}</span></li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="sec" id="instructors" style={{ paddingTop: 0 }}>
        <div className="w stack" style={{ gap: 32 }}>
          <div className="stack" style={{ gap: 10 }}>
            <p className="eyebrow">Your instructors</p>
            <h2>Built by the people <span className="serif">who run the programme.</span></h2>
          </div>
          <div className="people">
            {INSTRUCTORS.map((p) => (
              <article className="card person" key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.photo} alt={p.name} width={1200} height={900} loading="lazy" />
                <div>
                  <h3>{p.name}</h3>
                  <p className="role">{p.role}</p>
                  <p className="bio">{p.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec tint" id="chapters">
        <div className="w stack" style={{ gap: 32 }}>
          <div className="stack" style={{ gap: 10 }}>
            <p className="eyebrow">Course chapters</p>
            <h2>What you will learn, <span className="serif">chapter by chapter.</span></h2>
          </div>
          <ChapterList chapters={chapters} groups={CHAPTER_GROUPS} />
        </div>
      </section>

      <section className="sec dark offer" id="offer">
        <div className="w">
          <p className="eyebrow">In summary</p>
          <h2>{OFFER.heading}</h2>
          <ul className="offer-list">
            {OFFER.points.map((p) => <li key={p}><Tick />{p}</li>)}
          </ul>
          <div className="price">
            {OFFER.mrpInr > COURSE.priceInr && <span className="was">MRP <s>{RUPEE}{OFFER.mrpInr}</s></span>}
            <span className="now">{price} <span style={{ fontSize: 22, fontWeight: 700 }}>only</span></span>
            <span className="tag">One-time payment {DOT} full master class</span>
          </div>
          <OfferTimer />
          <a href={COURSE.checkoutPath} className="pill buy">Get the master class for {price}</a>
          <OfferCountdown endsAt={OFFER.endsAt} />
        </div>
      </section>

      <section className="sec dark getapp" id="get-app">
        <div className="w">
          <div className="stack" style={{ flex: "1 1 420px", minWidth: 0, gap: 18 }}>
            <h2>The course lives in <span className="serif">the Lean Protocol app.</span></h2>
            <p style={{ margin: 0, fontSize: 18, color: "#C9D6D1" }}>Pay once here, then sign in to the app with the same mobile number to watch every chapter.</p>
            <div style={{ display: "flex" }}><StoreButtons /></div>
          </div>
        </div>
      </section>

      <section className="sec tint">
        <div className="w stack" style={{ maxWidth: 820, gap: 14 }}>
          <h2 style={{ marginBottom: 12 }}>Questions</h2>
          {FAQ.map((f) => (
            <details className="qa" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="ftr">
        <div className="w">
          <div className="cols">
            <div className="ftr-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-cropped.png" alt="Lean Protocol" />
              <p>{COMPANY.tagline}</p>
              <p><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
              {isReady(COMPANY.phone) && <p><a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`}>{COMPANY.phone}</a></p>}
              {isReady(COMPANY.address) && <p>{COMPANY.address}</p>}
              {socials.length > 0 && (
                <div className="social" style={{ marginTop: 10 }}>
                  {socials.map(([k, url]) => <a key={k} href={url} target="_blank" rel="noopener noreferrer">{socialName[k] || k}</a>)}
                </div>
              )}
            </div>
          </div>
          <div className="legal">
            <p>This master class is for education only and is not medical advice. Lean Protocol is not affiliated with Novo Nordisk A/S or Eli Lilly &amp; Co. GLP medications are prescription-only and are dispensed solely when a licensed physician determines they are clinically appropriate. Results vary and are not guaranteed.</p>
            <p style={{ marginTop: 8 }}>{"\u00a9"} 2026 {COMPANY.legalName}</p>
          </div>
        </div>
      </footer>

      <a className="mcta" href={COURSE.checkoutPath}>
        <span className="stack" style={{ lineHeight: 1.2 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Get the master class</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Full course {DOT} {price} only</span>
        </span>
        <span style={{ width: 40, height: 40, borderRadius: 999, background: "#193231", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8D9A7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
        </span>
      </a>
    </main>
  );
}