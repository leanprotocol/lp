import { Medication } from '@/types/medication';
import Link from 'next/link';

interface MedicationBasicsProps {
  medication: Medication;
}

export default function MedicationBasics({ medication }: MedicationBasicsProps) {
  return (
    <section id="basics" className="py-10 md:py-18 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        <div className="grid  gap-5 lg:gap-10 items-start">
          
          {/* Left: Image */}
          {/* <div className="lg:sticky lg:top-32">
          
            <div className="relative w-[500px] h-[400px] bg-white border border-zinc-200 rounded-[2.5rem] p-8 overflow-hidden bg-muted">
              <img
                src={medication.image}
                alt={`${medication.name} medication`}
                className="w-auto mx-auto h-full object-cover"
              />
            </div>
          </div> */}

          {/* Right: Content */}
          <div className="">
            <h2 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight font-normal">
              What is {medication.name}?
              {/* <sup className="text-xl align-super">®</sup>? */}
            </h2>
            
            <div className="space-y-6 font-sans text-lg text-foreground/80 font-light leading-relaxed">
              <p>{medication.basics.whatIs}</p>
              
              {/* NEW: Features List */}
              {medication.basics.features && (
                <ul className="mt-8 space-y-2 pl-6">
                  {medication.basics.features.map((feature, index) => (
                    <li key={index} className="list-disc text-foreground/80">
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
