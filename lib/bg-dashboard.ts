/* BG team lead dashboard - server side.
   Reads live from the TeleCRM Sync API. Nothing is copied to our database.

   Scope: utm_source "meta" (TeleCRM matches it case-insensitively, so
   "Meta" and "meta" both count) AND utm_campaign starting with "bg" (checked
   here, because TeleCRM search has no "starts with").

   PRIVACY. Only the lead's name, campaign fields, status, lost reason,
   assignee, timestamps and the last four phone digits leave this file.
   Full phone, email, weight, height, BMI, goal, age and click IDs are
   dropped here, on the server, so they never reach the browser. Names are
   shown because the BG team are Lean Protocol employees (decided
   5 Oct 2026); do not open this login to anyone outside the company.

   Pure ASCII file. */

import crypto from "crypto";

export const BG_CONFIG = {
  utmSource: "meta",
  campaignPrefix: "bg",
  /* One TeleCRM fetch serves every viewer for this long. */
  cacheMs: 30_000,
};

const SYNC_BASE = "https://next.telecrm.in/autoupdate/v2";

type RawLead = {
  id: string;
  employeeid?: string;
  status?: string;
  lostReasonid?: string;
  fields?: Record<string, unknown>;
};

export type BgLead = {
  id: string;
  name: string;
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

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

async function tc(path: string, init?: RequestInit) {
  const ent = process.env.TELECRM_ENTERPRISE_ID;
  const tok = process.env.TELECRM_SYNC_TOKEN;
  if (!ent || !tok) throw new Error("TELECRM_ENTERPRISE_ID or TELECRM_SYNC_TOKEN is not set");
  const res = await fetch(`${SYNC_BASE}/enterprise/${ent}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TeleCRM ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchMetaLeads(): Promise<RawLead[]> {
  const out: RawLead[] = [];
  for (let skip = 0; skip < 5000; skip += 100) {
    const r = await tc(`/lead/search?skip=${skip}&limit=100`, {
      method: "POST",
      body: JSON.stringify({ fields: { utm_source: BG_CONFIG.utmSource } }),
    });
    const page: RawLead[] = Array.isArray(r?.data) ? r.data : [];
    out.push(...page);
    if (page.length < 100 || out.length >= Number(r?.total_count || 0)) break;
  }
  return out;
}

/* Caller emails to display names. Refreshed hourly; a failure falls back to
   the part of the email before the @, and never breaks the dashboard. */
let names: { at: number; map: Record<string, string> } | null = null;
async function teamNames(): Promise<Record<string, string>> {
  if (names && Date.now() - names.at < 3_600_000) return names.map;
  const map: Record<string, string> = {};
  try {
    for (let skip = 0; skip < 500; skip += 10) {
      const r = await tc(`/team-members?skip=${skip}&limit=10`);
      const page: { name?: string; email?: string }[] = Array.isArray(r?.data) ? r.data : [];
      for (const m of page) if (m?.email) map[m.email.toLowerCase()] = m.name || m.email;
      if (page.length < 10) break;
    }
  } catch (e) {
    console.error("[BG dashboard] team names failed:", e);
  }
  names = { at: Date.now(), map };
  return map;
}

function toLead(r: RawLead, nm: Record<string, string>): BgLead | null {
  const f = r.fields || {};
  const campaign = str(f.utm_campaign).trim();
  if (!campaign.toLowerCase().startsWith(BG_CONFIG.campaignPrefix)) return null;
  const email = str(r.employeeid).toLowerCase();
  const status = str(r.status) || "Fresh";
  return {
    id: str(r.id),
    name: str(f.name).trim().slice(0, 80),
    createdOn: Number(f.created_on) || 0,
    modifiedOn: Number(f.modified_on) || 0,
    status,
    lostReason: status.toLowerCase() === "lost" ? str(r.lostReasonid) : "",
    assignee: email ? nm[email] || email.split("@")[0] : "Unassigned",
    campaign,
    adSet: str(f.utm_medium),
    ad: str(f.utm_content),
    repeats: Number(f.capture_frequency) || 1,
    phoneTail: str(f.phone).replace(/\D/g, "").slice(-4),
  };
}

type Snapshot = { at: number; syncedAt: number; leads: BgLead[]; stale: boolean };
let cache: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

export async function getBgLeads(): Promise<Snapshot> {
  if (cache && Date.now() - cache.at < BG_CONFIG.cacheMs) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const [raw, nm] = await Promise.all([fetchMetaLeads(), teamNames()]);
      const leads = raw
        .map((r) => toLead(r, nm))
        .filter((l): l is BgLead => l !== null)
        .sort((a, b) => b.createdOn - a.createdOn);
      cache = { at: Date.now(), syncedAt: Date.now(), leads, stale: false };
      return cache;
    } catch (e) {
      console.error("[BG dashboard] TeleCRM fetch failed:", e);
      /* Serve the last good data, marked stale, and wait one cache period
         before retrying so a TeleCRM outage is not hammered. */
      if (cache) {
        cache = { ...cache, at: Date.now(), stale: true };
        return cache;
      }
      throw e;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/* ---------- activity for one lead ----------
   Caller notes, calls and assignments, read on demand when someone opens a
   lead - never for every lead on every refresh, which would burn through the
   Sync API rate limit. Only BG leads can be opened: the id must be in the
   current BG snapshot, so this cannot be used to read any other lead.

   Kept: USER_NOTE text; call type, duration, call note and feedback;
   assignment. Dropped: the phone number on call records, call recordings,
   CUSTOM_API (Meta conversion logs with hashed customer data), SYSTEM_NOTE
   (automation text that can repeat the form's health answers), and
   everything else. */

export type BgActivity = {
  id: string;
  at: number;
  kind: "note" | "call" | "assign";
  by: string;
  title: string;
  text: string;
  duration?: number;
  truncated?: boolean;
};

const CALL_TYPES: Record<string, string> = {
  OUTGOING_CALL: "Outgoing call",
  INCOMING_CALL: "Incoming call",
  MISSED_CALL: "Missed call",
};

const actCache = new Map<string, { at: number; items: BgActivity[] }>();

export async function getLeadActivity(leadId: string): Promise<BgActivity[] | null> {
  const snap = await getBgLeads();
  if (!snap.leads.some((l) => l.id === leadId)) return null;

  const hit = actCache.get(leadId);
  if (hit && Date.now() - hit.at < 60_000) return hit.items;

  const [r, nm] = await Promise.all([
    tc(`/lead/${encodeURIComponent(leadId)}?includeActions=true&skip=0&limit=100`),
    teamNames(),
  ]);
  const who = (v: unknown) => {
    const e = str(v).toLowerCase();
    if (!e) return "System";
    if (!e.includes("@")) return "Automation";
    return nm[e] || e.split("@")[0];
  };

  const items: BgActivity[] = [];
  const actions: Record<string, unknown>[] = Array.isArray(r?.actions) ? r.actions : [];
  for (const a of actions) {
    const type = str(a.type);
    const base = { id: str(a.id), at: Number(a.creationTimestamp) || 0, by: who(a.employeeid) };
    if (type === "USER_NOTE") {
      const text = str(a.text).trim();
      if (text) items.push({ ...base, kind: "note", title: "Note", text, truncated: Boolean(a.isTruncated) });
    } else if (CALL_TYPES[type]) {
      const text = [str(a.note).trim(), str(a.feedback).trim()].filter(Boolean).join("\n");
      items.push({ ...base, kind: "call", title: CALL_TYPES[type], text, duration: Number(a.duration) || 0 });
    } else if (type === "LEAD_ASSIGNMENT") {
      const to = str(a.assignedto);
      if (to) items.push({ ...base, kind: "assign", title: `Assigned to ${who(to)}`, text: str(a.reassignmentNote).trim() });
    }
  }
  items.sort((x, y) => y.at - x.at);

  if (actCache.size > 500) actCache.clear();
  actCache.set(leadId, { at: Date.now(), items });
  return items;
}

/* ---------- login ----------
   One shared password (BG_DASHBOARD_PASSWORD) and a signing secret
   (BG_DASHBOARD_SECRET). The session cookie is signed with both, so changing
   the password logs everyone out. Separate from /admin on purpose: this
   login can only ever reach the BG dashboard. */

export const BG_COOKIE = "bgd_session";
export const BG_SESSION_DAYS = 7;

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

function sign(exp: number) {
  const secret = process.env.BG_DASHBOARD_SECRET || "";
  const pw = process.env.BG_DASHBOARD_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(`bgd.${exp}.${sha(pw)}`).digest("hex");
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function bgConfigured() {
  return Boolean(process.env.BG_DASHBOARD_SECRET && process.env.BG_DASHBOARD_PASSWORD);
}

export function checkPassword(input: string) {
  const want = (process.env.BG_DASHBOARD_PASSWORD || "").trim().replace(/^["']|["']$/g, "");
  if (!want) return false;
  return safeEq(sha(input.trim()), sha(want));
}

export function makeSession() {
  const exp = Date.now() + BG_SESSION_DAYS * 86_400_000;
  return `${exp}.${sign(exp)}`;
}

export function validSession(value: string | undefined) {
  if (!value || !bgConfigured()) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  return safeEq(sign(exp), sig);
}