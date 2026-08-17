# Lean Protocol — Architecture

Technical reference for `leanprotocol.in`.

**Last updated:** 5 August 2026

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.0.10, App Router, Turbopack |
| Language | TypeScript 5.9 |
| UI | React 19.2, Tailwind CSS 4.1, shadcn/ui (Radix) |
| Database | PostgreSQL (Neon), Prisma 7.2 with `@prisma/adapter-pg` |
| Auth | JWT via `jose`, bcrypt, Firebase Admin for phone OTP |
| Payments | Razorpay |
| CMS | Sanity (blog only) |
| CRM | TeleCRM (Async API) |
| Email | AWS SES |
| Hosting | Vercel |
| Package manager | pnpm |

Local dev runs on port **3002**.

---

## 2. Route map

### Public site

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/our-why` | Brand story |
| `/pricing` | Pricing |
| `/program` | Programme detail |
| `/reviews` | Testimonials |
| `/contact` | Contact form |
| `/blog`, `/blog/[slug]` | Sanity-backed blog (ISR, 1 min revalidate) |
| `/medications`, `/medications/[slug]` | Medication reference pages |
| `/bmi-calculator`, `/bmr-calculator`, `/waist-to-hip-calculator` | Health tools |
| `/quiz` | Eligibility quiz |
| `/privacy-policy`, `/terms-conditions`, `/refund-policy` | Site-wide legal |

### Campaign and funnel pages

Each is a self-contained landing page with its own scoped CSS and its own
API routes. They do not share layout with the main site.

| Route | Status | Notes |
|---|---|---|
| `/users` | **Live** | Six-step questionnaire funnel. Also served at `forms.leanprotocol.in` |
| `/lp/[ref]` | **Live** | Affiliate landing page, validated against the `Affiliate` table |
| `/challenge` | Disabled | `notFound()` guard in `page.tsx` |
| `/consult49` | Disabled | `notFound()` guard in `page.tsx` |
| `/gip` | Disabled | `PAGE_ENABLED = false` flag. Formerly `/mounjaro` |
| `/_brides` | Disabled | Folder renamed with `_` prefix, so Next ignores the route |
| `/innovation` | **Live** | Institutional page for grant and clinical evaluators |

### Authenticated areas

| Route | Guard |
|---|---|
| `/login`, `/forgot-password`, `/welcome` | Public |
| `/dashboard` | User session |
| `/admin/*` | Admin session — 18 sub-routes |
| `/affiliate/*` | Affiliate session — 7 sub-routes |
| `/masterclass` | Course session (separate auth) |
| `/studio/[[...tool]]` | Sanity Studio |

---

## 3. Data model

Prisma schema at `prisma/schema.prisma`. Fifteen models plus one course model.

### Core
`User` · `OTP` · `Admin` · `AuditLog`

### Commerce
`SubscriptionPlan` → `Subscription` → `Payment` → `RefundRequest`

Plan prices are edited in the admin panel and read live by the frontend, so
prices are never hardcoded in components.

### Growth
`Affiliate` → `Lead` → `Commission`

`/lp/[ref]` looks up `Affiliate.referralCode` and 404s when the affiliate is
missing or inactive.

### Supporting
`QuizSubmission` · `InsuranceProvider` · `ContactQuery` ·
`NewsletterSubscription` · `CourseUser`

### Enums
`QuizStatus` · `SubscriptionStatus` · `PaymentStatus` · `RefundStatus` ·
`SettlementStatus` · `LeadSource` · `LeadStatus` · `CommissionStatus` ·
`AuditAction`

---

## 4. Directory layout

Complete source tree, excluding `node_modules`, `.next` and `.git`.

### `app/` — routes

```
app/
  layout.tsx                    root layout
  page.tsx                      homepage
  globals.css
  not-found.tsx
  global-error.tsx
  _global-error.tsx             disabled duplicate

  our-why/page.tsx
  pricing/page.tsx  pricing/PricingClient .tsx
  program/page.tsx
  reviews/page.tsx
  contact/page.tsx  contact/client.tsx
  quiz/page.tsx
  welcome/page.tsx
  dashboard/page.tsx
  login/page.tsx  forgot-password/page.tsx
  get-started/page.tsx  get-started/affiliate/page.tsx
  masterclass/page.tsx

  blog/page.tsx  blog/[slug]/page.tsx
  medications/page.tsx  medications/[slug]/page.tsx
  bmi-calculator/page.tsx
  bmr-calculator/page.tsx
  waist-to-hip-calculator/page.tsx

  privacy-policy/page.tsx     + privacy-policy-content.tsx
  terms-conditions/page.tsx   + terms-conditions-content.tsx
  refund-policy/page.tsx      + refund-policy-content.tsx

  studio/[[...tool]]/page.tsx   Sanity Studio

  --- campaign and funnel pages ---
  users/                        LIVE - also served at forms.leanprotocol.in
    layout.tsx  page.tsx  users.css
    policies-content.ts  policy-shell.tsx
    privacy/page.tsx  terms/page.tsx
  lp/[ref]/page.tsx             LIVE - affiliate landing
  [ref]/page.tsx                legacy top-level referral route
  innovation/                   LIVE
    layout.tsx  page.tsx  innovation.css
  challenge/                    DISABLED via notFound()
    layout.tsx  page.tsx  challenge.css
    checkout/page.tsx  unlock/page.tsx
  consult49/                    DISABLED via notFound()
    layout.tsx  page.tsx  consult49.css
    checkout/checkout-page.tsx  unlinked
  gip/page.tsx                  DISABLED via PAGE_ENABLED flag
  _brides/                      DISABLED via folder rename
    page.tsx  BridesFunnel.tsx

  --- admin, 18 routes ---
  admin/
    layout.tsx  page.tsx  login/page.tsx
    admins/  affiliates/  affiliates/[id]/
    blogs/[[...tool]]/  contact-queries/
    insurance-providers/  leads/  newsletter/
    payments/  plans/  plans/page-backup.tsx
    quiz-submissions/  refunds/  subscriptions/  users/

  --- affiliate, 7 routes ---
  affiliate/
    layout.tsx  page.tsx  login/  register/
    earnings/  plans/  settings/  subscriptions/
```

### `app/api/` — route handlers

```
api/
  admin/          22 routes  auth, dashboard, users, plans,
                             payments, refunds, leads, commissions,
                             quiz, contact, newsletter, insurance
  affiliate/      11 routes  auth, dashboard, earnings, plans,
                             lead-capture, track-click, export
  auth/            8 routes  login, logout, pre-register,
                             verify-firebase, forgot-password x3,
                             check-registration
  user/            7 routes  me, profile, password,
                             subscription x4
  masterclass/     7 routes  login, logout, me, progress,
                             create-order, verify, seed
  blog/            4 routes  posts, [slug], recommended, categories
  payment/         3 routes  create-order, verify, fail
  quiz/            2 routes  session, submit

  --- campaign lead capture, one set each ---
  users/lead
  challenge/       create-order, lead, verify
  consult49/       create-order, lead, verify
  brides/          create-order, lead, verify
  innovation/contact            writes to Supabase, not TeleCRM

  contact  newsletter/subscribe  refund/request
  plans  insurance-providers  insurance-provider-names
  webhooks/razorpay  workers
```

### `components/`

```
components/
  header.tsx  footer.tsx  hero.tsx
  theme-provider.tsx  referral-tracker.tsx  clarity.tsx
  whatsapp-icon.tsx

  before-after.tsx  before-after-slider.tsx
  benefits-marquee.tsx  benefits-section.tsx
  causes-section.tsx  doctor-testimonial.tsx
  faq-section.tsx  insurance-coverage.tsx
  journey-steps.tsx  parallax-journey.tsx
  limited-offers-section.tsx  medication-toolkit.tsx
  members-served.tsx  microdose-section.tsx
  mobile-stats-card.tsx  news-ribbon.tsx  news-section.tsx
  pricing-carousel.tsx  scratch-card-popup.tsx
  stats-section.tsx  testimonials-carousel.tsx
  testimonials-section.tsx  video-popup.tsx  video-section.tsx
  weight-loss-chart.tsx  weight-slider.tsx

  ui/                    54 shadcn primitives
  affiliate-lp/           7  hero, social-proof, social-trust,
                             process-guarantee, eligibility-faq,
                             doctor-consult, page
  challenge/             21  hero, spin-wheel, mascot, confetti,
                             joiner-toasts, exit-intent, plans,
                             testimonials, press, useCoverflow hook
  innovation/            22  one per page section, plus
                             InnovationImage and InnovationUI
  medications/           21  incl. dynamic/ subfolder x10
  program/                7  blog/  5   our-why/  4
  bmi-calculator/         2  bmr-calculator/ 2
  waist-to-hip-calculator/ 2  reviews/ 2  get-started/ 2
  quiz/                   1  mounjaro-lp/ 1
```

### Supporting directories

```
lib/
  auth/         jwt.ts  edge-jwt.ts  cookies.ts  password.ts
                middleware.ts  admin.ts
  validations/  auth  contact  payment  quiz  refund
                subscription  user
  email/admin-alerts.ts
  firebase/     admin.ts  client-config.ts
  prisma.ts  env.ts  utils.ts  courseAuth.ts
  innovation-contact-schema.ts

services/
  lead-service.ts  commission-service.ts  audit-service.ts
  payment/razorpay.service.ts

hooks/
  use-admin-fetch.ts  use-razorpay-checkout.ts
  use-mobile.ts  use-toast.ts

content/
  innovation.ts            all /innovation copy
  innovation-assets.ts     image manifest

data/medications-data.ts
types/  medication.ts  razorpay.d.ts
styles/globals.css

sanity/
  env.ts  env.public.ts  structure.ts  seed.mjs
  lib/     client  image  live  posts  posts.types
  schemaTypes/  index  postType  authorType
                categoryType  blockContentType

prisma/  schema.prisma  seed.ts
scripts/ fast-forward-commissions.ts  reprocess-commissions.ts

middleware.ts  next.config.mjs  postcss.config.mjs
eslint.config.mjs  prisma.config.ts
sanity.config.ts  sanity.cli.ts
globals.d.ts  next-env.d.ts
```

### Housekeeping

Files that appear to be stale, duplicated or superseded. Worth a review before
they cause confusion:

| Path | Note |
|---|---|
| `app/[ref]/page.tsx` | Top-level referral route alongside `app/lp/[ref]/page.tsx`. Two routes for the same concept |
| `app/_global-error.tsx` | Disabled duplicate of `app/global-error.tsx` |
| `app/admin/plans/page-backup.tsx` | Backup left in the tree |
| `app/consult49/checkout/checkout-page.tsx` | Superseded by the in-page modal, no longer linked |
| `app/pricing/PricingClient .tsx` | **Space in the filename** before `.tsx` |
| `styles/globals.css` | Second stylesheet alongside `app/globals.css` |
| `hooks/use-toast.ts` / `use-mobile.ts` | Duplicated in `components/ui/` |
| `components/clarity.tsx` | Still imported; retained deliberately |
| `components/scratch-card-popup.tsx` | Removed from `/lp/[ref]`; still used by `/gip` |
| `components/limited-offers-section.tsx` | Removed from the homepage; file retained |

---

## 5. Auth

Three separate session types, each with its own cookie and guard:

| Type | Entry | Guard |
|---|---|---|
| User | `/login` | `lib/auth/middleware.ts` |
| Admin | `/admin/login` | `lib/auth/admin.ts` |
| Affiliate | `/affiliate/login` | affiliate API routes |
| Course | `/masterclass` | `lib/courseAuth.ts` |

`lib/auth/edge-jwt.ts` exists because `middleware.ts` runs on the Edge runtime,
which cannot use the Node crypto APIs the standard JWT helper relies on. Both
verify the same tokens - they are two implementations, not two systems.

User, admin and affiliate tokens are all signed with `JWT_SECRET` and expire
after `JWT_EXPIRES_IN`. The course area is fully separate, signed with
`COURSE_SESSION_SECRET`, so a compromised course session cannot reach the main
application.

Phone verification uses Firebase OTP, governed by three tunable limits -
`OTP_EXPIRY_MINUTES`, `OTP_MAX_ATTEMPTS` and `OTP_BLOCK_DURATION_MINUTES` -
which can be tightened without a deploy. Passwords use bcrypt.

---

## 6. Lead capture

All campaign pages push to **TeleCRM** through its Async API.

**Endpoint**
```
POST https://next-api.telecrm.in/enterprise/{TELECRM_ENTERPRISE_ID}/autoupdatelead
Authorization: Bearer {TELECRM_API_TOKEN}
```

**Payload** — fields only, no actions array:
```json
{ "fields": { "name": "...", "phone": "91XXXXXXXXXX", "source": "..." } }
```

Empty fields are stripped before sending.

**Two rules learned the hard way:**

1. **Phone must be the workspace lead identifier.** Without it, TeleCRM accepts
   the request with a 200 and then silently discards the lead. Set under
   Settings → Lead Fields.
2. **Field API names must match exactly.** Unrecognised fields are dropped
   silently — no error is returned.

Because the API is fire-and-forget, a 200 means *queued*, not *saved*.

**Source tags** distinguish origin:

| Route | `source` |
|---|---|
| `/api/users/lead` | `users-questionnaire` |
| `/api/challenge/lead` | `challenge-landing-page`, `spin-wheel` |
| `/api/consult49/lead` | `consult49-bmi-calculator` |
| `/api/consult49/verify` | `consult49-checkout` |
| Checkout intent | `consult49-checkout-intent` — fires before Razorpay opens, so abandoned payments are still captured |

`/api/innovation/contact` is the exception: it writes to Supabase rather than
TeleCRM, since it collects institutional enquiries rather than patient leads.

---

## 7. Payments

Standard Razorpay flow, repeated per campaign:

```
create-order  →  Razorpay checkout  →  verify (HMAC SHA-256)  →  CRM push
```

Signature verification uses `RAZORPAY_KEY_SECRET` over
`{orderId}|{paymentId}`. Webhook at `/api/webhooks/razorpay`.

Main-site plan prices come from `SubscriptionPlan`; campaign pages hardcode a
fixed amount in their `create-order` route.

---

## 8. Deployment

Vercel, auto-deploying from `main`.

### Domains

| Domain | Serves |
|---|---|
| `leanprotocol.in` | 307 → `www` |
| `www.leanprotocol.in` | Main site |
| `forms.leanprotocol.in` | `/users` funnel |

### Subdomain rewrite

`next.config.mjs` maps the funnel subdomain's root to `/users`:

```js
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/',
        has: [{ type: 'host', value: '(?<host>forms\\.leanprotocol\\.in.*)' }],
        destination: '/users',
      },
    ],
  }
}
```

**`beforeFiles` is required.** The plain array form runs *after* filesystem
routing, and since `/` already resolves to the homepage the rule would never
fire. A rewrite is used rather than a redirect so the browser URL stays on the
subdomain, which Google Ads requires for destination matching.

### Build

`next build` on Node 22 with `--max-old-space-size=8192`.
`typescript.ignoreBuildErrors` is **on**, so type errors do not fail the build.

---

## 9. Environment variables

Confirmed from `.env.local`. Server-side only unless prefixed `NEXT_PUBLIC_`.

### Database
| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL, consumed by Prisma |

### Auth and sessions
| Variable | Notes |
|---|---|
| `JWT_SECRET` | Signs user, admin and affiliate tokens |
| `JWT_EXPIRES_IN` | Token lifetime |
| `COURSE_SESSION_SECRET` | Separate secret for `/masterclass` |

### OTP policy
| Variable | Notes |
|---|---|
| `OTP_EXPIRY_MINUTES` | Code validity window |
| `OTP_MAX_ATTEMPTS` | Failures before lockout |
| `OTP_BLOCK_DURATION_MINUTES` | Lockout duration |

Tunable without a code change - useful when tightening against abuse.

### Firebase
Server: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

Client (`NEXT_PUBLIC_`): `FIREBASE_API_KEY`, `FIREBASE_APP_ID`,
`FIREBASE_AUTH_DOMAIN`, `FIREBASE_MESSAGING_SENDER_ID`,
`FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`

`FIREBASE_PRIVATE_KEY` contains literal `\n` sequences that must be unescaped
at runtime.

### Payments
| Variable | Notes |
|---|---|
| `RAZORPAY_KEY_ID` | Sent to the browser to open checkout |
| `RAZORPAY_KEY_SECRET` | Signature verification - server only |
| `RAZORPAY_WEBHOOK_SECRET` | Validates `/api/webhooks/razorpay` |

### CRM
| Variable | Notes |
|---|---|
| `TELECRM_ENTERPRISE_ID` | Forms the endpoint path |
| `TELECRM_API_TOKEN` | Must be an **Async** token - Sync tokens return 401 |

### CMS
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_TOKEN`

### Platform
`NODE_ENV`, `VERCEL_OIDC_TOKEN` (injected by Vercel)

### Referenced in code but absent from `.env.local`

| Variable | Consumer | Behaviour when missing |
|---|---|---|
| `SUPABASE_URL` | `/api/innovation/contact` | Logs the enquiry to the server console and returns success |
| `SUPABASE_SERVICE_ROLE_KEY` | same | same |
| AWS SES credentials | `lib/email/admin-alerts.ts` | Admin alert emails do not send |

The Supabase pair must be added in **Vercel - Settings - Environment
Variables** before the `/innovation` contact form can store anything in
production. The service-role key bypasses row-level security and must never
carry a `NEXT_PUBLIC_` prefix.

---

## 10. Analytics

Removed on 3 August 2026 at the company's request:

- Google Tag Manager `GTM-MTB6D4CQ`
- Google Analytics 4 `G-SN2P6LQBHW`

Still active:

- Vercel Analytics
- Microsoft Clarity `wa6e7p1xur`
- Google Ads conversion tag `AW-18352829434` — **scoped to `/users` only**,
  mounted in `app/users/layout.tsx`, not in the root layout

**Meta Pixel** (`2207593576706808`) was never in this codebase. It fires from
inside the GTM container, so removing GTM stops it loading here — but the tag
still exists in `GTM-MTB6D4CQ` and must be paused or deleted at
tagmanager.google.com and republished to stop it firing elsewhere.

---

## 11. Conventions

### Campaign page pattern

Repeated for `/challenge`, `/consult49`, `/users` and `/gip`:

1. Own folder under `app/`
2. Own `layout.tsx` wrapping children in a scoped class (`.users-page`,
   `.consult49-page`)
3. Own CSS file, every rule prefixed with that class so nothing leaks
4. Own API routes under `app/api/{campaign}/`
5. Own copy of the CRM push logic

Deliberately duplicated rather than shared: campaigns get edited under time
pressure and must not be able to break each other or the main site.

### Disabling a page

Three approaches in use:

| Method | Example | Reversal |
|---|---|---|
| `notFound()` guard | `/challenge`, `/consult49` | Delete two lines |
| Feature flag | `/gip` — `PAGE_ENABLED = false` | Flip to `true` |
| Folder rename | `_brides` | Remove the `_` |

### Asset manifests

`/innovation` declares every image in `content/innovation-assets.ts` with
intrinsic dimensions. Missing files render a placeholder at the correct aspect
ratio rather than breaking the layout, so the page ships before its artwork
does. Image paths appear nowhere else in the codebase.

---

## 12. Known pitfalls

### Serverless function size

Never call `fs` or `process.cwd()` inside a layout or page module. Next cannot
trace such paths statically and bundles the entire project directory into that
route's function. This produced a **1.01 GB** function on `/innovation` against
a 250 MB Vercel limit, and the deploy failed after a successful build.

Use a static flag instead of probing the filesystem.

### File encoding on Windows

Windows PowerShell 5's `Set-Content` writes **ANSI, not UTF-8**, silently
corrupting every non-ASCII character — `₹` becomes `â‚¹`, dashes and quotes
mangle, emoji break.

Always write with:

```powershell
[System.IO.File]::WriteAllText("$PWD\path", $content, (New-Object System.Text.UTF8Encoding $false))
```

Or edit in VS Code, which handles UTF-8 correctly.

Two defences in the codebase: `app/users/page.tsx` is deliberately **pure
ASCII**, using JSX escapes like `{"\u2192"}` for symbols; and prices render the
HTML entity `&#8377;` rather than a literal `₹`.

### Route confusion

`/lp/[ref]` is the affiliate route. Campaign pages sit at the top level —
`/users`, `/challenge`, `/consult49` — **not** under `/lp/`.

### Multiple lockfiles

A stray `package-lock.json` above the project directory sits alongside this
project's `pnpm-lock.yaml`, producing a workspace-root warning on every build.
Harmless, but Vercel correctly uses pnpm.

---

## 13. Operational notes

- **Neon free tier sleeps.** A "Can't reach database server" error usually
  means the branch is paused; opening the Neon console wakes it.
- **`.next` cache holds stale assets.** New files in `public/` are often not
  picked up until `.next` is deleted and the dev server restarted.
- **Prisma client regenerates on install** via a `postinstall` hook.
