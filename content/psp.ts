// content/psp.ts
// Copy for the B2B Patient Support Programme page at /psp.
// Pure ASCII: unicode via \u escapes. Indian/British English.
//
// Length is an acceptance criterion. Visible main-page copy must stay
// under 950 words. Do not add explanatory sentences here.

export const NAV = [
  { label: "How it works", href: "#how" },
  { label: "Our execution layer", href: "#run" },
  { label: "Care areas", href: "#areas" },
  { label: "Pilot", href: "#pilot" },
];

export const CTA = {
  primary: "Get in touch",
  secondary: "Request our Post-Prescription Patient Support Blueprint",
};

export const HERO = {
  eyebrow: "CO-BRANDED PATIENT SUPPORT PROGRAMMES",
  h1: "Build the patient experience around your therapy.",
  copy: "Lean Protocol runs patient support under your brand, from education, nutrition, follow-ups, cross-selling and doctor coordination.",
  audience: "For pharma commercial, portfolio and medical teams.",
};

export const VALUE = {
  label: "WHY SUPPORT MATTERS",
  h2: "True value unlocks and scales with care.",
  intro:
    "Our internal data suggests that support improves continuity, results and the brand experience.",
};

export const EVIDENCE = {
  h3: "What published PSPs have shown",
  stats: [
    { value: "29.3%", label: "higher adherence observed" },
    { value: "22.0%", label: "lower discontinuation observed" },
    { value: "4.8 months", label: "longer on treatment observed" },
  ],
  note: "Matched US observational study of 2,268 adalimumab patients. Manufacturer-funded. Associations are not Lean Protocol outcomes or forecasts.",
  href: "https://www.jmcp.org/doi/10.18553/jmcp.2021.20560",
};

export const JOURNEY = {
  label: "HOW IT WORKS",
  h2: "How do we execute the patient support protocol.",
  steps: [
    {
      title: "Onboarding",
      copy: "Capture consent, understand the patient's needs, preferences and goals, and build rapport.",
    },
    {
      title: "Nutrition & education",
      copy: "A customised diet plan for their demography, administration guidance and regular expert-led webinars.",
    },
    {
      title: "Regular follow-ups",
      copy: "Dosage reminders, SOS help, side-effect management, and your brand's care app for symptom logging and diet notifications.",
    },
    {
      title: "Coordinate",
      copy: "Subsequent purchase reminders, payment collection and delivery coordination.",
    },
    {
      title: "Patient success",
      copy: "Better side-effect management, better continuity and better results.",
    },
  ],
};

export const RUN = {
  label: "OUR EXECUTION LAYER",
  h2: "The care team and tools behind your PSP.",
  blocks: [
    {
      title: "Patient education",
      copy: "Data shows higher education leads to higher adherence. We do it with dietitians, online courses, expert-led Q&A and webinars, all multilingual.",
    },
    {
      title: "Human support",
      copy: "We strike a balance between automation and human support, with dietitians and care coordinators who stay connected with patients and build rapport.",
    },
    {
      title: "Reminders and follow-ups",
      copy: "Dosage reminders, medicine delivery through nearby providers, and cross-selling your supplements or additional services where appropriate.",
    },
    {
      title: "A clearer dashboard for you",
      copy: "See enrolment, engagement, continuation trend, ARPU and longitudinal metabolic data in one dashboard.",
    },
  ],
};

export const AREAS = {
  label: "CARE AREAS",
  h2: "Conditions we specialise in and support.",
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
    { title: "PCOS", size: "sm", img: "/psp/areas/pcos.png", alt: "A woman in an everyday wellness setting." },
    { title: "Sleep health", size: "sm", img: "/psp/areas/sleep.png", alt: "A calm bedroom in soft morning light." },
    { title: "Hepatology related conditions", size: "sm", img: "/psp/areas/hepatology.png", alt: "A clinician reviewing a liver scan report." },
    { title: "Oncology", size: "lg", img: "/psp/areas/oncology.png", alt: "A patient in conversation with a member of their care team." },
    { title: "Nephrology related", size: "sm", img: "/psp/areas/nephrology.png", alt: "A kidney-health consultation in a clinic setting." },
  ],
};

export const MODEL = {
  h2: "Hire a whole extended care team for your therapy.",
  copy: "A 24/7 care team, so patients feel more connected.",
  flow: [
    "Doctor prescribes",
    "We take consent and onboard",
    "Patient education and nutrition guidance",
    "Reminders and follow-ups",
    "Side-effect management",
    "Higher patient success and continuity",
  ],
  brandLine:
    "Brand the onboarding, education, webinars, helpline, WhatsApp, patient app and reports.",
};

export const PILOT = {
  h3: "Start small. Learn quickly. Scale with confidence.",
  copy: "Begin with one therapy and a defined pilot. Agree the success measures, launch the programme, then expand into more regions and languages.",
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
  "Hepatology related conditions",
  "Oncology",
  "Nephrology related",
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

/* Capability grid. The icon key maps to a lucide component in
   components/psp/psp-features.tsx - keep this file free of imports. */
export const FEATURES = {
  label: "WHAT THE PROGRAMME DOES",
  h2: "Everything a patient needs, in one place.",
  intro:
    "Eight capabilities, delivered by our own care team rather than assembled from vendors. Configured per programme, so you take what your therapy needs.",
  items: [
    {
      icon: "enrol",
      title: "Enrolment and consent",
      copy: "Digital consent, identity capture and onboarding, with a record you can audit.",
    },
    {
      icon: "adherence",
      title: "Adherence and persistence",
      copy: "Dose reminders, refill prompts and follow-up calls, with a person behind them.",
    },
    {
      icon: "clinical",
      title: "Doctor and dietitian access",
      copy: "Scheduled consults and on-demand clinical support throughout the therapy.",
    },
    {
      icon: "safety",
      title: "Side-effect management",
      copy: "Early identification, structured triage, and adverse events routed to your safety team.",
    },
    {
      icon: "labs",
      title: "Diagnostics and labs",
      copy: "At-home and in-clinic collection, with results read by our clinical team.",
    },
    {
      icon: "delivery",
      title: "Medicine delivery",
      copy: "Fulfilment coordination through licensed pharmacy partners, on a prescription.",
    },
    {
      icon: "language",
      title: "Multilingual support",
      copy: "Care delivered in the language the patient actually speaks at home.",
    },
    {
      icon: "data",
      title: "Analytics and reporting",
      copy: "Enrolment, engagement, continuity and longitudinal metabolic data in one console.",
    },
  ],
  note:
    "Adverse events identified through the programme are reported to your pharmacovigilance team within agreed timelines.",
};