import { Quote } from "lucide-react"

export function DoctorTestimonial() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-10 items-center">
          
          {/* Left column - Heading with serif elegance */}
          <div>
            <h2 className="heading">
              Lean Protocol's program is designed by leading doctors in obesity medicine
            </h2>
          </div>

          {/* Right column - Testimonial card */}
          <div className="bg-[#B8CCC5] rounded-2xl p-8 md:p-12 relative shadow-sm">
            
            {/* Improved Quote Icon: Uses the Lucide component for a crisp, professional look */}
            <div className="mb-6">
              <Quote 
                className="w-12 h-12 text-white opacity-80" 
                strokeWidth={3}
                fill="currentColor" 
              />
            </div>

            <blockquote className="space-y-8">
              <p className="text-xl md:text-[30px] text-dark leading-[1.4] font-light font-sans">
                As Lean Protocol's Senior Medical Advisor, I help design the clinical protocols 
                that guide the medical care Lean Protocol's members receive care that is 
                guided by the latest advancements in obesity medicine.
              </p>

              {/* Author info: Right-aligned structure as seen in your reference */}
              <div className="flex items-center justify-end gap-4 border-t border-dark/10 pt-8">
                <div className="text-right">
                  <p className="text-lg font-bold text-dark leading-none mb-1">
                    Dr. Kumar
                  </p>
                  <p className="text-xs uppercase tracking-widest text-dark/70 font-semibold">
                    Senior Medical Advisor
                  </p>
                </div>
                
                {/* Avatar with a subtle border to match professional medical branding */}
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#F5F3ED]">
                  <img 
                    src="/dr-kumar-avatar.jpg" 
                    alt="Dr. Kumar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  )
}