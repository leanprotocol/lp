"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---
interface Medication {
  category: string;
  name: string;
  slug: string;
  image: string;
}

const medications: Medication[] = [
  {
    category: "SEMAGLUTIDE",
    name: "Ozempic",
    slug: "ozempic",
    image:
      "/medications-toolkit/Ozempic.webp",
  },
  {
    category: "SEMAGLUTIDE",
    name: "WeGovy",
    slug: "wegovy",
    image:
      "/medications-toolkit/WeGovy.jpg",
  },
  {
    category: "TIRZEPATIDE",
    name: "Mounjaro",
    slug: "mounjaro",
    image:
      "/medications-toolkit/Mounjaro.jpg",
  },
  {
    category: "TIRZEPATIDE",
    name: "Zepbound",
    slug: "zepbound",
    image:
      "/medications-toolkit/Zepbound.jpeg",
  },
  {
    category: "SEMAGLUTIDE",
    name: "Rebylsus",
    slug: "rybelsus",
    image:
      "/medications-toolkit/Rebylsus.png",
  },
];

export default function MedicationToolkit() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    // Adjust scroll width based on screen size
    const cardWidth =
      container.offsetWidth / (window.innerWidth < 768 ? 1.2 : 3.5);
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const track = [...medications, ...medications];

  return (
    <section className="py-12 md:py-18 border-t border-dark/5 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif max-w-4xl text-[40px] md:text-[50px] leading-[1.1] text-dark tracking-tight"
          >
           Wish to Choose your own Medications? <span className="italic opacity-70">We Got You!</span>{" "}
          </motion.h2>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 cursor-pointer rounded-full border border-dark/20 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-dark disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 cursor-pointer rounded-full border border-dark/20 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-dark disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {track.map((med, index) => (
              <motion.div
                key={`${med.name}-${index}`}
                // initial={{ opacity: 0 }}
                // whileInView={{ opacity: 1 }}
                // viewport={{ once: true }}
                // transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85%] sm:w-[420px] bg-card rounded-4xl border border-dark/5 transition-colors duration-300 overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="p-8 pb-4">
                  <div className="font-sans text-xs font-bold tracking-[0.2em] text-dark/40 mb-3 uppercase">
                    {med.category}
                  </div>
                  <h3 className="font-serif text-2xl text-dark font-normal">
                    {med.name}
                  </h3>
                </div>

                {/* Card Image */}
                <div className="h-50 w-full relative flex items-center justify-center bg-card">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700"
                  />
                </div>

                {/* Card Actions */}
                <div className="p-6 mt-auto bg-card border-t border-dark/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Link
                      href="/get-started"
                      className="flex-1 text-[14px] flex items-center justify-center gap-2 bg-dark text-white py-3 rounded-full hover:bg-dark/90 transition-colors duration-300 group"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* <Link
                      href="/medications"
                      className="flex-1 text-[14px] flex items-center justify-center py-3 border border-dark/20 text-dark rounded-full hover:bg-dark hover:text-white transition-colors duration-300"
                    >
                      Learn More
                    </Link> */}
                  </div>

                  <div className="text-center">
                    <Link
                      href={`/medications/${med.slug}`}
                      className="text-[10px] underline text-dark/60 hover:text-dark transition-colors font-sans cursor-pointer tracking-wider uppercase"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-dark/5">
          <p className="text-xs text-dark/40 text-justify max-w-5xl leading-relaxed font-sans font-light">
            Lean protocol is not affiliated or endorsed by Novo Nordisk A/S., the owner
            of the registered trademarks Wegovy®, Ozempic®, Saxenda®, Rybelsus®,
            and Victoza®, nor is it affiliated or endorsed by Eli Lilly & Co.,
            the owner of the registered trademarks Trulicity®, Zepbound®, and
            Mounjaro®.
          </p>
        </div>
      </div>
    </section>
  );
}
