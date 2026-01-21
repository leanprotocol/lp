"use client"
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// --- Types ---
interface MemberImage {
  src: string;
  height: string;
}

// --- Counter Component ---
const Counter = ({ from, to }: { from: number; to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(from, { mass: 1, stiffness: 50, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (inView) {
      spring.set(to);
    }
  }, [inView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

// --- Main Component ---
export default function MembersServed() {
  const images: MemberImage[] = [
    // Mixed high quality portraits
    { src: "/member1.jpg", height: "h-64" },
    { src: "/member2.jpg", height: "h-52" },
    { src: "/member3.jpg", height: "h-72" },
    { src: "/member4.png", height: "h-48" },
    { src: "/member5.png", height: "h-60" },
    { src: "/member6.png", height: "h-56" },
    { src: "/member7.png", height: "h-52" },
    { src: "/member8.jpg", height: "h-64" },
    { src: "/member9.jpg", height: "h-56" },
    { src: "/member10.jpg", height: "h-52" },
    { src: "/member11.jpg", height: "h-64" },
    { src: "/member12.jpg", height: "h-52" },
  ];

  // Distribute images into 3 columns
  const column1 = [...images.slice(0, 4)];
  const column2 = [...images.slice(4, 8)];
  const column3 = [...images.slice(8, 12)];

  // Helper to render a scrolling column
  const MarqueeColumn = ({ 
    data, 
    direction = 'up', 
    duration = '40s' 
  }: { 
    data: MemberImage[], 
    direction?: 'up' | 'down', 
    duration?: string 
  }) => (
    <div className="relative h-[600px] overflow-hidden">
      <div 
        className={`flex flex-col gap-4 ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}
        style={{ animationDuration: duration }}
      >
        {/* Render Original + Duplicate for seamless loop */}
        {[...data, ...data, ...data].map((img, i) => (
          <div 
            key={i} 
            className={`flex-shrink-0 w-full ${img.height} rounded-2xl overflow-hidden bg-muted`}
          >
            <img 
              src={img.src} 
              alt="Community member" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        ))}
      </div>
      
      {/* Gradient Overlays for smoothness */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );

  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          
          {/* LEFT: Moving Marquee Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4"
          >
            <MarqueeColumn data={column1} direction="up" duration="45s" />
            <MarqueeColumn data={column2} direction="down" duration="50s" />
            <MarqueeColumn data={column3} direction="up" duration="55s" />
          </motion.div>

          {/* RIGHT: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-2">
              <div className="flex items-baseline text-dark justify-center lg:justify-start text-7xl md:text-8xl lg:text-[10rem] font-serif leading-none">
                <Counter from={0} to={250} />
                <span className="text-5xl md:text-6xl lg:text-7xl">k+</span>
              </div>
              <div className="font-sans ml-2 text-xl lg:text-2xl text-muted-foreground font-light tracking-wide">
                members served
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Styles for vertical marquee animation */}
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down linear infinite;
        }
      `}</style>
    </section>
  );
}