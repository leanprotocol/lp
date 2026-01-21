"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  PenTool,
  Users,
  FileText,
  Layers,
  UserCircle,
  ClipboardList,
  Package,
  CreditCard,
  RefreshCcw,
  MessageSquare,
  Loader2,
  TrendingUp,
} from "lucide-react";

const quickLinks = [
  {
    title: "Users",
    description: "View and manage registered users.",
    href: "/admin/users",
    icon: UserCircle,
  },
  {
    title: "Quiz Submissions",
    description: "Review user quiz responses.",
    href: "/admin/quiz-submissions",
    icon: ClipboardList,
  },
  {
    title: "Subscriptions",
    description: "Manage user subscriptions and plans.",
    href: "/admin/subscriptions",
    icon: Package,
  },
  {
    title: "Plans",
    description: "Create, reorder, and deactivate subscription plans.",
    href: "/admin/plans",
    icon: Layers,
  },
  {
    title: "Payments",
    description: "Track payment transactions.",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Refund Requests",
    description: "Process user refund requests.",
    href: "/admin/refunds",
    icon: RefreshCcw,
  },
  {
    title: "Contact Queries",
    description: "View user inquiries and support.",
    href: "/admin/contact-queries",
    icon: MessageSquare,
  },
  {
    title: "Admins",
    description: "Manage admin accounts.",
    href: "/admin/admins",
    icon: Users,
  },
  {
    title: "Insurance Providers",
    description: "Update coverage and carriers.",
    href: "/admin/insurance-providers",
    icon: ShieldCheck,
  },
  {
    title: "Blog Studio",
    description: "Publish content via Sanity.",
    href: "/studio",
    external: true,
    icon: PenTool,
  },
  {
    title: "Documentation",
    description: "Review SOPs and procedures.",
    href: "https://docs.leanhealth.com",
    external: true,
    icon: FileText,
  },
];

interface DashboardStats {
  users: { total: number; verified: number };
  submissions: { total: number; pending: number };
  plans: { total: number; active: number };
  subscriptions: { total: number; active: number };
  payments: { total: number; revenue: number };
  refunds: { total: number; pending: number };
  queries: { total: number };
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Admin Control Hub</h1>
            <p className="text-sm text-slate-500">
              Centralized dashboard for operations and management
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Total Users</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.users.total}</p>
                <p className="mt-1 text-xs text-emerald-600">{stats.users.verified} verified</p>
              </div>
              <UserCircle className="h-10 w-10 text-slate-300" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Quiz Submissions</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.submissions.total}</p>
                <p className="mt-1 text-xs text-orange-600">{stats.submissions.pending} pending</p>
              </div>
              <ClipboardList className="h-10 w-10 text-slate-300" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Subscriptions</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.subscriptions.total}</p>
                <p className="mt-1 text-xs text-blue-600">{stats.subscriptions.active} active</p>
              </div>
              <Package className="h-10 w-10 text-slate-300" />
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-600">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">₹{stats.payments.revenue.toLocaleString()}</p>
                <p className="mt-1 text-xs text-emerald-600">{stats.payments.total} transactions</p>
              </div>
              <CreditCard className="h-10 w-10 text-emerald-300" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Refund Requests</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.refunds.total}</p>
                <p className="mt-1 text-xs text-orange-600">{stats.refunds.pending} pending</p>
              </div>
              <RefreshCcw className="h-10 w-10 text-slate-300" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Contact Queries</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.queries.total}</p>
                <p className="mt-1 text-xs text-slate-500">Total inquiries</p>
              </div>
              <MessageSquare className="h-10 w-10 text-slate-300" />
            </div>
          </div>
        </div>
      ) : null}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const card = (
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 group-hover:bg-emerald-100">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{link.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{link.description}</p>
                  </div>
                </div>
              </div>
            );

            return link.external ? (
              <a key={link.title} href={link.href} target="_blank" rel="noreferrer" className="h-full">
                {card}
              </a>
            ) : (
              <Link key={link.title} href={link.href} className="h-full">
                {card}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
