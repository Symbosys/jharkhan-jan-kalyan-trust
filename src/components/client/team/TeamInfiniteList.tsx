"use client";

import { getAllTeam } from "@/actions/team";
import { Loader2, MapPin, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import type { TeamType } from "../../../../generated/prisma/client";

interface TeamMember {
    id: number;
    name: string;
    position: string;
    location: string | null;
    type: TeamType;
    image: any; // Json type
    createdAt: Date;
    updatedAt: Date;
}

interface TeamInfiniteListProps {
    initialData: TeamMember[];
    totalCount: number;
    type: TeamType;
}

export function TeamInfiniteList({ initialData, totalCount, type }: TeamInfiniteListProps) {
    const [team, setTeam] = useState<TeamMember[]>(initialData);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData.length < totalCount);

    // Observer ref
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await getAllTeam({
                page: nextPage,
                limit: 10,
                type: type
            });

            if (response?.team && response.team.length > 0) {
                setTeam(prev => [...prev, ...response.team as TeamMember[]]);
                setPage(nextPage);

                // Check if we reached the end
                if (team.length + response.team.length >= (response.pagination?.total || 0)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more team members:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, type, team.length]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {team.map((member, index) => (
                <div
                    key={`${member.id}-${index}`}
                    className="group relative p-8 rounded-[2.5rem] bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                    {/* Liquid Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-linear-to-tr from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-white/5 group-hover:to-primary/5 transition-colors duration-500" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-lg ring-2 ring-primary/20 group-hover:scale-105 transition-transform duration-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                {member.image && (member.image as any).url ? (
                                    <Image
                                        src={(member.image as any).url}
                                        alt={member.name}
                                        width={112}
                                        height={112}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <User className="h-10 w-10 text-muted-foreground/40" />
                                )}
                            </div>

                            {/* Status Dot */}
                            <div className="absolute bottom-2 right-2 h-5 w-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full animate-pulse" title="Active" />
                        </div>

                        {/* Info */}
                        <div className="space-y-2 w-full">
                            <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                                {member.name}
                            </h3>
                            <p className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 py-1 px-3 rounded-full inline-block mb-2">
                                {member.position}
                            </p>

                            {member.location && (
                                <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm font-medium pt-2">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{member.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {hasMore && (
                <div
                    ref={observerTarget}
                    className="col-span-full flex justify-center py-12"
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading more members...</span>
                    </div>
                </div>
            )}



            {team.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                    <p className="text-lg font-medium">No team members found.</p>
                </div>
            )}
        </div>
    );
}
