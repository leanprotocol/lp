/* Main marketing team lead dashboard - server side.
   Reads live from the TeleCRM Sync API. Nothing is copied to our database.

   Scope: paid leads from Meta, Google and ChatGPT, EXCEPT campaigns whose
   name starts with "bg" (those belong to the BG team's own dashboard).

   SYNC. This team covers most paid leads, so re-downloading everything every
   30 seconds would hit TeleCRM's rate limit. Instead:
     - a full load on first use and every 30 minutes (catches deletes/merges),
     - in between, every 30 seconds, only leads modified since the last check
       (TeleCRM's modified_on range filter, tested on this account 5 Oct 2026).

   PRIVACY. Only the lead's name, campaign fields, status, lost reason,
   assignee, timestamps and the last four phone digits leave this file. Full
   phone, email, weight, height, BMI, goal, age and click IDs are dropped here,
   on the server. Names and caller notes are shown because this team are
   Lean Protocol employees (decided 7 Oct 2026); do not open this login to
   anyone outside the company.

   Pure ASCII file. */

import crypto from "crypto";

export const TEAM_CONFIG = {
  /* utm_source values that count, matched case-insensitively. */
  sources: {
    meta: "Meta", facebook: "Meta", fb: "Meta", instagram: "Meta", ig: "Meta",
    google: "Google",
    chatgpt: "ChatGPT", openai: "ChatGPT",
  } as Record<string, string>,
  /* Campaigns starting with this belong to the BG team and are excluded. */
  excludePrefix: "bg",
  pollMs: 30_000,
  fullReloadMs: 30 * 60_000,
};

const SYNC_BASE = "https://next.telecrm.in/autoupdate/v2";

type RawLead = {
  id: string;
  employeeid?: string;
  status?: string;
  lostReasonid?: string;
  fields?: Record<string, unknown>;
};

export type TeamLead = {
  id: string;
  name: string;
  channel: string;
  createdOn: number;
  modifiedOn: number;
  status: string;
  lostReason: string;
  assignee: string;
  campaign: string;
  adSet: string;
  ad: string;
  keyword: string;
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
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TeleCRM ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function searchAll(filter: Record<string, unknown>, cap = 10_000): Promise<RawLead[]> {
  const out: RawLead[] = [];
  for (let skip = 0; skip < cap; skip += 100) {
    const r = await tc(`/lead/search?skip=${skip}&limit=100`, {
      method: "POST",
      body: JSON.stringify({ fields: filter }),
    });
    const page: RawLead[] = Array.isArray(r?.data) ? r.data : [];
    out.push(...page);
    if (page.length < 100 || out.length >= Number(r?.total_count || 0)) break;
  }
  return out;
}

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
    console.error("[Team dashboard] team names failed:", e);
  }
  names = { at: Date.now(), map };
  return map;
}

/* Returns the lead if it is in scope, otherwise null. */
function toLead(r: RawLead, nm: Record<string, string>): TeamLead | null {
  const f = r.fields || {};
  const channel = TEAM_CONFIG.sources[str(f.utm_source).trim().toLowerCase()];
  if (!channel) return null;
  const campaign = str(f.utm_campaign).trim();
  if (campaign.toLowerCase().startsWith(TEAM_CONFIG.excludePrefix)) return null;
  const email = str(r.employeeid).toLowerCase();
  const status = str(r.status) || "Fresh";
  return {
    id: str(r.id),
    name: str(f.name).trim().slice(0, 80),
    channel,
    createdOn: Number(f.created_on) || 0,
    modifiedOn: Number(f.modified_on) || 0,
    status,
    lostReason: status.toLowerCase() === "lost" ? str(r.lostReasonid) : "",
    assignee: email ? nm[email] || email.split("@")[0] : "Unassigned",
    campaign,
    adSet: str(f.utm_medium),
    ad: str(f.utm_content),
    keyword: str(f.utm_term),
    repeats: Number(f.capture_frequency) || 1,
    phoneTail: str(f.phone).replace(/\D/g, "").slice(-4),
  };
}

type State = {
  leads: Map<string, TeamLead>;
  fullAt: number;
  pollAt: number;
  syncedAt: number;
  stale: boolean;
};
let state: State | null = null;
let inflight: Promise<State> | null = null;

async function fullLoad(): Promise<State> {
  const nm = await teamNames();
  const leads = new Map<string, TeamLead>();
  /* One search per source value: TeleCRM matches each exactly (ignoring
     case), so "Meta" and "meta" come back from the same search. */
  for (const src of Object.keys(TEAM_CONFIG.sources)) {
    for (const r of await searchAll({ utm_source: src })) {
      const l = toLead(r, nm);
      if (l) leads.set(l.id, l);
    }
  }
  const now = Date.now();
  return { leads, fullAt: now, pollAt: now, syncedAt: now, stale: false };
}

async function poll(prev: State): Promise<State> {
  const nm = await teamNames();
  const from = prev.pollAt - 120_000; // overlap so nothing slips between polls
  const now = Date.now();
  const changed = await searchAll({ modified_on: { from, to: now } }, 2_000);
  for (const r of changed) {
    const l = toLead(r, nm);
    if (l) prev.leads.set(l.id, l);
    else prev.leads.delete(str(r.id)); // moved out of scope
  }
  return { ...prev, pollAt: now, syncedAt: now, stale: false };
}

export async function getTeamLeads(): Promise<{ syncedAt: number; stale: boolean; leads: TeamLead[] }> {
  const now = Date.now();
  const due =
    !state ? "full"
    : now - state.fullAt > TEAM_CONFIG.fullReloadMs ? "full"
    : now - state.pollAt > TEAM_CONFIG.pollMs ? "poll"
    : null;

  if (due) {
    if (!inflight) {
      const prev = state;
      inflight = (async () => {
        try {
          state = due === "full" || !prev ? await fullLoad() : await poll(prev);
          return state;
        } catch (e) {
          console.error("[Team dashboard] TeleCRM sync failed:", e);
          if (prev) {
            /* Serve the last good data, marked stale; retry next period. */
            state = {
              ...prev,
              pollAt: Date.now(),
              /* a failed full reload is retried one poll period later, not on every request */
              fullAt: due === "full" ? Date.now() - TEAM_CONFIG.fullReloadMs + TEAM_CONFIG.pollMs : prev.fullAt,
              stale: true,
            };
            return state;
          }
          throw e;
        } finally {
          inflight = null;
        }
      })();
    }
    await inflight;
  }
  const s = state;
  if (!s) throw new Error("No data yet");
  const leads = Array.from(s.leads.values()).sort((a, b) => b.createdOn - a.createdOn);
  return { syncedAt: s.syncedAt, stale: s.stale, leads };
}

/* ---------- activity for one lead ----------
   Same rules as the BG dashboard: read on demand, only for leads in this
   team's scope; keeps notes, calls and assignments; drops call phone numbers,
   recordings, CUSTOM_API (Meta conversion logs) and SYSTEM_NOTE. */

export type TeamActivity = {
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

const actCache = new Map<string, { at: number; items: TeamActivity[] }>();

export async function getLeadActivity(leadId: string): Promise<TeamActivity[] | null> {
  const snap = await getTeamLeads();
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

  const items: TeamActivity[] = [];
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
   Own password (TEAM_DASHBOARD_PASSWORD) and signing secret
   (TEAM_DASHBOARD_SECRET), separate from the BG dashboard, so neither team's
   login opens the other's leads. Changing the password signs everyone out. */

export const TEAM_COOKIE = "tmd_session";
export const TEAM_SESSION_DAYS = 7;

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const cleanPw = () => (process.env.TEAM_DASHBOARD_PASSWORD || "").trim().replace(/^["']|["']$/g, "");

function sign(exp: number) {
  const secret = process.env.TEAM_DASHBOARD_SECRET || "";
  return crypto.createHmac("sha256", secret).update(`tmd.${exp}.${sha(cleanPw())}`).digest("hex");
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function teamConfigured() {
  return Boolean(process.env.TEAM_DASHBOARD_SECRET && cleanPw());
}

export function checkPassword(input: string) {
  const want = cleanPw();
  if (!want) return false;
  return safeEq(sha(input.trim()), sha(want));
}

export function makeSession() {
  const exp = Date.now() + TEAM_SESSION_DAYS * 86_400_000;
  return `${exp}.${sign(exp)}`;
}

export function validSession(value: string | undefined) {
  if (!value || !teamConfigured()) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  return safeEq(sign(exp), sig);
}