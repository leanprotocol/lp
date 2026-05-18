import Image from "next/image";

const secondaryMetrics = [
  {
    id: "success-stories",
    title: "10,000+ Success Stories",
    subtitle: "Join a thriving community of people who have reclaimed their health",
    image: "/lp-assets/metric_success_stories.png"
  },
  {
    id: "waist-reduction",
    title: '4" Avg Waist Reduction',
    subtitle: "Target stubborn visceral fat safely and effectively",
    image: "/lp-assets/metric_waist_reduction.png"
  },
  {
    id: "sustain-weight",
    title: "88% Sustain Lost Weight",
    subtitle: "Build lifelong habits that keep the weight off for good",
    image: "/lp-assets/metric_sustain_weight.png"
  },
  {
    id: "muscle-retention",
    title: "90% Muscle Retention",
    subtitle: "Lose fat while keeping the muscle that powers your metabolism",
    image: "/lp-assets/metric_muscle_retention.png"
  }
];

const steps = [
  { 
    v: "/journey/step-1-vertical.jpeg", 
    h: "/journey/step-1-horizontal.jpeg", 
    title: "At home, advanced Blood Test", 
    description: "A comprehensive home blood test to deeply analyze your metabolic profile and biomarkers.",
  },
  { 
    v: "/journey/step-2-vertical.jpeg", 
    h: "/journey/step-2-horizontal.jpeg", 
    title: "Consultation with the doctor", 
    description: "Our specialist reviews your reports to check eligibility and prescribe the exact medical protocol.",
  },
  { 
    v: "/journey/step-3-vertical.jpeg", 
    h: "/journey/step-3-horizontal.jpeg", 
    title: "The dietitian gives a GLP-1-based diet", 
    description: "A customized nutritional plan tailored specifically to complement your GLP-1 protocol.",
  },
  { 
    v: "/journey/step-4-vertical.jpeg", 
    h: "/journey/step-4-horizontal.jpeg", 
    title: "Medications delivered at your doorstep", 
    description: "Your prescribed protocol medication is fulfilled and delivered securely to your home.",
  },
  { 
    v: "/journey/step-5-vertical.jpeg", 
    h: "/journey/step-5-horizontal.jpeg", 
    title: "6 months Cult pass home subscription", 
    description: "Get access to Cult home workouts to build lean muscle and keep your body active.",
  },
  { 
    v: "/journey/step-6-vertical.jpeg", 
    h: "/journey/step-6-horizontal.jpeg", 
    title: "15–22% weight loss in 6 months", 
    description: "Achieve lasting, transformational results with our guaranteed weight loss program.",
  },
];

const guaranteeFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-2.846 2.846a1.125 1.125 0 0 1-.795.329H7.84a1.125 1.125 0 0 1-.795-.329L4.2 14.5m15.6 0-.177.529A2.25 2.25 0 0 1 17.48 17H6.52a2.25 2.25 0 0 1-2.143-1.571L4.2 14.5" />
      </svg>
    ),
    label: "Scientifically\nProven Protocol",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    label: "Expert Dietitian\nGuidance",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    label: "Trackable Results\n& Support",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    label: "Results You\nCan Trust",
  },
];

export function ProcessGuarantee() {
  return (
    <>
      {/* SECTION 7 – Guarantee Section */}
      <section className="bg-[#E8F3EC] py-16 md:py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-center md:text-left z-10">
              {/* Logo */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
                <Image src="/logo-cropped.png" alt="Lean Protocol" width={140} height={40} className="object-contain" />
              </div>

              {/* Main Heading */}
              <h2 className="font-serif text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] text-lp-dark leading-[1.1] font-bold tracking-tight">
                India&apos;s only<br /> program guaranteeing
              </h2>

              {/* Promise 1: Weight Loss */}
              <div className="mt-8">
                <p className="text-lp-dark/70 text-lg md:text-xl font-medium">a minimum of</p>
                <div className="flex items-end justify-center md:justify-start gap-2 mt-1">
                  <span className="text-lp-green font-bold text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] leading-none tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                    10%
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                  <p className="text-lp-dark text-xl md:text-2xl font-bold">
                    weight loss in 6 months.
                  </p>
                  <div className="w-7 h-7 rounded-full bg-lp-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Promise 2: Refund */}
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                <p className="text-lp-dark text-xl md:text-2xl">
                  or a <span className="font-bold">full refund.</span>
                </p>
                <div className="w-7 h-7 rounded-full bg-lp-green flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-lp-green font-semibold text-base md:text-lg mt-8 italic">
                Because we have zero doubts about our protocol.
              </p>

              {/* Feature Icons Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-8 mt-10">
                {guaranteeFeatures.map((feat, i) => (
                  <div key={i} className={`flex flex-col items-center gap-3 w-[80px] ${i === 3 ? 'hidden md:flex' : ''}`}>
                    <div className="w-14 h-14 rounded-full bg-white/60 border border-lp-green/20 shadow-sm flex items-center justify-center text-lp-green">
                      {feat.icon}
                    </div>
                    <p className="text-[11px] md:text-xs text-lp-dark font-semibold text-center leading-tight whitespace-pre-line">
                      {feat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Woman Image */}
            <div className="w-full md:w-[45%] lg:w-[50%] relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-[500px] aspect-square md:aspect-[4/5]">
                <Image
                  src="/lp-assets/riya-new.png"
                  alt="Confident woman representing Lean Protocol results"
                  fill
                  className="object-contain object-bottom mix-blend-darken"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8 – How We Do It (Step-by-Step) */}
      <section className="bg-white py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl md:text-6xl text-lp-dark mb-6">How we do it</h2>
            <div className="flex flex-wrap justify-center items-center gap-3 text-lp-green font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              <span className="bg-lp-green/10 px-4 py-1.5 rounded-full">Scientific</span>
              <span className="hidden md:inline text-gray-300">•</span>
              <span className="bg-lp-green/10 px-4 py-1.5 rounded-full">Step-by-Step</span>
              <span className="hidden md:inline text-gray-300">•</span>
              <span className="bg-lp-green/10 px-4 py-1.5 rounded-full">Proven Path</span>
            </div>
          </div>

          <div className="relative space-y-16 md:space-y-32">
            {/* Vertical Connector Line */}
            <div className="absolute left-[42px] md:left-1/2 top-4 bottom-4 w-1 md:-translate-x-1/2 bg-gradient-to-b from-transparent via-lp-green/30 to-transparent rounded-full" />

            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 w-full group ${isEven ? '' : 'md:flex-row-reverse'}`}>

                  {/* Image Side */}
                  <div className="w-full md:w-[42%] pl-24 md:pl-0 pt-2 md:pt-0">
                    <div className="relative aspect-auto md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group-hover:shadow-2xl group-hover:shadow-lp-green/20 transition-all duration-500">
                      {/* Mobile Vertical Image */}
                      <img 
                        src={step.v} 
                        alt={step.title} 
                        className="md:hidden w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      {/* Desktop Horizontal Image */}
                      <img 
                        src={step.h} 
                        alt={step.title} 
                        className="hidden md:block w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-lp-green/0 group-hover:bg-lp-green/5 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className={`w-full md:w-[42%] pl-24 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="space-y-4">
                      <h3 className="font-serif text-2xl md:text-4xl text-lp-dark leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8.5 – Secondary Metrics Grid (Image Cards) */}
      <section className="bg-lp-bg py-24 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-5xl text-lp-dark mb-4">Real results, sustained for life</h2>
            <p className="text-gray-500 text-lg">More than just weight loss—a total body transformation.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {secondaryMetrics.map(card => (
              <div key={card.id} className="relative aspect-square md:aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-md border border-gray-100">
                <Image 
                  src={card.image} 
                  alt={card.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
