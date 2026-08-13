// content/workshop-test.ts
// Lean Protocol dietitian onboarding assessment.
// Pure ASCII: unicode via \u escapes (\u2014 em dash, \u2013 en dash).
//
// CLINICAL CONTENT - REVIEW BEFORE USE.
// These 15 questions were drafted for the onboarding workshop and must be
// checked by the clinician running the session. "rationale" is shown on the
// results screen after submission, not during the test.

export const TEST_CONFIG = {
  title: "GLP-1 Protocol Assessment",
  subtitle: "Dietitian onboarding workshop",
  durationMinutes: 15,
  graceMinutes: 2,
  passPercent: 80, // 12 of 15
  totalQuestions: 15,
};

export type Question = {
  id: number;
  q: string;
  options: string[];
  answer: number; // index into options
  rationale: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    q: "How do GLP-1 receptor agonists primarily support weight loss?",
    options: [
      "They block dietary fat from being absorbed in the small intestine",
      "They slow gastric emptying and increase satiety, reducing overall intake",
      "They directly increase resting metabolic rate by around 20%",
      "They prevent the body from storing any carbohydrate as fat",
    ],
    answer: 1,
    rationale:
      "GLP-1 receptor agonists mimic an endogenous incretin hormone. They slow gastric emptying, act on hypothalamic appetite centres to increase satiety, and stimulate insulin secretion in a glucose-dependent manner. They are not fat blockers and do not substantially raise metabolic rate.",
  },
  {
    id: 2,
    q: "Why is protein intake a priority for a member on a GLP-1 protocol?",
    options: [
      "Protein prevents the medication from causing nausea",
      "Protein is the only macronutrient that does not affect blood sugar",
      "Appetite falls sharply, so without a deliberate target, lean mass is lost alongside fat",
      "Protein speeds up how quickly the medication is cleared from the body",
    ],
    answer: 2,
    rationale:
      "Reduced appetite means total intake drops, and protein usually drops with it. Without an explicit target, a meaningful share of the weight lost can be lean mass rather than fat. Protecting muscle is a core part of the dietitian's role.",
  },
  {
    id: 3,
    q: "Which side effect is most commonly reported in the first weeks of treatment?",
    options: [
      "Nausea",
      "Hair loss",
      "Joint pain",
      "Skin rash",
    ],
    answer: 0,
    rationale:
      "Gastrointestinal effects, nausea in particular, are the most frequently reported. They are usually mild and tend to settle as the dose is titrated, but they should be monitored and escalated if they persist.",
  },
  {
    id: 4,
    q: "A member reports nausea after meals. Which adjustment is most appropriate?",
    options: [
      "Ask them to stop the medication until the nausea resolves",
      "Increase meal size so they finish eating faster",
      "Smaller, lower-fat meals eaten slowly, stopping at the first sign of fullness",
      "Replace all meals with fruit juice for a week",
    ],
    answer: 2,
    rationale:
      "Smaller, lower-fat, slowly eaten meals reduce the load on already-delayed gastric emptying. A dietitian does not advise stopping a prescribed medication \u2014 that decision belongs to the prescribing doctor, who should be informed if symptoms persist.",
  },
  {
    id: 5,
    q: "Using Asian-Indian BMI thresholds, overweight begins at a BMI of:",
    options: ["21", "23", "25", "27"],
    answer: 1,
    rationale:
      "Asian-Indian populations show higher cardiometabolic risk at lower BMI than WHO international cut-offs. Overweight begins at 23 and obesity at 25, rather than 25 and 30. Lean Protocol uses these thresholds throughout.",
  },
  {
    id: 6,
    q: "Why do fibre and fluid intake need active attention on a GLP-1 protocol?",
    options: [
      "They increase the absorption of the medication",
      "Slowed gut motility and reduced intake make constipation common",
      "They are needed to prevent an allergic reaction",
      "They replace the need for a protein target",
    ],
    answer: 1,
    rationale:
      "Delayed gastric emptying and a smaller total food volume make constipation one of the more common complaints. Adequate fibre and fluid, introduced gradually, help manage it.",
  },
  {
    id: 7,
    q: "What is the main risk of rapid weight loss without resistance training and adequate protein?",
    options: [
      "The member will regain the weight within a week",
      "Loss of lean muscle mass, which lowers resting energy expenditure",
      "The medication stops working permanently",
      "Blood sugar becomes impossible to control",
    ],
    answer: 1,
    rationale:
      "Rapid loss without a protein and resistance-training stimulus takes a larger proportion from lean tissue. Because muscle is metabolically active, losing it lowers resting energy expenditure and makes maintenance harder later.",
  },
  {
    id: 8,
    q: "Why is the dose titrated gradually rather than started at the maintenance level?",
    options: [
      "To make the treatment course last longer commercially",
      "Because the body builds tolerance if the full dose is used immediately",
      "To reduce gastrointestinal side effects and improve tolerability",
      "Because the full dose is unsafe in all patients",
    ],
    answer: 2,
    rationale:
      "Gradual titration allows the gut to adapt and markedly reduces nausea and other GI effects. The schedule is set by the prescribing doctor and adjusted at review.",
  },
  {
    id: 9,
    q: "Which history would typically be a contraindication to GLP-1 receptor agonist therapy?",
    options: [
      "Seasonal allergies",
      "Personal or family history of medullary thyroid carcinoma or MEN2",
      "Mild iron deficiency",
      "A previous ankle fracture",
    ],
    answer: 1,
    rationale:
      "A personal or family history of medullary thyroid carcinoma, or Multiple Endocrine Neoplasia syndrome type 2, is a recognised contraindication for this drug class. Eligibility is assessed by the prescribing doctor, never by the dietitian.",
  },
  {
    id: 10,
    q: "Tirzepatide differs from semaglutide in that it acts on:",
    options: [
      "Only the GLP-1 receptor, but for longer",
      "Both GIP and GLP-1 receptors",
      "Neither receptor \u2014 it works through a different mechanism entirely",
      "The insulin receptor directly",
    ],
    answer: 1,
    rationale:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist, whereas semaglutide is a selective GLP-1 receptor agonist. Both are prescription-only and prescribed at the doctor's discretion.",
  },
  {
    id: 11,
    q: "With sustained low food volume, which nutritional risk should the dietitian monitor?",
    options: [
      "Excess vitamin C",
      "Inadequate micronutrient intake, such as iron, B12 and calcium",
      "Too much dietary fibre",
      "Excess protein causing kidney failure in healthy adults",
    ],
    answer: 1,
    rationale:
      "A sustained drop in total intake risks shortfalls in iron, B12, calcium and other micronutrients. Meals should be planned for nutrient density rather than volume, with supplementation considered where clinically indicated.",
  },
  {
    id: 12,
    q: "What typically happens when medication stops without established habits?",
    options: [
      "The weight lost is permanently maintained regardless of diet",
      "Appetite returns and weight regain is likely without nutrition and activity habits in place",
      "Metabolism permanently resets to a higher rate",
      "The member becomes unable to feel hunger again",
    ],
    answer: 1,
    rationale:
      "The medication modulates appetite while it is being taken. When it stops, appetite returns. Sustained outcomes depend on the nutrition, movement and behavioural habits built during treatment \u2014 which is precisely where the dietitian's work matters most.",
  },
  {
    id: 13,
    q: "Which best describes the dietitian's role within the protocol?",
    options: [
      "To adjust the medication dose based on how much weight the member has lost",
      "To decide whether the member is eligible for GLP-1 medication",
      "To build a nutrition plan that protects lean mass and manages side effects, alongside the doctor",
      "To replace medical follow-up once the plan is issued",
    ],
    answer: 2,
    rationale:
      "Dosing and eligibility are medical decisions belonging to the prescribing doctor. The dietitian builds and adapts the nutrition plan, protects lean mass, manages tolerability, and escalates clinical concerns to the doctor.",
  },
  {
    id: 14,
    q: "Which is most likely to worsen gastrointestinal symptoms?",
    options: [
      "Large, high-fat meals and alcohol",
      "Drinking water between meals",
      "Eating a moderate portion of dal with rice",
      "Walking for twenty minutes after eating",
    ],
    answer: 0,
    rationale:
      "Large, high-fat meals sit in an already slowly emptying stomach, and alcohol adds further irritation. Both commonly aggravate nausea and reflux on this class of medication.",
  },
  {
    id: 15,
    q: "A member asks you to increase their dose because progress feels slow. What do you do?",
    options: [
      "Advise a higher dose, since they are not progressing",
      "Tell them to take two doses in the same week",
      "Refer the question to the prescribing doctor and review nutrition, protein and activity in the meantime",
      "Tell them the medication is not working and they should stop",
    ],
    answer: 2,
    rationale:
      "Any dose change is a clinical decision for the prescribing doctor. The dietitian's contribution is to review what is within scope \u2014 protein intake, meal structure, activity and adherence \u2014 and to escalate the dosing question appropriately.",
  },
];
