// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   Scale, 
//   Dna, 
//   Moon, 
//   Droplet, 
//   Pill, 
//   Utensils, 
//   Leaf 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const causes = [
//   {
//     id: 1,
//     title: "Hormonal Imbalance",
//     description: "Disrupted hormones slow fat loss and increase storage.",
//     icon: Scale,
//   },
//   {
//     id: 2,
//     title: "Genetic Obesity",
//     description: "Genetics can raise your body’s weight-set point.",
//     icon: Dna,
//   },
//   {
//     id: 3,
//     title: "Psychological & Sleep Factors",
//     description: "Stress, eating disorders, and poor sleep drive weight gain.",
//     icon: Moon,
//   },
//   {
//     id: 4,
//     title: "Diabetes",
//     description: "Insulin resistance locks the body into fat storage.",
//     icon: Droplet,
//   },
//   {
//     id: 5,
//     title: "Recent Medications",
//     description: "Some medicines leaves lasting impact on weight and create inflammation.",
//     icon: Pill,
//   },
//   {
//     id: 6,
//     title: "Food Environment & Sedentary Lifestyle",
//     description: "Modern diets and low movement keep calories surplus.",
//     icon: Utensils,
//   },
//   {
//     id: 7,
//     title: "Poor Gut Health",
//     description: "Gut imbalance impairs metabolism and insulin response.",
//     icon: Leaf,
//   },
// ];

// export default function CausesSection() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   // --- NAVIGATION LOGIC ---
//   const nextSlide = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % causes.length);
//   }, []);

//   const prevSlide = useCallback(() => {
//     setActiveIndex((prev) => (prev - 1 + causes.length) % causes.length);
//   }, []);

//   const handleManualNav = (direction: 'next' | 'prev') => {
//     setIsPaused(true);
//     if (direction === 'next') nextSlide();
//     else prevSlide();
    
//     // Resume auto-play after interaction
//     setTimeout(() => setIsPaused(false), 8000);
//   };

//   // --- AUTO-PLAY ---
//   useEffect(() => {
//     if (isPaused) return;
//     timerRef.current = setInterval(nextSlide, 4000);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isPaused, nextSlide]);

//   return (
//     <section className="py-24 bg-accent/30 overflow-hidden">
//       <div className="max-w-5xl mx-auto px-6">
        
        // {/* Header */}
        // <div className="text-center mb-12 max-w-2xl mx-auto">
        //   <h2 className="heading">
        //     Excessive Weight Gaining Have <span className="italic opacity-70">Different Causes</span>
        //   </h2>
        // </div>

//         {/* --- INTERACTIVE CAROUSEL --- */}
//         <div className="relative pt-12">
          
//           {/* 1. ICON TRACK (The "Steady Center, Others Moving" Logic) */}
//           {/* We use a fixed height container where icons are absolute positioned */}
//           <div className="relative h-28 mb-[-3rem] z-20 w-full max-w-3xl mx-auto overflow-visible pointer-events-none">
//              {causes.map((cause, idx) => {
//                 // Calculate position relative to active index
//                 const length = causes.length;
                
//                 // This math ensures the indices wrap around correctly for the "infinite" feel
//                 let offset = (idx - activeIndex + length) % length;
//                 if (offset > length / 2) offset -= length;

//                 // Determine if this icon is the "Active Center", "Neighbor", or "Hidden"
//                 const isActive = offset === 0;
//                 const isNeighbor = Math.abs(offset) <= 2; // Show 2 neighbors on each side
                
//                 // Calculate visual styles based on offset
//                 // X Translation: 0 is center. Neighbors move 100px/120px left or right
//                 const translateX = offset * 120; 
//                 const scale = isActive ? 1 : 0.75;
//                 const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.4);
//                 const zIndex = isActive ? 20 : 10 - Math.abs(offset);

//                 if (!isNeighbor) return null; // Don't render distant icons for performance

//                 return (
//                   <button
//                     key={cause.id}
//                     onClick={() => {
//                       setIsPaused(true);
//                       setActiveIndex(idx);
//                     }}
//                     className="absolute top-0 left-1/2 pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
//                     style={{
//                       transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
//                       zIndex: zIndex,
//                       opacity: opacity,
//                     }}
//                   >
//                     <div 
//                       className={`
//                         flex items-center justify-center rounded-[1.8rem] transition-colors duration-500
//                         ${isActive 
//                           ? "w-24 h-24 md:w-28 md:h-28 bg-dark text-white shadow-xl border border-dark" 
//                           : "w-24 h-24 md:w-28 md:h-28 bg-white text-dark/30 border border-dark/5 hover:bg-[#F2F2F2]"}
//                       `}
//                     >
//                       <cause.icon 
//                         strokeWidth={isActive ? 1.5 : 1.2} 
//                         className={`transition-all duration-500 ${isActive ? "w-10 h-10" : "w-8 h-8"}`} 
//                       />
//                     </div>
//                   </button>
//                 );
//              })}
//           </div>

//           {/* 2. MAIN CONTENT CARD (With Gradient) */}
//           <div className="relative z-10">
//             <div className="bg-gradient-to-b from-background via-background/90 to-background/30 rounded-[3rem] p-8 pt-20 md:p-12 md:pt-16 border border-dark/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] text-center max-w-4xl mx-auto min-h-[340px] flex flex-col items-center justify-center">
              
//               {/* Content Transition Wrapper */}
//               <div className="max-w-xl mx-auto">
//                 <h3 
//                   key={`t-${activeIndex}`}
//                   className="font-serif text-3xl md:text-4xl text-dark mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
//                 >
//                   {causes[activeIndex].title}
//                 </h3>
                
//                 <p 
//                   key={`d-${activeIndex}`}
//                   className="inter text-dark/60 text-lg md:text-base font-light animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100"
//                 >
//                   {causes[activeIndex].description}
//                 </p>
//               </div>

//               {/* Navigation Arrows (Absolute to Card) */}
//               <div className="absolute top-1/2 -translate-y-1/2 left-4 md:-left-4">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-12 w-12 rounded-full border border-dark/5 bg-background cursor-pointer backdrop-blur-sm text-dark hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
//                   onClick={() => handleManualNav('prev')}
//                   aria-label="Previous cause"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </Button>
//               </div>

//               <div className="absolute top-1/2 -translate-y-1/2 right-4 md:-right-4">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-12 w-12 rounded-full border border-dark/5 bg-background cursor-pointer backdrop-blur-sm text-dark hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
//                   onClick={() => handleManualNav('next')}
//                   aria-label="Next cause"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </Button>
//               </div>

//             </div>
//           </div>

//           {/* 3. Bottom Progress Indicators */}
//           <div className="flex justify-center gap-2 mt-8">
//             {causes.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   setIsPaused(true);
//                   setActiveIndex(idx);
//                 }}
//                 className={`h-1 rounded-full transition-all duration-500 ${
//                   activeIndex === idx ? "w-10 bg-dark" : "w-2 bg-dark/10 hover:bg-dark/30"
//                 }`}
//                 aria-label={`Go to slide ${idx + 1}`}
//               />
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef, TouchEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Scale,
  Dna,
  Moon,
  Droplet,
  Pill,
  Utensils,
  Leaf,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const causes = [
  {
    id: 1,
    title: "Hormonal Imbalance",
    description: "Disrupted hormones slow fat loss and increase storage.",
    icon: Scale,
    image: "/causes/cause1.jpg",
  },
  {
    id: 2,
    title: "Genetic Obesity",
    description: "Genetics can raise your body's weight-set point.",
    icon: Dna,
    image: "/causes/cause2.jpg",
  },
  {
    id: 3,
    title: "Psychological & Sleep Factors",
    description: "Stress, eating disorders, and poor sleep drive weight gain.",
    icon: Moon,
    image: "/causes/cause3.jpg",
  },
  {
    id: 4,
    title: "Diabetes",
    description: "Insulin resistance locks the body into fat storage.",
    icon: Droplet,
    image: "/causes/cause4.jpg",
  },
  {
    id: 5,
    title: "Recent Medications",
    description:
      "Some medicines leave a lasting impact on weight and create inflammation.",
    icon: Pill,
    image: "/causes/cause5.jpg",
  },
  {
    id: 6,
    title: "Food Environment & Sedentary Lifestyle",
    description: "Modern diets and low movement keep calories in surplus.",
    icon: Utensils,
    image: "/causes/cause6.jpg",
  },
  {
    id: 7,
    title: "Poor Gut Health",
    description: "Gut imbalance impairs metabolism and insulin response.",
    icon: Leaf,
    image: "/causes/cause7.webp",
  },
];

function IconRenderer({ icon: IconComponent, ...props }: any) {
  return <IconComponent {...props} />;
}

export default function CausesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % causes.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + causes.length) % causes.length);
  }, []);

  const handleManualNav = (direction: "next" | "prev") => {
    setIsPaused(true);
    if (direction === "next") nextSlide();
    else prevSlide();
    setTimeout(() => setIsPaused(false), 8000);
  };

  // Swipe Logic (mobile)
  const minSwipeDistance = 50;
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleManualNav("next");
    if (isRightSwipe) handleManualNav("prev");
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const activeCause = causes[activeIndex];

  return (
    <section className="py-12 md:pt-18 md:pb-10 bg-accent2/20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="heading">
            Excessive Weight Gaining Have <span className="italic opacity-70">Different Causes</span>
          </h2>
        </div>

        {/* Carousel Area */}
        <div className="relative mb-12">
          
          <div
            className="flex flex-col md:flex-row rounded-[1.7rem] overflow-hidden bg-white border border-[#E3E3E3] transition-all duration-500  md:h-[380px]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            
            <div className="relative w-full md:w-[55%] h-60 md:h-auto bg-[#F7F1EB] shrink-0">
                <Image
                    key={activeCause.id}
                    src={activeCause.image}
                    alt={activeCause.title}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                
                {/* <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 z-10">
                    <IconRenderer
                        icon={activeCause.icon}
                        className="w-6 h-6 text-[#1F302B]"
                    />
                </div> */}

                <div className="absolute bottom-6 left-6 right-6 md:hidden text-white z-10">
                    <h3 className="font-serif text-2xl leading-tight">{activeCause.title}</h3>
                </div>
            </div>

            <div className="relative w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-between bg-white">
                
                <div className="mb-8">
                    <h3 className="hidden md:block font-serif text-3xl text-[#191919] mb-4 leading-tight">
                        {activeCause.title}
                    </h3>
                    
                    <div className="min-h-[80px]">
                        <p className="text-lg text-[#4A4A4A] leading-relaxed font-light">
                            {activeCause.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E3E3E3] pt-6 mt-auto">
                    
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full border border-[#E3E3E3] hover:text-dark cursor-pointer hover:bg-[#F7F1EB] text-[#191919] transition-colors"
                        onClick={() => handleManualNav("prev")}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex gap-2">
                        {causes.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setIsPaused(true);
                                    setActiveIndex(idx);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeIndex === idx
                                        ? "w-8 bg-[#1F302B]"
                                        : "w-2 bg-[#E3E3E3] hover:bg-[#1F302B]/40"
                                }`}
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full border border-[#E3E3E3] hover:text-dark cursor-pointer hover:bg-[#F7F1EB] text-[#191919] transition-colors"
                        onClick={() => handleManualNav("next")}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}