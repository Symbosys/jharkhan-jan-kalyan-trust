import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Handshake, ArrowRight, Sparkles, CheckCircle, Users, Target, Award } from "lucide-react";

export function AffiliationSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 shadow-lg shadow-purple-500/10">
                            <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-widest text-purple-600">Partnership Opportunity</span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter leading-[1.1]">
                                Request{" "}
                                <span className="relative inline-block">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600">
                                        Affiliation
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                        <path d="M2 10C50 2 150 2 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#9333ea" />
                                                <stop offset="50%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#9333ea" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                                Join hands with Jharkhand Jan Kalyan Trust. Partner with us to amplify your impact and reach communities in need across Jharkhand.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/affiliation">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-purple-500/25 hover:scale-105 transition-all duration-300 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                >
                                    <Handshake className="h-5 w-5" />
                                    Request Affiliation
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="relative">
                        <div className="relative bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-purple-500/20 border border-border/50">
                            <div className="relative space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <Handshake className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jharkhand Jan Kalyan Trust</p>
                                            <p className="text-lg font-black text-foreground">Affiliation Program</p>
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <Award className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* Benefits Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-foreground">Why Get Affiliated?</h3>
                                    <div className="space-y-3">
                                        {[
                                            "Expand your organizational network",
                                            "Access resources and support",
                                            "Collaborate on social initiatives",
                                            "Enhance credibility and trust"
                                        ].map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">{benefit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 border border-purple-100 dark:border-slate-600">
                                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-black text-purple-600">50+</p>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Partners</p>
                                    </div>
                                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 border border-blue-100 dark:border-slate-600">
                                        <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-black text-blue-600">100%</p>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Support</p>
                                    </div>
                                    <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 border border-purple-100 dark:border-slate-600">
                                        <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-black text-purple-600">Free</p>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Registration</p>
                                    </div>
                                </div>

                                {/* CTA Badge */}
                                <Link href="/affiliation" className="flex items-center justify-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 py-3 rounded-xl border border-purple-200 dark:border-purple-800">
                                    <Sparkles className="h-4 w-4 animate-pulse" />
                                    Become a partner today!
                                </Link>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -left-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-purple-500/30 transform -rotate-6">
                            <p className="text-xs font-bold uppercase tracking-wider">Join Our Network</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
