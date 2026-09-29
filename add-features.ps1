# Adds the capability grid: content block, styles, and a note of where the
# page sections sit so the component can be dropped in the right place.

$f = "content/psp.ts"
$t = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes("$PWD\$f"))
if ($t -notlike "*export const FEATURES*") {
  if (-not (Test-Path "$PWD\$f.bak")) {
    [System.IO.File]::WriteAllText("$PWD\$f.bak", $t, (New-Object System.Text.UTF8Encoding $false))
  }
  $t += @'

/* Capability grid. The icon key maps to a lucide component in
   components/psp/psp-features.tsx - keep this file free of imports. */
export const FEATURES = {
  label: "WHAT THE PROGRAMME DOES",
  h2: "Everything a patient needs, in one place.",
  intro:
    "Eight capabilities, delivered by our own care team rather than assembled from vendors. Configured per programme, so you take what your therapy needs.",
  items: [
    {
      icon: "enrol",
      title: "Enrolment and consent",
      copy: "Digital consent, identity capture and onboarding, with a record you can audit.",
    },
    {
      icon: "adherence",
      title: "Adherence and persistence",
      copy: "Dose reminders, refill prompts and follow-up calls, with a person behind them.",
    },
    {
      icon: "clinical",
      title: "Doctor and dietitian access",
      copy: "Scheduled consults and on-demand clinical support throughout the therapy.",
    },
    {
      icon: "safety",
      title: "Side-effect management",
      copy: "Early identification, structured triage, and adverse events routed to your safety team.",
    },
    {
      icon: "labs",
      title: "Diagnostics and labs",
      copy: "At-home and in-clinic collection, with results read by our clinical team.",
    },
    {
      icon: "delivery",
      title: "Medicine delivery",
      copy: "Fulfilment coordination through licensed pharmacy partners, on a prescription.",
    },
    {
      icon: "language",
      title: "Multilingual support",
      copy: "Care delivered in the language the patient actually speaks at home.",
    },
    {
      icon: "data",
      title: "Analytics and reporting",
      copy: "Enrolment, engagement, continuity and longitudinal metabolic data in one console.",
    },
  ],
  note:
    "Adverse events identified through the programme are reported to your pharmacovigilance team within agreed timelines.",
};
'@
  [System.IO.File]::WriteAllText("$PWD\$f", $t, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "  ok: FEATURES content"
} else { Write-Host "  FEATURES already present" }

$f = "app/psp/psp.css"
$t = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes("$PWD\$f"))
if ($t -notlike "*psp-feat-grid*") {
  $t += @'

/* ---------- capability grid ---------- */
.psp-page .psp-feat-head { text-align: center; }
.psp-page .psp-feat-head h2,
.psp-page .psp-feat-head p { text-align: center; margin-left: auto; margin-right: auto; }
.psp-page .psp-feat-intro { max-width: 60ch; margin-top: 14px; font-size: 17px; line-height: 1.6; }

.psp-page .psp-feat-grid {
  display: grid; gap: 16px; margin-top: 46px;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
}
@media (min-width: 1060px) {
  .psp-page .psp-feat-grid { grid-template-columns: repeat(4, 1fr); }
}

.psp-page .psp-feat {
  background: #fff; border: 1px solid rgba(28, 43, 34, 0.1);
  border-radius: 20px; padding: 26px 24px 28px;
  transition: transform .25s, border-color .25s, box-shadow .25s;
}
.psp-page .psp-feat:hover {
  transform: translateY(-4px);
  border-color: rgba(45, 90, 78, 0.3);
  box-shadow: 0 16px 36px rgba(25, 50, 49, 0.09);
}
.psp-page .psp-feat-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 50px; height: 50px; border-radius: 14px;
  background: #DCE7C6; color: #2D5A4E; margin-bottom: 18px;
}
.psp-page .psp-feat h3 {
  margin: 0 0 8px; font-size: 17.5px; font-weight: 800; letter-spacing: -0.02em;
}
.psp-page .psp-feat p {
  margin: 0; font-size: 14.5px; line-height: 1.55; color: rgba(28, 43, 34, 0.65);
}
.psp-page .psp-feat-note {
  max-width: 68ch; margin: 34px auto 0; text-align: center;
  font-size: 12.5px; line-height: 1.6; color: rgba(28, 43, 34, 0.5);
}
'@
  [System.IO.File]::WriteAllText("$PWD\$f", $t, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "  ok: grid styles"
} else { Write-Host "  styles already present" }

Write-Host ""
Write-Host "Sections currently on the page - tell Claude which number to sit after:"
Select-String -Path "app/psp/page.tsx" -Pattern "\{/\* -+ \d+\." |
  ForEach-Object { "  " + $_.LineNumber + "  " + $_.Line.Trim() }
