'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticleCard {
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface MoreOnMedicationProps {
  medicationName: string;
}

export default function MoreOnMedication({ medicationName }: MoreOnMedicationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const articles: ArticleCard[] = [
    {
      category: 'Weight loss medication',
      title: `FDA approves ${medicationName} for those with chronic kidney disease & type 2 diabetes`,
      description: `New research and FDA approval show ${medicationName} improves kidney health outcomes for those with type 2 diabetes and chronic kidney disease.`,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      category: 'Weight loss medication',
      title: `The top 3 reasons you're not losing weight on ${medicationName}`,
      description: `${medicationName} is often used for weight loss. But not everyone who takes it drops pounds quickly or continuously. Get answers for "Why am I not losing weight on ${medicationName}?"`,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      category: 'Weight loss medication',
      title: `How much does ${medicationName} cost?`,
      description: `${medicationName} is not only popular for weight loss—it's also notoriously expensive. Exactly how much does ${medicationName} cost without insurance, and are there ways to save?`,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      link: '#'
    },
    {
      category: 'Insurance',
      title: `Is ${medicationName} covered by insurance?`,
      description: `How much does ${medicationName} cost out of pocket vs. with insurance or Medicare for weight loss, and what affects the cost? Here's what to know.`,
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
      link: '#'
    },
     {
      category: 'Weight loss medication',
      title: `FDA approves ${medicationName} for those with chronic kidney disease & type 2 diabetes`,
      description: `New research and FDA approval show ${medicationName} improves kidney health outcomes for those with type 2 diabetes and chronic kidney disease.`,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      link: '#'
    },
  ];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.querySelector('.article-card')?.clientWidth || 0;
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
      const cardWidth = container.querySelector('.article-card')?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      if (direction === 'right') {
        const newIndex = Math.min(currentIndex + 1, articles.length - 4);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      } else {
        const newIndex = Math.max(currentIndex - 1, 0);
        container.scrollTo({ left: newIndex * scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < articles.length - 4;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-14">
        
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-[2.5rem] text-black leading-tight font-normal">
            More on {medicationName}
            <sup className="text-2xl">®</sup>:
          </h2>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 cursor-pointer rounded-full bg-black hover:bg-black transition-all flex items-center justify-center ${
                !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Previous articles"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 cursor-pointer rounded-full bg-black hover:bg-black/90 transition-all flex items-center justify-center ${
                !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              }`}
              aria-label="Next articles"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article, index) => (
            <Link
              key={index}
              href={article.link}
              className="article-card flex-shrink-0 w-full md:w-[calc(25%-18px)] snap-start group"
            >
              <div className="overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="relative rounded-[2rem] aspect-[4/2.5] overflow-hidden bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full rounded-[2rem] object-cover transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 mt-5 border border-dark rounded-full text-[10px] font-sans text-dark">
                      {article.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-black mb-3 leading-tight group-hover:underline">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-foreground/70 font-light leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>
            </Link>
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
