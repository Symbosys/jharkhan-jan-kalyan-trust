import {
    ArrowRight,
    Users
} from "lucide-react";
import Link from "next/link";
import { benefits } from "@/data/benefits-data";

export function BenefitsSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Header Area */}
                <div className="max-w-3xl mb-20 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-primary" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Our Benefits</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-tertiary leading-[1.1] tracking-tight">
                        Jharkhand Jan Kalyan Trust <br />
                        <span className="text-foreground italic">Our Facilities</span>
                    </h2>

                    <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Dedicated to serving humanity through comprehensive facilities designed to empower every citizen of Jharkhand.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className={`group relative p-8 rounded-[2.5rem] ${benefit.bgColor} border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between`}
                        >
                            <div className="space-y-6">
                                <div className={`h-14 w-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                                    <benefit.icon className={`h-7 w-7 ${benefit.color}`} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground leading-tight transition-colors duration-300 group-hover:text-primary">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                        {benefit.englishTitle}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium pt-2">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>

                            {/* Learn More Link */}
                            <Link
                                href={`/benefits/${benefit.slug}`}
                                className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${benefit.color} hover:underline underline-offset-4 transition-all group/link`}
                            >
                                Learn More
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>

                            {/* Decorative corner element */}
                            <div className={`absolute top-0 right-0 w-24 h-24 ${benefit.bgColor} rounded-bl-[4rem] opacity-60 group-hover:opacity-100 transition-all duration-500`} />
                        </div>
                    ))}

                    {/* Join Us Card */}
                    <div className="group relative p-8 rounded-[2.5rem] bg-primary text-white shadow-xl shadow-primary/20 flex flex-col justify-between overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Users className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black leading-none">
                                    Join Us!
                                </h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                                    Join Our Mission
                                </p>
                                <p className="text-sm font-medium leading-relaxed pt-2">
                                    Become a part of the change. Your small step can create a massive impact.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/member-apply"
                            className="relative z-10 mt-8 py-3 bg-white text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all group-hover:gap-4"
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>
                </div>

                {/* Footer Slogan */}
                <div className="mt-24 pt-12 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Our Philosophy</p>
                            <p className="text-2xl font-black text-foreground">Our Belief</p>
                        </div>
                        <div className="h-12 w-px bg-border/60 hidden md:block" />
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Your Wellbeing</p>
                            <p className="text-2xl font-black text-foreground">Your Safety</p>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-tertiary/10 border border-tertiary/20 rounded-full">
                        <p className="text-tertiary font-black text-xl tracking-tighter uppercase italic">
                            Stay Safe !!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
