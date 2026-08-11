# Merging the Affiliate and Mounjaro Pages

A proposal for serving both medication tracks from a single route.

**Status:** Design document. No code has been changed.
**Written:** 6 August 2026

---

## 1. Why this is worth doing

The two pages already share everything except three props. From
`CAMPAIGN-PAGES.md`:

```
components/affiliate-lp/
  hero-section.tsx        ─┐
  social-proof.tsx         │
  process-guarantee.tsx    ├── already shared by BOTH pages
  social-trust.tsx         │
  eligibility-faq.tsx     ─┘
  page.tsx                 ← composition A
components/mounjaro-lp/
  page.tsx                 ← composition B, imports from affiliate-lp
```

The only differences between the two compositions:

| | Affiliate | Mounjaro |
|---|---|---|
| Plans fetched | `/api/plans` | `/api/plans?type=MOUNJARO` |
| `pageTitle` | default | "Mounjaro Based Complete Transformation Plan" |
| `medicationType` | not passed | `"MOUNJARO"` |
| Banner | to `/gip`, hidden | to `/lp/ABHI`, visible |

So the merge is not a rewrite. It is deleting one of two nearly identical
composition files and moving the difference into state.

**What it buys you**

- One page to test, not two
- A visitor undecided between medications does not have to leave and re-enter
  a funnel to compare
- The cross-link banners disappear — they exist only because the pages are
  separate
- The `medicationType` prop already threads through `hero-section.tsx`, so the
  poster-switching logic needs no change

**What it costs**

- Ad campaigns that currently point at a medication-specific URL lose their
  medication-specific landing
- One more decision on the page, at the moment of highest intent
- Affiliate attribution needs care — see §6

---

## 2. Proposed route

```
/plans/[ref]        →  merged page, affiliate-attributed
```

Reusing the `[ref]` pattern keeps affiliate validation and the 90-day cookie
working exactly as they do now.

**Existing routes** should redirect rather than 404, so live links and ad
campaigns keep working:

| Old | New | Type |
|---|---|---|
| `/lp/[ref]` | `/plans/[ref]` | 308 permanent |
| `/gip` | `/plans/ABHI?med=mounjaro` | 308 permanent |

A **308** preserves the method and tells search engines the move is permanent.
Google Ads treats a same-domain redirect as acceptable, but the Final URL in
each campaign should still be updated to point at the new route directly —
redirect chains cost load time at exactly the wrong moment.

---

## 3. How the toggle works

One piece of state at the top of the page:

```
medicationType : "SEMAGLUTIDE" | "MOUNJARO"
```

Everything below reacts to it.

```
                    ┌─────────────────────────┐
                    │   medicationType state  │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
   plans fetch              hero heading            plan posters
 /api/plans?type=…      pageTitle switches      mounjaro-*.png or not
        │
        ▼
   plan cards re-render with the new medication's prices
```

**Initial value** comes from, in order of precedence:

1. `?med=mounjaro` in the URL — so ads can still deep-link to a medication
2. Otherwise `SEMAGLUTIDE`, the default track

**Placement.** The toggle belongs immediately above the plan cards, not in the
page header. It is a plan-selection control, and putting it beside the thing
it changes makes that legible. In the header it reads as navigation.

**Labels.** Use the medication names patients recognise, with the molecule
underneath:

```
   ┌──────────────────┬──────────────────┐
   │   Semaglutide    │    Mounjaro      │
   │   Wegovy-class   │   Tirzepatide    │
   └──────────────────┴──────────────────┘
```

---

## 4. What changes and what does not

### Changes with the toggle

| Element | Behaviour |
|---|---|
| Plan cards | Refetch from `/api/plans?type=…`, prices and durations update |
| Plan posters | `hero-section.tsx` already switches on `medicationType` |
| Hero heading | Swaps between the two `pageTitle` values |

### Stays identical

Every one of these is medication-agnostic today and should remain so:

| Section | Why it does not change |
|---|---|
| `NewsSection` | Press coverage, not medication-specific |
| `SocialProof` | Stats are programme-wide |
| `ProcessGuarantee` | The six delivery steps are the same either way |
| `SocialTrust` | Testimonials and the expert team are shared |
| `EligibilityFAQ` | Symptom cards and FAQs apply to both |
| All disclaimers | Identical, and must stay identical |

**Roughly 80% of the page does not move.** That is the argument for the merge:
the content was never medication-specific in the first place.

---

## 5. Component structure after the merge

```
app/plans/[ref]/page.tsx          server: validates affiliate, 404s if inactive
        │
        ▼
components/plans-lp/page.tsx      client: owns medicationType state
        │
        ├── MedicationToggle          new, ~40 lines
        ├── HeroSection               unchanged, already takes the props
        ├── NewsSection               unchanged
        ├── SocialProof               unchanged
        ├── ProcessGuarantee          unchanged
        ├── SocialTrust               unchanged
        ├── EligibilityFAQ            unchanged
        └── OTPModal                  unchanged
```

**Deleted:** `components/mounjaro-lp/page.tsx`, and both cross-link banners.

**Renamed:** `components/affiliate-lp/` → `components/plans-lp/`, since it now
serves a merged page rather than an affiliate-only one. Optional, but the old
name will mislead whoever reads it next.

**Untouched:** all five section components. Their props already support
everything the merged page needs.

---

## 6. Things that need deciding first

### Affiliate attribution

`/lp/[ref]` sets a 90-day `affiliate_ref` cookie and fires `track-click` on
mount. That behaviour must move to the merged route unchanged, or commission
tracking silently stops.

**Open question:** should the medication toggle be recorded against the click?
Knowing which track a referred visitor chose is useful, but it means either a
second `track-click` call or an extra field. Neither is hard; it needs a
decision rather than a default.

### The header "Pricing" link

`components/header.tsx` currently points at `/lp/ABHI`, so every homepage
visitor who clicks Pricing is attributed to that affiliate for 90 days.

Whatever the merged route becomes, that link needs revisiting. A generic
`/plans` with no `[ref]` — no cookie, no attribution — is the more defensible
destination for site-wide navigation.

### Ad campaigns

Any Google or Meta campaign whose Final URL is `/gip` or `/lp/…` must be
updated. Redirects will hold in the interim, but the display URL and the
destination should match before spend resumes.

### Whether `/gip` should return at all

It is currently disabled by `PAGE_ENABLED = false`. If the merge happens,
`/gip` need never come back as a page — only as a redirect.

---

## 7. Carried-over issues to fix during the merge

These already exist and would be cheapest to fix while the code is open.
Detail in `CAMPAIGN-PAGES.md` §8.

| Issue | Note |
|---|---|
| **Plan matching by first word** | `"Lean Start"`, `"Lean Pro"` and `"Lean Champion"` all reduce to `"lean"`, so a user can be charged for a plan they did not click. Match by plan `id`. **This gets worse after the merge** — two medication tracks means more plans in the array to collide with |
| `"Proven science, guaranteed results."` | Unqualified guarantee in `social-proof.tsx` |
| `"Real results, sustained for life"` | Unqualified durability claim in `process-guarantee.tsx` |
| `/gip` metadata | "Guaranteed 10% weight loss in 6 months or full refund" — would carry over to the merged page's metadata if copied verbatim |
| `doctor-consult.tsx` | Imported by neither page. Delete or wire it in |
| `hero-section.tsx.bak2` | Stale backup from the encoding repair |
| `"Click here â†’"` | Mojibake in the Mounjaro banner — moot once banners are deleted |

The plan-matching bug is the one to fix **before** the merge rather than
during it. It is a billing correctness problem today, and merging two plan
sets into one page increases the number of titles that can collide.

---

## 8. Suggested sequence

1. Fix plan matching by `id` — independently valuable, do it first
2. Create `app/plans/[ref]/page.tsx`, copying the affiliate route's validation
3. Create `components/plans-lp/page.tsx` from the affiliate composition, with
   `medicationType` as state
4. Add `MedicationToggle` above the plan cards
5. Read `?med=` on mount for deep-linking
6. Verify both tracks: prices, posters, headings, checkout
7. Verify affiliate cookie and `track-click` still fire
8. Add 308 redirects from `/lp/[ref]` and `/gip`
9. Update the header Pricing link
10. Update ad campaign Final URLs
11. Delete `components/mounjaro-lp/`, both banners, and the stale `.bak2`

Steps 1 through 7 are reversible and can be tested locally without touching
anything live. Steps 8 onward change public behaviour.

---

## 9. The case against

Worth stating, since the merge is not obviously correct.

**Medication-specific landing pages convert better** when the ad promised a
specific medication. Someone who searched "Mounjaro India" and clicks an ad
saying Mounjaro expects to land on Mounjaro — not on a page where they must
find a toggle. The `?med=mounjaro` deep link mitigates this, but the page
still has a visible control implying a choice they had already made.

**Two pages allow divergence.** Right now the content is identical, but that
may be a limitation rather than a feature — Mounjaro and semaglutide have
different dosing, side-effect profiles and price points. Merging makes
divergence harder later.

**The current duplication is small.** One composition file, ~90 lines. That is
a low maintenance burden for the flexibility it preserves.

The strongest argument for merging is not code cleanliness — it is that a
visitor comparing medications currently has to leave one funnel and enter
another. If that comparison is a real part of how people decide, the merge is
worth it. If most arrive already decided, it is not.
