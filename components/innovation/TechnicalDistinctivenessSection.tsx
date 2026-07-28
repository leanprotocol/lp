import { Utensils, TrendingUp, Eye, RefreshCw, ShieldCheck } from "lucide-react";
import { distinctiveness } from "@/content/innovation";
import { Section, SectionHeading, StageChip } from "./InnovationUI";

const icons = {
  utensils: Utensils,
  trending: TrendingUp,
  eye: Eye,
  refresh: RefreshCw,
  shield: ShieldCheck,
} as const;

export function TechnicalDistinctivenessSection() {
  return (
    <Section variant="surface">
      <SectionHeading
        eyebrow={distinctiveness.eyebrow}
        title={distinctiveness.headline}
        chip={<StageChip stage="proposed" label={distinctiveness.intro} />}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {distinctiveness.cards.map((card) => {
          const Icon = icons[card.icon as keyof typeof icons] ?? ShieldCheck;
          return (
            <article key={card.title} className="inv-card inv-card--raised h-full">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: "var(--inv-surface-2)", color: "var(--inv-blue)" }}
              >
                <Icon size={18} aria-hidden />
              </span>
              <h3 className="inv-h3 mt-4 text-[16.5px]">{card.title}</h3>
              <p className="inv-body mt-2">{card.body}</p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
