// app/psp/[company]/page.tsx
// Company video landing page, e.g. /psp/alkem, /psp/zydus-1.
// Logo lockup (company <-> Lean Protocol), headline, video, then the founder's note and a call button.
// Content lives in content/psp-partners.ts; this template is the same for
// every company.
//
// STYLING. The page carries its own stylesheet (CSS below, every rule under
// .pspco) matching the approved review design, so it does not depend on the
// /psp page's psp.css. Rules are written as `.psp-page .pspco ...` so they win
// over psp.css, which still loads from app/psp/layout.tsx.
//
// Shared by QR code with one company each: noindex, not in the sitemap, and
// an unknown company name is a 404.
//
// Pure ASCII file: symbols are \u escapes.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PSP_DEFAULTS, PSP_PARTNERS, findPartner, isReady } from "@/content/psp-partners";

export const dynamicParams = false;

export function generateStaticParams() {
  return PSP_PARTNERS.map((p) => ({ company: p.slug }));
}

type Props = { params: Promise<{ company: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;
  const p = findPartner(company);
  if (!p) return {};
  const title = `${p.company} x Lean Protocol`;
  return {
    title,
    robots: { index: false, follow: false, nocache: true },
    openGraph: { title, siteName: "Lean Protocol", type: "website", images: ["/og-image.jpg"] },
  };
}

const CSS = `
.psp-page .pspco{background:#F9F7F2;color:#1C2B22;font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.psp-page .pspco *{box-sizing:border-box}
.psp-page .pspco .w{max-width:1096px;margin:0 auto;padding:0 28px}
.psp-page .pspco .hero{background:#F3F1EA;padding:56px 0 64px}
.psp-page .pspco .lock{display:flex;align-items:center;justify-content:center;flex-wrap:nowrap;gap:clamp(10px,3vw,40px);margin:0 0 48px}
.psp-page .pspco .lock .co{height:clamp(56px,14vw,120px);width:auto;max-width:min(420px,34vw);object-fit:contain;flex:0 1 auto;min-width:0}
.psp-page .pspco .lock .co-name{font-weight:800;font-size:clamp(22px,6vw,54px);letter-spacing:-.02em;white-space:nowrap}
.psp-page .pspco .lock .x{width:clamp(40px,8vw,76px);height:auto;color:#2D5A4E;flex:none;display:block}
.psp-page .pspco .lock .lp{height:clamp(64px,16vw,138px);width:auto;flex:none}
.psp-page .pspco h1{font-family:inherit;font-size:clamp(34px,5vw,60px);line-height:1.04;letter-spacing:-.035em;font-weight:800;margin:0 auto;color:#1C2B22;text-transform:none;max-width:24ch;text-align:center;text-wrap:balance}
.psp-page .pspco .band{background:#193231;padding:64px 0}
.psp-page .pspco video{width:100%;height:auto;aspect-ratio:16/9;border-radius:20px;background:#0f1f1e;display:block}
.psp-page .pspco .close{background:#F9F7F2;padding:64px 0 72px}
.psp-page .pspco h2{font-family:inherit;font-size:clamp(26px,3.4vw,40px);line-height:1.15;letter-spacing:-.03em;font-weight:800;margin:0 0 28px;color:#1C2B22;text-transform:none;max-width:none}
.psp-page .pspco .note{max-width:62ch;margin:0;font-family:var(--font-serif,'Libre Baskerville'),'Libre Baskerville',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(18px,2vw,21px);line-height:1.6;color:#2D5A4E}
.psp-page .pspco .regards{margin:28px 0 0;font-size:19px;line-height:1.55;color:rgba(28,43,34,.72)}
.psp-page .pspco .sig{margin:10px 0 0;line-height:1.2;color:#1C2B22}
.psp-page .pspco .sig b{font-weight:800;font-size:clamp(26px,3.2vw,34px);letter-spacing:-.025em}
.psp-page .pspco .sig span{font-weight:400;font-size:clamp(26px,3.2vw,34px);letter-spacing:-.025em}
.psp-page .pspco .cta{text-align:center;margin-top:44px}
.psp-page .pspco .cta a{display:inline-flex;align-items:center;justify-content:center;min-width:min(400px,100%);padding:20px 64px;border-radius:999px;background:#2D5A4E;color:#F9F7F2;font-weight:700;font-size:19px;text-decoration:none;transition:background .2s}
.psp-page .pspco .cta a:hover{background:#193231}
.psp-page .pspco .cta a:focus-visible{outline:3px solid #C8D9A7;outline-offset:3px}
@media (prefers-reduced-motion:reduce){.psp-page .pspco .cta a{transition:none}}
`;

export default async function PspCompanyPage({ params }: Props) {
  const { company } = await params;
  const p = findPartner(company);
  if (!p) notFound();

  const headline = isReady(p.headline) ? p.headline : PSP_DEFAULTS.headline;
  const contentHeading = isReady(p.content?.heading) ? p.content!.heading! : PSP_DEFAULTS.contentHeading;
  const addressee = (isReady(p.addressee) ? p.addressee : PSP_DEFAULTS.addressee).split("{company}").join(p.company);
  const message = PSP_DEFAULTS.message.split("{addressee}").join(addressee).split("{company}").join(p.company);
  const f = PSP_DEFAULTS.founder;
  const phone = isReady(f.phone) ? f.phone.replace(/[^\d+]/g, "") : null;

  return (
    <main id="main" className="pspco">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------- 1. Logos and headline ---------- */}
      <section className="hero">
        <div className="w">
          <div className="lock">
            {p.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="co" src={p.logo} alt={p.company} />
            ) : (
              <span className="co-name">{p.company}</span>
            )}
            {/* Two-way arrow: a partnership that runs both ways. */}
            <svg className="x" viewBox="0 0 48 24" aria-hidden="true" focusable="false">
              <path d="M5 12h38M13 4l-8 8 8 8M35 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lp" src="/logo-cropped.png" alt="Lean Protocol" />
          </div>
          <h1>{headline}</h1>
        </div>
      </section>

      {/* ---------- 2. Company video ---------- */}
      <section className="band" aria-label="Video">
        <div className="w">
          <video
            controls
            playsInline
            /* With a poster, load nothing until play. Without one, load just
               enough to show the opening frame (#t=0.1 makes Safari draw it). */
            preload={p.video.poster ? "none" : "metadata"}
            poster={p.video.poster}
            title={`Lean Protocol for ${p.company}`}
          >
            <source src={p.video.poster ? p.video.src : `${p.video.src}#t=0.1`} type="video/mp4" />
            Your browser cannot play this video.
          </video>
        </div>
      </section>

      {/* ---------- 3. Founder's note and call ---------- */}
      <section className="close">
        <div className="w">
          <h2>{contentHeading}</h2>
          <p className="note">{"\u201C"}{message}{"\u201D"}</p>
          <p className="regards">{PSP_DEFAULTS.signOff}</p>
          <p className="sig">
            <b>{f.name}</b>
            <span>{" \u2014 "}{f.role}</span>
          </p>
          {phone && (
            <div className="cta">
              <a href={`tel:${phone}`}>Call {f.name.split(" ")[0]}</a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}