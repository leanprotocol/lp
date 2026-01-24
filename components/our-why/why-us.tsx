"use client";

import { Activity, Stethoscope, Utensils, Watch, ChevronDown, CheckCircle2, ArrowDown } from "lucide-react";
import Image from "next/image";
import SixPillars from "./six-pillars";

export default function WhyUs() {
  return (
    <section className="overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        
        <div className="flex flex-col mb-5 mt-16">
           
           <h2 className=" max-w-3xl text-[1.5rem] md:text-[2rem] text-[#1F302B] leading-[1.3] ">
             Most people don’t
             want six-pack abs. <br />
            <span className="text-[1.5rem] md:text-[2.1rem]">
               They just want to wake up feeling lighter, clearer, healthier. To move without effort. To breathe without struggle.
            
              </span> 
           </h2>
            <p className=" text-[1.5rem] md:text-[1.8rem] text-[#1F302B] relative z-10 leading-[1.4] ">
                   To feel… well again.
             </p>

        </div>

            <div className="flex flex-col mb-16">
           
           <h2 className=" max-w-xl text-[1.5rem] md:text-[2rem] font-medium text-[#1F302B] leading-[1.3] ">
            But when we looked around, we saw the problem!
           </h2>
 <p className="max-w-3xl text-[1.5rem] md:text-[1.7rem] text-[#1F302B] relative z-10 leading-[1.4] ">
           Everyone had a piece of the puzzle.
No one was putting it together for you.
</p>

 <p className="max-w-3xl text-[1.5rem] md:text-[1.7rem] text-[#1F302B] relative z-10 leading-[1.4] mt-6 md:mt-8">
           Your doctor has your medication. <br />
Your trainer has your workout plan. <br />
Your nutritionist has your diet plan. <br />
Your smartwatch has your body metrics. 
</p>

 <p className="max-w-2xl text-[1.5rem] md:text-[1.7rem] text-[#1F302B] relative z-10 leading-[1.4] mt-6 md:mt-8">
           Everyone’s talking. <br />
No one’s listening. <br />
And you’re the only one trying to make it all sense.
</p>

 <p className=" text-[1.5rem] md:text-[1.6rem] text-[#1F302B] relative z-10 leading-[1.3] mt-6 md:mt-8">
                   So we built Lean Protocol.

             </p>

        </div>

      </div>

        <div className="relative">


          <div className="bg-dark p-8 md:p-16 text-center text-white relative overflow-hidden">
          

            <div className="relative z-10">
              <h2 className="font-serif heading-white">
                <span className="text-white ">Lean Protocol</span>
              </h2>
               <p className="sub-heading text-white/80  mt-1">
             A medical-first, expert-connected platform where your doctor, nutritionist, trainer, and psychologist finally work as one. 
A place where treatment isn’t random. 
Where your plan isn’t generic. 
Where your health and your story truly matter.

              </p>

               <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] sm:mt-15 rounded-4xl relative overflow-hidden">
      <Image
        src="/lean-protocol-our-why1.jpg"
        alt="Full width hero image"
        fill
        sizes="100vw"
        priority
        className="object-cover object-center rounded-4xl"
      />
    </div>

<div className="max-w-6xl mx-auto">
               
</div>
            </div>
          </div>
        </div>
    </section>
  );
}