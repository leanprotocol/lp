/* Course quiz funnel: forms.leanprotocol.in/course
   Four questions drawn from a pool, a score, then the master class at a
   quiz-only price.

   SEPARATE FROM content/course.ts ON PURPOSE. The /course landing page sells
   the same master class at Rs 99 and its payment routes verify against that
   number. This funnel sells at Rs 49, so it carries its own price, its own
   order source and its own TeleCRM fields. Changing one does not change the
   other, and the two can be measured apart.

   CLAIMS RULES, same as content/course.ts:
   - no medicine brand names; no weight-loss promises
   - MRP must be a price the course is genuinely sold at
   - no faked urgency (banned under India's 2023 dark-patterns guidelines)

   Pure ASCII file: symbols are \u escapes. */

export const QUIZ_PRICE_INR = 49;

/* Struck through in the pop-up. CONFIRM with the business: content/course.ts
   currently carries 4999 as the master class MRP, and the two cannot both be
   true. A struck price that was never real is misleading under consumer law. */
export const QUIZ_MRP_INR = 999;

/* The step shown between the two in the price animation: the price the same
   course sells for on /course. Real, and that is why it can be shown. */
export const QUIZ_MID_INR = 99;

/* Written into the Razorpay order notes and checked on verify, so a payment
   for another product cannot pass as this one. */
export const QUIZ_ORDER_SOURCE = "course-quiz-funnel";

/* Lead source, so this funnel can be told apart from /course in TeleCRM. */
export const QUIZ_LEAD_SOURCE = "course-quiz";

/* Seconds the price is held once the pop-up opens. The timer is honest:
   it does not change the price when it reaches zero, because expiring a
   real discount creates a refund argument at 3:01. */
export const QUIZ_OFFER_SECONDS = 180;

export type QuizQuestion = {
  q: string;
  opts: string[];
  correct: number;
  why: string;
  chapter: string;
};

/* PER_RUN are drawn at random on each load, so a returning visitor does not
   see the same four twice.

   EVERY ANSWER BELOW NEEDS A CLINICIAN'S SIGN-OFF before launch. These are
   factual claims about prescription medicines on a public page. Two to look
   at first: the vegetarian protein question (tempeh over soya chunks is
   arguable by protein content) and the side-effect question (headache does
   appear in some product information). */
export const QUIZ_PER_RUN = 4;

export const QUIZ_POOL: QuizQuestion[] = [
  {
    q: "On GLP, how much weight do people typically lose in six months?",
    opts: ["About 2 to 4%", "About 5 to 10%", "About 15 to 20%", "Over 30%"],
    correct: 2,
    why: "Trials of the newer medicines report averages around 15 to 20% of body weight \u2014 but only with the dose, the diet and the follow-up all done properly.",
    chapter: "Chapter 3",
  },
  {
    q: "Which of these is the best vegetarian protein source when you are on GLP?",
    opts: ["Paneer", "Tempeh", "Soya chunks"],
    correct: 1,
    why: "Tempeh is a complete protein and, being fermented, sits easier when GLP has already slowed your digestion \u2014 which is exactly when most people struggle to hit their protein.",
    chapter: "Chapter 10",
  },
  {
    q: "Two people on the same dose of the same medicine. Why do their results differ?",
    opts: ["The underlying cause of their weight gain is different", "One bought a generic instead of the brand", "Not doing enough exercise"],
    correct: 0,
    why: "Thyroid, insulin resistance, PCOS, sleep and medication history all change how someone responds. The same dose is not the same treatment.",
    chapter: "Chapter 4",
  },
  {
    q: "What usually happens to the weight after someone stops the medicine?",
    opts: ["It stays off, the body has reset", "Much of it returns unless habits changed alongside", "You gain back more than you lost", "Nobody knows yet"],
    correct: 1,
    why: "Studies following people after stopping show most of the weight returns over the following year, unless eating, protein and movement were rebuilt during treatment.",
    chapter: "Chapter 12",
  },
  {
    q: "Which of the following is NOT a typical side effect of GLP-1 medication?",
    opts: ["Nausea", "Diarrhoea", "Constipation", "Headache"],
    correct: 3,
    why: "The common ones are gastrointestinal \u2014 nausea, diarrhoea and constipation \u2014 because the medicine slows how fast the stomach empties. Headache is not among the typical ones.",
    chapter: "Chapter 8, Part 2",
  },
  {
    q: "Which receptor is shared by semaglutide and tirzepatide?",
    opts: ["GIP receptor", "GLP-1 receptor", "Glucagon receptor", "Amylin receptor"],
    correct: 1,
    why: "Both act on the GLP-1 receptor. Tirzepatide also acts on GIP, which is what makes the two medicines behave differently.",
    chapter: "Chapter 2",
  },
  {
    q: "What does GLP-1 stand for?",
    opts: ["Glucose Like Peptide 1", "Glucagon Like Peptide 1", "Glucose Linked Polypeptide 1", "Glucagon Linked Peptide 1"],
    correct: 1,
    why: "Glucagon Like Peptide 1 \u2014 a hormone your own gut already makes after you eat. The medicine copies it.",
    chapter: "Chapter 2",
  },
  {
    q: "What may happen after stopping GLP-1 medication?",
    opts: ["Weight loss is guaranteed to continue", "Appetite may return and some weight may be regained", "Metabolism permanently stops", "Weight regain is impossible"],
    correct: 1,
    why: "The appetite signal the medicine was providing goes with it. Without habits built during treatment, hunger returns and so does some of the weight.",
    chapter: "Chapter 12",
  },
  {
    q: "What supports better weight-loss outcomes during GLP-1 treatment?",
    opts: ["Skipping meals", "Avoiding all carbohydrates", "Combining medication with balanced nutrition and physical activity", "Reducing water intake"],
    correct: 2,
    why: "The medicine reduces appetite; it does not build the habits. Protein, balanced meals and movement are what make the loss hold.",
    chapter: "Chapter 11",
  },
  {
    q: "Why is gradual dose escalation recommended when starting GLP-1 therapy?",
    opts: ["To prevent permanent suppression of insulin production", "To improve gastrointestinal tolerability and reduce side effects", "To accelerate fat oxidation during the first week", "To stop the medication being metabolised by the liver"],
    correct: 1,
    why: "Going up slowly gives the gut time to adjust. Most people who quit early do so because they were escalated too fast.",
    chapter: "Chapter 4",
  },
  {
    q: "What is one of the major effects of GLP-1 receptor activation?",
    opts: ["Increased appetite", "Increased satiety", "Increased gastric emptying", "Increased glucagon secretion"],
    correct: 1,
    why: "It makes you feel full sooner and for longer. It also slows gastric emptying rather than speeding it up.",
    chapter: "Chapter 2",
  },
];

/* Shown on the result screen. Swap for real chapter thumbnails when the
   creatives exist; the component falls back to a play icon without them. */
export const QUIZ_CHAPTERS = [
  { n: "CH 3", t: "What to expect in 1, 3 and 6 months", img: "/course/thumbs/chapter-03.webp" },
  { n: "CH 4", t: "Same GLP, different results: dosing and root cause", img: "/course/thumbs/chapter-04.webp" },
  { n: "CH 8", t: "Minimising side effects like a pro", img: "/course/thumbs/chapter-08b.webp" },
  { n: "CH 12", t: "Keeping the lost weight off", img: "/course/thumbs/chapter-12.webp" },
];

export const QUIZ_PARTNERS = [
  { logo: "/lp-assets/logo-cult.png", alt: "Cult", sub: "For Cult Pass Home" },
  { logo: "/lp-assets/logo-redcliffe.png", alt: "Redcliffe Labs", sub: "For Blood Tests" },
  { logo: "/lp-assets/logo-mrmed.jpg", alt: "Mr.Med", sub: "For Medicine Delivery" },
];

/* The testimonial on the course screen.
   PLACEHOLDER WORDING, REPLACE BEFORE LAUNCH. Manav is a real name but
   these are not his words. A made-up testimonial on a page selling a health
   product is the kind of thing a complaint points at, and it would be ours
   to defend. Ask him what he actually got out of the course and use that. */
export const QUIZ_TESTIMONIAL = {
  quote: "I had already started the medicine before I found this. Chapter 5 was the one that changed what I was doing day to day.",
  who: "Manav, Delhi",
  verified: false,
};
