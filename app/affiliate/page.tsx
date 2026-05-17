"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  UserCircle,
  Package,
  CreditCard,
  RefreshCcw,
  Loader2,
  DollarSign,
  Calendar,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  MousePointerClick,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  funnel: {
    clicks: number;
    leadsCount: number;
    conversions: number;
    refundWindowPending: number;
    eligible: number;
    paid: number;
  };
  conversionRate: number;
  commissions: {
    total: number;
    pending: number;
    eligible: number;
    paid: number;
  };
}

interface RecentConversion {
  id: string;
  customerName: string;
  customerPhone: string;
  leadSource: string;
  planName: string;
  packageAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  commissionStatus: string;
  date: string;
}

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentConversions, setRecentConversions] = useState<RecentConversion[]>([]);
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStats, resMe] = await Promise.all([
        fetch("/api/affiliate/dashboard"),
        fetch("/api/affiliate/me")
      ]);

      if (resStats.status === 401 || resMe.status === 401) {
        router.push("/affiliate/login");
        return;
      }

      const dataStats = await resStats.json();
      const dataMe = await resMe.json();

      if (dataStats.success) {
        setStats({
          funnel: dataStats.funnel,
          conversionRate: dataStats.conversionRate,
          commissions: dataStats.commissions,
        });
        setRecentConversions(dataStats.recentConversions);
        setReferralLink(dataStats.referralLink);
      }
      if (dataMe.success) setAffiliate(dataMe.affiliate);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/affiliate/auth/logout", { method: "POST" });
    router.push("/affiliate/login");
  };

  const handleDownloadStatement = () => {
    const month = new Date().toISOString().slice(0, 7); // Current month YYYY-MM
    window.location.href = `/api/affiliate/export-statement?month=${month}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDF8EF]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
            <TrendingUp className="h-7 w-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#1F302B]">Welcome back, {affiliate?.name}</h1>
            <p className="text-sm text-slate-500 inter">
              Here's your affiliate performance overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
      </header>

      {/* Referral Link Card */}
      <div className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-lg shadow-emerald-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <h2 className="text-xl font-serif">Your Referral Link</h2>
                <p className="text-emerald-100/80 text-sm">Share this link to capture leads and earn commissions.</p>
                <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-xl p-3 border border-white/20">
                    <code className="text-sm font-bold flex-1 break-all">{referralLink}</code>
                </div>
            </div>
            <Button 
                onClick={copyReferralLink}
                className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full font-bold px-8 h-12 shadow-sm"
            >
                Copy Link
            </Button>
        </div>
      </div>

      {/* Funnel Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">Total Clicks</p>
            <MousePointerClick className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-serif text-[#1F302B]">{stats?.funnel.clicks.toLocaleString()}</p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">Leads</p>
            <Users className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-serif text-[#1F302B]">{stats?.funnel.leadsCount.toLocaleString()}</p>
          <div className="mt-2 text-xs">
            <span className="text-emerald-600 font-bold">{stats?.conversionRate.toFixed(1)}%</span>
            <span className="text-slate-400 ml-1">conversion</span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400">Conversions</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-serif text-[#1F302B]">{stats?.funnel.conversions.toLocaleString()}</p>
          <div className="mt-2 text-xs text-slate-400">Total payments</div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Refund Window</p>
            <Clock className="h-5 w-5 text-orange-400" />
          </div>
          <p className="text-3xl font-serif text-[#1F302B]">{stats?.funnel.refundWindowPending.toLocaleString()}</p>
          <div className="mt-2 text-xs text-slate-400">Pending 28 days</div>
        </div>

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          {/* <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600">Eligible (Ready)</p>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div> */}
          <p className="text-3xl font-serif text-emerald-700">{stats?.funnel.eligible.toLocaleString()}</p>
          <div className="mt-2 text-xs">
            <span className="text-emerald-600 font-bold">₹{stats?.commissions.eligible.toLocaleString()}</span>
            <span className="text-emerald-700/60 ml-1">amount</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Conversions */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-[#1F302B]">Recent Conversions</h2>
            <Link href="/affiliate/subscriptions" className="text-sm text-emerald-600 hover:underline">View All</Link>
          </div>
          
          <div className="rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Plan</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Commission</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentConversions.length > 0 ? (
                    recentConversions.map((conv) => (
                      <tr key={conv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-[#1F302B]">{conv.customerName}</div>
                          <div className="text-xs text-slate-400">{conv.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{conv.planName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">₹{conv.packageAmount.toLocaleString()} • {conv.leadSource}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-emerald-600">₹{conv.commissionAmount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{conv.commissionPercentage}% Rate</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            conv.commissionStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            conv.commissionStatus === 'ELIGIBLE' ? 'bg-blue-100 text-blue-800' :
                            conv.commissionStatus === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {conv.commissionStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                        No conversions yet. Start sharing your referral link!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar info */}
        <section className="space-y-6">
            <h2 className="text-2xl font-serif text-[#1F302B]">Quick Actions</h2>
            <div className="grid gap-4">
                <Link href="/affiliate/settings" className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                            <Settings className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="font-bold text-[#1F302B]">Account Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </Link>
                <Link href="/affiliate/earnings" className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                            <DollarSign className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="font-bold text-[#1F302B]">Payout History</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </Link>
                <button 
                  onClick={handleDownloadStatement}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                            <FileText className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="font-bold text-[#1F302B]">Download Statement</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </button>
            </div>
            
            <div className="rounded-[2rem] bg-[#1F302B] p-8 text-white relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-xl font-serif">Total Earnings</h3>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
                    Paid
                  </div>
                </div>
                <p className="text-5xl font-serif text-emerald-400 relative z-10 mb-6">
                  ₹{stats?.commissions.paid.toLocaleString()}
                </p>
                <div className="space-y-3 relative z-10 mt-4 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-emerald-100/60 text-sm">1 Month Plan</span>
                        <span className="font-bold text-emerald-400">10%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-emerald-100/60 text-sm">3 Months Plan</span>
                        <span className="font-bold text-emerald-400">8%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-emerald-100/60 text-sm">6 Months Plan</span>
                        <span className="font-bold text-emerald-400">6%</span>
                    </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
            </div>
        </section>
      </div>
    </div>
  );
}
