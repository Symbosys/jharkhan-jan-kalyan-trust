import { getAllDonars } from "@/actions/donar";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Heart, IndianRupee, Trophy, User } from "lucide-react";

export async function DonorsSection() {
    const { donars } = await getAllDonars({ limit: 8, status: "VERIFIED" });

    if (!donars || donars.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50/50 dark:bg-slate-900/20 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8 relative z-10">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-border/40 pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Trophy className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Wall of Gratitude</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Our Generous <span className="text-primary italic">Donors.</span>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-md font-medium leading-relaxed">
                            Recognizing the incredible individuals whose contributions fuel our mission and create real-world impact.
                        </p>
                    </div>

                    <Link
                        href="/donors"
                        className="group whitespace-nowrap inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border/60 text-sm font-bold text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm hover:shadow-md"
                    >
                        View All Donors
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* ── Donor Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {donars.map((donor, index) => {
                        const imgData = donor.donorImage as any;

                        return (
                            <div
                                key={donor.id}
                                className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-background border border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Avatar Ring */}
                                <div className="relative mb-6">
                                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-border group-hover:scale-105 transition-transform duration-300">
                                        {imgData?.url ? (
                                            <Image
                                                src={imgData.url}
                                                alt={donor.name}
                                                width={80}
                                                height={80}
                                                className="object-contain w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                <User className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full border-4 border-background flex items-center justify-center text-white shadow-sm" title="Verified Donor">
                                        <CheckCircle className="h-3.5 w-3.5 stroke-[3px]" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1 w-full">
                                    <h3 className="font-extrabold text-lg text-foreground truncate px-2">{donor.name}</h3>

                                    <div className="flex items-center justify-center gap-1.5 text-primary bg-primary/5 py-1.5 px-4 rounded-full mx-auto w-fit mt-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <IndianRupee className="h-3.5 w-3.5 stroke-[2.5]" />
                                        <span className="text-sm font-bold tracking-tight">
                                            {donor.amount.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Footer ── */}
                <div className="mt-16 text-center">
                    <p className="text-muted-foreground font-medium text-sm">
                        Total funds raised contribute directly to education and healthcare initiatives.
                    </p>
                </div>
            </div>
        </section>
    );
}
