"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageIcon, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

interface ActivitySliderProps {
    activities: Activity[];
}

export function ActivitySlider({ activities = [] }: ActivitySliderProps) {
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (activities.length === 0) return null;

    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-tertiary tracking-tight font-outfit uppercase">
                            Recent Activities
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <p className="text-muted-foreground text-sm font-medium pt-2 max-w-md">
                            Discover how Jan Kalyan NGO is making a tangible difference in communities.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/activities"
                            className="text-sm font-bold text-primary hover:text-secondary transition-all uppercase tracking-widest hidden md:block"
                        >
                            View All Activities →
                        </Link>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollPrev}
                                className="h-10 w-10 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary shadow-sm active:scale-90 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={scrollNext}
                                className="h-10 w-10 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10 text-primary shadow-sm active:scale-90 transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Slider Component */}
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex gap-6 md:gap-8 ml-1">
                        {activities.map((activity) => {
                            const ytId = activity.videoUrl ? getYoutubeId(activity.videoUrl) : null;
                            const thumbnail = activity.image?.url || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null);

                            return (
                                <div
                                    key={activity.id}
                                    className="flex-[0_0_300px] sm:flex-[0_0_360px] md:flex-[0_0_420px] min-w-0"
                                >
                                    <div
                                        className="group relative aspect-video overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-transparent hover:border-primary/20"
                                        onClick={() => {
                                            if (activity.type === "VIDEO" && activity.videoUrl) {
                                                setPlayingVideo(activity.videoUrl);
                                            }
                                        }}
                                    >
                                        {/* Thumbnail / Image */}
                                        {thumbnail ? (
                                            <Image
                                                src={thumbnail}
                                                alt={activity.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 300px, (max-width: 1200px) 360px, 420px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <ImageIcon className="h-12 w-12 text-primary/20" />
                                            </div>
                                        )}

                                        {/* Always Visible Play Button for Videos */}
                                        {activity.type === "VIDEO" && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors z-10">
                                                <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-primary/95 text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300 ring-4 ring-white/20">
                                                    <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current ml-1" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Overlay for Text */}
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                                        {/* Info Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 z-30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] rounded border ${activity.type === "VIDEO" ? "bg-red-500 border-red-400 text-white" : "bg-primary border-primary-foreground/20 text-white"
                                                    }`}>
                                                    {activity.type}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-bold text-lg sm:text-xl leading-tight line-clamp-1">{activity.title}</h3>
                                            <p className="text-white/70 text-sm mt-1.5 line-clamp-2 leading-relaxed">{activity.description}</p>
                                        </div>

                                        {/* Type Badge (Visible by default) */}
                                        <div className="absolute top-4 left-4 z-40">
                                            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest scale-100 group-hover:scale-0 transition-all duration-300">
                                                {activity.type}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile View All Link */}
                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/activities"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary group"
                    >
                        EXPLORE ALL ACTIVITIES
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>

            {/* Premium Video Modal */}
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
        </section>
    );
}
