"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/affiliate" },
  { icon: Package, label: "My Plans", href: "/affiliate/plans" },
  { icon: Users, label: "Subscriptions", href: "/affiliate/subscriptions" },
  { icon: DollarSign, label: "Earnings", href: "/affiliate/earnings" },
];

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated as affiliate
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/affiliate/me");
        if (!res.ok) {
          router.push("/affiliate/login");
        }
      } catch {
        router.push("/affiliate/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/affiliate/auth/logout", { method: "POST" });
    router.push("/affiliate/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FDF8EF] flex">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } hidden md:flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <Link href="/affiliate" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-serif text-xl text-[#1F302B] whitespace-nowrap">Affiliate Hub</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : ""}`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-8 space-y-2">
          <Link
            href="/affiliate/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              pathname === "/affiliate/settings"
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Settings className={`w-5 h-5 ${pathname === "/affiliate/settings" ? "text-emerald-600" : ""}`} />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Log Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
            {children}
        </div>
      </main>
    </div>
  );
}
