import { getAllDonars } from "@/actions/donar";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, IndianRupee, User } from "lucide-react";

export async function DonorsSection() {
    const { donars } = await getAllDonars({ limit: 8, status: "VERIFIED" });

    if (!donars || donars.length === 0) return null;

    return (
        <section className="py-28 bg-background relative overflow-hidden">
            {/* Subtle background dot pattern */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[32px_32px]" />
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Heart className="h-3 w-3 text-primary fill-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pillars of Support</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                            Our Generous <span className="text-primary italic">Donors.</span>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-md font-medium leading-relaxed">
                            Every contribution — big or small — fuels the change we create together. We are forever grateful.
                        </p>
                    </div>

                    <Link
                        href="/donors"
                        className="group whitespace-nowrap self-start md:self-auto inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all pb-1 border-b-2 border-primary/20 hover:border-primary"
                    >
                        SEE ALL DONORS
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* ── Donor Cards Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {donars.map((donor, index) => {
                        const imgData = donor.donorImage as any;

                        // Every 5th card gets a highlighted accent for visual rhythm
                        const isAccent = index % 5 === 0;

                        return (
                            <div
                                key={donor.id}
                                className={`group relative flex flex-col gap-5 p-6 rounded-[1.75rem] border transition-all duration-500 hover:-translate-y-1.5 overflow-hidden
                                    ${isAccent
                                        ? "bg-primary border-primary/30 shadow-xl shadow-primary/15"
                                        : "bg-background border-border/60 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/8"
                                    }`}
                            >
                                {/* Watermark heart */}
                                <Heart className={`absolute -bottom-4 -right-4 h-24 w-24 pointer-events-none transition-transform duration-500 group-hover:scale-110
                                    ${isAccent ? "text-white/10 fill-white/5" : "text-primary/5 fill-primary/3"}`} />

                                {/* Top row: avatar + rank badge */}
                                <div className="flex items-start justify-between">
                                    {/* Avatar */}
                                    <div className={`h-14 w-14 rounded-2xl overflow-hidden shadow-lg shrink-0 ring-2 transition-all duration-300
                                        ${isAccent ? "ring-white/30 group-hover:ring-white/60" : "ring-border group-hover:ring-primary/30"}`}>
                                        {imgData?.url ? (
                                            <Image
                                                src={imgData.url}
                                                alt={donor.name}
                                                width={56}
                                                height={56}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center
                                                ${isAccent ? "bg-white/10" : "bg-primary/10"}`}>
                                                <User className={`h-7 w-7 ${isAccent ? "text-white/60" : "text-primary/40"}`} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Donor index badge */}
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full
                                        ${isAccent
                                            ? "bg-white/15 text-white"
                                            : "bg-primary/8 text-primary border border-primary/15"
                                        }`}>
                                        #{String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="space-y-1.5 relative z-10">
                                    <p className={`font-extrabold text-base tracking-tight leading-tight transition-colors
                                        ${isAccent ? "text-white" : "text-foreground group-hover:text-primary"}`}>
                                        {donor.name}
                                    </p>

                                    {/* Amount pill */}
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                        ${isAccent ? "bg-white/15" : "bg-primary/8 border border-primary/15"}`}>
                                        <IndianRupee className={`h-3 w-3 shrink-0 ${isAccent ? "text-white" : "text-primary"}`} />
                                        <span className={`text-sm font-black ${isAccent ? "text-white" : "text-primary"}`}>
                                            {donor.amount.toLocaleString("en-IN")}
                                        </span>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isAccent ? "text-white/60" : "text-muted-foreground"}`}>
                                            contributed
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom divider line */}
                                <div className={`h-px mt-auto ${isAccent ? "bg-white/10" : "bg-border/50"}`} />
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isAccent ? "text-white/50" : "text-muted-foreground"}`}>
                                    Verified Donor
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* ── Gratitude + See All ── */}
                <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-border/50">
                    <p className="text-muted-foreground font-medium text-sm italic max-w-md text-center sm:text-left">
                        &ldquo;The greatest use of life is to spend it for something that will outlast it.&rdquo;
                        <span className="not-italic text-foreground font-bold ml-1">— Thank you for choosing impact.</span>
                    </p>
                    <Link
                        href="/donors"
                        className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                    >
                        View All Donors
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
