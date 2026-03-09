"use client";

import { useState } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Activity,
    BrainCircuit,
    Settings,
    Smile,
    ShieldCheck,
    Zap,
} from "lucide-react";
import {
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import { ConstituencyChart } from "@/components/ConstituencyChart";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const demographicData = [
    { segment: 'Youth', current: 120, target: 150, fullMark: 150 },
    { segment: 'Farmers', current: 98, target: 130, fullMark: 150 },
    { segment: 'Women', current: 140, target: 130, fullMark: 150 },
    { segment: 'Business Owners', current: 85, target: 90, fullMark: 150 },
    { segment: 'Laborers', current: 110, target: 120, fullMark: 150 },
];

const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' }, // Emerald
    { name: 'Neutral', value: 20, color: '#94a3b8' },  // Slate
    { name: 'Negative', value: 15, color: '#f43f5e' }, // Rose
];

export default function CorporateBoothAnalyticsDashboard() {
    const { user } = useAuthStore();
    const [isResynced, setIsResynced] = useState(false);

    return (
        <div className="relative min-h-screen pb-20 overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.15] -z-10 bg-[#020617]">
                <Prism hueShift={260} animationType="3drotate" scale={2.5} glow={1.2} noise={0.4} bloom={1.5} />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <BrainCircuit className="w-12 h-12 text-indigo-500" />
                            </motion.div>
                            <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">BOOTH INTELLIGENCE</GradientText>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg ml-1">Hyper-local governance, accountability mapping, and beneficiary linkage portal.</p>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto">
                        <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 h-12 px-6 rounded-2xl w-full xl:w-auto">
                            <Settings className="w-4 h-4 mr-2" /> Global Config
                        </Button>
                        <Button
                            onClick={() => setIsResynced(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-12 px-6 rounded-2xl font-bold w-full xl:w-auto"
                        >
                            <Activity className="w-4 h-4 mr-2" /> RE-SYNC BOOTH DATA
                        </Button>
                    </div>
                </div>

                {/* Feature 1: Top Stats (Overview) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Village/Booth Reach", value: "88%", desc: "Targeted connect", icon: Users, color: "text-emerald-500", progress: 88 },
                        { label: "Infrastructure Audit", value: "14 / 20", desc: "Verified projects", icon: ShieldCheck, color: "text-indigo-500", progress: 70 },
                        { label: "Sentiment Index", value: "72/100", desc: "+5% vs last week", icon: Smile, color: "text-amber-500", progress: 72 },
                        { label: "Linked Beneficiaries", value: "2,090", desc: "Linked to schemes", icon: Zap, color: "text-rose-500", progress: 95 },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/[0.05] rounded-3xl overflow-hidden relative group hover:border-indigo-500/50 transition-colors duration-500">
                                <motion.div
                                    whileHover={{ opacity: 1, scale: 1.1 }}
                                    className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/10 blur-[50px] rounded-full opacity-0 transition-opacity"
                                />
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                        <stat.icon className={cn("w-4 h-4", stat.color)} /> {stat.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">{stat.desc}</p>
                                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full mt-5 overflow-hidden ring-1 ring-white/[0.05]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                                            className={cn("h-full shadow-[0_0_10px_2px_rgba(0,0,0,0.3)]", stat.color.replace('text-', 'bg-'))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Resynced Constituency Chart Data */}
                {isResynced && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                        <ConstituencyChart />
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Feature 2: Intelligent Segmentation (Radar Chart) */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/[0.05] rounded-[32px] overflow-hidden group hover:border-white/10 transition-colors">
                            <CardHeader className="pb-0 pt-8 px-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-black text-white tracking-tight">INTELLIGENT SEGMENTATION</CardTitle>
                                        <CardDescription className="text-slate-400 font-medium">Booth classification: Youth, Businessmen, Farmers, and Women.</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black uppercase text-[9px] tracking-widest px-3 py-1">AI Live</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[400px] p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={demographicData}>
                                        <PolarGrid stroke="#1e293b" />
                                        <PolarAngleAxis dataKey="segment" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#334155" />
                                        <Radar name="Current" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                        <Radar name="Target" dataKey="target" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Feature 3: AI-Driven Sentiment Analysis Engine */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/[0.05] rounded-[48px] overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 p-12 -z-10 opacity-[0.03] rotate-12">
                                <Activity className="w-64 h-64 text-emerald-500" />
                            </div>
                            <CardHeader className="pt-8 px-8">
                                <CardTitle className="text-xl font-black text-white tracking-tight">SENTIMENT ANALYSIS ENGINE</CardTitle>
                                <CardDescription className="text-slate-400 font-medium">Real-time mood tracking from social media, news, and on-ground surveys.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row items-center gap-10 px-8 pb-10">
                                <div className="h-[280px] w-full md:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                                {sentimentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Index Score</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-emerald-500">72</span>
                                            <span className="text-slate-500 font-bold">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {sentimentData.map((s, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /> <span className="font-bold text-slate-300 uppercase shrink-0">{s.name}</span></div>
                                                <div className="h-px flex-1 bg-slate-800 mx-4" />
                                                <span className="font-black text-white">{s.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}
