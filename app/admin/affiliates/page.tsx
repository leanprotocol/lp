"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, DollarSign, ExternalLink, Filter, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  referralCode: string;
  isActive: boolean;
  createdAt: string;
  leadsCount: number;
  stats: {
    gross: number;
    net: number;
    pending: number;
    eligible: number;
    paid: number;
    unsettled: number;
  };
}

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    referralCode: "",
    password: "",
  });

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      if (data.success) setAffiliates(data.affiliates);
    } catch (error) {
      console.error("Failed to fetch affiliates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (affiliateId: string) => {
    if (!confirm("Are you sure you want to mark all pending and eligible commissions for this affiliate as PAID?")) return;
    
    try {
      setSettling(affiliateId);
      const res = await fetch(`/api/admin/affiliates/${affiliateId}/settle`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAffiliates();
      } else {
        alert(data.error || "Settlement failed");
      }
    } catch (error) {
      console.error("Settlement error:", error);
    } finally {
      setSettling(null);
    }
  };

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setForm({ name: "", email: "", mobileNumber: "", referralCode: "", password: "" });
        fetchAffiliates();
      } else {
        setFormError(data.error || "Failed to create affiliate.");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filteredAffiliates = affiliates.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobileNumber.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-semibold text-slate-900 inter">Affiliates & Affiliates</h1>
            <p className="text-slate-500 text-sm mt-1">Manage referral links, track leads, and settle commissions</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-2xl border-slate-200">
                <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add New Affiliate
            </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or referral code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Affiliate</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Leads</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Commission (₹)</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Payout Status</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAffiliates.length > 0 ? (
                filteredAffiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{affiliate.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{affiliate.email}</div>
                        <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Code: {affiliate.referralCode}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700">{affiliate.leadsCount}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Total Leads</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900">₹{affiliate.stats.net.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-600 uppercase font-bold">₹{affiliate.stats.gross.toLocaleString()} sales</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-slate-600">₹{affiliate.stats.paid.toLocaleString()} Paid</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-slate-600">₹{affiliate.stats.eligible.toLocaleString()} Eligible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400" />
                                <span className="text-xs font-bold text-slate-600">₹{affiliate.stats.pending.toLocaleString()} Pending</span>
                            </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={affiliate.stats.unsettled === 0 || settling === affiliate.id}
                                onClick={() => handleSettle(affiliate.id)}
                                className="rounded-xl border-emerald-600 text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 h-9"
                            >
                                {settling === affiliate.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" /> Mark as Paid
                                    </span>
                                )}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-600 h-8 px-2 rounded-lg" onClick={() => router.push(`/admin/affiliates/${affiliate.id}`)}>
                                <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Details
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                        No affiliates found matching your search.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Affiliate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add New Affiliate</h2>
              <button
                onClick={() => { setShowModal(false); setFormError(""); }}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-xl p-1.5 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAffiliate} className="px-8 py-6 space-y-4">
              {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}

              {[
                { id: "aff-name", label: "Full Name", key: "name", type: "text", placeholder: "Jane Doe", required: true },
                { id: "aff-email", label: "Email", key: "email", type: "email", placeholder: "jane@example.com", required: true },
                { id: "aff-mobile", label: "Mobile Number", key: "mobileNumber", type: "tel", placeholder: "+91 98765 43210", required: true },
                { id: "aff-code", label: "Referral Code (optional)", key: "referralCode", type: "text", placeholder: "Auto-generated if blank", required: false },
                { id: "aff-password", label: "Temporary Password", key: "password", type: "password", placeholder: "Min 8 characters", required: true },
              ].map(({ id, label, key, type, placeholder, required }) => (
                <div key={key} className="space-y-1.5">
                  <label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-slate-200"
                  onClick={() => { setShowModal(false); setFormError(""); }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  disabled={creating}
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Affiliate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
