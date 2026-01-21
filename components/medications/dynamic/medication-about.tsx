import Link from 'next/link';

export default function MedicationAbout() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-[85rem] mx-auto px-4 md:px-14">
        <div className="relative bg-[#D8ECE4] rounded-[3rem] overflow-hidden px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
            
            {/* Left: Content */}
            <div className="py-12 lg:py-20 px-8 lg:px-10 relative z-10">
              <h2 className="font-serif text-2xl md:text-3xl text-black mb-6 leading-tight font-normal">
                about <span className="font-semibold md:text-3xl md:text-[40px]">Lean</span>
              </h2>
              
              <div className="space-y-4 font-sans text-lg text-black font-light leading-normal">
                <p>
                  Lean Protocol is an online weight loss program offering personalized care for every member. Some of the nation's top obesity medicine specialists helped design our program. Our approach is based on science, and we're committed to clinical excellence.
                </p>
                
                <p>
                  Members get access to: Clinicians trained in obesity medicine, self-paced lifestyle change program designed by doctors, psychologists, and behavioral scientists & our exclusive in-app community.
                </p>

                <p>
                  Lean Protocol's comprehensive program is designed to work with your body—so you can achieve lasting results and enjoy better health.
                </p>

                <p className="text-sm pt-2">
                  Lean Protocol is not affiliated with Novo Nordisk A/S., the owner of the registered trademark Ozempic
                  <sup>®</sup>, Wegovy<sup>®</sup>, and Rybelsus<sup>®</sup>. Rx are up to a medical provider's discretion and not available in all states. Semaglutide has serious contraindications and risks. For risk and side effect info,{' '}
                  <Link href="#risk-info" className="text-dark underline underline-offset-4 hover:text-dark/70 transition-colors">
                    click here
                  </Link>.
                </p>
              </div>
            </div>

            {/* Right: Image with Decorative Shapes */}
            <div className="relative h-full min-h-[500px] lg:min-h-150">
              {/* Purple blob top */}
              <div className="absolute top-0 right-40 w-[400px] h-[350px] bg-[#E0D7F3] rounded-full blur-0" 
                   style={{ transform: 'translate(25%, -25%)' }}>
              </div>
              
              {/* Peach blob bottom */}
              <div className="absolute bottom-0 right-40 w-[450px] h-[400px] bg-[#FCC2A1] rounded-full blur-0" 
                   style={{ transform: 'translate(30%, 25%)' }}>
              </div>

              {/* Image in middle */}
              <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
                <div className="absolute right-22 w-full max-w-[400px] aspect-square rounded-[3rem] overflow-hidden">
                  <img
                    src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/6654db5eb8fe4548e6704419_cta-image-long.webp"
                    alt="Lean Protocol package delivery"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
