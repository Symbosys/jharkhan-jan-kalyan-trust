import { getAllGalleryItems } from "@/actions/gallery";
import { GalleryGrid } from "@/components/client/home/GalleryGrid";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

export async function GallerySection() {
    const { items } = await getAllGalleryItems({ limit: 1 });

    if (!items || items.length === 0) return null;

    // Normalize items to the shape GalleryGrid expects
    const galleryItems = items.map((item) => ({
        id: item.id,
        type: item.type as "IMAGE" | "VIDEO",
        image: item.image,
        videoUrl: item.videoUrl ?? null,
    }));

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20">
                            <LayoutGrid className="h-3 w-3 text-tertiary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Visual Archive</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                            Gallery of <span className="text-primary italic">Impact.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl font-medium">
                            Moments captured from the field — every image & video tells the story of real, tangible change across Jharkhand.
                        </p>
                    </div>

                    <Link
                        href="/gallery"
                        className="group whitespace-nowrap inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all pb-1 border-b-2 border-primary/20 hover:border-primary"
                    >
                        VIEW FULL GALLERY
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Grid */}
                <GalleryGrid items={galleryItems} />

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/gallery/photos"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-[2rem] hover:-translate-y-1 transition-all duration-300 shadow-2xl"
                    >
                        Explore Full Gallery
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
