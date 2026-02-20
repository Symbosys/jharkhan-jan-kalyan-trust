import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { ArrowRight, BookOpen, CheckCircle, Heart, Shield, Target, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
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
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">Est. 2012 — Serving Humanity</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-8 drop-shadow-sm">
                            Our Story.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Weaving a tapestry of hope and resilience. A decade of illuminating lives in the heart of Jharkhand.
                        </p>
                    </div>
                </section>

                {/* ── Narrative Glass Card ── */}
                <section className="relative py-20 px-6">
                    <div className="container mx-auto">
                        <div className="relative rounded-[3rem] p-8 md:p-16 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-50" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-10">
                                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                                        From Tiny Ripples to <br />
                                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">Transformative Waves.</span>
                                    </h2>
                                    <div className="space-y-6 text-lg font-medium text-muted-foreground/90 leading-relaxed">
                                        <p>
                                            Jharkhand Jan Kalyan Trust was born from a spark of liquid light — the idea that clarity, purity, and flow can wash away the stagnation of poverty. Founded in 2012, we started as a small stream of volunteers flowing into the most remote villages.
                                        </p>
                                        <p>
                                            Today, that stream has become a river of change. Our philosophy is fluid yet powerful: adapt to the needs of the community, remain transparent in our actions, and let the benefits flow to the very last person in line.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {/* Glass Stat Cards */}
                                        <div className="flex flex-col px-6 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md shadow-lg">
                                            <span className="text-4xl font-black text-foreground">10+</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Years Flowing</span>
                                        </div>
                                        <div className="flex flex-col px-6 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-md shadow-lg">
                                            <span className="text-4xl font-black text-foreground">50+</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Villages Touched</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/20 group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop"
                                        alt="Liquid Light Impact"
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Glass Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl text-white">
                                            <p className="font-medium italic text-lg opacity-90">
                                                &ldquo;Like water, we find a way. Through every obstacle, hope must flow.&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Vision & Mission (Frosted Glass) ── */}
                <section className="py-24 px-6 relative z-10">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group p-10 rounded-[3rem] bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-400/20 to-purple-400/20 border border-white/50 flex items-center justify-center mb-8 shadow-inner">
                                    <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-black text-foreground mb-4">Our Vision</h3>
                                <p className="text-muted-foreground font-medium leading-loose text-lg">
                                    A society fluid in opportunity, transparent in justice, and pure in its intent to uplift every soul. We see a future where dignity is as abundant as light.
                                </p>
                            </div>

                            <div className="group p-10 rounded-[3rem] bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-emerald-400/20 to-teal-400/20 border border-white/50 flex items-center justify-center mb-8 shadow-inner">
                                    <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-black text-foreground mb-4">Our Mission</h3>
                                <p className="text-muted-foreground font-medium leading-loose text-lg">
                                    To channel resources like a life-giving river into education, health, and livelihood. We build reservoirs of knowledge and pipelines of support for the marginalized.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Benefits Section (Liquid Cards) ── */}
                <section className="py-28 px-6 relative z-10">
                    <div className="container mx-auto">
                        <div className="text-center mb-24 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                            <h2 className="relative text-5xl md:text-7xl font-black text-foreground tracking-tight mb-2">
                                झारखंड जन कल्याण ट्रस्ट
                            </h2>
                            <p className="relative text-3xl md:text-4xl font-light text-muted-foreground font-serif italic">
                                Our Benefits — <span className="underline decoration-wavy decoration-primary/30 underline-offset-8">हमारी सुविधाएँ</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { t: "Educational Support", ht: "शिक्षा सहायता", d: "Scholarships and free study materials.", i: BookOpen, c: "from-blue-400 to-indigo-500" },
                                { t: "Healthcare Camps", ht: "स्वास्थ्य शिविर", d: "Free checkups and medicine distribution.", i: Heart, c: "from-rose-400 to-pink-500" },
                                { t: "Women Empowerment", ht: "महिला सशक्तिकरण", d: "Skill development networks.", i: Users, c: "from-violet-400 to-purple-500" },
                                { t: "Community Dev", ht: "सामुदायिक विकास", d: "Clean water and sanitation infrastructure.", i: Target, c: "from-amber-400 to-orange-500" },
                                { t: "Legal Aid", ht: "कानूनी सहायता", d: "Rights awareness workshops.", i: Shield, c: "from-emerald-400 to-green-500" },
                                { t: "Rapid Relief", ht: "आपातकालीन राहत", d: "Crisis management and aid.", i: Zap, c: "from-red-400 to-orange-500" }
                            ].map((item, index) => (
                                <div key={index} className="group relative p-8 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2">
                                    {/* Glass Background */}
                                    <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 transition-colors duration-500 group-hover:bg-white/60 dark:group-hover:bg-white/10" />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-start h-full">
                                        <div className={`h-14 w-14 rounded-2xl bg-linear-to-br ${item.c} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <item.i className="h-7 w-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-1">{item.t}</h3>
                                        <p className="text-sm font-serif text-primary mb-4">{item.ht}</p>

                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 flex-1">
                                            {item.d}
                                        </p>

                                        <div className="w-full h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent group-hover:via-primary/50 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA (Floating) ── */}
                <div className="py-20 px-6 relative z-10">
                    <div className="container mx-auto max-w-4xl">
                        <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden text-center">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary via-purple-500 to-blue-500 opacity-90" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Become a Catalyst.</h2>
                                <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
                                    Your support is the current that powers this movement. Join us in flowing towards a better tomorrow.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl shadow-black/20"
                                >
                                    Join Our Journey
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Add animation keyframes to global CSS or use tailwind config if needed,
// using arbitary values for now in the style tag for the blob animation
