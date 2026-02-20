"use client";

import { Activity, ArrowRight, Rss } from "lucide-react";
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
    // Duplicate news more times to ensure smooth infinite scroll even on large screens
    const displayNews = hasNews ? [...news, ...news, ...news, ...news, ...news, ...news, ...news, ...news] : [
        { id: 0, title: "No recent updates available at the moment.", description: "Check back soon for latest announcements." }
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/20 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Rss className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Updates</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                            Latest <span className="text-primary italic">Happenings.</span>
                        </h2>
                    </div>

                    <Link
                        href="/news"
                        className="group whitespace-nowrap inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all pb-1 border-b-2 border-primary/20 hover:border-primary"
                    >
                        VIEW ALL NEWS
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Scrolling Section - Clean & Professional */}
                <div className="relative group">
                    {/* Outer Frame - Soft Shadow, rounded corners */}
                    <div className="relative rounded-[2.5rem] bg-background border border-border/60 shadow-xl overflow-hidden">

                        {/* Scrolling Portal */}
                        <div className="h-[500px] relative news-ticker-container mask-gradient">
                            <div className="animate-vertical-news pause-on-hover px-6 md:px-12 py-8">
                                {displayNews.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="py-6 border-b border-border/40 last:border-0 group/item transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 -mx-6 md:-mx-12 px-6 md:px-12"
                                    >
                                        <div className="flex gap-5 items-start">
                                            {/* Minimal Bullet Point */}
                                            <div className="shrink-0 mt-1.5 h-2.5 w-2.5 rounded-full bg-primary/20 group-hover/item:bg-primary transition-colors duration-300 ring-2 ring-primary/5 group-hover/item:ring-primary/20" />

                                            {/* Content */}
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <Link
                                                    href={item.id ? `/news/${item.id}` : "#"}
                                                    className="block text-lg font-bold text-foreground hover:text-primary transition-colors leading-tight tracking-tight"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Arrow Icon on Hover */}
                                            <ArrowRight className="shrink-0 h-5 w-5 text-muted-foreground/30 -translate-x-2 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 mt-1.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx global>{`
                .mask-gradient {
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </section>
    );
}
