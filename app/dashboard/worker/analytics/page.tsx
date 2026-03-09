"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Activity,
    IndianRupee,
    Clock,
    Target,
    Zap,
    Scale,
    PieChart as PieIcon,
    LineChart as LineIcon,
    ArrowUpRight,
    Search,
    ShieldCheck,
    Cpu,
    Loader2
} from "lucide-react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    RadialBarChart,
    RadialBar,
    Legend
} from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import GradientText from "@/components/GradientText"
import Prism from "@/components/Prism"
import { cn } from "@/lib/utils"

// Data for Government Execution Trends
const EXECUTION_TREND_DATA = [
    { name: 'Jan', completed: 45, target: 50, budget: 120 },
    { name: 'Feb', completed: 52, target: 55, budget: 145 },
    { name: 'Mar', completed: 68, target: 60, budget: 180 },
    { name: 'Apr', completed: 58, target: 65, budget: 160 },
    { name: 'May', completed: 75, target: 70, budget: 220 },
    { name: 'Jun', completed: 82, target: 75, budget: 240 },
];

const SECTOR_DISTRIBUTION = [
    { name: 'Transport (Metro/Bus)', value: 45, color: '#6366f1' },
    { name: 'PWD Infrastructure', value: 30, color: '#10b981' },
    { name: 'Education Hubs', value: 15, color: '#f59e0b' },
    { name: 'Health (Clinics)', value: 10, color: '#f43f5e' },
];

const EFFICIENCY_GAUGE = [
    { name: 'Logistics', value: 85, fill: '#6366f1' },
    { name: 'Labor Efficiency', value: 72, fill: '#10b981' },
    { name: 'Budget Utilization', value: 92, fill: '#f59e0b' },
];

export default function AnalyticsDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState(EXECUTION_TREND_DATA);
    const [auditStats, setAuditStats] = useState({
        passRate: "98.2",
        status: "High compliance",
        isHighRisk: false
    });
    const [isForecasting, setIsForecasting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const runAIForecast = async () => {
        if (isForecasting) return;
        setIsForecasting(true);
        try {
            // 1. Forecast Project Velocity
            const velocityInput = [
                { date: "2024-01-01", velocity_score: 45 },
                { date: "2024-02-01", velocity_score: 52 },
                { date: "2024-03-01", velocity_score: 68 },
                { date: "2024-04-01", velocity_score: 58 },
                { date: "2024-05-01", velocity_score: 75 },
                { date: "2024-06-01", velocity_score: 82 },
            ];

            const vRes = await fetch("http://localhost:8000/api/forecast/velocity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ historical_data: velocityInput })
            });

            if (vRes.ok) {
                const forecast = await vRes.json();
                const newTrendData = [...EXECUTION_TREND_DATA];
                const months = ['Jul', 'Aug', 'Sep'];
                for (let i = 0; i < 3 && i < forecast.length; i++) {
                    newTrendData.push({
                        name: months[i] + ' (AI)',
                        completed: parseFloat(forecast[i].predicted_velocity.toFixed(1)),
                        target: EXECUTION_TREND_DATA[EXECUTION_TREND_DATA.length - 1].target + (i + 1) * 5,
                        budget: 250
                    });
                }
                setTrendData(newTrendData);
            }

            // 2. Forecast Audit Risk Probability
            const auditInput = {
                training_data: [
                    { budget_variance_pct: 10.5, days_delayed: 5, contractor_rating: 4.2, passed_audit: 1 },
                    { budget_variance_pct: 25.0, days_delayed: 45, contractor_rating: 2.1, passed_audit: 0 },
                    { budget_variance_pct: -5.0, days_delayed: 0, contractor_rating: 4.8, passed_audit: 1 },
                    { budget_variance_pct: 15.0, days_delayed: 12, contractor_rating: 3.5, passed_audit: 1 },
                    { budget_variance_pct: 40.0, days_delayed: 30, contractor_rating: 1.5, passed_audit: 0 }
                ],
                // Injecting hypothetical newly updated project parameters dynamically
                target_project: { budget_variance_pct: 35.0, days_delayed: 25, contractor_rating: 2.5 }
            };

            const aRes = await fetch("http://localhost:8000/api/forecast/audit-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(auditInput)
            });

            if (aRes.ok) {
                const risk = await aRes.json();
                const passProbability = 100 - risk.failure_probability_pct;
                setAuditStats({
                    passRate: passProbability.toFixed(1),
                    status: risk.risk_status === "HIGH RISK" ? "High Risk Detected" : "Low Risk Forecasted",
                    isHighRisk: risk.risk_status === "HIGH RISK"
                });
            }
        } catch (err) {
            console.error("AI Forecast failed", err);
        } finally {
            setIsForecasting(false);
        }
    };


    return (
        <div className="relative min-h-screen">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <Prism hueShift={260} animationType="3drotate" scale={2.5} glow={0.5} />
            </div>

            <div className="space-y-10 max-w-7xl mx-auto pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                            <Cpu className="w-4 h-4" /> AI-DRIVEN INSIGHTS ENGINE
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
                            EXECUTION <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">ANALYTICS</GradientText>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl">
                            Unified data visualization of government expenditure, infrastructure velocity, and predictive resource allocation for the NCT Delhi region.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl px-6">
                            Export PDF Reports
                        </Button>
                        <Button
                            onClick={runAIForecast}
                            disabled={isForecasting}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest h-12 rounded-2xl px-6 shadow-2xl shadow-indigo-600/30">
                            {isForecasting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Computing...</>
                            ) : (
                                "Run AI Forecast"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Total Expenditure", value: "₹2,480.5 Cr", sub: "+12.4% vs L-FY", icon: IndianRupee, color: "text-indigo-500", bg: "bg-indigo-500" },
                        { title: "Project Velocity", value: "1.2x", sub: "Faster than average", icon: Zap, color: "text-amber-500", bg: "bg-amber-500" },
                        { title: "Audit Pass Rate", value: `${auditStats.passRate}%`, sub: auditStats.status, icon: ShieldCheck, color: auditStats.isHighRisk ? "text-rose-500" : "text-emerald-500", bg: auditStats.isHighRisk ? "bg-rose-500" : "bg-emerald-500" },
                        { title: "Labor Attendance", value: "94,120", sub: "Active on-site", icon: Activity, color: "text-orange-500", bg: "bg-orange-500" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-[#0E0F17]/40 backdrop-blur-3xl border-white/5 rounded-[32px] overflow-hidden group hover:border-white/10 transition-all duration-300">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.title}</p>
                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[10px] font-bold text-emerald-500 tracking-tight">{stat.sub}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "70%" }}
                                        transition={{ duration: 1.5, delay: i * 0.1 }}
                                        className={cn("h-full", stat.bg)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Big Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Execution Trends (LineChart) */}
                    <Card className="lg:col-span-2 bg-[#0E0F17]/60 backdrop-blur-3xl border-white/5 rounded-[48px] overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 -z-10 opacity-[0.03] rotate-12">
                            <LineIcon className="w-64 h-64 text-indigo-500" />
                        </div>
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-2xl font-black text-white tracking-tight">INFRASTRUCTURE VELOCITY</CardTitle>
                            <CardDescription className="text-slate-400 font-medium">Monthly progress comparison: Completed Work vs. Targeted Performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#6366f1"
                                        fillOpacity={1}
                                        fill="url(#colorCompleted)"
                                        strokeWidth={4}
                                        name="Completed (%)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="target"
                                        stroke="#8b5cf6"
                                        strokeDasharray="5 5"
                                        fillOpacity={1}
                                        fill="url(#colorTarget)"
                                        strokeWidth={2}
                                        name="Target (%)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Sector Allocation (Pie Chart) */}
                    <Card className="bg-[#0E0F17]/60 backdrop-blur-3xl border-white/5 rounded-[48px] shadow-2xl flex flex-col items-center py-10">
                        <CardHeader className="text-center pb-8 w-full">
                            <CardTitle className="text-2xl font-black text-white tracking-tight">SECTOR BUDGETING</CardTitle>
                            <CardDescription className="text-slate-400 font-medium">Distribution of Government NCT Funds.</CardDescription>
                        </CardHeader>
                        <div className="h-[280px] w-full flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={SECTOR_DISTRIBUTION}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {SECTOR_DISTRIBUTION.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full px-10 space-y-4 pt-4">
                            {SECTOR_DISTRIBUTION.map((sector, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sector.color }} />
                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{sector.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-white">{sector.value}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Bottom Row - KPIs and GAuGEs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    {/* Efficiency Gauge (RadialBarChart) */}
                    <Card className="bg-[#0E0F17]/40 backdrop-blur-2xl border-white/5 rounded-[40px] p-10 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">CORE EFFICIENCY GAUGES</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Operational Performance KPIs</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                                <Target className="w-6 h-6 text-indigo-500" />
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="30%"
                                    outerRadius="100%"
                                    barSize={20}
                                    data={EFFICIENCY_GAUGE}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <RadialBar
                                        background
                                        dataKey="value"
                                        cornerRadius={15}
                                    />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                                    <Legend
                                        iconSize={10}
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.1em', color: '#64748b' }}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Predictive AI Analysis */}
                    <Card className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-[#0c0d12] backdrop-blur-2xl border-indigo-500/10 rounded-[40px] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000 rotate-[-15deg]">
                            <Cpu className="w-64 h-64 text-white" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

                        <div className="flex flex-col h-full justify-between">
                            <div className="space-y-4">
                                <Badge className="bg-indigo-600/20 text-indigo-400 border-none px-4 py-1 font-black text-[10px] tracking-widest uppercase rounded-full">Predictive Engine v4.0</Badge>
                                <h3 className="text-3xl font-black text-white tracking-widest leading-none">AI PERFORMANCE <br />FORECAST</h3>
                                <p className="text-slate-400 font-medium text-sm leading-relaxed mt-4">
                                    Our machine learning model predicts a <span className="text-emerald-400 font-black">9.2% increase</span> in regional construction velocity for the upcoming quarter based on current supply chain stabilization and labor availability metrics.
                                </p>
                            </div>

                            <div className="space-y-6 pt-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <span>Target Optimization Rank</span>
                                        <span className="text-white">Gold Tier (Top 5%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "95%" }}
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"
                                        />
                                    </div>
                                </div>
                                <Button className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white h-16 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all duration-300">
                                    Initialize Full Deep-Audit <ArrowUpRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
