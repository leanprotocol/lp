"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OurWhyHero() {
  return (
    <section className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden -mt-22 md:-mt-28">
      <Image
        src="/our-why-hero3.png"
        alt="Happy Indian person smiling confidently"
        fill
        priority
        className="object-cover object-left md:object-center"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-accent2 md:from-accent2/70 via-accent2/50 md:via-accent2/20 to-transparent" />
      
      <div className="relative z-10 flex items-center h-full px-4 sm:px-8 lg:px-28 pt-18">
        <div className="w-full space-y-6">
          <h1 className="font-serif text-dark text-3xl md:text-[4.2rem] leading-tight">
            Take charge of{" "}
            <span className="block italic opacity-70">your weight today</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-dark">
            <span className="font-serif text-base md:text-lg text-[#1F302B] pr-5 md:pr-0">
              Start your journey for just{" "}
              <span className="block md:inline">
                <span className="line-through opacity-70 pr-1"> Rs 5799</span>
                <span className="font-semibold border-b border-dark/40"> Rs 2299</span>
              </span>
            </span>
            <Button
              asChild
              className="group w-fit rounded-full bg-dark px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-dark/90"
            >
              <Link href="/get-started" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}