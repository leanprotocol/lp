// "use client";

// import { 
//   ClipboardCheck,   
//   HeartHandshake,  
//   Microscope,       
//   Scale,            
//   Dna,             
//   Infinity,     
//   ArrowRight
// } from "lucide-react";
// import { Button } from "../ui/button";
// import Link from "next/link";

// const pillars = [
//   {
//     icon: ClipboardCheck,
//     title: "Protocol",
//     subtitle: "Our Protocol ensures the most effective weight loss results compared to any market competitor or sole practitioner."
//   },
//   {
//     icon: HeartHandshake,
//     title: "Prioritisation",
//     subtitle: "Your well-being outranks our revenue goals. We prioritise ethical care, and zero-compromise on safety standards."
//   },
//   {
//     icon: Scale,
//     title: "Plain Truth",
//     subtitle: "Complete clarity on treatment, pricing, and expectations, so you always know exactly what you’re signing up for. No hidden charges. No surprises."
//   },
//   {
//     icon: Dna,
//     title: "Lead Cause",
//     subtitle: "We take time to understand your metabolism, lifestyle, health history, genetics, and hormones to find the foundational cause of your weight gain. Because when you treat the cause, the results follow."
//   },
//   {
//     icon: Microscope,
//     title: "Legit Science",
//     subtitle: "We don’t believe in anecdotes and nuska's. Only the best, science-backed medical options make it to our platform."
//   },
//   {
//     icon: Infinity,
//     title: "Lean Legacy",
//     subtitle: "We help you build habits and systems along the treatment, so your results stay with you long after the program ends."
//   }
// ];

// export default function SixPillars() {
//   return (
//     <section className="w-full py-12 md:pb-18 md:pt-10 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
        // <h2 className="font-serif heading text-center">
        //  The 3P 3L Framework of Lean Protocol
        // </h2>
        // <p className="sub-heading text-center">
        //   Because when the right set of experts talk to each other, the right results follow. 
        //   And at the heart of Lean Protocol are 6 foundational pillars every Lean Expert lives by:
        // </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
//           {pillars.map((pillar, index) => (
//             <div 
//               key={index} 
//               className="group h-full bg-white border border-gray-100 rounded-3xl p-6  transition-all duration-300 flex flex-col items-start"
//             >
//               <div className="w-14 h-14 bg-dark rounded-2xl flex items-center justify-center mb-4  transition-transform duration-300">
//                 <pillar.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
//               </div>
              
//               <div className="flex flex-col text-left">
//                 <h3 className="font-serif text-[20px] text-[#191919] font-bold mb-2">
//                   {pillar.title}
//                 </h3>
//                 <p className="text-[15px] text-[#57534E] leading-relaxed font-light">
//                   {pillar.subtitle}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

        // <div className="w-full mx-auto mt-12 flex justify-center items-center">
        //   <div className="inline-flex items-center bg-dark rounded-full p-1.5 pr-2 gap-4 backdrop-blur-md transition-colors">
        //     <span className="pl-4 font-serif text-white font-medium text-lg text-/90">Get started with just <span className="text-accent2 font-serif font-semibold">Rs 2299</span></span>
        //     <Button 
        //       asChild
        //       className="h-12 px-7 w-40 bg-accent2 text-dark hover:bg-accent2/90 rounded-full text-base transition-all"
        //     >
        //       <Link href="/get-started" className="flex items-center gap-2">
        //         Book Today
        //         <ArrowRight className="w-4 h-4" />
        //       </Link>
        //     </Button>
        //   </div>
        // </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { 
  ClipboardCheck,   
  HeartHandshake,  
  Microscope,       
  Scale,            
  Dna,             
  Infinity,     
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const pillars = [
  {
    icon: ClipboardCheck,
    title: "Protocol",
    subtitle: "Our Protocol ensures the most effective weight loss results compared to any market competitor or sole practitioner."
  },
  {
    icon: HeartHandshake,
    title: "Prioritisation",
    subtitle: "Your well-being outranks our revenue goals. We prioritise ethical care, and zero-compromise on safety standards."
  },
  {
    icon: Scale,
    title: "Plain Truth",
    subtitle: "Complete clarity on treatment, pricing, and expectations, so you always know exactly what you’re signing up for. No hidden charges. No surprises."
  },
  {
    icon: Dna,
    title: "Lead Cause",
    subtitle: "We take time to understand your metabolism, lifestyle, health history, genetics, and hormones to find the foundational cause of your weight gain."
  },
  {
    icon: Microscope,
    title: "Legit Science",
    subtitle: "We don’t believe in anecdotes and nuska's. Only the best, science-backed medical options make it to our platform."
  },
  {
    icon: Infinity,
    title: "Lean Legacy",
    subtitle: "We help you build habits and systems along the treatment, so your results stay with you long after the program ends."
  }
];

export default function SixPillars() {
  return (
    <section className="w-full md:pb-20 px-4 md:px-8 ">
      <div className="max-w-[84rem] mx-auto">
        
        <div className="text-center mb-12">
        <h2 className="font-serif heading text-center">
         The 3P 3L Framework of Lean Protocol
        </h2>
        <p className="sub-heading text-center">
          Because when the right set of experts talk to each other, the right results follow. 
          And at the heart of Lean Protocol are 6 foundational pillars every Lean Expert lives by:
        </p>
        </div>
        
        <div className=" overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
            {pillars.map((pillar, index) => (
              <div 
                key={index} 
                className="bg-white p-8 md:p-10 rounded-xl flex flex-col h-full  transition-colors duration-200"
              >
                
                <div className="flex justify-between items-start mb-6">
                   <div className="w-10 h-10 rounded-full bg-[#F6F1EE] flex items-center justify-center text-[#1F302B]">
                      <pillar.icon className="w-5 h-5" strokeWidth={1.5} />
                   </div>
                   <span className="font-mono text-sm font-bold text-[#1F302B]/30 tracking-widest">
                      0{index + 1}
                   </span>
                </div>

                <div className="mt-auto">
                    <h3 className="font-serif text-xl text-[#1F302B] mb-3 font-semibold">
                        {pillar.title}
                    </h3>
                    <p className="text-[#57534E] text-sm leading-relaxed font-light">
                        {pillar.subtitle}
                    </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* --- CTA --- */}
        <div className="w-full mx-auto my-12 md:mt-30 md:mb-20  flex justify-center items-center">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                <span className="font-serif text-[#1F302B] text-xl md:text-2xl font-semibold">
                    Start your journey for just <span className="line-through opacity-80 pr-1">Rs 5799 </span> <span className="font-bold border-b border-[#5B746F]">Rs 2299</span>
                </span>
                <Button 
                asChild
                className="h-12 md:h-14 px-9 md:px-12 w-auto bg-[#1F302B] text-white hover:bg-[#2C3E3A] rounded-full text-base font-semibold transition-colors shadow-lg shadow-[#1F302B]/15"
                >
                <Link href="/get-started" className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
                </Link>
                </Button>
            </div>
        </div>

      </div>
    </section>
  );
}