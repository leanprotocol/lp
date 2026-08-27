/**
 * Homepage v2 - all copy and static data.
 *
 * WHY THIS FILE EXISTS
 * Every string a visitor reads lives here, not inside a component. A copy
 * change is then a one-line edit in a file with no layout code in it, so a
 * non-developer can find and request it without reading JSX.
 *
 * RULES
 * 1. No prices. Plan prices come from the database - see home-pricing.tsx.
 * 2. No JSX. Plain data only.
 * 3. A claim carrying "*" keeps its note in the same block, so the two
 *    cannot be separated by accident. See CONTENT-MAP.md section 6.
 * 4. Pure ASCII. Use \u escapes for symbols - see ARCHITECTURE.md section 12.
 */

export const ARROW = "\u2192";
export const DASH = "\u2014";

export const hero = {
  eyebrow: "DOCTOR-LED \u00B7 GLP-1 GUIDED \u00B7 MADE FOR INDIA",
  lede:
    "GLP 1* guided fat loss made affordable for India \u2014 lose up to 22% of body weight* in 6 months.",
  ctaPrimary: { label: "Get Started", href: "/users" },
  ctaSecondary: { label: "Chat with Experts", href: "https://wa.link/3s1upf" },
  note:
    "*GLP-1 only after doctor's evaluation and on the basis of valid prescription. Results vary; medication only when clinically appropriate.",

  /* Swap these paths for the final artwork. Everything else stays put. */
  bgImage: "/journey/journey2.webp",
  polaroids: [
    { src: "/before-after/Pratima, 37 Lost 7Kgs in 2.5 months.jpeg",
      rot: "-7deg", top: "16%", left: "2%",  width: "clamp(120px,13vw,200px)", dur: "7s", delay: "0s" },
    { src: "/before-after/Rohit, 39 Lost 9.1 kg in 15 weeks.webp",
      rot: "6deg",  top: "10%", right: "2%", width: "clamp(120px,13vw,210px)", dur: "8s", delay: "1s" },
    { src: "/before-after/Neema, 46 Lost 10.8 kgs in 4 months.webp",
      rot: "-4deg", bottom: "18%", right: "10%", width: "clamp(100px,11vw,180px)", dur: "9s", delay: ".5s" },
  ] as Array<{
    src: string; rot: string; width: string; dur: string; delay: string;
    top?: string; bottom?: string; left?: string; right?: string;
  }>,
};

export const ticker = [
  "Doctor-guided",
  "Made for India",
  "GLP-1 backed \u2014 only if eligible & prescribed",
  "Root causes diagnosis",
  "6-month money back guarantee",
];

export const journey = {
  id: "journey",
  heading: "Understand the process behind amazing results.",
  /* One image per step. Swap the paths here; the component reads nothing else. */
  steps: [
    { n: "01", title: "At-home advanced blood test",
      body: "A full metabolic and hormone panel, collected at your door.",
      img: "/journey/journey1.webp" },
    { n: "02", title: "Consultation with our doctors",
      body: "An endocrinologist or physician reads your panel with you.",
      img: "/journey/journey2.webp" },
    { n: "03", title: "Your personalised protocol",
      body: "Nutrition, activity and - only if prescribed - medication.",
      img: "/journey/journey3.webp" },
    { n: "04", title: "Delivered and supported",
      body: "Medicines to your door, weekly check-ins, expert support.",
      img: "/journey/journey4.webp" },
    { n: "05", title: "Lasting results",
      body: "Regular review so the change holds past the six months.",
      img: "/journey/journey5.webp" },
  ],
  note: "*Results vary. Eligibility, treatment and outcomes depend on individual medical assessment. Medication is prescribed only when clinically appropriate.",
};

export const explainer = {
  heading: "Understand the process behind amazing results.",
  videoSrc: "/lp-assets/lp-explainer.mp4",
  poster: "/lp-assets/video-thumbnail.jpg",
  points: ["Doctor-guided", "Made for India", "GLP-1 backed (only if eligible & prescribed)"],
};

export const results = {
  id: "results",
  heading: `Real people. Real results. ${DASH} keep scrolling ${ARROW}`,
  /* isVideo picks <video> over <img>. Both live in /public/before-after. */
  films: [
    { name: "Pratima, 37", result: "Lost 7 kg in 3 months*",  isVideo: false,
      src: "/before-after/Pratima, 37 Lost 7Kgs in 2.5 months.jpeg" },
    { name: "Manav, 24",   result: "Lost 20 kg in 5 months*",   isVideo: true,
      src: "/before-after/manav.mp4" },
    { name: "Kanti, 44",   result: "Lost 8.5 kg in 3 months*",  isVideo: false,
      src: "/before-after/Kanti, 44 Lost 8.5 Kgs in 3 months.webp" },
    { name: "Ayushi, 22",  result: "Lost 15 kg in 6 months*",   isVideo: true,
      src: "/before-after/ayushi.mp4" },
    { name: "Rohit, 39",   result: "Lost 9.1 kg in 15 weeks*",  isVideo: false,
      src: "/before-after/Rohit, 39 Lost 9.1 kg in 15 weeks.webp" },
    { name: "Ananya, 20",  result: "Lost 14 kg in 7 months*",   isVideo: true,
      src: "/before-after/ananya.mp4" },
    { name: "Neema, 46",   result: "Lost 10.8 kg in 10 weeks*", isVideo: false,
      src: "/before-after/Neema, 46 Lost 10.8 kgs in 4 months.webp" },
    { name: "Atreyee, 28", result: "Lost 12 kg in 2 months*",     isVideo: true,
      src: "/before-after/atreyee.mp4" },
  ],
  note: "*Individual results may vary.",
};

export const estimate = {
  id: "estimate",
  heading: "Your weight, 6 months from now.",
  sub: "Drag to see the average result at your starting weight.",
  min: 60, max: 160, initial: 100,
  reductionPct: 0.22,
  tabA: "Timeline",
  tabB: "Compare",
  labelNow: "Today",
  labelNew: "Estimated in 6 months*",
  note: "*Individual results may vary. Based on average results of Lean Protocol members, not a prediction for any individual.",
};

export const stats = {
  items: [
    { value: "18-22%", label: "Average Weight Loss*", tone: "sage" as const },
    { value: "98%",    label: "Success Rate*",        tone: "cream" as const },
    { value: "2.6%",   label: "Avg. HbA1C Drop*",     tone: "gold" as const },
    { value: "6mo",    label: "Money Back Guarantee", tone: "muted" as const },
  ],
  note: "*Results vary and are not guaranteed. Based on internal member data. The money-back guarantee applies to eligible six-month programme members and is subject to the terms.",
};

export const pricing = {
  id: "pricing",
  heading: "Simple pricing.",
  sub: "Doctors, dietitians, diagnostics and delivery included.",
  /* Presentation only. Price, original price and duration come from the
     SubscriptionPlan table so the homepage cannot disagree with checkout. */
  presentation: {
    "Lean Start":    { rot: "-2.5deg", featured: false },
    "Lean Champion": { rot: "0deg",    featured: true, ribbon: "Most chosen" },
    "Lean Pro":      { rot: "2.5deg",  featured: false },
  } as Record<string, { rot: string; featured: boolean; ribbon?: string }>,
  cta: "Get started",
  note: "Medication is included when prescribed, and is dispensed by a licensed third-party pharmacy. GLP-1 only after a doctor's evaluation. Comparison figures are typical retail prices for sourcing the same services separately.",
};

export const press = {
  heading: "Featured across India's leading publications.",
  sub: "(click to read)",
  /* Logos live in /public/news. Only outlets that have actually covered
     Lean Protocol belong here - a logo implies coverage. */
  items: [
    { name: "Zee News", logo: "/news/zee-news.svg",
      href: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html" },
    { name: "News24", logo: "/news/news-24.jpg",
      href: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/" },
    { name: "News Today 24x7", logo: "/news/news-today-24x7.png",
      href: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
    { name: "The Startup Story", logo: "/news/startup-story.webp",
      href: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/" },
    { name: "The Tribune", logo: "/news/the-tribune.webp",
      href: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/" },
    { name: "The Republic News", logo: "/news/the-republic-news.png",
      href: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
  ],
};

export const chart = {
  eyebrow: "Clinical outcomes",
  heading: "What six months",
  headingAccent: "actually looks like.",
  seriesA: "Lean Protocol",
  seriesB: "Diet & exercise alone",
  /* Percentage change from baseline, so no starting weight is implied.
     Same figures as the original chart. */
  data: [
    { label: "Day 1",   lean: 0,   diet: 0 },
    { label: "Month 1", lean: -4,  diet: -1.5 },
    { label: "Month 2", lean: -9,  diet: -2.5 },
    { label: "Month 3", lean: -14, diet: -3.5 },
    { label: "Month 4", lean: -18, diet: -4.5 },
    { label: "Month 5", lean: -20, diet: -5.5 },
    { label: "Month 6", lean: -22, diet: -6 },
  ],
  note: "*Individual results may vary. The data is on the basis of average results of a Lean Protocol user. Eligibility, treatment and outcomes depend on individual medical assessment; medication is prescribed only when clinically appropriate.",
};

export const experts = {
  id: "experts",
  heading: "Meet the experts.",
  sub: "Endocrinologists, physicians and GLP-1 specialist dietitians.",
  people: [
    { name: "Dr. Nishant Jain",   role: "MD, DM Endocrinology",   img: "/lp-assets/experts/nishant.jpeg" },
    { name: "Dr. Gautam Kumar",   role: "MD, DM Endocrinology",   img: "/lp-assets/experts/gautam.jpeg" },
    { name: "Dr. Akhil Konduru",  role: "MD, Internal Medicine",  img: "/lp-assets/experts/akhil.jpeg" },
    { name: "Dr. Siddharth Garg", role: "MD, Internal Medicine",  img: "/lp-assets/experts/siddharth.jpeg" },
    { name: "Alisha Gupta",       role: "GLP-1 Expert Dietitian", img: "/lp-assets/experts/alisha.jpeg" },
    { name: "Simran Kumawat",     role: "Weight Loss Dietitian",  img: "/lp-assets/experts/simran.jpeg" },
    { name: "Richa Sharma",       role: "Senior Dietitian",       img: "/lp-assets/experts/richa-sharma.jpeg" },
    { name: "Aparna Tandon",      role: "Weight Loss Expert",     img: "/lp-assets/experts/aparna.jpeg" },
    { name: "Richa Singh",        role: "Yoga & Fat Loss",        img: "/lp-assets/experts/richa-singh.jpeg" },
    { name: "Alka Bharti",        role: "GLP-1 Dietitian",        img: "/lp-assets/experts/alka.jpeg" },
  ],
};

export const benefits = {
  heading: "Breaking free from obesity improves everything...",
  /* Artwork lives in /public/marquee. Row A runs left, row B runs right. */
  rowA: [
    { text: "Diabetes", image: "/marquee/diabetes.webp" },
    { text: "Mental health", image: "/marquee/mental-health.png" },
    { text: "Back pain", image: "/marquee/back-pain.png" },
    { text: "Sound Sleep", image: "/marquee/sleep-apnea.png" },
    { text: "Heart Health", image: "/marquee/heart-health.png" },
    { text: "Mobility", image: "/marquee/mobility.png" },
    { text: "Metabolism", image: "/marquee/metabolism.png" },
    { text: "Confidence", image: "/marquee/confidence.png" },
  ],
  rowB: [
    { text: "Joint pain", image: "/marquee/joint-pain.png" },
    { text: "Blood pressure", image: "/marquee/blood-pressure.png" },
    { text: "Hydration", image: "/marquee/hydration.png" },
    { text: "Self-esteem", image: "/marquee/self-esteem.png" },
    { text: "Energy", image: "/marquee/energy.png" },
    { text: "Longevity", image: "/marquee/longevity.png" },
    { text: "Balance", image: "/marquee/balance.png" },
  ],
};

export const closing = {
  heading: "One small step. To a leaner you.",
  cta: { label: "Check my eligibility", href: "/users" },
  note: "Lean Protocol is not affiliated with Novo Nordisk A/S or Eli Lilly & Co. GLP-1 medications are prescription-only.",
};
