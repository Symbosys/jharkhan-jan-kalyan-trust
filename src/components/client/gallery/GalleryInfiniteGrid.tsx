"use client";

import { ImageIcon, Loader2, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface GalleryItem {
    id: number;
    image: any;
    videoUrl: string | null;
    type: string; // IMAGE | VIDEO
    category: string;
    createdAt: Date;
}

interface GalleryInfiniteGridProps {
    initialData: GalleryItem[];
    totalCount: number;
    category: string;
    fetchGallery: (options: { page: number; limit: number; category: any }) => Promise<{ items: any[]; pagination: any }>;
}

function extractYoutubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

export function GalleryInfiniteGrid({ initialData, totalCount, category, fetchGallery }: GalleryInfiniteGridProps) {
    const [items, setItems] = useState<GalleryItem[]>(initialData as GalleryItem[]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialData.length < totalCount);
    const [lightbox, setLightbox] = useState<string | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await fetchGallery({
                page: nextPage,
                limit: 12,
                category: category,
            });

            if (response?.items && response.items.length > 0) {
                setItems(prev => [...prev, ...response.items as GalleryItem[]]);
                setPage(nextPage);

                if (items.length + response.items.length >= (response.pagination?.total || 0)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load gallery:", error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, items.length, category, fetchGallery]);

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
        <>
            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 cursor-pointer"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
                        <Image
                            src={lightbox}
                            alt="Gallery Preview"
                            width={1200}
                            height={800}
                            className="object-contain max-h-[85vh] rounded-3xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {items.map((item, index) => {
                    const isVideo = item.type === "VIDEO" && item.videoUrl;
                    const imageUrl = item.image && (item.image as any).url;
                    const youtubeId = isVideo ? extractYoutubeId(item.videoUrl!) : null;

                    return (
                        <div
                            key={`${item.id}-${index}`}
                            className="group relative break-inside-avoid rounded-[2rem] overflow-hidden bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                        >
                            {isVideo && youtubeId ? (
                                /* ── YouTube Video ── */
                                <div className="relative w-full aspect-video">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                                        title="YouTube video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    />
                                    {/* Video Badge */}
                                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm pointer-events-none">
                                        <Play className="h-3 w-3 fill-white" />
                                        <span>Video</span>
                                    </div>
                                </div>
                            ) : isVideo && !youtubeId ? (
                                /* ── Non-YouTube Video Link ── */
                                <a
                                    href={item.videoUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative w-full aspect-video bg-slate-900 flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
                                        <div className="h-16 w-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                                            <Play className="h-8 w-8 fill-white text-white" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-70">Watch Video</span>
                                    </div>
                                </a>
                            ) : imageUrl ? (
                                /* ── Image ── */
                                <div
                                    className="relative w-full cursor-pointer"
                                    onClick={() => setLightbox(imageUrl)}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt="Gallery Image"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                            <ImageIcon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ── Fallback ── */
                                <div className="w-full aspect-video bg-muted/50 flex items-center justify-center">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground/20" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {items.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-xl mb-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No items yet</h3>
                    <p className="text-muted-foreground text-sm">Gallery items will appear here.</p>
                </div>
            )}
        </>
    );
}
