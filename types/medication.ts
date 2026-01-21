export interface MedicationBenefit {
  icon: string;
  text: string;
}

export interface MedicationBasics {
  whatIs: string;
  features?: string[];
}

export interface BenefitsContent {
  subtitle: string;
  mainText?: string;       
  additionalText?: string; 
  note?: string;           
  benefitsList?: string[];
}

export interface HowItWorksContent {
  introText?: string;
  glpLink?: string;
  gipLink?: string;
  mechanismText?: string;
  brainSensitivityText?: string;
  drugActionText?: string;
  longTermText?: string;
  longTermLink?: string;
  personalizedText?: string;
  personalizedLink?: string;
  personalizedLinkText?: string;
  processList?: string[];
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface HowToUseContent {
  introText: string;
  accordionItems: AccordionItem[];
}

export interface Medication {
  name: string;
  slug: string;
  title: string;
  tags: string[];
  description: string;
  benefits: MedicationBenefit[];
  image: string;
  benefitsImage: string;
  basics: MedicationBasics;
  benefitsContent: BenefitsContent;
  howItWorksContent: HowItWorksContent;
  howToUseContent: HowToUseContent;
}

export type MedicationsData = {
  [key: string]: Medication;
};
