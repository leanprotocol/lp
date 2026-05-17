"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const experts = [
  {
    id: 1,
    name: "Dr. Gautam Kumar",
    role: "MD, DM (Endocrinology)",
    image: "/lp-assets/experts/gautam.png",
  },
  {
    id: 2,
    name: "Dr. Akhil",
    role: "MD, Medicine",
    image: "/lp-assets/experts/akhil.png",
  },
  {
    id: 3,
    name: "Dr. Siddharth",
    role: "MD, Internal Medicine",
    image: "/lp-assets/experts/siddharth.png",
  },
  {
    id: 4,
    name: "Alisha Gupta",
    role: "GLP 1 Expert Dietitian",
    image: "/lp-assets/experts/alisha.png",
  },
  {
    id: 5,
    name: "Simran Kumawat",
    role: "GLP 1 Expert Dietitian",
    image: "/lp-assets/experts/simran.png",
  },
  {
    id: 6,
    name: "Richa Sharma",
    role: "Expert Nutritionist",
    image: "/lp-assets/experts/richa-sharma.png",
  },
  {
    id: 7,
    name: "Aparna Tandon",
    role: "Dietitian & Weight Loss Expert",
    image: "/lp-assets/experts/aparna.png",
  },
  {
    id: 8,
    name: "Richa Singh",
    role: "Yoga & Fat Loss Expert",
    image: "/lp-assets/experts/richa-singh.png",
  },
  {
    id: 9,
    name: "Alka Bharti",
    role: "Dietitian",
    image: "/lp-assets/experts/alka.jpg",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Riya S.",
    result: "Lost 10 kg in 3 months",
    quote: "For the first time after my marriage, I feel in control of my health. Lean Protocol not just gave me weight loss but also self confidence and a lifestyle to maintain.",
    image: "/lp-assets/image7.jpg"
  },
  {
    id: 2,
    name: "Vikram M.",
    result: "Lost 14 kg in 5 months",
    quote: "The doctor support and dietitian guidance made this journey effortless. I've never felt this energetic in my 40s.",
    image: "/member2.jpg"
  },
  {
    id: 3,
    name: "Priya K.",
    result: "Lost 8 kg in 2.5 months",
    quote: "GLP-1 finally broke through my weight loss plateau. The whole process from home blood test to medication delivery was seamless.",
    image: "/member3.jpg"
  }
];

export function SocialTrust() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const expertSliderRef = useRef<HTMLDivElement>(null);

  // Automatic Testimonial Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Automatic Expert Slider Effect
  useEffect(() => {
    const container = expertSliderRef.current;
    if (!container) return;

    let interval: number;

    const startAutoScroll = () => {
      interval = window.setInterval(() => {
        // If scrolled to the very end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const firstChild = container.children[0] as HTMLElement;
          if (firstChild) {
            // Get the computed gap, fallback to 24 (which is gap-6 in Tailwind)
            const gap = parseInt(window.getComputedStyle(container).gap) || 24;
            const scrollAmount = firstChild.offsetWidth + gap;
            container.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
        }
      }, 3000);
    };

    startAutoScroll();

    // Pause auto-scroll when user interacts
    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => startAutoScroll();

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleMouseEnter);
    container.addEventListener("touchend", handleMouseLeave);

    return () => {
      clearInterval(interval);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleMouseEnter);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* SECTION 11 – Transformation Stories */}
      <section className="bg-lp-bg py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-lp-dark">Real Stories, Real Results</h2>
            <p className="text-gray-500 text-lg">Verified transformations from our Lean Protocol members</p>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {[
              {
                type: "video",
                name: "Ayushi",
                result: "Transformation Journey",
                src: "/testimonials/ayushi.mp4",
              },
              {
                type: "image",
                name: "Kanti, 44",
                result: "Lost 8.5 Kgs in 3 months",
                src: "/testimonials/kanti.png",
              },
              {
                type: "video",
                name: "Manav",
                result: "Transformation Journey",
                src: "/testimonials/manav.mp4",
              },
              {
                type: "image",
                name: "Pratima, 37",
                result: "Lost 7 kg in 2.5 months",
                src: "/testimonials/pratima.png",
              },
              {
                type: "video",
                name: "Uday",
                result: "Transformation Journey",
                src: "/testimonials/uday.mp4",
              },
              {
                type: "image",
                name: "Rohit, 39",
                result: "Lost 9.1 kg in 15 weeks",
                src: "/testimonials/rohit.png",
              },
            ].map((story, i) => (
              <div key={i} className={`break-inside-avoid rounded-2xl overflow-hidden relative shadow-lg group cursor-default bg-black mb-6 w-full ${story.type === 'video' ? 'aspect-[9/16]' : 'aspect-square'}`}>
                {/* Media */}
                {story.type === "video" ? (
                  <video
                    src={story.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={story.src}
                    alt={story.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white z-10 pointer-events-none">
                  <div className="bg-lp-green/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold inline-block mb-2 sm:mb-3 uppercase tracking-wider">
                    ✓ Verified Result
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/20">
                    <div>
                      <p className="font-bold text-sm sm:text-base">{story.name}</p>
                      <p className="text-white/80 text-xs sm:text-sm">{story.result}</p>
                    </div>
                    <div className="bg-white/95 p-1.5 rounded-lg shadow-sm">
                      <Image
                        src="/logo-cropped.png"
                        alt="Lean Protocol"
                        width={50}
                        height={18}
                        className="object-contain sm:w-[60px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 – Meet the Experts */}
      <section className="bg-white py-24 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl text-lp-dark">
              People ask how we do it?<br/>We say it's only because of our expertise and partners.
            </h2>
          </div>
          
          <div 
            ref={expertSliderRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          >
            {experts.map((expert) => (
              <div 
                key={expert.id} 
                className="snap-start w-[85vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-[#F9F7F2] rounded-[2rem] overflow-hidden shadow-md border border-gray-100 text-left relative group transition-all hover:shadow-lg flex flex-col"
              >
                <div className="w-full aspect-[3/4] relative bg-gray-200 shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-6xl font-serif z-0 bg-gray-100">
                    {expert.name.charAt(0)}
                  </div>
                  <Image 
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                
                <div className="bg-white p-6 relative z-10 rounded-t-[2rem] -mt-6">
                  <h3 className="font-bold text-xl text-lp-dark mb-1 pr-8">{expert.name}</h3>
                  <p className="text-sm text-gray-500 pr-8">{expert.role}</p>
                  
                  {/* Decorative Arrow */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-lp-green group-hover:text-white transition-colors shadow-sm">
                    →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13 – Brand Trust Logos */}
      <section className="bg-gray-50 py-16 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h3 className="font-semibold text-gray-500 uppercase tracking-widest text-sm">Brands Trust Us</h3>
          
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {/* Redcliffe Labs Logo */}
            <div className="relative w-40 h-16">
              <Image 
                src="/lp-assets/logo-redcliffe.png" 
                alt="Redcliffe Labs" 
                fill 
                className="object-contain" 
              />
            </div>
            
            {/* MrMed Logo Placeholder */}
            <div className="flex items-center font-bold text-3xl tracking-tight text-[#0066CC]">
              <span className="text-[#4CAF50]">Mr</span>Med
            </div>
            
            {/* Cult Logo */}
            <div className="relative w-32 h-16">
              <Image 
                src="/lp-assets/logo-cult.png" 
                alt="Cult" 
                fill 
                className="object-contain brightness-0" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14 – Automatic Testimonial Slider */}
      <section className="bg-lp-green text-white py-24 px-4 overflow-hidden relative">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-5xl mx-auto">
          <div className="relative min-h-[300px] md:min-h-[200px]">
            {testimonials.map((test, idx) => (
              <div 
                key={test.id}
                className={`absolute inset-0 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 transition-all duration-700 ease-in-out ${
                  idx === activeTestimonial 
                    ? "opacity-100 translate-x-0 pointer-events-auto" 
                    : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20 relative bg-black/20">
                  <Image 
                    src={test.image} 
                    alt={test.name}
                    fill
                    className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="text-center md:text-left space-y-4 pt-4">
                  <p className="font-serif text-2xl md:text-3xl leading-relaxed italic">
                    "{test.quote}"
                  </p>
                  <div>
                    <p className="font-bold text-lg">{test.name}</p>
                    <p className="text-lp-light-green">{test.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-12 relative z-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activeTestimonial ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
