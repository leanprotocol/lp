"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AffiliatePlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/affiliate/plans");
      const data = await res.json();
      if (data.success) setPlans(data.plans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1F302B]">My Plans</h1>
          <p className="text-slate-500 inter text-sm">Manage your healthcare subscription offerings</p>
        </div>
        <Button className="rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white gap-2">
          <Plus className="w-4 h-4" /> Create New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No plans found</h3>
          <p className="text-slate-500 text-sm mb-6">Start by creating your first subscription tier.</p>
          <Button variant="outline" className="rounded-full border-[#1F302B] text-[#1F302B]">
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="rounded-3xl border-slate-200 overflow-hidden group hover:border-emerald-300 transition-all shadow-sm hover:shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-serif text-[#1F302B]">{plan.name}</CardTitle>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${plan.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#1F302B]">₹{plan.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">/ {plan.durationDays} days</span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">{plan.description || "No description provided."}</p>
                
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">ID: {plan.id.split('-')[0]}...</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
