import { Heart, Package, FileText, Users, UserCircle, Target, Smartphone } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Heart,
    title: 'Expert clinical care',
    description: 'Our program is created by leading experts trained in weight loss medicine.'
  },
  {
    icon: Package,
    title: 'Proven medications',
    description: 'We prescribe a range of trusted weight loss medications that includes GLP-1s and beyond.'
  },
  {
    icon: FileText,
    title: 'Personalized care plan',
    description: 'Our experts tailor your plan to your biology and evolving needs, including nutrition and movement guidance.'
  },
  {
    icon: UserCircle,
    title: 'Nutrition support',
    description: 'Chat with Aimee, your AI-powered nutrition concierge whenever you need.'
  },
  {
    icon: Users,
    title: 'Supportive community',
    description: 'Use our app to connect with (and cheer on) other Lean Protocol members on a similar journey.'
  },
  {
    icon: Target,
    title: 'Daily habit tracking',
    description: 'Keep track of your progress toward health through healthy habit logging in our app.'
  }
];

export default function ProgramFeatures() {
  return (
    <section className="py-20 md:py-32 bg-[#DFDDD6]">
      <div className="max-w-6xl mx-auto px-6 md:px-14">
        
        {/* Header */}
        <div className="max-w-3xl mb-20 md:text-center md:mx-auto">
          <h2 className="heading">
            Designed for <span className="italic opacity-70">lasting results</span>
          </h2>
          <p className="sub-heading text-dark/60">
            Here are all of the ways we help you get the most out of your weight care program, from clinical expertise to daily support.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start relative">
          
          {/* Left: Sticky Image */}
          <div className="hidden lg:block sticky top-26">
            <div className="relative w-full max-w-md mx-auto aspect-[3/4]">
              {/* The Oval Image */}
              <div className="relative w-full h-full rounded-t-[44%] rounded-b-[44%] overflow-hidden">
                <img
                  src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/664e52ff39053fbf714d0519_Frame%20368894.webp"
                  alt="Two happy women embracing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Feature Cards List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 md:p-8 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  {/* Icon with background */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#F2F7F5] flex items-center justify-center group-hover:bg-[#E8F0ED] transition-colors">
                      <feature.icon className="w-6 h-6 text-[#2C3E3A]" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-sans text-2xl text-dark mb-3 font-normal">
                      {feature.title}
                    </h3>
                    <p className="text-dark font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom CTA Card - Mobile App Highlight */}
            <div className="bg-dark rounded-2xl p-6 md:p-8 border border-[#E8E3F5] flex flex-col sm:flex-row items-center gap-6 mt-4">
              <div className="flex-shrink-0 p-3 bg-accent rounded-xl ">
                <Smartphone className="w-8 h-8 text-dark" strokeWidth={1.5} />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-serif text-lg text-white">
                  100% digital, on-demand care
                </p>
                <p className="text-sm text-accent mt-1">
                  Everything you need is right in your pocket.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}