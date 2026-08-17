// content/psp.ts
// Copy for the B2B Patient Support Programme site at /psp.
// Pure ASCII: unicode via \u escapes. Indian/British English throughout:
// "Programme", never "Program", except inside a cited study title.
// No em dashes anywhere in visible copy.
//
// COMPLIANCE: phrases here are approved language. Do not reword claims
// about titration, outcomes, data access or dispensing without review.

export const NAV = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Patient Journey", href: "#journey" },
  { label: "Therapy Areas", href: "#therapies" },
  { label: "Programme Intelligence", href: "#intelligence" },
  { label: "Published Evidence", href: "#evidence" },
  { label: "Defined Pilot", href: "#pilot" },
];

export const CTA = {
  primary: "Request Demo",
  secondary: "Request our Post-Prescription Patient Support Blueprint",
};

export const HERO = {
  eyebrow: "WHITE-LABELLED PATIENT SUPPORT PROGRAMMES",
  headline: "Build the patient experience around your therapy.",
  copy: "Lean Protocol provides the trained care teams, technology and protocol-led coordination required to design and operate a white-labelled Patient Support Programme after prescription.",
  secondary: "Built for complex metabolic and chronic-care journeys.",
  audience: "Designed for pharmaceutical business, portfolio and Medical Affairs teams.",
  trust: [
    "Post-prescription care infrastructure",
    "Protocol-led care coordination",
    "Persistence & continuity",
    "Programme visibility & insights",
    "Defined patient-support pilot",
  ],
};

export const PROBLEM = {
  headline: "What happens after the prescription shapes what happens next.",
  copy: "Appropriate prescriptions can still be lost to delayed initiation, early side effects, uncertainty around administration, missed follow-ups, interrupted titration and refill drop-off. Lean Protocol closes these operational gaps with a structured support journey around the therapy.",
  cards: [
    {
      title: "Therapy initiation",
      body: "Help appropriate patients move from prescription to supported onboarding.",
    },
    {
      title: "Persistence and refill continuity",
      body: "Reduce avoidable drop-off through education, follow-ups and care-team intervention.",
    },
    {
      title: "Physician follow-up attendance",
      body: "Keep patients connected with their treating physician at clinically relevant milestones.",
    },
    {
      title: "Programme intelligence",
      body: "Capture structured, consented insights from symptoms, diagnostics, adherence and discontinuation patterns.",
    },
  ],
  note: "Better persistence can protect therapy value by reducing avoidable discontinuation and generating additional appropriate therapy-months.",
};

export const STAKEHOLDERS = {
  headline: "Built for every team accountable for the therapy.",
  columns: [
    {
      title: "Commercial Leadership",
      points: [
        "Improve therapy initiation and appropriate persistence",
        "Strengthen portfolio differentiation",
        "Support refill continuity",
        "Build a trusted patient experience around the brand",
        "Identify operational causes of discontinuation",
        "Expand through regional and multilingual delivery",
      ],
    },
    {
      title: "Medical Affairs",
      points: [
        "Medical-approved education workflows",
        "Structured symptom and side-effect capture",
        "Defined adverse-event and product-quality escalation",
        "Treating-physician independence",
        "Consent and data-governance controls",
        "Auditable care-team activity",
      ],
    },
    {
      title: "Portfolio and New Product Planning",
      points: [
        "Launch-ready care infrastructure",
        "Therapy-specific programme configuration",
        "Defined regional pilot",
        "Modular services and commercial structure",
        "White-labelled technology and care channels",
        "Scale without building the operating team internally",
      ],
    },
  ],
};

export const THERAPIES = {
  headline: "One care infrastructure. Configured around the therapy.",
  cards: [
    {
      title: "Obesity and GLP-1",
      points: [
        "First-dose guidance",
        "Nutrition and muscle-preservation support",
        "Symptom and tolerability logging",
        "Physician-led titration coordination",
        "Persistence and maintenance workflows",
      ],
    },
    {
      title: "Diabetes",
      points: [
        "Glucose and medication logging",
        "Diet and lifestyle education",
        "Injection-technique guidance",
        "Diagnostic follow-ups",
        "Medication continuity",
      ],
    },
    {
      title: "Hypertension and Dyslipidaemia",
      points: [
        "BP and lipid monitoring",
        "Medication reminders",
        "Diet and risk-factor support",
        "Diagnostic tracking",
        "Physician follow-up coordination",
      ],
    },
    {
      title: "Heart Health and Post-Event Support",
      points: [
        "Secondary-prevention education",
        "Medication adherence",
        "Rehabilitation and lifestyle routines",
        "Risk-symptom capture",
        "Scheduled physician follow-ups",
      ],
      note: "This programme supports scheduled, non-urgent care. It does not replace emergency services.",
    },
    {
      title: "PCOS and Women's Metabolic Health",
      points: [
        "Symptom and cycle logging",
        "Diet and activity support",
        "Diagnostic-report tracking",
        "Medication adherence",
        "Multidisciplinary coordination",
      ],
    },
    {
      title: "Sleep Health and OSA",
      points: [
        "Treatment adherence",
        "Sleep and symptom logging",
        "Lifestyle and weight-related support",
        "Device or therapy education where applicable",
        "Provider follow-ups",
      ],
    },
  ],
};

export const JOURNEY = {
  headline: "A structured journey from prescription to continuity.",
  copy: "Operational milestones, not fixed time periods. Each programme is configured around the therapy and the approved prescribing information.",
  steps: [
    "Prescription verified and patient onboarded",
    "Baseline assessment completed",
    "Patient education and personalised diet chart",
    "Live first-dose guidance",
    "Follow-ups and symptom logging",
    "Side-effect support and protocol-led escalation",
    "Treating-physician review and titration coordination",
    "Diagnostics, delivery and clinician-approved adjunct support",
    "Persistence, outcomes and programme insight",
  ],
  endState: "Supported patients. Better continuity. Visible programme performance.",
  titration: {
    label: "Physician-led titration continuity",
    headline: "Keep patients supported through every prescribed escalation milestone.",
    copy: "As dosing changes, patients may experience uncertainty, tolerability concerns or missed follow-ups. Lean Protocol captures symptoms, reinforces approved education and coordinates timely review with the treating physician.",
    note: "Dose escalation is therapy-specific and remains solely at the discretion of the treating physician, based on approved prescribing information, clinical response and tolerability.",
  },
};

export const CAPABILITIES = {
  headline: "Everything required to operate the programme after prescription.",
  layers: [
    {
      title: "Patient Experience",
      points: [
        "Prescription-based onboarding",
        "Online patient education course",
        "Welcome call and orientation",
        "Personalised diet and activity plan",
        "Live first-dose guidance",
        "Medication and lifestyle reminders",
        "Multilingual support",
        "WhatsApp, app and helpline access",
      ],
    },
    {
      title: "Care Operations",
      points: [
        "Dietitians",
        "Health coaches",
        "Care coordinators",
        "Provider-support team",
        "Symptom monitoring",
        "Side-effect screening",
        "Follow-up scheduling",
        "Escalation to the treating physician",
        "Field coordination",
      ],
    },
    {
      title: "Access and Fulfilment",
      points: [
        "Licensed-pharmacy coordination",
        "Home-delivery coordination",
        "Diagnostics scheduling and report collection",
        "Optional patient-assistance benefits",
        "Clinician-approved supplementation or adjunct coordination",
        "Refill and purchase-continuity workflows",
      ],
      note: "Medicines are dispensed by authorised third-party pharmacies. Lean Protocol coordinates fulfilment and does not dispense medication.",
    },
    {
      title: "Technology and Visibility",
      points: [
        "White-labelled patient application",
        "Doctor dashboard",
        "Dietitian dashboard",
        "Operations dashboard",
        "Adherence scoring",
        "Symptom and diagnostic logging",
        "Early-risk alerts",
        "Escalation tracking",
        "Progress reports",
        "Discontinuation analytics",
        "Cohort-level programme reporting",
      ],
    },
  ],
};

export const INTELLIGENCE = {
  headline: "Turn patient-support activity into structured programme intelligence.",
  copy: "With patient consent and appropriate governance, Lean Protocol converts fragmented follow-ups into measurable insights across onboarding, adherence, symptoms, diagnostics and continuity.",
  dashboardLabel: "Illustrative Programme Dashboard",
  modules: [
    "Referred patients",
    "Verified enrolments",
    "Onboarding completion",
    "First-dose completion",
    "Physician follow-up attendance",
    "Persistence curve",
    "Dose-stage distribution",
    "Symptom trends",
    "Diagnostic-report completion",
    "Refill continuity",
    "Escalation status",
    "Reasons for discontinuation",
    "Patient satisfaction",
  ],
  governance: [
    "Consented data capture",
    "Role-based access",
    "De-identified or aggregated reporting",
    "Programme-level insights",
    "Governed data exchange",
    "Contractually defined access",
  ],
  richer:
    "Richer, consented programme intelligence from symptom logging, diagnostic reports and longitudinal follow-up.",
};

export const EVIDENCE = {
  headline: "Patient support is measurable.",
  intro:
    "Published research across chronic and complex therapies has associated structured patient support with stronger adherence, lower discontinuation and greater therapy utilisation. Results depend on therapy, population and programme design.",
  cards: [
    {
      kind: "stat" as const,
      title: "Cross-Therapy Review",
      stat: "66%",
      label:
        "of adherence-focused studies in a targeted systematic review reported a positive adherence outcome.",
      detail: "27 of 41 adherence studies reported improvement.",
      source: "https://pubmed.ncbi.nlm.nih.gov/27175071/",
      sourceLabel: "PubMed 27175071",
    },
    {
      kind: "humira" as const,
      title: "HUMIRA Complete",
      stats: [
        { value: "29.3%", label: "higher adherence" },
        { value: "22.0%", label: "lower discontinuation" },
        { value: "12.2%", label: "higher drug spending over 12 months" },
      ],
      bars: [
        { label: "PSP adherence", value: 64.8 },
        { label: "Matched non-PSP adherence", value: 50.1 },
      ],
      copy: "In a matched US observational analysis of 2,268 adalimumab patients, PSP participation was associated with higher adherence, lower discontinuation and higher drug utilisation over 12 months.",
      footnote:
        "Retrospective US adalimumab study. Manufacturer-funded. Association does not establish a guaranteed commercial outcome for another therapy or programme.",
      source: "https://www.jmcp.org/doi/pdf/10.18553/jmcp.2019.18443",
      sourceLabel: "JMCP 2019",
    },
    {
      kind: "coach" as const,
      title: "Diabetes COACH Programme",
      groups: [
        { label: "Twelve-month adherence", withPsp: 68.0, without: 61.4 },
        { label: "Twelve-month persistence", withPsp: 48.5, without: 42.1 },
      ],
      hazard: "Adjusted discontinuation hazard ratio: 0.60",
      copy: "A matched analysis of basal-insulin patients found stronger adherence and persistence among active PSP participants.",
      source: "https://drc.bmj.com/content/6/1/e000593",
      sourceLabel: "BMJ Open Diabetes Research & Care",
    },
  ],
  disclaimer:
    "Published evidence is shown as a category benchmark. These figures are not Lean Protocol outcomes, forecasts or guarantees. Programme impact must be measured within each defined pilot.",
  indiaBenchmark: {
    copy: "Lupin reports that Humrahi supported approximately 2.67 lakh patients in FY26 across 12 Indian languages.",
    source: "https://www.lupin.com/our-business/india/patient-support-programs",
    sourceLabel: "Lupin",
  },
};

export const CONTINUITY = {
  headline: "Measure commercial value through appropriate patient continuity.",
  copy: "Commercial value is created when more appropriately prescribed patients initiate therapy, remain supported through early barriers, attend physician reviews and continue for the clinically appropriate duration.",
  formula:
    "Incremental supported therapy-months = Enrolled patients \u00D7 improvement in average appropriate persistence",
  calculatorLabel: "Illustrative planning tool. Not a sales forecast.",
};

export const WHITELABEL = {
  headline: "Your therapy. Your programme. Our operating infrastructure.",
  flow: [
    "Pharmaceutical company defines the therapy programme and approved materials.",
    "Treating physician independently prescribes and introduces the programme.",
    "The patient enrols through a branded QR code, helpline, WhatsApp or application.",
    "Lean Protocol operates the care journey under the agreed brand.",
    "Programme teams receive governed operational and cohort-level reporting.",
  ],
  options: [
    "Fully branded programme identity",
    "Co-branded programme",
    "Dedicated helpline",
    "Dedicated landing page or domain",
    "Brand-approved education",
    "Configured patient application",
    "Therapy-specific care protocols",
    "Configured reports and dashboards",
  ],
};

export const PILOT = {
  headline: "Start with a defined patient-support pilot.",
  copy: "Configure the programme around one therapy, one region and agreed success measures. Begin with North India, then expand through multilingual care delivery and regional operating teams.",
  stages: [
    {
      title: "Define",
      body: "Map the therapy journey, patient barriers, governance, service levels and KPIs.",
    },
    {
      title: "Configure",
      body: "Set up the care protocol, white-labelled technology, approved content and referral pathways.",
    },
    {
      title: "Operate",
      body: "Onboard patients, coordinate care, track symptoms and support physician follow-ups.",
    },
    {
      title: "Measure and Scale",
      body: "Review persistence, drop-off, programme engagement and operational performance before expanding to new regions and languages.",
    },
  ],
};

export const WHY = {
  headline: "Built through real post-prescription care operations.",
  points: [
    "Existing multidisciplinary care-team operations",
    "Existing online patient education course",
    "Patient, doctor, dietitian and operations technology",
    "Symptom, adherence, weight, activity and diagnostic tracking",
    "Care coordination and physician escalation",
    "Existing experience supporting complex metabolic journeys",
    "Ability to begin in North India",
    "Designed for regional-language expansion",
    "White-labelled programme configuration",
  ],
  partners:
    "Lean Protocol currently works with diagnostic, pharmacy, cold-chain and home-fitness partners.",
};

export const FAQS = [
  {
    q: "What is a Patient Support Programme?",
    a: "A Patient Support Programme is a structured set of services that supports a patient after a therapy has been prescribed. It typically covers onboarding, education, administration guidance, symptom monitoring, follow-up coordination and continuity support, delivered under agreed clinical and governance protocols.",
  },
  {
    q: "Is this a PSP or a Patient Assistance Programme?",
    a: "This is a Patient Support Programme. A Patient Assistance Programme, which provides financial or access benefits, can be configured as an optional module within the programme where the sponsor requires it.",
  },
  {
    q: "Does Lean Protocol prescribe or supply medicines?",
    a: "No. Lean Protocol does not manufacture, prescribe or dispense medicines. Diagnosis, prescribing, dose and discontinuation decisions rest exclusively with the treating physician. Medication fulfilment is coordinated through authorised third-party pharmacies.",
  },
  {
    q: "Can the programme be fully white-labelled?",
    a: "Yes. The programme can run under a fully branded identity or as a co-branded programme, with a dedicated helpline, landing page, configured patient application, brand-approved education and configured reporting.",
  },
  {
    q: "Which therapy areas can be supported?",
    a: "The care infrastructure is configured per therapy. Current configurations cover obesity and GLP-1, type 2 diabetes, hypertension, dyslipidaemia, heart health and post-event support, PCOS and women's metabolic health, and sleep health including obstructive sleep apnoea.",
  },
  {
    q: "How are side effects and adverse events handled?",
    a: "Symptoms and side effects are captured through structured logging. Protocol-led escalation routes clinical concerns to the treating physician. Adverse events and product-quality complaints are escalated under the pharmaceutical company's agreed pharmacovigilance process within the timelines defined in the programme agreement.",
  },
  {
    q: "Does the programme replace the treating physician?",
    a: "No. The programme supports the patient between clinical reviews and coordinates timely follow-up. All clinical decisions remain with the treating physician.",
  },
  {
    q: "Is the service an emergency service?",
    a: "No. The programme provides always-on digital symptom capture with protocol-led escalation. It is not an emergency service and does not replace emergency medical care.",
  },
  {
    q: "How is patient data handled?",
    a: "Patient information is captured with consent and handled under applicable Indian data-protection requirements. Access is role-based and contractually defined. Reporting to programme sponsors is de-identified or aggregated unless disclosure of identifiable data is explicitly permitted by consent, law and contract.",
  },
  {
    q: "Can the programme begin as a North India pilot?",
    a: "Yes. A defined pilot is the recommended starting point: one therapy, one region and agreed success measures, before expanding through multilingual delivery and regional operating teams.",
  },
  {
    q: "How does commercial engagement work?",
    a: "Engagements can be structured through programme implementation, a defined monthly operating commitment and a per-active-patient fee. Cohort-based pilots can also be configured.",
  },
];

export const FINAL = {
  headline: "Build the patient experience around your therapy.",
  copy: "Request a focused discussion around your therapy, patient journey and proposed programme model.",
};

export const THERAPY_OPTIONS = [
  "Obesity and GLP-1",
  "Diabetes",
  "Hypertension and Dyslipidaemia",
  "Heart Health",
  "PCOS and Women's Metabolic Health",
  "Sleep Health and OSA",
  "Other",
];

export const PROGRAMME_STATUS = [
  "No programme currently running",
  "Programme in planning",
  "Programme running in-house",
  "Programme running with a vendor",
  "Evaluating options",
];

export const GEOGRAPHY_OPTIONS = [
  "North India",
  "West India",
  "South India",
  "East India",
  "Pan-India",
  "Not yet defined",
];

export const COMPLIANCE_FOOTER =
  "Lean Protocol does not manufacture, prescribe or dispense medicines. Programmes begin after a valid prescription where a prescription is required. All diagnosis, prescribing, dose and discontinuation decisions rest with the treating physician. Medication fulfilment is coordinated through authorised third-party pharmacies. Patient information is captured with consent and handled under applicable Indian data-protection requirements.";
