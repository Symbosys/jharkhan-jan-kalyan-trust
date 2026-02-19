"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface Testimonial {
    id: number;
    name: string;
    position: string;
    message: string;
    image?: { url?: string } | null;
}

interface TestimonialSliderProps {
    testimonials: Testimonial[];
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Keep a ref to the autoplay plugin so we can play/pause on hover
    const autoplayPlugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "center" },
        [autoplayPlugin.current]
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        onSelect();
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi]);

    const handleMouseEnter = useCallback(() => {
        autoplayPlugin.current.stop();
    }, []);

    const handleMouseLeave = useCallback(() => {
        autoplayPlugin.current.play();
    }, []);

    return (
        <div className="relative">
            {/* Slider Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {testimonials.map((t) => {
                        const imageData = t.image as any;
                        return (
                            <div
                                key={t.id}
                                className="flex-[0_0_100%] min-w-0"
                            >
                                {/*
                                  Inner layout: prev-btn | card | next-btn
                                  Constrains the card + buttons to max-w-3xl,
                                  keeping buttons tight against the card edges.
                                */}
                                <div className="flex items-center gap-3 max-w-3xl mx-auto px-4">

                                    {/* ── Prev Button ── */}
                                    <button
                                        onClick={scrollPrev}
                                        aria-label="Previous testimonial"
                                        className="shrink-0 h-11 w-11 rounded-full bg-background border border-border/60 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-90 z-10"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {/* ── CARD — preserved design ── */}
                                    <div
                                        className="group relative flex flex-col gap-6 p-8 rounded-[2rem] bg-background border border-border/60 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex-1"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {/* Large Quote mark watermark */}
                                        <Quote className="absolute top-6 right-6 h-20 w-20 text-primary/5 rotate-180 pointer-events-none" />

                                        {/* Stars */}
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, si) => (
                                                <Star key={si} className="h-4 w-4 text-tertiary fill-tertiary" />
                                            ))}
                                        </div>

                                        {/* Message */}
                                        <blockquote className="text-base md:text-lg text-foreground font-medium leading-relaxed flex-1 italic relative z-10">
                                            &ldquo;{t.message}&rdquo;
                                        </blockquote>

                                        {/* Author */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 border-2 border-background shadow-md shrink-0">
                                                {imageData?.url ? (
                                                    <Image
                                                        src={imageData.url}
                                                        alt={t.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="h-6 w-6 text-primary/40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-foreground text-sm tracking-tight">{t.name}</p>
                                                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{t.position}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Next Button ── */}
                                    <button
                                        onClick={scrollNext}
                                        aria-label="Next testimonial"
                                        className="shrink-0 h-11 w-11 rounded-full bg-background border border-border/60 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-90 z-10"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${i === selectedIndex
                                ? "w-6 h-2.5 bg-primary"
                                : "w-2.5 h-2.5 bg-border hover:bg-primary/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
