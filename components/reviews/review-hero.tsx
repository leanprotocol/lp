'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop', weight: 75 },
  { image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop', weight: 20 },
  { image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop', weight: 30 },
  { image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop', weight: 155 },
  { image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop', weight: 44 },
  { image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop', weight: 35 },
  { image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop', weight: 33 },
  { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop', weight: 50 },
  { image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop', weight: 44 },
  { image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop', weight: 28 },
  { image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&auto=format&fit=crop', weight: 24 },
];

export default function ReviewHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative -mt-20 py-16 md:py-24 bg-gradient-to-r from-accent2 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-14 pt-12">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="heading text-center"
            >
              Results you can see, 
              <span className='italic opacity-70'> success you can feel</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sub-heading text-dark/70 mb-8"
            >
              See what members, past and present, are saying about their success.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-dark)] text-white hover:bg-[var(--color-dark)]/90 rounded-full text-base px-8 h-12 transition-colors duration-300 font-sans font-medium"
              >
                Take the quiz
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial Grid Section */}
      <section className="pb-10 bg-gradient-to-r from-accent2 to-white">
        <div className="container mx-auto px-4 md:px-14">
          
          {/* Grid of testimonial cards */}
          <div className="flex flex-wrap justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative w-56 h-56 rounded-3xl overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <img
                  src={testimonial.image}
                  alt={`Lost ${testimonial.weight}lb`}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Text overlay */}
                <div className="absolute bottom-4 left-20 text-white">
                  <p className="font-sans text-xs font-light mb-1">Lost</p>
                  <p className="font-serif text-4xl font-thin leading-none text-white/80">
                    {testimonial.weight}
                    <span className="text-2xl">lb.</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
