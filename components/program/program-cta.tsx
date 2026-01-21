import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProgramCTA() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-14">
        
        {/* Image */}
        <div className="mb-12">
          <img
            src="https://cdn.prod.website-files.com/65d8ac86401a1ef9f1915fdb/660bdff49b02fc0b5ff75273_CTA%20Ready%20to%20Get%20Started%20Image.webp"
            alt="Two women sitting together and smiling"
            className="w-full h-[500px] rounded-[3rem] object-cover"
          />
        </div>

        {/* Content */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-black mb-6 leading-tight font-normal">
            Ready to get started?
          </h2>
          
          <p className="font-sans text-lg text-foreground/80 font-normal mb-10 leading-relaxed">
            We're on a mission to improve our members' lives and transform the way people treat, manage, and talk about weight. And there's so much more to do.
          </p>

          {/* CTA Button */}
          <Link href="/get-started">
            <button className="bg-dark cursor-pointer text-white rounded-full py-4 px-10 font-sans text-base font-normal hover:bg-dark/90 transition-colors inline-flex items-center gap-2">
              Get started
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
