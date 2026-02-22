import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { benefits } from "@/data/benefits-data";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return benefits.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const benefit = benefits.find((b) => b.slug === slug);
    if (!benefit) return { title: "Not Found" };
    return {
        title: `${benefit.englishTitle} — Jharkhand Jan Kalyan Trust`,
        description: benefit.description,
    };
}

export default async function BenefitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const benefit = benefits.find((b) => b.slug === slug);
    if (!benefit) notFound();

    const Icon = benefit.icon;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary">
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* ── Background Glows ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-400/15 rounded-full blur-[120px] mix-blend-multiply" />
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-400/15 rounded-full blur-[120px] mix-blend-multiply" />
                    <div className="absolute -bottom-32 left-[20%] w-[40vw] h-[40vw] bg-pink-400/15 rounded-full blur-[120px] mix-blend-multiply" />
                </div>

                {/* ── Hero Section ── */}
                <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6">
                    <div className="container mx-auto relative z-10">
                        {/* Breadcrumb */}
                        <Link
                            href="/#benefits"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-10 group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Benefits
                        </Link>

                        <div className="max-w-4xl">
                            {/* Icon */}
                            <div className={`h-20 w-20 rounded-3xl bg-linear-to-br ${benefit.gradient} flex items-center justify-center text-white shadow-xl shadow-primary/10 mb-8`}>
                                <Icon className="h-10 w-10" />
                            </div>

                            {/* Tag */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md mb-6">
                                <span className={`flex h-2 w-2 rounded-full bg-linear-to-r ${benefit.gradient}`}></span>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                    {benefit.englishTitle}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-6">
                                {benefit.title}
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
                                {benefit.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── About Section ── */}
                <section className="relative py-16 px-6 z-10">
                    <div className="container mx-auto">
                        <div className="relative rounded-[3rem] p-8 md:p-16 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-50" />

                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                                    About This Initiative
                                </h2>
                                <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-4xl">
                                    {benefit.longDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Impact Stats ── */}
                <section className="relative py-16 px-6 z-10">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {benefit.stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                                >
                                    <span className="text-4xl md:text-5xl font-black text-foreground mb-2">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Highlights ── */}
                <section className="relative py-16 px-6 z-10">
                    <div className="container mx-auto">
                        <div className="relative rounded-[3rem] p-8 md:p-16 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-12">
                                Key Highlights
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {benefit.highlights.map((highlight, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className={`h-8 w-8 rounded-lg bg-linear-to-br ${benefit.gradient} flex items-center justify-center text-white shrink-0 mt-0.5`}>
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <p className="text-foreground font-medium leading-relaxed">
                                            {highlight}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ── */}
                <section className="py-20 px-6 relative z-10">
                    <div className="container mx-auto max-w-4xl">
                        <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden text-center">
                            <div className={`absolute inset-0 bg-linear-to-tr ${benefit.gradient} opacity-90`} />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                    Join Our Mission !
                                </h2>
                                <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
                                    Your support can help us expand this initiative and reach more people in need. Join our mission today.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="/member-apply"
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl shadow-black/20"
                                    >
                                        Join Our Mission
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/donate"
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-white/20 text-white font-bold text-lg rounded-full hover:bg-white/30 transition-all border border-white/30"
                                    >
                                        Donate Now
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
