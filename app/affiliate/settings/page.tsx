"use client";

import { useEffect, useState } from "react";
import { Loader2, User, Mail, Phone, Lock } from "lucide-react";

export default function AffiliateSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/affiliate/me");
      const data = await res.json();
      if (data.success) {
        setProfile(data.affiliate);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-serif text-[#1F302B]">Account Settings</h1>
        <p className="text-slate-500 inter text-sm mt-1">View your profile details and preferences</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${profile?.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {profile?.isActive ? 'Active Account' : 'Inactive Account'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${profile?.isVerified ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                {profile?.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm">
                {profile?.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Mobile Number
              </label>
              <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm">
                {profile?.mobileNumber}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
              <Lock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-orange-800">Need to update your details?</h3>
                <p className="text-sm text-orange-600 mt-1">
                  For security reasons, updating your email address or mobile number requires administrator approval. Please contact the platform admin to process these changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
