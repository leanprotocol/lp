# Makes challenge.leanprotocol.in self-contained.
#
# The rewrite maps /:path* on that host to /challenge/:path*, so the
# subdomain root serves the landing page and /checkout and /unlock work
# without a visible /challenge segment.
#
# Internal ROUTE links therefore have to drop the /challenge prefix, or the
# rewrite turns them into /challenge/challenge/... and they 404.
#
# ASSET paths under /public/challenge/ are NOT touched - those are real
# files on disk and the rewrite does not apply to them.
#
# Consequence: leanprotocol.in/challenge still renders, but its buttons will
# point at /checkout on the main domain, which does not exist. The campaign
# lives on its subdomain only. That was the agreed arrangement.

$routeEdits = @(
  @{ f = "components/challenge/FinalCTA.tsx";        from = 'href="/challenge/unlock"';   to = 'href="/unlock"' },
  @{ f = "components/challenge/Hero.tsx";            from = 'href="/challenge/unlock"';   to = 'href="/unlock"' },
  @{ f = "components/challenge/PlansCarousel.tsx";   from = 'href="/challenge/unlock"';   to = 'href="/unlock"' },
  @{ f = "components/challenge/StickyCTA.tsx";       from = 'href="/challenge/unlock"';   to = 'href="/unlock"' },
  @{ f = "components/challenge/LeadFormSection.tsx"; from = 'href="/challenge/checkout"'; to = 'href="/checkout"' },
  @{ f = "components/challenge/SpinWheel.tsx";       from = '"/challenge/checkout?promo=30%2B15HARD"'; to = '"/checkout?promo=30%2B15HARD"' },
  @{ f = "app/challenge/checkout/page.tsx";          from = 'href="/challenge" className="btn btn-ghost"'; to = 'href="/" className="btn btn-ghost"' },
  @{ f = "app/challenge/unlock/page.tsx";            from = 'window.location.href = "/challenge";'; to = 'window.location.href = "/";' },
  @{ f = "app/challenge/unlock/page.tsx";            from = 'href="/challenge"'; to = 'href="/"' }
)

$n = 0
foreach ($e in $routeEdits) {
  if (-not (Test-Path $e.f)) { Write-Host "  skip (missing): $($e.f)"; continue }
  $t = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes("$PWD\$($e.f)"))
  if (-not $t.Contains($e.from)) { Write-Host "  not found in $($e.f): $($e.from)"; continue }
  $t = $t.Replace($e.from, $e.to)
  [System.IO.File]::WriteAllText("$PWD\$($e.f)", $t, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "  $($e.f)  ->  $($e.to)"
  $n++
}

Write-Host ""
Write-Host "$n of $($routeEdits.Count) route links updated."
Write-Host ""
Write-Host "Remaining /challenge/ references - these should ALL be assets:"
Get-ChildItem "app/challenge","components/challenge" -Recurse -Include "*.tsx" |
  Select-String -Pattern '"/challenge' |
  ForEach-Object { "  " + $_.Path.Replace("$PWD\","").Replace("\","/") + ":" + $_.LineNumber + "  " + $_.Line.Trim() }
