import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trophy, Calendar, MapPin, ArrowRight, Sparkles, Users, CheckCircle } from "lucide-react";

export function GKCompetitionSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Circles */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-widest text-primary">New Event</span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                                GK Competition{" "}
                                <span className="relative">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-primary">
                                        2026
                                    </span>
                                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                        <path d="M2 10C50 2 150 2 198 10" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                                Showcase your knowledge and compete with the brightest minds. Register now for the ultimate general knowledge challenge!
                            </p>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                    <Calendar className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                                    <p className="text-lg font-black text-foreground">15 April 2026</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                                    <MapPin className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                                    <p className="text-lg font-black text-foreground">Ranchi, Jharkhand</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
                                    <Trophy className="h-6 w-6 text-amber-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registration Fee</p>
                                    <p className="text-lg font-black text-foreground">₹50 Only</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                                    <Users className="h-6 w-6 text-emerald-500 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Eligibility</p>
                                    <p className="text-lg font-black text-foreground">All Students</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/school-enquiry">
                                <Button 
                                    size="lg" 
                                    className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 gap-2"
                                >
                                    <GraduationCap className="h-5 w-5" />
                                    Register Now
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/download-gk-card">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="h-14 px-8 text-lg font-bold rounded-2xl border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 gap-2"
                                >
                                    <CheckCircle className="h-5 w-5" />
                                    Download Card
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="relative">
                        {/* Main Card */}
                        <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-primary/20 border border-border/50">
                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                            
                            {/* Content */}
                            <div className="relative space-y-6">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                                            <GraduationCap className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jharkhand Jan Kalyan Trust</p>
                                            <p className="text-lg font-black text-foreground">GK Competition 2026</p>
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <Trophy className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* Features List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-foreground">Why Participate?</h3>
                                    <div className="space-y-3">
                                        {[
                                            "Test your general knowledge skills",
                                            "Win exciting prizes & certificates",
                                            "Network with brilliant students",
                                            "Boost your academic profile"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="h-4 w-4 text-primary" />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Registration Info */}
                                <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-6 border border-primary/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Registration Open</p>
                                            <p className="text-2xl font-black text-primary">Limited Seats!</p>
                                        </div>
                                        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-black text-primary">₹50</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Urgency Badge */}
                                <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 py-3 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <Sparkles className="h-4 w-4 animate-pulse" />
                                    Register before seats fill up!
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -left-4 bg-gradient-to-br from-primary to-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-primary/30 transform -rotate-6">
                            <p className="text-xs font-bold uppercase tracking-wider">Featured Event</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}