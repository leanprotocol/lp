"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, Wallet, ArrowUpRight, History, CheckCircle2, Clock } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  platformFee: number | null;
  affiliateEarnings: number | null;
  settlementStatus: string;
  createdAt: string;
  user: {
    name: string | null;
    mobileNumber: string;
  };
  subscription: {
    plan: {
      name: string;
    };
  };
}

interface Summary {
  totalGross: number;
  totalNet: number;
  totalPlatform: number;
  unsettled: number;
}

export default function AffiliateEarningsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/earnings");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#1F302B]">Earnings</h1>
        <p className="text-slate-500 inter text-sm">Track your revenue and pending settlements</p>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] bg-[#1F302B] p-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest font-bold text-emerald-100/50">Total Net Earnings</p>
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-4xl font-serif">₹{summary?.totalNet.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/70">
            <ArrowUpRight className="w-3 h-3" />
            <span>Lifetime payouts and pending</span>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Unsettled Balance</p>
            <Clock className="h-6 w-6 text-orange-400" />
          </div>
          <p className="text-4xl font-serif text-[#1F302B]">₹{summary?.unsettled.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span>To be transferred to your account</span>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Gross Sales</p>
            <DollarSign className="h-6 w-6 text-slate-300" />
          </div>
          <p className="text-4xl font-serif text-[#1F302B]">₹{summary?.totalGross.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span>₹{summary?.totalPlatform.toLocaleString()} Platform fees collected</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-serif text-[#1F302B] flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Transaction History
            </h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-20">
            <DollarSign className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No successful transactions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">User / Plan</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Earnings</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Settlement</th>
                  <th className="py-4 px-8 text-xs font-bold uppercase tracking-widest text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-8">
                      <div className="font-bold text-[#1F302B]">{p.user.name || "Anonymous"}</div>
                      <div className="text-xs text-slate-400">{p.subscription.plan.name}</div>
                    </td>
                    <td className="py-6 px-8 text-sm font-medium text-slate-600">₹{p.amount.toLocaleString()}</td>
                    <td className="py-6 px-8 font-bold text-emerald-600">₹{p.affiliateEarnings?.toLocaleString()}</td>
                    <td className="py-6 px-8">
                        <div className="flex items-center gap-2">
                            {p.settlementStatus === 'SETTLED' ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                    <CheckCircle2 className="w-3 h-3" /> SETTLED
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-100">
                                    <Clock className="w-3 h-3" /> PENDING
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="py-6 px-8 text-sm text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
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
