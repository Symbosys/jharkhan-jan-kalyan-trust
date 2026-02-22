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
        <section className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden border-t border-border/40">
            {/* Background Accents (Matching BenefitsSection Aesthetic) */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-tertiary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Left Column (Original Structure) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/10 border border-tertiary/20 shadow-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-tertiary">Live Updates</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                                Our Latest <br />
                                <span className="text-tertiary italic">Happenings.</span>
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

                    {/* Right Column (Original Structure with Benefits-style Cards) */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative h-[550px] w-full rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border/50 shadow-inner overflow-hidden">

                            {/* Gradient Masks */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
                            <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

                            <div className="h-full overflow-hidden ticker-mask">
                                <div className="animate-vertical-news hover:paused flex flex-col gap-4 px-4 md:px-6 py-8">
                                    {displayNews.map((item, index) => {
                                        const CardContent = (
                                            <div className="group relative p-6 rounded-[2rem] bg-tertiary/10 border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-tertiary/5 hover:-translate-y-1 transition-all duration-500 flex items-start gap-4 overflow-hidden">
                                                {/* Icon */}
                                                <div className="shrink-0 mt-0.5 relative z-10">
                                                    <div className="h-12 w-12 rounded-2xl bg-tertiary text-white flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg shadow-tertiary/20">
                                                        <Newspaper className="h-6 w-6" />
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className="flex-1 min-w-0 space-y-1 relative z-10">
                                                    <h3 className="text-lg font-black text-tertiary leading-snug transition-colors pr-5">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                                        {item.description}
                                                    </p>

                                                    {item.link && (
                                                        <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-tertiary hover:underline underline-offset-4 transition-all uppercase tracking-wider">
                                                            Read Full Story <ArrowRight className="h-3 w-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Decorative corner element (Matching BenefitsSection) */}
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-tertiary/20 rounded-bl-[3rem] opacity-60 group-hover:opacity-100 transition-all duration-500" />
                                            </div>
                                        );

                                        return item.link ? (
                                            <a
                                                key={`${item.id}-${index}`}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 rounded-[2rem]"
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
                    animation: vertical-news-scroll 45s linear infinite;
                }

                .ticker-mask {
                    mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
                }
            `}</style>
        </section>
    );
}
