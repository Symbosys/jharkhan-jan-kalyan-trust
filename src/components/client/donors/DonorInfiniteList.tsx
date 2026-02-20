"use client";

import { CheckCircle, Heart, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Donor {
    id: number;
    name: string;
    amount: number;
    donorImage: any; // Json
    status: string; // Changed from DonarStatus to string to avoid import
    createdAt: Date;
}

interface DonorInfiniteListProps {
    initialData: Donor[];
    totalCount: number;
    fetchDonors: (options: { page: number; limit: number; status: any }) => Promise<{ donars: any[]; pagination: any }>;
}

export function DonorInfiniteList({ initialData, totalCount, fetchDonors }: DonorInfiniteListProps) {
    const [donors, setDonors] = useState<Donor[]>(initialData as Donor[]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData.length < totalCount);

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await fetchDonors({
                page: nextPage,
                limit: 12,
                status: "VERIFIED"
            });

            if (response?.donars && response.donars.length > 0) {
                setDonors(prev => [...prev, ...response.donars as Donor[]]);
                setPage(nextPage);

                if (donors.length + response.donars.length >= (response.pagination?.total || 0)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load donors:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, donors.length, fetchDonors]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadMore]);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {donors.map((donor, index) => (
                    <div
                        key={`${donor.id}-${index}`}
                        className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                    >
                        {/* Inner Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-linear-to-tr from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-white/5 group-hover:to-primary/5 transition-colors duration-500" />

                        {/* Status Badge */}
                        <div className="absolute top-6 right-6 z-10">
                            <div className="h-6 w-6 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 border border-green-500/20" title="Verified Donor">
                                <CheckCircle className="h-3.5 w-3.5 stroke-[3px]" />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="relative z-10 mb-6">
                            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-lg ring-2 ring-primary/20 group-hover:scale-105 transition-transform duration-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                {donor.donorImage && (donor.donorImage as any).url ? (
                                    <Image
                                        src={(donor.donorImage as any).url}
                                        alt={donor.name}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <User className="h-9 w-9 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 p-2 rounded-full border border-white/50 shadow-sm transition-transform group-hover:scale-110">
                                <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 text-center w-full space-y-3">
                            <h3 className="font-black text-xl text-foreground tracking-tight group-hover:text-primary transition-colors truncate px-2">
                                {donor.name}
                            </h3>
                            <div className="inline-flex items-center gap-1.5 text-primary font-black text-md bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                                <span className="text-xs opacity-70">₹</span>
                                <span>{donor.amount.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}



            {donors.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                        <Heart className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No donors yet</h3>
                    <p className="text-muted-foreground">Be the first to support our cause.</p>
                </div>
            )}
        </div>
    );
}
