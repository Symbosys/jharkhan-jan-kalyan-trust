import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Target, Users } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

                    {/* Content Column */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10">
                                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Est. 2012</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight">
                                Making a <span className="text-primary italic">Meaningful</span> <br />
                                Difference in Jharkhand.
                            </h2>

                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                                Jharkhand Jan Kalyan Trust is dedicated to the holistic development of underprivileged communities. We focus on bridging the gap in education, healthcare, and sustainable infrastructure to ensure every individual has a path to dignity.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                            <div className="group space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Our Vision</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    To create a society where equal opportunity is a fundamental right, not a luxury.
                                </p>
                            </div>

                            <div className="group space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
                                    <Heart className="h-6 w-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">Core Values</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    Transparency, integrity, and absolute dedication to the grassroots communities we serve.
                                </p>
                            </div>
                        </div>

                        {/* CTA Area */}
                        <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-border/60">
                            <Link
                                href="/about-us"
                                className="group relative inline-flex items-center justify-center px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Read More About Us
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                                            <Users className="h-5 w-5 text-muted-foreground/60" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight">Active Impact</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">In 50+ Villages</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative p-4">
                            {/* Decorative Background for Image */}
                            <div className="absolute top-0 right-0 w-[90%] h-[90%] bg-muted rounded-[3rem] -z-10" />

                            <div className="relative aspect-4/5 w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-background">
                                <Image
                                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"
                                    alt="Community Impact"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />

                                {/* Impact Floating Badge */}
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="backdrop-blur-xl bg-black/40 border border-white/20 p-6 rounded-3xl flex items-center gap-6">
                                        <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center">
                                            <Heart className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-white text-3xl font-black">10k+</p>
                                            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Lives Empowered</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

