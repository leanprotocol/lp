"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  /* The hero is dark at the top, so the bar starts transparent and only
     picks up a background once you have scrolled past it. */
  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setSolid(window.scrollY > 40)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    read()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Close the mobile sheet on navigation, and stop the page scrolling
     underneath it while it is open. */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const links = [
    { label: "Our Why", href: "/our-why" },
    { label: "How it works", href: "/#journey" },
    { label: "Results", href: "/#results" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Experts", href: "/#experts" },
    { label: "Knowledge Hub", href: "/blog" },
  ]

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? "rgba(14,14,15,.92)" : "transparent",
        backdropFilter: solid ? "blur(14px)" : "none",
        borderBottom: solid
          ? "1px solid rgba(249,247,242,.1)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-[73px] max-w-[1180px] items-center justify-between gap-5 px-7">
        <Link href="/" aria-label="Lean Protocol" className="flex-none">
          <img
            src="/logo-cropped.png"
            alt="Lean Protocol"
            className="h-11 w-auto"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 lg:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14.5px] font-semibold text-accent2 transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-[14.5px] font-semibold text-accent2 transition-colors hover:text-accent"
          >
            Log in
          </Link>
          <a
            href="https://forms.leanprotocol.in/"
            className="rounded-full bg-accent px-6 py-3 text-[15px] font-extrabold text-dark transition-colors hover:bg-white"
          >
            Get Started
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="lp-mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-lp-bg/25 text-lp-bg lg:hidden"
        >
          <span aria-hidden className="text-xl leading-none">
            {open ? "\u00D7" : "\u2261"}
          </span>
        </button>
      </div>

      {open && (
        <div
          id="lp-mobile-nav"
          className="border-t border-lp-bg/10 lg:hidden"
          style={{ background: "rgba(14,14,15,.98)", backdropFilter: "blur(14px)" }}
        >
          <nav aria-label="Primary" className="flex flex-col gap-1 px-7 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center text-[16px] font-semibold text-accent2"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex min-h-[48px] items-center text-[16px] font-semibold text-accent2"
            >
              Log in
            </Link>
            <a
              href="https://forms.leanprotocol.in/"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-accent px-6 py-4 text-center text-[16px] font-extrabold text-dark"
            >
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
