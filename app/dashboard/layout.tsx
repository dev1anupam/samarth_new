"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    FileText,
    MapPin,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    Package,
    Users,
    Briefcase,
    BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import GradientText from "@/components/GradientText";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, role, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (window.innerWidth >= 768) {
            setIsSidebarOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (!isMounted) return null;

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { name: "Dashboard", href: `/dashboard/${role}`, icon: LayoutDashboard },
        ...(role === "civilian" ? [
            { name: "My Complaints", href: "/dashboard/civilian/complaints", icon: FileText },
            { name: "Local Projects", href: "/dashboard/civilian/local-projects", icon: MapPin },
            { name: "Schemes", href: "/dashboard/civilian/schemes", icon: Package },
        ] : []),
        ...(role === "contractor" ? [
            { name: "Analytics", href: "/dashboard/contractor", icon: BarChart3 },
            { name: "Workers", href: "/dashboard/contractor/workers", icon: Users },
        ] : []),
        ...(role === "worker" ? [
            { name: "Tender Approvals", href: "/dashboard/worker", icon: FileText },
            { name: "Progress Tracking", href: "/dashboard/worker/progress", icon: Users },
            { name: "Analytics", href: "/dashboard/worker/analytics", icon: BarChart3 },
        ] : []),
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ];

    const handleLogout = async () => {
        await authService.logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen text-slate-50 flex bg-transparent relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50 fixed md:relative h-full",
                isSidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-20 -translate-x-full md:translate-x-0 overflow-hidden"
            )}>
                <div className="p-4 sm:p-6 flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <span className="text-xl font-bold tracking-tight">
                            <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']}>SAMARTH</GradientText>
                        </span>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                                pathname === item.href
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}>
                                <item.icon className="w-5 h-5 shrink-0" />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 gap-3 px-3 py-6"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </Button>

                    <div className="flex items-center gap-3 p-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shrink-0"></div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
                <header className="h-16 sm:h-20 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="shrink-0">
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h2 className="text-lg sm:text-xl font-semibold capitalize truncate">
                            <GradientText colors={['#ffffff', '#cbd5e1', '#ffffff']}>
                                {pathname.split('/').pop()?.replace(/-/g, ' ')}
                            </GradientText>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <LanguageSelector />
                        <Button variant="outline" size="sm" className="hidden xs:flex bg-slate-800 border-slate-700 text-slate-300 h-8 sm:h-9">
                            Support
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                            <Settings className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
