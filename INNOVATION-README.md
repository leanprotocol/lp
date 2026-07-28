# /innovation — Lean Protocol institutional innovation page

Audience: BIRAC and SBIRI evaluators, grant committees, incubators, healthcare
institutions, clinical and research partners, technology collaborators and
strategic investors. This is **not** a consumer weight-loss page.

---

## 1. Where each file goes

| File in this bundle | Save to |
|---|---|
| `innovation-assets.ts` | `content/innovation-assets.ts` |
| `innovation.ts` | `content/innovation.ts` |
| `innovation-contact-schema.ts` | `lib/innovation-contact-schema.ts` |
| `innovation.css` | `app/innovation/innovation.css` |
| `layout.tsx` | `app/innovation/layout.tsx` |
| `page.tsx` | `app/innovation/page.tsx` |
| `contact-route.ts` | `app/api/innovation/contact/route.ts` |
| everything in `components/` | `components/innovation/` (keep filenames) |
| `innovation-schema.sql` | run once in the Supabase SQL editor |
| `env.example` | merge the two keys into `.env.local` |

Create the image folder: `public/innovation/`

---

## 2. Dependency check

Already in the project: `next`, `react`, `typescript`, `tailwindcss`, `lucide-react`.

Only possible addition:

```bash
pnpm add zod
```

Skip it if `zod` is already in `package.json` (shadcn installs commonly include it).

---

## 3. Environment variables

Add to `.env.local` locally and to **Vercel → Settings → Environment Variables**
for production:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Both are server-only. Never prefix with `NEXT_PUBLIC_`. The service-role key
bypasses row-level security, so it must never reach the browser — the contact
route reads it inside a `runtime = "nodejs"` handler only.

If both are blank the page still works: enquiries are logged to the server
console instead of being stored, so you can build and demo before Supabase is
connected.

---

## 4. Deploying

```bash
git add .
git commit -m "Add /innovation institutional page"
git push origin main
```

Vercel deploys automatically. Then confirm:

- `leanprotocol.in/innovation` renders
- Submitting the form returns the success card
- The row appears in Supabase → Table editor → `innovation_enquiries`

---

## 5. Visual assets still missing

Drop these into `public/innovation/`. Until a file exists, the page shows a
"Visual asset pending" card at the correct aspect ratio — layout is preserved
and nothing breaks.

| # | File | Used for |
|---|---|---|
| 1 | `lean-protocol-logo.png` | Header and footer logo |
| 2 | `hero-platform-montage.webp` | Hero visual |
| 3 | `patient-companion.webp` | Module 01 |
| 4 | `symptom-adherence.webp` | Module 02 |
| 5 | `clinician-command-centre.webp` | Module 03 |
| 6 | `progress-outcomes.webp` | Module 04 |
| 7 | `fragmented-care-system.webp` | Clinical gap diagram |
| 8 | `clinical-action-workflow.webp` | Workflow diagram |
| 9 | `technical-architecture.webp` | Architecture diagram |
| 10 | `pilot-validation-framework.webp` | Pilot framework |
| 11 | `deployment-network.webp` | Deployment reach |
| 12 | `prototype-roadmap.webp` | 12-month roadmap |
| 13 | `innovation-social-preview.webp` | Open Graph / Twitter card |

To rename any of these, edit `content/innovation-assets.ts` only. Image paths
appear nowhere else in the codebase.

Rules enforced in code: local files only, no remote fetching, no stock imagery,
no generated images, no fabricated screenshots or faces. Every product image
carries the caption "Illustrative product interface", and the meaning of each
diagram is repeated in accessible HTML so nothing depends on text inside an image.

---

## 6. Facts still to verify

Everything in `[SQUARE BRACKETS]` in `content/innovation.ts` is unverified.
Metric cards and project rows containing brackets are **hidden or visibly
marked** automatically — see `isVerified()` — so nothing unverified is ever
presented as fact.

**Company details** (`company`)
- [ ] `cin` — CIN
- [ ] `registeredOffice` — registered address
- [ ] `email` — company email
- [ ] `phone` — company phone

**Operating metrics** (`currentStage.metrics`) — cards stay hidden until filled
- [ ] Patients served
- [ ] Clinical professionals
- [ ] Months operating
- [ ] Engagement metric

**Project information** (`researchProgramme.projectInfo`)
- [ ] Proposed duration
- [ ] Proposed project cost
- [ ] Proposed grant support

**Pilot parameters** (`pilot.parameters`)
- [ ] Participants
- [ ] Clinical sites
- [ ] Duration

**Team** (`team.members`) — each shows "Planned project role" until named
- [ ] Founder and CEO
- [ ] Clinical lead
- [ ] Product and technology lead
- [ ] Nutrition and behavioural-care lead
- [ ] AI and data-science advisor
- [ ] Regulatory or research advisor

**Policy pages** (`governance.policies`) — three currently point at `#`
- [ ] Patient consent policy
- [ ] Data-retention policy
- [ ] Clinical-safety policy

**Optional**
- [ ] `hero.documentCta.href` — set to a real PDF in `/public` to show the
      "Download Innovation Brief" button. Left blank, the button is hidden.

---

## 7. Claims discipline built into the page

Never used anywhere: guaranteed or assured weight loss, percentage outcome
claims, diabetes remission, clinically proven, patented, India's first,
government or FDA approved, money-back guarantee, medication or package prices,
before-and-after photographs.

Used instead: designed to, intended to, prototype under development, proposed,
planned validation, clinician supervised, explainable, protocol led, initial
pilot, subject to clinical evaluation.

Every claim carries a product-stage chip — the page's signature device:

| Chip | Meaning |
|---|---|
| Existing workflow | Already operating today |
| Prototype under development | Being built now |
| Proposed R&D module | Not built; part of the funding ask |
| Planned validation | Study or test not yet run |
| Illustrative product interface | Mock-up, not a deployed feature |

To change any wording, edit `stages` in `content/innovation.ts`.

---

## 8. Responsive and accessibility notes

Adaptive layouts at 320, 375, 430, 768, 1024, 1280 and 1440px. Content reorders
rather than shrinking: module images move below copy on mobile, the four-layer
architecture stacks, the roadmap becomes a single column, and every diagram has
an HTML equivalent so it stays readable when the image is small.

- Mobile: hamburger menu, full-width CTAs, 44px minimum touch targets,
  no horizontal scrolling
- Keyboard: skip link, visible focus rings on every interactive element
- Motion: gentle fade-up only, fully disabled under `prefers-reduced-motion`
- JavaScript: only the header menu, the contact form and image fallbacks are
  client components. The FAQ uses native `<details>` with no JS at all.
- Images: hero is priority, everything else lazy-loads; fixed aspect ratios
  prevent cumulative layout shift

---

## 9. Linking the page

The page is intentionally **not** in the main site navigation — it is an
institutional destination you share directly. It links back to the consumer site
via the header ("Lean Protocol Care Programmes") and the footer, so it stays
visibly part of Lean Protocol Private Limited.

To add it to the main nav later, add a link to `/innovation` in
`components/header.tsx`.
