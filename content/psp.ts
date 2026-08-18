// content/psp.ts
// Copy for the B2B Patient Support Programme page at /psp.
// Pure ASCII: unicode via \u escapes. Indian/British English.
//
// Length is an acceptance criterion. Visible main-page copy must stay
// under 950 words. Do not add explanatory sentences here.

export const NAV = [
  { label: "How it works", href: "#how" },
  { label: "What we run", href: "#run" },
  { label: "Care areas", href: "#areas" },
  { label: "Pilot", href: "#pilot" },
];

export const CTA = {
  primary: "Request Demo",
  secondary: "Request our Post-Prescription Patient Support Blueprint",
};

export const HERO = {
  eyebrow: "WHITE-LABELLED PATIENT SUPPORT PROGRAMMES",
  h1: "Build the patient experience around your therapy.",
  copy: "Lean Protocol runs patient support under your brand, from education and follow-ups to diagnostics, delivery and doctor coordination.",
  support: "Built for metabolic and chronic therapies across India.",
  audience: "For pharma commercial, portfolio and medical teams.",
};

export const VALUE = {
  label: "WHY SUPPORT MATTERS",
  h2: "A prescription is only the beginning.",
  intro:
    "Patients still need help to start well, manage concerns and return for review. That support can strengthen continuity and the experience around your brand.",
  blocks: [
    {
      title: "Help more patients start",
      copy: "Clear onboarding, education and first-dose guidance.",
    },
    {
      title: "Help patients stay connected",
      copy: "Follow-ups, reminders and support between doctor visits.",
    },
    {
      title: "See where support is needed",
      copy: "Track enrolment, engagement, symptoms, follow-ups and reasons for drop-off.",
    },
  ],
  line: "When fewer patients drop off unnecessarily, more can continue for as long as their doctor recommends.",
};

export const EVIDENCE = {
  h3: "What published PSPs have shown",
  stats: [
    { value: "29.3%", label: "higher adherence observed" },
    { value: "22.0%", label: "lower discontinuation observed" },
    { value: "12.2%", label: "higher drug spending observed over 12 months" },
  ],
  note: "Matched US observational study of 2,268 adalimumab patients. Manufacturer-funded. Associations are not Lean Protocol outcomes or forecasts.",
  href: "https://www.jmcp.org/doi/pdf/10.18553/jmcp.2019.18443",
};

export const JOURNEY = {
  label: "HOW IT WORKS",
  h2: "From prescription to continued care.",
  steps: [
    {
      title: "Enrol",
      copy: "Verify the prescription, capture consent and understand the patient.",
    },
    {
      title: "Educate",
      copy: "Provide the online course, diet plan, first-dose guidance and regular expert-led webinars.",
    },
    {
      title: "Follow up",
      copy: "Check in, track symptoms and escalate concerns to the treating doctor.",
    },
    {
      title: "Coordinate",
      copy: "Connect patients with diagnostics, follow-up appointments and authorised delivery partners.",
    },
    {
      title: "Continue",
      copy: "Support doctor reviews, refills and the next clinician-approved step.",
    },
  ],
};

export const RUN = {
  label: "WHAT WE RUN",
  h2: "The care team and tools behind your programme.",
  blocks: [
    {
      title: "Patient education",
      copy: "Online courses, personalised diet plans, regular webinars and multilingual content.",
    },
    {
      title: "Human support",
      copy: "Dietitians, coaches and care coordinators who stay connected with patients.",
    },
    {
      title: "Access and follow-up",
      copy: "Diagnostics, licensed-pharmacy delivery, appointment scheduling and approved supplements where appropriate.",
    },
    {
      title: "A clearer programme view",
      copy: "See enrolment, engagement, symptom trends, follow-up attendance and reasons for drop-off.",
    },
  ],
};

export const AREAS = {
  label: "CARE AREAS",
  h2: "Support across metabolic and chronic care.",
  intro:
    "The same care team and technology can support different therapies and patient needs.",
  // size drives the mosaic: "lg" spans two columns on desktop.
  // img is empty until approved photography is available; the tile then
  // renders as a soft branded image well. Fill in the paths below and
  // drop the files into /public/psp/areas/ to switch them on.
  cards: [
    { title: "Obesity & GLP-1", size: "lg", img: "/psp/areas/obesity.webp", alt: "An adult walking outdoors in everyday clothing." },
    { title: "Type 2 diabetes", size: "sm", img: "/psp/areas/diabetes.webp", alt: "A person checking a glucose reading at home." },
    { title: "High blood pressure", size: "sm", img: "/psp/areas/blood-pressure.webp", alt: "A home blood-pressure check at a kitchen table." },
    { title: "Heart health", size: "lg", img: "/psp/areas/heart.webp", alt: "An older adult walking in a park with family." },
    { title: "PCOS", size: "sm", img: "/psp/areas/pcos.webp", alt: "A woman in an everyday wellness setting." },
    { title: "Sleep health", size: "sm", img: "/psp/areas/sleep.webp", alt: "A calm bedroom in soft morning light." },
    { title: "High cholesterol", size: "sm", img: "/psp/areas/cholesterol.webp", alt: "Heart-conscious food being prepared at home." },
  ],
};

export const MODEL = {
  h2: "Your brand. Our care team.",
  copy: "The patient sees a programme built around your therapy. Lean Protocol runs the care team, workflows and technology behind it.",
  flow: ["Your therapy", "Doctor prescribes", "Lean supports", "You see progress"],
  brandLine:
    "Brand the onboarding, education, webinars, helpline, WhatsApp, patient app and reports.",
};

export const PILOT = {
  h3: "Start small. Learn quickly. Scale with confidence.",
  copy: "Begin with one therapy and a defined North India pilot. Agree the success measures, launch the programme, then expand into more regions and languages.",
  stages: ["Design", "Launch", "Measure and scale"],
  proof:
    "Lean Protocol already has trained care teams, patient education, follow-up workflows and care-team technology.",
};

export const FINAL = {
  h2: "Let's build the programme around your therapy.",
  copy: "Tell us the therapy and geography. We will show you what a defined pilot could look like.",
};

export const THERAPY_OPTIONS = [
  "Obesity and GLP-1",
  "Type 2 diabetes",
  "High blood pressure",
  "Heart health",
  "PCOS",
  "Sleep health",
  "High cholesterol",
  "Other",
];

export const FAQS = [
  {
    q: "Can the programme be fully white-labelled?",
    a: "Yes. The programme can run entirely under your brand, with a dedicated helpline, landing page, patient app, education and reports.",
  },
  {
    q: "Does Lean Protocol prescribe or dispense medicines?",
    a: "No. Diagnosis, prescribing and dose decisions rest with the treating physician. Medicines are dispensed by authorised third-party pharmacies.",
  },
  {
    q: "How are symptoms and safety concerns handled?",
    a: "Symptoms are logged continuously and routed to the treating doctor through defined escalation. Adverse events follow your agreed pharmacovigilance process.",
  },
];

export const DISCLAIMER =
  "Lean Protocol supports patients after a valid prescription. Diagnosis, prescribing and dose decisions remain with the treating physician. Medicines are dispensed by authorised pharmacies. The programme is not an emergency service.";
