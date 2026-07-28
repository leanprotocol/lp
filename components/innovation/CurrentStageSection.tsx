import { currentStage, isVerified } from "@/content/innovation";
import { Section, SectionHeading, StageChip } from "./InnovationUI";

export function CurrentStageSection() {
  // Metric cards stay hidden until a verified value replaces the placeholder.
  const verifiedMetrics = currentStage.metrics.filter((m) => isVerified(m.value));

  return (
    <Section variant="surface">
      <SectionHeading eyebrow={currentStage.eyebrow} title={currentStage.headline} />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {currentStage.columns.map((col) => (
          <section key={col.title} className="inv-card h-full">
            <StageChip stage={col.stage} />
            <h3 className="inv-h3 mt-4 text-[17px]">{col.title}</h3>
            <ul className="inv-ticks mt-4">
              {col.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {verifiedMetrics.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {verifiedMetrics.map((metric) => (
            <div key={metric.label} className="inv-card text-center">
              <p
                className="inv-num text-[30px] leading-none"
                style={{ color: "var(--inv-blue)" }}
              >
                {metric.value}
              </p>
              <p className="inv-small mt-2">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
