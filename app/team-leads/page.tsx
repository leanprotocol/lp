"use client";

/* Main marketing team lead dashboard. Live from TeleCRM via
   /api/team-dashboard/data, refreshed every 30 seconds. Shows paid leads from
   Meta, Google and ChatGPT, excluding "BG" campaigns (the BG team's own
   dashboard is at /bg-dashboard).

   Drawn as a fixed full-screen layer so the main site's header and footer
   never show here. Pure ASCII file: symbols are \u escapes. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Lead = {
  id: string;
  name: string;
  channel: string;
  keyword: string;
  createdOn: number;
  modifiedOn: number;
  status: string;
  lostReason: string;
  assignee: string;
  campaign: string;
  adSet: string;
  ad: string;
  repeats: number;
  phoneTail: string;
};

type Payload = { syncedAt: number; stale: boolean; leads: Lead[] };

type Activity = {
  id: string;
  at: number;
  kind: "note" | "call" | "assign";
  by: string;
  title: string;
  text: string;
  duration?: number;
  truncated?: boolean;
};

const POLL_MS = 30_000;
const DASH = "\u2014";

const RANGES = [
  { key: "today", label: "Today", days: 0 },
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "all", label: "All time", days: -1 },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];

const istDay = (ms: number) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const fmtWhen = (ms: number) =>
  ms
    ? new Date(ms).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : DASH;

function ago(ms: number, now: number) {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/* Statuses callers set when a lead is confirmed as a fit. Compared without
   regard to case or surrounding spaces. Agreed 7 Oct 2026; add "contacted"
   here if the team decides that counts too. */
const QUALIFIED_STATUSES = ["qualified", "interested"];

/* Lead-list tabs. "Converted" is a status the team is adding in TeleCRM
   (7 Oct 2026); until a caller uses it, that tab is empty. Statuses are
   compared without regard to case or surrounding spaces. */
const LIST_TABS = [
  { key: "all", label: "All", statuses: [] as string[] },
  { key: "interested", label: "Interested", statuses: ["interested"] },
  { key: "converted", label: "Converted", statuses: ["converted"] },
] as const;
type ListTab = (typeof LIST_TABS)[number]["key"];
const inTab = (l: { status: string }, tab: ListTab) => {
  const t = LIST_TABS.find((x) => x.key === tab);
  return !t || !t.statuses.length || (t.statuses as readonly string[]).includes(l.status.trim().toLowerCase());
};

type Kind = "fresh" | "open" | "qual" | "won" | "lost";
function kindOf(status: string): Kind {
  const t = status.trim().toLowerCase();
  if (t === "lost") return "lost";
  if (QUALIFIED_STATUSES.includes(t)) return "qual";
  if (/won|convert|paid|enrol/.test(t)) return "won";
  if (t === "" || t === "fresh" || t === "new") return "fresh";
  return "open";
}

const pct = (a: number, b: number) => (b ? Math.round((a * 100) / b) : 0);

type Row = { name: string; total: number; fresh: number; open: number; qual: number; won: number; lost: number };
function groupRows(leads: Lead[], key: (l: Lead) => string): Row[] {
  const m = new Map<string, Row>();
  for (const l of leads) {
    const name = key(l) || "(not set)";
    const r = m.get(name) || { name, total: 0, fresh: 0, open: 0, qual: 0, won: 0, lost: 0 };
    r.total += 1;
    r[kindOf(l.status)] += 1;
    m.set(name, r);
  }
  return Array.from(m.values()).sort((a, b) => b.total - a.total);
}

const CSS = `
.bgd{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:#F9F7F2;color:#1C2B22;
  font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif;font-size:14.5px;line-height:1.5;-webkit-font-smoothing:antialiased}
.bgd *{box-sizing:border-box}
.bgd .serif{font-family:var(--font-serif,"Libre Baskerville"),"Libre Baskerville",Georgia,serif;font-style:italic;font-weight:400}
.bgd-in{max-width:1200px;margin:0 auto;padding:0 20px}
@media (min-width:720px){.bgd-in{padding:0 32px}}
.bgd button:focus-visible,.bgd input:focus-visible{outline:2px solid #C8D9A7;outline-offset:3px}

/* dark band */
.bgd-band{background:#193231;color:#F9F7F2;padding:18px 0 88px;padding-top:calc(18px + env(safe-area-inset-top,0px))}
.bgd-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:clamp(28px,5vh,52px)}
.bgd-brand{font-weight:800;letter-spacing:-.01em;font-size:15px}
.bgd-brand span{color:#A8BEB7;font-weight:600;margin-left:8px}
.bgd-eyebrow{font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#C8D9A7;margin:0 0 12px}
.bgd-h1{font-size:clamp(32px,5vw,58px);font-weight:800;letter-spacing:-.035em;line-height:1.04;margin:0;max-width:16ch}
.bgd-h1 .serif{color:#C8D9A7}
.bgd-bar-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin:26px 0 30px}
.bgd-live{display:inline-flex;align-items:center;gap:10px;color:#A8BEB7;font-weight:600}
.bgd-dot{position:relative;width:9px;height:9px;border-radius:50%;background:#C8D9A7;flex:none}
.bgd-dot::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:2px solid #C8D9A7;opacity:0;animation:bgdPulse 2.4s ease-out infinite}
.bgd-dot.stale{background:#C9A84C}.bgd-dot.stale::after{display:none}
@keyframes bgdPulse{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.6);opacity:0}}
.bgd-pills{display:inline-flex;gap:4px;padding:4px;border-radius:999px;background:rgba(249,247,242,.08);border:1px solid rgba(249,247,242,.14)}
.bgd-pills button{white-space:nowrap;border:0;background:transparent;color:#A8BEB7;padding:8px 16px;border-radius:999px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer;transition:background .2s,color .2s}
.bgd-pills button[aria-pressed=true]{background:#C8D9A7;color:#193231}
.bgd-ghost{border:1.5px solid rgba(249,247,242,.22);background:transparent;color:#F9F7F2;border-radius:999px;padding:9px 18px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer}
.bgd-ghost:hover{border-color:#C8D9A7}
.bgd-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border-top:1px solid rgba(249,247,242,.14)}
.bgd-kpi{padding:22px 18px 4px 0}
.bgd-kpi+.bgd-kpi{padding-left:22px;border-left:1px solid rgba(249,247,242,.14)}
.bgd-kpi-n{font-size:clamp(34px,4.6vw,56px);font-weight:800;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.bgd-kpi-l{font-weight:700;margin-top:8px}
.bgd-kpi-x{color:#A8BEB7;font-size:13px;margin-top:2px}
.bgd-ribbon{display:flex;height:10px;border-radius:999px;overflow:hidden;background:rgba(249,247,242,.1);margin-top:26px}
.bgd-ribbon span{height:100%;transition:width .6s cubic-bezier(.2,.7,.2,1)}
.bgd-legend{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px;font-size:12.5px;color:#A8BEB7}
.bgd-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:0}

/* cream body laps over the band */
.bgd-body{position:relative;background:#F9F7F2;border-radius:44px 44px 0 0;margin-top:-44px;padding:40px 0 70px}
.bgd-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(0,1fr);gap:18px;margin-bottom:18px}
.bgd-card{min-width:0;background:#fff;border:1px solid rgba(28,43,34,.1);border-radius:22px;padding:24px 26px;box-shadow:0 12px 34px rgba(25,50,49,.06)}
.bgd-card-h{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:0 0 16px}
.bgd-h2{font-size:19px;font-weight:800;letter-spacing:-.02em;margin:0}
.bgd-h2 .serif{color:#2D5A4E}
.bgd-hint{font-size:12.5px;color:rgba(28,43,34,.5)}
.bgd-scroll{overflow-x:auto;margin:0 -4px;padding:0 4px}
.bgd table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.bgd th{text-align:left;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:rgba(28,43,34,.45);font-weight:700;padding:0 12px 10px 0;white-space:nowrap}
.bgd td{padding:12px 12px 12px 0;border-top:1px solid rgba(28,43,34,.08);vertical-align:middle}
.bgd td.n,.bgd th.n{text-align:right}
.bgd-strong{font-weight:700}
.bgd-name{max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bgd-full{min-width:200px;max-width:300px;white-space:normal;overflow-wrap:anywhere;line-height:1.4}
.bgd-mix{display:flex;height:6px;border-radius:999px;overflow:hidden;background:rgba(28,43,34,.07);margin-top:7px;min-width:90px}
.bgd-mix span{display:block;height:100%}
.k-won{background:#2D5A4E}.k-qual{background:#8DB36B}.k-open{background:#C9A84C}.k-fresh{background:#A8BEB7}.k-lost{background:#B3402F}
.bgd-tabs{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:999px;background:rgba(28,43,34,.06);margin:0 0 14px}
.bgd-tabs button{border:0;background:transparent;padding:7px 14px;border-radius:999px;font:inherit;font-weight:700;font-size:13px;color:rgba(28,43,34,.6);cursor:pointer;white-space:nowrap}
.bgd-tabs button[aria-pressed=true]{background:#193231;color:#F9F7F2}
.bgd-tabs b{display:inline-block;min-width:20px;margin-left:6px;padding:0 6px;border-radius:999px;background:rgba(28,43,34,.1);font-size:11.5px;text-align:center}
.bgd-tabs button[aria-pressed=true] b{background:rgba(249,247,242,.18)}
.bgd-qrate{display:inline-block;min-width:44px;text-align:center;padding:2px 9px;border-radius:999px;font-weight:700;font-size:12.5px;background:rgba(141,179,107,.2);color:#3F6B2A}
.bgd-rate{display:inline-block;min-width:44px;text-align:center;padding:2px 9px;border-radius:999px;font-weight:700;font-size:12.5px}
.r-ok{background:rgba(45,90,78,.1);color:#2D5A4E}.r-mid{background:rgba(201,168,76,.16);color:#8A6E22}.r-bad{background:rgba(179,64,47,.1);color:#B3402F}

.bgd-reason{margin:0 0 14px}
.bgd-reason-top{display:flex;justify-content:space-between;gap:10px;font-weight:600;margin-bottom:6px}
.bgd-reason-top b{font-variant-numeric:tabular-nums}
.bgd-track{height:8px;border-radius:999px;background:rgba(28,43,34,.07);overflow:hidden}
.bgd-track span{display:block;height:100%;border-radius:999px;background:#B3402F;opacity:.85}

.bgd-days{display:flex;align-items:flex-end;gap:5px;height:150px}
.bgd-day{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;min-width:0}
.bgd-day b{display:block;width:100%;max-width:30px;background:#2D5A4E;border-radius:8px 8px 3px 3px;min-height:3px}
.bgd-day.today b{background:#C8D9A7;box-shadow:inset 0 0 0 1.5px #2D5A4E}
.bgd-day em{font-style:normal;font-size:11.5px;font-weight:800;margin-bottom:4px}
.bgd-day small{font-size:10.5px;color:rgba(28,43,34,.45);margin-top:7px;white-space:nowrap}

.bgd-avatar{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#C8D9A7;color:#193231;font-size:11.5px;font-weight:800;margin-right:10px;flex:none}
.bgd-who{display:flex;align-items:center}

.bgd-chip{display:inline-block;padding:4px 11px;border-radius:999px;font-weight:700;font-size:12.5px;white-space:nowrap}
.c-fresh{background:rgba(168,190,183,.28);color:#3E5751}.c-open{background:rgba(201,168,76,.16);color:#8A6E22}
.c-won{background:#2D5A4E;color:#F9F7F2}.c-qual{background:rgba(141,179,107,.22);color:#3F6B2A}.c-lost{background:rgba(179,64,47,.1);color:#B3402F}
.bgd-why{display:block;color:rgba(28,43,34,.55);font-size:12.5px;margin-top:4px}
.bgd tr.changed td{background:rgba(200,217,167,.28)}
.bgd tr.changed td:first-child{box-shadow:inset 3px 0 0 #2D5A4E}
.bgd-muted{color:rgba(28,43,34,.5)}
.bgd-note{color:rgba(28,43,34,.5);font-size:12px;line-height:1.6;margin:16px 0 0}
.bgd-empty{padding:34px 10px;text-align:center;color:rgba(28,43,34,.5)}

/* login: dark stage, cream card - same as /users */
.bgd-stage{min-height:100%;background:#193231;display:flex;align-items:center;justify-content:center;padding:24px}
.bgd-login{width:100%;max-width:400px;background:#F9F7F2;border-radius:28px;padding:34px 30px;box-shadow:0 30px 80px rgba(0,0,0,.25)}
.bgd-login h1{font-size:32px;font-weight:800;letter-spacing:-.035em;line-height:1.05;margin:0 0 8px}
.bgd-login h1 .serif{color:#2D5A4E}
.bgd-login p{color:rgba(28,43,34,.6);margin:0 0 22px}
.bgd-login input{width:100%;padding:15px 18px;border:1.5px solid rgba(28,43,34,.14);border-radius:16px;font:inherit;background:#fff;margin-bottom:12px}
.bgd-login input:focus-visible{outline:2px solid #2D5A4E;outline-offset:2px}
.bgd-ink{width:100%;border:0;border-radius:999px;background:#193231;color:#F9F7F2;padding:15px 20px;font:inherit;font-weight:800;font-size:15.5px;cursor:pointer}
.bgd-ink:disabled{opacity:.6;cursor:default}
.bgd-err{color:#B3402F;font-size:13px;margin:12px 0 0}

@media (max-width:900px){.bgd-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:720px){
  .bgd-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
  .bgd-kpi+.bgd-kpi{padding-left:0;border-left:0}
  .bgd-kpi:nth-child(even){padding-left:22px;border-left:1px solid rgba(249,247,242,.14)}
  .bgd-kpi:nth-child(n+3){border-top:1px solid rgba(249,247,242,.14);margin-top:14px}
  .bgd-card{padding:20px 18px;border-radius:20px}
  .bgd-body{border-radius:30px 30px 0 0;margin-top:-30px}
  .bgd-pills button{padding:8px 11px}
  .bgd-name{max-width:170px}
  .bgd-full{min-width:160px}
  .bgd-days.many em{display:none}
}

/* lead panel */
.bgd-link{display:block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:0;background:none;padding:0;
  font:inherit;font-weight:700;color:#1C2B22;cursor:pointer;text-align:left;text-decoration:underline;
  text-decoration-color:rgba(45,90,78,.35);text-underline-offset:3px}
.bgd-link:hover{color:#2D5A4E;text-decoration-color:#2D5A4E}
.bgd tbody tr.click{cursor:pointer}
.bgd tbody tr.click:hover td{background:rgba(200,217,167,.16)}
.bgd-scrim{position:fixed;inset:0;background:rgba(14,20,17,.42);z-index:2147483001;animation:bgdFade .2s both}
.bgd-panel{position:fixed;top:0;right:0;bottom:0;width:min(460px,100%);background:#F9F7F2;z-index:2147483002;
  display:flex;flex-direction:column;box-shadow:-24px 0 60px rgba(14,20,17,.25);animation:bgdSlide .28s cubic-bezier(.2,.7,.2,1) both}
.bgd-panel-head{background:#193231;color:#F9F7F2;padding:20px 24px 22px;padding-top:calc(20px + env(safe-area-inset-top,0px))}
.bgd-panel-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}
.bgd-panel-head h2{font-size:26px;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:0 0 10px;word-break:break-word}
.bgd-panel-meta{color:#A8BEB7;font-size:13px;margin-top:10px;line-height:1.55}
.bgd-panel-meta b{color:#F9F7F2;font-weight:600}
.bgd-tl{list-style:none;margin:0;padding:22px 24px calc(40px + env(safe-area-inset-bottom,0px));overflow:auto;flex:1}
.bgd-tl li{position:relative;padding:0 0 20px 28px}
.bgd-tl li::before{content:"";position:absolute;left:5px;top:18px;bottom:-2px;border-left:2px solid rgba(28,43,34,.1)}
.bgd-tl li:last-child::before{display:none}
.bgd-tl-dot{position:absolute;left:0;top:4px;width:12px;height:12px;border-radius:50%;box-shadow:0 0 0 4px #F9F7F2}
.d-note{background:#2D5A4E}.d-call{background:#C9A84C}.d-assign{background:#A8BEB7}
.bgd-tl-row{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.bgd-tl-title{font-weight:800}
.bgd-tl-when{font-size:12px;color:rgba(28,43,34,.5);white-space:nowrap}
.bgd-tl-by{font-size:12.5px;color:rgba(28,43,34,.55);margin-top:1px}
.bgd-tl-text{background:#fff;border:1px solid rgba(28,43,34,.1);border-radius:14px;padding:12px 14px;margin-top:8px;
  white-space:pre-wrap;word-break:break-word;line-height:1.55}
.bgd-tl-text.note{border-left:3px solid #2D5A4E}
.bgd-sum{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.bgd-sum span{background:rgba(249,247,242,.1);border:1px solid rgba(249,247,242,.16);border-radius:999px;padding:4px 11px;font-size:12.5px;font-weight:700;color:#C8D9A7}
@keyframes bgdSlide{from{transform:translateX(36px);opacity:0}to{transform:none;opacity:1}}
@keyframes bgdFade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.bgd-dot::after{animation:none;display:none}.bgd-ribbon span,.bgd-pills button{transition:none}.bgd-panel,.bgd-scrim{animation:none}}
`;

function Chip({ status }: { status: string }) {
  return <span className={`bgd-chip c-${kindOf(status)}`}>{status}</span>;
}

function Mix({ r }: { r: Row }) {
  const parts: [Kind, number][] = [["won", r.won], ["qual", r.qual], ["open", r.open], ["fresh", r.fresh], ["lost", r.lost]];
  return (
    <div className="bgd-mix" aria-hidden="true">
      {parts.map(([k, n]) => (n ? <span key={k} className={`k-${k}`} style={{ width: `${(n * 100) / r.total}%` }} /> : null))}
    </div>
  );
}

function QRate({ q, total }: { q: number; total: number }) {
  return <span className="bgd-qrate">{pct(q, total)}%</span>;
}

function Rate({ lost, total }: { lost: number; total: number }) {
  const p = pct(lost, total);
  const cls = p >= 50 ? "r-bad" : p >= 25 ? "r-mid" : "r-ok";
  return <span className={`bgd-rate ${cls}`}>{p}%</span>;
}

function fmtDur(sec: number) {
  if (!sec) return "Not connected";
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return m ? `${m} min ${r} s` : `${r} s`;
}

function initials(name: string) {
  const parts = name.replace(/[^A-Za-z ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function LeadPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [items, setItems] = useState<Activity[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const fetchIt = useCallback(async () => {
    setErr(null);
    try {
      const r = await fetch(`/api/team-dashboard/activity?id=${encodeURIComponent(lead.id)}`, { cache: "no-store" });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d) throw new Error(d?.error || "Could not load notes");
      setItems(d.items as Activity[]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load notes");
    }
  }, [lead.id]);

  useEffect(() => { setItems(null); fetchIt(); }, [fetchIt]);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const notes = items ? items.filter((i) => i.kind === "note").length : 0;
  const calls = items ? items.filter((i) => i.kind === "call").length : 0;
  const talk = items ? items.reduce((n, i) => n + (i.kind === "call" ? i.duration || 0 : 0), 0) : 0;

  return (
    <>
      <div className="bgd-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="bgd-panel" role="dialog" aria-modal="true" aria-label={`Notes for ${lead.name || "lead"}`}>
        <div className="bgd-panel-head">
          <div className="bgd-panel-top">
            <span className="bgd-eyebrow" style={{ margin: 0 }}>Lead history</span>
            <span style={{ display: "flex", gap: 8 }}>
              <button type="button" className="bgd-ghost" onClick={fetchIt}>Reload</button>
              <button type="button" className="bgd-ghost" onClick={onClose} ref={closeRef}>Close</button>
            </span>
          </div>
          <h2>{lead.name || "Unnamed lead"}</h2>
          <Chip status={lead.status} />
          {lead.lostReason && <span style={{ marginLeft: 8, color: "#A8BEB7", fontSize: 13 }}>{lead.lostReason}</span>}
          <div className="bgd-panel-meta">
            Came in <b>{fmtWhen(lead.createdOn)}</b>, caller <b>{lead.assignee}</b>
            <br />
            {lead.campaign}{lead.ad ? `, ad: ${lead.ad}` : ""}
          </div>
          {items && (
            <div className="bgd-sum">
              <span>{notes} {notes === 1 ? "note" : "notes"}</span>
              <span>{calls} {calls === 1 ? "call" : "calls"}</span>
              {talk > 0 && <span>{fmtDur(talk)} talk time</span>}
            </div>
          )}
        </div>

        <ol className="bgd-tl">
          {err && <li style={{ paddingLeft: 0 }}><p className="bgd-err" role="alert">{err}</p></li>}
          {!err && !items && <li style={{ paddingLeft: 0 }} className="bgd-muted">Loading notes from TeleCRM...</li>}
          {items && !items.length && <li style={{ paddingLeft: 0 }} className="bgd-muted">No notes or calls on this lead yet.</li>}
          {items && items.map((i) => (
            <li key={i.id}>
              <span className={`bgd-tl-dot d-${i.kind}`} aria-hidden="true" />
              <div className="bgd-tl-row">
                <span className="bgd-tl-title">
                  {i.title}
                  {i.kind === "call" && <span style={{ fontWeight: 600, color: "rgba(28,43,34,.55)" }}>{`, ${fmtDur(i.duration || 0)}`}</span>}
                </span>
                <span className="bgd-tl-when">{fmtWhen(i.at)}</span>
              </div>
              <div className="bgd-tl-by">by {i.by}</div>
              {i.text && <div className={`bgd-tl-text${i.kind === "note" ? " note" : ""}`}>{i.text}</div>}
              {i.truncated && <div className="bgd-tl-by">Shortened by TeleCRM. Open the lead there for the full note.</div>}
            </li>
          ))}
        </ol>
      </aside>
    </>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function go() {
    if (!pw || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/team-dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || "Could not sign in");
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="bgd-stage">
      <div className="bgd-login">
        <h1>Campaign <span className="serif">leads.</span></h1>
        <p>Live from TeleCRM. Sign in with the team password.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") go(); }}
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          autoFocus
        />
        <button type="button" className="bgd-ink" onClick={go} disabled={busy || !pw}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
        {err && <p className="bgd-err" role="alert">{err}</p>}
      </div>
    </div>
  );
}

export default function BgDashboard() {
  const [auth, setAuth] = useState<"checking" | "login" | "ok">("checking");
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("30d");
  const [channel, setChannel] = useState<string>("All");
  const [shown, setShown] = useState(200);
  const [tab, setTab] = useState<ListTab>("all");
  const [now, setNow] = useState(() => Date.now());
  const [changed, setChanged] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const closePanel = useCallback(() => setOpenId(null), []);
  const prev = useRef<Map<string, string> | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/team-dashboard/data", { cache: "no-store" });
      if (r.status === 401) { setAuth("login"); return; }
      const d = await r.json().catch(() => null);
      if (!r.ok || !d) throw new Error(d?.error || "Could not load leads");
      const p = d as Payload;
      // Rows whose status changed since the last refresh get a tint for one cycle.
      const before = prev.current;
      const next = new Map(p.leads.map((l) => [l.id, `${l.status}|${l.lostReason}|${l.assignee}`]));
      if (before) {
        const c = new Set<string>();
        next.forEach((v, id) => { if (before.has(id) && before.get(id) !== v) c.add(id); else if (!before.has(id)) c.add(id); });
        setChanged(c);
      }
      prev.current = next;
      setData(p);
      setError(null);
      setAuth("ok");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load leads");
      setAuth((a) => (a === "checking" ? "ok" : a));
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (auth !== "ok") return;
    const id = window.setInterval(() => { if (!document.hidden) load(); }, POLL_MS);
    const onVis = () => { if (!document.hidden) load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [auth, load]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  async function signOut() {
    await fetch("/api/team-dashboard/login", { method: "DELETE" }).catch(() => {});
    prev.current = null;
    setData(null);
    setAuth("login");
  }

  const r = RANGES.find((x) => x.key === range)!;
  const scoped = useMemo(
    () => (data?.leads || []).filter((l) => channel === "All" || l.channel === channel),
    [data, channel]
  );
  const leads = useMemo(() => {
    const all = scoped;
    if (r.days < 0) return all;
    if (r.days === 0) { const today = istDay(Date.now()); return all.filter((l) => istDay(l.createdOn) === today); }
    const from = Date.now() - r.days * 86_400_000;
    return all.filter((l) => l.createdOn >= from);
  }, [scoped, r]);

  const listLeads = useMemo(() => leads.filter((l) => inTab(l, tab)), [leads, tab]);
  const tabCount = (k: ListTab) => (k === "all" ? leads.length : leads.filter((l) => inTab(l, k)).length);

  const totals = useMemo(() => groupRows(leads, () => "all")[0] || { name: "all", total: 0, fresh: 0, open: 0, qual: 0, won: 0, lost: 0 }, [leads]);
  const campaigns = useMemo(() => groupRows(leads, (l) => l.campaign), [leads]);
  const ads = useMemo(() => groupRows(leads, (l) => l.ad), [leads]);
  const channels = useMemo(() => groupRows(leads, (l) => l.channel), [leads]);
  const keywords = useMemo(() => groupRows(leads.filter((l) => l.channel === "Google"), (l) => l.keyword).slice(0, 12), [leads]);
  const callers = useMemo(() => groupRows(leads, (l) => l.assignee), [leads]);
  const reasons = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of leads) if (kindOf(l.status) === "lost") m.set(l.lostReason || "No reason given", (m.get(l.lostReason || "No reason given") || 0) + 1);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [leads]);
  const days = useMemo(() => {
    const n = r.days <= 0 ? (r.days === 0 ? 7 : 30) : Math.min(30, r.days);
    const counts = new Map<string, number>();
    for (const l of scoped) counts.set(istDay(l.createdOn), (counts.get(istDay(l.createdOn)) || 0) + 1);
    return Array.from({ length: n }, (_, i) => {
      const ms = Date.now() - (n - 1 - i) * 86_400_000;
      const key = istDay(ms);
      return { key, n: counts.get(key) || 0, label: new Date(ms).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }) };
    });
  }, [scoped, r]);
  const maxDay = Math.max(1, ...days.map((d) => d.n));
  const maxReason = Math.max(1, ...reasons.map(([, n]) => n));

  return (
    <div className="bgd">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {auth === "login" && <Login onDone={() => { setAuth("checking"); load(); }} />}
      {auth === "checking" && <div className="bgd-empty">Loading...</div>}

      {auth === "ok" && (
        <>
          <section className="bgd-band">
            <div className="bgd-in">
              <div className="bgd-nav">
                <div className="bgd-brand">Lean Protocol<span>Marketing team</span></div>
                <button type="button" className="bgd-ghost" onClick={signOut}>Sign out</button>
              </div>

              <p className="bgd-eyebrow">Meta, Google and ChatGPT</p>
              <h1 className="bgd-h1">Every lead, <span className="serif">as your callers mark it.</span></h1>

              <div className="bgd-bar-row">
                <span className="bgd-live" aria-live="polite">
                  <span className={`bgd-dot${data?.stale || error ? " stale" : ""}`} aria-hidden="true" />
                  {data
                    ? data.stale || error
                      ? `TeleCRM is not responding. Showing data from ${ago(data.syncedAt, now)}.`
                      : `Live from TeleCRM, updated ${ago(data.syncedAt, now)}`
                    : error || "Loading..."}
                </span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <div className="bgd-pills" role="group" aria-label="Channel">
                    {["All", "Meta", "Google", "ChatGPT"].map((c) => (
                      <button key={c} type="button" aria-pressed={channel === c} onClick={() => { setChannel(c); setShown(200); }}>{c}</button>
                    ))}
                  </div>
                  <div className="bgd-pills" role="group" aria-label="Date range">
                    {RANGES.map((x) => (
                      <button key={x.key} type="button" aria-pressed={range === x.key} onClick={() => { setRange(x.key); setShown(200); }}>{x.label}</button>
                    ))}
                  </div>
                  <button type="button" className="bgd-ghost" onClick={load}>Refresh</button>
                </div>
              </div>

              <div className="bgd-kpis">
                <div className="bgd-kpi">
                  <div className="bgd-kpi-n">{totals.total}</div>
                  <div className="bgd-kpi-l">Leads</div>
                  <div className="bgd-kpi-x">{r.label}</div>
                </div>
                <div className="bgd-kpi">
                  <div className="bgd-kpi-n" style={{ color: "#C8D9A7" }}>{totals.qual}</div>
                  <div className="bgd-kpi-l">Qualified</div>
                  <div className="bgd-kpi-x">
                    {pct(totals.qual, totals.total)}% of leads, {pct(totals.qual, totals.total - totals.fresh)}% of called
                  </div>
                </div>
                <div className="bgd-kpi">
                  <div className="bgd-kpi-n">{totals.fresh}</div>
                  <div className="bgd-kpi-l">Not called yet</div>
                  <div className="bgd-kpi-x">{pct(totals.fresh, totals.total)}% of leads</div>
                </div>
                <div className="bgd-kpi">
                  <div className="bgd-kpi-n">{totals.open + totals.qual + totals.won}</div>
                  <div className="bgd-kpi-l">Being worked</div>
                  <div className="bgd-kpi-x">{totals.won ? `${totals.won} converted` : `${pct(totals.open, totals.total)}% of leads`}</div>
                </div>
                <div className="bgd-kpi">
                  <div className="bgd-kpi-n">{totals.lost}</div>
                  <div className="bgd-kpi-l">Lost</div>
                  <div className="bgd-kpi-x">{pct(totals.lost, totals.total)}% of leads</div>
                </div>
              </div>

              <div className="bgd-ribbon" role="img" aria-label={`${totals.won} converted, ${totals.qual} qualified, ${totals.open} in progress, ${totals.fresh} not called, ${totals.lost} lost`}>
                {([["won", totals.won], ["qual", totals.qual], ["open", totals.open], ["fresh", totals.fresh], ["lost", totals.lost]] as [Kind, number][]).map(([k, n]) =>
                  n ? <span key={k} className={`k-${k}`} style={{ width: `${(n * 100) / Math.max(1, totals.total)}%` }} /> : null
                )}
              </div>
              <div className="bgd-legend">
                <span><i className="k-won" />Converted</span>
                <span><i className="k-qual" />Qualified</span>
                <span><i className="k-open" />In progress</span>
                <span><i className="k-fresh" />Not called</span>
                <span><i className="k-lost" />Lost</span>
              </div>
            </div>
          </section>

          <section className="bgd-body">
            <div className="bgd-in">
              <div className="bgd-grid">
                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">By <span className="serif">campaign</span></h2>
                    <span className="bgd-hint">Bar shows status mix</span>
                  </div>
                  {campaigns.length ? (
                    <div className="bgd-scroll">
                      <table>
                        <thead><tr><th>Campaign</th><th className="n">Leads</th><th className="n">Qualified</th><th className="n">Qual. rate</th><th className="n">Lost rate</th></tr></thead>
                        <tbody>
                          {campaigns.map((c) => (
                            <tr key={c.name}>
                              <td><div className="bgd-full bgd-strong" style={{ maxWidth: 420 }}>{c.name}</div><Mix r={c} /></td>
                              <td className="n bgd-strong">{c.total}</td>
                              <td className="n">{c.qual}</td>
                              <td className="n"><QRate q={c.qual} total={c.total} /></td>
                              <td className="n"><Rate lost={c.lost} total={c.total} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : <div className="bgd-empty">No leads in this period.</div>}
                </div>

                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">Why leads were <span className="serif">lost</span></h2>
                  </div>
                  {reasons.length ? reasons.map(([why, n]) => (
                    <div className="bgd-reason" key={why}>
                      <div className="bgd-reason-top"><span>{why}</span><b>{n}</b></div>
                      <div className="bgd-track"><span style={{ width: `${(n * 100) / maxReason}%` }} /></div>
                    </div>
                  )) : <div className="bgd-empty">No lost leads in this period.</div>}
                  <p className="bgd-note">As marked by the caller in TeleCRM.</p>
                </div>
              </div>

              <div className="bgd-grid">
                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">Leads per <span className="serif">day</span></h2>
                    <span className="bgd-hint">India time</span>
                  </div>
                  <div className={`bgd-days${days.length > 14 ? " many" : ""}`} role="img" aria-label="Leads per day">
                    {days.map((d, i) => (
                      <div className={`bgd-day${i === days.length - 1 ? " today" : ""}`} key={d.key} title={`${d.label}: ${d.n}`}>
                        {d.n > 0 && <em>{d.n}</em>}
                        <b style={{ height: `${(d.n * 100) / maxDay}%` }} />
                        <small>{days.length <= 10 || i % Math.ceil(days.length / 7) === 0 || i === days.length - 1 ? (i === days.length - 1 ? "Today" : d.label) : "\u00A0"}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">By <span className="serif">caller</span></h2>
                  </div>
                  {callers.length ? (
                    <div className="bgd-scroll"><table>
                      <thead><tr><th>Caller</th><th className="n">Leads</th><th className="n">Not called</th><th className="n">Lost</th></tr></thead>
                      <tbody>
                        {callers.map((c) => (
                          <tr key={c.name}>
                            <td><span className="bgd-who"><span className="bgd-avatar" aria-hidden="true">{initials(c.name)}</span>{c.name}</span></td>
                            <td className="n bgd-strong">{c.total}</td><td className="n">{c.fresh}</td><td className="n">{c.lost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  ) : <div className="bgd-empty">{DASH}</div>}
                </div>
              </div>

              <div className="bgd-grid">
                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">By <span className="serif">channel</span></h2>
                    <span className="bgd-hint">From utm_source</span>
                  </div>
                  {channels.length ? (
                    <div className="bgd-scroll"><table>
                      <thead><tr><th>Channel</th><th className="n">Leads</th><th className="n">Qualified</th><th className="n">Qual. rate</th><th className="n">Lost rate</th></tr></thead>
                      <tbody>
                        {channels.map((c) => (
                          <tr key={c.name}>
                            <td><div className="bgd-strong">{c.name}</div><Mix r={c} /></td>
                            <td className="n bgd-strong">{c.total}</td><td className="n">{c.qual}</td>
                            <td className="n"><QRate q={c.qual} total={c.total} /></td>
                            <td className="n"><Rate lost={c.lost} total={c.total} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  ) : <div className="bgd-empty">No leads in this period.</div>}
                </div>

                <div className="bgd-card">
                  <div className="bgd-card-h">
                    <h2 className="bgd-h2">Google <span className="serif">keywords</span></h2>
                    <span className="bgd-hint">Top 12, from utm_term</span>
                  </div>
                  {keywords.length ? (
                    <div className="bgd-scroll"><table>
                      <thead><tr><th>Keyword</th><th className="n">Leads</th><th className="n">Lost rate</th></tr></thead>
                      <tbody>
                        {keywords.map((k) => (
                          <tr key={k.name}>
                            <td><div className="bgd-full">{k.name}</div></td>
                            <td className="n bgd-strong">{k.total}</td>
                            <td className="n"><Rate lost={k.lost} total={k.total} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  ) : <div className="bgd-empty">No Google leads in this period.</div>}
                </div>
              </div>

              <div className="bgd-card" style={{ marginBottom: 18 }}>
                <div className="bgd-card-h">
                  <h2 className="bgd-h2">By <span className="serif">ad</span></h2>
                  <span className="bgd-hint">From utm_content</span>
                </div>
                {ads.length ? (
                  <div className="bgd-scroll">
                    <table>
                      <thead><tr><th>Ad</th><th className="n">Leads</th><th className="n">Qualified</th><th className="n">Qual. rate</th><th className="n">Not called</th><th className="n">Lost rate</th></tr></thead>
                      <tbody>
                        {ads.map((a) => (
                          <tr key={a.name}>
                            <td><div className="bgd-name bgd-strong" title={a.name}>{a.name}</div><Mix r={a} /></td>
                            <td className="n bgd-strong">{a.total}</td><td className="n">{a.qual}</td>
                            <td className="n"><QRate q={a.qual} total={a.total} /></td><td className="n">{a.fresh}</td>
                            <td className="n"><Rate lost={a.lost} total={a.total} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="bgd-empty">No leads in this period.</div>}
              </div>

              <div className="bgd-card">
                <div className="bgd-card-h">
                  <h2 className="bgd-h2">Every <span className="serif">lead</span></h2>
                  <span className="bgd-hint">Click a lead for caller notes. Tinted rows changed in the last refresh.</span>
                </div>
                <div className="bgd-tabs" role="group" aria-label="Lead status">
                  {LIST_TABS.map((t) => (
                    <button key={t.key} type="button" aria-pressed={tab === t.key} onClick={() => { setTab(t.key); setShown(200); }}>
                      {t.label}<b>{tabCount(t.key)}</b>
                    </button>
                  ))}
                </div>
                {listLeads.length ? (
                  <div className="bgd-scroll">
                    <table>
                      <thead>
                        <tr><th>Name</th><th>Channel</th><th>Came in</th><th>Status</th><th>Caller</th><th>Campaign</th><th>Ad set</th><th>Ad</th><th className="n">Forms</th><th>Phone</th><th>Last update</th></tr>
                      </thead>
                      <tbody>
                        {listLeads.slice(0, shown).map((l) => (
                          <tr key={l.id} className={`click${changed.has(l.id) ? " changed" : ""}`} onClick={() => setOpenId(l.id)}>
                            <td><button type="button" className="bgd-link" title={`Open notes for ${l.name || "this lead"}`} onClick={(e) => { e.stopPropagation(); setOpenId(l.id); }}>{l.name || "Unnamed"}</button></td>
                            <td style={{ whiteSpace: "nowrap" }}>{l.channel}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{fmtWhen(l.createdOn)}</td>
                            <td><Chip status={l.status} />{l.lostReason && <span className="bgd-why">{l.lostReason}</span>}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{l.assignee}</td>
                            <td><div className="bgd-full">{l.campaign}</div></td>
                            <td><div className="bgd-name" style={{ maxWidth: 180 }} title={l.adSet}>{l.adSet || DASH}</div></td>
                            <td><div className="bgd-name" style={{ maxWidth: 160 }} title={l.ad}>{l.ad || DASH}</div></td>
                            <td className="n">{l.repeats > 1 ? l.repeats : 1}</td>
                            <td className="bgd-muted" style={{ whiteSpace: "nowrap" }}>{l.phoneTail ? `\u2022\u2022\u2022\u2022 ${l.phoneTail}` : DASH}</td>
                            <td className="bgd-muted" style={{ whiteSpace: "nowrap" }}>{l.modifiedOn ? ago(l.modifiedOn, now) : DASH}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {listLeads.length > shown && (
                      <div style={{ textAlign: "center", marginTop: 16 }}>
                        <button type="button" className="bgd-ink" style={{ width: "auto", padding: "12px 22px", fontSize: 14 }} onClick={() => setShown((n) => n + 200)}>
                          Show {Math.min(200, listLeads.length - shown)} more of {listLeads.length - shown}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bgd-empty">
                    {tab === "converted"
                      ? "No converted leads in this period. Leads appear here when a caller sets their status to Converted in TeleCRM."
                      : tab === "interested"
                        ? "No interested leads in this period."
                        : "No leads in this period."}
                  </div>
                )}
                <p className="bgd-note">
                  Paid leads from Meta, Google and ChatGPT, excluding BG campaigns. Full phone numbers and health details stay in TeleCRM. For Lean Protocol staff only.
                </p>
              </div>
            </div>
          </section>
          {openId && (() => {
            const ol = (data?.leads || []).find((x) => x.id === openId);
            return ol ? <LeadPanel lead={ol} onClose={closePanel} /> : null;
          })()}
        </>
      )}
    </div>
  );
}