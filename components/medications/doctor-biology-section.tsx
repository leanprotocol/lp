import { Check } from "lucide-react"
import Image from "next/image"

export function DoctorBiologySection() {
  const biologicalFactors = [
    "Hormonal or chemical imbalances",
    "Genetic predisposition",
    "Slow metabolic rate",
  ]

  return (
    <section className="relative w-full bg-background py-20 lg:py-32 overflow-hidden">
      {/* Decorative blue circle top right (clipped) */}
      <div className="absolute -top-[29%] right-[25%]  translate-x-1/3 w-64 h-64 lg:w-96 lg:h-96 bg-accent rounded-full pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl lg:text-[2.8rem] leading-[1.15] text-[#191919] mb-7">
              Doctor-designed and <br />
              tailored to your biology
            </h2>
            
            <p className="text-black text-base leading-relaxed mb-7">
              Through in-depth assessments and 1:1 consultations, Lean Protocol&apos;s expert 
              clinicians will identify biological markers that influence your weight, 
              including:
            </p>

            <ul className="space-y-4 mb-10">
              {biologicalFactors.map((factor, index) => (
                <li key={index} className="flex items-center gap-4">
                  {/* Periwinkle circle with dark check */}
                  <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-accent">
                    <Check className="w-3.5 h-3.5 text-[#191919] stroke-3" />
                  </div>
                  <span className="text-black text-base">{factor}</span>
                </li>
              ))}
            </ul>

            <p className="text-black text-lg leading-relaxed">
              Together, we&apos;ll find the most effective medication plan for your unique 
              biological needs.
            </p>
          </div>

          {/* Right Content: Image Stack */}
          <div className="flex flex-col items-center">
            {/* Large rounded image */}
            <div className="relative w-full max-w-[400px] aspect-4/5 mb-6 shadow-sm">
              <Image 
                src="/dr-kumar.jpg" 
                alt="Dr. Rekha Kumar" 
                fill 
                className="object-cover rounded-[2.5rem]" 
              />
            </div>

            {/* Doctor Info Centered Below */}
            <div className="text-center">
              <h3 className="text-2xl text-[#191919] mb-1 font-normal tracking-tight">
                Dr. Rekha Kumar
              </h3>
              <p className="text-black text-sm mb-6">
                Senior Medical Advisor - Lean Protocol
              </p>
              
              <p className="text-[10px] text-black/60 max-w-xs mx-auto leading-tight">
                *Dr. Kumar does not interact directly with Lean Protocol patients.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}