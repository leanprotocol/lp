"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AffiliateRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const mobileNumber = formData.get("mobileNumber");
    const referralCode = formData.get("referralCode");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/affiliate/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobileNumber, referralCode, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/affiliate");
      } else {
        setError(data.error || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8EF] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-serif text-2xl text-[#1F302B]">Affiliate Hub</span>
            </Link>
            <h1 className="text-3xl font-serif text-[#1F302B]">Apply for Affiliate Access</h1>
            <p className="text-slate-500 mt-2">Start your premium healthcare practice today</p>
        </div>

        <Card className="border-slate-200 rounded-[2rem] shadow-xl shadow-emerald-900/5 bg-white overflow-hidden">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl font-serif">Registration</CardTitle>
            <CardDescription>Fill in your professional details to get started.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 ml-1">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. Jane Smith"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 ml-1">Work Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-slate-700 ml-1">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="9876543210"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode" className="text-slate-700 ml-1">Referral Code (Affiliate Link Name)</Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  placeholder="e.g. manju"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                />
                <p className="text-[10px] text-slate-400 ml-1">This will be your unique link: leanprotocol.in/your-code</p>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-slate-700 ml-1">Create Password</Label>
                <div className="relative">
                    <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="h-12 pr-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-200 mt-4 group"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Complete Registration <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <p className="text-center text-sm text-slate-500 pt-2">
                Already have an account?{" "}
                <Link href="/affiliate/login" className="text-emerald-600 font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-400">
            By registering, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
