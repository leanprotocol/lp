import Link from "next/link";
import { company, footer, nav, isVerified } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";

function Row({ label, value }: { label: string; value: string }) {
  const verified = isVerified(value);
  return (
    <div className="flex flex-wrap gap-x-2 text-[13px]">
      <span style={{ color: "var(--inv-muted)" }}>{label}:</span>
      <span
        style={{
          color: verified ? "var(--inv-navy)" : "var(--inv-muted)",
          fontFamily: verified ? undefined : "var(--inv-mono)",
          fontSize: verified ? undefined : "11px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function InstitutionalFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--inv-border)", background: "#fff" }}>
      <div className="inv-wrap py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="w-[132px]">
              <InnovationImage {...innovationAssets.logo} sizes="132px" imgClassName="object-left" />
            </div>
            <p className="mt-4 text-[15px] font-semibold" style={{ color: "var(--inv-blue)" }}>
              {company.legalName}
            </p>
            <div className="mt-3 grid gap-1.5">
              <p className="text-[13px]" style={{ color: "var(--inv-muted)" }}>
                {company.recognition}
              </p>
              <p className="text-[13px]" style={{ color: "var(--inv-muted)" }}>
                {company.structure}
              </p>
              <Row label="CIN" value={company.cin} />
              <Row label="Registered office" value={company.registeredOffice} />
              <Row label="Email" value={company.email} />
              <Row label="Phone" value={company.phone} />
            </div>
          </div>

          <nav aria-label="Innovation sections">
            <p className="inv-marker mb-4">On this page</p>
            <ul className="grid gap-2.5">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[14px]" style={{ color: "var(--inv-navy)" }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="inv-marker mb-4">Company</p>
            <ul className="grid gap-2.5">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[14px]" style={{ color: "var(--inv-navy)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t pt-6" style={{ borderColor: "var(--inv-border)" }}>
          <p className="inv-small max-w-4xl">{footer.disclaimer}</p>
          <p className="inv-small mt-4">
            &copy; {new Date().getFullYear()} {company.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
