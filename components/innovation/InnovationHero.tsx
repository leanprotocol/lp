import { Check } from "lucide-react";
import { hero, positioning } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { NoteBox } from "./InnovationUI";

export function InnovationHero() {
  return (
    <section className="inv-section" style={{ paddingBottom: 0 }}>
      <div className="inv-wrap">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="inv-reveal">
            <p className="inv-eyebrow mb-4">{hero.eyebrow}</p>
            <h1 className="inv-h1">{hero.headline}</h1>
            <p className="inv-lead mt-5 max-w-xl">{hero.supporting}</p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {hero.trustMarkers.map((marker) => (
                <li
                  key={marker}
                  className="flex items-center gap-2 text-[14px] font-medium"
                  style={{ color: "var(--inv-navy)" }}
                >
                  <span
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
                    style={{ background: "var(--inv-green-soft)", color: "var(--inv-green)" }}
                  >
                    <Check size={11} strokeWidth={3} aria-hidden />
                  </span>
                  {marker}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={hero.primaryCta.href} className="inv-btn inv-btn--primary w-full sm:w-auto">
                {hero.primaryCta.label}
              </a>
              <a href={hero.secondaryCta.href} className="inv-btn inv-btn--secondary w-full sm:w-auto">
                {hero.secondaryCta.label}
              </a>
              {hero.documentCta.href ? (
                <a
                  href={hero.documentCta.href}
                  className="inv-btn inv-btn--ghost w-full sm:w-auto"
                  download
                >
                  {hero.documentCta.label}
                </a>
              ) : null}
            </div>
          </div>

          <div className="inv-reveal" style={{ animationDelay: "80ms" }}>
            <InnovationImage
              {...innovationAssets.hero}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>

        <div className="mt-12 max-w-3xl md:mt-16">
          <NoteBox tone="safe">{positioning.boundary}</NoteBox>
        </div>
      </div>
    </section>
  );
}
