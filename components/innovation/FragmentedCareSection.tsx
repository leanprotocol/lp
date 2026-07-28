import { clinicalGap } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";

/**
 * Shows the supplied fragmentation diagram.
 * A CSS/HTML diagram is always rendered beneath it as the accessible version,
 * so the meaning never depends on text inside an image.
 */
export function FragmentedCareSection() {
  return (
    <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1fr_.85fr] lg:items-center lg:gap-14">
      <InnovationImage
        {...innovationAssets.fragmentedCare}
        sizes="(max-width: 1024px) 100vw, 560px"
      />

      <div>
        <p className="inv-marker mb-4">Where the information sits today</p>
        <ul className="flex flex-wrap gap-2">
          {clinicalGap.diagramNodes.map((node) => (
            <li
              key={node}
              className="rounded-[8px] border px-3 py-2 text-[13.5px] font-medium"
              style={{
                borderColor: "var(--inv-border-strong)",
                background: "#fff",
                color: "var(--inv-navy)",
              }}
            >
              {node}
            </li>
          ))}
        </ul>

        <div
          className="mt-4 rounded-[12px] border border-dashed p-4 text-center"
          style={{ borderColor: "var(--inv-border-strong)", background: "var(--inv-surface)" }}
        >
          <p className="inv-marker" style={{ color: "var(--inv-muted)" }}>
            {clinicalGap.diagramCentre}
          </p>
        </div>
      </div>
    </div>
  );
}
