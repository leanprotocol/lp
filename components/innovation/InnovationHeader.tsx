"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { nav, company } from "@/content/innovation";
import { innovationAssets } from "@/content/innovation-assets";
import { InnovationImage } from "./InnovationImage";

export function InnovationHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--inv-border)",
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="inv-wrap flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Link href="/innovation" className="flex items-center gap-3" aria-label={company.legalName}>
          <div className="w-[112px] md:w-[132px]">
            <InnovationImage
              {...innovationAssets.logo}
              priority
              sizes="132px"
              imgClassName="object-left"
            />
          </div>
          <span
            className="hidden border-l pl-3 text-[12px] font-medium sm:inline"
            style={{ borderColor: "var(--inv-border)", color: "var(--inv-muted)" }}
          >
            Innovation
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Innovation sections">
          {nav.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium transition-colors"
              style={{ color: "var(--inv-navy)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={nav.careProgrammesHref}
            className="inline-flex items-center gap-1 text-[13px]"
            style={{ color: "var(--inv-muted)" }}
          >
            {nav.careProgrammesLabel}
            <ArrowUpRight size={13} aria-hidden />
          </Link>
          <a
            href="#collaborate"
            className="inv-btn inv-btn--primary"
            style={{ minHeight: 40, paddingInline: 16, fontSize: 14 }}
          >
            Collaborate
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[9px] border lg:hidden"
          style={{ borderColor: "var(--inv-border-strong)", color: "var(--inv-blue)" }}
          aria-expanded={open}
          aria-controls="innovation-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>

      {open ? (
        <div
          id="innovation-mobile-nav"
          className="border-t lg:hidden"
          style={{ borderColor: "var(--inv-border)", background: "#fff" }}
        >
          <nav className="inv-wrap flex flex-col gap-1 py-3" aria-label="Innovation sections">
            {nav.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-[9px] px-3 text-[15px] font-medium"
                style={{ color: "var(--inv-navy)" }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#collaborate"
              onClick={() => setOpen(false)}
              className="inv-btn inv-btn--primary mt-2 w-full"
            >
              Collaborate
            </a>
            <Link
              href={nav.careProgrammesHref}
              onClick={() => setOpen(false)}
              className="mt-1 flex min-h-[44px] items-center gap-1 px-3 text-[14px]"
              style={{ color: "var(--inv-muted)" }}
            >
              {nav.careProgrammesLabel}
              <ArrowUpRight size={13} aria-hidden />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
