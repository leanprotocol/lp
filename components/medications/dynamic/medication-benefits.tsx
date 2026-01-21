import { Medication } from '@/types/medication';
import Link from 'next/link';

interface MedicationBenefitsProps {
  medication: Medication;
}

export default function MedicationBenefits({ medication }: MedicationBenefitsProps) {
  return (
    <section id="benefits" className="py-10 md:pb-18 md:pt-2 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start justify-between">
          
          {/* Left: Content */}
          <div className="pt-0 ">
            <h2 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight font-normal">
              Why It Helps 
              {/* {medication.name} */}
              {/* <sup className="text-xl align-super">®</sup> */}
            </h2>
            
            <div className="space-y-6 font-sans text-lg text-foreground/80 font-light leading-relaxed">
              <p className="">{medication.benefitsContent.subtitle}</p>
              
              <p>{medication.benefitsContent.mainText}</p>

              <p>{medication.benefitsContent.additionalText}</p>
              
              {/* NEW: Benefits List */}
              {medication.benefitsContent.benefitsList && (
                <ul className="mt-6 space-y-2 pl-6">
                  {medication.benefitsContent.benefitsList.map((benefit, index) => (
                    <li key={index} className="list-disc text-foreground/80">
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Image */}
          {/* <div className="lg:sticky lg:top-32 order-first lg:order-last flex items-end justify-end">
            <div className="relative w-[400px] h-[300px] rounded-[2.5rem] overflow-hidden bg-[#C4A484]">
              <img
                src={medication.benefitsImage}
                alt={`${medication.name} injection pen`}
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
