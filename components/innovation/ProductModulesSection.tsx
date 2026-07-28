import { modules } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, StageChip } from "./InnovationUI";

export function ProductModulesSection() {
  return (
    <Section variant="plain">
      <SectionHeading
        eyebrow={modules.eyebrow}
        title={modules.headline}
        lead={modules.intro}
      />

      <div className="mt-12 flex flex-col gap-14 md:gap-20">
        {modules.items.map((mod, i) => {
          const asset = innovationAssets[mod.key];
          const imageFirstOnDesktop = i % 2 === 1;

          return (
            <article
              key={mod.key}
              className="grid gap-7 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div className={imageFirstOnDesktop ? "lg:order-2" : ""}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inv-num text-[13px]" style={{ color: "var(--inv-blue-bright)" }}>
                    {mod.number}
                  </span>
                  <StageChip stage={mod.stage} />
                </div>
                <h3 className="inv-h2 mt-3 text-[24px] md:text-[30px]">{mod.title}</h3>
                <p className="inv-lead mt-3 text-[16px]">{mod.summary}</p>

                <ul className="inv-ticks mt-5">
                  {mod.functions.map((fn) => (
                    <li key={fn}>{fn}</li>
                  ))}
                </ul>
              </div>

              <div className={imageFirstOnDesktop ? "lg:order-1" : ""}>
                <InnovationImage
                  {...asset}
                  sizes="(max-width: 1024px) 100vw, 540px"
                />
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
