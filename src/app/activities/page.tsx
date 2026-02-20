import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { getAllActivities } from "@/actions/activity";
import { ActivityGrid } from "@/components/client/ActivityGrid";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function ActivitiesPage() {
    const { activities, pagination } = await getAllActivities({ page: 1, limit: 12 });

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary">
            <Header />
            <main className="flex-1 relative overflow-hidden">
                {/* ── Liquid Light Background Elements ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-[20%] w-[40vw] h-[40vw] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
                </div>

                {/* ── Hero Section ── */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">Making Real Impact</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-8 drop-shadow-sm">
                            Our Activities.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Discover how Jharkhand Jan Kalyan Trust is creating tangible change in communities across Jharkhand through our impactful initiatives.
                        </p>
                    </div>
                </section>

                {/* ── Activities Grid ── */}
                <section className="relative py-10 px-6 pb-24 z-10">
                    <div className="container mx-auto">
                        <ActivityGrid
                            initialActivities={activities as unknown as any[]}
                            initialTotalPages={pagination.totalPages}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
