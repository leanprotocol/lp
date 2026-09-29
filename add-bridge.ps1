# Adds a bridge from /workshops to /corporate: a nav link and a full-width
# band before the FAQ, so a reader who wants the longer programme has an
# obvious route rather than a footnote.
#
# Backs up each file first. git checkout <file> also reverts.

function Patch($path, $find, $replace, $label) {
  $t = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes("$PWD\$path"))
  if (-not (Test-Path "$PWD\$path.bak")) {
    [System.IO.File]::WriteAllText("$PWD\$path.bak", $t, (New-Object System.Text.UTF8Encoding $false))
  }
  if (-not $t.Contains($find)) { Write-Host "  ANCHOR NOT FOUND: $label"; return }
  $t = $t.Replace($find, $replace)
  [System.IO.File]::WriteAllText("$PWD\$path", $t, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "  ok: $label"
}

# ---------- 1. content ----------
Patch "content/workshops.ts" @'
/* ---------------- FAQ ---------------- */
'@ @'
/* ---------------- bridge to the full programme ---------------- */

export const bridge = {
  eyebrow: "WHEN A WORKSHOP IS NOT ENOUGH",
  headA: "Education opens the door.",
  headB: "The programme walks through it.",
  body:
    "For employers ready to go further, we run a six-month clinical programme: a full metabolic blood panel for every participating employee, doctor-led care for those who need it, and a second panel at month six that shows what actually changed.",
  points: [
    "Baseline and month-six blood panels, same markers, same labs",
    "Risk-stratified cohorts, not one plan for everyone",
    "Aggregate reporting for HR, with no individual health data",
  ],
  cta: { label: "See the six-month programme", href: "/corporate" },
  note:
    "Most employers start with a workshop and decide afterwards. There is no requirement to commit to the programme to run a session.",
};

/* ---------------- FAQ ---------------- */
'@ "bridge content block"

Patch "content/workshops.ts" @'
  { label: "Partners", href: "#partners" },
'@ @'
  { label: "Partners", href: "#partners" },
  { label: "Full programme", href: "/corporate" },
'@ "nav link"

# ---------- 2. page section ----------
Patch "app/workshops/page.tsx" @'
      {/* ---------------- FAQ ---------------- */}
'@ @'
      {/* ---------------- bridge to /corporate ---------------- */}
      <section className="ws-bridge-wrap">
        <div className="wrap">
          <div className="ws-bridge">
            <div>
              <p className="eyebrow">{W.bridge.eyebrow}</p>
              <h2 className="h" style={{ fontSize: "clamp(26px,3.4vw,44px)" }}>
                {W.bridge.headA}{" "}
                <span className="serif" style={{ color: "#2D5A4E" }}>
                  {W.bridge.headB}
                </span>
              </h2>
              <p className="lede" style={{ maxWidth: "54ch" }}>
                {W.bridge.body}
              </p>

              <ul className="ws-bridge-list">
                {W.bridge.points.map((p) => (
                  <li key={p}>
                    <span aria-hidden className="tick">
                      {TICK}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <a href={W.bridge.cta.href} className="btn btn-ink" style={{ marginTop: 28 }}>
                {W.bridge.cta.label} {"\u2192"}
              </a>

              <p className="fine" style={{ marginTop: 18, maxWidth: "58ch" }}>
                {W.bridge.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
'@ "bridge section"

# ---------- 3. styles ----------
$css = "app/workshops/workshops.css"
$t = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes("$PWD\$css"))
if ($t -notlike "*ws-bridge*") {
  if (-not (Test-Path "$PWD\$css.bak")) {
    [System.IO.File]::WriteAllText("$PWD\$css.bak", $t, (New-Object System.Text.UTF8Encoding $false))
  }
  $t += @'

/* ---------- bridge to /corporate ----------
   Sage wash rather than another white card, so it reads as a change of
   subject and not as one more section of the workshop pitch. */
.corporate-page .ws-bridge-wrap { padding-top: 0; }
.corporate-page .ws-bridge {
  border-radius: 30px;
  padding: clamp(28px, 4vw, 56px);
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(200, 217, 167, 0.5), transparent 62%),
    #EFF2E2;
  border: 1px solid rgba(45, 90, 78, 0.14);
}
.corporate-page .ws-bridge-list {
  list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 10px;
}
.corporate-page .ws-bridge-list li {
  display: flex; gap: 12px; align-items: flex-start;
  font-size: 16px; line-height: 1.5; color: rgba(28, 43, 34, 0.72);
}
.corporate-page .ws-bridge-list .tick {
  background: rgba(45, 90, 78, 0.14); color: #2D5A4E; margin-top: 2px;
}
'@
  [System.IO.File]::WriteAllText("$PWD\$css", $t, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "  ok: bridge styles"
} else { Write-Host "  styles already present" }

Write-Host ""
Select-String -Path "content/workshops.ts","app/workshops/page.tsx","app/workshops/workshops.css" -Pattern "ws-bridge|export const bridge|Full programme" |
  ForEach-Object { "  " + $_.Path.Replace("$PWD\","").Replace("\","/") + ":" + $_.LineNumber }
