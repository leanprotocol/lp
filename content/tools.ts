/**
 * Health calculator content.
 *
 * Shared by /bmi-calculator, /bmr-calculator and /waist-to-hip-calculator,
 * which all render the same tabbed component with a different opening tab.
 *
 * Thresholds here are Asian-Indian, not WHO. Indian bodies accumulate
 * visceral fat at lower weights, so overweight starts at 23 rather than 25.
 * Changing these changes what the page tells people about their health -
 * treat them as clinical copy, not styling.
 */

export const hero = {
  eyebrow: "FREE HEALTH TOOLS",
  headingA: "Numbers first,",
  headingB: "then a plan.",
  body:
    "Three quick calculators to give you a baseline. They're a starting point for a conversation with a doctor \\u2014 not a diagnosis.",
};

export const TAB_NAMES = ["BMI Calculator", "BMR Calculator", "Waist to Hip Ratio"];

export const ACTIVITIES: Array<[string, string, number]> = [
  ["Sedentary", "Little or no exercise", 1.2],
  ["Lightly active", "1-3 days a week", 1.375],
  ["Moderately active", "3-5 days a week", 1.55],
  ["Very active", "6-7 days a week", 1.725],
  ["Athlete", "Twice daily training", 1.9],
];

export const tools = [
  {
    title: "Body Mass Index",
    blurb:
      "Weight relative to height, read against Asian-Indian cut-offs \\u2014 which sit lower than the Western thresholds most calculators use.",
    resultLabel: "YOUR BMI",
    resultUnit: "kg/m\\u00B2",
    footnote:
      "BMI says nothing about muscle, fat distribution or hormones. Our protocol starts with a full blood panel instead.",
  },
  {
    title: "Basal Metabolic Rate",
    blurb:
      "Energy your body uses at rest, using the Mifflin-St Jeor equation, multiplied by how much you move.",
    resultLabel: "DAILY ENERGY NEED",
    resultUnit: "kcal per day",
    footnote:
      "Deficits set without medical supervision usually cost muscle. Our dietitians build the target around protein first.",
  },
  {
    title: "Waist to Hip Ratio",
    blurb:
      "Where fat sits matters more than how much you weigh. For Indian bodies this is often the more honest signal.",
    resultLabel: "YOUR RATIO",
    resultUnit: "waist \\u00F7 hip",
    footnote:
      "Abdominal fat responds well to a protocol built around the root cause \\u2014 hormones, sleep, insulin response.",
  },
];

export const bmi = {
  bands: ["Underweight", "Healthy range", "Overweight (Asian)", "Obese (Asian)"],
  notes: [
    "Below the healthy range. A doctor should look at why before any weight programme is considered.",
    "Within the healthy range for Asian populations. Waist-to-hip ratio is the better next signal.",
    "Above the healthy range using Asian-Indian cut-offs, which are lower than Western ones. Worth a metabolic panel.",
    "In the obese range using Asian-Indian cut-offs. Eligibility for a doctor-led protocol is worth checking.",
  ],
  scale: [
    ["Underweight", "under 18.5", "#A8BEB7"],
    ["Healthy", "18.5 \\u2013 22.9", "#C8D9A7"],
    ["Overweight", "23.0 \\u2013 24.9", "#C9A84C"],
    ["Obese", "25.0 and above", "#C85A42"],
  ] as Array<[string, string, string]>,
};

export const whr = {
  bands: ["Low risk", "Moderate risk", "High risk"],
  notes: [
    "Fat distribution is in the lower-risk range. Keep an eye on it as weight changes.",
    "Fat is concentrating around the middle. This is the pattern most linked to metabolic risk in Indian bodies.",
    "A high ratio signals significant abdominal fat, which carries more metabolic risk than total weight alone.",
  ],
  scaleMale: [
    ["Low risk", "under 0.90", "#C8D9A7"],
    ["Moderate risk", "0.90 \\u2013 0.99", "#C9A84C"],
    ["High risk", "1.00 and above", "#C85A42"],
  ] as Array<[string, string, string]>,
  scaleFemale: [
    ["Low risk", "under 0.80", "#C8D9A7"],
    ["Moderate risk", "0.80 \\u2013 0.84", "#C9A84C"],
    ["High risk", "0.85 and above", "#C85A42"],
  ] as Array<[string, string, string]>,
};

export const limits = {
  headingA: "A number is a signal,",
  headingB: "not a diagnosis.",
  body:
    "BMI, BMR and waist-to-hip each describe one narrow thing. Your protocol starts by finding the root cause behind them \\u2014 with a full metabolic and hormone panel, read by a doctor.",
  cards: [
    { title: "BMI misses muscle",
      text: "Two people at the same BMI can carry completely different amounts of fat. It was designed for populations, not individuals." },
    { title: "India's thresholds are lower",
      text: "Indian bodies accumulate visceral fat at lower weights, so the overweight cut-off starts at 23, not 25." },
    { title: "Hormones don't show up here",
      text: "Thyroid, insulin resistance and cortisol shape your weight more than arithmetic does. That needs a blood panel." },
  ],
};

export const cta = { label: "Check my eligibility", href: "https://forms.leanprotocol.in/" };

export const disclaimer =
  "These calculators are for general awareness only and are not medical advice or a diagnosis. Speak to a qualified doctor about your individual health.";
