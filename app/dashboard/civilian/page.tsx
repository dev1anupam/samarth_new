"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import GradientText from "@/components/GradientText";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    FileText,
    CheckCircle2,
    Clock,
    Plus,
    ArrowRight,
    TrendingUp,
    Loader2
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export default function CivilianDashboard() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, resolved: 0, inProgress: 0, localProjects: 0 });
    const [recentProgress, setRecentProgress] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchDynamicData = async () => {
            try {
                // Fetch Complaints dynamically
                let complaintsData = [];
                const { data: complaints, error: complaintsError } = await supabase
                    .from('complaints')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (complaintsError) {
                    if (complaintsError.message.includes("Could not find the table") || complaintsError.code === 'PGRST116') {
                        console.warn("Supabase: 'complaints' table not found. Using mock data for dashboard stats.");
                    } else {
                        throw complaintsError;
                    }
                }

                complaintsData = complaints || [];
                const validComplaints = complaintsData;

                // Calculate Stats dynamically
                const resolved = validComplaints.filter((c: any) => c.status === 'Resolved' || c.status === 'resolved').length;
                const inProgress = validComplaints.filter((c: any) => c.status === 'In Progress' || c.status === 'in_progress').length;

                // Fetch local projects dynamically
                const { data: projects, error: projectsError } = await supabase
                    .from('projects')
                    .select('*');

                if (projectsError) throw projectsError;

                const validProjects = projects || [];
                const activeProjects = validProjects.filter((p: any) => p.status === 'accepted' || p.status === 'active' || p.status === 'in-progress').length;

                setStats({
                    total: validComplaints.length,
                    resolved,
                    inProgress,
                    localProjects: activeProjects || validProjects.length
                });

                // Top recent activities
                setRecentProgress(validComplaints.slice(0, 5));

                // Dynamic Chart Formatting
                const monthlyData: Record<string, number> = {};
                const monthsList: string[] = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const monthName = d.toLocaleString('default', { month: 'short' });
                    monthlyData[monthName] = 0;
                    monthsList.push(monthName);
                }

                validComplaints.forEach((c: any) => {
                    const date = new Date(c.created_at || Date.now());
                    const mName = date.toLocaleString('default', { month: 'short' });
                    if (monthlyData[mName] !== undefined) {
                        monthlyData[mName] += 1;
                    }
                });

                const formattedChartData = monthsList.map(m => ({
                    name: m,
                    complaints: monthlyData[m]
                }));
                setChartData(formattedChartData);

            } catch (err: any) {
                console.error("Error loading civilian dashboard:", err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchDynamicData();

        // Realtime Subscription using Supabase
        const channel = supabase
            .channel('complaints-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
                fetchDynamicData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getTimeAgo = (dateStr: string) => {
        if (!dateStr) return 'Just now';
        const date = new Date(dateStr);
        const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (diff < 60) return `${Math.max(1, diff)}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Welcome back, {user?.name || 'Citizen'}</GradientText>
                </h1>
                <p className="text-slate-400 mt-1">Here is what's happening in your constituency today.</p>
            </div>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-900 border-slate-800 shadow-xl shadow-indigo-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Complaints</CardTitle>
                        <FileText className="w-4 h-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-slate-500 mt-1">Total area reports</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-xl shadow-emerald-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Resolved</CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                        <p className="text-xs text-emerald-500 mt-1">
                            {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-xl shadow-amber-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">In Progress</CardTitle>
                        <Clock className="w-4 h-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                        <p className="text-xs text-slate-500 mt-1">Currently being handled</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 shadow-xl shadow-blue-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Local Projects</CardTitle>
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.localProjects}</div>
                        <p className="text-xs text-slate-500 mt-1">Active developments</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dynamic Chart */}
                <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle><GradientText colors={['#818cf8', '#c084fc']} className="ml-0">Complaint Trends</GradientText></CardTitle>
                        <CardDescription>Monthly volume of complaints reported in your area directly from database.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="complaints" stroke="#6366f1" fillOpacity={1} fill="url(#colorComplaints)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions & Dynamic Recent Progress */}
                <div className="space-y-6">
                    <Card className="bg-indigo-600 border-none text-white overflow-hidden relative shadow-lg shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Plus className="w-24 h-24" />
                        </div>
                        <CardHeader>
                            <CardTitle><GradientText colors={['#ffffff', '#e0e7ff']} className="ml-0">File a Complaint</GradientText></CardTitle>
                            <CardDescription className="text-indigo-100">Has something gone wrong? Let us know so we can fix it.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/dashboard/civilian/complaints/new">
                                <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-semibold group">
                                    New Complaint <Plus className="ml-2 w-4 h-4 group-hover:rotate-90 transition-transform" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 flex flex-col h-[350px]">
                        <CardHeader className="shrink-0">
                            <CardTitle className="text-lg"><GradientText colors={['#94a3b8', '#ffffff']} className="ml-0">Recent Progress</GradientText></CardTitle>
                            <CardDescription>Live database updates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 overflow-y-auto">
                            {recentProgress.length === 0 ? (
                                <div className="text-center text-slate-500 text-sm mt-4">
                                    No complaints recorded yet.
                                </div>
                            ) : (
                                recentProgress.map((item, i) => (
                                    <div key={item.id || i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                        <div className="truncate max-w-[150px]">
                                            <p className="text-sm font-medium truncate">{item.title || item.issue_type || "No Title"}</p>
                                            <p className="text-xs text-slate-500">{getTimeAgo(item.created_at)}</p>
                                        </div>
                                        <div className={cn(
                                            "text-[10px] uppercase font-bold px-2 py-1 rounded shrink-0",
                                            (item.status === 'Resolved' || item.status === 'resolved') ? "bg-emerald-500/10 text-emerald-500" :
                                                (item.status === 'In Progress' || item.status === 'in_progress') ? "bg-amber-500/10 text-amber-500" :
                                                    "bg-slate-500/10 text-slate-500"
                                        )}>
                                            {item.status || "Pending"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                        <div className="p-4 pt-0 shrink-0">
                            <Link href="/dashboard/civilian/complaints">
                                <Button variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-transparent p-0 justify-between">
                                    View All Complaints <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
