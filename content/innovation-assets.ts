/**
 * Innovation page - asset manifest.
 *
 * Every image used on /innovation is declared here and nowhere else.
 * To swap an image, drop the new file into /public/innovation/ and change
 * the filename below. No component edits required.
 *
 * If a file is missing, <InnovationImage /> renders a "Visual asset pending"
 * placeholder that preserves the layout. The page never fails to build.
 */

export type InnovationAsset = {
  /** Path relative to /public */
  src: string;
  /** Accessible description. Never rely on text inside the image. */
  alt: string;
  /** Intrinsic width in px (used for aspect ratio + layout stability) */
  width: number;
  /** Intrinsic height in px */
  height: number;
  /** Optional caption rendered beneath the image */
  caption?: string;
  /** Short label shown in the placeholder card while the file is missing */
  placeholderLabel: string;
};

export const INNOVATION_ASSET_DIR = "/innovation";

export const innovationAssets = {
  logo: {
    src: "/logo-cropped.png",
    alt: "Lean Protocol Private Limited",
    width: 160,
    height: 44,
    placeholderLabel: "Company logo",
  },

  hero: {
    src: "/innovation/hero-platform-montage.webp",
    alt:
      "Montage of the proposed Lean Protocol platform: a patient application, a clinician review queue and a longitudinal outcomes view.",
    width: 1200,
    height: 900,
    caption:
      "Illustrative product interfaces representing the proposed connected-care platform.",
    placeholderLabel: "Platform montage",
  },

  fragmentedCare: {
    src: "/innovation/fragmented-care-system.webp",
    alt:
      "Diagram showing patient, doctor, dietitian and laboratory information held in separate systems with no shared longitudinal record.",
    width: 1100,
    height: 780,
    caption: "Illustrative representation of fragmented obesity care.",
    placeholderLabel: "Fragmented care diagram",
  },

  clinicalWorkflow: {
    src: "/innovation/clinical-action-workflow.webp",
    alt:
      "Workflow diagram: collect patient signals, build a longitudinal view, apply explainable scoring, raise reason-coded alerts, and record clinician-approved intervention.",
    width: 1400,
    height: 620,
    caption: "Illustrative workflow. Final logic subject to clinical validation.",
    placeholderLabel: "Clinical action workflow",
  },

  patientCompanion: {
    src: "/innovation/patient-companion.webp",
    alt:
      "Patient application screen showing a daily care plan, meal and hydration logging, and medication adherence.",
    width: 900,
    height: 1000,
    caption: "Lean Protocol Android app",
    placeholderLabel: "Patient companion",
  },

  symptomAdherence: {
    src: "/innovation/symptom-adherence.webp",
    alt:
      "Symptom reporting screen showing structured severity capture and symptom trends over time alongside adherence history.",
    width: 900,
    height: 1000,
    caption: "Lean Protocol Android app",
    placeholderLabel: "Symptoms and adherence",
  },

  clinicianCommandCentre: {
    src: "/innovation/clinician-command-centre.webp",
    alt:
      "Clinician dashboard showing a prioritised patient queue with reason-coded alerts and an approval workflow.",
    width: 1200,
    height: 860,
    caption: "Lean Protocol Android app",
    placeholderLabel: "Clinician command centre",
  },

  progressOutcomes: {
    src: "/innovation/progress-outcomes.webp",
    alt:
      "Outcomes view showing longitudinal weight trend, symptom burden, adherence trend and intervention history.",
    width: 1200,
    height: 860,
    caption: "Illustrative product interface",
    placeholderLabel: "Progress and outcomes",
  },

  technicalArchitecture: {
    src: "/innovation/technical-architecture.webp",
    alt:
      "Four-layer architecture diagram: patient and clinical inputs, secure data infrastructure, protocol and intelligence layer, and user interfaces.",
    width: 1400,
    height: 780,
    caption:
      "Proposed architecture subject to technical, clinical, security and regulatory validation.",
    placeholderLabel: "Technical architecture",
  },

  pilotValidation: {
    src: "/innovation/pilot-validation-framework.webp",
    alt:
      "Diagram of the proposed pilot: participant enrolment, monitoring period, outcome capture and analysis.",
    width: 1300,
    height: 760,
    caption:
      "Proposed framework. Final protocol to be developed with clinical partners.",
    placeholderLabel: "Pilot validation framework",
  },

  deploymentNetwork: {
    src: "/innovation/deployment-network.webp",
    alt:
      "Diagram showing intended deployment across metropolitan, Tier-2 and Tier-3 clinical settings.",
    width: 1200,
    height: 820,
    caption: "Illustrative deployment intent. Not a record of current operations.",
    placeholderLabel: "Deployment network",
  },

  prototypeRoadmap: {
    src: "/innovation/prototype-roadmap.webp",
    alt:
      "Twelve-month roadmap from architecture and workflow mapping through MVP build, controlled pilot, and validation reporting.",
    width: 1400,
    height: 640,
    caption: "Proposed twelve-month development and validation roadmap.",
    placeholderLabel: "Prototype roadmap",
  },

  socialPreview: {
    src: "/innovation/innovation-social-preview.webp",
    alt: "Lean Protocol Innovation",
    width: 1200,
    height: 630,
    placeholderLabel: "Social preview",
  },
} satisfies Record<string, InnovationAsset>;

export type InnovationAssetKey = keyof typeof innovationAssets;

/** Checklist of every asset the page expects - used by the README. */
export const innovationAssetChecklist = Object.entries(innovationAssets).map(
  ([key, asset]) => ({ key, file: asset.src, label: asset.placeholderLabel })
);
