/**
 * Innovation page - editable content.
 *
 * All copy lives here so the page can be updated without touching components.
 *
 * VERIFICATION PLACEHOLDERS
 * Anything wrapped in [SQUARE BRACKETS] is unverified and must be replaced
 * with a confirmed value before this page is shown to evaluators.
 * Metric cards with unverified values are hidden automatically -
 * see `isVerified()` below.
 */

/** A value is treated as unverified while it still contains [BRACKETS]. */
export function isVerified(value?: string | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !/\[.*\]/.test(trimmed);
}

/** Product-stage labels. Every claim on the page carries one of these. */
export const stages = {
  existing: "Existing workflow",
  building: "Prototype under development",
  proposed: "Proposed R&D module",
  planned: "Planned validation",
  illustrative: "Illustrative product interface",
} as const;

export type Stage = keyof typeof stages;

export const company = {
  legalName: "Lean Protocol Private Limited",
  shortName: "Lean Protocol",
  recognition: "DPIIT-recognised startup",
  structure: "Private limited company",
  location: "Uttar Pradesh, India",
  cin: "[INSERT VERIFIED CIN]",
  registeredOffice: "[INSERT VERIFIED ADDRESS]",
  email: "[INSERT VERIFIED COMPANY EMAIL]",
  phone: "[INSERT VERIFIED PHONE NUMBER]",
  mainSite: "https://www.leanprotocol.in",
  canonical: "https://www.leanprotocol.in/innovation",
};

export const nav = {
  items: [
    { label: "Problem", href: "#problem" },
    { label: "Technology", href: "#technology" },
    { label: "Architecture", href: "#architecture" },
    { label: "Validation", href: "#validation" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Governance", href: "#governance" },
    { label: "Collaborate", href: "#collaborate" },
  ],
  careProgrammesLabel: "Lean Protocol Care Programmes",
  careProgrammesHref: "/",
};

export const hero = {
  eyebrow: "Lean Protocol Innovation",
  headline: "Building the Intelligence Layer for Safer Obesity Care",
  supporting:
    "Lean Protocol is developing a clinician-supervised platform that unifies symptoms, adherence, lifestyle, laboratory information and treatment progress into one continuous obesity-care workflow.",
  trustMarkers: [
    "Clinician supervised",
    "Explainable decision support",
    "Designed for Indian care settings",
  ],
  primaryCta: { label: "Explore the Technology", href: "#technology" },
  secondaryCta: { label: "Discuss a Clinical Collaboration", href: "#collaborate" },
  /** Set `href` to a real file in /public to show the button. */
  documentCta: { label: "Download Innovation Brief", href: "" },
};

export const trustBar = {
  intro: "Positioned for institutional and clinical evaluation",
  items: [
    { label: "DPIIT-recognised startup", detail: "Government of India" },
    { label: "Clinician-supervised design", detail: "Human accountability retained" },
    { label: "Explainable decision support", detail: "No unexplained scores" },
    { label: "Built for Indian care settings", detail: "Urban, Tier-2 and Tier-3" },
  ],
};

export const positioning = {
  statement:
    "An intelligent clinical monitoring and care-coordination layer for safer, personalised and scalable obesity treatment.",
  technology:
    "Explainable clinical decision support for treatment monitoring, adherence and timely escalation.",
  boundary:
    "The platform supports monitoring, prioritisation and care coordination. It does not independently diagnose, prescribe or change medication. Final clinical decisions remain with qualified healthcare professionals.",
};

export const clinicalGap = {
  id: "problem",
  eyebrow: "The clinical gap",
  headline:
    "Obesity treatment continues between consultations. Most care systems do not.",
  intro:
    "Treatment for obesity is longitudinal. The information that determines whether it is working - and whether it is safe - accumulates in the weeks between appointments, where no system is watching.",
  problems: [
    {
      title: "Symptoms evolve between consultations",
      body: "Nausea, fatigue and gastrointestinal effects change week to week and are rarely captured in a structured form.",
    },
    {
      title: "Medication adherence may be inconsistent",
      body: "Missed or delayed doses are often discovered at the next visit rather than when they happen.",
    },
    {
      title: "Nutritional intake can become inadequate",
      body: "Reduced appetite can quietly cross from intended restriction into insufficient intake.",
    },
    {
      title: "Hydration may decline",
      body: "Falling fluid intake is a common and under-reported contributor to avoidable side effects.",
    },
    {
      title: "Side effects may go unreported",
      body: "Patients frequently wait for a scheduled appointment instead of reporting a problem when it appears.",
    },
    {
      title: "Information is fragmented",
      body: "Doctors, dietitians, laboratories and patients each hold part of the record and none holds all of it.",
    },
    {
      title: "Follow-up depends on manual communication",
      body: "Coordination runs on phone calls and messages, and scales linearly with headcount.",
    },
    {
      title: "Clinical escalation can occur late",
      body: "Without prioritisation, the patient who needs attention first is not reliably the patient seen first.",
    },
    {
      title: "Longitudinal outcomes are rarely structured",
      body: "Programme-level learning is limited when outcomes are not captured in a comparable format.",
    },
  ],
  diagramCentre: "No unified longitudinal care layer",
  diagramNodes: [
    "Patient",
    "Doctor",
    "Dietitian",
    "Laboratory",
    "Symptoms",
    "Medication",
    "Weight",
    "Activity",
  ],
  supporting:
    "The challenge is not simply collecting more data. It is converting relevant patient information into timely, clinically governed action.",
};

export const workflow = {
  id: "technology",
  eyebrow: "Product workflow",
  headline: "One continuous workflow from patient signal to clinician-approved action",
  steps: [
    {
      n: "1",
      title: "Collect",
      body: "Symptoms, medication, meals, hydration, weight, activity and laboratory information.",
    },
    {
      n: "2",
      title: "Understand",
      body: "Build a longitudinal view of the patient's treatment stage and changing context.",
    },
    {
      n: "3",
      title: "Score",
      body: "Apply explainable adherence and risk logic.",
    },
    {
      n: "4",
      title: "Alert",
      body: "Prioritise patients through reason-coded red, amber and green alerts.",
    },
    {
      n: "5",
      title: "Intervene",
      body: "Allow qualified care professionals to review, approve and track actions.",
    },
  ],
  safety:
    "The platform supports monitoring and triage. It does not independently diagnose or prescribe.",
};

export const modules = {
  eyebrow: "Product modules",
  headline: "A connected platform for patients and care teams",
  intro:
    "Four modules share one longitudinal record: what the patient reports, what the care team sees, and what happens next.",
  items: [
    {
      key: "patientCompanion" as const,
      number: "01",
      title: "Patient Companion",
      stage: "existing" as const,
      summary:
        "A daily companion for people in active treatment, designed so that reporting takes seconds rather than effort.",
      functions: [
        "Daily care plan",
        "Meal and hydration logging",
        "Symptom reporting",
        "Medication adherence",
        "Weight and activity tracking",
        "Educational content",
        "Care-team connection",
      ],
    },
    {
      key: "symptomAdherence" as const,
      number: "02",
      title: "Symptoms and Adherence",
      stage: "existing" as const,
      summary:
        "Structured capture of side effects and dosing behaviour, so a deteriorating pattern is visible before it becomes an event.",
      functions: [
        "Structured symptom reporting",
        "Severity tracking",
        "Symptom trends",
        "Adherence monitoring",
        "Trigger identification",
        "Care-team notes",
        "Early escalation support",
      ],
    },
    {
      key: "clinicianCommandCentre" as const,
      number: "03",
      title: "Clinician Command Centre",
      stage: "existing" as const,
      summary:
        "A prioritised queue that answers one question first: which patient needs a clinician today, and why.",
      functions: [
        "Prioritised patient queue",
        "Explainable alert factors",
        "Risk summaries",
        "Clinician approval workflow",
        "Intervention history",
        "Follow-up monitoring",
      ],
    },
    {
      key: "progressOutcomes" as const,
      number: "04",
      title: "Progress and Outcomes",
      stage: "proposed" as const,
      summary:
        "Longitudinal outcome capture at patient and programme level, structured for review and research.",
      functions: [
        "Longitudinal weight trends",
        "Symptom burden",
        "Adherence trends",
        "Intervention outcomes",
        "Dropout-risk signals",
        "Aggregate programme insights",
      ],
    },
  ],
};

export const distinctiveness = {
  eyebrow: "Technical distinctiveness",
  headline: "Not another generic health tracker",
  intro: "Proposed proprietary data and decision-support architecture.",
  cards: [
    {
      title: "India-specific diet and symptom ontology",
      body: "Structures Indian meals, dietary habits, gastrointestinal triggers, hydration patterns and treatment behaviours into clinically useful information.",
      icon: "utensils",
    },
    {
      title: "Longitudinal patient intelligence",
      body: "Evaluates changing patterns across weeks rather than isolated daily entries.",
      icon: "trending",
    },
    {
      title: "Explainable decision support",
      body: "Shows the contributing factors behind each risk signal rather than presenting an unexplained score.",
      icon: "eye",
    },
    {
      title: "Clinician feedback loop",
      body: "Records reviewed interventions and outcomes so workflows can be refined over time.",
      icon: "refresh",
    },
    {
      title: "Privacy by design",
      body: "Uses consent-led collection, role-based access, auditable actions and limited health-data exposure.",
      icon: "shield",
    },
  ],
};

export const architecture = {
  id: "architecture",
  eyebrow: "Technical architecture",
  headline: "Designed as a modular and auditable healthcare platform",
  layers: [
    {
      n: "Layer 1",
      title: "Patient and clinical inputs",
      items: [
        "Symptoms",
        "Medication adherence",
        "Weight",
        "Nutrition",
        "Hydration",
        "Activity",
        "Laboratory results",
        "Clinician notes",
      ],
    },
    {
      n: "Layer 2",
      title: "Secure data infrastructure",
      items: [
        "Supabase PostgreSQL",
        "Longitudinal patient records",
        "Consent management",
        "Role-based access",
        "Audit logs",
        "Secure storage",
      ],
    },
    {
      n: "Layer 3",
      title: "Protocol and intelligence layer",
      items: [
        "Clinical rules",
        "Risk stratification",
        "Adherence logic",
        "Trend detection",
        "Explainability",
        "Intervention workflows",
      ],
    },
    {
      n: "Layer 4",
      title: "User interfaces",
      items: [
        "Patient application",
        "Doctor dashboard",
        "Dietitian dashboard",
        "Operations dashboard",
        "Outcomes dashboard",
      ],
    },
  ],
  disclaimer:
    "Proposed architecture subject to technical, clinical, security and regulatory validation.",
};

export const currentStage = {
  eyebrow: "Current stage",
  headline: "From an operating care workflow to a scalable technology platform",
  columns: [
    {
      stage: "existing" as const,
      title: "Existing operational learning",
      items: [
        "Existing obesity-care delivery workflow",
        "Doctor and dietitian involvement",
        "Patient follow-up experience",
        "Symptom-management experience",
        "Medication-adherence experience",
        "Operational understanding of patient dropout",
      ],
    },
    {
      stage: "building" as const,
      title: "Product development underway",
      items: [
        "Patient application",
        "Clinician dashboard",
        "Structured symptom workflows",
        "Data architecture",
        "Care-team coordination workflows",
      ],
    },
    {
      stage: "planned" as const,
      title: "R&D and validation required",
      items: [
        "Explainable risk engine",
        "Clinical-rule validation",
        "Prospective pilot",
        "Security testing",
        "Usability testing",
        "Multi-site deployment readiness",
      ],
    },
  ],
  /** Cards hide automatically until the bracketed placeholder is replaced. */
  metrics: [
    { label: "Patients served", value: "[VERIFIED PATIENTS SERVED]" },
    { label: "Clinical professionals", value: "[VERIFIED CLINICAL PROFESSIONALS]" },
    { label: "Months operating", value: "[VERIFIED OPERATING MONTHS]" },
    { label: "Engagement metric", value: "[VERIFIED ENGAGEMENT METRIC]" },
  ],
};

export const researchProgramme = {
  eyebrow: "Proposed SBIRI R&D programme",
  headline: "Proposed Research and Development Programme",
  projectTitle:
    "Development and Initial Validation of an Explainable Clinical Decision-Support Platform for Obesity-Treatment Monitoring and Adherence",
  objectives: [
    "Develop a secure longitudinal patient-data platform",
    "Build patient and clinician interfaces",
    "Formalise protocol-led risk and escalation workflows",
    "Develop explainable adherence and symptom intelligence",
    "Conduct initial technical and clinical validation",
    "Prepare the platform for controlled multi-clinic deployment",
  ],
  endpoint:
    "A validated prototype ready for prospective clinical and operational evaluation.",
  projectInfo: [
    { label: "Applicant", value: "Lean Protocol Private Limited" },
    { label: "Recognition", value: "DPIIT-recognised startup" },
    { label: "Legal structure", value: "Private limited company" },
    { label: "Location", value: "Uttar Pradesh, India" },
    { label: "Proposed duration", value: "[INSERT VERIFIED DURATION]" },
    { label: "Proposed project cost", value: "[INSERT VERIFIED COST]" },
    { label: "Proposed grant support", value: "[INSERT VERIFIED ASK]" },
  ],
};

export const pilot = {
  id: "validation",
  eyebrow: "Pilot and validation",
  headline: "Validation focused on safety, adherence and clinical usability",
  parameters: [
    { label: "Participants", value: "[INSERT PROPOSED NUMBER]" },
    { label: "Clinical sites", value: "[INSERT PROPOSED NUMBER]" },
    { label: "Duration", value: "[INSERT PROPOSED PERIOD]" },
  ],
  primaryOutcomes: [
    "Patient engagement",
    "Completeness of symptom reporting",
    "Medication-adherence tracking",
    "Alert response time",
    "Escalation completion",
    "Clinician usability",
    "Follow-up completion",
    "Disengagement or dropout signals",
  ],
  secondaryOutcomes: [
    "Change in symptom burden",
    "Intervention acceptance",
    "Continuity of follow-up",
    "Clinician time saved",
    "Patient understanding",
  ],
  statement:
    "The final protocol, endpoints, ethics requirements and statistical methodology will be developed with qualified clinical and research partners.",
};

export const deployment = {
  eyebrow: "Accessible deployment",
  headline: "Designed for deployment beyond premium metropolitan care",
  intro:
    "The platform is being designed for scalable deployment across urban and underserved Tier-2 and Tier-3 clinical settings, where continuous specialist follow-up may be limited.",
  points: [
    { title: "Mobile-first access", body: "Built for the device patients already own." },
    { title: "Low-bandwidth readiness", body: "Designed to remain usable on constrained connections." },
    { title: "Multilingual interface potential", body: "Interface strings structured for translation." },
    { title: "Clinic-assisted onboarding", body: "Staff can enrol patients who need help getting started." },
    { title: "Simple patient reporting", body: "Short structured inputs rather than free-text diaries." },
    { title: "Deployment through smaller clinics", body: "No dependence on large hospital IT infrastructure." },
    { title: "Tier-2 and Tier-3 applicability", body: "Designed for settings with limited specialist density." },
    { title: "Care-team support", body: "Extends supervision where specialist access is intermittent." },
  ],
};

export const roadmap = {
  id: "roadmap",
  eyebrow: "Development roadmap",
  headline: "Phased development from prototype to deployment readiness",
  phases: [
    {
      period: "Months 1-3",
      title: "Foundation",
      items: [
        "Architecture",
        "Data schema",
        "Clinical workflow mapping",
        "UI flows",
        "Consent framework",
      ],
    },
    {
      period: "Months 4-6",
      title: "Build",
      items: [
        "Patient application MVP",
        "Clinician dashboard",
        "Initial clinical rules",
        "Internal deployment",
        "Quality assurance",
      ],
    },
    {
      period: "Months 7-9",
      title: "Pilot",
      items: [
        "Controlled pilot",
        "Data annotation",
        "Alert-quality review",
        "Usability feedback",
        "Model and workflow refinement",
      ],
    },
    {
      period: "Months 10-12",
      title: "Validation",
      items: [
        "Validation report",
        "Security testing",
        "IP documentation",
        "Technical documentation",
        "Clinic deployment package",
      ],
    },
  ],
  endState:
    "A demonstrable product with pilot evidence, clinician usability feedback and a roadmap to commercial deployment.",
};

export const governance = {
  id: "governance",
  eyebrow: "Clinical safety and governance",
  headline: "Clinical intelligence with human accountability",
  cards: [
    {
      title: "Clinician in the loop",
      body: "Every escalation is reviewed and approved by a qualified professional before it reaches a patient.",
      icon: "stethoscope",
    },
    {
      title: "Explainable alerts",
      body: "Each alert shows the factors that produced it, so a clinician can agree or disagree on the evidence.",
      icon: "eye",
    },
    {
      title: "Defined escalation protocols",
      body: "Thresholds and routes are written down in advance rather than decided case by case.",
      icon: "route",
    },
    {
      title: "Auditable intervention history",
      body: "Who saw what, when, and what they did is recorded and reviewable.",
      icon: "file",
    },
  ],
  disclaimers: [
    "The platform is not a substitute for emergency care.",
    "The platform does not independently diagnose.",
    "The platform does not independently prescribe.",
    "The platform does not change medication automatically.",
    "Clinical decisions must be reviewed by qualified professionals.",
    "Medical-device and regulatory classification will be evaluated as the product develops.",
  ],
  policies: [
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Patient consent policy", href: "#" },
    { label: "Data-retention policy", href: "#" },
    { label: "Clinical-safety policy", href: "#" },
    { label: "Terms of use", href: "/terms" },
  ],
};

export const team = {
  eyebrow: "Team capability",
  headline: "Built at the intersection of clinical care, technology and patient operations",
  note: "Roles without a confirmed appointment are marked as planned project roles.",
  members: [
    {
      role: "Founder and CEO",
      name: "[INSERT VERIFIED NAME]",
      focus: "Company direction, care operations and institutional partnerships.",
      photo: "",
    },
    {
      role: "Clinical lead",
      name: "[INSERT VERIFIED NAME]",
      focus: "Clinical protocols, escalation thresholds and medical governance.",
      photo: "",
    },
    {
      role: "Product and technology lead",
      name: "[INSERT VERIFIED NAME]",
      focus: "Platform architecture, security and delivery.",
      photo: "",
    },
    {
      role: "Nutrition and behavioural-care lead",
      name: "[INSERT VERIFIED NAME]",
      focus: "Dietary protocols, adherence support and patient engagement.",
      photo: "",
    },
    {
      role: "AI and data-science advisor",
      name: "[INSERT VERIFIED NAME]",
      focus: "Explainability, risk logic and evaluation methodology.",
      photo: "",
    },
    {
      role: "Regulatory or research advisor",
      name: "[INSERT VERIFIED NAME]",
      focus: "Study design, ethics pathway and regulatory classification.",
      photo: "",
    },
  ],
  plannedRoleLabel: "Planned project role",
};

export const collaboration = {
  id: "collaborate",
  eyebrow: "Collaboration",
  headline: "Collaborate on the future of obesity-care infrastructure",
  paths: [
    {
      title: "Clinical and research partners",
      body: "For pilot design, protocol validation and clinical deployment.",
      cta: "Discuss a Clinical Pilot",
      value: "Clinical pilot",
      icon: "stethoscope",
    },
    {
      title: "Technology collaborators",
      body: "For secure health-data systems, explainable intelligence and healthcare integrations.",
      cta: "Explore Research Collaboration",
      value: "Technology partnership",
      icon: "cpu",
    },
    {
      title: "Incubators and institutions",
      body: "For R&D mentorship, validation infrastructure and commercialisation support.",
      cta: "Contact the Innovation Team",
      value: "Institutional enquiry",
      icon: "building",
    },
  ],
};

export const contactForm = {
  eyebrow: "Contact",
  headline: "Contact the innovation team",
  intro:
    "Tell us how you would like to work together. Enquiries reach the innovation team directly.",
  collaborationTypes: [
    "Government or grant programme",
    "Incubator",
    "Clinical pilot",
    "Research collaboration",
    "Technology partnership",
    "Investment",
    "Institutional enquiry",
    "Other",
  ],
  consentLabel:
    "I consent to Lean Protocol storing these details to respond to this enquiry.",
  successTitle: "Enquiry received",
  successBody:
    "Thank you. The innovation team will respond to your enquiry at the email address you provided.",
};

export const faq = {
  eyebrow: "Questions",
  headline: "Frequently asked questions",
  items: [
    {
      q: "Is this a medical device?",
      a: "Medical-device and regulatory classification will be evaluated as the product develops. The platform is designed as a monitoring and care-coordination layer that supports qualified professionals; it does not independently diagnose, prescribe or change medication.",
    },
    {
      q: "Does the platform make clinical decisions?",
      a: "No. It prioritises and explains. Every escalation is reviewed and approved by a qualified clinician before action is taken, and that review is recorded.",
    },
    {
      q: "What stage is the product at today?",
      a: "An obesity-care delivery workflow is already operating with clinicians and dietitians. The patient application, clinician dashboard and data architecture are under development. The explainable risk engine, clinical-rule validation and prospective pilot are proposed R&D.",
    },
    {
      q: "Are the interfaces shown on this page live?",
      a: "No. Every interface shown is labelled as an illustrative product interface or a prototype under development. None should be read as a deployed feature.",
    },
    {
      q: "How is patient data protected?",
      a: "The design uses consent-led collection, role-based access, audit logging and limited health-data exposure. Security testing is included in the proposed validation programme.",
    },
    {
      q: "Where would the platform be deployed?",
      a: "It is being designed for urban as well as Tier-2 and Tier-3 clinical settings, where continuous specialist follow-up may be limited. Deployment claims will be made only once sites are confirmed.",
    },
  ],
};

export const seo = {
  title: "Lean Protocol Innovation | Clinician-Supervised Obesity Care Technology",
  description:
    "Lean Protocol is developing a clinician-supervised obesity-care platform integrating symptom monitoring, adherence, metabolic information and explainable clinical decision support.",
  keywords: [
    "obesity care technology India",
    "digital health innovation India",
    "clinical decision support obesity",
    "metabolic health platform",
    "obesity treatment monitoring",
    "healthtech Uttar Pradesh",
    "clinician-supervised health platform",
    "BIRAC healthcare innovation",
    "SBIRI healthtech project",
  ],
};

export const footer = {
  disclaimer:
    "Lean Protocol develops technology to support clinician-led obesity and metabolic-health care. The platform does not replace qualified medical advice, diagnosis or treatment.",
  links: [
    { label: "Main website", href: "/" },
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms of use", href: "/terms" },
    { label: "Clinical disclaimer", href: "#governance" },
  ],
};
