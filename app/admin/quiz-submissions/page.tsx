"use client";

import { useMemo, useState } from "react";
import { Loader2, Search, Filter, Eye, X, RefreshCcw, Check, XCircle, Pause } from "lucide-react";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { toast } from "@/hooks/use-toast";

interface QuizSubmission {
  id: string;
  userId: string | null;
  quizSessionId?: string | null;
  answers: any;
  status: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  insuranceProvider: { id: string; name: string } | null;
  user: {
    id: string;
    mobileNumber: string;
    name: string | null;
  } | null;
}

const statusColors: Record<string, string> = {
  PENDING_REVIEW: "bg-orange-50 text-orange-700 border-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  HOLD: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function QuizSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { data, loading, error, refresh } = useAdminFetch<QuizSubmission[]>("/api/admin/quiz", {
    selector: (res) => res.submissions ?? [],
  });

  const submissions = data ?? [];

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const userMobile = sub.user?.mobileNumber ?? '';
      const userName = sub.user?.name ?? '';
      const sessionId = sub.quizSessionId ?? '';
      const matchesSearch =
        userMobile.includes(searchTerm) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const statsCounts = useMemo(
    () => ({
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "PENDING_REVIEW").length,
      approved: submissions.filter((s) => s.status === "APPROVED").length,
      rejected: submissions.filter((s) => s.status === "REJECTED").length,
    }),
    [submissions]
  );

  const handleStatusUpdate = async (submissionId: string, status: 'APPROVED' | 'REJECTED' | 'HOLD') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/quiz/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: `Quiz ${status.toLowerCase()} successfully`,
        });
        setSelectedSubmission(null);
        setReviewNotes("");
        refresh();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Quiz Submissions</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage user quiz responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by mobile, name, or ID..."
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
              <option value="PENDING_REVIEW">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="HOLD">On Hold</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
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
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-wider text-blue-600">On Hold</p>
            <p className="mt-2 text-2xl font-semibold text-blue-700">{submissions.filter((s) => s.status === "HOLD").length}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-xs uppercase tracking-wider text-red-600">Rejected</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">{statsCounts.rejected}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            Fetching submissions…
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-slate-500">
            <Eye className="h-10 w-10 text-slate-300" />
            <p>No submissions found</p>
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
                    Insurance
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Submitted
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Reviewed
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {sub.user?.name || sub.user?.mobileNumber || "Anonymous"}
                      </div>
                      {sub.user?.name ? (
                        <div className="text-xs text-slate-500">{sub.user.mobileNumber}</div>
                      ) : sub.quizSessionId ? (
                        <div className="text-xs text-slate-500">Session: {sub.quizSessionId}</div>
                      ) : null}
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {sub.insuranceProvider?.name || <span className="text-slate-400">—</span>}
                    </td>
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
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {sub.reviewedAt ? new Date(sub.reviewedAt).toLocaleDateString() : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Answers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedSubmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Quiz Submission Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Submitted by {selectedSubmission.user?.name || selectedSubmission.user?.mobileNumber || "Anonymous"}{
                    selectedSubmission.quizSessionId ? ` (Session: ${selectedSubmission.quizSessionId})` : ""
                  } on{" "}
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="rounded-full p-2 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-6">
              {selectedSubmission.insuranceProvider && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-blue-600">Insurance Provider</p>
                  <p className="mt-1 text-sm font-medium text-blue-900">
                    {selectedSubmission.insuranceProvider.name}
                  </p>
                  <p className="mt-1 text-xs text-blue-700">User selected this provider before taking the quiz</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quiz Answers</h3>
                <div className="space-y-4">
                  {selectedSubmission.answers && Array.isArray(selectedSubmission.answers) ? (
                    selectedSubmission.answers.map((item: any, index: number) => (
                      <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Question {index + 1}</p>
                        <p className="mt-2 text-sm font-medium text-slate-900">{item.question}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          <span className="font-medium text-emerald-700">Answer:</span> {String(item.answer)}
                        </p>
                      </div>
                    ))
                  ) : selectedSubmission.answers && typeof selectedSubmission.answers === 'object' && !Array.isArray(selectedSubmission.answers) ? (
                    Object.entries(selectedSubmission.answers).map(([key, value], index) => (
                      <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Question {index + 1}</p>
                        <p className="mt-2 text-sm font-medium text-slate-900">{key}</p>
                        <p className="mt-2 text-sm text-slate-700">
                          <span className="font-medium text-emerald-700">Answer:</span> {String(value)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-600">
                        {JSON.stringify(selectedSubmission.answers, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedSubmission.reviewNotes && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-orange-600">Review Notes</p>
                  <p className="mt-2 text-sm text-orange-900">{selectedSubmission.reviewNotes}</p>
                </div>
              )}

              {selectedSubmission.status === 'PENDING_REVIEW' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Review Notes (Optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add your review notes here..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'APPROVED')}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'HOLD')}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                      Put on Hold
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'REJECTED')}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`inline-flex mt-1 rounded-full border px-3 py-1 text-xs font-medium ${
                      statusColors[selectedSubmission.status] || "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {selectedSubmission.status.replace("_", " ")}
                  </span>
                </div>
                {selectedSubmission.reviewedAt && (
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Reviewed At</p>
                    <p className="mt-1 text-sm text-slate-700">
                      {new Date(selectedSubmission.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
