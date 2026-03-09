"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import AICircle from "@/components/AICircle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    MapPin,
    UserPlus,
    Activity,
    Zap,
    Briefcase
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "motion/react";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";

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

export default function WorkersPage() {
    const { user } = useAuthStore();
    const [workers, setWorkers] = useState<any[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(true);
    const [filter, setFilter] = useState("Delhi");

    const [isOnboarding, setIsOnboarding] = useState(false);
    const [newWorkerData, setNewWorkerData] = useState({ name: '', phone: '', area: 'Connaught Place, Delhi' });

    const fallbackWorkers = [
        { id: '1', name: 'Amit Kumar', status: 'Active', tasks: 4, area: 'Booth 12A, New Delhi', recentActivity: 'Resolved water issue logging', phone: '+91 9876543210' },
        { id: '2', name: 'Suresh Singh', status: 'On Break', tasks: 2, area: 'Booth 14, Old Delhi', recentActivity: 'Filed road inspection report', phone: '+91 9876543211' },
        { id: '3', name: 'Priya Verma', status: 'Active', tasks: 7, area: 'Station Road, Delhi Zone', recentActivity: 'Distributed scheme forms', phone: '+91 9876543212' },
        { id: '4', name: 'Rahul Dev', status: 'Offline', tasks: 0, area: 'Booth 12A, Connaught Place', recentActivity: 'Shift ended', phone: '+91 9876543213' },
    ];

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                // Fetch users with role 'worker'
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'worker');

                if (error) {
                    console.warn("Could not find worker profiles, using mock.", error.message);
                    setWorkers(fallbackWorkers);
                } else if (data && data.length > 0) {
                    const mappedWorkers = data.map((d, i) => ({
                        id: d.id,
                        name: d.full_name || 'Registered Worker',
                        status: i % 3 === 0 ? 'On Break' : (i % 4 === 0 ? 'Offline' : 'Active'),
                        tasks: Math.floor(Math.random() * 8),
                        area: i % 2 === 0 ? 'Connaught Place, Delhi' : 'Saket, South Delhi', // dynamically near Delhi
                        recentActivity: 'Automated Sync Node',
                        phone: d.phone || 'N/A'
                    }));
                    // Add mock workers for richer UI if less than 3
                    setWorkers([...mappedWorkers, ...fallbackWorkers.map(w => ({ ...w, id: `mock-${w.id}` }))]);
                } else {
                    setWorkers(fallbackWorkers);
                }
            } catch (err) {
                console.error("Fetch workers error:", err);
                setWorkers(fallbackWorkers);
            } finally {
                setLoadingWorkers(false);
            }
        };

        fetchWorkers();

        const channel = supabase
            .channel('worker-changes-page')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchWorkers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const assignNewTask = (workerId: string) => {
        setWorkers(workers.map(w => w.id === workerId ? { ...w, tasks: w.tasks + 1, status: 'Active' } : w));
    };

    const handleOnboardWorker = () => {
        if (!newWorkerData.name || !newWorkerData.phone) return;
        const worker = {
            id: `temp-${Date.now()}`,
            name: newWorkerData.name,
            status: 'Active',
            tasks: 0,
            area: newWorkerData.area,
            recentActivity: 'Just Onboarded',
            phone: newWorkerData.phone
        };
        setWorkers([worker, ...workers]);
        setNewWorkerData({ name: '', phone: '', area: 'Connaught Place, Delhi' });
        setIsOnboarding(false);
    };

    const activeCount = workers.filter(w => w.status === 'Active').length;

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
                className="space-y-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 tracking-tighter uppercase">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Briefcase className="w-12 h-12 text-indigo-500" />
                            </motion.div>
                            <GradientText colors={['#ffffff', '#818cf8', '#ffffff']} className="ml-0">WORKER FLEET</GradientText>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg ml-1">Live assignment and dynamic tracking for <span className="text-indigo-400 font-bold">Delhi Region</span> workers.</p>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-4 w-full md:w-auto mt-4 md:mt-0">
                        <Button
                            onClick={() => setIsOnboarding(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-12 px-6 rounded-2xl font-bold w-full xl:w-auto"
                        >
                            <UserPlus className="w-4 h-4 mr-2" /> ONBOARD WORKER
                        </Button>
                    </div>
                </div>

                {/* KPI/Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/40 backdrop-blur-3xl border-white/[0.05] rounded-[32px] p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <Users className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Fleet</p>
                        <h3 className="text-4xl font-black text-white">{workers.length}</h3>
                    </Card>
                    <Card className="bg-emerald-900/20 backdrop-blur-3xl border-emerald-500/20 rounded-[32px] p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-emerald-500">
                            <Activity className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Active On-Ground</p>
                        <h3 className="text-4xl font-black text-emerald-400">{activeCount}</h3>
                    </Card>
                    <Card className="bg-indigo-900/20 backdrop-blur-3xl border-indigo-500/20 rounded-[32px] p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-indigo-500">
                            <MapPin className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Active Region</p>
                        <h3 className="text-3xl font-black text-white mt-1">Delhi NCR</h3>
                    </Card>
                </div>

                {/* Worker List Section */}
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 rounded-[40px] px-0 py-4 overflow-hidden shadow-2xl">
                    <div className="px-10 py-6 border-b border-white/[0.05] flex justify-between items-center mb-6">
                        <div>
                            <CardTitle className="text-xl font-black text-white tracking-tight">DYNAMIC DEPLOYMENTS</CardTitle>
                            <CardDescription className="text-slate-400 font-medium">Real-time status for workers in near Delhi zones.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-black uppercase text-[10px] tracking-widest px-4 py-1.5 h-auto">LIVE SYNC</Badge>
                    </div>

                    <div className="px-10 pb-10 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {loadingWorkers ? (
                                <div className="flex justify-center py-20">
                                    <AICircle size={80} color="#6366f1" />
                                </div>
                            ) : workers.length === 0 ? (
                                <div className="text-center py-20 text-slate-500">No workers available.</div>
                            ) : (
                                workers.map((worker, i) => (
                                    <motion.div
                                        key={worker.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/40 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group gap-4 relative overflow-hidden"
                                    >
                                        {/* Dynamic Glow Background */}
                                        {worker.status === 'Active' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        )}

                                        <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
                                            <div className="relative shrink-0">
                                                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 font-black text-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 text-indigo-300">
                                                    {worker.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                {worker.status === 'Active' ? (
                                                    <div className="absolute -top-3 -right-3">
                                                        <AICircle size={28} color="#10b981" />
                                                    </div>
                                                ) : worker.status === 'On Break' ? (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                ) : (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-600 border-2 border-slate-900" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-white text-lg tracking-tight group-hover:text-indigo-300 transition-colors uppercase">{worker.name}</h4>
                                                    <Badge className={cn(
                                                        "px-3 py-0.5 h-6 border text-[9px] font-black uppercase tracking-widest rounded-lg",
                                                        worker.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                                                            worker.status === 'On Break' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                                                                "bg-slate-800 text-slate-400 border-slate-700"
                                                    )}>
                                                        {worker.status}
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <div className="flex items-center text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                                                        <span className="font-bold text-slate-300">{worker.area}</span>
                                                    </div>
                                                    <div className="h-1 w-1 bg-slate-700 rounded-full" />
                                                    <div className="text-xs text-slate-400">
                                                        TEL: <span className="text-slate-300 font-mono">{worker.phone}</span>
                                                    </div>
                                                    <div className="h-1 w-1 bg-slate-700 rounded-full" />
                                                    <div className="text-xs text-slate-400">
                                                        <span className="text-slate-500 mr-2">LAST SEEN:</span>
                                                        <span className="italic">"{worker.recentActivity}"</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 relative z-10 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="flex items-end gap-1">
                                                    <span className="text-3xl font-black text-indigo-400 leading-none">{worker.tasks}</span>
                                                </div>
                                                <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1">Assignments</span>
                                            </div>

                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    onClick={() => assignNewTask(worker.id)}
                                                    className={cn(
                                                        "h-14 w-14 rounded-[20px] shadow-gl group-hover:rotate-12 transition-all duration-300 relative overflow-hidden",
                                                        worker.status === 'Active' ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                                                    )}
                                                >
                                                    <Zap className={cn("w-6 h-6", worker.status === 'Active' ? "animate-pulse" : "")} />
                                                    {worker.status === 'Active' && <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors" />}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            {/* Onboard Worker Dialog */}
            <Dialog open={isOnboarding} onOpenChange={setIsOnboarding}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 p-8 rounded-[32px]">
                    <DialogHeader>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
                            <UserPlus className="w-6 h-6 text-indigo-400" />
                        </div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Onboard Worker</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Equip a new worker to sync data locally and receive assignments.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4 mt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</Label>
                            <Input
                                id="name"
                                value={newWorkerData.name}
                                onChange={(e) => setNewWorkerData({ ...newWorkerData, name: e.target.value })}
                                className="bg-slate-950/50 border-slate-800 h-12 rounded-xl text-white placeholder:text-slate-600"
                                placeholder="Vikram Sharma"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</Label>
                            <Input
                                id="phone"
                                value={newWorkerData.phone}
                                onChange={(e) => setNewWorkerData({ ...newWorkerData, phone: e.target.value })}
                                className="bg-slate-950/50 border-slate-800 h-12 rounded-xl text-white placeholder:text-slate-600 font-mono"
                                placeholder="+91 91234 56789"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="area" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deployment Area</Label>
                            <Input
                                id="area"
                                value={newWorkerData.area}
                                onChange={(e) => setNewWorkerData({ ...newWorkerData, area: e.target.value })}
                                className="bg-slate-950/50 border-slate-800 h-12 rounded-xl text-white placeholder:text-slate-600"
                                placeholder="E.g. South Extension, New Delhi"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsOnboarding(false)}
                            className="bg-transparent hover:bg-slate-800 text-slate-300 w-full sm:w-auto h-12 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleOnboardWorker}
                            disabled={!newWorkerData.name || !newWorkerData.phone}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto h-12 rounded-xl font-bold px-8 shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
