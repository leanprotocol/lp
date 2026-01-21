"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, MessageSquare, Mail, Phone } from "lucide-react";

interface ContactQuery {
  id: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  message: string;
  createdAt: string;
  user: {
    id: string;
    mobileNumber: string;
    name: string | null;
  } | null;
}

export default function ContactQueriesPage() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      if (data.success) {
        setQueries(data.contactQueries);
      }
    } catch (error) {
      console.error("Failed to fetch contact queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueries = queries.filter((query) =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.mobileNumber.includes(searchTerm) ||
    query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Contact Queries</h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage user inquiries and support requests
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total Queries</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{queries.length}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-wider text-blue-600">Registered Users</p>
            <p className="mt-2 text-2xl font-semibold text-blue-700">
              {queries.filter((q) => q.user !== null).length}
            </p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-xs uppercase tracking-wider text-purple-600">Guest Queries</p>
            <p className="mt-2 text-2xl font-semibold text-purple-700">
              {queries.filter((q) => q.user === null).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">No contact queries found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition cursor-pointer"
                onClick={() => setSelectedQuery(query)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <MessageSquare className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{query.name}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {query.mobileNumber}
                          </span>
                          {query.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {query.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{query.message}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        {new Date(query.createdAt).toLocaleDateString()} at{" "}
                        {new Date(query.createdAt).toLocaleTimeString()}
                      </span>
                      {query.user && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                          Registered User
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedQuery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedQuery(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Contact Query Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Submitted on {new Date(selectedQuery.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{selectedQuery.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Mobile Number</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{selectedQuery.mobileNumber}</p>
                </div>
                {selectedQuery.email && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedQuery.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Message</p>
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
                {selectedQuery.user && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs uppercase tracking-wider text-blue-600">User Account</p>
                    <p className="mt-1 text-sm font-medium text-blue-900">
                      {selectedQuery.user.name || selectedQuery.user.mobileNumber}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedQuery(null)}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
