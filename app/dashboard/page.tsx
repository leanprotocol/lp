"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Lock, LogOut, Eye, EyeOff, Check, AlertCircle, Shield, LifeBuoy } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name?: string;
  mobileNumber: string;
  isVerified: boolean;
  createdAt: string;
}

interface ActiveSubscription {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "plan">("profile");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMe = await fetch("/api/user/me");
        if (resMe.status === 401 || resMe.status === 403) {
          router.replace(`/login?redirect=${encodeURIComponent("/dashboard")}`);
          return;
        }
        if (resMe.ok) {
          const dataMe = await resMe.json();
          if (dataMe.success && dataMe.user) {
            setProfile(dataMe.user);
            setActiveSubscription(dataMe.activeSubscription || null);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordSaving(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Password updated successfully" });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const sidebarSections = useMemo(
    () => [
      {
        title: "Account",
        items: [
          { id: "profile", label: "Profile" },
          { id: "security", label: "Security" },
        ],
      },
      {
        title: "Subscription",
        items: [
          { id: "plan", label: "Active Plan" },
          { id: "billing", label: "Billing", disabled: true },
          { id: "history", label: "History", disabled: true },
        ],
      },
      {
        title: "Support",
        items: [
          { id: "referrals", label: "Referrals", disabled: true },
          { id: "help", label: "Help Center", disabled: true },
        ],
      },
    ],
    []
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  };

  const renderMainContent = () => {
    if (!profile) return null;

    if (activeSection === "plan") {
      return (
        <Card className="border-[#DCCEB9] bg-[#FFFDF8] shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-[0.2em] text-xs text-[#9A8570]">
              Subscription
            </CardDescription>
            <CardTitle className="text-2xl text-[#1F302B]">Active Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeSubscription ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
                    <p className="text-xs uppercase text-[#9A8570] mb-1">Plan Name</p>
                    <p className="text-lg font-semibold text-[#1F302B]">{activeSubscription.planName}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
                    <p className="text-xs uppercase text-[#9A8570] mb-1">Auto Renew</p>
                    <p className="text-lg font-semibold text-[#1F302B]">
                      {activeSubscription.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
                  <p className="text-xs uppercase text-[#9A8570] mb-1">Plan Period</p>
                  <p className="text-sm text-[#4A3C2F]">
                    {new Date(activeSubscription.startDate).toLocaleDateString()} –{" "}
                    {new Date(activeSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-[#4A3C2F]">
                    Need to make changes? Reach out to our care team to adjust your plan or billing
                    preferences.
                  </p>
                  <Button
                    asChild
                    className="rounded-full bg-[#00C896] hover:bg-[#00b285] text-[#0D3B2A] font-semibold"
                  >
                    <Link href="/contact">Contact support</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-10 h-10 text-[#9A8570] mx-auto mb-4" />
                <p className="text-sm text-[#4A3C2F] mb-4">
                  You don’t have an active plan yet. Explore our programs to get started.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white px-6"
                >
                  <Link href="/pricing">Browse Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "security") {
      return (
        <Card className="border-[#DCCEB9] bg-[#FFFDF8] shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase tracking-[0.2em] text-xs text-[#9A8570]">
              Account Security
            </CardDescription>
            <CardTitle className="text-2xl text-[#1F302B]">Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="relative">
                <Label htmlFor="currentPassword" className="text-[#2E271F] mb-2 block">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  className="h-12 pr-12 rounded-2xl border-[#E2D5C0] bg-white text-base text-[#1F302B]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-4 top-10 text-[#7A6A58]"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Label htmlFor="newPassword" className="text-[#2E271F] mb-2 block">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="h-12 pr-12 rounded-2xl border-[#E2D5C0] bg-white text-base text-[#1F302B]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-10 text-[#7A6A58]"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                type="submit"
                disabled={passwordSaving}
                className="w-full h-12 rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white"
              >
                {passwordSaving ? "Updating..." : "Save Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-[#DCCEB9] bg-[#FFFDF8] shadow-sm">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase tracking-[0.2em] text-xs text-[#9A8570]">
            Account
          </CardDescription>
          <CardTitle className="text-2xl text-[#1F302B]">Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
              <p className="text-xs uppercase text-[#9A8570] mb-1">Full Name</p>
              <p className="text-lg font-semibold text-[#1F302B]">{profile?.name || "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
              <p className="text-xs uppercase text-[#9A8570] mb-1">Mobile</p>
              <p className="text-lg font-semibold text-[#1F302B]">{profile?.mobileNumber}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E8DBC7] p-4 bg-white">
            <p className="text-xs uppercase text-[#9A8570] mb-3">Update Name</p>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={profile?.name || ""}
                placeholder="Enter your full name"
                className="h-12 rounded-2xl border-[#E3D4BE] bg-[#FBF6ED] text-base text-[#1F302B]"
              />
              <Button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white px-6"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F4EA] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#1F302B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#7A6A58] text-sm">Preparing your personal space…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F9F4EA] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm max-w-sm w-full space-y-6">
          <p className="text-[#7A6A58]">Please log in to view your dashboard.</p>
          <Button asChild className="w-full h-12 rounded-full bg-[#1F302B] hover:bg-[#2C3E3A] text-white">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F4EA]">
      <header className="bg-[#FDF8EF] border-b border-[#E6D8C4]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl text-[#1F302B]">
            Lean Health
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="rounded-full border-[#1F302B] text-[#1F302B] hover:bg-[#1F302B] hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-[#F4E7D6] border border-[#E2D4C1] rounded-3xl p-6 space-y-8">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9A8570] mb-3">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={item.disabled}
                        onClick={() => !item.disabled && setActiveSection(item.id as any)}
                        className={`w-full text-left px-4 py-2 rounded-xl text-sm ${
                          active
                            ? "bg-white text-[#1F302B] shadow-sm"
                            : "text-[#7A6A58] hover:bg-white/60"
                        } ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="border-t border-[#E2D4C1] pt-4 space-y-2">
              <button className="w-full text-left text-sm text-[#7A6A58] flex items-center gap-2">
                <LifeBuoy className="w-4 h-4" />
                Support
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-[#7A6A58] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1 space-y-6">
          {renderMainContent()}
          {message && (
            <div
              className={`px-4 py-3 rounded-2xl border ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              } flex items-center gap-3`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
