import Link from "next/link";
import { Heart, ArrowRight, IndianRupee, Users, Leaf, GraduationCap } from "lucide-react";

const donateOptions = [
    { amount: "₹500", label: "Seed a Dream", description: "Funds school supplies for one child for a month.", icon: GraduationCap },
    { amount: "₹1,000", label: "Feed a Family", description: "Provides essential nutrition kits for a family in need.", icon: Leaf },
    { amount: "₹5,000", label: "Champion Change", description: "Sponsors a medical camp serving 20+ patients.", icon: Users },
];

export function DonateSection() {
    return (
        <section className="py-24 md:py-32 bg-foreground text-background relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

                    {/* Left — Brand Message */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                                <Heart className="h-3 w-3 text-primary fill-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Make an Impact</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tighter">
                                Give with <br />
                                <span className="text-primary italic">Purpose.</span>
                            </h2>
                            <p className="text-lg text-background/60 font-medium leading-relaxed max-w-md">
                                Every rupee you contribute directly funds real-world change — from books in classrooms to medicines in remote clinics across Jharkhand.
                            </p>
                        </div>

                        {/* Trust Signals */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-white/5 border border-white/10">
                                <IndianRupee className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm font-black text-background">100% Transparent</p>
                                    <p className="text-[10px] text-background/50 font-medium">Every rupee tracked</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-white/5 border border-white/10">
                                <Heart className="h-5 w-5 text-secondary" />
                                <div>
                                    <p className="text-sm font-black text-background">12,000+ Beneficiaries</p>
                                    <p className="text-[10px] text-background/50 font-medium">Lives changed</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/donate"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
                        >
                            Donate Now
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>

                    {/* Right — Donation Tiers */}
                    <div className="w-full lg:w-1/2 space-y-4">
                        {donateOptions.map((option, i) => (
                            <Link
                                key={i}
                                href="/donate"
                                className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-400"
                            >
                                <div className="shrink-0 h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110">
                                    <option.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-2xl font-black text-background">{option.amount}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                                            {option.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-background/50 font-medium truncate">{option.description}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-background/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                            </Link>
                        ))}

                        {/* Custom Amount */}
                        <div className="p-6 rounded-[2rem] border border-dashed border-white/20 text-center hover:border-primary/40 transition-colors">
                            <p className="text-sm text-background/40 font-medium">
                                Want to give a custom amount?{" "}
                                <Link href="/donate" className="text-primary font-black hover:underline underline-offset-4">
                                    Click Here →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
