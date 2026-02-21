import { getAllTeam } from "@/actions/team";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, User } from "lucide-react";

export async function TeamSection() {
    const { team } = await getAllTeam({ limit: 5 });

    if (!team || team.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                            <User className="h-3 w-3 text-secondary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Our People</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
                            The Team Behind <span className="text-primary italic">the Mission.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl font-medium">
                            Driven by compassion, guided by purpose — meet the dedicated individuals working every day for Jharkhand's communities.
                        </p>
                    </div>

                    <Link
                        href="/team/management-team"
                        className="group whitespace-nowrap inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all pb-1 border-b-2 border-primary/20 hover:border-primary"
                    >
                        SEE ALL MEMBERS
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {team.map((member) => {
                        const imageData = member.image as any;
                        return (
                            <div key={member.id} className="group flex flex-col items-center text-center space-y-4">
                                {/* Avatar */}
                                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-background shadow-xl shadow-black/10 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 group-hover:-translate-y-2">
                                    {imageData?.url ? (
                                        <Image
                                            src={imageData.url}
                                            alt={member.name}
                                            fill
                                            className="object-contain object-top transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                            <User className="h-12 w-12 text-primary/30" />
                                        </div>
                                    )}
                                    {/* Type Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-white/90 dark:bg-black/80 backdrop-blur-sm text-foreground rounded-full">
                                            {member.type?.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-foreground text-base leading-tight tracking-tight group-hover:text-primary transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                                        {member.position}
                                    </p>
                                    {member.location && (
                                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="text-[10px] font-medium">{member.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile CTA */}
                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/team"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                    >
                        See All Members
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
