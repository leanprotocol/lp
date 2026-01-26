"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import Image from "next/image";

interface Benefit {
  text: string;
  image: string;
}

const benefits: Benefit[] = [
  { text: "Diabetes", image: "/marquee/diabetes.png" },
  { text: "Mental health", image: "/marquee/mental-health.png" },
  { text: "Back pain", image: "/marquee/back-pain.png" },
  { text: "Sound Sleep", image: "/marquee/sleep-apnea.png" },
  { text: "Heart Health", image: "/marquee/heart-health.png" },
  { text: "Mobility", image: "/marquee/mobility.png" },
  { text: "Metabolism", image: "/marquee/metabolism.png" },
  { text: "Confidence", image: "/marquee/confidence.png" },
  { text: "Joint pain", image: "/marquee/joint-pain.png" },
  { text: "Blood pressure", image: "/marquee/blood-pressure.png" },
  { text: "Hydration", image: "/marquee/hydration.png" },
  { text: "Self-esteem", image: "/marquee/self-esteem.png" },
  { text: "Energy", image: "/marquee/energy.png" },
  { text: "Longevity", image: "/marquee/longevity.png" },
  { text: "Balance", image: "/marquee/balance.png" },
];

const row1Data = benefits.filter((_, index) => index % 2 === 0);
const row2Data = benefits.filter((_, index) => index % 2 === 1);

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function BenefitCard({ text, image }: Benefit) {
  return (
    <div className="group relative w-36 h-36 md:w-64 md:h-52 shrink-0 rounded-xl overflow-hidden transition-all duration-500 select-none cursor-default transform bg-[#F7F1EB]">
      <Image
        src={image}
        alt={text}
        fill
        sizes="(max-width: 768px) 208px, 256px"
        placeholder="blur"
        blurDataURL="/blur-placeholder.png"
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 ease-out z-0 pointer-events-none"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#5B746F';
        }}
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent z-10 opacity-90" />
      
      <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex flex-col justify-end">
        <div className="w-6 h-0.5 bg-white/80 mb-2 group-hover:w-10 transition-all duration-500 rounded-full"></div>
        <h3 className="font-serif text-sm md:text-lg text-white font-medium tracking-tight truncate ">
          {text}
        </h3>
      </div>
    </div>
  );
}

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
  copyCount?: number;
}

function ParallaxText({ children, baseVelocity = 100, copyCount = 3 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [setWidth, setSetWidth] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const update = () => {
      const w = el.scrollWidth;
      setSetWidth(copyCount > 0 ? w / copyCount : w);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [copyCount]);

  const x = useTransform(baseX, (v) => {
    if (!setWidth) return "0px";
    return `${wrap(-setWidth, 0, v)}px`;
  });

  const isDragging = useRef<boolean>(false);
  const lastClientX = useRef<number>(0);
  const direction = baseVelocity >= 0 ? 1 : -1;
  const speed = Math.abs(baseVelocity);
  useAnimationFrame((t, delta) => {
    let moveBy = direction * speed * (delta / 1000);

    if (!isDragging.current) {
      const boost = Math.abs(velocityFactor.get());
      moveBy += direction * speed * boost * (delta / 1000);
      baseX.set(baseX.get() + moveBy);
    }
  });

  // Native Pointer Events for smoother, jitter-free dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastClientX.current = e.clientX;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      const delta = e.clientX - lastClientX.current;
      lastClientX.current = e.clientX;
      // Update baseX directly with the drag delta (px-based)
      baseX.set(baseX.get() + delta);
    }
  };
  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="overflow-hidden whitespace-nowrap py-2 md:py-3">
      <motion.div 
        className="flex gap-2 md:gap-4 px-2 md:px-4 cursor-grab active:cursor-grabbing touch-none" 
        style={{ x }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div ref={trackRef} className="flex gap-2 md:gap-4">
          {Array.from({ length: copyCount }).map((_, idx) => (
            <div key={idx} className="flex gap-2 md:gap-4">
              {children}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function DiseaseMarqueeOverlay() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // px/sec (mobile faster, desktop slower)
  const baseSpeed = isMobile ? 70 : 30;

  return (
    <section className="py-12 md:py-18 bg-dark relative overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12 lg:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center w-full mx-auto"
        >
          <h2 className="heading-white leading-tight">
            <span className="inline-block md:whitespace-nowrap">
              Because breaking free from obesity will make you better in every way.
            </span>
            <span className="mt-2 block italic text-white">
              And Improve Your.....
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-col space-y-0 md:space-y-3 relative z-0">
        {/* Row 1 - Speed increased */}
        <ParallaxText baseVelocity={-baseSpeed}>
          {row1Data.map((benefit, i) => (
            <BenefitCard key={`r1-${i}`} {...benefit} />
          ))}
        </ParallaxText>

        {/* Row 2 - Speed increased */}
        <ParallaxText baseVelocity={baseSpeed}>
          {row2Data.map((benefit, i) => (
            <BenefitCard key={`r2-${i}`} {...benefit} />
          ))}
        </ParallaxText>
      </div>
    </section>
  );
}
