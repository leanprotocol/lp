"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

/* Clarity's terms bar it from pages that collect health data, so it does not
   load on the funnel subdomains, on pages that ask health questions or take
   payment, or on the internal lead dashboards. Every other page keeps it.
   Masking is also set to Strict in the Clarity dashboard as a second layer.
   Add a path here before launching any new page that asks health questions. */
const NO_CLARITY_HOSTS = ["forms.", "pro.", "challenge."]
const NO_CLARITY_PATHS = [
  "/users",
  "/talk-to-health-coach",
  "/course-quiz",
  "/pro",
  "/challenge",
  "/dashboard",
  "/bg-dashboard",
  "/team-leads",
  /* added 13 Nov 2026: pages that ask for weight, height or conditions */
  "/start",
  "/quiz",
  "/bmi-calculator",
  "/bmr-calculator",
  "/waist-to-hip-calculator",
]

export function clarityAllowed(host: string, path: string): boolean {
  const h = host.toLowerCase()
  if (NO_CLARITY_HOSTS.some((p) => h.startsWith(p))) return false
  return !NO_CLARITY_PATHS.some((p) => path === p || path.startsWith(p + "/"))
}

export function ClarityInit({ projectId }: { projectId: string }) {
  useEffect(() => {
    if (!clarityAllowed(window.location.hostname, window.location.pathname)) return
    Clarity.init(projectId)
  }, [projectId])

  return null
}
