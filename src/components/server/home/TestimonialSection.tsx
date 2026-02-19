import { getAllTestimonials } from "@/actions/testimonial";
import { Quote } from "lucide-react";
import { TestimonialSlider } from "@/components/client/home/TestimonialSlider";

export async function TestimonialSection() {
    const { testimonials } = await getAllTestimonials({ limit: 20 });

    if (!testimonials || testimonials.length === 0) return null;

    // Serialize only the fields needed by the slider
    const items = testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        position: t.position,
        message: t.message,
        image: (t.image as { url?: string } | null) ?? null,
    }));

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mx-auto">
                        <Quote className="h-3 w-3 text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Voices of Change</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                        What People <span className="text-primary italic">Say About Us.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
                        Real stories from beneficiaries, volunteers, and partners — the heart of everything we do.
                    </p>
                </div>

                {/* Slider — client component */}
                <TestimonialSlider testimonials={items} />
            </div>
        </section>
    );
}
