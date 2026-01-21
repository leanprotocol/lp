"use client";

import { LinkedinIcon } from "@sanity/icons";
import { Quote } from "lucide-react";
import Link from "next/link";
import { BiSolidQuoteAltRight } from "react-icons/bi";

export default function FounderMessage() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-accent2/80 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-12">
          
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-28 h-28 md:w-40 md:h-40 overflow-hidden rounded-full bg-white/5">
              <img 
                src="/founder.webp" 
                alt="Founder" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col text-center md:text-left">
            
            <BiSolidQuoteAltRight  className="w-8 h-8 text-dark/50 mb-5 mx-auto md:mx-0 opacity-80" />

            <h3 className="font-serif text-xl md:text-2xl  leading-relaxed text-black mb-8">
              "You might be trying the same advice again and again, and it still didn't work. 
               Lean Protocol was built to be the fresh push you truly needed."
            </h3>

            <div className="mt-auto mx-auto md:mx-0">
              <Link href="https://www.linkedin.com/in/abhinav-dobrial/" target="_blank" rel="noopener noreferrer">
                <p className="text-base font-semibold flex gap-2 items-center uppercase text-black tracking-wide hover:text-black/80 transition-colors cursor-pointer">
                <LinkedinIcon className="w-6 h-6 bg-white/50 rounded-2xl p-1" />  Abhinav Dobrial
                </p>
              </Link>
              <p className="text-xs text-black/80 mt-1 uppercase tracking-wider font-medium -ml-3 md:ml-8">Founder & CEO</p>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
}
