import Image from "next/image"
import { MessageSquare, Smartphone, Users } from "lucide-react"

/**
 * Section highlighting the comprehensive program support
 * Shows how medication is part of a holistic approach
 */
export function ProgramSupportSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Nutrition",
      description: "Chat or share photos of your meals with Aimee, your AI-powered nutrition concierge, for feedback.",
    },
    {
      icon: Smartphone,
      title: "Custom in-app guidance",
      description: "Learn how to build the healthy habits you need for sustainable weight loss.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other members to support and motivate one another throughout your journey.",
    },
  ]

  return (
    <section >
      
        {/* Hero image with phone */}
        <div className="relative w-full h-50 md:h-150 mb-0">
          <Image src="/program-support-section.jpg" alt="Lean Protocol app showing progress tracking" fill className="object-cover" />
        </div>
         {/* <div className="w-full py-10 pb-28">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="heading">
           Medication is just one piece of the puzzel but we solve it differently
          </h2>
          <p className="sub-heading">
            For long-lasting change, our program helps you get the most out of medication with:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-[2rem] border border-dark/15 flex flex-col items-start text-left transition-colors duration-300"
            >
              
              <div className="w-12 h-12 mb-6 rounded-xl bg-[#d4e5c465] flex items-center justify-center text-dark">
                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>

              <h3 className="font-serif text-2xl text-dark mb-3">
                {feature.title}
              </h3>
              
              <p className="text-dark/70 leading-relaxed text-base font-light">
                {feature.description}
              </p>
              
            </div>
          ))}
        </div>
      </div>
      </div> */}
    </section>
  )
}
