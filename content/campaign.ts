// content/campaign.ts
// All copy for the /lp/[ref] campaign page. No strings in components.
// Pure ASCII: unicode via \u escapes. Rupee = \u20B9, em dash = \u2014, en dash = \u2013.
// Claims rules (CONTENT-MAP.md s6 / HANDOVER s7): no unqualified guarantees,
// "guaranteed results" and similar are banned. Asterisked claims keep their
// disclaimer in the same block.

export type MedTrack = "SEMAGLUTIDE" | "MOUNJARO";

export const WA_LINK = "https://wa.link/5btsrr";
export const SUPPORT_PHONE = "9650491267";
export const SUPPORT_EMAIL = "support@leanprotocol.in";

export const RESULTS_DISCLAIMER =
  "*Results vary. Eligibility, treatment and outcomes depend on individual medical assessment. Medication is prescribed only when clinically appropriate.";

export const GUARANTEE_NOTE =
  "*Money-back guarantee applies only under the programme terms, including doctor-confirmed eligibility and protocol adherence. See Terms & Conditions.";

export const tracks: Record<
  MedTrack,
  { name: string; molecule: string; heroTitle: string; heroSub: string }
> = {
  SEMAGLUTIDE: {
    name: "Semaglutide",
    molecule: "Wegovy-class",
    heroTitle: "Doctor-Led GLP-1 Weight Management Protocol",
    heroSub:
      "Semaglutide GLP-1 pen shot, doctor-led and science-based \u2014 with a full refund if a doctor finds you ineligible.",
  },
  MOUNJARO: {
    name: "Mounjaro",
    molecule: "Tirzepatide",
    heroTitle: "Mounjaro Based Complete Transformation Plan",
    heroSub:
      "Tirzepatide dual-agonist protocol, doctor-led and science-based \u2014 with a full refund if a doctor finds you ineligible.",
  },
};

// Display metadata keyed by duration bucket. Prices are NEVER stored here \u2014
// they come from /api/plans (see HANDOVER s4, "Prices come from the database").
export type DurationKey = "1 Month" | "3 Months" | "6 Months";

export const planMeta: Record<
  DurationKey,
  { title: string; sub: string; featured: boolean }
> = {
  "1 Month": { title: "Lean Start", sub: "beginner plan", featured: false },
  "3 Months": { title: "Lean Pro", sub: "comprehensive plan", featured: false },
  // Design said "Guaranteed weight loss" \u2014 banned claim, replaced.
  "6 Months": { title: "Lean Champion", sub: "advanced plan", featured: true },
};

export const consultMeta = {
  duration: "Doctor Consultation",
  name: "For prescription / eligibility",
  // Display fallback only; overridden by the DB consult plan when present.
  fallbackPrice: "\u20B9449",
  fallbackWas: "\u20B91,500",
};

export const posters: Record<MedTrack, Record<DurationKey, string>> = {
  SEMAGLUTIDE: {
    "1 Month": "/lp-assets/1-month-plan.png",
    "3 Months": "/lp-assets/3-months-plan.png",
    "6 Months": "/lp-assets/6-months-plan.png",
  },
  MOUNJARO: {
    "1 Month": "/lp-assets/mounjaro-1-month-plan.png",
    "3 Months": "/lp-assets/mounjaro-3-months-plan.png",
    "6 Months": "/lp-assets/mounjaro-6-months-plan.png",
  },
};

export const planDisplayName: Record<DurationKey, string> = {
  "1 Month": "Lean Start \u2014 1 month",
  "3 Months": "Lean Pro \u2014 3 months",
  "6 Months": "Lean Champion \u2014 6 months",
};

// ---- Interactive Transformation Explorer ----
// Each tab swaps the poster image in the frame. Posters live in
// /public/lp-assets. Claims that appear inside a poster keep their
// disclaimer visible under the frame (see explorerNote).

export type VizTab = { name: string; image: string; note?: string };

export const vizTabs: VizTab[] = [
  {
    name: "Lean Difference",
    image: "/lp-assets/lean-protocol-weight-loss-difference.jpeg",
  },
  {
    name: "Comparison",
    image: "/lp-assets/comparison-lean-protocol.jpeg",
    note: "*Individual results vary. Comparisons are averages, not a promise of outcome.",
  },
  {
    name: "Core Benefits",
    image: "/lp-assets/benefits-lean-protocol-weight-loss.jpeg",
    note: GUARANTEE_NOTE,
  },
  {
    name: "Nutrition Guide",
    image: "/lp-assets/nutrition-importance-lean-protocol.jpeg",
  },
  {
    name: "Doctor Support",
    image: "/lp-assets/doctor-lean-protocol.jpeg",
  },
  {
    name: "Transformation Plan",
    image: "/lp-assets/total.jpeg",
    note: GUARANTEE_NOTE,
  },
];

// Poster shown when the Doctor Consultation tile is selected.
export const consultPoster = "/get-started.png";

export const terms: string[] = [
  "Your plan is activated within 48 hours of purchase. If there is any activation issue, our team calls you on the number provided at purchase.",
  "After activation a doctor calls to check your eligibility and prescribe medication. If the doctor determines you are not eligible, you receive a full refund within 24\u201348 hours.",
];

export const disclaimer =
  "Medications are prescribed solely by a licensed medical practitioner; eligibility is at their discretion. Drugs are fulfilled by third-party pharmacies. Lean Protocol does not influence the doctor's prescription decision and does not source or manufacture any drug. This programme is not a substitute for medical diagnosis or treatment.";

export const press = [
  { name: "Zee News", logo: "/news/zee-news.svg", url: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html" },
  { name: "News24", logo: "/news/news-24.jpg", url: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/" },
  { name: "News Today 24x7", logo: "/news/news-today-24x7.png", url: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
  { name: "The Startup Story", logo: "/news/startup-story.png", url: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/" },
  { name: "The Tribune", logo: "/news/the-tribune.webp", url: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/" },
  { name: "The Republic News", logo: "/news/the-republic-news.png", url: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
];

export const proof = [
  { value: "1k+", label: "Transformations" },
  { value: "4.8", label: "Rating from 500+ reviews" },
  { value: "6.8 kg", label: "Avg weight lost*" },
  { value: "2%", label: "Avg HbA1c drop*" },
];

export const featuredStory = {
  image: "/lp-assets/atreyee-transformation.jpeg",
  badge: "Lost 6 Kgs*",
  quote:
    "I was about to buy a GLP-1 program that would cost me a bit less and thank god I did not. My wedding approached and I wanted to lose weight quickly. Thanks to their constant motivation and nudging I lost more than I thought I would.",
  name: "\u2014 Atreyee",
};

export const steps = [
  { num: "01", title: "At-home advanced blood test", text: "A comprehensive home blood test to analyse your metabolic profile and biomarkers.", img: "/journey/step-1-horizontal.jpeg" },
  { num: "02", title: "Consultation with the doctor", text: "Our specialist reviews your reports to check eligibility and prescribe the exact protocol.", img: "/journey/step-2-horizontal.jpeg" },
  { num: "03", title: "Medication delivered to your doorstep", text: "Your prescribed medication is fulfilled and delivered securely to your home.", img: "/journey/step-4-horizontal.jpeg" },
  { num: "04", title: "A GLP-1-based diet from your dietitian", text: "A customised nutritional plan tailored to complement your protocol.", img: "/journey/step-3-horizontal.jpeg" },
  { num: "05", title: "6 months of Cult home workouts", text: "Access to Cult home workouts to build lean muscle and keep your body active.", img: "/journey/step-5-horizontal.jpeg" },
  // Design: "backed by our money back guarantee" \u2014 qualified per claims rules.
  { num: "06", title: "Typically 15\u201322% weight loss in 6 months*", text: "Designed for lasting results across the full protocol. Individual results vary.*", img: "/journey/step-6-horizontal.jpeg" },
];

export const stories = [
  { type: "photo" as const, src: "/testimonials/pratima.png", name: "Pratima, 37", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/ayushi.mp4", name: "Ayushi", result: "Transformation journey" },
  { type: "photo" as const, src: "/testimonials/kanti.png", name: "Kanti, 44", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/manav.mp4", name: "Manav", result: "Transformation journey" },
  { type: "photo" as const, src: "/testimonials/rohit.png", name: "Rohit, 39", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/uday.mp4", name: "Uday", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/ananya.mp4", name: "Ananya", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/aditya.mp4", name: "Aditya", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/roshni.mp4", name: "Roshni", result: "Transformation journey" },
  { type: "video" as const, src: "/testimonials/atreyee.mp4", name: "Atreyee, 28", result: "Lost 6 Kgs*" },
];

export const experts = [
  { name: "Dr. Nishant Jain", role: "MD, DM (Endocrinology)", img: "/lp-assets/experts/nishant.jpeg" },
  { name: "Dr. Akhil Konduru", role: "MD, Internal Medicine", img: "/lp-assets/experts/akhil.jpeg" },
  { name: "Dr. Siddharth Garg", role: "MD, Internal Medicine", img: "/lp-assets/experts/siddharth.jpeg" },
  { name: "Dr. Gautam Kumar", role: "MD, DM (Endocrinology)", img: "/lp-assets/experts/gautam.jpeg" },
  { name: "Alisha Gupta", role: "GLP 1 Expert Dietitian", img: "/lp-assets/experts/alisha.jpeg" },
  { name: "Simran Kumawat", role: "Weight Loss Dietitian", img: "/lp-assets/experts/simran.jpeg" },
  { name: "Richa Sharma", role: "Senior Dietitian", img: "/lp-assets/experts/richa-sharma.jpeg" },
  { name: "Aparna Tandon", role: "Weight Loss Expert Dietitian", img: "/lp-assets/experts/aparna.jpeg" },
  { name: "Richa Singh", role: "Yoga & Fat Loss Expert", img: "/lp-assets/experts/richa-singh.jpeg" },
  { name: "Alka Bharti", role: "GLP 1 Dietitian", img: "/lp-assets/experts/alka.jpeg" },
];

export const brandLogos = [
  { name: "Redcliffe Labs", img: "/lp-assets/logo-redcliffe.png" },
  { name: "MrMed", img: "/lp-assets/logo-mrmed.jpg" },
  { name: "Cult", img: "/lp-assets/logo-cult.png" },
];

export const consultSection = {
  kicker: "STILL CONFUSED IF THIS IS RIGHT FOR YOU?",
  points: [
    { n: "1", title: "Consultation scheduling", text: "A one-on-one virtual appointment with GLP-1 expert doctors from reputed hospitals." },
    { n: "2", title: "Detailed body evaluation", text: "We review your history and suggest treatment for the root causes of weight gain." },
    { n: "3", title: "Personalised wellness plan", text: "A prescription with clear, actionable steps designed around your weight loss." },
  ],
  image: "/get-started.png",
};

export const symptoms = [
  { title: "Insulin resistance", quote: "I gain weight even when I eat less" },
  { title: "Slow metabolism", quote: "I struggle to burn calories efficiently" },
  { title: "Low energy", quote: "I feel tired all the time" },
  { title: "Hormonal issues", quote: "My body feels out of balance" },
  { title: "Constant cravings", quote: "Hunger is hard to control all day" },
  { title: "Emotional eating", quote: "I use food for comfort when stressed" },
];

export const symptomsCta =
  "If you relate to any of these, GLP-1 may be right for you \u2014 only if eligible and prescribed.";

export const faqs = [
  { q: "What is GLP-1 and how does it help with weight loss?", a: "GLP-1 (glucagon-like peptide-1) is a naturally occurring hormone that regulates appetite and blood sugar. The medication mimics this hormone, helping you feel full sooner, reducing cravings and slowing stomach emptying \u2014 which supports sustainable weight loss." },
  { q: "Am I eligible for this programme?", a: "Eligibility is determined by our doctors. Generally it is for individuals with a BMI above 27 who have weight-related medical problems, or a BMI above 30. Your initial blood test and doctor consultation confirm whether this treatment is right and safe for you." },
  { q: "What happens if I'm not eligible after the blood test?", a: "If our doctors determine that GLP-1 medication is not suitable for you based on your blood test and consultation, you receive a 100% full refund within 48 hours. No questions asked." },
  { q: "Is the medication safe?", a: "All medications are prescribed by licensed doctors and sourced from reputed pharmaceutical companies. Like any medication there can be side effects \u2014 such as mild nausea initially \u2014 which our medical team discusses with you and monitors throughout. Individual experiences vary." },
  { q: "How soon will I see results?", a: "Most members begin seeing initial weight loss within the first 4\u20136 weeks. Significant results are typically achieved over the full six-month protocol when combined with the dietitian-guided nutrition plan. Individual results vary." },
];

export const footerDisclaimer =
  "Treatment decisions are made solely by a licensed physician. Medications, if prescribed, are supplied by external pharmacy partners. Some images may be AI-created. This programme is not a substitute for medical diagnosis or treatment. Lean Protocol is not affiliated with Novo Nordisk A/S or Eli Lilly & Co.";
