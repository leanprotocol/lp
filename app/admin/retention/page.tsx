"use client";

// app/admin/retention/page.tsx
// The retention review: enquiry records past two years, with a decision to
// delete them or keep them for a stated reason. Both are written to AuditLog.
//
// The list shows type, date and age only. Deciding whether a two-year-old
// enquiry should go does not require reading someone's weight or conditions,
// and showing them would make this one more screen where health data appears.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Clock, Loader2, Trash2, ShieldCheck } from "lucide-react";

type Item = { id: string; kind: "lead" | "quizSubmission" | "contactQuery"; label: string; lastActivity: string; monthsOld: number };
type Data = { total: number; counts: { leads: number; quizSubmissions: number; contactQueries: number }; cutoff: string; items: Item[]; truncated?: boolean };

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function RetentionReviewPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/retention");
      const d = await res.json();
      if (!res.ok || !d.success) throw new Error(d.error || "Could not load the review");
      setData(d);
      setPicked(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the review");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) => {
    setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const act = async (decision: "delete" | "keep") => {
    if (!data || picked.size === 0 || busy) return;
    if (decision === "keep" && reason.trim().length < 3) { setError("Write a reason before keeping these records."); return; }
    const chosen = data.items.filter((i) => picked.has(i.id));
    if (decision === "delete" && !confirm(`Permanently erase ${chosen.length} record(s)? This cannot be undone.`)) return;

    setBusy(true); setError(null); setNote(null);
    try {
      const byKind = new Map<string, string[]>();
      for (const i of chosen) byKind.set(i.kind, [...(byKind.get(i.kind) || []), i.id]);
      let done = 0;
      for (const [kind, ids] of byKind) {
        const res = await fetch("/api/admin/retention/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, ids, decision, reason: reason.trim() || undefined }),
        });
        const d = await res.json();
        if (!res.ok || !d.success) throw new Error(d.error || "The action failed");
        done += decision === "delete" ? d.deleted : d.kept;
      }
      setNote(decision === "delete" ? `${done} record(s) erased and logged.` : `${done} record(s) kept, with your reason logged.`);
      setReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Retention review</h1>
            <p className="text-sm text-slate-500">
              Enquiries with no activity for two years. Customers are never listed here.
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        We keep enquiry data for two years after the last contact. Past that, erase it or record
        why it must be kept. Every decision is written to the audit log.
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {note && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{note}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
      ) : !data ? null : data.total === 0 ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-emerald-500" />
          <p className="mt-3 text-lg font-semibold text-emerald-800">Nothing is overdue</p>
          <p className="mt-1 text-sm text-emerald-700">No enquiry record has passed its two-year period.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["Leads", data.counts.leads], ["Quiz submissions", data.counts.quizSubmissions], ["Contact queries", data.counts.contactQueries]].map(([label, n]) => (
              <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{n as number}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={picked.size === data.items.length && data.items.length > 0}
                  onChange={(e) => setPicked(e.target.checked ? new Set(data.items.map((i) => i.id)) : new Set())}
                />
                Select all {data.items.length} shown
              </label>
              <span className="text-sm text-slate-500">{picked.size} selected</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {data.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 p-4">
                  <input type="checkbox" checked={picked.has(i.id)} onChange={() => toggle(i.id)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{i.label}</p>
                    <p className="text-xs text-slate-500">Last activity {fmt(i.lastActivity)} &middot; {i.monthsOld} months ago</p>
                  </div>
                  <code className="hidden shrink-0 text-xs text-slate-400 sm:block">{i.id.slice(0, 8)}</code>
                </li>
              ))}
            </ul>
            {data.truncated && (
              <p className="border-t border-slate-200 p-4 text-xs text-slate-500">
                Showing the oldest records only. Work through these and reload for the rest.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
              Reason, if you are keeping these
            </label>
            <input
              id="reason" type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. ongoing dispute, ref 1182"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button" onClick={() => act("delete")} disabled={picked.size === 0 || busy}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" /> Erase selected
              </button>
              <button
                type="button" onClick={() => act("keep")} disabled={picked.size === 0 || busy}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                <AlertTriangle className="h-4 w-4" /> Keep, with reason
              </button>
              {busy && <Loader2 className="h-5 w-5 animate-spin self-center text-slate-400" />}
            </div>
            <p className="text-xs text-slate-500">Erasing cannot be undone. The decision and your name are written to the audit log either way.</p>
          </div>
        </>
      )}
    </div>
  );
}