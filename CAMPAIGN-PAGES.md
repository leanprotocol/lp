# Affiliate & Mounjaro Pages — Architecture and Content

`/lp/[ref]` (the Abhi page) and `/gip` (formerly `/mounjaro`).

**Last updated:** 6 August 2026

---

## 1. The central fact

These are **not two pages**. They are one set of five components rendered
twice with different props.

```
components/affiliate-lp/
  hero-section.tsx        ─┐
  social-proof.tsx         │
  process-guarantee.tsx    ├── shared by BOTH pages
  social-trust.tsx         │
  eligibility-faq.tsx     ─┘
  doctor-consult.tsx       ← in the folder, imported by NEITHER
  page.tsx                 ← composition A: affiliate

components/mounjaro-lp/
  page.tsx                 ← composition B: Mounjaro, imports from affiliate-lp
```

**A change to any of the five shared components changes both pages.** A fix
helps both; a regression breaks both. This is the single most important thing
to know before editing either.

---

## 2. Route wiring

| Route | File | Status |
|---|---|---|
| `/lp/[ref]` | `app/lp/[ref]/page.tsx` | **Live** |
| `/gip` | `app/gip/page.tsx` | **Disabled** — `PAGE_ENABLED = false` |
| `/[ref]` | `app/[ref]/page.tsx` | Legacy top-level referral route |

### `/lp/[ref]` — server component

1. Reads `ref` from the URL
2. Looks up `Affiliate.referralCode` in Postgres via Prisma
3. **404s if the affiliate is missing or `isActive` is false**
4. Renders `<AffiliateLandingPage affiliateRef={ref} />`

`ScratchCardPopup` was removed from this route.

### `/gip` — server component

Guarded by a module-level flag:

```ts
const PAGE_ENABLED = false;
export default function MounjaroPage() {
  if (!PAGE_ENABLED) notFound();
  return (<><ScratchCardPopup /><MounjaroLandingPage /></>);
}
```

Flip the flag to `true` to bring it back. `ScratchCardPopup` is **still
present** here — it was only removed from the affiliate route.

---

## 3. What the two compositions differ on

| | Affiliate `/lp/[ref]` | Mounjaro `/gip` |
|---|---|---|
| Plans API call | `/api/plans` | `/api/plans?type=MOUNJARO` |
| `pageTitle` prop | not passed — hero uses its default | `"Mounjaro Based Complete Transformation Plan"` |
| `medicationType` prop | not passed | `"MOUNJARO"` |
| `plansLoading` prop | not passed | passed |
| Cross-link banner | "Exploring Mounjaro plans?" → `/gip` — **hidden** | "Looking for GLP-1 (Semaglutide) plans?" → `/lp/ABHI` — **visible** |
| Affiliate cookie | sets `affiliate_ref`, fires `track-click` | none |
| Scratch card popup | removed | present |

Everything else — all five sections, in the same order — is identical.

### Section order (both pages)

```
[cross-link banner]
HeroSection          plan selector + checkout trigger
NewsSection          shared with the main site
SocialProof          stats bar, metric cards, testimonial
ProcessGuarantee     "How we do it" — 6 steps
SocialTrust          testimonials + expert team
EligibilityFAQ       symptom cards + FAQ
OTPModal             rendered but hidden until checkout
```

---

## 4. Checkout flow

Identical on both pages, in `page.tsx`:

```
user clicks a plan
      │
      ▼
handleBuyNow(planTitle)
      │
      ├─ match planTitle against dbPlans
      │
      ├─ logged in?  ──yes──▶ openCheckout(planId)      Razorpay
      │
      └─ no ──▶ OTPModal ──▶ handleAuthSuccess ──▶ openCheckout(planId)
```

Prices come live from `SubscriptionPlan` in the database — never hardcoded.
Checkout runs through `hooks/use-razorpay-checkout.ts`.

### Affiliate attribution

On mount, `/lp/[ref]` sets a **90-day** cookie and records the click:

```ts
document.cookie = `affiliate_ref=${affiliateRef}; path=/; expires=…; SameSite=Lax`;
fetch("/api/affiliate/track-click", { method: "POST", body: { ref } });
```

---

## 5. Content

### Hero — `hero-section.tsx`

| Element | Copy |
|---|---|
| Heading (affiliate) | "Doctor-Led GLP-1 Weight Management Protocol" — the `pageTitle` default |
| Heading (Mounjaro) | "Mounjaro Based Complete Transformation Plan" |
| Sizes | mobile `text-3xl md:text-4xl`, desktop `text-4xl lg:text-5xl` |
| Plans | 1 Month · 3 Months · 6 Months · Doctor Consultation |
| Prices | `&#8377;` HTML entity, never a literal `₹` — see §8 |
| CTA | "Get Started Now" / "Processing…" |
| Loading | "Preparing your plan…" · "Loading visualization…" |

**Hero disclaimers** — the densest compliance copy on the site:

- Plan activates within 48 hours of purchase
- A doctor calls to check eligibility; full refund within 24–48 hours if ineligible
- "Please note — Lean Protocol does not influence the doctor's prescription decision."
- "The prescribed drug is delivered by a third-party pharmacy. Lean Protocol does not source or manufacture any drug."
- "Disclaimer: Medications are prescribed solely by a licensed medical practitioner; eligibility is at their discretion…"

### Social proof — `social-proof.tsx`

Heading: "Thousands have transformed with Lean Protocol. **It's your turn now!**"

| Stat | Value |
|---|---|
| Transformations | 1k+ |
| Rating | 4.8 · 1,200+ reviews |
| Avg Weight Lost* | 6.8 Kg |
| Avg HbA1c Drop* | 2% |

Disclaimer below the grid: *"Results vary. Eligibility, treatment and outcomes
depend on individual medical assessment. Medication is prescribed only when
clinically appropriate."*

Then "The numbers speak for themselves" with four metric cards — 18-22%
Average Weight Loss* · 98% Success Rate* · Avg. HbA1c Drop* · 6 Months Money
Back Guarantee — and the same disclaimer repeated beneath.

Testimonial: "Lost 6 Kgs" — Atreyee.

### Process — `process-guarantee.tsx`

"How we do it" — Scientific · Step-by-Step · Proven Path

1. At home, advanced blood test
2. Consultation with the doctor
3. The dietitian gives a GLP-1-based diet
4. Medications delivered at your doorstep
5. 6 months Cult pass home subscription
6. **15–22% weight loss in 6 months\***

Disclaimer beneath the section. Also carries "Real results, sustained for
life" and "More than just weight loss—a total body transformation."

**The guarantee section was deleted entirely** — "India's only program
guaranteeing a minimum of 10% weight loss in 6 months, or a full refund."

### Social trust — `social-trust.tsx`

"Real Stories, Real Results" · "Verified transformations from our Lean
Protocol members"

Three named testimonials plus a media grid. **All weight-loss figures were
replaced with "Transformation Journey"**, and the Neema entry was removed.
Ten named experts.

### Eligibility — `eligibility-faq.tsx`

"Do you relate to any of these?" — six symptom cards: Insulin Resistance ·
Slow Metabolism · Low Energy · Hormonal Issues · Constant Cravings ·
Emotional Eating.

Closing line: "If you relate to any of these, **GLP-1 may be right for you
(only if eligible & prescribed).**"

Also "Guided by Science. Focused for your results."

---

## 6. Plan posters

`hero-section.tsx` selects poster artwork by duration and medication type:

```ts
let image = medicationType === "MOUNJARO"
  ? "/lp-assets/mounjaro-1-month-plan.png"
  : "/lp-assets/1-month-plan.png";
```

| Plan | Semaglutide | Mounjaro |
|---|---|---|
| 1 Month | `1-month-plan.png` | `mounjaro-1-month-plan.png` |
| 3 Months | `3-months-plan.png` | `mounjaro-3-months-plan.png` |
| 6 Months | `6-months-plan.png` | `mounjaro-6-months-plan.png` |
| Consultation | `doctor-lean-protocol.jpeg` | — |

**Prices are printed into the artwork.** Verified 5 August against the
database: ₹4,999 · ₹21,998 · ₹43,998 — all matching. If a price changes in the
admin panel, the poster must be regenerated or the page will show two
different numbers.

---

## 7. Data dependencies

| Endpoint | Purpose |
|---|---|
| `/api/plans` | Plan list — affiliate |
| `/api/plans?type=MOUNJARO` | Plan list — Mounjaro |
| `/api/user/me?optional=1` | Auth check, decides OTP vs direct checkout |
| `/api/affiliate/track-click` | Click attribution — affiliate only |

Database: `Affiliate` (route validation), `SubscriptionPlan` (prices),
`Lead` and `Commission` (attribution downstream).

---

## 8. Known issues

### Plan matching can charge for the wrong plan

Both pages share this:

```ts
const dbPlan = dbPlans.find(p =>
  p.name.toLowerCase().includes(planTitle.toLowerCase().split(" ")[0])
);
const planId = dbPlan ? dbPlan.id : dbPlans[0]?.id;
```

It matches on the **first word only**. "Lean Start", "Lean Pro" and "Lean
Champion" all reduce to `"lean"`, so `.find()` returns whichever appears first
in the array — regardless of which card the user clicked. The fallback to
`dbPlans[0]` compounds it: an unmatched title silently charges for the first
plan in the list.

Matching by plan `id` rather than by title substring would remove the class of
bug entirely.

### Unqualified guarantee claims

| Claim | Location |
|---|---|
| "Proven science, guaranteed results." | `social-proof.tsx`, directly above cards where "Guaranteed Results" was already softened to "Money Back Guarantee" |
| "Real results, sustained for life" | `process-guarantee.tsx` |
| "Guaranteed 10% weight loss in 6 months or full refund" | `app/gip/page.tsx` **metadata description** — appears in search results and link previews |

The site-wide Results Promise is tightly scoped — BMI 30+, new customers,
6-month plan, smart-scale weigh-ins, medication adherence, consultation
attendance, meal logging, pro-rata refund. None of that qualification travels
with these three claims.

### Smaller items

| Issue | Location |
|---|---|
| `doctor-consult.tsx` is imported by neither page — dead code | `components/affiliate-lp/` |
| `hero-section.tsx.bak2` — stale backup from the encoding repair | `components/affiliate-lp/` |
| "Click here â†’" — mojibake in the Mounjaro banner | `components/mounjaro-lp/page.tsx` |
| Rupee signs must stay as `&#8377;`. A literal `₹` gets corrupted by any Windows PowerShell edit using `Set-Content` | `hero-section.tsx` |
| `/lp/ABHI` is linked from the main site header as "Pricing", so every homepage visitor who clicks it is attributed to that affiliate for 90 days | `components/header.tsx` |

---

## 9. Editing rules

1. **Assume every edit hits both pages.** Only `page.tsx` in each folder is
   page-specific.
2. **Never hardcode a price.** They come from `SubscriptionPlan`; posters must
   be regenerated to match.
3. **Check the disclaimer when touching a starred claim.** Each `*` refers to
   a note elsewhere in the same section.
4. **Use `&#8377;` for rupees**, never a literal character.
5. **`/gip` is disabled by a flag, not deleted.** Flip `PAGE_ENABLED` to
   restore it.
6. **The affiliate route 404s for inactive codes.** Deactivating an affiliate
   breaks any live link pointing at them — including the header Pricing link.
