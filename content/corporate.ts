/**
 * /corporate - employee wellness, B2B.
 *
 * Rebuilt in November 2026 from the approved design (claude.ai artifact
 * 8ZK3P4SEz5f2AN4Eu9TTZ4). The previous HbA1c / six-month version of this
 * file is in the installer backup if anything needs to come back.
 *
 * Conventions follow content/psp.ts and content/home-v2.ts:
 *   - no JSX, plain data only
 *   - pure ASCII, \u escapes for symbols
 *   - icon names map to components/corporate/corporate-icons.tsx
 */

export const company = {
  legalName: "Lean Protocol Private Limited",
  email: "corporate@leanprotocol.in",
  canonical: "https://www.leanprotocol.in/corporate",
};

export const NAV = [
  { label: "Why it matters", href: "#why" },
  { label: "Workshops", href: "#workshops" },
  { label: "What changes", href: "#outcomes" },
  { label: "Care team", href: "#team" },
  { label: "Reports", href: "#reports" },
];

/* ---------------- hero ---------------- */

export const hero = {
  eyebrow: "Corporate wellness",
  headA: "Good health is the foundation of",
  headB: "a productive workforce.",
  ctaPrimary: { label: "Get a quote", href: "#talk" },
  ctaSecondary: { label: "Book a free workshop", href: "#workshops" },
  image: {
    src: "/corporate/hero.webp",
    alt: "Colleagues at a desk, one stretching at her chair",
    width: 1400,
    height: 933,
  },
};

/* ---------------- moving strip under the hero ---------------- */

export const includes = [
  "Blood tests at the office or at home",
  "Doctor consultations for anything flagged",
  "Dietitian support built around Indian food",
  "Add-on therapies where they are needed",
  "A quarterly report that names nobody",
];

/* ---------------- why it matters ---------------- */

/* image: a square photo in public/corporate/conditions/ (800x800 WebP).
   Set it to "" to fall back to the plain brand-green tile. */
export const why = {
  id: "why",
  eyebrow: "Why it matters",
  lines: ["Most of it is already there.", "Almost none of\u00A0it is diagnosed."],
  conditions: [
    { icon: "drop", title: "Type 2 diabetes and prediabetes", image: "/corporate/conditions/diabetes.webp" },
    { icon: "heartPulse", title: "High blood pressure", image: "/corporate/conditions/blood-pressure.webp" },
    { icon: "liver", title: "Fatty liver", image: "/corporate/conditions/fatty-liver.webp" },
    { icon: "cholesterol", title: "High cholesterol", image: "/corporate/conditions/cholesterol.webp" },
    { icon: "thyroid", title: "Thyroid disorders", image: "/corporate/conditions/thyroid.webp" },
    { icon: "hormone", title: "PCOS and hormonal health", image: "/corporate/conditions/pcos-hormones.webp" },
    { icon: "waist", title: "Obesity and central weight gain", image: "/corporate/conditions/weight.webp" },
    { icon: "moon", title: "Sleep and stress disorders", image: "/corporate/conditions/sleep-stress.webp" },
  ],
};

/* ---------------- care team ---------------- */

export const team = {
  id: "team",
  eyebrow: "Your care team",
  head: "The doctors behind the programme.",
  doctors: [
    { name: "Dr. Nishant Jain", role: "MD, DM Endocrinology", image: "/corporate/doctor-nishant-jain.webp" },
    { name: "Dr. Gautam Kumar", role: "MD, DM Endocrinology", image: "/corporate/doctor-gautam-kumar.webp" },
    { name: "Dr. Akhil Konduru", role: "MD, Internal Medicine", image: "/corporate/doctor-akhil-konduru.webp" },
    { name: "Dr. Siddharth Garg", role: "MD, Internal Medicine", image: "/corporate/doctor-siddharth-garg.webp" },
  ],
};

/* ---------------- outcomes ---------------- */

export const outcomes = {
  id: "outcomes",
  eyebrow: "What changes",
  head: "The results we measure.",
  items: [
    {
      icon: "calendar",
      title: "Fewer days lost",
      text: "Problems treated early mean fewer sick days.",
      measure: "Measured: sick days per employee",
    },
    {
      icon: "search",
      title: "Found before it is felt",
      text: "Blood tests show problems years before symptoms do.",
      measure: "Measured: new findings per 100 screened",
    },
    {
      icon: "trend",
      title: "Markers that actually move",
      text: "Sugar, cholesterol and BP, guided by a doctor.",
      measure: "Measured: repeat blood test at 12 weeks",
    },
    {
      icon: "heart",
      title: "A reason to stay",
      text: "Employees value health care they actually use.",
      measure: "Measured: participation and repeat visits",
    },
  ],
  note:
    "Your own numbers go here once the first two quarters are in. We would rather report yours than quote someone else\u2019s.",
};

/* ---------------- statement band ---------------- */

export const statement = {
  head: "A blood report on a PDF changes nothing.",
  image: {
    src: "/corporate/care-conversation.webp",
    alt: "A doctor talking with a patient",
    width: 1237,
    height: 720,
  },
};

/* ---------------- add-ons ---------------- */

export const addons = {
  eyebrow: "Add-ons",
  head: "Add what your workforce actually needs.",
  sub: "Not every workforce needs the same things.",
  items: [
    { icon: "scale", title: "Weight management", text: "Doctor-led. GLP-1 only where prescribed." },
    { icon: "drop", title: "Diabetes management", text: "Sugar control with a doctor and a dietitian." },
    { icon: "thyroid", title: "Thyroid management", text: "Tests, dosing and follow-up." },
    { icon: "hormone", title: "Hormone management", text: "PCOS, menopause and testosterone." },
    { icon: "heartPulse", title: "Heart health", text: "Blood pressure and cholesterol, tracked." },
    { icon: "liver", title: "Fatty liver care", text: "Diet first, with repeat tests." },
    { icon: "bowl", title: "Nutrition plans", text: "Indian food, built around a working day." },
    { icon: "mind", title: "Mental health sessions", text: "Confidential, with licensed professionals." },
    { icon: "physio", title: "Physiotherapy", text: "For what desk work does to backs and necks." },
    { icon: "moon", title: "Sleep and stress care", text: "Guided by clinicians, not apps." },
    { icon: "family", title: "Family access", text: "Spouses and parents, same doctors." },
    { icon: "dumbbell", title: "Cult Pass Home", text: "At-home fitness, not just for gym-goers." },
  ],
};

/* ---------------- workshops ---------------- */

export const workshops = {
  id: "workshops",
  eyebrow: "Free workshops",
  head: "Start with a workshop. It costs nothing.",
  points: [
    "Run at your office or online, on your schedule",
    "A doctor and a dietitian, taking live questions",
    "Practical nutrition and movement for a working day",
    "No cost, and no obligation to buy anything afterwards",
  ],
  image: {
    src: "/corporate/workshop-live.webp",
    alt: "A live Lean Protocol workshop on Google Meet, with 93 people on the call",
    width: 1400,
    height: 789,
  },
  card: {
    title: "Awareness and guidance, at no cost",
    text: "Most companies start here, then decide.",
    cta: { label: "Book a workshop", href: "#talk" },
  },
};

/* ---------------- quarterly reporting ---------------- */

export const reports = {
  id: "reports",
  eyebrow: "Quarterly reporting",
  head: "See how your team is doing, every quarter.",
  sub: "Every quarter. Built only from aggregates.",
  cards: [
    { chart: "participation", title: "How many took part", text: "By department and location.", wide: false },
    { chart: "prevalence", title: "What was found", text: "Prevalence, in aggregate only.", wide: false },
    { chart: "change", title: "What changed", text: "Quarter on quarter movement.", wide: false },
    { chart: "risk", title: "Where the risk sits", text: "Which groups to aim at next.", wide: false },
    {
      chart: "cover",
      title: "What it means for cover",
      text: "The picture your insurer forms at renewal, before they form it.",
      wide: true,
    },
  ],
  noteLead: "Individual results never reach you.",
  noteRest:
    " They go to the employee and their doctor. That is what the law requires, and it is why people take part.",
};

/* ---------------- partners ---------------- */

/* Logos, captions and order come from content/workshops.ts (partners.names),
   which is kept in step with the homepage strip. Only the headings live here. */
export const partnersHead = {
  eyebrow: "Delivered with",
  head: "Delivered with partners you already know.",
};

/* ---------------- press ---------------- */

export const press = {
  eyebrow: "In the news",
  head: "Written about, not just advertised.",
  items: [
    {
      name: "Zee News",
      href: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem",
      logo: "/corporate/press/zee-news.svg",
      width: 116,
      height: 44,
    },
    {
      name: "News24",
      href: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/",
      logo: "/corporate/press/news24.webp",
      width: 38,
      height: 44,
    },
    {
      name: "News Today 24x7",
      href: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
      logo: "/corporate/press/news-today-24x7.webp",
      width: 99,
      height: 44,
    },
    {
      name: "The Startup Story",
      href: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/",
      logo: "/corporate/press/the-startup-story.webp",
      width: 85,
      height: 44,
    },
    {
      name: "The Tribune",
      href: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem",
      logo: "/corporate/press/the-tribune.webp",
      width: 150,
      height: 37,
    },
    {
      name: "The Republic News",
      href: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html",
      logo: "/corporate/press/the-republic-news.webp",
      width: 115,
      height: 44,
    },
  ],
};

/* ---------------- enquiry ---------------- */

export const cta = {
  id: "talk",
  eyebrow: "Talk to us",
  head: "Tell us about your team.",
  sub: "Tell us the headcount. We come back with a number, usually the same day.",
  form: {
    sizes: ["1 to 50", "51 to 200", "201 to 500", "501 to 1,000", "More than 1,000"],
    submit: "Request a proposal",
    sending: "Sending...",
    done: "Thank you. Our team will be in touch within one working day.",
    fine: "We use these details to contact you about this enquiry. We do not sell your data.",
  },
};

/* ---------------- footer ---------------- */

export const footer = {
  disclaimer:
    "Lean Protocol is a doctor-led weight and metabolic health service. Clinical decisions, including any prescription, are made by licensed physicians after individual assessment. Results vary between individuals. Nothing on this page is medical advice.",
};
