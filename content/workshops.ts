/**
 * /workshops - workplace wellness workshop.
 *
 * Copy follows the delivered template. Conventions as elsewhere: no JSX,
 * pure ASCII with \u escapes, and any claim carrying a caveat keeps it in
 * the same block.
 */

export const NAV = [
  { label: "The workshop", href: "#workshop" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Sample workshop", href: "#sample" },
  { label: "Care programmes", href: "#care" },
];

export const hero = {
  eyebrow: "Lean Protocol / Workplace Wellness Workshop",
  headA: "Healthier habits",
  headEm: "fit into",
  headB: "the workday.",
  lead:
    "A practical workshop packed with engaging activities and simple nutrition and movement hacks your team can put to work the very next day.",
  ctaPrimary: { label: "I want a sample of this workshop", href: "#sample" },
  ctaSecondary: { label: "See the workshop breakdown", href: "#curriculum" },
  noteA: "Useful for every employee.",
  noteB: "Built around your team's real routine.",
  image: "/workshops/workshop-hero.webp",
  imageAlt: "Colleagues taking a light movement break in a bright workplace",
  overlayLabel: "A new kind of work break",
  overlayA: "Small actions.",
  overlayB: "Repeated daily.",
  orbit: "MOVE \u00B7 EAT \u00B7 RESET \u00B7 ",
};

export const intro = {
  id: "workshop",
  eyebrow: "01 / The approach",
  headA: "Not a sales workshop.",
  headEm: "A practical guide.",
  copy:
    "Doctors and dietitians turn busy-workday challenges into activities employees can practise together and repeat the next day.",
  link: { label: "See the workshop breakdown", href: "#curriculum" },
  splitA: { n: "80%", label: "practical learning, activities & expert Q&A" },
  splitB: { n: "20%", label: "optional programmes & corporate offers" },
  splitNote: "No purchase is needed to benefit from the workshop.",
};

export const curriculum = {
  id: "curriculum",
  eyebrow: "02 / Workshop breakdown",
  head: "A powerful workshop with doctors and dietitians.",
  intro:
    "Live Q&A with expert doctors and nutritionists, with practical activities throughout.",
  cards: [
    {
      n: "01",
      symbol: "\u25D2",
      title: "Quick nutrition hacks for busy days",
      copy:
        "Easy meal and snack ideas that save decision time and support steady energy and focus during a demanding workday.",
      points: [
        "A five-minute backup meal plan",
        "Protein, fibre and portion cues for weight goals",
        "Practical cafeteria and travel choices",
      ],
    },
    {
      n: "02",
      symbol: "\u2197",
      title: "Break up the sitting day",
      copy:
        "Learn short walking breaks, gentle joint mobility and simple workstation habits that help interrupt long periods of sitting.",
      points: [
        "Strategic walks between meetings",
        "Shoulder, neck and hip mobility",
        "Comfortable desk setup and regular position changes",
      ],
    },
    {
      n: "03",
      symbol: "\u2733",
      title: "Reset and refocus",
      copy:
        "Use brief breathing and planning pauses to handle a demanding day, alongside food and movement habits that support wellbeing.",
      points: [
        "One-minute breathing practice",
        "A realistic afternoon reset",
        "A personal next-step plan",
      ],
    },
  ],
  footnote:
    "The workshop offers general education. It does not replace medical advice or a personalised treatment plan.",
};

export const sample = {
  id: "sample",
  eyebrow: "03 / Sample workshop",
  head: "See how a live session turns advice into action.",
  intro:
    "Our doctors and dietitians use questions, everyday scenarios and live Q&A to keep the room involved. Try one small activity below.",
  image: "/workshops/workshop-sample.webp",
  imageAlt: "Illustration of a group taking part in an online nutrition workshop",
  caption:
    "Illustrative workshop preview. This is not a screenshot of an actual session or its participants.",
  promptLabel: "Try a workshop prompt",
  prompt: "Lunch gets pushed back. What is your easiest backup plan?",
  options: [
    {
      key: "snack",
      label: "Keep a snack ready",
      response:
        "A planned snack gives you a flexible option when meetings shift. Fruit with nuts or yoghurt is one simple pairing.",
    },
    {
      key: "cafeteria",
      label: "Choose a cafeteria option",
      response:
        "A cafeteria meal can work too. Look for vegetables, a satisfying protein source and a grain or other carbohydrate.",
    },
    {
      key: "calendar",
      label: "Protect a meal break",
      response:
        "A protected meal break can make the day easier. Even a short pause gives you time to eat away from the screen.",
    },
  ],
  idle:
    "Choose one option to see the kind of practical discussion we use in the workshop.",
  foot: ["Live polls & group discussion", "Doctor & dietitian Q&A", "One action for the next day"],
};

export const care = {
  id: "care",
  eyebrow: "04 / Optional next steps",
  head: "Support that goes further, for those who want it.",
  intentTitle: "What we cover in the final 20%",
  intentCopy:
    "We introduce two optional paths: a workplace wellness series for employers and personalised care programmes for interested employees, with eligible corporate discounts. Everyone keeps the workshop takeaways whether or not they enrol.",
  cards: [
    {
      tag: "For organisations",
      title: "Workplace wellness programme",
      copy:
        "Nutrition and lifestyle education adapted to your company, with repeat workshops and practical follow-through shaped by employee needs.",
      points: [
        "Workshop series or ongoing cadence",
        "Desk-friendly movement and food habits",
        "Content tailored to your workforce",
      ],
      link: { label: "Discuss your team's needs", href: "#contact" },
      featured: false,
    },
    {
      tag: "For interested employees",
      title: "Personalised health support",
      copy:
        "Individual programmes for weight management and related health needs, including diabetes, high blood pressure and cardiovascular risk, as well as thyroid concerns where relevant.",
      points: [
        "Nutrition and lifestyle guidance",
        "Clinician-led assessment and follow-up",
        "Medication, including GLP-1 treatment, only when prescribed and appropriate",
      ],
      link: { label: "Ask about corporate access", href: "#contact" },
      featured: true,
    },
  ],
  note:
    "Eligible programmes are offered at a corporate discount, with package details discussed individually. Care plans depend on professional assessment.",
};

export const partners = {
  eyebrow: "Part of a wider care ecosystem",
  head: "Connected support when it matters.",
  names: ["Redcliffe Labs", "Mr.Med", "Cult"],
  caption:
    "Lean Protocol lists these partners across diagnostics, medicine access and activity support. Specific services depend on the selected programme and availability.",
};

export const evidence = {
  eyebrow: "05 / Why continuity matters",
  head: "A workshop starts the conversation. Support helps it continue.",
  copy:
    "External research offers a useful reason to pair education with longer-term action, while recognising that results from other programmes cannot predict Lean Protocol outcomes.",
  items: [
    {
      source: "UK weight management cohort",
      copy:
        "In a nine-month programme that included behavioural support and medication, survey respondents reported fewer sick-leave days at follow-up.",
      link: {
        label: "Read the Oviva poster",
        href: "https://oviva.com/global/wp-content/uploads/2026/05/Reference-No.-0203_Reduced-health-care-resource-utilisation-and-sick-days-after-9-months.pdf",
      },
    },
    {
      source: "Indian insurer coaching study",
      copy:
        "In a retrospective study, greater engagement with a nine-month coaching programme was associated with lower preventable-claim costs.",
      link: {
        label: "Read the study",
        href: "https://www.cureus.com/articles/423164-evaluating-the-impact-of-insurer-sponsored-health-coaching-on-hospitalization-and-costs-in-india-a-retrospective-cohort-study",
      },
    },
  ],
  note:
    "These are external, observational findings from different programmes. They do not establish that a Lean Protocol workshop reduces sick leave or healthcare costs.",
};

export const faqs = {
  eyebrow: "Good to know",
  head: "A few common questions.",
  items: [
    {
      q: "Do employees need to join a paid programme?",
      a: "No. Most of the workshop is practical education. Employees keep the takeaways whether or not they choose further support.",
    },
    {
      q: "Is this only for obesity management?",
      a: "No. The workshop offers nutrition, movement and lifestyle education for everyone. Optional individual care can support weight management and health needs such as diabetes, high blood pressure, cardiovascular risk and thyroid concerns. Medication is considered only after a clinician's assessment.",
    },
    {
      q: "Can this run more than once?",
      a: "Yes. A session every two weeks is one option. Each workshop can use polls, practical activities and live Q&A, with topics adapted to your team's needs.",
    },
    {
      q: "How does the learning turn into action?",
      a: "Employees practise realistic decisions during the workshop and choose one small action to try the next workday. Follow-up sessions can revisit what worked and what got in the way.",
    },
  ],
};

export const contact = {
  id: "contact",
  eyebrow: "Let's make healthy habits practical",
  headA: "Bring the conversation",
  headEm: "to your workplace.",
  copy:
    "Tell us about your team, your workday and the topics you want to address. We'll shape a workshop or series around what will be useful.",
  cardLabel: "Start with a conversation",
  email: "support@leanprotocol.in",
  emailSubject: "Workplace%20wellness%20workshop%20enquiry",
  emailCta: "Email Lean Protocol",
  cardCopy:
    "Ask about workshop format, repeat sessions and the corporate discount for optional programmes.",
  links: [
    { label: "Use the contact page", href: "/contact" },
    { label: "Call +91 96504 91267", href: "tel:+919650491267" },
  ],
};

export const footer = {
  tagline: "Practical wellbeing for the real workday.",
  backToTop: "Back to top",
  legal: "General wellbeing education; individual care requires professional assessment.",
  link: { label: "Explore patient support", href: "/psp" },
};
