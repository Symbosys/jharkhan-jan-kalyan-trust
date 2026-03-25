"use client";

import { useState, useEffect } from "react";
import { getAllAffiliations } from "@/actions/affiliation";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Building2, MapPin, Calendar, Globe, User, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AffiliationPortal({ initialAffiliations, initialTotal }: { initialAffiliations: any[], initialTotal: number }) {
    const [search, setSearch] = useState("");
    const [affiliations, setAffiliations] = useState(initialAffiliations);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (search.length > 0 || search === "") {
                setLoading(true);
                try {
                    const res = await getAllAffiliations({ 
                        search: search, 
                        status: 'APPROVED',
                        limit: 50 
                    });
                    if (res.success && res.data) {
                        setAffiliations(res.data.affiliations);
                    }
                } catch (error) {
                    console.error("Failed to fetch affiliations:", error);
                } finally {
                    setLoading(false);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div className="relative z-10">
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-24 px-6 overflow-hidden">
                <div className="container mx-auto max-w-4xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 backdrop-blur-sm shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Verified Partners</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Our{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-emerald-500 to-blue-500">
                            Affiliations.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700">
                        We take pride in our network of registered and verified educational institutions and organizations committed to community excellence.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all group-hover:bg-primary/30 opacity-0 group-hover:opacity-100" />
                            <div className="relative flex items-center p-2 bg-white dark:bg-white/5 border border-border rounded-2xl shadow-2xl backdrop-blur-xl">
                                <div className="pl-4 pr-2 text-muted-foreground">
                                    <Search className="h-5 w-5" />
                                </div>
                                <Input
                                    placeholder="Search by center name, city or director..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-12 border-none focus-visible:ring-0 bg-transparent text-lg font-medium placeholder:font-normal placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Affiliations Grid ── */}
            <section className="container mx-auto px-6 lg:px-8 pb-32">
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Fetching Centers...</p>
                        </div>
                    </div>
                )}

                {!loading && affiliations.length === 0 && (
                    <div className="py-20 text-center animate-in fade-in transition-all">
                        <div className="h-20 w-20 bg-slate-100 dark:bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-6">
                            <Building2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No centers found</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Try adjusting your search or check back later as new affiliations are added.</p>
                    </div>
                )}

                {!loading && affiliations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        {affiliations.map((aff) => (
                            <Card key={aff.id} className="group overflow-hidden rounded-[2rem] border border-border bg-white dark:bg-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                                <CardContent className="p-0">
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 border border-border group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-500">
                                                <Building2 className="h-7 w-7 text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-bold tracking-tighter uppercase text-[10px] px-3 py-1 rounded-full">
                                                Verified
                                            </Badge>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-foreground leading-tight line-clamp-2 min-h-14 group-hover:text-primary transition-colors cursor-default">
                                                {aff.organizationName}
                                            </h3>
                                            <p className="text-xs font-black text-muted-foreground/60 tracking-[0.2em] uppercase">
                                                {aff.AffiliationNumber}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 pt-2">
                                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                                <MapPin className="h-4 w-4 shrink-0 text-primary/60" />
                                                <span className="text-sm font-semibold">{aff.city}, Jharkhand</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                                <User className="h-4 w-4 shrink-0 text-primary/60" />
                                                <span className="text-sm font-semibold">Dir: {aff.directorName}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                                <Calendar className="h-4 w-4 shrink-0 text-primary/60" />
                                                <span className="text-sm font-semibold italic">Est. {aff.establishedYear}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50/50 dark:bg-transparent border-t border-border flex items-center justify-between group-hover:bg-primary/5 transition-colors duration-500">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Center Type</span>
                                            <span className="text-sm font-bold text-foreground">{aff.organizationType}</span>
                                        </div>
                                        {aff.website ? (
                                            <Link 
                                                href={aff.website.startsWith('http') ? aff.website : `https://${aff.website}`} 
                                                target="_blank"
                                                className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                            >
                                                <Globe className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-border flex items-center justify-center text-slate-300 dark:text-slate-700">
                                                <Globe className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
