"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { RegistrationCard } from "@/components/school-enquiry/RegistrationCard";
import { getSchoolEnquiryByRegistrationNumber } from "@/actions/schoolEnquiry";
import { getWebSettings } from "@/actions/webSetting";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download, Search, ShieldCheck, GraduationCap } from "lucide-react";

interface SchoolEnquiry {
    id: number;
    name: string;
    mobile: string;
    email: string;
    school: string;
    class: string;
    board: string;
    aadhaar: string;
    registrationNumber: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    photo: { url: string; public_id: string } | null;
    payment: { url: string; public_id: string } | null;
    examCenter?: {
        id: number;
        name: string;
        address: string;
        city: string;
        state: string;
        pinCode?: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
}

export function RegistrationCardPortal() {
    const [regNumber, setRegNumber] = useState("");
    const [participant, setParticipant] = useState<SchoolEnquiry | null>(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [webSettings, setWebSettings] = useState<Record<string, string>>({});
    const cardRef = useRef<HTMLDivElement>(null);

    // Fetch web settings on mount
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

    // Get competition details from web settings or use defaults
    const competitionDate = webSettings.gk_competion_date || "15/04/2026";
    const competitionLocation = webSettings.gk_competion_location || "Ranchi, Jharkhand";
    const competitionTime = webSettings.gk_competion_time || "10:00 AM - 12:00 PM";

    const handleSearch = async () => {
        if (!regNumber.trim()) {
            toast.error("Please enter your registration number.");
            return;
        }

        setLoading(true);
        setParticipant(null);

        try {
            const res = await getSchoolEnquiryByRegistrationNumber(regNumber.trim());
            if (res && res.status === "APPROVED") {
                if (webSettings.allow_download_admit_card !== "true") {
                    toast.error("Admit card downloading is currently disabled by the administrator.");
                    setLoading(false);
                    return;
                }
                
                setParticipant(res as SchoolEnquiry);
                toast.success("Registration verified successfully!");
            } else if (res) {
                toast.error("Your registration is pending approval or has been rejected.");
                setParticipant(null);
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
        const loadingToast = toast.loading("Generating your PDF registration card...");
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
            pdf.save(`GK-Competition-Card-${participant.registrationNumber}.pdf`);

            toast.success("Registration card PDF downloaded!");
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
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">GK Competition Portal</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
                        Download Your{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-500">
                            Registration Card
                        </span>
                    </h1>

                    <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        Enter your registration number to verify your status and download your official GK Competition registration card.
                    </p>
                </div>
            </section>

            {/* ── Search Section ── */}
            <section className="relative px-6 pb-6">
                <div className="container mx-auto max-w-xl">
                    <div className="relative flex flex-col sm:flex-row gap-2 p-1.5 bg-white dark:bg-white/5 border border-border rounded-2xl shadow-lg">
                        <Input
                            placeholder="e.g. 526141"
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
                                    Verify
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Results Section ── */}
            <section className="relative px-6 pb-20 min-h-[400px]">
                <div className="container mx-auto max-w-5xl">
                    {participant ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Status Badge */}
                            <div className="flex justify-center mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                        Registration Approved
                                    </span>
                                </div>
                            </div>

                            {/* Card Preview */}
                            <div className="rounded-2xl border border-border bg-white dark:bg-white/5 p-4 md:p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Card Preview
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
                                                Download Card
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 overflow-hidden">
                                    <div className="overflow-x-auto overflow-y-hidden flex justify-center py-6 px-4">
                                        <div className="bg-white rounded-lg shadow-md transform scale-[0.28] sm:scale-[0.38] md:scale-[0.48] lg:scale-[0.58] xl:scale-[0.7] origin-top shrink-0 transition-transform duration-300">
                                            <RegistrationCard 
                                                participant={participant} 
                                                cardRef={cardRef}
                                                competitionDate={competitionDate}
                                                competitionTime={competitionTime}
                                                competitionVenue={competitionLocation}
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
                                            Download Registration Card
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={`py-16 text-center transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center mb-4">
                                <GraduationCap className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">
                                {loading ? "Verifying registration data..." : "Enter your registration number above to preview and download your card."}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}