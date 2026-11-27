/**
 * Health calculator content.
 *
 * Shared by /bmi-calculator, /bmr-calculator, /waist-to-hip-calculator and
 * /protein-calculator, which all render the same tabbed component with a
 * different opening tab.
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
    "Four quick calculators to give you a baseline. They're a starting point for a conversation with a doctor \u2014 not a diagnosis.",
};

export const TAB_NAMES = ["BMI Calculator", "BMR Calculator", "Waist to Hip Ratio", "Protein Calculator"];

/* The main heading (h1) of each calculator page, in the same order as TAB_NAMES.
   It is shown as the small label above the slogan and tells search engines
   which calculator the page is. */
export const PAGE_HEADINGS = [
  "FREE BMI CALCULATOR FOR INDIAN ADULTS",
  "FREE BMR CALCULATOR FOR INDIA \u00B7 KG AND CM",
  "FREE WAIST TO HIP RATIO CALCULATOR",
  "FREE PROTEIN CALCULATOR FOR INDIA \u00B7 GRAMS PER DAY",
];

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
      "Weight relative to height, read against Asian-Indian cut-offs \u2014 which sit lower than the Western thresholds most calculators use.",
    resultLabel: "YOUR BMI",
    resultUnit: "kg/m\u00B2",
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
    resultUnit: "waist \u00F7 hip",
    footnote:
      "Abdominal fat responds well to a protocol built around the root cause \u2014 hormones, sleep, insulin response.",
  },
  {
    title: "Daily Protein Need",
    blurb:
      "How many grams of protein to eat in a day, worked out from your body weight and what you want to do: hold your weight, lose fat or build muscle.",
    resultLabel: "YOUR DAILY PROTEIN",
    resultUnit: "grams per day",
    footnote:
      "Losing muscle along with fat is the main thing to avoid on a weight-loss plan. Our dietitians set your protein target first and build the meals around it.",
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
    ["Healthy", "18.5 \u2013 22.9", "#C8D9A7"],
    ["Overweight", "23.0 \u2013 24.9", "#C9A84C"],
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
    ["Moderate risk", "0.90 \u2013 0.99", "#C9A84C"],
    ["High risk", "1.00 and above", "#C85A42"],
  ] as Array<[string, string, string]>,
  scaleFemale: [
    ["Low risk", "under 0.80", "#C8D9A7"],
    ["Moderate risk", "0.80 \u2013 0.84", "#C9A84C"],
    ["High risk", "0.85 and above", "#C85A42"],
  ] as Array<[string, string, string]>,
};

/* Daily protein, in grams per kg of body weight. Clinical copy - have a doctor
   or dietitian confirm any change.
   - Stay at my weight: 0.83 is the allowance for Indian adults (ICMR-NIN, 2020);
     1.0 allows for meals built mostly on cereals.
   - Lose weight: 1.2 to 1.6, the range studied for keeping muscle during weight loss.
   - Build muscle: 1.4 to 2.0, the sports-nutrition range for people who train.
   The weight used is the person's own, or the weight at `referenceBmi` for their
   height when they are above it, so that extra body fat does not raise the figure.
   The same figures are explained on the page in
   components/protein-calculator/protein-info.tsx - change both together. */
export const protein = {
  referenceBmi: 23,
  /* which goal the "Protein target" row on the BMR tab uses */
  weightLossGoal: 1,
  goals: [
    {
      name: "Stay at my weight",
      hint: "Everyday health",
      low: 0.83,
      high: 1.0,
      note: "Covers a healthy adult by the Indian (ICMR-NIN) standard. The higher figure suits meals built mostly on cereals.",
    },
    {
      name: "Lose weight",
      hint: "Keep muscle, lose fat",
      low: 1.2,
      high: 1.6,
      note: "Helps you keep muscle while you lose fat. Spread it over your meals and add strength exercise.",
    },
    {
      name: "Build muscle",
      hint: "With strength training",
      low: 1.4,
      high: 2.0,
      note: "For people who do strength training most weeks. Spread it over your meals.",
    },
  ],
  goalLabel: "YOUR GOAL",
  perMeal: "Per meal, over 3 meals",
  /* {kg} is replaced with the weight the figure was worked out on */
  adjusted: "Your BMI is above 23, so this uses {kg} kg, your weight at BMI 23, not your current weight.",
  caution: "Kidney disease, pregnancy or breastfeeding: ask your doctor first.",
};

export const limits = {
  headingA: "A number is a signal,",
  headingB: "not a diagnosis.",
  body:
    "BMI, BMR and waist-to-hip each describe one narrow thing. Your protocol starts by finding the root cause behind them \u2014 with a full metabolic and hormone panel, read by a doctor.",
  cards: [
    { title: "BMI misses muscle",
      text: "Two people at the same BMI can carry completely different amounts of fat. It was designed for populations, not individuals." },
    { title: "India's thresholds are lower",
      text: "Indian bodies accumulate visceral fat at lower weights, so the overweight cut-off starts at 23, not 25." },
    { title: "Hormones don't show up here",
      text: "Thyroid, insulin resistance and cortisol shape your weight more than arithmetic does. That needs a blood panel." },
  ],
};

export const cta = { label: "Check my eligibility", href: "https://enquire.leanprotocol.in/" };

export const disclaimer =
  "These calculators are for general awareness only and are not medical advice or a diagnosis. Speak to a qualified doctor about your individual health.";
