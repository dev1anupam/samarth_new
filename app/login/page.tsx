"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2, User, Landmark, Building2, Mail, Lock, Eye, EyeOff, Shield, ArrowRight, UserPlus } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import GradientText from "@/components/GradientText";
import Link from "next/link";
import { Home } from "lucide-react";

const authSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roleParam = searchParams.get("role") as UserRole | null;

    const [activeRole, setActiveRole] = useState<UserRole>(roleParam || "civilian");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Toggle between login and signup modes
    const [isSignUp, setIsSignUp] = useState(false);

    const setUser = useAuthStore((state) => state.setUser);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = async (data: AuthFormValues) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            if (isSignUp) {
                if (!data.name) {
                    setError("Full Name is required for signup.");
                    setIsLoading(false);
                    return;
                }
                await authService.signup(data.email, data.password, activeRole, data.name);
                setMessage("Registration successful! Please check your email and verify your account to log in.");
                reset(); // Clear form
                setIsSignUp(false);
            } else {
                const user = await authService.login(data.email, data.password, activeRole);
                if (user) {
                    setUser(user);
                    router.push(`/dashboard/${user.role}`);
                }
            }
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-row font-sans relative z-10 selection:bg-indigo-500/30 bg-[#0B0914] overflow-hidden">
            {/* Left Side: Login Form */}
            <div className="flex-1 lg:flex-[0.8] xl:flex-[0.7] flex flex-col items-center justify-center p-6 relative h-screen overflow-y-auto w-full">
                {/* Form Background overlay */}
                <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-indigo-950/20 to-black/40 pointer-events-none" />

                {/* Home Button */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white flex items-center gap-1.5 hover:bg-slate-800/50 h-9 px-3">
                            <Home className="w-4 h-4" />
                            <span className="text-[10px] sm:text-xs font-semibold tracking-wider">BACK</span>
                        </Button>
                    </Link>
                </div>

                {/* Logo Section */}
                <div className="mt-16 sm:mt-0 mb-6 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                            <ShieldCheck className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h1 className="text-xl font-bold tracking-[0.2em] uppercase">
                            <GradientText colors={['#E2E8F0', '#94a3b8', '#E2E8F0']}>SAMARTH</GradientText>
                        </h1>
                    </div>

                    {/* Header Text */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-[1.75rem] font-bold tracking-tight mb-2 text-center">
                            <GradientText colors={['#ffffff', '#a5b4fc', '#ffffff']}>
                                {isSignUp ? "Create an Account" : "Welcome Back"}
                            </GradientText>
                        </h2>
                        <p className="text-[13px] text-slate-400 font-medium text-center">Unified Governance & Service Delivery Portal</p>
                    </div>
                </div>

                {/* Main Card Wrapper */}
                <div className="w-full max-w-[440px]">

                    {/* Tabs */}
                    <div className="grid grid-cols-3 bg-black/40 border border-white/5 backdrop-blur-md rounded-xl p-1 sm:p-1.5 mb-[2px]">
                        <button
                            type="button"
                            onClick={() => setActiveRole("civilian")}
                            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wider transition-all
                            ${activeRole === "civilian" ? "bg-[#3f21f1] text-white shadow-lg" : "text-slate-400 hover:text-slate-300"}`}
                        >
                            <User className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${activeRole === "civilian" ? "text-white" : "text-slate-500"}`} />
                            CITIZEN
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveRole("worker")}
                            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wider transition-all
                            ${activeRole === "worker" ? "bg-[#3f21f1] text-white shadow-lg" : "text-slate-400 hover:text-slate-300"}`}
                        >
                            <Landmark className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${activeRole === "worker" ? "text-white" : "text-slate-500"}`} />
                            OFFICIAL
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveRole("contractor")}
                            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wider transition-all
                            ${activeRole === "contractor" ? "bg-[#3f21f1] text-white shadow-lg" : "text-slate-400 hover:text-slate-300"}`}
                        >
                            <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${activeRole === "contractor" ? "text-white" : "text-slate-500"}`} />
                            CORPORATE
                        </button>
                    </div>

                    {/* Spacer */}
                    <div className="h-6"></div>

                    {/* Form Card */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-[13px] font-semibold text-[#E2E8F0]">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <UserPlus className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <Input
                                            {...register("name")}
                                            placeholder="John Doe"
                                            className="pl-10 bg-[#0B0914] border-slate-800/80 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-[46px] text-[13px] font-medium rounded-lg"
                                            autoComplete="name"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name.message}</p>}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-[#E2E8F0]">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <Input
                                        {...register("email")}
                                        placeholder="name@domain.gov.in"
                                        className="pl-10 bg-[#0B0914] border-slate-800/80 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-[46px] text-[13px] font-medium rounded-lg"
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[13px] font-semibold text-[#E2E8F0]">Password</label>
                                    {!isSignUp && (
                                        <a href="#" className="text-[13px] text-[#4324f6] hover:text-indigo-400 font-semibold transition-colors">Forgot Password?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <Input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 bg-[#0B0914] border-slate-800/80 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-[46px] text-sm tracking-widest rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
                            </div>

                            {!isSignUp && (
                                <div className="flex items-center space-x-2.5 pt-1 pb-1">
                                    <Checkbox id="keepSignedIn" className="w-[18px] h-[18px] border-slate-700/80 rounded data-[state=checked]:bg-[#3f21f1] data-[state=checked]:border-[#3f21f1] data-[state=checked]:text-white" />
                                    <label
                                        htmlFor="keepSignedIn"
                                        className="text-[13px] font-medium leading-none text-slate-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        Keep me signed in for 30 days
                                    </label>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-medium text-red-500 text-center">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-medium text-emerald-500 text-center">
                                    {message}
                                </div>
                            )}

                            <Button type="submit" className="w-full bg-[#3f21f1] hover:bg-[#3217d8] text-white font-semibold h-[46px] text-[13px] rounded-lg transition-all" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {isSignUp ? "Sign Up Now" : "Sign In to Portal"} <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center pt-2">
                                <span className="text-[13px] text-slate-400 font-medium">
                                    {isSignUp ? "Already have an account? " : "New to SAMARTH? "}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp);
                                        setError(null);
                                        setMessage(null);
                                        reset();
                                    }}
                                    className="text-[13px] text-[#4324f6] hover:text-indigo-400 font-semibold transition-colors"
                                >
                                    {isSignUp ? "Sign In instead" : "Create an account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 sm:mt-[72px] pb-6 flex items-center gap-3 text-slate-500 text-[10px] sm:text-[11px] font-bold tracking-[0.16em]">
                    <Shield className="w-4 h-4 opacity-70" />
                    <span>SECURE 256-BIT AES ENCRYPTED ACCESS</span>
                </div>

            </div> {/* End Left Side */}

            {/* Right side: App Banner Image */}
            <div className="hidden lg:flex flex-[1.2] xl:flex-[1.3] relative bg-slate-950 border-l border-white/5 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0914] via-transparent to-[#0B0914]/50 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay z-10 pointer-events-none" />
                <img
                    src="/login-banner.jpg"
                    alt="SAMARTH Portal Features"
                    className="absolute inset-0 w-[105%] h-[105%] max-w-none object-cover opacity-90 transition-transform duration-[15s] hover:scale-105 ease-out"
                />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
