import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import blogsHero from "../../public/blogshero.png"
export function BlogHero() {
  return (
    <div className="bg-background -mt-20">
      <section className="max-w-7xl mx-auto relative w-full overflow-hidden pt-28 md:pt-20">
        <div className="container mx-auto px-6 lg:px-14 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl py-10">
              <h1 className="font-serif text-4xl lg:text-[3.5rem] leading-[1.2] text-[#191919] mb-6">
                The Blog{" "}
                <span className="italic opacity-70">that keeps it practical</span>
              </h1>

              <p className="text-[#4A4A4A] text-sm mb-10 leading-relaxed max-w-md">
                Evidence-based guidance on medication, nutrition, mindset, and
              day-to-day habits—written to be easy to apply.
              </p>
            </div>

            {/* Right Content: Image */}
            <div className="relative w-full aspect-4/5 lg:aspect-square hidden md:block">
              <div className="relative w-full h-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden transform transition-transform duration-500 ease-out">
                <Image
                  src={blogsHero}
                  alt="Notebook, coffee, and laptop on a desk"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
