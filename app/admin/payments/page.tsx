"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Filter, CreditCard, Copy, Check } from "lucide-react";

interface Payment {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: string;
  failureReason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    mobileNumber: string;
  };
  subscription: {
    plan: {
      name: string;
    };
  };
}

const statusColors: Record<string, string> = {
  PROCESSING: "bg-orange-50 text-orange-700 border-orange-200",
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      window.setTimeout(() => {
        setCopiedOrderId((prev) => (prev === orderId ? null : prev));
      }, 1200);
    } catch (error) {
      console.error("Failed to copy order id:", error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.mobileNumber.includes(searchTerm) ||
      payment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statsCounts = {
    total: payments.length,
    success: payments.filter((p) => p.status === "SUCCESS").length,
    processing: payments.filter((p) => p.status === "PROCESSING").length,
    failed: payments.filter((p) => p.status === "FAILED").length,
  };

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Payments</h1>
          <p className="mt-2 text-sm text-slate-500">
            Track and manage all payment transactions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, order ID, or payment ID..."
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
              <option value="SUCCESS">Success</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-600">Total Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{statsCounts.total}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-600">Success</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">{statsCounts.success}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs uppercase tracking-wider text-red-600">Failed</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">{statsCounts.failed}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No payments found</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Plan
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Amount
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Order ID
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {payment.user.name || payment.user.mobileNumber}
                      </div>
                      {payment.user.name && (
                        <div className="text-xs text-slate-500">{payment.user.mobileNumber}</div>
                      )}
                    </td>
                    <td className="py-4 text-sm text-slate-900">{payment.subscription.plan.name}</td>
                    <td className="py-4 text-sm font-medium text-slate-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          statusColors[payment.status] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="group relative inline-flex items-center gap-2">
                        <div
                          className="text-xs font-mono text-slate-600"
                          title={payment.razorpayOrderId}
                        >
                          {payment.razorpayOrderId}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderId(payment.razorpayOrderId)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-700"
                          aria-label="Copy order id"
                          title="Copy order id"
                        >
                          {copiedOrderId === payment.razorpayOrderId ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
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
