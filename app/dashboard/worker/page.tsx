"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    Building2,
    Eye,
    ArrowUpRight,
    Hammer,
    ChevronRight,
    AlertTriangle,
    Loader2,
    Briefcase,
    Paperclip,
    Image as ImageIcon
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import GradientText from "@/components/GradientText"
import Prism from "@/components/Prism"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import AICircle from "@/components/AICircle"

// Genuine Delhi Government Tenders (2025-2026)
const GENUINE_TENDERS = [
    {
        id: "DMRC/L2/2025",
        title: "Renovation of Line-2 Metro Stations (Adarsh Nagar & Jahangirpuri)",
        description: "Complete civil and electrical renovation of platform area and concourse with modern amenities.",
        deadline: "2025-10-21",
        status: "Active",
        budget: "₹18.50 Cr",
        department: "DMRC",
        complexity: "High"
    },
    {
        id: "PWD/NW/R1/2026",
        title: "Annual Repair & Maintenance of North West Road-1",
        description: "Comprehensive potholes repair, strengthening, and painting of dividers along major corridors.",
        deadline: "2025-12-15",
        status: "Active",
        budget: "₹4.25 Cr",
        department: "PWD Delhi",
        complexity: "Medium"
    },
    {
        id: "DDA/HOU/2025-B2",
        title: "Maintenance of Garden Features - District Court Rohini",
        description: "Landscaping and routine maintenance of green belt around the court premises.",
        deadline: "2025-11-30",
        status: "Active",
        budget: "₹75.40 L",
        department: "DDA / PWD",
        complexity: "Low"
    },
    {
        id: "PWD/LIT/2026-X4",
        title: "Comprehensive Maintenance of Street Lights (Inner Ring Road)",
        description: "Upgradation to energy-efficient LED systems and underground cabling repair.",
        deadline: "2026-01-20",
        status: "Active",
        budget: "₹1.12 Cr",
        department: "PWD Delhi",
        complexity: "Medium"
    }
];

const MOCK_QUOTATIONS = [
    {
        id: "QT-8821",
        contractor: "L&T Infrastructure",
        quote: "₹17.85 Cr",
        estTime: "14 Months",
        docs: 12,
        tender: "DMRC/L2/2025",
        status: "Pending"
    },
    {
        id: "QT-8825",
        contractor: "Shapoorji Pallonji",
        quote: "₹18.20 Cr",
        estTime: "12 Months",
        docs: 15,
        tender: "DMRC/L2/2025",
        status: "Pending"
    },
    {
        id: "QT-9102",
        contractor: "Sterling & Wilson",
        quote: "₹1.05 Cr",
        estTime: "5 Months",
        docs: 8,
        tender: "PWD/LIT/2026-X4",
        status: "Accepted"
    }
];

const MOCK_PROGRESS = [
    {
        id: "PRG-001",
        title: "Signature Bridge Maintenance",
        description: "Structural inspection and cable tensioning under Phase II.",
        contractor: "Tata Projects",
        completion: 65,
        lastUpdate: "Pylon painting completed up to 80m height.",
        status: "on-track",
        image: "/assets/projects/signature_bridge.png"
    },
    {
        id: "PRG-002",
        title: "Central Vista Drainage",
        description: "Installation of storm-water management system around the new Secretariat.",
        contractor: "L&T Construction",
        completion: 42,
        lastUpdate: "3Km pipeline laid along Kartavya Path.",
        status: "delayed",
        image: "/assets/projects/metro_tunnel.png"
    }
];

export default function WorkerMarketplaceDashboard() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("tenders"); // tenders, approvals, progress
    const [tenders, setTenders] = useState<any[]>([]);
    const [quotations, setQuotations] = useState<any[]>([]);
    const [progressReports, setProgressReports] = useState<any[]>(MOCK_PROGRESS);
    const [loading, setLoading] = useState(true);

    // Sync Tenders
    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const { data, error } = await supabase
                    .from('tenders')
                    .select('*');

                if (error) {
                    if (error.message.includes("Could not find the table") || error.code === 'PGRST116') {
                        console.warn("Supabase: 'tenders' table not found. Using GENUINE_TENDERS as fallback.");
                        setTenders(GENUINE_TENDERS);
                        return;
                    }
                    throw error;
                }
                setTenders(data && data.length > 0 ? data : GENUINE_TENDERS);
            } catch (err: any) {
                console.error("Supabase Error (Tenders):", err.message || err);
                setTenders(GENUINE_TENDERS);
            } finally {
                setLoading(false);
            }
        };

        fetchTenders();

        const channel = supabase
            .channel('tenders-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tenders' }, () => {
                fetchTenders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Sync Quotations
    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                const { data, error } = await supabase
                    .from('quotations')
                    .select('*');

                if (error) {
                    if (error.message.includes("Could not find the table") || error.code === 'PGRST116') {
                        console.warn("Supabase: 'quotations' table not found. Using MOCK_QUOTATIONS as fallback.");
                        setQuotations(MOCK_QUOTATIONS);
                        return;
                    }
                    throw error;
                }
                setQuotations(data && data.length > 0 ? data : MOCK_QUOTATIONS);
            } catch (err: any) {
                console.error("Supabase Error (Quotations):", err.message || err);
                setQuotations(MOCK_QUOTATIONS);
            }
        };

        fetchQuotations();

        const channel = supabase
            .channel('quotations-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'quotations' }, () => {
                fetchQuotations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleAcceptQuote = async (id: string) => {
        try {
            await supabase
                .from('quotations')
                .update({ status: "Accepted", updated_at: new Date().toISOString() })
                .eq('id', id);
        } catch (e: any) {
            console.error("Error accepting quote:", e.message || e);
        }
    };

    const handleRejectQuote = async (id: string) => {
        try {
            await supabase
                .from('quotations')
                .update({ status: "Rejected", updated_at: new Date().toISOString() })
                .eq('id', id);
        } catch (e: any) {
            console.error("Error rejecting quote:", e.message || e);
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Premium Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30 -z-10 bg-[#020617]">
                <Prism hueShift={260} animationType="3drotate" scale={2} glow={0.5} />
            </div>

            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 max-w-7xl mx-auto px-4 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl font-black tracking-tighter"
                        >
                            <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">GOV MARKET</GradientText>
                        </motion.h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">Unified control center for Delhi Government portal connectivity, infrastructure bidding, and execution tracking.</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-3xl flex gap-1 shadow-2xl">
                        {[
                            { id: "tenders", label: "Opportunities", icon: FileText },
                            { id: "approvals", label: "Quotations", icon: Building2 },
                            { id: "progress", label: "Execution", icon: Hammer },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2.5",
                                    activeTab === tab.id
                                        ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40 ring-1 ring-white/20"
                                        : "text-slate-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                                {tab.id === 'approvals' && quotations.filter(q => q.status === 'Pending').length > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white animate-pulse">
                                        {quotations.filter(q => q.status === 'Pending').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-32 gap-6"
                        >
                            <div className="relative">
                                <AICircle size={80} color="#6366f1" active={true} />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-white text-xl font-black tracking-widest uppercase">Initializing Secure Tunnel</p>
                                <p className="text-slate-500 font-medium">Authenticating with Delhi Governance Cloud Hub...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Tab Content: Tenders */}
                            {activeTab === "tenders" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {tenders.map((tender, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                                            key={tender.id}
                                            className="group relative"
                                        >
                                            <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-[36px] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                            <Card className="bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 hover:border-indigo-500/40 transition-all duration-500 relative overflow-hidden min-h-[480px] flex flex-col rounded-[32px] shadow-2xl">
                                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 z-0">
                                                    <Building2 className="w-48 h-48" />
                                                </div>

                                                <CardHeader className="p-8 pb-4 relative z-10">
                                                    <div className="flex flex-col gap-4 mb-6">
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                                ID: {tender.id}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-3 py-1 font-bold rounded-lg uppercase tracking-tight text-[10px]">
                                                                    {tender.department || "Delhi Gov"}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={cn(
                                                                "border-none px-3 py-1 font-bold rounded-lg uppercase tracking-tight text-[10px]",
                                                                tender.complexity === 'High' ? 'bg-rose-500/10 text-rose-400' : tender.complexity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                                            )}>
                                                                {tender.complexity || "Standard"} Priority
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-2xl text-white font-black leading-tight tracking-tight group-hover:text-indigo-400 transition-colors">
                                                        {tender.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-slate-400 line-clamp-3 mt-4 font-medium text-sm leading-relaxed">
                                                        {tender.description}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="flex-1 space-y-6 pt-4 px-8 relative z-10">
                                                    <div className="p-5 bg-white/[0.03] rounded-[24px] border border-white/5 space-y-4 group-hover:bg-white/[0.05] transition-colors mt-auto">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-widest shrink-0">
                                                                <IndianRupee className="w-4 h-4 mr-2 text-indigo-500" /> Allocated Budget
                                                            </div>
                                                            <span className="text-2xl font-black text-emerald-400 tracking-tighter whitespace-nowrap">{tender.budget}</span>
                                                        </div>
                                                        <div className="h-px bg-white/5" />
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-widest shrink-0">
                                                                <Clock className="w-4 h-4 mr-2 text-indigo-500" /> Bid Cutoff
                                                            </div>
                                                            <span className="text-sm font-black text-white whitespace-nowrap">{new Date(tender.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="pt-2 pb-8 px-8 relative z-10">
                                                    <Button className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white h-14 rounded-2xl font-black shadow-2xl group-hover:scale-[1.03] transition-all duration-300 uppercase tracking-widest text-xs">
                                                        Analyze RFP <Eye className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Quotations Content */}
                            {activeTab === "approvals" && (
                                <div className="space-y-8 max-w-5xl mx-auto">
                                    {quotations.length === 0 ? (
                                        <div className="text-center py-32 bg-white/5 rounded-[48px] border-2 border-dashed border-white/10">
                                            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                                                <FileText className="w-12 h-12 text-slate-600" />
                                            </div>
                                            <h3 className="text-3xl font-black text-white tracking-tight">Zero Submissions</h3>
                                            <p className="text-slate-500 mt-2 font-medium">Bidding phase is live. Awaiting technical proposals from empanelled contractors.</p>
                                        </div>
                                    ) : (
                                        quotations.map((quote, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={quote.id}
                                            >
                                                <Card className="bg-[#0f172a]/80 backdrop-blur-3xl border-white/5 rounded-[40px] overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
                                                    <CardContent className="p-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
                                                        <div className="flex-1 space-y-6">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[24px] flex items-center justify-center font-black text-3xl shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                                                    {quote.contractor?.[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-3xl font-black text-white tracking-tighter">{quote.contractor}</h4>
                                                                        <div className="h-6 w-px bg-white/10 mx-2" />
                                                                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md uppercase tracking-widest">PROPOSAL: {quote.id}</span>
                                                                    </div>
                                                                    <p className="text-slate-400 font-medium mt-1">Delhi Government Empanelled Class-A Contractor</p>
                                                                </div>
                                                            </div>

                                                            <div className="p-6 bg-white/[0.02] rounded-[28px] border border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quoted Bid</p>
                                                                    <p className="text-2xl font-black text-emerald-400 tracking-tighter">{quote.quote}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Timeline</p>
                                                                    <p className="text-white font-bold text-lg">{quote.estTime || "Drafting"}</p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance</p>
                                                                    <div className="flex items-center text-indigo-400 font-bold hover:underline cursor-pointer">
                                                                        <Paperclip className="w-4 h-4 mr-1" /> {quote.docs || 0} Artifacts
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1 lg:col-span-1 col-span-2">
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tender Target</p>
                                                                    <p className="text-slate-300 font-bold text-sm truncate">{quote.tender}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="w-full md:w-64 flex flex-col gap-4">
                                                            {quote.status === "Pending" ? (
                                                                <>
                                                                    <Button onClick={() => handleAcceptQuote(quote.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 rounded-[20px] font-black transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-widest text-xs">
                                                                        Award Contract
                                                                    </Button>
                                                                    <Button onClick={() => handleRejectQuote(quote.id)} variant="outline" className="w-full border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-slate-400 h-14 rounded-[20px] font-black transition-all uppercase tracking-widest text-xs">
                                                                        Discard Bid
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <div className={cn(
                                                                    "w-full py-6 rounded-[24px] text-center font-black uppercase text-xs tracking-[0.2em] border shadow-2xl transition-all duration-700",
                                                                    quote.status === 'Accepted' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                                                )}>
                                                                    {quote.status === 'Accepted' ? 'CONTRACT AWARDED' : 'BID DISCARDED'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Execution Tracking Tab */}
                            {activeTab === "progress" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {progressReports.map((report, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={report.id}
                                        >
                                            <Card className="bg-[#0f172a]/60 backdrop-blur-3xl border-white/5 rounded-[40px] overflow-hidden group shadow-2xl h-[520px] flex flex-col">
                                                <div className="h-48 w-full relative overflow-hidden">
                                                    <img src={report.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Progress" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                                                    <Badge className={cn(
                                                        "absolute top-6 left-6 border-none px-4 py-1.5 font-black text-[10px] rounded-full uppercase tracking-[0.1em]",
                                                        report.status === 'on-track' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white border-white/20'
                                                    )}>
                                                        {report.status}
                                                    </Badge>
                                                </div>

                                                <CardHeader className="px-8 pb-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-2xl font-black text-white tracking-tight">{report.title}</CardTitle>
                                                            <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-1">{report.contractor}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-black text-white">{report.completion}%</p>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed</p>
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="px-8 flex-1 space-y-6">
                                                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${report.completion}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className={cn(
                                                                "h-full rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]",
                                                                report.status === 'on-track' ? 'bg-gradient-to-r from-indigo-500 to-emerald-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5">
                                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Technical Update</p>
                                                        <p className="text-slate-300 text-sm font-medium leading-relaxed italic">"{report.lastUpdate}"</p>
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="px-8 pb-8">
                                                    <Button variant="outline" className="w-full border-white/5 bg-white/5 hover:bg-white/10 text-white h-14 rounded-2xl font-black transition-all uppercase tracking-widest text-[10px]">
                                                        Open Audit Trail <ImageIcon className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
