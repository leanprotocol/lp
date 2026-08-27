/**
 * Retail comparison figures for the pricing cards.
 *
 * WHY THIS IS NOT A VIOLATION OF home-v2.ts RULE 1 ("no prices")
 * -------------------------------------------------------------
 * Nothing in this file is a price Lean Protocol charges. These are what the
 * same things cost when a person sources them separately - a consultation fee,
 * a lab's list price, a pharmacy MRP. They exist only to be compared against.
 *
 * The plan's actual price still comes from the SubscriptionPlan table via
 * /api/plans. It is NOT rendered on the card at all - the card shows the
 * struck retail total, an arrow, and a CTA.
 *
 * RULES
 * 1. Numbers only. No currency symbols - the component formats them.
 * 2. Pure ASCII. Use \u escapes for symbols.
 * 3. Every figure here is a public claim about third-party retail pricing.
 *    Keep them current and be able to substantiate each one.
 * 4. Keyed by plan name, matching content/home-v2.ts pricing.presentation.
 *    A plan with no entry here falls back to a plain card.
 *
 * Quantities are NOT derived from durationDays - the pattern is irregular.
 */

export type BreakdownLine = {
  /** Shown on the left. Keep it short enough for one line on mobile. */
  label: string
  /** Retail cost of ONE of these, in rupees. */
  unit: number
  /** How many the plan includes. Line total is unit * qty. */
  qty: number
  /**
   * Overrides the "3 x \u20B91,500" annotation with free text, for lines where
   * a count is not the point - "Unlimited", "8 sessions". The line total is
   * still unit * qty, so set unit to the total and qty to 1.
   */
  qtyLabel?: string
  /** Optional clarifier. Rendered muted and italic, after the label. */
  detail?: string
}

export type PlanBreakdown = {
  lines: BreakdownLine[]
  /**
   * Expected sum of unit * qty. The component warns in dev if the lines
   * disagree, so a mistyped figure is caught rather than quietly changing
   * the struck total.
   */
  expectedTotal: number
}

export const pricingBreakdown: Record<string, PlanBreakdown> = {
  "Lean Start": {
    lines: [
      { label: "Doctor consultation", unit: 1500, qty: 1 },
      { label: "Dietitian consultations", unit: 1500, qty: 2 },
      { label: "GLP-1 medication", unit: 2500, qty: 1, detail: "when prescribed" },
      { label: "Health coach", unit: 2000, qty: 1 },
    ],
    expectedTotal: 9000,
  },

  "Lean Champion": {
    lines: [
      { label: "Doctor consultations", unit: 1250, qty: 8 },
      {
        label: "Dietitian consultations",
        unit: 14000,
        qty: 1,
        qtyLabel: "Unlimited",
      },
      { label: "GLP-1 medication", unit: 18000, qty: 1, detail: "when prescribed" },
      { label: "Blood tests", unit: 2700, qty: 2 },
      { label: "Smart scale", unit: 1500, qty: 1, detail: "yours to keep" },
      { label: "Cult home pass", unit: 1000, qty: 6 },
      { label: "Health coach", unit: 2000, qty: 6 },
    ],
    expectedTotal: 66900,
  },

  "Lean Pro": {
    lines: [
      { label: "Doctor consultations", unit: 1500, qty: 3 },
      { label: "Dietitian consultations", unit: 1500, qty: 6 },
      { label: "GLP-1 medication", unit: 8500, qty: 1, detail: "when prescribed" },
      { label: "Blood test", unit: 2700, qty: 1 },
      { label: "Smart scale", unit: 1500, qty: 1, detail: "yours to keep" },
      { label: "Cult home pass", unit: 1000, qty: 3 },
      { label: "Health coach", unit: 2000, qty: 3 },
    ],
    expectedTotal: 35200,
  },
}

export const breakdownCopy = {
  includedHeading: "Everything included",
  totalLabel: "Self-sourced total",
  /* The card deliberately shows no price and no discount. The struck retail
     total plus an arrow is the tease; the CTA is where the number lives. */
  teaser: "Want to know our unbelievable pricing?",
  cta: "Know more",
}
