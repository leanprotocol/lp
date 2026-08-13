// components/legal/legal-doc.tsx
// Renders a LegalDoc using the same layout the policy pages already use.
// Supports two inline forms inside any text:
//   **bold**
//   [label](/path)  - internal links only, external ones are ignored
//
// Pure ASCII: unicode via \u escapes.

import Link from "next/link";
import { Calendar } from "lucide-react";
import type { Block, LegalDoc } from "@/content/legal/types";

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyBase: string) {
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((part, i) => {
    const k = keyBase + "-" + i;

    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <b key={k}>{bold[1]}</b>;

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const external = /^https?:\/\//.test(href);
      if (external) {
        return (
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D5A4E] underline underline-offset-2 hover:text-[#1F302B]"
          >
            {label}
          </a>
        );
      }
      return (
        <Link
          key={k}
          href={href}
          className="text-[#2D5A4E] underline underline-offset-2 hover:text-[#1F302B]"
        >
          {label}
        </Link>
      );
    }

    return <span key={k}>{part}</span>;
  });
}

function renderBlock(b: Block, key: string) {
  if (b.t === "ul") {
    return (
      <ul key={key} className="mb-4 list-disc space-y-1 pl-2 text-[#57534E]">
        {b.items.map((it, i) => (
          <li key={key + "-" + i} className="ml-3 leading-relaxed">
            {renderInline(it, key + "-" + i)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p key={key} className="mb-4 leading-relaxed text-[#57534E]">
      {renderInline(b.text, key)}
    </p>
  );
}

export function LegalDocPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="min-h-screen bg-[#F6F1EE] px-2 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-t-2xl rounded-t-[2rem] border-b border-white/10 bg-[#1F302B] p-8 text-white md:p-12">
          <h1 className="mb-4 font-serif text-4xl leading-tight md:text-5xl">
            {doc.title}
          </h1>
          <div className="flex items-center gap-2 font-mono text-sm text-[#D6F0E6]/80">
            <Calendar className="h-4 w-4" />
            <span>Last Updated: {doc.lastUpdated}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-b-2xl rounded-b-[2rem] border border-[#1F302B]/5 bg-white">
          <div className="space-y-10 p-4 md:p-12">
            {doc.intro.length > 0 && (
              <div className="prose max-w-none">
                {doc.intro.map((b, i) => renderBlock(b, "intro-" + i))}
              </div>
            )}

            {doc.intro.length > 0 && (
              <div className="h-px w-full bg-[#E5E5E5]" />
            )}

            {doc.sections.map((s, si) => (
              <section key={"s" + si}>
                <h2 className="mb-4 font-serif text-2xl text-[#1F302B]">
                  {s.heading}
                </h2>
                {s.blocks.map((b, bi) => renderBlock(b, "s" + si + "-" + bi))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
