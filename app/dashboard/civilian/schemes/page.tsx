"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useDataStore, Scheme } from "@/store/useDataStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import GradientText from "@/components/GradientText";
import { Search, Calendar, Award, Info, FileCheck, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
    query: z.string().optional()
});

const MOCK_SCHEMES: Scheme[] = [
    {
        id: "scheme-1",
        name: "Mukhyamantri Tirth Yatra Yojana",
        description: "Fully funded pilgrimage trips for senior citizens (60+ years) of Delhi, covering travel and accommodation expenses.",
        eligibility: "Resident of Delhi. Age 60 years or above. Income limit applies. Not a central/state govt employee.",
        benefits: "Free travel by AC train/bus, accommodation, meals, and ₹1 lakh insurance cover.",
        applicationLink: "https://edistrict.delhigovt.nic.in/in/en/Home/Index.html",
        category: "Welfare",
        deadline: "No deadline",
        createdAt: new Date().toISOString()
    },
    {
        id: "scheme-2",
        name: "Delhi Lakhpati Bitiya Yojana (formerly Ladli Scheme)",
        description: "New financial assistance scheme launched to empower girl children from birth until graduation, ensuring educational continuity and financial independence.",
        eligibility: "Resident of Delhi. Family income below ₹1.20 Lakh per year. Girl child born in Delhi.",
        benefits: "Enhanced financial aid deposited in stages, ensuring the girl child has substantial funds for her future by graduation.",
        applicationLink: "https://edistrict.delhigovt.nic.in/",
        category: "Education",
        deadline: "No deadline",
        createdAt: new Date().toISOString()
    },
    {
        id: "scheme-3",
        name: "Jai Bhim Mukhyamantri Pratibha Vikas Yojana",
        description: "Free coaching for competitive exams (UPSC, NEET, JEE, etc.) for meritorious students from under-privileged backgrounds.",
        eligibility: "SC/ST/OBC/EWS category student. Resident of Delhi. Family income below ₹8 Lakh per annum.",
        benefits: "100% free coaching fee coverage and a monthly stipend of ₹2,500.",
        applicationLink: "https://scstwelfare.delhi.gov.in/",
        category: "Education",
        deadline: "2024-09-30",
        createdAt: new Date().toISOString()
    },
    {
        id: "scheme-4",
        name: "Financial Assistance to Senior Citizens (Old Age Pension)",
        description: "Monthly pension scheme to provide financial security to destitute and poor senior citizens.",
        eligibility: "Resident of Delhi (last 5 years). Age 60+. Family income from all sources should not exceed ₹1 Lakh/year.",
        benefits: "Monthly pension of ₹2,000 (Age 60-69) and ₹2,500 (Age 70+) directly into bank account.",
        applicationLink: "https://edistrict.delhigovt.nic.in/in/en/Public/Services.html",
        category: "Pension",
        deadline: "No deadline",
        createdAt: new Date().toISOString()
    },
    {
        id: "scheme-5",
        name: "Delhi Vidhwa Pension Yojana (Women in Distress)",
        description: "Social security mechanism to support widowed, divorced, or separated women in financial distress.",
        eligibility: "Age 18 to 59 years. Resident of Delhi for 5 years. Income below ₹1 Lakh/year.",
        benefits: "Monthly financial assistance of ₹2,500 credited directly to the Aadhaar seeded bank account.",
        applicationLink: "https://edistrict.delhigovt.nic.in/in/en/Public/Services.html",
        category: "Pension",
        deadline: "No deadline",
        createdAt: new Date().toISOString()
    },
    {
        id: "scheme-6",
        name: "Mukhyamantri Vidyarthi Pratibha Yojana",
        description: "A scholarship scheme to incentivize and support meritorious students from minority groups in Delhi schools.",
        eligibility: "Minority students studying in Classes 9 to 12 in Delhi with a minimum 50% marks in the previous class.",
        benefits: "Annual scholarship of ₹5,000 to ₹10,000 to cover tuition and educational expenses.",
        applicationLink: "https://edistrict.delhigovt.nic.in/",
        category: "Education",
        deadline: "2025-03-31",
        createdAt: new Date().toISOString()
    }
];

export default function SchemesPage() {
    const { schemes, setSchemes, selectedScheme, setSelectedScheme, schemeFilters, setSchemeFilters } = useDataStore();
    const [loading, setLoading] = useState(true);

    const { register, watch } = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { query: '' }
    });

    const searchQuery = watch("query") || "";

    useEffect(() => {
        setSchemeFilters({ searchQuery });
    }, [searchQuery, setSchemeFilters]);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const { data, error } = await supabase
                    .from('schemes')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    // Handle "table not found" error gracefully (PostgREST code for table missing or schema cache issues)
                    if (error.message.includes("Could not find the table") || error.code === 'PGRST116') {
                        console.warn("Supabase: 'schemes' table not found. Using MOCK_SCHEMES as fallback. Please create the table in your Supabase dashboard.");
                        setSchemes(MOCK_SCHEMES);
                        return;
                    }
                    throw error;
                }

                if (!data || data.length === 0) {
                    setSchemes(MOCK_SCHEMES);
                } else {
                    setSchemes(data || []);
                }
            } catch (err: any) {
                console.error("Supabase Error (Schemes):", err.message || err);
                setSchemes(MOCK_SCHEMES);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemes();

        const channel = supabase
            .channel('schemes-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'schemes' }, () => {
                fetchSchemes();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [setSchemes]);

    const filteredSchemes = useMemo(() => {
        return schemes.filter(s => {
            const matchCategory = schemeFilters.category === 'all' || s.category === schemeFilters.category;
            const matchSearch = (s.name || "").toLowerCase().includes(schemeFilters.searchQuery.toLowerCase()) ||
                (s.description || "").toLowerCase().includes(schemeFilters.searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [schemes, schemeFilters]);

    const uniqueCategories = useMemo(() => {
        const cats = new Set(schemes.map(s => s.category).filter((c): c is string => !!c));
        return ['all', ...Array.from(cats)];
    }, [schemes]);

    const isDeadlineUrgent = (deadlineStr: string) => {
        if (deadlineStr === "No deadline") return false;
        const diff = new Date(deadlineStr).getTime() - new Date().getTime();
        return diff > 0 && diff < 15 * 24 * 60 * 60 * 1000;
    };

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Government Schemes</GradientText>
                    </h1>
                    <p className="text-slate-400 mt-1">Discover, filter, and apply for social and welfare programs.</p>
                </div>
            </div>

            <Card className="bg-[#0E0F17]/80 border-slate-800 p-4 border backdrop-blur-md rounded-2xl">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            {...register("query")}
                            placeholder="Search by scheme name or keywords..."
                            className="bg-black/50 border-slate-800 pl-10 h-11 focus-visible:ring-indigo-600/50"
                        />
                    </div>
                    <Select
                        value={schemeFilters.category || "all"}
                        onValueChange={(val) => setSchemeFilters({ category: val ?? "all" })}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] bg-black/50 border-slate-800 h-11 text-slate-200">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            {uniqueCategories.map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="bg-slate-900 border-slate-800 overflow-hidden">
                            <Skeleton className="h-40 w-full rounded-none" />
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
                        </Card>
                    ))
                ) : filteredSchemes.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                            <Info className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No schemes found</h3>
                        <p className="text-slate-500">No active schemes match your current search or filters.</p>
                    </div>
                ) : (
                    filteredSchemes.map((scheme, i) => (
                        <Card
                            key={scheme.id}
                            className="bg-[#0E0F17]/60 border-slate-800 hover:border-indigo-500/50 transition-all group cursor-pointer flex flex-col"
                            onClick={() => setSelectedScheme(scheme)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 capitalize tracking-wide px-2.5">
                                        {scheme.category}
                                    </Badge>
                                    {isDeadlineUrgent(scheme.deadline) && (
                                        <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold text-[10px]">
                                            CLOSING SOON
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl line-clamp-2 group-hover:text-indigo-400 transition-colors tracking-tight">
                                    {scheme.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                                    {scheme.description}
                                </p>
                            </CardContent>

                            <CardFooter className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center text-xs text-slate-500 gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Deadline: {scheme.deadline}</span>
                                </div>
                                <div className="text-indigo-500 group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!selectedScheme} onOpenChange={(open) => !open && setSelectedScheme(null)}>
                <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 overflow-hidden shadow-2xl">
                    <div className="h-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 relative border-b border-indigo-500/20">
                        <div className="absolute -bottom-8 left-8 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
                            <Award className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <div className="p-8 pt-12 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black text-white leading-tight">
                                {selectedScheme?.name}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-400 font-bold uppercase tracking-widest text-xs pt-1">
                                {selectedScheme?.category} Welfare Program
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                    <Info className="w-4 h-4" /> Description
                                </h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{selectedScheme?.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                        <FileCheck className="w-4 h-4" /> Eligibility
                                    </h4>
                                    <p className="text-slate-300 text-xs leading-relaxed">{selectedScheme?.eligibility}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                        <Award className="w-4 h-4" /> Key Benefits
                                    </h4>
                                    <p className="text-slate-300 text-xs leading-relaxed">{selectedScheme?.benefits}</p>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl h-[52px]"
                                    onClick={() => window.open(selectedScheme?.applicationLink, '_blank')}
                                >
                                    Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="sm:w-32 border-slate-800 bg-slate-900 hover:bg-slate-800 h-12 rounded-xl h-[52px]"
                                >
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
