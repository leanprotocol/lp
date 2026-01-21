"use client"

import { useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MedicationCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const medications = [
    {
      name: "Zepbound®",
      category: "TIRZEPATIDE",
      link: "/medications/zepbound",
      image: "/medications-toolkit/Zepbound.jpeg",
      tags: ["GLP-1 / GIP", "injection", "tirzepatide"],
      benefits: ["Regulates insulin", "Balances blood sugar", "Reduces appetite"],
    },
    {
      name: "Mounjaro®",
      category: "TIRZEPATIDE",
      link: "/medications/mounjaro",
      image: "/medications-toolkit/Mounjaro.jpg",
      tags: ["GLP-1 / GIP", "injection", "tirzepatide"],
      benefits: ["Regulates insulin", "Balances blood sugar", "Reduces appetite"],
    },
    {
      name: "Victoza®",
      category: "LIRAGLUTIDE",
      link: "/medications/victoza",
      image: "/medications-toolkit/Victoza.png",
      tags: ["GLP-1", "injection", "liraglutide"],
      benefits: ["Regulates insulin", "Balances blood sugar", "Reduces appetite"],
    },
    {
      name: "Wegovy®",
      category: "SEMAGLUTIDE",
      link: "/medications/wegovy",
      image: "/medications-toolkit/WeGovy.jpg",
      tags: ["GLP-1", "injection", "semaglutide"],
      benefits: ["Regulates insulin", "Balances blood sugar", "Reduces appetite"],
    },
    {
      name: "Ozempic®",
      category: "SEMAGLUTIDE",
      link: "/medications/wegovy",
      image: "/medications-toolkit/Ozempic.webp",
      tags: ["GLP-1", "injection", "semaglutide"],
      benefits: ["Regulates insulin", "Balances blood sugar", "Reduces appetite"],
    },
    {
      name: "Orlistat",
      category: "ORAL",
      link: "/medications/saxenda",
      image: "/medications-toolkit/Orlistat.webp",
      tags: ["Oral"],
      benefits: ["Controls cravings", "Reduces appetite"],
    },
    {
      name: "Metformin",
      category: "ORAL",
      link: "/medications/wegovy",
      image: "/medications-toolkit/Metformin.webp",
      tags: ["Oral"],
      benefits: ["Controls cravings", "Reduces appetite"],
    },
  ]

  const thumbnails = [
    { name: "Zepbound®", image: "/medications-toolkit/Zepbound.jpeg" },
    { name: "Mounjaro®", image: "/medications-toolkit/Mounjaro.jpg" },
    { name: "Saxenda®", image: "/medications-toolkit/Saxenda.png" },
    { name: "Victoza®", image: "/medications-toolkit/Victoza.png" },
    { name: "Wegovy®", image: "/medications-toolkit/WeGovy.jpg" },
    { name: "Orlistat", image: "/medications-toolkit/Orlistat.webp" },
    { name: "Metformin", image: "/medications-toolkit/Metformin.webp" },
  ]

  const activeMed = medications[activeIndex]

  const handleSlideChange = (newIndex: number) => {
    if (isAnimating || newIndex === activeIndex) return
    setIsAnimating(true)
    
    setTimeout(() => {
      setActiveIndex(newIndex)
      setIsAnimating(false)
    }, 300)
  }

  const nextSlide = () => {
    const next = activeIndex === medications.length - 1 ? 0 : activeIndex + 1
    handleSlideChange(next)
  }

  const prevSlide = () => {
    const prev = activeIndex === 0 ? medications.length - 1 : activeIndex - 1
    handleSlideChange(prev)
  }

  return (
    <section className="w-full bg-[#F5F2ED] py-12 md:py-18">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="heading text-3xl md:text-4xl">The medication toolkit</h2>
          <p className="sub-heading mt-4 text-sm md:text-base max-w-2xl mx-auto">
            Get to know the different medications our clinicians can prescribe and how they may help you on your weight
            care journey.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto mb-12">
          
          {/* Main Card Container */}
          <div className="bg-white rounded-3xl overflow-hidden min-h-auto lg:min-h-[500px] flex items-center shadow-sm">
            <div 
                className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center transition-all duration-300 ease-in-out ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
            >
              
              {/* Image Section */}
              <div className="relative h-64 sm:h-80 lg:h-120 flex items-center justify-center bg-gray-50/50 lg:bg-transparent">
                <div className="relative w-full h-full">
                  <Image
                    src={activeMed.image || "/placeholder.svg"}
                    alt={activeMed.name}
                    fill
                    className="object-contain p-4 lg:p-0 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                    priority
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pb-10 lg:pr-8 lg:py-8 lg:pl-0">
                <p className="text-xs md:text-sm text-dark/60 mb-2 uppercase tracking-wide font-medium">{activeMed.category}</p>
                <h3 className="font-serif text-3xl md:text-4xl text-dark mb-5 md:mb-7">{activeMed.name}</h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeMed.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 md:px-4 md:py-1.5 border border-dark rounded-full text-xs md:text-sm text-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="space-y-3 mb-8">
                  {activeMed.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#8BA89F]/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#8BA89F]" />
                      </div>
                      <span className="text-sm md:text-base text-dark">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                   <Link href="/get-started" className="w-full sm:w-auto">
                      <Button className="bg-dark cursor-pointer h-12 text-base w-full sm:w-38 hover:bg-dark/90 text-white rounded-full px-6 transition-transform">
                        Get started <ArrowRight className="ml-2 w-4 h-4"/>
                      </Button>
                   </Link>

                   <Link href={activeMed.link} className="w-full sm:w-auto">
                      <Button className="border-[1.5px] border-dark bg-transparent text-dark hover:text-white cursor-pointer h-12 text-base w-full sm:w-32 hover:bg-dark rounded-full px-6 transition-transform">
                        Learn More 
                      </Button>
                   </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Navigation Buttons - Hidden on Mobile to prevent overlap */}
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="hidden lg:flex absolute -left-7 top-1/2 -translate-y-1/2 w-14 h-14 cursor-pointer rounded-full bg-dark text-white items-center justify-center hover:bg-dark/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 w-14 h-14 cursor-pointer rounded-full bg-dark text-white items-center justify-center hover:bg-dark/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-2 md:gap-4 flex-wrap max-w-5xl mx-auto">
          {thumbnails.map((med, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index % medications.length)}
              className={`relative bg-white w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden border transition-all duration-300 ${
                index === activeIndex 
                  ? "border-dark ring-dark/20 scale-105" 
                  : "border-transparent hover:border-dark/30 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={med.image || "/placeholder.svg"} alt={med.name} fill className="object-contain p-2 md:p-0" />
            </button>
          ))}
        </div>

        <p className="text-[10px] md:text-xs text-center text-dark/50 mt-12 max-w-4xl mx-auto px-4">
          Lean Protocol is not affiliated or endorsed by Novo Nordisk A/S, the owner of the registered trademarks Wegovy®,
          Ozempic®, Saxenda®, and Victoza®, nor is it affiliated or endorsed by Eli Lilly & Co.
        </p>
      </div>
    </section>
  )
}