"use client";

import { Calendar, Loader2, MapPin, Search } from "lucide-react";
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
                limit: 10,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                    <div
                        key={`${event.id}-${index}`}
                        className="group relative flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                    >
                        {/* Image Section */}
                        <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                            {event.image && (event.image as any).url ? (
                                <Image
                                    src={(event.image as any).url}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Calendar className="h-12 w-12 text-muted-foreground/30" />
                                </div>
                            )}

                            {/* Date Badge */}
                            <div className="absolute top-6 left-6 z-10 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-white/40 dark:border-white/10">
                                <span className="text-xs font-black text-primary uppercase leading-tight">
                                    {format(new Date(event.date), "MMM")}
                                </span>
                                <span className="text-xl font-black text-foreground leading-tight">
                                    {format(new Date(event.date), "dd")}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-8 flex flex-col justify-between space-y-4">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                                    {event.type}
                                </div>
                                <h3 className="text-2xl font-black text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/40 dark:border-white/10 flex flex-col gap-4">
                                <div className="flex items-center justify-between text-sm font-bold">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span className="truncate max-w-[150px]">{event.location}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEvent({ id: event.id, title: event.title })}
                                        className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {events.length === 0 && !loading && (
                <div className="text-center py-24">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-xl mb-6 shadow-xl">
                        <Calendar className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">No events found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">Check back later for upcoming community programs and initiatives.</p>
                </div>
            )}
        </div>
    );
}
