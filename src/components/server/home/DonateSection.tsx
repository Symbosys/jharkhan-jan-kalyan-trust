import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import Image from "next/image";

interface Donor {
    id: number;
    name: string;
    donorImage: any;
}

interface DonateSectionProps {
    donors?: Donor[];
    totalDonors?: number;
}

export function DonateSection({ donors = [], totalDonors = 5000 }: DonateSectionProps) {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-background">
            {/* ── Liquid Light Aesthetic Background ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-[-10%] w-[50vw] h-[50vw] bg-rose-400/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-10 relative">
                        {/* Decorative background icon */}
                        <div className="absolute -top-20 -left-10 opacity-5 pointer-events-none">
                            <Heart className="w-64 h-64 text-primary fill-primary -rotate-12" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">Impacting Lives Since 2012</span>
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] drop-shadow-sm">
                                    Every Seed <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-rose-500 to-orange-500">Grows Hope.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                    Your generosity is the lifeblood of our mission. Together, we can irrigate the barren fields of poverty and watch a thousand dreams bloom.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link
                                    href="/donate"
                                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white font-black text-lg uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                >
                                    Donate Us
                                    <Heart className="h-5 w-5 fill-white transition-transform group-hover:scale-125 group-hover:rotate-12" />
                                </Link>

                                <div className="flex items-center gap-4 px-6 border-l border-foreground/10">
                                    <div className="flex -space-x-4">
                                        {donors.length > 0 ? (
                                            donors.map((donor) => (
                                                <div key={donor.id} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-lg shadow-black/5 relative">
                                                    <Image
                                                        src={donor.donorImage?.url || `https://i.pravatar.cc/150?u=${donor.id + 10}`}
                                                        alt={donor.name || "Donor"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            [1, 2, 3].map((i) => (
                                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-lg shadow-black/5 relative">
                                                    <Image
                                                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                                                        alt="Donor"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground leading-none">{totalDonors}+</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Verified Donors</p>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Pills */}
                            <div className="flex flex-wrap gap-3 pt-6">
                                {[
                                    { text: "100% Transparency", icon: ShieldCheck },
                                    { text: "Immediate Impact", icon: Zap },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xs font-bold text-muted-foreground/80 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-white/10">
                                        <item.icon className="w-4 h-4 text-primary" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="relative h-[450px] lg:h-[600px] w-full rounded-[3rem] overflow-hidden group">
                        {/* Decorative Frame */}
                        <div className="absolute inset-4 z-20 border-2 border-white/20 rounded-[2.5rem] pointer-events-none" />

                        <Image
                            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"
                            alt="Support Humanity"
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-linear-to-tr from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-primary/10 opacity-30" />

                        {/* Floating Card */}
                        <div className="absolute bottom-8 left-8 right-8 z-30 animate-float">
                            <div className="p-8 rounded-[2.5rem] bg-white/20 backdrop-blur-3xl border border-white/30 shadow-2xl text-white">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                        <Heart className="h-6 w-6 fill-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black italic tracking-tight leading-tight mb-2">
                                            &ldquo;Your light can be the bridge that crosses a child's darkest river.&rdquo;
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-px bg-white/30" />
                                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Help us build that bridge</p>
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
