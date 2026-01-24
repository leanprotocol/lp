"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0C1A16] flex items-center justify-center text-white">
          <p className="text-sm tracking-[0.4em] uppercase text-white/60">
            Loading admin console…
          </p>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      const redirectTo = searchParams.get("redirect") || "/admin";
      router.replace(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C1A16] via-[#12221D] to-[#101010] flex items-center justify-center px-4 py-12 text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="hidden lg:flex flex-col justify-between bg-white/5 rounded-l-3xl p-10 border-r border-white/5">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Lean Protocol Admin</p>
            <h1 className="mt-6 text-4xl font-semibold leading-snug">
              Secure console for <span className="text-emerald-300">care administrators</span>
            </h1>
            <p className="mt-4 text-white/70 text-lg max-w-sm">
              Manage insurance coverage, quiz submissions, user onboarding, and operational insights from a single control plane.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            SOC2 aligned. All activity monitored.
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="lg:hidden flex items-center gap-3 text-white mb-10">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
            <div>
              <p className="uppercase text-xs tracking-[0.4em] text-white/50">Lean Protocol Admin</p>
              <h1 className="text-2xl font-semibold mt-2">Secure Portal</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-white/50">Work Email</label>
              <div className="mt-2 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@leanhealth.com"
                  className="pl-12 h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-white/50">Password</label>
              <div className="mt-2 relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-emerald-400"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-3 rounded-2xl border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-emerald-400 text-[#0C1A16] font-semibold text-lg hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating…
                </span>
              ) : (
                "Enter Admin Console"
              )}
            </Button>

            <p className="text-xs text-white/50 text-center">
              Access is monitored. Contact platform lead for account provisioning.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
