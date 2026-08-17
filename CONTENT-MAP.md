# Lean Protocol — Content Map

Where every piece of user-facing copy lives, and which claims carry
qualifications.

**Last updated:** 5 August 2026
**Source:** extracted from 517 visible strings across `app/` and `components/`

---

## 1. How to use this

Copy is written directly into components, not stored in a CMS. The two
exceptions are the blog (Sanity) and `/innovation` (all copy in
`content/innovation.ts`).

To change wording, edit the component listed against it. Before changing any
headline, check section 6 — several carry asterisks that reference a
disclaimer elsewhere on the page, and editing one without the other breaks the
qualification.

---

## 2. Homepage — `app/page.tsx`

Composed from shared components, in render order:

| Section | Component | Key copy |
|---|---|---|
| Header | `components/header.tsx` | Home · Our Why · **Pricing** · Knowledge Hub |
| Hero | `components/hero.tsx` | "GLP 1* Guided Fat Loss Made **Affordable for India**" |
| Hero bullets | same | Root Causes Diagnosis · Personalised Lifestyle Approach · Lose weight optimally with GLP-1 (only if eligible & prescribed) |
| Insurance logos | `components/hero.tsx` | `InsuranceLogos` export |
| Causes | `components/causes-section.tsx` | desktop only |
| Journey | `components/parallax-journey.tsx` | "Weight-loss secret of celebrities **made safer and accessible**" — 5 steps |
| Video | `components/video-section.tsx` | "Understand The Process That Let Us Deliver Amazing Results!" |
| Video pointers | same | Doctor-guided · Made for India · GLP-1 backed (only if eligible & prescribed) |
| Testimonials | `components/testimonials-carousel.tsx` | "Real people. Real stories. **Real results.**" — 10 members, names only |
| Mobile stats | `components/mobile-stats-card.tsx` | 18–22% Avg Weight Loss · 98% Success Rate · 2.6% Avg HbA1c Drop · 6 mo Money Back Guarantee |
| Pricing | `components/pricing-carousel.tsx` | plan cards, `bg-dark` |
| Partners | inline in `app/page.tsx` | "Our Engagement Partners" — Redcliffe, MrMed, Cult. Background `bg-dark`, heading white |
| News | `components/news-section.tsx` | press coverage |
| Weight slider | `components/weight-slider.tsx` | "Your estimated weight in 6 months with Lean Protocol" · "Estimated new weight*" |
| Doctors | `components/doctor-testimonial.tsx` | "Meet the Experts working with us" |
| Chart | `components/weight-loss-chart.tsx` | "Clinical outcomes" · "Your estimated weight over 6 months" · "−22% with Lean Protocol*" |
| Benefits marquee | `components/benefits-marquee.tsx` | |
| Insurance | `components/insurance-coverage.tsx` | "…covers your treatment!" |
| Footer | `components/footer.tsx` | "Stay updated with health tips" |

**Removed from the homepage this session:** `LimitedOffersSection` — component
file retained at `components/limited-offers-section.tsx`.

---

## 3. Affiliate page — `/lp/[ref]`

Rendered by `components/affiliate-lp/page.tsx`.

| Section | Component | Key copy |
|---|---|---|
| Cross-link banner | `page.tsx` | "Exploring Mounjaro plans?" — **hidden** via `className="hidden"` |
| Hero | `hero-section.tsx` | "Doctor-Led GLP-1 Weight Management Protocol" |
| Plan cards | `hero-section.tsx` | 1 Month · 3 Months · 6 Months · Doctor Consultation. Prices from the database, posters from `public/lp-assets/` |
| Hero disclaimers | `hero-section.tsx` | Activation in 48 hours · doctor decides eligibility · "Lean Protocol does not influence the doctor's prescription decision" · third-party pharmacy |
| Stats bar | `social-proof.tsx` | 1k+ Transformations · 4.8 Rating · 6.8Kg Avg Weight Lost* · 2% Avg HbA1c Drop* |
| Metric cards | `social-proof.tsx` | 18-22% Average Weight Loss* · 98% Success Rate* · Avg. HbA1c Drop* · 6 Months Money Back Guarantee |
| Testimonial | `social-proof.tsx` | "Lost 6 Kgs" · Atreyee quote |
| Process | `process-guarantee.tsx` | "How we do it" — 6 steps ending "15–22% weight loss in 6 months*" |
| Testimonials | `social-trust.tsx` | "Real Stories, Real Results" — results now read "Transformation Journey" |
| Experts | `social-trust.tsx` | 10 named experts |
| Eligibility | `eligibility-faq.tsx` | "Do you relate to any of these?" — 6 symptom cards |
| Closing line | `eligibility-faq.tsx` | "GLP-1 may be right for you (only if eligible & prescribed)." |
| Doctor consult | `doctor-consult.tsx` | "Guided by Science. Focused for your results." |

**Removed this session:** `ScratchCardPopup`.
**Guarantee section removed:** the "India's only program guaranteeing 10%
weight loss… or a full refund" block was deleted entirely.

---

## 4. Live funnel — `/users` and `forms.leanprotocol.in`

`app/users/page.tsx`. Six steps, renumbered from the original ten.

| Step | Question | Options |
|---|---|---|
| 1 | What's your main reason for wanting to lose weight? | More energy · Doctor recommended · Look and feel better · Not sure yet |
| 2 | How soon would you like to get started? | ASAP · Within a month · Not sure yet |
| 3 | What kind of support are you looking for? | Complete doctor-guided programme · Nutrition coaching · Accountability · Initial consultation |
| 4 | What is your current weight? | numeric, 30–300 kg |
| 5 | What's your name? | text |
| 6 | How should we reach you? | phone required, email optional |

**Dropped from the original funnel:** programme duration, preferred call-time
window, city.

**Thank-you screen** — "You're all set!" then three steps: expert calls you ·
free consultation and plan shared · begin your journey. **No onward link** —
the funnel deliberately ends here.

**Footer** — Privacy Policy · Terms, linking to `/users/privacy` and
`/users/terms`.

### Funnel policies — separate from the site-wide ones

`app/users/policies-content.ts` holds both. They are explicitly scoped:

> "These Terms apply only to Lean Protocol's enquiry landing page,
> questionnaire and connected lead-generation form."

Terms cover: scope · eligibility (18+, India, self) · enquiry only · not for
emergencies · permission to respond · responsible use · third-party platforms ·
disclaimer · updates.

Privacy covers: scope · information collected · use · health-related
information · marketing consent · sharing · advertising platforms · retention ·
your rights · under-18s · updates.

**Note:** the privacy policy lists city, programme duration and contact time as
collected data. The live funnel no longer asks for these. Over-declaring is
safe, but the document describes a larger form than the one running.

---

## 5. Disabled campaign pages

Copy retained in the codebase for reuse.

### `/challenge` — 30 Days GLP-1 Challenge
`app/challenge/` + `components/challenge/` (21 components)

Hero · spin wheel · exit-intent modal · plans carousel · Google reviews ·
press · experts · lead form · sticky CTA · mascot · confetti.

Notable: "Give the wheel a spin and lock in your exclusive joining offer" ·
"Our medical team will call you back within 24 hours" · unlock page with BMI
and eligibility flow.

### `/consult49` — ₹49 doctor consultation
`app/consult49/page.tsx`, single self-contained file.

"Talk to real GLP-1 doctors before you spend ₹15,000 on medication" ·
"Your Transformation Plan!" · "ONE SMALL STEP. TO A LEANER YOU." ·
BMI calculator with eligibility · roadmap · FAQ · "Now or Never Deal".

### `/_brides` — Bridal funnel
`app/_brides/`

"Doctor guided GLP 1 · Designed for Brides · Avg 17kg Weight Loss" ·
"transformed before the aisle" · "The Bridal Glow Protocol" ·
"Your glow has a deadline." · ₹449 consultation · countdown by months to
wedding · scarcity messaging ("Only 17 of 50 bridal seats left").

### `/gip` — formerly `/mounjaro`
`components/mounjaro-lp/page.tsx` · "Looking for GLP-1 (Semaglutide) plans?"

---

## 6. Claims and disclaimers register

The part most likely to break when someone edits a headline.

### Outcome claims and their qualifications

| Claim | Where | Qualification |
|---|---|---|
| "GLP 1* Guided Fat Loss" | homepage hero | "*GLP-1 only after doctor's evaluation and on the basis of valid prescription" |
| "lose up to 22% of body weight*" | `parallax-journey.tsx` step 5 | "*Results vary. Eligibility, treatment and outcomes depend on individual medical assessment. Medication is prescribed only when clinically appropriate." |
| "Estimated new weight*" | `weight-slider.tsx` | "*Individual results may vary. The data is on the basis of average results of a Lean Protocol user." |
| "−22% with Lean Protocol*" | `weight-loss-chart.tsx` | same wording |
| "Avg Weight Lost*" / "Avg HbA1c Drop*" | `social-proof.tsx` stats bar | "*Results vary…" below the grid |
| "18-22% Average Weight Loss*" / "98% Success Rate*" | `social-proof.tsx` cards | "*Results vary…" below the section |
| "15–22% weight loss in 6 months*" | `process-guarantee.tsx` | "*Results vary…" below the section |
| "GLP-1 backed (only if eligible & prescribed)" | `video-section.tsx` | inline |
| "GLP-1 may be right for you (only if eligible & prescribed)" | `eligibility-faq.tsx` | inline |
| Testimonial results | `testimonials-carousel.tsx` | "*Individual results may vary." |
| "22% avg body-weight loss*" | `/consult49` stats | "*Individual results vary, based on our internal data." |

### Standing disclaimers

- **Prescription**: "GLP-1 medications are prescription-only and dispensed
  solely when a licensed physician determines they are clinically appropriate"
- **No influence**: "Lean Protocol does not influence the doctor's prescription
  decision"
- **Third-party**: "The prescribed drug is delivered by a third-party pharmacy.
  Lean Protocol does not source or manufacture any drug"
- **No affiliation**: "Lean Protocol is not affiliated with Novo Nordisk A/S or
  Eli Lilly & Co."
- **Not emergency care**: on `/users` terms and site-wide terms
- **BMI tools**: "for general awareness only and is not medical advice"

### Needs attention

| Issue | Location |
|---|---|
| **"Proven science, guaranteed results."** — an unqualified guarantee claim, sitting directly above metric cards where "Guaranteed Results" was already changed to "Money Back Guarantee" | `components/affiliate-lp/social-proof.tsx` |
| **"Real results, sustained for life"** — "for life" is a durability claim with no qualification | `components/affiliate-lp/process-guarantee.tsx` |
| **"Avg 17kg Weight Loss"** — unasterisked | `app/_brides/page.tsx` (disabled) |
| **"Avg. 6 kg weight loss*"** — asterisk present; confirm the note still exists on the page | `app/challenge/unlock/page.tsx` (disabled) |
| Raw JS rendering as visible text: `setVisible(true), typeof window !== 'undefined' && window.innerWidth` | `components/video-popup.tsx` |
| Raw JS rendering as visible text: `parseFloat((t * ease).toFixed(t` | `app/consult49/page.tsx` (disabled) |
| Homepage still titled "Clinically Proven Weight Loss for India" in metadata, and description claims "Lose 15-22% body weight" without qualification | `app/layout.tsx` |

---

## 7. Legal pages

### Site-wide — governs the full service

| Page | File | Updated |
|---|---|---|
| Privacy Policy | `app/privacy-policy/privacy-policy-content.tsx` | 15 Jan 2026 |
| Terms & Conditions | `app/terms-conditions/terms-conditions-content.tsx` | 15 Jan 2026 |
| Refund Policy | `app/refund-policy/refund-policy-content.tsx` | 15 Jan 2026 |

**Results Promise** appears in both terms and refund policy: at least 10% of
starting body weight over 6 months, for new customers with starting BMI 30+, on
a 6-month GLP-1 programme, subject to adherence — smart-scale weigh-ins,
medication adherence, consultation attendance, meal logging. Refunds are
pro-rata and exclude delivered services and dispensed medicines.

**Note:** the privacy policy describes cookies and analytics. GTM and GA4 were
removed on 3 August 2026, so this section now over-describes what runs.

### Funnel-specific — governs only the enquiry form

`/users/privacy` and `/users/terms`, effective 3 August 2026, from
`app/users/policies-content.ts`.

---

## 8. Institutional page — `/innovation`

The only page where copy is fully separated from components:
**`content/innovation.ts`**.

Sections: hero · trust bar · clinical gap · workflow · four product modules ·
technical distinctiveness · architecture · current stage · SBIRI programme ·
pilot · deployment · roadmap · governance · team · collaboration · contact ·
FAQ.

Governed by a stricter claims standard than the rest of the site. Every claim
carries a product-stage chip:

| Chip | Meaning |
|---|---|
| Existing workflow | operating today |
| Prototype under development | being built |
| Proposed R&D module | not built; part of the funding ask |
| Planned validation | study not yet run |
| Illustrative product interface | mock-up, not a deployed feature |

Values in `[SQUARE BRACKETS]` are unverified and hide themselves via
`isVerified()` — metric cards disappear, team members show "Planned project
role". Outstanding: CIN, registered office, email, phone, operating metrics,
project cost and duration, pilot parameters, six team members.

---

## 9. Editing rules

1. **Check the register first.** Section 6 lists claims tied to disclaimers
   elsewhere on the same page.
2. **Never use** guaranteed weight loss, clinically proven, patented,
   India's first, government approved, or unqualified percentages.
3. **Prefer** designed to · intended to · may · typically · individual results
   vary · only if eligible and prescribed.
4. **Campaign pages are isolated by design.** Each has its own copy, CSS and
   API routes. Editing one cannot affect another.
5. **Watch file encoding.** `app/users/page.tsx` is deliberately pure ASCII and
   prices render `&#8377;` rather than a literal ₹ — see ARCHITECTURE.md §12.
