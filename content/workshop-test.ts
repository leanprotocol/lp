// content/workshop-test.ts
// Lean Protocol dietitian onboarding assessment.
// Pure ASCII: unicode via \u escapes.
//
// Generated from the approved question document. Wording is verbatim -
// do not paraphrase questions, options or explanations without review.
//
// 20 questions in the bank. Each participant is served 15 of them, chosen
// and ordered by their own seed, so no two people sit an identical paper.
// "rationale" appears on the results screen after submission only.

export const TEST_CONFIG = {
  title: "GLP-1 Protocol Assessment",
  subtitle: "Dietitian onboarding workshop",
  durationMinutes: 15,
  graceMinutes: 2, // shown separately as "extra time"
  passPercent: 80, // 12 of 15
  questionsPerTest: 15,
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
    q: "What does GLP 1 stand for?",
    options: [
      "Glucose Like Peptide 1",
      "Glucagon Like Peptide 1",
      "Glucose Linked Polypeptide 1",
      "Glucagon Linked Peptide 1",
    ],
    answer: 1,
    rationale:
      "GLP-1 stands for Glucagon-Like Peptide-1. The name reflects its structural similarity to glucagon, as both are derived from the proglucagon gene. It is an incretin hormone released from the gut in response to food, and despite the shared name its metabolic actions are largely opposite to those of glucagon.",
  },
  {
    id: 2,
    q: "What does GIP stand for?",
    options: [
      "Glucose Insulin Peptide",
      "Gastric Inhibitory Peptide",
      "Glucose Dependent Insulinotropic Polypeptide",
      "Glucose Induced Insulin Peptide",
    ],
    answer: 2,
    rationale:
      "GIP is now called Glucose-Dependent Insulinotropic Polypeptide. It was originally named Gastric Inhibitory Peptide, which is why the older name remains a common answer, but the name was revised once its principal action was understood to be glucose-dependent stimulation of insulin secretion rather than inhibition of gastric acid.",
  },
  {
    id: 3,
    q: "Where is GLP 1 primarily produced?",
    options: [
      "Stomach",
      "Pancreas",
      "L cells of the intestine",
      "Liver",
    ],
    answer: 2,
    rationale:
      "GLP-1 is secreted by enteroendocrine L cells, found mainly in the distal small intestine and colon, in response to nutrients reaching the gut. This is why it is described as an incretin: the signal originates in the intestine and then acts on the pancreas and the brain, rather than being produced by either.",
  },
  {
    id: 4,
    q: "Which receptor is shared by semaglutide and tirzepatide?",
    options: [
      "GIP receptor",
      "GLP 1 receptor",
      "Glucagon receptor",
      "Amylin receptor",
    ],
    answer: 1,
    rationale:
      "Semaglutide is a selective GLP-1 receptor agonist, while tirzepatide acts on both the GIP and GLP-1 receptors. The GLP-1 receptor is therefore the one they have in common. The GIP receptor is unique to tirzepatide among these two.",
  },
  {
    id: 5,
    q: "Why can a tablet and an injection containing the same active molecule not necessarily be considered equivalent at the same numerical dose?",
    options: [
      "Route of administration affects bioavailability and pharmacokinetics",
      "Tablets contain inactive GLP 1",
      "Injections contain no active drug",
      "Receptors respond differently to milligrams depending on BMI",
    ],
    answer: 0,
    rationale:
      "The milligrams stated on a package describe how much drug is administered, not how much reaches the bloodstream. Oral peptides face degradation in the stomach and poor absorption, so only a small fraction becomes systemically available, whereas a subcutaneous injection bypasses that barrier almost entirely. The same number on two different routes therefore represents very different exposure.",
  },
  {
    id: 7,
    q: "Why are semaglutide and tirzepatide generally introduced through dose escalation schedules rather than immediately at their highest therapeutic doses?",
    options: [
      "To prevent the drugs from losing efficacy",
      "Primarily to improve gastrointestinal tolerability",
      "To increase renal clearance",
      "To prevent weight loss during the first few weeks",
    ],
    answer: 1,
    rationale:
      "Starting at a high dose markedly increases nausea, vomiting and other gastrointestinal effects. Gradual escalation allows the gut to adapt, which keeps people on treatment rather than discontinuing early. The schedule is set by the prescribing doctor and adjusted at review, not by the patient or the dietitian.",
  },
  {
    id: 8,
    q: "Tirzepatide differs pharmacologically from semaglutide because tirzepatide acts on:",
    options: [
      "GLP 1 and GIP receptors",
      "GLP 1 and cortisol receptors",
      "Insulin and leptin receptors",
      "GIP and thyroid receptors",
    ],
    answer: 0,
    rationale:
      "Tirzepatide is a dual agonist, binding both the GIP and GLP-1 receptors, whereas semaglutide targets the GLP-1 receptor alone. Adding GIP activity is the pharmacological difference between the two molecules. Neither acts on cortisol, leptin, insulin or thyroid receptors.",
  },
  {
    id: 9,
    q: "A significant reduction in appetite during GLP 1 therapy makes which nutritional priority particularly important?",
    options: [
      "Eliminating carbohydrates",
      "Ensuring adequate protein and overall nutrient intake",
      "Increasing saturated fat intake",
      "Skipping meals whenever hunger is absent",
    ],
    answer: 1,
    rationale:
      "When appetite falls sharply, total intake falls with it, and protein and micronutrients usually fall fastest. Without a deliberate target, a meaningful share of the weight lost can be lean tissue rather than fat. Skipping meals because hunger is absent compounds the problem, which is why structured intake matters more, not less, once appetite drops.",
  },
  {
    id: 10,
    q: "Which statement regarding semaglutide's pharmacokinetics is correct?",
    options: [
      "It has a half life of approximately 6 hours",
      "It requires multiple daily administration",
      "Its prolonged half life permits once weekly administration",
      "It is eliminated exclusively through renal filtration",
    ],
    answer: 2,
    rationale:
      "Semaglutide has a half-life of roughly one week, achieved through structural modifications that slow degradation and promote albumin binding. That is what makes once-weekly injection possible. Elimination occurs through several routes, including metabolism, rather than renal filtration alone.",
  },
  {
    id: 11,
    q: "Which of the following is not an incretin based medication?",
    options: [
      "Semaglutide",
      "Liraglutide",
      "Tirzepatide",
      "Metformin",
    ],
    answer: 3,
    rationale:
      "Semaglutide and liraglutide are GLP-1 receptor agonists and tirzepatide is a dual GIP/GLP-1 agonist, so all three act on the incretin system. Metformin is a biguanide and works through entirely different mechanisms, principally reducing hepatic glucose production and improving insulin sensitivity.",
  },
  {
    id: 12,
    q: "A patient loses 12 kg during semaglutide therapy. Fat mass decreases by 9 kg and lean mass decreases by 3 kg. Hand grip strength remains unchanged and resistance training performance improves. Which interpretation is BEST?",
    options: [
      "The patient has sarcopenia because lean mass decreased",
      "The patient has experienced no muscle loss",
      "Lean mass reduction doesn't necessarily mean less muscle function.",
      "Semaglutide selectively causes skeletal muscle breakdown",
    ],
    answer: 2,
    rationale:
      "Lean mass is not the same as contractile muscle. It also includes water, glycogen and the tissue that supports a larger body, all of which fall as weight is lost. Here grip strength held and training performance improved, so function was preserved. Sarcopenia is defined by loss of muscle function and strength, not by a number on a body composition report alone.",
  },
  {
    id: 13,
    q: "Which of the following is NOT a typical side effect of GLP1 medication",
    options: [
      "Nausea",
      "Diarrhea",
      "Constipation",
      "Headache",
    ],
    answer: 3,
    rationale:
      "The characteristic adverse effects of this drug class are gastrointestinal, reflecting slowed gastric emptying and altered gut motility: nausea, vomiting, diarrhoea and constipation. Headache can occur, as it can with many medications, but it is not a typical or class-defining effect.",
  },
  {
    id: 14,
    q: "Which statement most accurately distinguishes the pharmacological mechanisms of semaglutide and tirzepatide?",
    options: [
      "Semaglutide is a dual GLP 1/GIP receptor agonist, while tirzepatide is a selective GLP 1 receptor agonist",
      "Semaglutide is a GLP 1 receptor agonist, while tirzepatide is a dual GIP/GLP 1 receptor agonist",
      "Both are dual GLP 1/GIP receptor agonists but differ only in half life",
      "Both primarily act through GIP receptors",
    ],
    answer: 1,
    rationale:
      "Semaglutide is a selective GLP-1 receptor agonist; tirzepatide is a dual GIP and GLP-1 receptor agonist. Option A reverses the two, which is the most common error. The difference is one of receptor targets, not simply half-life.",
  },
  {
    id: 15,
    q: "During pharmacologically induced weight loss, adequate protein intake and resistance exercise are particularly important for:",
    options: [
      "Increasing appetite",
      "Preserving lean body mass",
      "Preventing all gastrointestinal adverse effects",
      "Increasing gastric emptying",
    ],
    answer: 1,
    rationale:
      "Rapid weight loss without a protein and resistance-training stimulus takes a larger proportion from lean tissue. Because muscle is metabolically active, losing it lowers resting energy expenditure and makes maintenance harder afterwards. Protein and resistance work do not prevent gastrointestinal effects, which are managed separately through meal size, fat content and pacing.",
  },
  {
    id: 16,
    q: "Why is clinically significant hypoglycaemia generally less characteristic of GLP 1 receptor agonist monotherapy than of therapies that stimulate insulin secretion independently of glucose?",
    options: [
      "GLP 1 receptor agonists prevent glucose from entering cells",
      "Their insulinotropic effect is glucose dependent",
      "They permanently suppress glucagon secretion",
      "They increase urinary glucose excretion in all patients",
    ],
    answer: 1,
    rationale:
      "GLP-1 receptor agonists stimulate insulin release only when blood glucose is elevated, and the effect subsides as glucose normalises. Sulfonylureas, by contrast, drive insulin secretion regardless of glucose level, which is why they carry a higher hypoglycaemia risk. Risk does rise when a GLP-1 agonist is combined with insulin or a sulfonylurea, which is a matter for the prescribing doctor.",
  },
  {
    id: 17,
    q: "Which statement BEST explains the appetite suppressing effect of GLP 1 based therapy?",
    options: [
      "It primarily increases basal metabolic rate",
      "It increases intestinal glucose absorption",
      "Central appetite signalling and gastrointestinal effects contribute to reduced energy intake",
      "It directly oxidises adipose tissue",
    ],
    answer: 2,
    rationale:
      "Two mechanisms work together. Centrally, GLP-1 receptors in hypothalamic and brainstem appetite centres increase satiety and reduce food-seeking behaviour. Peripherally, slowed gastric emptying prolongs the sense of fullness after eating. The medication does not meaningfully raise metabolic rate or act directly on fat tissue.",
  },
  {
    id: 18,
    q: "Which statement correctly distinguishes oral semaglutide from injectable semaglutide?",
    options: [
      "Oral semaglutide contains a different active drug",
      "Both contain semaglutide, but their formulations and routes of administration differ",
      "Oral semaglutide is a GIP/GLP 1 agonist, while injectable semaglutide is GLP 1 only",
      "Oral semaglutide is a DPP 4 inhibitor",
    ],
    answer: 1,
    rationale:
      "The active molecule is identical. The oral formulation includes an absorption enhancer that allows a small fraction of the peptide to cross the stomach lining, which is why the tablet dose is numerically much higher than the injected dose and why it must be taken on an empty stomach with specific timing. Same drug, different delivery.",
  },
  {
    id: 19,
    q: "Why can substantial weight loss potentially result in clinically meaningful lean mass loss?",
    options: [
      "GLP 1 directly destroys skeletal muscle",
      "Reduced energy and protein intake can accompany weight loss",
      "GLP 1 permanently inhibits muscle protein synthesis",
      "GLP 1 increases muscle breakdown in every individual",
    ],
    answer: 1,
    rationale:
      "The medication does not act on muscle tissue. Lean mass is lost because a large energy deficit combined with reduced protein intake removes the stimulus needed to maintain it, which happens with substantial weight loss by any method. This is exactly why the nutrition plan and resistance training matter, and it is where the dietitian's work makes the difference.",
  },
  {
    id: 20,
    q: "What is one of the major effects of GLP 1 receptor activation?",
    options: [
      "Increased appetite",
      "Increased satiety",
      "Increased gastric emptying",
      "Increased glucagon secretion",
    ],
    answer: 1,
    rationale:
      "GLP-1 receptor activation increases satiety, slows rather than speeds gastric emptying, and suppresses rather than increases glucagon secretion. Options A, C and D each state the opposite of the actual effect.",
  },
  {
    id: 21,
    q: "Why can reduced appetite during GLP 1 therapy increase the risk of inadequate nutritional intake?",
    options: [
      "Appetite suppression selectively reduces carbohydrate absorption",
      "Reduced food intake can decrease protein, energy and micronutrient intake",
      "GLP 1 therapy prevents absorption of all micronutrients",
      "Appetite suppression directly increases nutrient requirements",
    ],
    answer: 1,
    rationale:
      "The effect is on how much is eaten, not on how well nutrients are absorbed. A sustained drop in total intake risks shortfalls in protein, energy and micronutrients such as iron, B12 and calcium. Meals should therefore be planned for nutrient density rather than volume, since the volume tolerated is now smaller.",
  },
];
