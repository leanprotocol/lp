'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface AlternativeMedication {
  name: string;
  slug: string;
  genericName: string;
  image: string;
}

const alternativeMedications: AlternativeMedication[] = [
  {
    name: 'Wegovy',
    slug: 'wegovy',
    genericName: 'semaglutide',
    image: 'https://cdn.prod.website-files.com/660dbd9edac735ff882da2d3/665e442f8c6feca7cd954a7d_Rybelsus.png'
  },
  {
    name: 'Rybelsus',
    slug: 'rybelsus',
    genericName: 'semaglutide',
    image: 'https://cdn.prod.website-files.com/660dbd9edac735ff882da2d3/665e42ef2a62205df93741d7_Victoza%20copy%201.png'
  },
  {
    name: 'Victoza',
    slug: 'victoza',
    genericName: 'liraglutide',
    image: 'https://cdn.prod.website-files.com/660dbd9edac735ff882da2d3/665e454a109712c3d398c5ab_Metformin_new.png'
  },
  {
    name: 'Saxenda',
    slug: 'saxenda',
    genericName: 'liraglutide',
    image: 'https://cdn.prod.website-files.com/660dbd9edac735ff882da2d3/665e4191a09538f881a21927_Wegovy.png'
  },
];

export default function AlternativeMedications() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll position to update dots
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.querySelector('.medication-card')?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      const newIndex = Math.round(scrollLeft / scrollAmount);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.medication-card')?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'right') {
        const newIndex = Math.min(currentIndex + 1, alternativeMedications.length - 3);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      } else {
        const newIndex = Math.max(currentIndex - 1, 0);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < alternativeMedications.length - 3;

  // Calculate number of dots (total cards - cards visible at once + 1)
  const totalDots = alternativeMedications.length - 2; // 4 cards - 3 visible + 1 = 2 dots

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-black mb-4 leading-tight font-normal">
            Alternative medications
          </h2>
          <p className="font-sans text-lg text-foreground/80 font-light leading-relaxed mx-auto">
            Depending on your health history, weight history, and{' '}
            <Link href="#metabolic-print" className="text-dark underline underline-offset-4 hover:text-dark/70 transition-colors">
              MetabolicPrint™ assessment
            </Link>
            , your Lean Protocol health care provider may consider other alternatives to help you lose weight. Some are FDA-approved for weight loss. Others are used off-label and have strong clinical evidence supporting their use for weight loss.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-black hover:bg-black/90 transition-all flex items-center justify-center ${
              !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Previous medications"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="max-w-252 mx-auto flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {alternativeMedications.map((med, index) => (
              <div
                key={index}
                className="medication-card shrink-0 w-full md:w-[calc(33.333%-16px)] snap-start"
              >
                <div className="bg-[#E8F0ED] rounded-4xl p-8 flex flex-col">
                  {/* Title */}
                  <div className="mb-6">
                    <h3 className="font-serif text-3xl text-dark mb-1">
                      {med.name}
                      <sup className="text-lg">®</sup>
                    </h3>
                    <p className="font-sans text-base text-foreground/70 font-light">
                      {med.genericName}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="flex-1 flex items-end justify-center mb-4">
                    <img
                      src={med.image}
                      alt={med.name}
                      className="w-auto h-48 object-contain"
                    />
                  </div>

                  {/* Button */}
                  <Link href={`/medications/${med.slug}`}>
                    <button className="w-fit bg-dark text-white rounded-full py-3.5 px-6 font-sans text-sm cursor-pointer font-normal hover:bg-dark/90 transition-colors flex items-center justify-center gap-2">
                      Learn more
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-black hover:bg-black/90 transition-all flex items-center justify-center ${
              !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
            }`}
            aria-label="Next medications"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[...Array(totalDots)].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const container = scrollContainerRef.current;
                  const cardWidth = container.querySelector('.medication-card')?.clientWidth || 0;
                  const gap = 24;
                  container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
                }
              }}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-black w-6' : 'bg-gray-300 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
