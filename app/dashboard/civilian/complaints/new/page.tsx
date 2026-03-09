"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { complaintService } from "@/services/complaintService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    MapPin,
    Camera,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import GradientText from "@/components/GradientText";
import Prism from "@/components/Prism";
import AICircle from "@/components/AICircle";

const complaintSchema = z.object({
    description: z.string().min(10, "Please provide a more detailed description (min 10 chars)"),
    address: z.string().min(5, "Address is required"),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ComplaintFormValues>({
        resolver: zodResolver(complaintSchema),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ComplaintFormValues) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            await complaintService.fileComplaint(user.id, {
                description: data.description,
                location: {
                    lat: 0, // Placeholder for real geolocation
                    lng: 0,
                    address: data.address
                },
                imageFile: image || undefined
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/dashboard/civilian/complaints"), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to file complaint. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
                <div className="fixed inset-0 pointer-events-none opacity-40 -z-10">
                    <Prism hueShift={120} animationType="rotate" scale={3} glow={1} />
                </div>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-4xl font-bold tracking-tight">
                        <GradientText colors={['#10b981', '#34d399', '#10b981']}>Complaint Filed!</GradientText>
                    </h2>
                    <p className="text-slate-400 max-w-sm mx-auto mt-3">
                        Your issue has been logged and our AI is currently categorizing it. Track status in your dashboard.
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        <p className="text-indigo-400 text-sm font-medium">Redirecting to history...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4 pb-12 relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
                <Prism hueShift={220} animationType="3drotate" scale={1.5} glow={0.5} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-10"
            >
                <Link href="/dashboard/civilian/complaints">
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']} className="ml-0">Report an Issue</GradientText>
                    </h1>
                    <p className="text-slate-500 font-medium">Help us build a better constituency, one report at a time.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <Card className="bg-[#0E0F17]/80 backdrop-blur-2xl border-slate-800 shadow-2xl rounded-3xl overflow-hidden relative border-t-indigo-500/50">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl">Complaint Details</CardTitle>
                            <CardDescription className="text-slate-400 text-base">Provide accurate details to ensure rapid response from our ground workers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-indigo-400" /> Description
                                    </label>
                                    <Textarea
                                        {...register("description")}
                                        placeholder="Describe the issue in detail (e.g., Severe water leakage on Station Road...)"
                                        className="bg-[#1A1E2E]/50 border-slate-800 min-h-[140px] focus-visible:ring-indigo-600/50 rounded-2xl resize-none text-lg p-5"
                                    />
                                    {errors.description && <p className="text-xs text-rose-400 font-medium">{errors.description.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-400" /> Location Address
                                    </label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <Input
                                            {...register("address")}
                                            placeholder="House No, Street, Landmark..."
                                            className="bg-[#1A1E2E]/50 border-slate-800 h-14 pl-12 focus-visible:ring-indigo-600/50 rounded-2xl text-lg"
                                        />
                                    </div>
                                    {errors.address && <p className="text-xs text-rose-400 font-medium">{errors.address.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-16 text-xl font-bold shadow-xl shadow-indigo-600/20 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Encrypting & Filing...
                                        </div>
                                    ) : (
                                        "Submit Official Complaint"
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
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Camera className="w-4 h-4 text-indigo-400" /> Media Evidence
                        </label>
                        <div
                            className={cn(
                                "aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden p-2 group",
                                imagePreview ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]" : "border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                            )}
                            onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                            {imagePreview ? (
                                <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="h-10 px-4 rounded-xl font-bold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                        >
                                            Replace Photo
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Camera className="w-10 h-10 text-slate-600 group-hover:text-indigo-400" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-300">Evidence Upload</p>
                                    <p className="text-xs text-slate-500 mt-2 text-center px-6">Files larger than 5MB will be auto-compressed.</p>
                                </>
                            )}
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AICircle size={200} color={imagePreview ? "#818cf8" : "#6366f1"} active={!!imagePreview} />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/20 text-white rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                                <AICircle size={24} color={imagePreview ? "#ffffff" : "#818cf8"} active={true} />
                            </div>
                            <h4 className="font-bold text-indigo-100">AI Priority Routing</h4>
                        </div>
                        <p className="text-sm text-indigo-200/60 leading-relaxed relative z-10">
                            Our platform uses real-time computer vision and NLP to route your complaint to the specific department instantly. Clearer photos help us prioritize your issue in the queue.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 text-sm text-rose-400 font-medium"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
