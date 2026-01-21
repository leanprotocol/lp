import { Medication } from '@/types/medication';
import Link from 'next/link';

interface MedicationHowItWorksProps {
  medication: Medication;
}

export default function MedicationHowItWorks({ medication }: MedicationHowItWorksProps) {
  const content = medication.howItWorksContent;
  
  return (
    <section id="how-it-works" className="py-10 md:pb-18 md:pt-4 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-14 text-">
        
        {/* Heading */}
        <h2 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight font-normal">
          What Happens in Your Body?
           {/* {medication.name} */}
          {/* <sup className="text-xl align-super">®</sup> work? */}
        </h2>
        
        {/* Content */}
        <div className=" space-y-8 font-sans text-lg text-foreground/80 font-light leading-[1.6]">
          
          {/* First Paragraph with Links */}
          <p className="">
            {content.introText}
          </p>

          {/* NEW: Process List */}
          {content.processList && (
            <div className="text-left mt-12">
              <ul className="space-y-2 pl-6">
                {content.processList.map((process, index) => (
                  <li key={index} className="list-disc text-foreground/80">
                    {process}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
