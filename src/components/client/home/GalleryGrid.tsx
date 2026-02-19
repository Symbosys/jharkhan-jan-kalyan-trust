"use client";

import Image from "next/image";
import { Play, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface GalleryItem {
    id: number;
    type: "IMAGE" | "VIDEO";
    image: any;
    videoUrl: string | null;
}

interface GalleryGridProps {
    items: GalleryItem[];
}

function getYouTubeId(url: string): string | null {
    const patterns = [
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?]+)/,
        /youtube\.com\/embed\/([^?]+)/,
        /youtube\.com\/shorts\/([^?]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function VideoCard({ item }: { item: GalleryItem }) {
    const [playing, setPlaying] = useState(false);
    const videoId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;

    if (!videoId) return null;

    return (
        <div className="group relative aspect-video rounded-[1.5rem] overflow-hidden bg-black border border-border">
            {playing ? (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Gallery Video"
                />
            ) : (
                <button
                    onClick={() => setPlaying(true)}
                    className="relative w-full h-full block"
                    aria-label="Play video"
                >
                    <Image
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt="Video thumbnail"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-7 w-7 text-red-600 fill-red-600 ml-1" />
                        </div>
                    </div>
                </button>
            )}
        </div>
    );
}

export function GalleryGrid({ items }: GalleryGridProps) {
    if (items.length === 0) {
        return (
            <div className="col-span-full text-center py-20">
                <ImageIcon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No gallery items yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
                if (item.type === "VIDEO") {
                    return <VideoCard key={item.id} item={item} />;
                }

                const imageData = item.image as any;
                if (!imageData?.url) return null;

                return (
                    <div
                        key={item.id}
                        className="group relative aspect-video rounded-[1.5rem] overflow-hidden border border-border bg-muted"
                    >
                        <Image
                            src={imageData.url}
                            alt="Gallery image"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                );
            })}
        </div>
    );
}
