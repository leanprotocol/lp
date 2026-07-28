import { deployment } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";
import { Section, SectionHeading, StageChip } from "./InnovationUI";

export function AccessibleDeploymentSection() {
  return (
    <Section variant="plain">
      <SectionHeading
        eyebrow={deployment.eyebrow}
        title={deployment.headline}
        lead={deployment.intro}
        chip={<StageChip stage="proposed" label="Design intent, not current operations" />}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-14">
        <InnovationImage
          {...innovationAssets.deploymentNetwork}
          sizes="(max-width: 1024px) 100vw, 500px"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {deployment.points.map((point) => (
            <article key={point.title} className="inv-card h-full">
              <h3 className="inv-h3 text-[15.5px]">{point.title}</h3>
              <p className="inv-body mt-1.5">{point.body}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
