"use client";

import { Activity, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

interface NewsItem {
    id: number;
    title: string;
    description: string;
}

interface NewsTickerProps {
    news: NewsItem[];
}

export function NewsTicker({ news = [] }: NewsTickerProps) {
    const hasNews = news.length > 0;
    const displayNews = hasNews ? [...news, ...news, ...news, ...news, ...news, ...news] : [
        { id: 0, title: "No recent updates available at the moment.", description: "Check back soon for latest announcements." }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Large Layout Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Header Side - Bold & Large */}
                    <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-24">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="h-0.5 w-12 bg-primary rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Information Flow</span>
                            </div>

                            <h2 className="text-6xl lg:text-7xl font-black text-foreground leading-[0.9] tracking-tighter uppercase italic">
                                Newsroom <br />
                                <span className="text-primary not-italic tracking-normal lowercase opacity-80 underline decoration-2 underline-offset-8">Status.</span>
                            </h2>

                            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm">
                                A high-frequency data stream monitoring our tactical impact across 15+ operational zones.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-border">
                                <span className="block text-3xl font-black text-foreground">24/7</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monitoring</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                <span className="block text-3xl font-black text-primary italic">Live</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Data Feed</span>
                            </div>
                        </div>

                        <Link
                            href="/news"
                            className="group flex items-center justify-between px-8 py-5 bg-foreground text-background rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-foreground/10"
                        >
                            Open News Portal
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>

                    {/* Scrolling Section - Massive Box, Small Content */}
                    <div className="lg:col-span-8 relative group">
                        {/* Outer Frame with depth */}
                        <div className="relative rounded-[3.5rem] bg-slate-100 dark:bg-slate-900 p-2 shadow-2xl">
                            <div className="bg-background rounded-[3.2rem] border border-border overflow-hidden relative">

                                {/* Console Header */}
                                <div className="h-14 bg-slate-50 dark:bg-slate-950/50 border-b border-border flex items-center justify-between px-10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
                                        </div>
                                        <div className="h-4 w-px bg-border" />
                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-60">System://News_Vertical_Feed</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1 w-12 bg-primary/20 rounded-full overflow-hidden">
                                            <div className="h-full w-1/2 bg-primary animate-progress" />
                                        </div>
                                        <span className="text-[10px] font-bold text-primary">SYNCED</span>
                                    </div>
                                </div>

                                {/* Scrolling Portal - Increased Height to h-[650px] */}
                                <div className="h-[650px] relative news-ticker-container">
                                    <div className="animate-vertical-news pause-on-hover px-10 pt-10">
                                        {displayNews.map((item, index) => (
                                            <div
                                                key={`${item.id}-${index}`}
                                                className="pb-8 mb-8 border-b border-border/30 last:border-0 group/item"
                                            >
                                                <div className="flex gap-6 items-start">
                                                    {/* Smaller Bullet Point Icon */}
                                                    <div className="shrink-0 mt-1 h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-center text-primary/40 group-hover/item:text-primary transition-all duration-300">
                                                        <Activity className="h-4 w-4" />
                                                    </div>

                                                    {/* SMALL CONTENT starts here */}
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-[9px] font-black text-secondary tracking-widest uppercase">Field Report</span>
                                                            <div className="h-px flex-1 bg-border/20" />
                                                        </div>
                                                        <Link
                                                            href={item.id ? `/news/${item.id}` : "#"}
                                                            className="block text-base font-extrabold text-foreground hover:text-primary transition-colors leading-tight tracking-tight uppercase"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2 italic opacity-80">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Controls Overlay */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <div className="bg-foreground text-background px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-background"></span>
                                        </span>
                                        Interaction Mode: Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-progress {
                    animation: progress 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
