"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Filter, RefreshCcw } from "lucide-react";

interface RefundRequest {
  id: string;
  reason: string;
  status: string;
  refundAmount: number | null;
  adminNotes: string | null;
  requestedAt: string;
  processedAt: string | null;
  user: {
    id: string;
    name: string | null;
    mobileNumber: string;
  };
  subscription: {
    plan: {
      name: string;
      price: number;
    };
    payments: Array<{
      amount: number;
    }>;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-orange-50 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/refunds");
      const data = await res.json();
      if (data.success) {
        setRefunds(data.refundRequests);
      }
    } catch (error) {
      console.error("Failed to fetch refunds:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.user.mobileNumber.includes(searchTerm) ||
      refund.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsCounts = {
    total: refunds.length,
    pending: refunds.filter((r) => r.status === "PENDING").length,
    approved: refunds.filter((r) => r.status === "APPROVED").length,
    rejected: refunds.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Refund Requests</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and process user refund requests
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user or reason..."
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
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{statsCounts.total}</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs uppercase tracking-wider text-orange-600">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-orange-700">{statsCounts.pending}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-600">Approved</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">{statsCounts.approved}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs uppercase tracking-wider text-red-600">Rejected</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">{statsCounts.rejected}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <RefreshCcw className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No refund requests found</p>
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
                    Amount Paid
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Reason
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Requested
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {refund.user.name || refund.user.mobileNumber}
                      </div>
                      {refund.user.name && (
                        <div className="text-xs text-slate-500">{refund.user.mobileNumber}</div>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">{refund.subscription.plan.name}</div>
                      <div className="text-xs text-slate-500">₹{refund.subscription.plan.price.toLocaleString()}</div>
                    </td>
                    <td className="py-4 text-sm font-medium text-slate-900">
                      ₹{(refund.subscription.payments[0]?.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <div className="max-w-xs text-sm text-slate-600 truncate">
                        {refund.reason}
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          statusColors[refund.status] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(refund.requestedAt).toLocaleDateString()}
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
