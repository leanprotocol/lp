import { researchProgramme, isVerified } from "@/content/innovation";
import { Section, SectionHeading, NoteBox, StageChip } from "./InnovationUI";

export function ResearchProgrammeSection() {
  return (
    <Section variant="plain">
      <SectionHeading
        eyebrow={researchProgramme.eyebrow}
        title={researchProgramme.headline}
        chip={<StageChip stage="proposed" />}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
        <div>
          <div
            className="rounded-[14px] border-l-[3px] p-5"
            style={{ borderColor: "var(--inv-blue)", background: "var(--inv-surface)" }}
          >
            <p className="inv-marker mb-2">Project title</p>
            <p className="text-[17px] font-semibold leading-snug" style={{ color: "var(--inv-blue)" }}>
              {researchProgramme.projectTitle}
            </p>
          </div>

          <h3 className="inv-h3 mt-8">Objectives</h3>
          <ol className="mt-4 grid gap-3">
            {researchProgramme.objectives.map((objective, i) => (
              <li key={objective} className="flex gap-3">
                <span
                  className="inv-num mt-[2px] flex h-6 w-6 flex-none items-center justify-center rounded-[6px] text-[12px]"
                  style={{ background: "var(--inv-surface-2)", color: "var(--inv-blue)" }}
                >
                  {i + 1}
                </span>
                <span className="text-[15px]" style={{ color: "var(--inv-navy)" }}>
                  {objective}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-7">
            <NoteBox tone="safe">
              <span className="inv-marker mr-2" style={{ color: "var(--inv-green)" }}>
                Proposed endpoint
              </span>
              {researchProgramme.endpoint}
            </NoteBox>
          </div>
        </div>

        <aside className="inv-card h-fit">
          <p className="inv-marker mb-4">Project information</p>
          <dl className="grid gap-0">
            {researchProgramme.projectInfo.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--inv-border)",
                }}
              >
                <dt className="inv-small">{row.label}</dt>
                <dd
                  className="text-right text-[14px] font-medium"
                  style={{
                    color: isVerified(row.value) ? "var(--inv-navy)" : "var(--inv-muted)",
                    fontFamily: isVerified(row.value) ? undefined : "var(--inv-mono)",
                    fontSize: isVerified(row.value) ? undefined : "11.5px",
                  }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Section>
  );
}
