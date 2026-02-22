"use client";

import { Activity, ArrowRight, Rss, Newspaper, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface NewsItem {
    id: number;
    title: string;
    description: string;
    link?: string | null;
}

interface NewsTickerProps {
    news: NewsItem[];
}

export function NewsTicker({ news = [] }: NewsTickerProps) {
    const hasNews = news.length > 0;
    // Duplicate news more times to ensure smooth infinite scroll
    const displayNews = hasNews ? [...news, ...news, ...news, ...news, ...news, ...news] : [
        { id: 0, title: "No recent updates available at the moment.", description: "Check back soon for latest announcements." }
    ];

    return (
        <section className="py-16 bg-white dark:bg-slate-950 relative overflow-hidden border-t border-border/40">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Context & Typography */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Updates</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                                Our Latest <br />
                                <span className="text-primary italic">Happenings.</span>
                            </h2>

                            <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-md">
                                Stay up to date with the newest initiatives, crucial announcements, and community events driving change at Jharkhand Jan Kalyan Trust.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border/60">
                            <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Real-time Feed</span>
                                <div className="h-px flex-1 bg-linear-to-r from-border/80 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Ticker Container */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative h-[480px] w-full rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-2 shadow-inner overflow-hidden">

                            {/* Gradient Masks for smooth scroll fading */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-slate-50 dark:from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />
                            <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-slate-50 dark:from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />

                            <div className="h-full overflow-hidden ticker-mask">
                                <div className="animate-vertical-news hover:paused flex flex-col gap-3 px-1 md:px-3 py-8">
                                    {displayNews.map((item, index) => {
                                        const CardContent = (
                                            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 group flex items-start gap-4 relative overflow-hidden">
                                                {/* Decorative line */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />

                                                {/* Icon */}
                                                <div className="shrink-0 mt-0.5">
                                                    <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-slate-100 dark:border-slate-800">
                                                        <Newspaper className="h-4 w-4" />
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors pr-5">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2 gap-1">
                                                        {item.description}
                                                    </p>

                                                    {item.link && (
                                                        <div className="pt-1.5 flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 uppercase tracking-wider">
                                                            Read Full Story <ArrowRight className="h-2.5 w-2.5" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* External Link Hint */}
                                                {item.link && (
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                        );

                                        return item.link ? (
                                            <a
                                                key={`${item.id}-${index}`}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl"
                                            >
                                                {CardContent}
                                            </a>
                                        ) : (
                                            <div key={`${item.id}-${index}`}>
                                                {CardContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes vertical-news-scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }

                .animate-vertical-news {
                    animation: vertical-news-scroll 40s linear infinite;
                }

                .ticker-mask {
                    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                }
            `}</style>
        </section>
    );
}
