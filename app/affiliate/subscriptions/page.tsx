"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Search, Filter, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Commission {
  id: string;
  customerName: string;
  customerPhone: string;
  leadSource: string;
  planName: string;
  planDurationDays: number;
  packageAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  commissionStatus: string;
  purchaseDate: string;
  refundWindowEndsAt: string;
  attributionExpiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  ELIGIBLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-orange-50 text-orange-700 border-orange-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function AffiliateSubscriptionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");

  useEffect(() => {
    fetchCommissions();
  }, [statusFilter, planFilter]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (planFilter !== "ALL") params.append("plan", planFilter);
      
      const res = await fetch(`/api/affiliate/subscriptions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCommissions(data.commissions);
      }
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommissions = commissions.filter((sub) => {
    const matchesSearch = 
        sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sub.customerPhone.includes(searchTerm);
    return matchesSearch;
  });

  if (loading && commissions.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-[#1F302B]">Conversions & Subscriptions</h1>
        <p className="text-slate-500 inter text-sm mt-1">Monitor your referral payments, refund windows, and earned commissions</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 min-w-[160px] transition-all cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending (Refund Window)</option>
                <option value="ELIGIBLE">Eligible (Ready)</option>
                <option value="PAID">Paid</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 min-w-[140px] transition-all cursor-pointer"
            >
              <option value="ALL">All Plans</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Month">3 Months</option>
              <option value="6 Month">6 Months</option>
            </select>
          </div>
        </div>

        {filteredCommissions.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No conversions found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Plan Details</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Commission</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Attribution</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCommissions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5">
                      <div className="font-bold text-[#1F302B]">{sub.customerName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        {sub.customerPhone}
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500">
                          {sub.leadSource}
                        </span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="font-medium text-[#1F302B]">{sub.planName}</div>
                      <div className="text-xs text-slate-400">₹{sub.packageAmount.toLocaleString()} • {sub.planDurationDays} days</div>
                    </td>
                    <td className="py-5">
                      <div className="font-bold text-emerald-600">₹{sub.commissionAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-wide bg-emerald-50 inline-block px-1.5 py-0.5 rounded mt-1">
                        {sub.commissionPercentage}% Rate
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex flex-col gap-1">
                        <div className="text-[10px] flex flex-col">
                          <span className="text-slate-400 font-medium">Purchase</span>
                          <span className="text-slate-700 font-bold">{new Date(sub.purchaseDate).toLocaleDateString()}</span>
                        </div>
                        {sub.attributionExpiresAt && (
                          <div className="text-[10px] flex flex-col">
                            <span className="text-slate-400 font-medium">90D Expiry</span>
                            <span className="text-slate-600">{new Date(sub.attributionExpiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[sub.commissionStatus] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                          {sub.commissionStatus === 'PENDING' && <Clock className="w-3 h-3" />}
                          {sub.commissionStatus === 'ELIGIBLE' && <ShieldCheck className="w-3 h-3" />}
                          {sub.commissionStatus}
                        </span>
                        {sub.commissionStatus === 'PENDING' && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            Clears {new Date(sub.refundWindowEndsAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
