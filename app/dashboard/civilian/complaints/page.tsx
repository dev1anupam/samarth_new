"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { Complaint } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import {
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    MapPin,
    Calendar,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const MOCK_COMPLAINTS: Complaint[] = [
    {
        id: "comp-1",
        user_id: "user-1",
        category: "Infrastructure",
        description: "Severe pothole on the main road causing traffic delays and safety concerns.",
        image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=2574&auto=format&fit=crop",
        location: { lat: 28.6139, lng: 77.2090, address: "Central Delhi, near Connaught Place" },
        status: "pending",
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "comp-2",
        user_id: "user-1",
        category: "Sanitation",
        description: "Garbage overflow near the community park needs immediate clearance.",
        image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=2574&auto=format&fit=crop",
        location: { lat: 28.5355, lng: 77.3910, address: "Sector 15, Noida" },
        status: "in-progress",
        created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: "comp-3",
        user_id: "user-1",
        category: "Electricity",
        description: "Street lights in the block are not working for the past 3 days.",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2574&auto=format&fit=crop",
        location: { lat: 28.7041, lng: 77.1025, address: "Rohini, Block B" },
        status: "resolved",
        created_at: new Date(Date.now() - 432000000).toISOString()
    }
];

export default function ComplaintsListingPage() {
    const { user } = useAuthStore();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        if (!user) return;

        const fetchComplaints = async () => {
            try {
                const { data, error } = await supabase
                    .from('complaints')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    // Check if table missing
                    if (error.message.includes("Could not find the table") || error.code === 'PGRST116') {
                        console.warn("Supabase: 'complaints' table not found. Using MOCK_COMPLAINTS as fallback.");
                        setComplaints(MOCK_COMPLAINTS);
                        return;
                    }
                    throw error;
                }

                if (!data || data.length === 0) {
                    setComplaints(MOCK_COMPLAINTS);
                } else {
                    setComplaints(data || []);
                }
            } catch (error: any) {
                console.error("Error fetching complaints:", error.message || error);
                setComplaints(MOCK_COMPLAINTS);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();

        const channel = supabase
            .channel('complaints-user-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints', filter: `user_id=eq.${user.id}` }, () => {
                fetchComplaints();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchesSearch = (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.category || "").toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === "all" || c.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [complaints, searchQuery, filterStatus]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'in-progress': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
            case 'in-progress': return "text-amber-400 border-amber-500/30 bg-amber-500/10";
            default: return "text-slate-400 border-slate-500/30 bg-slate-500/10";
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-[calc(100vh-100px)] pt-4 pb-12 space-y-8">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <Prism hueShift={220} animationType="rotate" scale={2} glow={0.5} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/civilian">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Badge variant="outline" className="text-indigo-400 border-indigo-400/30 bg-indigo-400/5">Citizen Request Portal</Badge>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Your Complaints</GradientText>
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-lg">Track the resolution of your reports and stay updated on governance actions.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link href="/dashboard/civilian/complaints/new" className="block w-full sm:w-auto">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white w-full px-6 h-12 rounded-2xl shadow-lg shadow-indigo-600/20 group transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" /> File New Report
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Filters and Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 relative z-10"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search by keywords or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0E0F17]/80 backdrop-blur-md border-slate-800 pl-10 h-11 focus-visible:ring-indigo-600/50 rounded-xl"
                    />
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start">
                    {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? "secondary" : "ghost"}
                            className={cn(
                                "capitalize h-11 px-4 rounded-xl border border-transparent",
                                filterStatus === status
                                    ? "bg-indigo-600/10 text-indigo-400 border-indigo-600/20 hover:bg-indigo-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'pending' && <AlertCircle className="w-3.5 h-3.5 mr-2" />}
                            {status === 'in-progress' && <Clock className="w-3.5 h-3.5 mr-2" />}
                            {status === 'resolved' && <CheckCircle2 className="w-3.5 h-3.5 mr-2" />}
                            {status}
                        </Button>
                    ))}
                </div>
            </motion.div>

            {/* Complaints List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <AnimatePresence mode="popLayout">
                    {filteredComplaints.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full py-20 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8 text-slate-700" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">No complaints found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                            </div>
                        </motion.div>
                    ) : (
                        filteredComplaints.map((complaint, idx) => (
                            <motion.div
                                key={complaint.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                            >
                                <Card className="bg-[#0E0F17]/60 backdrop-blur-xl border-slate-800 hover:border-indigo-500/50 transition-all group overflow-hidden h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        {(complaint.image || complaint.image_url) ? (
                                            <img
                                                src={complaint.image || complaint.image_url}
                                                alt="Evidence"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <AlertCircle className="w-12 h-12 text-slate-800" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <Badge className={cn("uppercase text-[10px] tracking-widest px-2 py-0.5", getStatusColor(complaint.status))}>
                                                {complaint.status.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader className="p-5 pb-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400/80 bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10">
                                                {complaint.category || "General"}
                                            </span>
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                                ID: {complaint.id.slice(-8).toUpperCase()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-300 transition-colors">
                                            {complaint.description}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-2 flex-grow flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 text-xs text-slate-400">
                                                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-500 shrink-0" />
                                                <span className="line-clamp-1">{complaint.location?.address || "Location not provided"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span>{complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : "Date unknown"}</span>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            className="w-full mt-auto text-xs text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/5 items-center justify-between px-2"
                                        >
                                            View Progress Timeline <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
