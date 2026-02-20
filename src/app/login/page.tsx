"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import { Heart, Lock, Mail, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans">
            {/* ── Liquid Light Aesthetic Background ── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-[20%] w-[50vw] h-[50vw] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            <div className="container relative z-10 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    {/* Header/Logo Section */}
                    <div className="text-center mb-10 space-y-4">
                        <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl shadow-black/5 mb-2 relative group mt-20">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Image
                                src="/logo/logo.jpeg"
                                alt="Logo"
                                width={80}
                                height={80}
                                className="rounded-2xl relative z-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Admin Control Center</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm">
                                Secure Login.
                            </h1>
                            <p className="text-muted-foreground font-medium text-sm">
                                Jharkhand Jan Kalyan Trust management portal
                            </p>
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden">
                        {/* Decorative glow inside card */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="admin@jankalyan.org"
                                            required
                                            className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-white/50 dark:border-white/5 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground" htmlFor="password">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-white/50 dark:border-white/5 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-[0.98] transition-all"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Access Dashboard
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center space-y-4">
                        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                            &copy; 2024 Jharkhand Jan Kalyan Trust
                        </p>
                        <div className="h-1 w-12 bg-primary/20 mx-auto rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
