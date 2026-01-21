import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Medication } from '@/types/medication';

// Thin stroke icons matching the image aesthetic
const BloodSugarIcon = () => (
  <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L15 8H9L12 2Z" />
    <circle cx="12" cy="14" r="6" />
    <path d="M12 11V17" />
  </svg>
);

const AppetiteIcon = () => (
  <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 3.337A8 8 0 1 1 6.168 16.5m10.832-13.163A8 8 0 0 0 3.337 17" />
    <path d="M12 8v8" />
  </svg>
);

const InsulinIcon = () => (
  <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 12h16M12 4v16" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'blood-sugar': return <BloodSugarIcon />;
    case 'appetite': return <AppetiteIcon />;
    case 'insulin': return <InsulinIcon />;
    default: return <BloodSugarIcon />;
  }
};

interface MedicationHeroProps {
  medication: Medication;
}

export default function MedicationHero({ medication }: MedicationHeroProps) {
  return (
    <section className="py-12 md:py-14">
      <div className="max-w-336 mx-auto px-4 md:px-14">
        <div className="grid lg:grid-cols-2 gap-3 lg:gap-8 items-start">
          
          {/* Left: Image Card */}
          <div className="w-full max-w-lg hidden md:block">
            <div className="w-full h-50 md:h-137.5 rounded-3xl md:rounded-[4rem] bg-white p-10 flex items-center justify-center shadow-sm border border-white/20">
              <img
                src={medication.image}
                alt={medication.name}
                className="w-auto h-full rounded-[4rem] object-contain"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col pt-1">
            {/* Breadcrumbs - Positioned inside content column */}
            <nav className="flex items-center gap-2 mb-6 text-[13px] tracking-tight text-[#3D4F4A]/70">
              <Link href="/medications" className="hover:text-dark transition-colors">Medications</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-dark">{medication.name}</span>
            </nav>

            {/* Title with Serif font */}
            <h1 className="text-[42px] md:text-[54px] font-serif leading-[1.2] text-black mb-6 tracking-tight">
              {medication.title}
            </h1>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {medication.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 rounded-full border border-dark/20 text-[12px] font-sans text-dark/80 tracking-tight"
                >
                  {tag}
                </span>
              ))}
            </div>

             {/* img for mobile */}
            <div className="w-full max-w-lg mx-auto lg:mx-0 md:hidden block">
            <div className="w-full h-50 md:h-137.5 rounded-3xl md:rounded-[4rem] bg-white p-10 flex items-center justify-center shadow-sm border border-white/20">
              <img
                src={medication.image}
                alt={medication.name}
                className="w-auto h-full rounded-[4rem] object-contain"
              />
            </div>
          </div>

            {/* Divider Line */}
            <div className="h-px w-full bg-dark/10 mb-6" />

            {/* Description */}
            <p className="text-base text-[#3D4F4A]/90 mb-7 leading-[1.6] font-sans max-w-xl">
              {medication.description}
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-12">
              {medication.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-1 rounded-full border border-dark/20 bg-transparent flex items-center justify-center shrink-0">
                    {getIcon(benefit.icon)}
                  </div>
                  <p className="text-[15px] text-[#3D4F4A]/90 font-sans">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Using colors from established theme */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 bg-[#23312E] text-white hover:bg-dark/90 rounded-full text-sm px-8 h-14 transition-all font-sans font-medium"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}