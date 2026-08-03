/**
 * Policy copy for the /users enquiry funnel.
 *
 * These are specific to the enquiry form and are NOT the same as the
 * site-wide policies at /privacy-policy and /terms-conditions.
 *
 * Kept as plain data so the wording can be updated without touching layout.
 * No raw non-ASCII characters: apostrophes and dashes use HTML entities so
 * the file cannot be corrupted by an editor writing ANSI.
 */

export const policyMeta = {
  effectiveDate: "3 August 2026",
  company: "Lean Protocol Private Limited",
  cin: "U86201UP2025PTC238980",
  address: "Noida, Uttar Pradesh, India",
  email: "support@leanprotocol.in",
  phone: "+91 96504 91267",
};

export type Section = {
  heading: string;
  paras?: string[];
  bullets?: string[];
  /** Paragraphs rendered after the bullet list */
  after?: string[];
};

export const termsSections: Section[] = [
  {
    heading: "1. Scope",
    paras: [
      "These Terms apply only to Lean Protocol&rsquo;s enquiry landing page, questionnaire and connected lead-generation form (&ldquo;Form&rdquo;). They do not govern any paid programme, clinical consultation, diagnostic service, medicine fulfilment or other healthcare service. Separate terms and consents will be provided before any such service begins.",
      "By submitting the Form, you agree to these Terms and acknowledge our Privacy Policy.",
    ],
  },
  {
    heading: "2. About Lean Protocol",
    paras: [
      "Lean Protocol Private Limited (&ldquo;Lean Protocol&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates a technology-enabled, expert-guided weight-management service in India.",
      "The purpose of this Form is to understand your general goals, preferences and contact requirements so our team can respond appropriately.",
    ],
  },
  {
    heading: "3. Eligibility",
    paras: ["You may submit the Form only if you:"],
    bullets: [
      "Are at least 18 years old;",
      "Are located in India;",
      "Are submitting information for yourself; and",
      "Provide accurate information to the best of your knowledge.",
    ],
  },
  {
    heading: "4. Enquiry Only",
    paras: ["Submitting the Form:"],
    bullets: [
      "Does not create a doctor-patient relationship;",
      "Does not constitute medical advice, diagnosis or prescription;",
      "Does not confirm your eligibility for any programme or treatment;",
      "Does not reserve or purchase any service; and",
      "Does not guarantee any particular result.",
    ],
    after: [
      "Any clinical recommendation can be made only after a separate assessment by a qualified healthcare professional exercising independent clinical judgement.",
    ],
  },
  {
    heading: "5. Not for Emergencies",
    paras: [
      "The Form is not monitored for urgent medical concerns. If you experience severe or urgent symptoms, seek immediate in-person medical care or call India&rsquo;s emergency number, 112.",
    ],
  },
  {
    heading: "6. Permission to Respond",
    paras: [
      "By submitting the Form, you request Lean Protocol to contact you regarding your enquiry through the contact details provided, including by telephone, WhatsApp, SMS or email.",
      "This enquiry-related contact is separate from promotional marketing. Educational updates or offers may be sent only where you provide separate optional consent, which may be withdrawn at any time.",
    ],
  },
  {
    heading: "7. Responsible Use",
    paras: [
      "You must not submit false information, impersonate another person, attempt unauthorised access, introduce harmful code or otherwise misuse the Form.",
      "We may refuse or discontinue responding to submissions that appear false, abusive, fraudulent or unlawful.",
    ],
  },
  {
    heading: "8. Third-Party Platforms",
    paras: [
      "The Form may be hosted, delivered or supported by an advertising or technology platform. Your use of that platform may also be governed by its own terms and privacy policy.",
      "Lean Protocol is not responsible for interruptions or technical failures caused by third-party platforms outside our reasonable control.",
    ],
  },
  {
    heading: "9. General Disclaimer",
    paras: [
      "Information presented on the enquiry page is general and educational. It is not a substitute for professional medical advice.",
      "Individual suitability and outcomes vary. Nothing displayed through the Form should be interpreted as a promise or guarantee of weight loss, clinical eligibility or treatment availability.",
      "Nothing in these Terms excludes any consumer right or liability that cannot legally be excluded.",
    ],
  },
  {
    heading: "10. Updates and Applicable Law",
    paras: [
      "We may update these Terms prospectively by changing the effective date. Indian law applies, subject to any non-waivable consumer rights.",
    ],
  },
];

export const privacySections: Section[] = [
  {
    heading: "1. Scope",
    paras: [
      "This Privacy Policy applies only to personal information collected through Lean Protocol&rsquo;s enquiry landing page, questionnaire and connected lead-generation form (&ldquo;Form&rdquo;).",
      "If you subsequently purchase or use a Lean Protocol service, additional privacy notices and clinical consents may apply.",
    ],
  },
  {
    heading: "2. Information We Collect",
    paras: ["Depending on the Form, we may collect:"],
    bullets: [
      "Your name, telephone number, email address and city;",
      "Your general weight-management goals;",
      "Your preferred support, programme duration and contact time;",
      "Your current weight and selected health conditions;",
      "Your form responses and communication history; and",
      "Basic technical, campaign-source and submission information.",
    ],
    after: ["Please provide only the information requested through the Form."],
  },
  {
    heading: "3. How We Use Your Information",
    paras: ["We may use the information to:"],
    bullets: [
      "Respond to your enquiry;",
      "Contact you at your preferred time;",
      "Route your enquiry to an appropriate team member;",
      "Understand broad service suitability;",
      "Arrange an introductory call or consultation;",
      "Maintain enquiry and consent records;",
      "Prevent fraud, misuse or security incidents;",
      "Comply with applicable law; and",
      "Analyse aggregated or de-identified service trends.",
    ],
    after: [
      "We do not make a diagnosis, prescription or treatment decision solely from Form responses.",
    ],
  },
  {
    heading: "4. Health-Related Information",
    paras: [
      "Your weight and medical-condition responses may constitute health-related information. We process these answers only to understand and appropriately route your enquiry.",
      "Submitting this information does not replace a formal medical assessment. If you proceed further, your complete medical history will be collected separately through an appropriate clinical process.",
    ],
  },
  {
    heading: "5. Contact and Marketing Consent",
    paras: [
      "Submitting the Form authorises Lean Protocol to contact you about your enquiry by telephone, WhatsApp, SMS or email.",
      "Promotional messages, educational updates or offers should be sent only where you provide separate optional consent. You may withdraw marketing consent at any time without affecting your enquiry or access to services.",
    ],
  },
  {
    heading: "6. Sharing of Information",
    paras: [
      "We do not sell or rent your personal information.",
      "Information may be shared only as reasonably necessary with:",
    ],
    bullets: [
      "Authorised Lean Protocol personnel;",
      "Vendors supporting form hosting, customer management, communications, analytics or security;",
      "Qualified healthcare professionals or service partners if you choose to proceed further; and",
      "Government, regulatory or legal authorities where required by law.",
    ],
    after: [
      "Some technology providers may process information outside India, subject to applicable legal and contractual safeguards.",
    ],
  },
  {
    heading: "7. Advertising and Technology Platforms",
    paras: [
      "If Meta, Google or another platform hosts or delivers the Form, that platform may separately process information under its own privacy policy.",
      "Lean Protocol does not use your questionnaire answers to target you based on a medical condition. The landing page may use limited cookies or similar technologies for security, functionality, analytics and campaign attribution.",
    ],
  },
  {
    heading: "8. Retention and Security",
    paras: [
      "We retain enquiry information only for as long as reasonably necessary to respond, conduct appropriate follow-up, meet legal obligations or protect lawful claims.",
      "If you become a customer, relevant information may form part of records governed by separate service terms and legal retention requirements.",
      "We use reasonable administrative and technical safeguards. However, no online transmission or storage system can be guaranteed completely secure.",
    ],
  },
  {
    heading: "9. Your Rights",
    paras: ["Subject to applicable law, you may request:"],
    bullets: [
      "Access to your personal information;",
      "Correction of inaccurate information;",
      "Deletion of information that is no longer required;",
      "Withdrawal of consent; or",
      "Discontinuation of promotional communications.",
    ],
    after: [
      "We may verify your identity before processing a request. Certain information may be retained where required by law or legitimate record-keeping obligations.",
    ],
  },
  {
    heading: "10. Users Below 18",
    paras: [
      "The Form is intended only for adults. We do not knowingly collect information from individuals below 18 years of age through this Form.",
    ],
  },
  {
    heading: "11. Updates",
    paras: [
      "We may update this Privacy Policy prospectively. The latest effective date will be displayed at the beginning of the Policy.",
    ],
  },
];
