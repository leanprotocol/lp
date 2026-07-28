import { trustBar } from "@/content/innovation";

export function InstitutionalTrustBar() {
  return (
    <div className="inv-section--band mt-14 md:mt-20">
      <div className="inv-wrap py-7 md:py-9">
        <p className="inv-marker mb-5">{trustBar.intro}</p>
        <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustBar.items.map((item) => (
            <li key={item.label} className="border-l-2 pl-4" style={{ borderColor: "var(--inv-blue-bright)" }}>
              <p className="text-[15px] font-semibold" style={{ color: "var(--inv-blue)" }}>
                {item.label}
              </p>
              <p className="inv-small mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
