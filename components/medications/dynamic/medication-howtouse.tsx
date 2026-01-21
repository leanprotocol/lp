// 'use client';

// import { Medication } from '@/types/medication';
// import { useState } from 'react';
// import { Plus, Minus } from 'lucide-react';

// interface MedicationHowToUseProps {
//   medication: Medication;
// }

// export default function MedicationHowToUse({ medication }: MedicationHowToUseProps) {
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleAccordion = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section id="how-to-use" className="py-16 md:py-16 bg-background scroll-mt-32">
//       <div className="max-w-4xl mx-auto px-4 md:px-14">
        
//         {/* Heading */}
//         <h2 className="font-serif text-4xl md:text-5xl text-black mb-6 leading-tight font-normal text-center">
//          Prescribed Usage
//         </h2>
        
//         {/* Intro Text */}
//         <p className="font-sans text-lg text-foreground/80 font-light leading-relaxed text-center mb-12">
//           {medication.howToUseContent.introText}
//         </p>

//         {/* Accordion */}
//         <div className="space-y-0">
//           {medication.howToUseContent.accordionItems.map((item, index) => (
//             <div key={index} className="border-b border-[#3D4F4A]/10">
//               <button
//                 onClick={() => toggleAccordion(index)}
//                 className="w-full flex items-center justify-between py-6 text-left hover:opacity-70 transition-opacity"
//               >
//                 <span className="font-sans text-xl text-black font-normal">
//                   {item.title}
//                 </span>
//                 {openIndex === index ? (
//                   <Minus className="w-6 h-6 text-black flex-shrink-0" />
//                 ) : (
//                   <Plus className="w-6 h-6 text-black flex-shrink-0" />
//                 )}
//               </button>
              
//               {openIndex === index && (
//                 <div className="pb-6 pr-12">
//                   <p className="font-sans text-lg text-foreground/80 font-light leading-relaxed">
//                     {item.content}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import { Medication } from '@/types/medication';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface MedicationHowToUseProps {
  medication: Medication;
}

export default function MedicationHowToUse({ medication }: MedicationHowToUseProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Helper to render an individual accordion item
  const renderItem = (item: any, index: number) => (
    <div key={index} className="border-b border-[#3D4F4A]/10 h-fit">
      <button
        onClick={() => toggleAccordion(index)}
        className="w-full flex items-center cursor-pointer justify-between py-4 text-left hover:opacity-70 transition-opacity"
      >
        <span className="font-sans text-lg text-black font-normal pr-4">
          {item.title}
        </span>
        {openIndex === index ? (
          <Minus className="w-4 h-4 text-black shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-black shrink-0" />
        )}
      </button>
      
      {openIndex === index && (
        <div className="pb-6 pr-4">
          <p className="font-sans text-lg text-foreground/80 font-light leading-relaxed">
            {item.content}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <section id="how-to-use" className="py-10 md:pb-18 md:pt-4 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        {/* Heading */}
        <h2 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight font-normal">
          Prescribed Usage
        </h2>
        
        {/* Intro Text */}
        <p className="font-sans text-lg text-foreground/80 font-light leading-relaxed text-left mb-12">
          {medication.howToUseContent.introText}
        </p>

        {/* Accordion - Split into two independent columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-start">
          
          <div className="space-y-0">
            {medication.howToUseContent.accordionItems.map((item, index) => 
              index % 2 === 0 ? renderItem(item, index) : null
            )}
          </div>

          <div className="space-y-0">
            {medication.howToUseContent.accordionItems.map((item, index) => 
              index % 2 !== 0 ? renderItem(item, index) : null
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}