/**
 * /workshops - workplace health education, B2B.
 *
 * The entry point to the corporate vertical: a workshop costs an employer
 * an hour, not a budget cycle, and it is where the six-month programme is
 * earned rather than pitched.
 *
 * Conventions match content/corporate.ts - no JSX, pure ASCII, \u escapes,
 * and [SQUARE BRACKETS] for anything not yet verified.
 */

export const isReady = (v: string) => !(v.trim().startsWith("[") && v.trim().endsWith("]"));

export const NAV = [
  { label: "Why education first", href: "#why" },
  { label: "The sessions", href: "#sessions" },
  { label: "What changes after", href: "#action" },
  { label: "Formats", href: "#formats" },
  { label: "Partners", href: "#partners" },
  { label: "Full programme", href: "/corporate" },
];

export const hero = {
  eyebrow: "WORKPLACE HEALTH WORKSHOPS \u00B7 ON-SITE AND REMOTE",
  headA: "Nobody changes a habit",
  headB: "they do not understand.",
  lede:
    "An hour with our doctors and dietitians, built for people who sit for nine hours and eat at their desk. Practical, specific to Indian offices and Indian food, and the first step of a longer programme rather than a talk that ends when the room empties.",
  ctaPrimary: { label: "Plan a session for your team", href: "#talk" },
  ctaSecondary: { label: "See the sessions", href: "#sessions" },
  markers: [
    "Led by doctors and dietitians",
    "60 to 90 minutes, on-site or remote",
    "Built around your workforce, not a template",
  ],
};

/* ---------------- why education first ---------------- */

export const why = {
  id: "why",
  eyebrow: "WHY START HERE",
  headA: "A wellness programme is a long road.",
  headB: "Education is the first mile.",
  body:
    "Most employers know their people are not well. Fewer know what to do first, and almost none can get a whole workforce to commit to a six-month clinical programme on day one. A workshop asks for an hour. It is where interest starts.",
  chain: [
    {
      n: "01",
      title: "Education",
      body: "People learn why they are tired at 3pm, what visceral fat actually is, and why the office snack drawer is doing more damage than the commute.",
    },
    {
      n: "02",
      title: "Awareness",
      body: "They start noticing their own patterns. The sitting, the skipped breakfast, the fourth coffee. Nothing changes until somebody sees it.",
    },
    {
      n: "03",
      title: "Action",
      body: "Small things first, because those are the ones that hold. A walk after lunch. Protein at breakfast. A stretch between calls.",
    },
    {
      n: "04",
      title: "Measurement",
      body: "For those who want to go further, a blood panel turns a hunch into a number, and a number into a plan with a doctor behind it.",
    },
  ],
  note:
    "We do not claim a single session changes clinical outcomes. It changes what people know, and it opens the door to the programme that does.",
};

/* ---------------- the sessions ---------------- */

export const sessions = {
  id: "sessions",
  eyebrow: "THE SESSIONS",
  headA: "Six modules.",
  headB: "Chosen for your workforce.",
  body:
    "Each runs 60 to 90 minutes with live Q&A. We usually recommend two or three for a first engagement, picked after a short conversation with your HR team about what your people are actually dealing with.",
  modules: [
    {
      key: "nutrition",
      title: "Eating well on a workday",
      lead: "Nutrition that survives a 9-hour shift and a canteen menu.",
      points: [
        "Why the 3pm crash is a breakfast problem, not a coffee problem",
        "Protein first: what it means with roti, rice, dal and a tiffin",
        "Reading a canteen or delivery menu without a calorie app",
        "Snacking that steadies blood sugar instead of spiking it",
        "Hydration, and why most desk workers get it wrong",
      ],
      who: "Everyone. This is the module we run most often.",
    },
    {
      key: "metabolism",
      title: "Metabolism in a sedentary job",
      lead: "What sitting does, and the smallest things that undo it.",
      points: [
        "Why sitting is metabolically different from resting",
        "Insulin sensitivity, and why it falls before weight rises",
        "Asian-Indian thresholds: how our bodies cross the line earlier",
        "Muscle as a metabolic organ, not an aesthetic one",
        "What a blood panel would show, and when it is worth doing",
      ],
      who: "Desk-heavy teams, engineering, finance, customer support.",
    },
    {
      key: "movement",
      title: "Strategic walking and desk mobility",
      lead: "Movement that fits between meetings, not around them.",
      points: [
        "Post-meal walking: the ten minutes that do the most work",
        "Walking meetings, and how to actually make them happen",
        "Basic joint stretches for hips, neck, wrists and lower back",
        "Setting up a desk so it stops causing the problem",
        "Building a movement habit that survives a deadline week",
      ],
      who: "Teams with long sitting hours or reported back and neck pain.",
    },
    {
      key: "breath",
      title: "Breathing, stress and recovery",
      lead: "Practical techniques, taught properly, with the physiology behind them.",
      points: [
        "What chronic stress does to cortisol, appetite and belly fat",
        "Box breathing and extended exhale, practised in the room",
        "A two-minute reset between back-to-back calls",
        "Sleep as the recovery lever most people ignore",
        "Where breathwork helps, and where it is not the answer",
      ],
      who: "High-pressure functions, shift workers, leadership teams.",
    },
    {
      key: "focus",
      title: "Food, focus and mood",
      lead: "The link between what people eat and how well they think.",
      points: [
        "Blood sugar stability and sustained concentration",
        "Caffeine: timing, ceiling, and the afternoon trap",
        "Deficiencies common in Indian office populations, and their symptoms",
        "The gut-mood connection, stated carefully and without overclaiming",
        "Building a day that does not end in exhaustion",
      ],
      who: "Knowledge work, creative teams, anyone reporting brain fog.",
    },
    {
      key: "leaders",
      title: "For managers and HR",
      lead: "How to build a workplace where the other five modules stick.",
      points: [
        "Meeting culture, lunch culture and what they do to health",
        "Spotting burnout before it becomes attrition",
        "Making wellness voluntary and still well attended",
        "What to measure, and what is not worth measuring",
        "Where a clinical programme fits, and when it does not",
      ],
      who: "People managers, HR and benefits teams.",
    },
  ],
};

/* ---------------- from education to action ---------------- */

export const action = {
  id: "action",
  eyebrow: "EDUCATION IS NOT THE POINT",
  headA: "What happens",
  headB: "after the room empties.",
  body:
    "A talk people enjoyed and forgot is a cost, not an investment. Every session ends with something an employee can do that week, and something your HR team can act on.",
  cards: [
    {
      title: "A takeaway per person",
      text: "Not a slide deck. A one-page plan with three things to change this week, written for the module they attended.",
    },
    {
      title: "An anonymous pulse check",
      text: "A short pre-session survey tells us what your workforce is actually struggling with. You get the aggregate view, with nobody identifiable.",
    },
    {
      title: "An optional screening day",
      text: "For employers who want it, we run on-site or at-home blood panels in the weeks after. Voluntary, individually consented, results to the employee.",
    },
    {
      title: "A route into the programme",
      text: "Employees who want to go further can join our clinical programmes at a corporate rate, arranged through you but paid however you choose.",
    },
  ],
  note:
    "Screening and clinical programmes are always voluntary for the employee, individually consented, and never a condition of employment.",
};

/* ---------------- formats ---------------- */

export const formats = {
  id: "formats",
  eyebrow: "HOW IT RUNS",
  headA: "Not a one-off,",
  headB: "unless that is what you need.",
  body:
    "We shape the engagement around your workforce. Some employers start with a single session and stop there; most run a series once they see the attendance.",
  options: [
    {
      name: "Single session",
      when: "A starting point, or a specific problem",
      detail: "One module, 60 to 90 minutes, on-site or remote. Useful for a health day, an offsite, or testing the water before committing further.",
    },
    {
      name: "Quarterly series",
      when: "Most common",
      detail: "Three or four sessions across the year, sequenced so each builds on the last. Attendance tends to rise after the first, not fall.",
    },
    {
      name: "Function-specific",
      when: "Where roles differ sharply",
      detail: "Different modules for different teams. Night-shift operations and a desk-bound finance team do not have the same problem.",
    },
    {
      name: "Workshop plus screening",
      when: "Employers ready to measure",
      detail: "Education first, then a voluntary panel, then a report on the shape of your workforce's health. The bridge into the six-month programme.",
    },
  ],
};

/* ---------------- partners ---------------- */

export const partners = {
  id: "partners",
  eyebrow: "WHO WE WORK WITH",
  headA: "The delivery is not",
  headB: "a slide deck and a promise.",
  body:
    "When a workshop leads to screening or a clinical programme, it runs on infrastructure we already use every day.",
  list: [
    { name: "Redcliffe Labs", logo: "/lp-assets/logo-redcliffe.png", role: "Diagnostics and at-home sample collection" },
    { name: "MrMed", logo: "/lp-assets/logo-mrmed.jpg", role: "Medicine fulfilment, where a doctor prescribes" },
    { name: "Cult.fit", logo: "/lp-assets/logo-cult.png", role: "Fitness access for programme members" },
  ],
  note:
    "Partner services are arranged for employees who choose to take them up. Medication is dispensed only on a licensed physician's prescription.",
};

/* ---------------- offer ---------------- */

export const offer = {
  eyebrow: "AT THE END OF THE SESSION",
  headA: "A corporate rate,",
  headB: "for those who want more.",
  body:
    "Employees who want to go further can join a Lean Protocol programme at a rate negotiated for your organisation. We explain it once, at the end, and never during the teaching. Nobody is sold to in a session your employer arranged.",
  bullets: [
    "Obesity and weight management, doctor-led",
    "Metabolic health: pre-diabetes, lipids, fatty liver",
    "Full blood panels with a six-month re-test",
    "Dietitian-led nutrition support",
  ],
  note:
    "Corporate rates are agreed per organisation and depend on headcount and scope. Eligibility for any clinical programme is decided by a physician after individual assessment.",
};

/* ---------------- proof ---------------- */

export const proof = {
  eyebrow: "SO FAR",
  stats: [
    { value: "[N]", label: "Sessions delivered" },
    { value: "[N]", label: "Employees attended" },
    { value: "[N]", label: "Average session rating" },
    { value: "[N]", label: "Went on to a screening" },
  ],
  note: "Figures across corporate engagements to date.",
  fallback:
    "We are early in this vertical and would rather show you real attendance and feedback from a comparable employer than a number we cannot stand behind. Ask us on the call.",
};

/* ---------------- bridge to the full programme ---------------- */

export const bridge = {
  eyebrow: "WHEN A WORKSHOP IS NOT ENOUGH",
  headA: "Education opens the door.",
  headB: "The programme walks through it.",
  body:
    "For employers ready to go further, we run a six-month clinical programme: a full metabolic blood panel for every participating employee, doctor-led care for those who need it, and a second panel at month six that shows what actually changed.",
  points: [
    "Baseline and month-six blood panels, same markers, same labs",
    "Risk-stratified cohorts, not one plan for everyone",
    "Aggregate reporting for HR, with no individual health data",
  ],
  cta: { label: "See the six-month programme", href: "/corporate" },
  note:
    "Most employers start with a workshop and decide afterwards. There is no requirement to commit to the programme to run a session.",
};

/* ---------------- FAQ ---------------- */

export const faqs = [
  {
    q: "How long is a session and what does it need from us?",
    a: "Sixty to ninety minutes including Q&A. On-site we need a room and a screen; remote we run it on your platform. We handle the content, the speaker and the materials.",
  },
  {
    q: "Who actually delivers it?",
    a: "Our own doctors and dietitians, the same clinical team behind our programmes. Not a hired speaker working from our slides.",
  },
  {
    q: "Is this a sales pitch in disguise?",
    a: "The teaching is the session. We mention our programmes once, at the end, for anyone who wants to go further. Employees who do not are not followed up.",
  },
  {
    q: "Can you tailor it to our workforce?",
    a: "That is the default. We ask about roles, shift patterns, age profile and what HR is already seeing, and pick modules from there. An optional anonymous pulse survey sharpens it further.",
  },
  {
    q: "What about our teams outside the head office?",
    a: "Sessions run remotely on the same terms, and screening collection is at-home as well as on-site, so distributed and plant teams are not left out.",
  },
  {
    q: "Do you share who attended or what they said?",
    a: "Attendance numbers yes, individual responses no. Pulse survey results come to you in aggregate only, with small groups suppressed.",
  },
  {
    q: "What does it cost?",
    a: "It depends on format, number of sessions and locations. We will give you a figure on the first call rather than after three meetings.",
  },
];

/* ---------------- CTA ---------------- */

export const cta = {
  id: "talk",
  eyebrow: "NEXT STEP",
  headA: "Tell us about",
  headB: "your workforce.",
  body:
    "A short call: what your people are struggling with, which modules would land, and what a first session would cost. We will say if we think a workshop is the wrong starting point for you.",
  bullets: [
    "On-site across India, or remote",
    "GST-compliant invoicing",
    "No commitment to a longer programme",
  ],
  form: {
    submit: "Plan a session",
    sending: "Sending...",
    done: "Thank you. We will be in touch within one working day to talk through the sessions.",
    sizes: ["1-50", "51-200", "201-500", "501-1000", "1000+"],
  },
};
