"use client";

import {
    Calendar,
    Loader2,
    MapPin,
    ArrowRight,
    Clock,
    Play
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { BookingModal } from "./BookingModal";

interface Event {
    id: number;
    title: string;
    description: string;
    type: string;
    location: string;
    image: any;
    videoUrl: string | null;
    date: Date;
    createdAt: Date;
}

interface EventInfiniteListProps {
    initialData: Event[];
    totalCount: number;
    fetchEvents: (options: { page: number; limit: number }) => Promise<{ events: any[]; pagination: any }>;
}

const getYoutubeId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export function EventInfiniteList({ initialData, totalCount, fetchEvents }: EventInfiniteListProps) {
    const [events, setEvents] = useState<Event[]>(initialData as Event[]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData.length < totalCount);

    // Modal State
    const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string } | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await fetchEvents({
                page: nextPage,
                limit: 12,
            });

            if (response?.events && response.events.length > 0) {
                setEvents(prev => [...prev, ...response.events as Event[]]);
                setPage(nextPage);

                if (events.length + response.events.length >= (response.pagination?.total || 0)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more events:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, events.length, fetchEvents]);

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
            {/* Booking Modal */}
            {selectedEvent && (
                <BookingModal
                    isOpen={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    eventId={selectedEvent.id}
                    eventTitle={selectedEvent.title}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => {
                    const ytId = getYoutubeId(event.videoUrl);
                    const hasVideo = !!ytId;

                    return (
                        <div
                            key={`${event.id}-${index}`}
                            className="group relative flex flex-col bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                        >
                            {/* Media Section (Video or Image) */}
                            <div className="relative aspect-video overflow-hidden bg-slate-900">
                                {hasVideo ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                                        title={event.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                ) : (
                                    <>
                                        {event.image?.url ? (
                                            <Image
                                                src={event.image.url}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                                                <Calendar className="h-10 w-10 text-primary/20" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{event.type}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Content Section (Compact) */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Date and Title */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                                        <span className="text-[10px] font-black text-primary uppercase leading-tight">
                                            {format(new Date(event.date), "MMM")}
                                        </span>
                                        <span className="text-xl font-black text-foreground leading-tight tracking-tighter">
                                            {format(new Date(event.date), "dd")}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-foreground tracking-tight leading-tight line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            <span className="truncate max-w-[120px]">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-6">
                                    {event.description}
                                </p>

                                {/* Action Bar */}
                                <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-white/20 dark:border-white/10">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic">
                                        <Clock className="h-3 w-3" />
                                        <span>Upcoming</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEvent({ id: event.id, title: event.title })}
                                        className="h-10 px-5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Book Now
                                        <ArrowRight className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary opacity-50" />
                </div>
            )}

            {events.length === 0 && !loading && (
                <div className="text-center py-20">
                    <h3 className="text-xl font-black text-foreground">No events scheduled.</h3>
                    <p className="text-muted-foreground text-xs mt-1">Please check back later.</p>
                </div>
            )}
        </div>
    );
}
