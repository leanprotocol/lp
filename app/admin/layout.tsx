"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  PenTool,
  Loader2,
  LogOut,
  Menu,
  UserCircle,
  ClipboardList,
  CreditCard,
  Package,
  Layers,
  RefreshCcw,
  MessageSquare,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Users", href: "/admin/users", icon: UserCircle },
  { label: "Quiz Submissions", href: "/admin/quiz-submissions", icon: ClipboardList },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Package },
  { label: "Plans", href: "/admin/plans", icon: Layers },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Refund Requests", href: "/admin/refunds", icon: RefreshCcw },
  { label: "Contact Queries", href: "/admin/contact-queries", icon: MessageSquare },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Admins", href: "/admin/admins", icon: Users },
  { label: "Insurance", href: "/admin/insurance-providers", icon: ShieldCheck },
  { label: "Blog Studio", href: "/studio", icon: PenTool, external: true },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ name: string | null; email: string } | null>(null);
  const [activePlansCount, setActivePlansCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthPage) {
      fetch('/api/admin/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.admin) {
            setAdminProfile(data.admin);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch admin profile:', error);
        });
    }
  }, [pathname]);

  useEffect(() => {
    if (!isAuthPage) {
      fetch('/api/admin/dashboard')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.stats?.plans?.active !== undefined) {
            setActivePlansCount(data.stats.plans.active);
          }
        })
        .catch((error) => {
          console.error('Failed to fetch admin dashboard stats:', error);
        });
    }
  }, [pathname]);

  const isAuthPage = pathname === "/admin/login";

  const isNavItemActive = (item: (typeof navigation)[number]) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const activeNav = useMemo(() => {
    return navigation.find((item) => isNavItemActive(item))?.label ?? "Overview";
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavItems = () => (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(item);
        return (
          <Link key={item.href} href={item.href} className="block">
            <div
              className={clsx(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition border",
                isActive
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800 shadow-sm"
                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#0E1721]">
      <div className="flex min-h-screen">
        <aside
          className={clsx(
            "hidden lg:flex flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300",
            isCollapsed ? "w-20 px-3" : "w-72 px-6"
          )}
        >
          <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4">
            {isCollapsed ? (
              <p className="text-lg font-semibold text-slate-900">LH</p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-slate-900">Lean Protocol</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">admin console</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center py-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100"
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className={clsx("space-y-2", isCollapsed && "flex flex-col items-center gap-2")}>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                const content = (
                  <div
                    className={clsx(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition border",
                      isActive
                        ? "border-emerald-100 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between">
                        <span>{item.label}</span>
                        {item.href === '/admin/plans' && activePlansCount !== null ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            {activePlansCount}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                );

                const navItem = item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full"
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className="block w-full">
                    {content}
                  </Link>
                );

                return isCollapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  navItem
                );
              })}
            </nav>
          </div>
          <div className="pb-6 border-t border-slate-200 pt-4 space-y-3">
            {adminProfile && (
              <div className={clsx(
                "px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200",
                isCollapsed && "flex justify-center px-2"
              )}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                        {(adminProfile.name || adminProfile.email).charAt(0).toUpperCase()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-xs">
                        <p className="font-semibold">{adminProfile.name || 'Admin'}</p>
                        <p className="text-slate-500">{adminProfile.email}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {(adminProfile.name || adminProfile.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {adminProfile.name || 'Admin'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{adminProfile.email}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={clsx(
                "w-full justify-center gap-3 text-slate-600 hover:bg-slate-100",
                isCollapsed ? "px-0" : "px-4 justify-start"
              )}
            >
              {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {!isCollapsed && (isLoggingOut ? "Signing out..." : "Sign out")}
            </Button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8 shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Current Space</p>
              <p className="text-lg font-semibold text-slate-900">{activeNav}</p>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                className="text-slate-500 border-slate-200"
                onClick={() => setIsMobileNavOpen((prev) => !prev)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-slate-500 border-slate-200"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          {isMobileNavOpen ? (
            <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
              {renderNavItems()}
            </div>
          ) : null}

          <main className="flex-1 overflow-y-auto bg-[#F4F6F9] px-4 py-8 lg:px-12">{children}</main>
        </div>
      </div>
    </div>
  );
}
