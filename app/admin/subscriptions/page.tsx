"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Filter, Package, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Subscription {
  id: string;
  userId: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  createdAt: string;
  rejectionReason?: string | null;
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
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    failureReason?: string | null;
    createdAt?: string;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING_APPROVAL: "bg-orange-50 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  EXPIRED: "bg-slate-50 text-slate-700 border-slate-200",
  SUSPENDED: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-slate-50 text-slate-700 border-slate-200",
  REFUNDED: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [nextStatus, setNextStatus] = useState<string>("ACTIVE");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const normalizeStatus = (status: string) => {
    return status === 'APPROVED' ? 'ACTIVE' : status;
  };

  const statusLabel = (status: string) => {
    const normalized = normalizeStatus(status);
    return normalized === 'ACTIVE' ? 'APPROVED' : normalized;
  };

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

  const handleUpdateStatus = async () => {
    if (!selected) return;
    try {
      setUpdatingStatus(true);
      const payload: any = { status: nextStatus };
      if (nextStatus === "REJECTED") {
        payload.rejectionReason = rejectionReason || undefined;
      }

      if (nextStatus === 'CANCELLED' || nextStatus === 'REFUNDED') {
        const ok = window.confirm(
          `Are you sure you want to mark this subscription as ${nextStatus}? This will end it immediately.`
        );
        if (!ok) return;
      }

      const res = await fetch(`/api/admin/subscriptions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update subscription");
      }

      await fetchSubscriptions();
      setSelected(null);
    } catch (error) {
      console.error("Update subscription error:", error);
      alert(error instanceof Error ? error.message : "Failed to update subscription");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.user.mobileNumber.includes(searchTerm) ||
      sub.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      normalizeStatus(sub.status) === statusFilter ||
      (statusFilter === 'ACTIVE' && sub.status === 'APPROVED');
    return matchesSearch && matchesStatus;
  });

  const statsCounts = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => normalizeStatus(s.status) === "ACTIVE").length,
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
              <option value="ACTIVE">Approved</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      setSelected(sub);
                      setNextStatus(normalizeStatus(sub.status));
                      setRejectionReason(sub.rejectionReason ?? '');
                    }}
                  >
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
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                          statusColors[sub.status] || statusColors[normalizeStatus(sub.status)] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {statusLabel(sub.status).replace("_", " ")}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(sub.id);
                          }}
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription details</DialogTitle>
            <DialogDescription>
              View subscription and update status.
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">User</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {selected.user.name || selected.user.mobileNumber}
                  </p>
                  {selected.user.name ? (
                    <p className="text-xs text-slate-500">{selected.user.mobileNumber}</p>
                  ) : null}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Plan</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{selected.plan.name}</p>
                  <p className="text-xs text-slate-500">
                    ₹{selected.plan.price.toLocaleString()} • {selected.plan.durationDays} days
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{statusLabel(selected.status)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Start</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selected.startDate ? new Date(selected.startDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">End</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selected.endDate ? new Date(selected.endDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Auto renew</p>
                  <p className="mt-1 text-sm text-slate-700">{selected.autoRenew ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {selected.payments?.[0] ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Latest payment</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="text-sm text-slate-700">
                      <span className="text-slate-500">Status:</span> {selected.payments[0].status}
                    </div>
                    <div className="text-sm text-slate-700">
                      <span className="text-slate-500">Amount:</span> ₹{selected.payments[0].amount.toLocaleString()}
                    </div>
                    {selected.payments[0].razorpayOrderId ? (
                      <div className="text-xs font-mono text-slate-600 break-all sm:col-span-2">
                        {selected.payments[0].razorpayOrderId}
                      </div>
                    ) : null}
                    {selected.payments[0].failureReason ? (
                      <div className="text-sm text-red-700 sm:col-span-2">
                        {selected.payments[0].failureReason}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">Update status</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <select
                      value={nextStatus}
                      onChange={(e) => setNextStatus(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="ACTIVE">APPROVED</option>
                      <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="REFUNDED">REFUNDED</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  {nextStatus === 'REJECTED' ? (
                    <input
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Rejection reason"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              type="button"
            >
              Close
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={
                !selected ||
                updatingStatus ||
                (selected &&
                  nextStatus === normalizeStatus(selected.status) &&
                  (nextStatus !== 'REJECTED' || (rejectionReason || '') === (selected.rejectionReason || '')))
              }
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              type="button"
            >
              {updatingStatus ? 'Saving...' : 'Save'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
