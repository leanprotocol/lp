/**
 * /our-why page content.
 *
 * Same conventions as content/home-v2.ts: no JSX, no prices, pure ASCII with
 * \u escapes, and any claim carrying "*" keeps its note in the same block.
 */

export const hero = {
  eyebrow: "OUR WHY",
  headingA: "Take charge of your",
  headingB: "weight today.",
  bgImage: "/our-why-hero1.webp",
  ctaPrimary: { label: "Get Started", href: "https://forms.leanprotocol.in/" },
  ctaSecondary: { label: "Chat with Experts", href: "https://wa.link/3s1upf" },
};

export const manifesto = {
  lead:
    "Most people don't want six-pack abs. They just want to wake up feeling lighter, clearer, healthier. To move without effort. To breathe without struggle.",
  accent: "To feel well again.",
};

export const problem = {
  eyebrow: "THE PROBLEM WE SAW",
  headingA: "Everyone had a piece of the puzzle.",
  headingB: "No one was putting it together for you.",
  body:
    "Everyone's talking. No one's listening. And you're the only one trying to make it all make sense. So we built Lean Protocol.",
  silos: [
    { who: "Your doctor", has: "has your medication." },
    { who: "Your trainer", has: "has your workout plan." },
    { who: "Your nutritionist", has: "has your diet plan." },
    { who: "Your smartwatch", has: "has your body metrics." },
  ],
};

export const platform = {
  image: "/lp-assets/doctor-patient.webp",
  heading: "A medical-first, expert-connected platform.",
  body:
    "Your doctor, nutritionist, trainer and psychologist finally work as one. Treatment isn't random. Your plan isn't generic. Your health and your story truly matter.",
};

export const framework = {
  eyebrow: "THE FRAMEWORK",
  headingA: "The 3P 3L Framework of",
  headingB: "Lean Protocol.",
  body:
    "Because when the right set of experts talk to each other, the right results follow. Six foundational pillars every Lean Expert lives by.",
  pillars: [
    { num: "01", title: "Protocol",
      text: "Our Protocol is designed to give you the most effective, best-supported route to weight loss we can offer." },
    { num: "02", title: "Prioritisation",
      text: "Your well-being outranks our revenue goals. We prioritise ethical care, and zero-compromise on safety standards." },
    { num: "03", title: "Plain Truth",
      text: "Complete clarity on treatment, pricing and expectations, so you always know exactly what you're signing up for. No hidden charges. No surprises." },
    { num: "04", title: "Lead Cause",
      text: "We take time to understand your metabolism, lifestyle, health history, genetics and hormones to find the foundational cause of your weight gain." },
    { num: "05", title: "Legit Science",
      text: "We don't believe in anecdotes and nuskas. Only science-backed medical options make it to our platform." },
    { num: "06", title: "Lean Legacy",
      text: "We help you build habits and systems along the treatment, so your results stay with you long after the programme ends." },
  ],
};

export const closing = {
  headingA: "Start your journey",
  headingB: "with people who listen.",
  ctaPrimary: { label: "Get started", href: "https://forms.leanprotocol.in/" },
  ctaSecondary: { label: "Chat with experts", href: "https://wa.link/3s1upf" },
};
