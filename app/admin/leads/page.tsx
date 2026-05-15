"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Filter, Edit, Trash2, Eye, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  mobileNumber: string;
  source: string;
  isDuplicate: boolean;
  status: string;
  createdAt: string;
  affiliate: {
    id: string;
    name: string;
    referralCode: string;
  } | null;
  commissions: Array<{
    id: string;
    amount: number;
    percentage: number;
    status: string;
  }>;
}

interface Affiliate {
  id: string;
  name: string;
  referralCode: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    affiliateId: "",
    source: "LANDING_PAGE",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  useEffect(() => {
    if (isCreateModalOpen) {
      fetchAffiliates();
    }
  }, [isCreateModalOpen]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliates = async () => {
    try {
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      if (data.success) {
        setAffiliates(data.affiliates);
      }
    } catch (error) {
      console.error("Failed to fetch affiliates:", error);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.firstName || !newLead.mobileNumber) {
      alert("Name and Mobile Number are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead)
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        setNewLead({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          affiliateId: "",
          source: "LANDING_PAGE",
          notes: ""
        });
        fetchLeads();
      } else {
        alert(data.error || "Failed to create lead");
      }
    } catch (error) {
      console.error("Create lead error:", error);
      alert("Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;
    
    try {
      setIsDeleting(id);
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Manually deleted from admin panel" })
      });
      
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter(l => l.id !== id));
      } else {
        alert(data.error || "Failed to delete lead");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete lead");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-sm text-slate-500">Manage affiliate leads, conversions, and status.</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Lead
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <button type="submit" className="hidden" />
          </form>
          
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-8 py-2 text-sm focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONVERTED">Converted</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex py-12 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No leads found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">Customer Info</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">Attributed To</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600">Commissions</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{lead.firstName} {lead.lastName}</div>
                      <div className="text-sm text-slate-500">{lead.mobileNumber}</div>
                      {lead.email && <div className="text-xs text-slate-400">{lead.email}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {lead.affiliate ? (
                        <div>
                          <div className="text-sm font-medium text-slate-900">{lead.affiliate.name}</div>
                          <div className="text-xs text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded font-mono mt-1">
                            {lead.affiliate.referralCode}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                          lead.status === 'CONVERTED' ? 'bg-emerald-100 text-emerald-700' :
                          lead.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lead.status}
                        </span>
                        {lead.isDuplicate && (
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                            Duplicate
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.commissions.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {lead.commissions.map(c => (
                            <div key={c.id} className="text-xs">
                              <span className="font-medium text-slate-900">₹{c.amount}</span>
                              <span className={`ml-2 px-1.5 rounded text-[10px] font-medium ${
                                c.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                                c.status === 'ELIGIBLE' ? 'bg-blue-50 text-blue-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {c.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Inline actions placeholder */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteLead(lead.id)}
                          disabled={isDeleting === lead.id}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        >
                          {isDeleting === lead.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateLead} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name *</label>
                  <Input 
                    value={newLead.firstName}
                    onChange={e => setNewLead({...newLead, firstName: e.target.value})}
                    placeholder="e.g. Rahul"
                    className="rounded-xl border-slate-200"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                  <Input 
                    value={newLead.lastName}
                    onChange={e => setNewLead({...newLead, lastName: e.target.value})}
                    placeholder="e.g. Sharma"
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number *</label>
                <Input 
                  value={newLead.mobileNumber}
                  onChange={e => setNewLead({...newLead, mobileNumber: e.target.value})}
                  placeholder="10 digit number"
                  className="rounded-xl border-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <Input 
                  value={newLead.email}
                  onChange={e => setNewLead({...newLead, email: e.target.value})}
                  type="email"
                  placeholder="customer@example.com"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Attributed Affiliate</label>
                <select 
                  value={newLead.affiliateId}
                  onChange={e => setNewLead({...newLead, affiliateId: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                >
                  <option value="">None (Organic)</option>
                  {affiliates.map(aff => (
                    <option key={aff.id} value={aff.id}>{aff.name} ({aff.referralCode})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal Notes</label>
                <textarea 
                  value={newLead.notes}
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  placeholder="Add any specific context about this lead..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Lead"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
