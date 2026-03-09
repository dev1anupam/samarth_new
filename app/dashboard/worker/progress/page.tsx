"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Hammer,
    Clock,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    MapPin,
    ArrowUpRight,
    Search,
    Filter,
    ClipboardCheck,
    Truck,
    HardHat,
    History,
    ShieldCheck,
    Camera
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import GradientText from "@/components/GradientText"
import Prism from "@/components/Prism"
import { cn } from "@/lib/utils"

// Genuine Delhi Government Projects for Progress Tracking
const DELHI_EXECUTION_PROJECTS = [
    {
        id: "PWD-D-2024-001",
        title: "Signature Bridge Pylon Painting & Maintenance",
        department: "PWD Delhi",
        location: "Wazirabad, Delhi",
        budget: "₹1.52 Cr",
        completion: 78,
        status: "on-track",
        contractor: "Tata Projects",
        lastAudit: "2024-03-05",
        workers: 24,
        category: "Infrastructure",
        image: "/assets/projects/signature_bridge.png"
    },
    {
        id: "DMRC-IV-882",
        title: "Delhi Metro Phase-IV - Tunnelling Work",
        department: "DMRC",
        location: "Keshopur, New Delhi",
        budget: "₹85.40 Cr",
        completion: 42,
        status: "delayed",
        contractor: "L&T Construction",
        lastAudit: "2024-03-01",
        workers: 156,
        category: "Transport",
        image: "/assets/projects/metro_tunnel.png"
    },
    {
        id: "GNCTD-EDU-2025",
        title: "Construction of 200 Smart Classrooms",
        department: "Directorate of Education",
        location: "Multiple Locations (East Delhi)",
        budget: "₹12.75 Cr",
        completion: 95,
        status: "final-stage",
        contractor: "Ahluwalia Contracts",
        lastAudit: "2024-03-07",
        workers: 45,
        category: "Education",
        image: "/assets/projects/smart_classroom.png"
    }
];

export default function ProgressTrackingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredProjects = DELHI_EXECUTION_PROJECTS.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="relative min-h-screen">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <Prism hueShift={210} animationType="rotate" scale={3} glow={0.6} />
            </div>

            <div className="space-y-8 max-w-7xl mx-auto pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> Official Execution Portal
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            PROGRESS <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">TRACKING</GradientText>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-2xl">
                            Real-time monitoring of NCT Delhi infrastructure developmental works.
                            Transparency, Accountability, and Efficiency in Governance.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-3xl shadow-2xl">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Efficiency</p>
                            <p className="text-2xl font-black text-emerald-400">84.2%</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Sites</p>
                            <p className="text-2xl font-black text-white">1,240</p>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <Card className="bg-[#0E0F17]/60 backdrop-blur-3xl border-white/5 rounded-[32px] p-6 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <Input
                                placeholder="Search by Project ID or Title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/[0.03] border-white/10 pl-12 h-14 rounded-2xl focus-visible:ring-indigo-600/50 text-white font-medium"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'on-track', 'delayed', 'final-stage'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        filterStatus === status
                                            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20"
                                            : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    {status.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Projects Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[500px] w-full bg-white/5 rounded-[40px] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {filteredProjects.map((project, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={project.id}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-700" />
                                    <Card className="bg-[#0f172a]/80 backdrop-blur-3xl border-white/5 rounded-[40px] overflow-hidden flex flex-col h-[550px] relative shadow-2xl transition-all duration-500 group-hover:translate-y-[-8px]">
                                        {/* Image Header */}
                                        <div className="h-44 w-full relative">
                                            <img src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={project.title} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                                            <Badge className={cn(
                                                "absolute top-6 left-6 border-none px-4 py-1.5 font-black text-[9px] rounded-full uppercase tracking-widest shadow-2xl",
                                                project.status === 'on-track' ? 'bg-emerald-500 text-white' :
                                                    project.status === 'final-stage' ? 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'
                                            )}>
                                                {project.status.replace('-', ' ')}
                                            </Badge>
                                            <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                                <Camera className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        <CardHeader className="px-8 pb-4 pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md uppercase tracking-tight">
                                                    {project.category}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    ID: {project.id}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl text-white font-black leading-tight tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {project.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="px-8 flex-1 space-y-6">
                                            {/* Progress Section */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Physical Completion</p>
                                                    <p className="text-2xl font-black text-white">{project.completion}%</p>
                                                </div>
                                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${project.completion}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className={cn(
                                                            "h-full rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]",
                                                            project.status === 'on-track' ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' :
                                                                project.status === 'final-stage' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</p>
                                                    <p className="text-xs text-white font-bold truncate">{project.location}</p>
                                                </div>
                                                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><IndianRupee className="w-3 h-3" /> Budget</p>
                                                    <p className="text-xs text-emerald-400 font-bold">{project.budget}</p>
                                                </div>
                                                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><ClipboardCheck className="w-3 h-3" /> Last Audit</p>
                                                    <p className="text-xs text-white font-bold">{new Date(project.lastAudit).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                                                </div>
                                                <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.06] transition-colors">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><HardHat className="w-3 h-3" /> Team Size</p>
                                                    <p className="text-xs text-white font-bold">{project.workers} On-Site</p>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="px-8 pb-8">
                                            <Button className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white h-14 rounded-2xl font-black shadow-2xl transition-all duration-300 uppercase tracking-widest text-[10px] group-hover:scale-[1.02]">
                                                View Live Dashboard <ArrowUpRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* System Activity Log */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-500" /> SYSTEM AUDIT LOG
                        </h3>
                        <Badge variant="outline" className="border-white/10 text-slate-500 font-mono text-[10px]">REAL-TIME FEED</Badge>
                    </div>
                    <Card className="bg-[#0E0F17]/40 backdrop-blur-3xl border-white/5 rounded-[40px] overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {[
                                { time: "10:45 AM", event: "Structural Safety Certificate uploaded for PWD-D-2024-001", user: "Audit Team-A" },
                                { time: "09:30 AM", event: "Material Dispatch: 50MT Steel arrived at DMRC-IV-882 site", user: "Logistics Hub" },
                                { time: "Yesterday", event: "Final Inspection Scheduled for GNCTD-EDU-2025", user: "Edu Dept" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-6">
                                        <div className="text-[10px] font-black text-slate-500 w-16 uppercase tracking-widest">{log.time}</div>
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" />
                                        <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{log.event}</p>
                                    </div>
                                    <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                                        {log.user}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
