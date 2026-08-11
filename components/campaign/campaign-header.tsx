"use client";

// components/campaign/campaign-header.tsx
import Link from "next/link";
import Image from "next/image";
import { WA_LINK, SUPPORT_PHONE } from "@/content/campaign";
import styles from "./campaign.module.css";

const nav = [
  { label: "Home", href: "/" },
  { label: "Our Why", href: "/our-why" },
  { label: "Plans", href: "#plans", accent: true },
  { label: "Knowledge Hub", href: "/blog" },
];

export function CampaignHeader() {
  return (
    <header className="sticky top-0 z-[70] border-b border-[rgba(249,247,242,0.1)] bg-[rgba(14,14,15,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1360px] items-center gap-4 px-4 py-3 md:gap-7 md:px-7 md:py-[15px]">
        <Link href="/" className="block flex-none">
          <Image
            src="/logo.png"
            alt="Lean Protocol"
            width={150}
            height={38}
            className="h-[44px] w-auto md:h-[54px]"
            priority
          />
        </Link>
        <nav className="ml-auto hidden items-center gap-[26px] text-sm font-bold md:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={
                (n.accent ? "text-[#C8D9A7]" : "text-[#A8BEB7]") +
                " transition-colors hover:text-white"
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={"tel:" + SUPPORT_PHONE}
            aria-label="Call support"
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full border-[1.5px] border-[rgba(249,247,242,0.28)] text-base text-[#F9F7F2] transition-colors hover:border-[#C8D9A7] md:hidden"
          >
            {"\u260E"}
          </a>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none whitespace-nowrap rounded-full bg-[#C8D9A7] px-[18px] py-[10px] text-[13.5px] font-extrabold text-[#193231] transition-colors hover:bg-white md:border-[1.5px] md:border-[rgba(249,247,242,0.28)] md:bg-transparent md:px-6 md:py-3 md:text-sm md:font-bold md:text-[#F9F7F2] md:hover:border-[#C8D9A7] md:hover:bg-transparent md:hover:text-[#C8D9A7]"
          >
            Support
          </a>
        </div>
      </div>
      <div
        className={
          "flex gap-4 overflow-x-auto px-4 pb-[10px] text-[13px] font-bold md:hidden " +
          styles.noScrollbar
        }
      >
        {nav.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className={
              (n.accent ? "text-[#C8D9A7]" : "text-[#A8BEB7]") +
              " whitespace-nowrap"
            }
          >
            {n.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
