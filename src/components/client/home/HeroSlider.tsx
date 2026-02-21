"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface SliderImage {
    id: number;
    image: {
        url: string;
        public_id: string;
    };
    order: number;
}

interface HeroSliderProps {
    sliders: any[];
}

export function HeroSlider({ sliders = [] }: HeroSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative w-full overflow-hidden bg-background">
            {/* Carousel Container */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {sliders.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative flex-[0_0_100%] min-w-0"
                        >
                            <div className="relative aspect-video md:aspect-21/9 w-full max-h-[600px]">
                                <Image
                                    src={image.image.url}
                                    alt={`Slide ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                                {/* Optional Overlay for better text contrast if needed later */}
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {sliders.map((_, index: number) => (
                    <button
                        key={index}
                        onClick={() => emblaApi && emblaApi.scrollTo(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${index === selectedIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
