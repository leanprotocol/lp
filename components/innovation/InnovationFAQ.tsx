import { ChevronDown } from "lucide-react";
import { faq } from "@/content/innovation";
import { Section, SectionHeading } from "./InnovationUI";

/** Uses native <details> so the accordion works with zero client JavaScript. */
export function InnovationFAQ() {
  return (
    <Section variant="surface">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.headline} />

      <div className="mt-9 grid max-w-3xl gap-3">
        {faq.items.map((item) => (
          <details
            key={item.q}
            className="group overflow-hidden rounded-[12px] border"
            style={{ borderColor: "var(--inv-border)", background: "#fff" }}
          >
            <summary
              className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-medium"
              style={{ color: "var(--inv-blue)" }}
            >
              {item.q}
              <ChevronDown
                size={17}
                aria-hidden
                className="flex-none transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="px-5 pb-5">
              <p className="inv-body">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
