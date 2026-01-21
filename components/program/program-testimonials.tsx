'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';

interface Testimonial {
  name: string;
  weightLost: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Malcolm',
    weightLost: 32,
  },
  {
    name: 'Lisa F',
    weightLost: 66,
  },
  {
    name: 'Emily Z',
    weightLost: 50,
  },
  {
    name: 'Sarah M',
    weightLost: 45,
  }
];

export default function ProgramTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.querySelector('.testimonial-card')?.clientWidth || 0;
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
      const cardWidth = container.querySelector('.testimonial-card')?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'right') {
        const newIndex = Math.min(currentIndex + 1, testimonials.length - 1);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      } else {
        const newIndex = Math.max(currentIndex - 1, 0);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    // Pause all other videos
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
      }
    });
    
    video.play();
    setPlayingIndex(index);
  };

  const handleVideoPlay = (index: number) => {
    setPlayingIndex(index);
  };

  const handleVideoPause = (index: number) => {
    setPlayingIndex(null);
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < testimonials.length - 1;

  return (
    <section className="py-16 md:py-24 bg-[#D8ECE4]">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="heading">
            Real members, real results
          </h2>
          <p className="font-sans text-base text-dark font-normal max-w-2xl mt-4">
            We're helping members, past and present, along their health journeys lose weight, feel amazing, and find joy.
          </p>
          
          <Link href="/get-started">
            <button className="mt-8 bg-[#2D3E3A] text-white rounded-full py-4 px-8 font-sans text-sm font-normal hover:bg-[#2D3E3A]/90 transition-colors flex items-center gap-2">
              Get started
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute right-0 -top-20 flex items-center gap-3 z-10">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full cursor-pointer bg-black/90 hover:bg-black/90 transition-all flex items-center justify-center ${
                !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full cursor-pointer bg-black hover:bg-black/90 transition-all flex items-center justify-center ${
                !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory -mr-4 md:-mr-14 pr-4 md:pr-14"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card shrink-0 w-[85%] md:w-[calc(40%-12px)] snap-start"
              >
                <div className="rounded-4xl overflow-hidden h-[450px] md:h-125 flex">
                  {/* Left: Video */}
                  <div className="relative w-1/2 bg-gray-200">
                    <video
                      ref={(el) => {videoRefs.current[index] = el;}}
                      className="w-full h-full object-cover"
                      controls={playingIndex === index}
                      controlsList="nodownload"
                      loop
                      playsInline
                      onPlay={() => handleVideoPlay(index)}
                      onPause={() => handleVideoPause(index)}
                      onEnded={() => handleVideoPause(index)}
                    >
                      <source src="/hero.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Play Button Overlay - Only show when not playing */}
                    {playingIndex !== index && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10"
                        onClick={() => togglePlay(index)}
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-700/60 hover:bg-gray-700/80 transition-colors flex items-center justify-center">
                          <Play className="w-7 h-7 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Name & Weight */}
                  <div className="w-1/2 bg-dark p-8 flex flex-col justify-between">
                    {/* Name at Top */}
                    <div>
                      <h3 className="font-serif text-4xl text-white font-normal">
                        {testimonial.name}
                        <sup className="text-lg">*</sup>
                      </h3>
                    </div>

                    {/* Weight Lost at Bottom */}
                    <div>
                      <p className="font-sans text-sm text-white/70 mb-2">Lost</p>
                      <p className="font-sans text-8xl text-white font-thin tracking-[-2px]">
                        {testimonial.weightLost}
                        <span className="text-3xl">lb.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8">
          <p className="font-sans text-xs text-foreground/60 font-light leading-relaxed">
            *Real users, paid for appearance. Individual results may vary. In 1 year, Lean Protocol users lost an average of 15% body weight. Results based on real-world users who started medication and logged at least 1 time/week on avg for 1 year. Prescription are up to a medical provider's discretion. See risk information{' '}
            <Link href="#risk-info" className="underline">here</Link>.
          </p>
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
