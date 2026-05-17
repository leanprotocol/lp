"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, ArrowLeft, DollarSign, Users, TrendingUp,
  CheckCircle2, Clock, XCircle, ExternalLink, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────
interface Commission {
  id: string;
  amount: number;
  percentage: number;
  status: string;
  eligibleAt: string;
  paidAt: string | null;
  payment: { amount: number; razorpayPaymentId: string | null; createdAt: string };
  lead: { firstName: string; lastName: string | null; mobileNumber: string };
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string | null;
  mobileNumber: string;
  email: string | null;
  source: string;
  status: string;
  isDuplicate: boolean;
  createdAt: string;
  convertedAt: string | null;
  commissions: { amount: number; status: string }[];
}

interface AffiliateDetail {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  referralCode: string;
  clicks: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  leads: Lead[];
  commissions: Commission[];
  stats: { gross: number; net: number; pending: number; eligible: number; paid: number; unsettled: number };
}

// ── Helpers ────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  PENDING:   "bg-orange-50 text-orange-600 border-orange-100",
  ELIGIBLE:  "bg-blue-50 text-blue-600 border-blue-100",
  PAID:      "bg-emerald-50 text-emerald-600 border-emerald-100",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  CONVERTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
  REFUNDED:  "bg-red-50 text-red-500 border-red-100",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[status] ?? "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-1.5">
      <div className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────
export default function AffiliateDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [affiliate, setAffiliate] = useState<AffiliateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "commissions">("leads");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/affiliates/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setAffiliate(d.affiliate); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSettle = async () => {
    if (!affiliate) return;
    if (!confirm("Mark all pending & eligible commissions as PAID?")) return;
    setSettling(true);
    try {
      const res = await fetch(`/api/admin/affiliates/${id}/settle`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Refresh
        const r = await fetch(`/api/admin/affiliates/${id}`);
        const d = await r.json();
        if (d.success) setAffiliate(d.affiliate);
      } else {
        alert(data.error || "Settlement failed");
      }
    } finally {
      setSettling(false);
    }
  };

  const copyCode = () => {
    if (!affiliate) return;
    navigator.clipboard.writeText(affiliate.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-500">
        <XCircle className="w-12 h-12 text-slate-300" />
        <p className="text-lg font-medium">Affiliate not found</p>
        <Button variant="outline" onClick={() => router.push("/admin/affiliates")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Affiliates
        </Button>
      </div>
    );
  }

  const conversionRate = affiliate.leads.length > 0
    ? ((affiliate.leads.filter(l => l.status === "CONVERTED").length / affiliate.leads.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push("/admin/affiliates")}
            className="mt-1 rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-semibold text-slate-900">{affiliate.name}</h1>
              {affiliate.isActive
                ? <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-lg">Active</span>
                : <span className="text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-500 border border-red-100 px-2.5 py-0.5 rounded-lg">Inactive</span>
              }
              {affiliate.isVerified && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500 mt-1 space-x-4">
              <span>{affiliate.email}</span>
              <span>·</span>
              <span>{affiliate.mobileNumber}</span>
              <span>·</span>
              <span>Joined {new Date(affiliate.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            {/* Referral Code */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-slate-500 font-medium">Referral Code:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1 text-sm tracking-widest">
                {affiliate.referralCode}
              </span>
              <button
                onClick={copyCode}
                className="text-slate-400 hover:text-emerald-600 transition-colors"
                title="Copy referral code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            className="rounded-2xl border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            disabled={affiliate.stats.unsettled === 0 || settling}
            onClick={handleSettle}
          >
            {settling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DollarSign className="w-4 h-4 mr-2" />}
            Mark as Paid
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Leads"     value={String(affiliate.leads.length)}       color="text-slate-500"   sub={`${conversionRate}% converted`} />
        <StatCard label="Clicks"          value={String(affiliate.clicks)}              color="text-slate-500" />
        <StatCard label="Gross Sales"     value={`₹${affiliate.stats.gross.toLocaleString()}`} color="text-slate-500" />
        <StatCard label="Commission"      value={`₹${affiliate.stats.net.toLocaleString()}`}   color="text-emerald-600" />
        <StatCard label="Pending"         value={`₹${affiliate.stats.pending.toLocaleString()}`}  color="text-orange-500" />
        <StatCard label="Paid Out"        value={`₹${affiliate.stats.paid.toLocaleString()}`}     color="text-blue-600" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {(["leads", "commissions"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-sm font-bold capitalize transition-colors ${
                activeTab === tab
                  ? "text-emerald-600 border-b-2 border-emerald-500 -mb-px"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "leads" ? `Leads (${affiliate.leads.length})` : `Commissions (${affiliate.commissions.length})`}
            </button>
          ))}
        </div>

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  {["Lead", "Contact", "Source", "Status", "Commission", "Date"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {affiliate.leads.length > 0 ? affiliate.leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-sm">
                        {lead.firstName} {lead.lastName ?? ""}
                      </div>
                      {lead.isDuplicate && (
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 border border-orange-100 rounded px-1.5 py-0.5">Duplicate</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div>{lead.mobileNumber}</div>
                      {lead.email && <div className="text-xs text-slate-400">{lead.email}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{lead.source}</td>
                    <td className="px-6 py-4"><Badge status={lead.status} /></td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {lead.commissions.length > 0
                        ? `₹${lead.commissions.reduce((s, c) => s + c.amount, 0).toLocaleString()}`
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No leads yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* COMMISSIONS TAB */}
        {activeTab === "commissions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  {["Lead", "Payment", "Commission", "Rate", "Status", "Eligible At", "Paid At"].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {affiliate.commissions.length > 0 ? affiliate.commissions.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {c.lead.firstName} {c.lead.lastName ?? ""}
                      <div className="text-xs text-slate-400 font-normal">{c.lead.mobileNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">₹{c.payment.amount.toLocaleString()}</div>
                      {c.payment.razorpayPaymentId && (
                        <div className="text-[10px] text-slate-400 font-mono">{c.payment.razorpayPaymentId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-700">₹{c.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{c.percentage}%</td>
                    <td className="px-6 py-4"><Badge status={c.status} /></td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(c.eligibleAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {c.paidAt
                        ? new Date(c.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No commissions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
