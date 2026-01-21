import { notFound } from 'next/navigation';
import { medicationsData } from '@/data/medications-data';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import MedicationHero from '@/components/medications/dynamic/medications-hero';
import MedicationNav from '@/components/medications/dynamic/medication-nav';
import MedicationBasics from '@/components/medications/dynamic/medication-basics';
import MedicationBenefits from '@/components/medications/dynamic/medication-benefits';
import MedicationHowItWorks from '@/components/medications/dynamic/medication-howitworks';
import MedicationHowToUse from '@/components/medications/dynamic/medication-howtouse';
import MedicationAbout from '@/components/medications/dynamic/medication-about';
import AlternativeMedications from '@/components/medications/dynamic/altrnative-medications';
import GeneralPrecautions from '@/components/medications/dynamic/general-precautions';

// Generate static params for all medication pages
export async function generateStaticParams() {
  return Object.keys(medicationsData).map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const medication = medicationsData[slug];

  if (!medication) {
    return {
      title: 'Medication Not Lean Protocol',
    };
  }

  return {
    title: medication.title,
    description: medication.description,
  };
}

export default async function MedicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const medication = medicationsData[slug];

  if (!medication) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MedicationHero medication={medication} />

<div className="relative bg-white">
  {/* <MedicationNav /> */}
  <MedicationBasics medication={medication} />
  {medication.benefitsContent && medication.benefitsContent.benefitsList && (
    <MedicationBenefits medication={medication} />
  )}
  {medication.howItWorksContent && medication.howItWorksContent.processList && (
    <MedicationHowItWorks medication={medication} />
  )}
  {medication.howToUseContent && medication.howToUseContent.accordionItems && (
    <MedicationHowToUse medication={medication} />
  )}
</div>


      {/* Sections outside the wrapper will cause the nav to scroll away */}
      {/* <MedicationAbout /> */}
      {/* <AlternativeMedications /> */}
      <GeneralPrecautions/>
      <Footer />
    </div>
  );
}