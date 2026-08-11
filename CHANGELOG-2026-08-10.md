# Change log - 8 to 10 August 2026

Everything that changed across the homepage redesign, the funnel rebuild and
the claims pass. Written so the next person can see what moved and why,
without reading the diff.

---

## 1. Homepage rebuilt to the new design

Nine section components were **rewritten in place**. No new folders, no new
routes - `app/page.tsx` imports the same names it always did.

| File | Now renders |
|---|---|
| `components/hero.tsx` | "GET / LEANER." outlined wordmark, Ken Burns backdrop, three floating polaroids, ticker |
| `components/parallax-journey.tsx` | 560vh sticky, five cross-fading steps, fractional progress rail |
| `components/video-section.tsx` | Explainer video, three trust pills |
| `components/stats-section.tsx` | Four 3D-tilted metric cards |
| `components/testimonials-carousel.tsx` | 320vh sticky horizontal film strip, eight members |
| `components/weight-slider.tsx` | Slider plus two chart views behind a toggle |
| `components/pricing-carousel.tsx` | Three plan cards, prices read live from the database |
| `components/news-section.tsx` | Six press logos, `variant` prop added |
| `components/doctor-testimonial.tsx` | Ten-expert marquee |
| `components/benefits-marquee.tsx` | Two opposing marquees |
| `components/header.tsx` | Transparent, turning solid past 40px |
| `components/footer.tsx` | Closing CTA, four nav columns, legal block |
| `components/weight-loss-chart.tsx` | Original Recharts structure, retinted for dark |

**`app/page.tsx`** was reordered only. Section sequence is now:

```
Header - Hero - Journey - Video - Stats - Results - Estimate
       - Chart - Pricing - Press - Experts - Benefits - Footer
```

Dropped from the page but still imported: `InsuranceLogos`, `CausesSection`,
`MobileStatsCard`. `StatsSection` covers what the last of those did.

### New: `content/home-v2.ts`

Every homepage string now lives in one file with no JSX in it. A copy change
is a one-line edit that a non-developer can locate.

Four rules stated at the top of the file:

1. No prices - those come from the database
2. No JSX
3. A claim carrying `*` keeps its note in the same block
4. Pure ASCII, `\u` escapes for symbols

---

## 2. Decisions worth knowing

### Pricing reads the database, not the design

The delivered design hardcoded `4,999`, `21,998` and `43,998` as strings.
`pricing-carousel.tsx` reads `/api/plans` instead - the same source checkout
uses - so a price edited in the admin panel cannot leave the homepage showing
the old one. `content/home-v2.ts` holds presentation only: the tilt per card,
which is featured, and the ribbon text, keyed by plan name.

### Scroll effects are JS, not CSS view-timeline

The export used `animation-timeline: view()`, which Safari and Firefox do not
support. Both scroll-driven sections read scroll position in JS and throttle
with `requestAnimationFrame`, so they work everywhere and do not thrash on
mobile.

### `news-section.tsx` took a variant rather than a rewrite

It is imported by `components/affiliate-lp/page.tsx` and
`components/mounjaro-lp/page.tsx` as well as the homepage. It now takes
`variant?: "light" | "dark"` defaulting to `"light"`, so both campaign pages
render exactly as before without being edited. The homepage passes `"dark"`.

### Every animation has a reduced-motion path

The export had none. Ken Burns, glows, floats, all four marquees, the 3D card
tilt and the slider hint all stop under `prefers-reduced-motion: reduce`.

---

## 3. Mobile

Three sections broke when narrowed, and were fixed rather than hidden:

| Section | Problem | Fix |
|---|---|---|
| Journey | Image at `min(72vh,640px)` plus stacked copy pushed the text out of a viewport-height sticky container | Image drops to `min(28vh,220px)` under 768px, type scales down, desktop restored by media query |
| Stats | Four square cards at one per row made the section four screens tall | 2x2 grid at 5:4 ratio; 3D tilt flattens under 640px, where it reads as a rendering fault |
| Pricing | Rotated cards look broken when stacked vertically | Tilt applies from 768px only, via a CSS variable rather than an inline transform |

The hero polaroids were initially hidden below `md`. They now render at
74-104px at 82% opacity, framing the wordmark rather than covering it.

---

## 4. The `/users` funnel

Rebuilt from a separate design file. Twelve steps: intro, six questions,
loading, projection, BMI, register, done.

**Interactive projection chart.** Crosshair, a gold marker riding the curve,
and a tooltip showing interpolated weight and month. The readout samples the
same easing function the path is drawn from, so the marker sits exactly on the
line. Touch is wired alongside mouse with `touch-action: none`.

**BMI content is per band.** Five bands, each with its own lead, explanation
and two bullets. An earlier version repeated one paragraph for every result.

**The funnel ends at the thank-you screen.** No onward link by design.

**Policy pages** at `/users/privacy` and `/users/terms`, from
`app/users/policies-content.ts`. These are scoped to the enquiry form and are
deliberately **not** the site-wide policies.

**Served at `forms.leanprotocol.in`** through a `beforeFiles` rewrite. The
plain array form runs after filesystem routing, so `/` resolves to the
homepage and the rule never fires - `beforeFiles` is required, not stylistic.

---

## 5. Claims pass

Nine fixes across six files. Full register in `CONTENT-MAP.md` section 6.

| Was | Now | Where |
|---|---|---|
| "Proven science, guaranteed results." | "Science-led care, measured every step." | `affiliate-lp/social-proof.tsx` |
| "Our GLP-1 protocol is clinically proven to help you lose up to 22%..." | "In clinical studies, GLP-1 therapy has supported weight reduction of up to 22%... Individual results vary." | `affiliate-lp/social-proof.tsx` |
| "Real results, sustained for life" | "Real results, built to last" | `affiliate-lp/process-guarantee.tsx` |
| "GLP-1 is the only clinically proven weight loss solution that works if your BMI is above 27" | "GLP-1 therapy is one of the treatment options a doctor may consider at a BMI above 27, alongside a related condition" | `news-ribbon.tsx` |
| Title: "Clinically Proven Weight Loss for India" | "Doctor-Led Weight Care for India" | `app/layout.tsx` |
| Meta: "Lose 15-22% body weight" | "...where clinically appropriate. Results vary." | `app/layout.tsx` |
| Title: "India's #1 GLP-1 Medical Weight Loss Program" | "Doctor-Led GLP-1 Weight Management" | `app/lp/[ref]/page.tsx` |
| Meta: "backed by Alkem... Guaranteed 10%... or full refund. Plans from [mojibake]5,999" | "...may qualify for a refund review; terms apply. Results vary. Plans from Rs 4,999." | `app/lp/[ref]/page.tsx` |
| Meta: "Guaranteed 10% weight loss in 6 months or full refund" | "...may qualify for a refund review; terms apply." | `app/gip/page.tsx` |

Four distinct problems were in that one affiliate metadata line: a superiority
claim, a guarantee, a third-party endorsement, and a corrupted rupee sign next
to a price (5,999) that matches no plan in the database.

**Metadata uses `Rs`, not a rupee character.** Metadata is plain text, so
`&#8377;` will not render there, and a literal symbol is what got corrupted in
the first place.

---

## 6. Analytics

Removed 3 August at the company's request:

- Google Tag Manager `GTM-MTB6D4CQ`
- Google Analytics 4 `G-SN2P6LQBHW`

Kept: Vercel Analytics, Microsoft Clarity `wa6e7p1xur`.

Added: Google Ads conversion tag `AW-18352829434`, **scoped to `/users` only**
in `app/users/layout.tsx`, not the root layout.

**The Meta Pixel is not in this codebase.** ID `2207593576706808` fires from
inside the GTM container. Removing GTM stops it loading here, but the tag
still exists and must be paused at tagmanager.google.com and republished.

---

## 7. Still open

| Item | Note |
|---|---|
| Meta Pixel | Pause the tag in `GTM-MTB6D4CQ` and Submit |
| `/challenge` | Enabled, but `challenge.leanprotocol.in` DNS was never added |
| Challenge checkout | `FIXED_PRICE = 399` in the page against the server amount in `create-order` - verify before any traffic |
| Challenge lead form | Posts `source: "30day-glp1-campaign-lp2"`, overriding the route default; `email` is in state with no input |
| Supabase env vars | Absent, so `/innovation` contact logs to console and returns success |
| Plan matching | `/lp/[ref]` and `/gip` match plans by first word, so "Lean Start", "Lean Pro" and "Lean Champion" all collide on "lean" - can charge for the wrong plan |
| Lean Champion | Priced 43,998.99; description contains mojibake and an unqualified money-back guarantee. Fix in `/admin/plans` |
| Backups | `.bak` and `.bak2` files from the encoding repair and today's scripts need deleting before commit |
| `hero-section.tsx.bak2` | Stale, in `components/affiliate-lp/` |
| Stale files | Ten listed in `ARCHITECTURE.md` section 4 housekeeping |
