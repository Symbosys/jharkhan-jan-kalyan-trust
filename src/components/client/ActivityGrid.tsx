"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAllActivities } from "@/actions/activity";
import { ImageIcon, Play, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

interface Activity {
    id: number;
    title: string;
    description: string;
    type: "IMAGE" | "VIDEO";
    image?: {
        url: string;
        public_id: string;
    };
    videoUrl?: string;
}

interface ActivityGridProps {
    initialActivities: Activity[];
    initialTotalPages: number;
}

export function ActivityGrid({ initialActivities, initialTotalPages }: ActivityGridProps) {
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialTotalPages > 1);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [filter, setFilter] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const nextPage = page + 1;
            const { activities: newActivities, pagination } = await getAllActivities({
                page: nextPage,
                limit: 12,
            });

            setActivities((prev) => [...prev, ...(newActivities as unknown as Activity[])]);
            setPage(nextPage);
            setHasMore(nextPage < pagination.totalPages);
        } catch (error) {
            console.error("Failed to load more activities:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasMore, loading]);

    const filteredActivities = filter === "ALL"
        ? activities
        : activities.filter((a) => a.type === filter);

    return (
        <>
            {/* Filter Bar */}
            <div className="flex items-center justify-center gap-3 mb-16">
                {(["ALL", "IMAGE", "VIDEO"] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border transition-all duration-300 ${filter === type
                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
                            : "bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 text-foreground/60 hover:bg-white/60 dark:hover:bg-white/10 hover:text-foreground"
                            }`}
                    >
                        {type === "ALL" ? "All Activities" : type === "IMAGE" ? "Photos" : "Videos"}
                    </button>
                ))}
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities.map((activity, index) => {
                    const ytId = activity.videoUrl ? getYoutubeId(activity.videoUrl) : null;
                    const thumbnail =
                        activity.image?.url ||
                        (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

                    return (
                        <div
                            key={activity.id}
                            className="group relative rounded-[2.5rem] overflow-hidden bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            style={{ animationDelay: `${(index % 12) * 50}ms` }}
                        >
                            {/* Image / Thumbnail */}
                            <div
                                className="relative aspect-video overflow-hidden cursor-pointer"
                                onClick={() => {
                                    if (activity.type === "VIDEO" && activity.videoUrl) {
                                        setPlayingVideo(activity.videoUrl);
                                    }
                                }}
                            >
                                {thumbnail ? (
                                    <Image
                                        src={thumbnail}
                                        alt={activity.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                        <ImageIcon className="h-12 w-12 text-primary/20" />
                                    </div>
                                )}

                                {/* Video Play Button */}
                                {activity.type === "VIDEO" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors z-10">
                                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary/95 text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300 ring-4 ring-white/20">
                                            <Play className="h-8 w-8 fill-current ml-1" />
                                        </div>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span
                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border backdrop-blur-md ${activity.type === "VIDEO"
                                            ? "bg-red-500/80 border-red-400/50 text-white"
                                            : "bg-primary/80 border-primary/50 text-white"
                                            }`}
                                    >
                                        {activity.type}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 space-y-3">
                                <h3 className="text-lg font-black text-foreground tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                    {activity.title}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
                <div className="text-center py-20">
                    <div className="h-20 w-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                        <ImageIcon className="h-10 w-10 text-primary/40" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">No Activities Found</h3>
                    <p className="text-muted-foreground font-medium">
                        {filter !== "ALL" ? `No ${filter.toLowerCase()} activities available.` : "Check back later for updates."}
                    </p>
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerRef} className="py-12 flex justify-center">
                {loading && (
                    <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-bold text-muted-foreground">Loading more activities...</span>
                    </div>
                )}
                {!hasMore && activities.length > 0 && (
                    <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-widest">
                        — You&apos;ve seen all activities —
                    </p>
                )}
            </div>

            {/* Video Player Modal */}
            <Dialog open={!!playingVideo} onOpenChange={(open) => !open && setPlayingVideo(null)}>
                <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Activity Video Player</DialogTitle>
                    </DialogHeader>
                    {playingVideo && (
                        <div className="relative aspect-video w-full bg-slate-950">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeId(playingVideo)}?autoplay=1&rel=0&modestbranding=1&hd=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
