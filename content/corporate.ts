/**
 * /corporate - employee wellness, B2B.
 *
 * Conventions follow content/psp.ts and content/home-v2.ts:
 *   - no JSX, plain data only
 *   - pure ASCII, \u escapes for symbols
 *   - any claim carrying "*" keeps its note in the same block
 *
 * UNVERIFIED VALUES are wrapped in [SQUARE BRACKETS], the same convention
 * /innovation uses. isReady() below hides anything still bracketed, so the
 * page can ship before every number is signed off rather than shipping a
 * placeholder to a CHRO.
 */

export const isReady = (v: string) => !(v.trim().startsWith("[") && v.trim().endsWith("]"));

export const company = {
  legalName: "Lean Protocol Private Limited",
  email: "corporate@leanprotocol.in",
  phone: "[PHONE]",
  canonical: "https://www.leanprotocol.in/corporate",
};

export const NAV = [
  { label: "The gap", href: "#gap" },
  { label: "How it works", href: "#how" },
  { label: "What we measure", href: "#measure" },
  { label: "For HR", href: "#hr" },
  { label: "Privacy", href: "#privacy" },
];

/* ---------------- hook ---------------- */

export const hero = {
  eyebrow: "EMPLOYEE HEALTH \u00B7 FOR INDIAN WORKPLACES",
  headA: "Most wellness programmes",
  headB: "report attendance.",
  headC: "We report HbA1c.",
  lede:
    "A full metabolic blood panel at month zero. Doctor-led care for the people who need it. A second panel at month six \u2014 and a board-ready report of what actually moved.",
  ctaPrimary: { label: "Book a 20-minute walkthrough", href: "#talk" },
  ctaSecondary: { label: "See what we measure", href: "#measure" },
  markers: [
    "Doctor-led, not app-only",
    "Before and after bloodwork",
    "Aggregate reporting, DPDP-aligned",
  ],
};

/* ---------------- the gap ---------------- */

export const gap = {
  id: "gap",
  eyebrow: "WHY THE USUAL PROGRAMME DOES NOT WORK",
  headA: "Step challenges are easy to run",
  headB: "and impossible to defend.",
  body:
    "Most corporate wellness in India is measured by participation: how many joined, how many logged in, how many walked. None of that tells a CHRO whether anyone got healthier \u2014 and none of it survives a budget review.",
  cards: [
    {
      title: "Engagement is not an outcome",
      text: "Logins and step counts describe activity, not health. A programme can be well attended and change nothing clinically.",
    },
    {
      title: "Insurance starts after the illness",
      text: "Group cover pays once someone is already unwell. Nothing in it is designed to stop the HbA1c climbing in the first place.",
    },
    {
      title: "Indian bodies cross the line earlier",
      text: "Asian-Indian thresholds for overweight and metabolic risk sit lower than Western ones, so employees who look fine on a BMI chart can already be insulin resistant.",
    },
    {
      title: "Nobody re-tests",
      text: "Annual health checks produce a PDF and a filing cabinet. Without a second panel against the first, there is no way to show what changed.",
    },
  ],
};

/* ---------------- how it works ---------------- */

export const how = {
  id: "how",
  eyebrow: "THE PROGRAMME",
  headA: "Four stages.",
  headB: "Six months.",
  body:
    "The same doctor-led protocol we run for individuals, delivered across a workforce and reported in aggregate.",
  steps: [
    {
      n: "01",
      title: "Baseline panel",
      body: "At-home or on-site collection for every participating employee. A full metabolic and hormone panel, not a basic lipid profile.",
      detail: "Weeks 1-3",
    },
    {
      n: "02",
      title: "Risk stratification",
      body: "Results are read by our clinical team and employees are grouped by risk, not by job title. Most need nutrition and habit work; some need a doctor.",
      detail: "Week 4",
    },
    {
      n: "03",
      title: "Doctor-led care",
      body: "Each cohort gets its own pathway \u2014 dietitian-led coaching for the low-risk group, physician review and closer monitoring for the high-risk one. Medication only where a doctor determines it is clinically appropriate.",
      detail: "Months 1-6",
    },
    {
      n: "04",
      title: "Re-test and report",
      body: "A second panel against the first, same markers, same labs. You get the delta per cohort and an anonymised report you can take to the board.",
      detail: "Month 6",
    },
  ],
};

/* ---------------- what we measure ---------------- */

export const measure = {
  id: "measure",
  eyebrow: "WHAT WE MEASURE",
  headA: "The report is bloodwork,",
  headB: "not attendance.",
  body:
    "Every marker below is captured at baseline and again at month six, so the change is a measurement rather than a claim.",
  markers: [
    { name: "HbA1c", why: "Three-month average blood glucose. The single clearest signal of metabolic direction." },
    { name: "Fasting insulin and glucose", why: "Catches insulin resistance years before a diabetes diagnosis." },
    { name: "Lipid profile", why: "LDL, HDL, triglycerides. Cardiovascular risk, and one of the fastest to respond." },
    { name: "Blood pressure", why: "Recorded at every review, not once a year." },
    { name: "Liver markers", why: "ALT, AST and fatty liver indicators, which track closely with metabolic load." },
    { name: "Thyroid panel", why: "Commonly missed, and a frequent reason weight will not move." },
    { name: "Vitamin D and B12", why: "Widespread deficiency in Indian office populations, and directly tied to fatigue." },
    { name: "Body composition", why: "Weight, waist circumference and fat-to-muscle ratio \u2014 more honest than BMI alone." },
  ],
  note:
    "Individual results vary. Marker selection is reviewed per cohort by our clinical team; not every panel is appropriate for every workforce.",
};

/* ---------------- for HR ---------------- */

export const hr = {
  id: "hr",
  eyebrow: "FOR HR AND BENEFITS TEAMS",
  headA: "One dashboard.",
  headB: "No individual health data.",
  body:
    "You see the shape of your workforce's health and how it moves. You never see whose HbA1c is whose \u2014 that stays between the employee and their doctor.",
  cards: [
    { title: "Cohort movement", text: "How many employees moved from high risk to moderate, and moderate to low, over six months." },
    { title: "Participation and completion", text: "Enrolment, panel completion and consult attendance by location or business unit." },
    { title: "Marker deltas in aggregate", text: "Average change in HbA1c, lipids, blood pressure and weight across each cohort." },
    { title: "Board-ready export", text: "A dated report you can put in front of finance, with methodology stated." },
  ],
  footnote:
    "Reporting thresholds apply: cohorts below a minimum size are suppressed so no individual can be identified by inference.",
};

/* ---------------- calculator ---------------- */

export const calc = {
  id: "calc",
  eyebrow: "PROGRAMME SCALE",
  headA: "What a programme",
  headB: "looks like at your size.",
  body:
    "Move the slider to see the delivery footprint. These are programme inputs \u2014 what gets collected and delivered \u2014 not predicted outcomes.",
  min: 50,
  max: 5000,
  initial: 500,
  /* Delivery ratios. Change here, nowhere else. */
  panelsPerEmployee: 2,
  dietitianPerEmployee: 4,
  doctorReviewRate: 0.35,
  note:
    "Indicative delivery volumes based on full participation. Actual figures depend on enrolment, which we agree with you before the programme starts.",
};

/* ---------------- privacy ---------------- */

export const privacy = {
  id: "privacy",
  eyebrow: "DATA AND CONSENT",
  headA: "The employer never sees",
  headB: "an individual's results.",
  points: [
    "Each employee consents separately, to us, before any sample is collected. Participation is voluntary and declining carries no consequence at work.",
    "Clinical results go to the employee and their assigned clinician. They are never shared with the employer, in any form that could identify a person.",
    "Employer reporting is aggregate only, with small cohorts suppressed so nobody can be identified by working backwards.",
    "Data is processed under India's Digital Personal Data Protection Act 2023, with defined retention periods and a named grievance contact.",
    "Employees can withdraw consent at any time, and ask for their data to be erased, without telling their employer why.",
  ],
  note:
    "This summary is not a substitute for the data processing agreement, which we provide before any programme begins.",
};

/* ---------------- proof ---------------- */

export const proof = {
  eyebrow: "WHAT WE BRING",
  stats: [
    { value: "[N]", label: "Employees enrolled to date" },
    { value: "[N]", label: "Panels completed" },
    { value: "[N]", label: "Average HbA1c change at six months*" },
    { value: "[N]", label: "Programme completion rate" },
  ],
  note:
    "*Aggregate across participating cohorts. Individual results vary and depend on clinical assessment.",
  fallback:
    "We publish outcome figures once a cohort has completed its six-month re-test, rather than before. Ask us for the current dataset under NDA.",
};

/* ---------------- FAQ ---------------- */

export const faqs = [
  {
    q: "How is this different from our group health insurance?",
    a: "Insurance pays after someone is ill. This is designed to change the markers that lead to the claim \u2014 and to show you, with a second blood panel, whether it did.",
  },
  {
    q: "How is it different from a wellness app or a steps challenge?",
    a: "Those measure participation. We measure blood. Employees who need clinical care get a doctor, not a push notification.",
  },
  {
    q: "Will we see which employees are unwell?",
    a: "No. You get cohort-level movement and completion data. Individual results go to the employee and their clinician only, and small cohorts are suppressed so nobody can be identified by inference.",
  },
  {
    q: "Is medication part of the programme?",
    a: "Only where a licensed physician determines it is clinically appropriate for that individual, after reviewing their panel and history. It is never automatic and never a condition of taking part.",
  },
  {
    q: "What about employees outside the main office?",
    a: "Sample collection is at-home as well as on-site, and consults are remote by default, so distributed and factory-floor teams are covered on the same terms.",
  },
  {
    q: "What do you need from our HR team?",
    a: "An enrolment window, a communications channel to employees, and a nominated contact. We run the clinical side, the logistics and the reporting.",
  },
  {
    q: "How long before we see anything?",
    a: "Baseline panels complete in the first three weeks, and you get a risk-profile report of your workforce at week four. Outcome data comes at month six, when the second panel lands.",
  },
];

/* ---------------- CTA ---------------- */

export const cta = {
  id: "talk",
  eyebrow: "NEXT STEP",
  headA: "Start with your",
  headB: "workforce's baseline.",
  body:
    "A 20-minute call: what we would measure for your team, what the six-month report looks like, and what it costs. No obligation to run anything.",
  bullets: [
    "Pan-India, on-site and at-home collection",
    "GST-compliant invoicing",
    "Data processing agreement provided up front",
  ],
  form: {
    submit: "Request a walkthrough",
    sending: "Sending...",
    done: "Thank you. Our team will be in touch within one working day.",
    sizes: ["1-50", "51-200", "201-500", "501-1000", "1000+"],
    consent:
      "I agree to be contacted about this enquiry and accept the Privacy Policy.",
  },
};
