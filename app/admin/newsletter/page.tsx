"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Mail, Trash2, Download } from "lucide-react";

interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/newsletter?status=${statusFilter}`);
      const data = await res.json();
      console.log("Newsletter API response:", data); // Debug log
      if (data.success) {
        setSubscriptions(data.data);
      } else {
        setError(data.error || "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Failed to fetch newsletter subscriptions:", error);
      setError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      setDeleting(id);
      const res = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    } finally {
      setDeleting(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed At", "Unsubscribed At"];
    const rows = filteredSubscriptions.map((sub) => [
      sub.email,
      sub.isActive ? "Active" : "Inactive",
      new Date(sub.subscribedAt).toLocaleString(),
      sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleString() : "N/A",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage newsletter subscriptions and export subscriber lists
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredSubscriptions.length === 0}
          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                statusFilter === 'inactive'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-600">Error: {error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total Subscribers</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{subscriptions.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs uppercase tracking-wider text-emerald-600">Active</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {subscriptions.filter((s) => s.isActive).length}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs uppercase tracking-wider text-orange-600">Unsubscribed</p>
            <p className="mt-2 text-2xl font-semibold text-orange-700">
              {subscriptions.filter((s) => !s.isActive).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No newsletter subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Email
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Subscribed At
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Unsubscribed At
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          sub.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(sub.subscribedAt).toLocaleDateString()} at{" "}
                      {new Date(sub.subscribedAt).toLocaleTimeString()}
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {sub.unsubscribedAt
                        ? `${new Date(sub.unsubscribedAt).toLocaleDateString()} at ${new Date(
                            sub.unsubscribedAt
                          ).toLocaleTimeString()}`
                        : "N/A"}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deleting === sub.id}
                        className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        {deleting === sub.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                        Delete
                      </button>
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
