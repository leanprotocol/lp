/* GLP weight loss master class: landing page (/course) and checkout
   (/course/checkout). All copy and settings live here.

   The course is watched in the Lean Protocol app. Payment (Rs 99) is taken on
   the website at /course/checkout, recorded in Razorpay and TeleCRM against
   the buyer's mobile number; the app unlocks the course for that number.

   A value still in [SQUARE BRACKETS] (or empty) is treated as unfinished and
   hidden, so the page can go live before every detail is known.

   CLAIMS RULES for this file (public page, health product):
   - no medicine brand names; no weight-loss promises
   - no "proven", "first", "best" or "guaranteed" claims we cannot back up
   - OFFER.mrp must be a price the course is genuinely sold at
   - OFFER.endsAt must be the real end of the offer. The countdown runs to it;
     never set it to a rolling date, and never fake a timer (false urgency is
     banned under India's 2023 dark-patterns guidelines).

   Pure ASCII file: symbols are \u escapes. */

export const isReady = (s?: string): s is string => Boolean(s && s.trim() && !/\[[^\]]*\]/.test(s));

export const COURSE = {
  name: "GLP weight loss master class",
  priceInr: 99,
  chaptersCount: 13,
  totalWatchTime: "[X hrs]",
  checkoutPath: "/course/checkout",
  intro: {
    video: "/course/intro.mp4",
    poster: "/course/intro-poster.webp",
  },
};

export const OFFER = {
  heading: "Limited-time launch offer",
  /* Struck-through price. Must be a real price the course sells at. */
  mrpInr: 4999,
  /* Real end of the offer, India time, e.g. "2026-10-31T23:59:00+05:30".
     Empty hides the countdown and the "valid till" line. */
  endsAt: "",
  points: [
    "Complete, structured GLP weight loss master class",
    "Conducted by experienced professionals: a senior health coach and a physician",
    "By the end of the course, you get clarity on what suits you",
  ],
};

/* Checkout bonus. Each visitor gets a real BONUS.windowMinutes window from
   their first visit, kept through refreshes. Within it, the checkout shows a
   tap-to-reveal bonus: BONUS.discountInr off plus community access. The server
   issues a signed coupon that expires with the window, and the order route
   charges the discounted price only for a valid, unexpired coupon. Closing the
   pop-up without revealing keeps the normal price. */
export const BONUS = {
  code: "LEAN30",
  discountInr: 30,
  windowMinutes: 5,
  title: "\u20b930 off + Lean Protocol community access",
};

export const ACHIEVE = [
  { title: "Know the top methods of weight loss in 2026" },
  { title: "Understand your body type and what to expect" },
  { title: "Decode the strategies top trainers use" },
];

export const ABOUT = {
  heading: "What this GLP master class involves",
  lead: "13 video chapters that take you from a beginner to a GLP pro, while learning:",
  points: [
    "The best weight-loss methods of 2026",
    "Minimising side effects like a pro",
    "Five hacks to save significant money during therapy",
  ],
};

export const GLANCE = [
  { big: "13", text: "video chapters" },
  { big: "[X hrs]", text: "total watch time" },
  { big: "2", text: "instructors: a health coach and a physician" },
  { big: "Diets", text: "5 evidence-based diet charts for different body conditions" },
  { big: "\u20b999", text: "full master class, one-time" },
  { big: "Community", text: "access the Lean Protocol community of 1000+ members for guidance" },
];

export const INSTRUCTORS = [
  {
    name: "Abhinav Dobrial",
    role: "Senior health coach \u00b7 Founder, Lean Protocol",
    photo: "/course/instructors/abhinav-dobrial.webp",
    bio: "Founder of Lean Protocol and the senior health coach behind its programme and diet method. Abhinav takes you through the everyday side of medical weight management: what to eat, plateaus, costs, habits and maintaining the weight loss.",
  },
  {
    name: "Dr. Siddharth Garg",
    role: "MBBS, MD (Internal Medicine)",
    photo: "/course/instructors/dr-siddharth-garg.jpeg",
    bio: "Dr. Siddharth, who had his own weight transformation, explains the medical science: why the same GLP works differently for everyone, how to manage side effects, and the options that may suit you best.",
  },
];

export type Chapter = { slug: string; label: string; title: string; withDoctor?: boolean };

/* Shown in three groups: the first 4, then "show 4 more", then the rest. */
export const CHAPTERS: Chapter[] = [
  { slug: "01", label: "Chapter 1", title: "Decoding the top 5 methods across the world" },
  { slug: "02", label: "Chapter 2", title: "How these modern therapies work, and are they safe?" },
  { slug: "03", label: "Chapter 3", title: "How much weight loss to expect in 1, 3 and 6 months: what the research says" },
  { slug: "04", label: "Chapter 4", title: "Same GLP, different results: the dosing strategy and root-cause analysis", withDoctor: true },
  { slug: "05", label: "Chapter 5", title: "Plateaus decoded: the best methods for protecting muscle while losing fat" },
  { slug: "06", label: "Chapter 6", title: "Natural weight loss vs pills vs shots", withDoctor: true },
  { slug: "07", label: "Chapter 7", title: "Branded vs generic, and what our experience says" },
  { slug: "08", label: "Chapter 8", title: "8 essential items to have during weight loss" },
  { slug: "08b", label: "Chapter 8 \u00b7 Part 2", title: "Minimising side effects like a pro", withDoctor: true },
  { slug: "09", label: "Chapter 9", title: "Skin rejuvenation during weight loss" },
  { slug: "10", label: "Chapter 10", title: "The 3-2-1 Lean Protocol diet method" },
  { slug: "11", label: "Chapter 11", title: "Habits that make the most difference, and the easiest ways to follow them" },
  { slug: "12", label: "Chapter 12", title: "Structured methods to keep the lost weight off" },
  { slug: "13", label: "Chapter 13", title: "Real GLP patients share their experiences candidly" },
];
export const CHAPTER_GROUPS = [4, 8]; // first 4 shown; "Show more" reveals up to 8, then the rest

export const FAQ = [
  { q: "Where do I watch the master class?", a: "In the Lean Protocol app, on Android or iPhone. Pay here, then sign in to the app with the same mobile number to unlock every chapter." },
  { q: "What does \u20b999 include?", a: "All 13 video chapters, the diet charts and access to the Lean Protocol community. It is a one-time payment." },
  { q: "Do I need to be on GLP treatment?", a: "No. The master class is for anyone who wants to understand GLP weight loss, whether or not they are on treatment." },
  { q: "Is this medical advice?", a: "No. It is educational. GLP medicines are prescription-only; speak to your doctor about your own treatment." },
];

/* Footer. Matches the main site footer (leanprotocol.in). */
export const COMPANY = {
  legalName: "Lean Protocol Private Limited",
  tagline: "Doctor-led, science-backed weight care. Consultations, diagnostics, prescriptions and support in one programme.",
  /* Not shown on the main site either; fill in to display. */
  address: "[REGISTERED ADDRESS]",
  email: "support@leanprotocol.in",
  phone: "+91 96504 91267",
  columns: [
    { title: "Programme", links: [["How it works", "/#journey"], ["Pricing", "/#pricing"], ["Our experts", "/#experts"], ["Reviews", "/reviews"]] },
    { title: "Tools", links: [["BMI calculator", "/bmi-calculator"], ["BMR calculator", "/bmr-calculator"], ["Waist-to-hip ratio", "/waist-to-hip-calculator"], ["Knowledge hub", "/blog"]] },
    { title: "Company", links: [["Our why", "/our-why"], ["Contact", "/contact"], ["Innovation", "/innovation"]] },
    { title: "Legal", links: [["Privacy policy", "/privacy-policy"], ["Terms & conditions", "/terms-conditions"], ["Refund policy", "/refund-policy"]] },
  ] as { title: string; links: [string, string][] }[],
  /* Full profile links. Empty ones are hidden. */
  social: {
    instagram: "",
    youtube: "",
    linkedin: "",
    facebook: "",
    x: "",
  },
};