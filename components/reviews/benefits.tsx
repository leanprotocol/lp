'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const benefits = [
  "curb my emotional eating tendencies",
  "prioritize my mood and mental health",
  "connect with my true hunger cues",
  "access an entire toolbox of clinicians, community, and medication",
  "get treated with care and kindness",
  "stick to healthy habits like going for walks and getting good sleep",
  "feel confident in my body again",
  "reduce my cravings and appetite",
  "maintain a sustainable weight loss journey",
  "improve my overall health markers",
];

export default function BenefitsRotating() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-14">
        <div className="text-center">
          
          {/* Static heading */}
          <h2 className="heading mb-12">
            With Lean Protocol I have been able to...
          </h2>

          {/* Rotating benefits stack */}
          <div className="relative h-[300px] md:h-[250px] flex flex-col items-center justify-center">
            
            {/* Display 3 items: previous (faded), current (highlighted), next (faded) */}
            <div className="relative w-full max-w-3xl">
              
              {/* Previous item (faded above) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.3, y: 0 }}
                className="absolute -top-20 left-0 right-0 text-center"
              >
                <div className="inline-block px-8 py-4 rounded-full border-2 border-muted-foreground/20">
                  <p className="font-sans text-base md:text-lg text-muted-foreground">
                    {benefits[(currentIndex - 1 + benefits.length) % benefits.length]}
                  </p>
                </div>
              </motion.div>

              {/* Current item (highlighted in center) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <div className="inline-block px-10 py-6 rounded-full border-2 border-accent bg-accent/10">
                    <p className="font-sans text-xl md:text-2xl font-medium text-dark">
                      {benefits[currentIndex]}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Next item (faded below) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.3, y: 0 }}
                className="absolute -bottom-20 left-0 right-0 text-center"
              >
                <div className="inline-block px-8 py-4 rounded-full border-2 border-muted-foreground/20">
                  <p className="font-sans text-base md:text-lg text-muted-foreground">
                    {benefits[(currentIndex + 1) % benefits.length]}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
