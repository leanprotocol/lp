export function BenefitsSection() {
  const benefits = [
    { label: "Sleep apnea", image: "/peaceful-sleep.png" },
    { label: "Diabetes", image: "/diabetes-management-concept.png" },
    { label: "Mental health", image: "/mental-wellness.jpg" },
    { label: "Back pain", image: "/placeholder.svg?height=300&width=400" },
    { label: "Hydration", image: "/hydration.jpg" },
    { label: "Confidence", image: "/confident-person.jpg" },
    { label: "Joint pain", image: "/placeholder.svg?height=300&width=400" },
    { label: "Blood pressure", image: "/placeholder.svg?height=300&width=400" },
    { label: "Cholesterol", image: "/placeholder.svg?height=300&width=400" },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Weight loss, and so <span className="text-emerald-600">much more</span>
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Lean Protocol helps you feel your best, look your best, and improve other important aspects of your life
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={benefit.image || "/placeholder.svg"}
                alt={benefit.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-lg">{benefit.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
