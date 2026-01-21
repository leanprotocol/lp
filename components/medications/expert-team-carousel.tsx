"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

/**
 * Carousel showcasing the expert medical team
 * Features doctor profiles with credentials and specializations
 */
export function ExpertTeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const doctors = [
    {
      name: "Jonathan Larson",
      title: "MD, MBA",
      role: "Medical Director",
      image: "/dr-larson.jpg",
      bio: "A West Point graduate and a board-certified physician, Dr. Larson has a decade of telemedicine leadership and operational expertise. At Lean Protocol, he is helping scale a high-quality telemedicine experience to provide the best obesity care.",
    },
    {
      name: "Kyu Rhee",
      title: "MD, MPP",
      role: "Medical Advisor",
      image: "/dr-rhee.jpg",
      bio: "Dr. Rhee is the CEO of the National Association of Community Health Centers (NACHC).",
    },
    {
      name: "Shebani Sethi",
      title: "MD",
      role: "Medical Advisor",
      image: "/dr-sethi.jpg",
      bio: "Dr. Sethi is the founding Director of Stanford University Metabolic Psychiatry and Silicon Valley Metabolic Psychiatry.",
    },
    {
      name: "Judith Korner",
      title: "PhD",
      role: "Chief Medical Advisor",
      image: "/dr-korner.jpg",
      bio: "Dr. Korner is the founding Director, Columbia Center for Weight Management Center and Vice Chair, Obesity Medical Board.",
    },
  ]

  const visibleDoctors = [
    doctors[activeIndex],
    doctors[(activeIndex + 1) % doctors.length],
    doctors[(activeIndex + 2) % doctors.length],
  ]

  return (
    <section className="w-full bg-[#F5F2ED] py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-4xl lg:text-5xl text-[#2C3E3A]">You're in expert hands</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? doctors.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-[#2C3E3A]" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === doctors.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full bg-[#2C3E3A] hover:bg-[#2C3E3A]/90 flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <p className="text-lg text-[#2C3E3A]/70 mb-12 max-w-3xl">
          We partner with the foremost experts in obesity medicine to guide our treatment program.
        </p>

        {/* Doctor cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {visibleDoctors.map((doctor, index) => (
            <div key={index} className="bg-[#D4E5E1] rounded-3xl p-8">
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
                <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E3A] mb-1">
                {doctor.name}
                <br />
                {doctor.title}
              </h3>
              <p className="text-sm text-[#2C3E3A]/70 mb-4">{doctor.role}</p>
              <p className="text-sm text-[#2C3E3A]/80 leading-relaxed">{doctor.bio}</p>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {doctors.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? "bg-[#2C3E3A] w-6" : "bg-[#2C3E3A]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
