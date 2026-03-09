"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { tenderService } from "@/services/tenderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Upload,
    Loader2,
    CheckCircle2,
    FileText,
    IndianRupee,
    AlertCircle,
    Send,
    ShieldCheck,
    Cpu,
    X,
    Activity,
    Zap,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

const quoteSchema = z.object({
    quote: z.number().min(100, "Quote must be at least ₹100"),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function SubmitTenderPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // AI Forecast States
    const [showForecastPage, setShowForecastPage] = useState(false);
    const [isForecasting, setIsForecasting] = useState(false);
    const [forecastData, setForecastData] = useState<any>(null);

    // Dynamic Options
    const [aiParams, setAiParams] = useState({
        budgetVariance: 12.0,
        daysDelayed: 10,
        contractorRating: 4.5
    });

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteSchema),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const onSubmit = async (data: QuoteFormValues) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            await tenderService.submitQuote(user.id, {
                tenderId: id as string,
                quote: data.quote,
                documentFiles: files
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/dashboard/contractor"), 2500);
        } catch (err: any) {
            setError(err.message || "Failed to submit quote. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const runAIForecast = async (params = aiParams) => {
        setIsForecasting(true);
        if (!showForecastPage) setShowForecastPage(true);

        try {
            // 1. Forecast Project Velocity
            const velocityInput = [
                { date: "2024-01-01", velocity_score: 45 },
                { date: "2024-02-01", velocity_score: 52 },
                { date: "2024-03-01", velocity_score: 68 },
                { date: "2024-04-01", velocity_score: 58 },
                { date: "2024-05-01", velocity_score: 75 },
                { date: "2024-06-01", velocity_score: Math.max(0, 82 - (params.daysDelayed * 0.5)) }, // make velocity react to delay
            ];

            const vRes = await fetch("http://localhost:8000/api/forecast/velocity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ historical_data: velocityInput })
            });
            let velocityForecast = [];
            if (vRes.ok) velocityForecast = await vRes.json();

            // 2. Forecast Audit Risk Probability
            const auditInput = {
                training_data: [
                    { budget_variance_pct: 10.5, days_delayed: 5, contractor_rating: 4.2, passed_audit: 1 },
                    { budget_variance_pct: 25.0, days_delayed: 45, contractor_rating: 2.1, passed_audit: 0 },
                    { budget_variance_pct: -5.0, days_delayed: 0, contractor_rating: 4.8, passed_audit: 1 },
                    { budget_variance_pct: 15.0, days_delayed: 12, contractor_rating: 3.5, passed_audit: 1 },
                    { budget_variance_pct: 40.0, days_delayed: 30, contractor_rating: 1.5, passed_audit: 0 }
                ],
                // Dynamic Target Project
                target_project: {
                    budget_variance_pct: params.budgetVariance,
                    days_delayed: params.daysDelayed,
                    contractor_rating: params.contractorRating
                }
            };

            const aRes = await fetch("http://localhost:8000/api/forecast/audit-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(auditInput)
            });
            let riskForecast = null;
            if (aRes.ok) riskForecast = await aRes.json();

            // Very short delay to just flicker the UI when live updating
            await new Promise(r => setTimeout(r, 600));

            setForecastData({
                velocity: velocityForecast,
                risk: riskForecast
            });

        } catch (err) {
            console.error("AI Forecast failed", err);
            setForecastData({ error: 'Failed to communicate with AI Engine' });
        } finally {
            setIsForecasting(false);
        }
    };

    // Live update when params change (debounce in real app, but direct here for wow factor)
    useEffect(() => {
        if (showForecastPage) {
            runAIForecast(aiParams);
        }
    }, [aiParams.budgetVariance, aiParams.daysDelayed, aiParams.contractorRating]);


    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none opacity-40 -z-10">
                    <Prism hueShift={140} animationType="rotate" scale={3} glow={2} />
                </div>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-28 h-28 bg-emerald-500/20 rounded-[32px] flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] backdrop-blur-md border border-emerald-500/30"
                >
                    <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                </motion.div>
                <div className="space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-black tracking-tighter text-white"
                    >
                        Quotation <GradientText colors={['#10b981', '#34d399', '#10b981']} className="inline-block">Transmitted</GradientText>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-lg max-w-md mx-auto font-medium"
                    >
                        Your encrypted bid package has been successfully recorded in the Delhi Governance Hub.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex items-center justify-center gap-3 text-indigo-400 font-bold bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20"
                >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Returning to Command Center...
                </motion.div>
            </div>
        );
    }

    if (showForecastPage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[90vh] p-8 max-w-5xl mx-auto relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                    <Prism hueShift={280} animationType="rotate" scale={2} glow={1.5} />
                </div>

                <div className="w-full flex justify-end mb-8 relative z-20">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl" onClick={() => setShowForecastPage(false)}>
                        <X className="w-6 h-6 mr-2" /> Close Forecast
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full bg-[#0E0F17]/80 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)] rounded-[48px] p-12 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2] pointer-events-none group-hover:-rotate-12 transition-transform duration-1000">
                        <Cpu className="w-full h-full text-indigo-500" />
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                        <Badge className="bg-indigo-600/20 text-indigo-400 border-none px-4 py-1 font-black text-[10px] tracking-widest uppercase rounded-full">Predictive AI Engine V4</Badge>
                        {isForecasting && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 font-black text-[10px] tracking-widest uppercase rounded-full animate-pulse">Running Neural Models...</Badge>}
                    </div>

                    <h2 className="text-5xl font-black tracking-tighter text-white uppercase mb-8">
                        Tender Risk <GradientText colors={['#818cf8', '#c084fc', '#818cf8']} className="inline-block ml-0">Forecast</GradientText>
                    </h2>

                    {/* Dynamic Option Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-white/5">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Budget Variance (%)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="-20" max="100" step="1"
                                    value={aiParams.budgetVariance}
                                    onChange={(e) => setAiParams({ ...aiParams, budgetVariance: parseFloat(e.target.value) })}
                                    className="w-full accent-indigo-500"
                                />
                                <span className="text-white font-bold min-w-[3rem]">{aiParams.budgetVariance}%</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Days Delayed</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0" max="60" step="1"
                                    value={aiParams.daysDelayed}
                                    onChange={(e) => setAiParams({ ...aiParams, daysDelayed: parseInt(e.target.value) })}
                                    className="w-full accent-rose-500"
                                />
                                <span className="text-white font-bold min-w-[3rem]">{aiParams.daysDelayed}d</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-widest uppercase text-slate-400">Contractor Rating (1-5)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1" max="5" step="0.1"
                                    value={aiParams.contractorRating}
                                    onChange={(e) => setAiParams({ ...aiParams, contractorRating: parseFloat(e.target.value) })}
                                    className="w-full accent-emerald-500"
                                />
                                <span className="text-white font-bold min-w-[3rem]">{aiParams.contractorRating}</span>
                            </div>
                        </div>
                    </div>

                    {!forecastData && isForecasting ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-8">
                            <div className="relative">
                                <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
                                <div className="absolute inset-0 blur-2xl bg-indigo-500/30 animate-pulse rounded-full" />
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black tracking-widest uppercase text-white">Ingesting Parameters</p>
                                <p className="text-slate-400 font-medium mt-2">Training Random Forest model on historical audit metrics...</p>
                            </div>
                        </div>
                    ) : forecastData && !forecastData.error ? (
                        <div className="grid grid-cols-1 gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                        <h3 className="text-2xl font-black text-white">Audit Pass Probability</h3>
                                    </div>
                                    <div>
                                        <p className="text-5xl font-black tracking-tighter text-white">
                                            {forecastData.risk?.failure_probability_pct !== undefined ? (100 - forecastData.risk.failure_probability_pct).toFixed(1) : 0}%
                                        </p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <Badge className={cn("px-4 py-2 font-black uppercase tracking-widest text-xs", forecastData.risk?.risk_status === 'HIGH RISK' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                                                {forecastData.risk?.risk_status || "UNKNOWN"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 mt-4 leading-relaxed">
                                            Based on your current budget variance and historical contractor ratings, the AI predicts a robust probability of passing compliance audits without failure.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 bg-[#0E0F17]/40 border border-white/10 rounded-3xl space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 -z-10">
                                        <Activity className="w-40 h-40 text-indigo-500" />
                                    </div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        <Activity className="w-8 h-8 text-indigo-500" />
                                        <h3 className="text-2xl font-black text-white">Projected Trajectory</h3>
                                    </div>
                                    <div className="space-y-4 relative z-10">
                                        <p className="text-xl font-bold text-slate-300">30-Day Predictive Trend</p>
                                        <div className="flex items-end gap-2 text-indigo-400 font-black text-5xl tracking-tighter">
                                            <TrendingUp className="w-10 h-10 mb-1" />
                                            {forecastData.velocity && forecastData.velocity.length > 0 ? `+${(forecastData.velocity[forecastData.velocity.length - 1].predicted_velocity - forecastData.velocity[0].predicted_velocity).toFixed(1)}` : "N/A"}
                                            <span className="text-lg text-slate-500 font-bold mb-1 ml-2">Score Increase</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 leading-relaxed mt-4">
                                            Linear Regression forecasting indicates your execution velocity score will climb smoothly from historical averages.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* AI Velocity Chart */}
                            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8">
                                <h3 className="text-lg font-black tracking-widest uppercase text-white mb-6">Velocity Score AI Trajectory</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={forecastData.velocity}>
                                            <defs>
                                                <linearGradient id="velocityColor" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.split("-").slice(1).join("/")} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                            <Area type="monotone" dataKey="predicted_velocity" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fill="url(#velocityColor)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-rose-400 font-bold p-6 bg-rose-500/10 rounded-2xl">{forecastData?.error || "Error running forecast"}</div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 relative min-h-screen">
            {/* Premium Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
                <Prism hueShift={260} animationType="3drotate" scale={2} glow={0.5} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-12"
            >
                <Link href="/dashboard/contractor">
                    <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-[#0E0F17]/80 backdrop-blur-md border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-xl group">
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Submit Quotation</GradientText>
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Secure Bidding Environment Protocol V2.4
                    </div>
                </div>
                <div className="ml-auto">
                    <Button
                        type="button"
                        onClick={() => runAIForecast(aiParams)}
                        className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 rounded-2xl h-14 px-6 font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 transition-colors shrink-0"
                    >
                        <Cpu className="w-5 h-5 text-indigo-300" /> Run AI Predictor
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    <Card className="bg-[#0E0F17]/60 backdrop-blur-3xl border-white/5 shadow-2xl rounded-[40px] overflow-hidden border-t-indigo-500/30">
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                Technical Proposal
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base font-medium mt-2 leading-relaxed">
                                Enter your optimized financial bid and attach the requisite legal and engineering documentation as per RFP guidelines.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-emerald-500" /> Financial Bid (Quote)
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                                            <span className="text-2xl font-black">₹</span>
                                        </div>
                                        <Input
                                            {...register("quote", { valueAsNumber: true })}
                                            type="number"
                                            placeholder="Enter your lowest bid amount"
                                            className="bg-white/5 border-white/5 h-20 pl-16 focus-visible:ring-emerald-500/50 rounded-[28px] text-3xl font-black text-emerald-400 placeholder:text-slate-700 tracking-tighter shadow-inner overflow-hidden pr-8"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.quote && (
                                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-rose-400 font-bold text-xs mt-2 pl-2">
                                            <AlertCircle className="w-3.5 h-3.5" /> {errors.quote.message}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-400" /> Technical Documentation
                                    </label>
                                    <div
                                        className={cn(
                                            "relative border-2 border-dashed rounded-[32px] p-10 transition-all group flex flex-col items-center justify-center gap-3 cursor-pointer",
                                            files.length > 0 ? "border-indigo-500/30 bg-indigo-500/5" : "border-white/5 hover:border-indigo-500/40 hover:bg-white/5"
                                        )}
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                                            <Upload className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-bold">Drop RFP Docs here</p>
                                            <p className="text-slate-500 text-xs mt-1">PDF, ZIP or signed Docx (Max 25MB)</p>
                                        </div>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {files.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-wrap gap-2 mt-4"
                                            >
                                                {files.map((file, i) => (
                                                    <Badge key={i} className="bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 px-3 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-2 uppercase tracking-tight">
                                                        <FileText className="w-3 h-3" /> {file.name.slice(0, 20)}{file.name.length > 20 ? '...' : ''}
                                                    </Badge>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-sm text-rose-400 font-bold">
                                        <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-20 rounded-[32px] text-xl font-black shadow-2xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.1em]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin" /> Tunneling Proposal...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3">
                                            Submit Sealed Bid <Send className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="p-10 bg-indigo-500/10 border border-indigo-500/20 rounded-[40px] flex flex-col gap-6 relative overflow-hidden group shadow-2xl backdrop-blur-md">
                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                            <ShieldCheck className="w-40 h-40" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/30 rotate-3">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h4 className="text-2xl font-black text-indigo-100 tracking-tight">Bid Security</h4>
                        </div>
                        <p className="text-sm text-indigo-200/70 leading-relaxed font-medium">
                            Our system employs end-to-end encryption for all quotation uploads. Your financial data is only decrypted during the official automated technical evaluation phase, ensuring zero-bias selection.
                        </p>
                        <div className="pt-4 flex flex-col gap-3">
                            {[
                                "SHA-512 Data Hashing",
                                "Zero-Trust Access Protocols",
                                "Immutable Selection Logging"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-white/5 border border-white/5 rounded-[40px] shadow-2xl backdrop-blur-md space-y-6">
                        <h4 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" /> Bid Reminders
                        </h4>
                        <ul className="space-y-4">
                            {[
                                "Quotes are final once submitted.",
                                "All documents must be digitally signed.",
                                "GST compliance certificate is mandatory."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-4 text-slate-400 text-sm font-medium">
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-[10px] font-black shrink-0 text-indigo-400 border border-white/5">{i + 1}</span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

