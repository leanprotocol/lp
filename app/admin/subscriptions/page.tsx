"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Filter, Package } from "lucide-react";

interface Subscription {
  id: string;
  userId: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  createdAt: string;
  user: {
    id: string;
    mobileNumber: string;
    name: string | null;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
  };
  payments: Array<{
    id: string;
    amount: number;
    status: string;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING_APPROVAL: "bg-orange-50 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  EXPIRED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/subscriptions");
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (subscriptionId: string) => {
    try {
      setApprovingId(subscriptionId);
      const res = await fetch(`/api/admin/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to approve subscription");
      }
      await fetchSubscriptions();
    } catch (error) {
      console.error("Approve subscription error:", error);
      alert(error instanceof Error ? error.message : "Failed to approve subscription");
    } finally {
      setApprovingId(null);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user.mobileNumber.includes(searchTerm) ||
      sub.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsCounts = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "ACTIVE").length,
    pending: subscriptions.filter((s) => s.status === "PENDING_APPROVAL").length,
    expired: subscriptions.filter((s) => s.status === "EXPIRED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Subscriptions</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage user subscriptions and plans
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{statsCounts.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-wider text-blue-600">Active</p>
            <p className="mt-2 text-2xl font-semibold text-blue-700">{statsCounts.active}</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs uppercase tracking-wider text-orange-600">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-orange-700">{statsCounts.pending}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Expired</p>
            <p className="mt-2 text-2xl font-semibold text-slate-700">{statsCounts.expired}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No subscriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Plan
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Start Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    End Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Auto Renew
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {sub.user.name || sub.user.mobileNumber}
                      </div>
                      {sub.user.name && (
                        <div className="text-xs text-slate-500">{sub.user.mobileNumber}</div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">{sub.plan.name}</div>
                      <div className="text-xs text-slate-500">{sub.plan.durationDays} days</div>
                    </td>
                    <td className="py-4 text-sm text-slate-900">₹{sub.plan.price.toLocaleString()}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          statusColors[sub.status] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {sub.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4">
                      {sub.autoRenew ? (
                        <span className="text-xs text-emerald-600">Yes</span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {sub.status === "PENDING_APPROVAL" ? (
                        <button
                          onClick={() => handleApprove(sub.id)}
                          disabled={approvingId === sub.id}
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {approvingId === sub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
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
