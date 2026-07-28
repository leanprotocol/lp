import { company, seo } from "@/content/innovation";

import { InnovationHeader } from "@/components/innovation/InnovationHeader";
import { InnovationHero } from "@/components/innovation/InnovationHero";
import { InstitutionalTrustBar } from "@/components/innovation/InstitutionalTrustBar";
import { ClinicalGapSection } from "@/components/innovation/ClinicalGapSection";
import { ProductWorkflowSection } from "@/components/innovation/ProductWorkflowSection";
import { ProductModulesSection } from "@/components/innovation/ProductModulesSection";
import { TechnicalDistinctivenessSection } from "@/components/innovation/TechnicalDistinctivenessSection";
import { TechnicalArchitectureSection } from "@/components/innovation/TechnicalArchitectureSection";
import { CurrentStageSection } from "@/components/innovation/CurrentStageSection";
import { ResearchProgrammeSection } from "@/components/innovation/ResearchProgrammeSection";
import { PilotValidationSection } from "@/components/innovation/PilotValidationSection";
import { AccessibleDeploymentSection } from "@/components/innovation/AccessibleDeploymentSection";
import { DevelopmentRoadmapSection } from "@/components/innovation/DevelopmentRoadmapSection";
import { ClinicalGovernanceSection } from "@/components/innovation/ClinicalGovernanceSection";
import { TeamCapabilitySection } from "@/components/innovation/TeamCapabilitySection";
import { CollaborationSection } from "@/components/innovation/CollaborationSection";
import { InnovationContactForm } from "@/components/innovation/InnovationContactForm";
import { InnovationFAQ } from "@/components/innovation/InnovationFAQ";
import { InstitutionalFooter } from "@/components/innovation/InstitutionalFooter";

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  url: company.mainSite,
  description: seo.description,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: company.mainSite },
    { "@type": "ListItem", position: 2, name: "Innovation", item: company.canonical },
  ],
};

export default function InnovationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <a href="#main" className="inv-skip">Skip to main content</a>

      <InnovationHeader />

      <main id="main">
        <InnovationHero />
        <InstitutionalTrustBar />

        {/* Problem */}
        <ClinicalGapSection />

        {/* Technology */}
        <ProductWorkflowSection />
        <ProductModulesSection />
        <TechnicalDistinctivenessSection />

        {/* Architecture */}
        <TechnicalArchitectureSection />
        <CurrentStageSection />

        {/* Validation */}
        <ResearchProgrammeSection />
        <PilotValidationSection />
        <AccessibleDeploymentSection />

        {/* Roadmap */}
        <DevelopmentRoadmapSection />

        {/* Governance */}
        <ClinicalGovernanceSection />
        <TeamCapabilitySection />

        {/* Collaborate */}
        <CollaborationSection />
        <InnovationContactForm />
        <InnovationFAQ />
      </main>

      <InstitutionalFooter />
    </>
  );
}
