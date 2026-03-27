"use client";

import { getSchoolEnquiryByRegistrationNumber } from "@/actions/schoolEnquiry";
import { getWebSettings } from "@/actions/webSetting";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Search, GraduationCap, ShieldCheck, User, School, Calendar, CheckCircle2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { ResultCard } from "@/components/school-enquiry/ResultCard";

export function ResultsPortal() {
    const [regNumber, setRegNumber] = useState("");
    const [participant, setParticipant] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [webSettings, setWebSettings] = useState<Record<string, string>>({});
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const settings = await getWebSettings();
                setWebSettings(settings);
            } catch (error) {
                console.error("Failed to fetch web settings:", error);
            }
        }
        fetchSettings();
    }, []);

    const maxMarks = parseInt(webSettings.max_marks || "100");

    const handleSearch = async () => {
        if (!regNumber.trim()) {
            toast.error("Please enter your registration number.");
            return;
        }

        setLoading(true);
        setParticipant(null);

        try {
            const res = await getSchoolEnquiryByRegistrationNumber(regNumber.trim());
            if (res) {
                setParticipant(res);
                toast.success("Result retrieved successfully!");
            } else {
                toast.error("Registration not found. Please check and try again.");
                setParticipant(null);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!cardRef.current || !participant) return;

        setDownloading(true);
        const loadingToast = toast.loading("Generating your PDF result card...");
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                quality: 1
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [210, 280],
            });

            pdf.addImage(dataUrl, "PNG", 0, 0, 210, 280);
            pdf.save(`GK-Competition-Result-${participant.registrationNumber}.pdf`);

            toast.success("Result card PDF downloaded!");
        } catch (err) {
            toast.error("Download failed. Please try again.");
            console.error("Download error:", err);
        } finally {
            toast.dismiss(loadingToast);
            setDownloading(false);
        }
    };

    return (
        <div className="relative z-10">
            {/* ── Hero ── */}
            <section className="relative pt-28 pb-8 lg:pt-40 lg:pb-12 px-6">
                <div className="container mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 mb-6">
                        <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">GK Competition Results</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
                        Check Your{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-500">
                            Exam Performance
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Enter your registration number to view your official GK Competition marks and performance summary.
                    </p>
                </div>
            </section>

            {/* ── Search Section ── */}
            <section className="relative px-6 pb-6">
                <div className="container mx-auto max-w-xl">
                    <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 bg-white dark:bg-white/5 border border-border rounded-2xl shadow-lg">
                        <Input
                            placeholder="e.g. REG-2024-001"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-12 text-sm tracking-wider border-none focus-visible:ring-0 bg-transparent px-5 font-semibold placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground/60"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={loading}
                            className="h-12 px-6 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-all shrink-0"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Check Result
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Results Section ── */}
            <section className="relative px-6 pb-20 min-h-[400px]">
                <div className="container mx-auto max-w-4xl">
                    {participant ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Status Badge */}
                            <div className="flex justify-center mb-10">
                                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-base font-semibold text-emerald-700 dark:text-emerald-400">
                                        Result Successfully Retrieved
                                    </span>
                                </div>
                            </div>

                            {/* Result Dashboard */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Student Profile Card */}
                                <div className="lg:col-span-1">
                                    <div className="rounded-3xl border border-border bg-white dark:bg-white/5 p-8 shadow-sm h-full flex flex-col items-center text-center">
                                        {participant.photo ? (
                                            <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-6">
                                                <Image src={participant.photo.url} alt={participant.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="h-32 w-32 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 border border-border">
                                                <User className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                                            </div>
                                        )}
                                        
                                        <h3 className="text-2xl font-bold text-foreground mb-1 leading-tight">{participant.name}</h3>
                                        <Badge variant="outline" className="font-mono px-3 py-1 bg-slate-50 dark:bg-slate-900 border-border text-xs">
                                            {participant.registrationNumber}
                                        </Badge>

                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-6" />

                                        <div className="w-full space-y-4 text-left">
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                                                    <School className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Institution</p>
                                                    <p className="text-sm font-semibold text-foreground leading-tight">{participant.school}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-100/20">
                                                    <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Class & Board</p>
                                                    <p className="text-sm font-semibold text-foreground leading-tight">Class {participant.class} ({participant.board})</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score & Announcement Card */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="rounded-3xl border border-border bg-white dark:bg-white/5 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 h-full bg-linear-to-br from-white to-slate-50 dark:from-white/5 dark:to-transparent">
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Scorecard active</span>
                                            </div>
                                            <h2 className="text-3xl font-bold text-foreground">Examination Summary</h2>
                                            <p className="text-muted-foreground leading-relaxed">
                                                This scorecard represents your achievement in the GK Competition organized by Jharkhand Jan Kalyan Trust. We appreciate your dedication and hard work.
                                            </p>
                                        </div>

                                        <div className="w-full md:w-auto p-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-w-[200px]">
                                            <div className="p-6 flex flex-col items-center justify-center border-2 border-dashed border-emerald-100 dark:border-emerald-900/40 rounded-[1.5rem] bg-emerald-50/20 dark:bg-emerald-500/5">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Final Score</p>
                                                {participant.examResult ? (
                                                    <div className="text-center">
                                                        <div className="text-7xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                            {participant.examResult.marks}
                                                        </div>
                                                        <p className="text-xs font-bold text-emerald-600/60 dark:text-emerald-400/60 mt-2">Maximum Marks: {maxMarks}</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4">
                                                        <div className="text-2xl font-bold text-slate-300 dark:text-slate-700 italic">
                                                            Awaiting
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground max-w-[120px] mt-2 leading-tight">
                                                            Marking process in progress.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Preview & Download */}
                            <div className="mt-8 rounded-2xl border border-border bg-white dark:bg-white/5 p-4 md:p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Offline Scorecard Preview
                                    </span>
                                    <Button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="h-9 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all text-sm gap-2"
                                    >
                                        {downloading ? (
                                            <Loader2 className="animate-spin h-4 w-4" />
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                Download Scorecard
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="overflow-x-auto overflow-y-hidden flex justify-center py-6 px-4">
                                        <div className="bg-white rounded-lg shadow-md transform scale-[0.28] sm:scale-[0.38] md:scale-[0.48] lg:scale-[0.58] xl:scale-[0.7] origin-top shrink-0 transition-transform duration-300">
                                            <ResultCard 
                                                participant={participant} 
                                                cardRef={cardRef}
                                                maxMarks={maxMarks}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Download Button */}
                            <div className="mt-4 sm:hidden">
                                <Button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all gap-2"
                                >
                                    {downloading ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Download Result Card
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Footer Info */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <ShieldCheck className="h-3 w-3" />
                                    This is a system-generated result portal • Symbosys Jan Kalyan Trust • Verified on {format(new Date(), "PP")}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={`py-16 text-center transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
                            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center mb-6">
                                <GraduationCap className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Result Selected</h3>
                            <p className="text-muted-foreground text-base max-w-[300px] mx-auto leading-relaxed">
                                {loading ? "Securely retrieving your examination data..." : "Enter your registration number above to access your official examination scorecard."}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
