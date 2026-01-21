import { ClipboardCheck, Users, Pill, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Take our assessment',
    description: 'Provide information about your goals and medical history to help your wellness, health care team personalize your weight loss plan.'
  },
  {
    icon: Users,
    title: 'Consult with a provider',
    description: 'Meet with a provider to discuss your medications and agree on a personalized treatment.'
  },
  {
    icon: Pill,
    title: 'Kick off treatment',
    description: 'Start your medication and get 1:1 lifestyle guidance in our app with access to a wide range of resources.'
  },
  {
    icon: Activity,
    title: 'Take action',
    description: 'Log your habits (medication, meals, nutrients, stats on challenges, and hear tips from our expert members.'
  }
];

const metabolicPoints = [
  'Navigate the biological factors that influence your weight',
  'Get highly personalized guidance on medication, nutrition, and movement',
  'Work with your care team to evolve your plan for lasting success'
];

export default function ProgramHowItWorks() {
  return (
    <section className="relative py-20 md:py-32 bg-[#1F3833] overflow-hidden">
      
      {/* Background Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[4%] z-0"
        style={{
          backgroundImage: 'url(/white-pattern.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-14  text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-2 leading-tight font-normal">
            How it works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-14  grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-sans text-lg text-white font-medium mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-sm text-white/70 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* MetabolicPrint Section */}
        <div className="relative px-4 md:px-14 ">
          <div className="bg-linear-to-r from-[#dff4eb] to-white/90 rounded-[30rem] overflow-hidden p-10 py-14">
           <h3 className="heading max-w-4xl mx-auto text-center mt-3">
                  MetabolicPrint: Unlock weight loss with your unique metabolic health profile
                </h3>
                
                <p className="text-base text-dark/80 font-normal max-w-3xl mx-auto text-center mt-6">
                  Every person's path toward health is different. Unlike the same old weight loss solutions that don't work, MetabolicPrint™ gets your weight down to a science.
                </p>
            <div className="grid lg:grid-cols-2 max-w-4xl mx-auto gap-4 items-center mt-10">
              
              {/* Left: Content */}
              <div className="py-12 lg:py-0 px-3 lg:px-2">

                {/* Points */}
                <div className="space-y-10 mb-12">
                  {metabolicPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">{index + 1}</span>
                        </div>
                      </div>
                      <p className="font-sans text-[19px] text-black font-medium ml-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/get-started">
                  <button className="bg-dark cursor-pointer text-white rounded-full py-4 px-8 font-sans text-sm font-normal hover:bg-dark/90 transition-colors flex items-center gap-2">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Right: Image */}
              <div className="relative h-full min-h-[500px] lg:h-[380px] flex items-center justify-center p-8 lg:p-0">
                <img
                  src="/program-mockup.webp"
                  alt="MetabolicPrint program interface"
                  className="w-full h-full object-contain"
                />
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
