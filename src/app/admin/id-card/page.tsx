"use client";

import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Loader2,
    Download,
    CreditCard,
    User,
    Calendar,
    Phone,
    Briefcase,
    ImageIcon,
    Eye,
} from "lucide-react";

export default function IdCardPage() {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [designation, setDesignation] = useState("");
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = () => {
        if (!name.trim()) {
            toast.error("Please enter the name.");
            return;
        }
        if (!dob.trim()) {
            toast.error("Please enter the date of birth.");
            return;
        }
        if (!contactNo.trim()) {
            toast.error("Please enter the contact number.");
            return;
        }
        if (!designation.trim()) {
            toast.error("Please enter the designation.");
            return;
        }
        if (!photoPreview) {
            toast.error("Please upload a photo.");
            return;
        }
        setShowPreview(true);
        toast.success("ID Card generated! You can now download it.");
    };

    const handleDownloadPdf = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        const loadingToast = toast.loading("Generating PDF...");
        try {
            await new Promise((r) => setTimeout(r, 300));
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                quality: 1,
            });

            // ID card is portrait: 450x750 in the component
            // PDF page in mm: roughly 90mm x 150mm
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [90, 150],
            });

            pdf.addImage(dataUrl, "PNG", 0, 0, 90, 150);
            pdf.save(`JJKT-ID-Card-${name.replace(/\s+/g, "-")}.pdf`);
            toast.success("ID Card PDF downloaded!");
        } catch (err) {
            console.error("PDF generation error:", err);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            toast.dismiss(loadingToast);
            setDownloading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    ID Card Generator
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details below and generate an official JJKT identity card.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-border p-6 shadow-sm space-y-5">
                    <h2 className="text-lg font-semibold text-foreground mb-2">Member Details</h2>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                            <User className="w-4 h-4 text-muted-foreground" />
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g. Sunil Kr. Yadav"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* DOB */}
                    <div className="space-y-2">
                        <Label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            Date of Birth
                        </Label>
                        <Input
                            id="dob"
                            placeholder="e.g. 15th March 1998"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Contact No */}
                    <div className="space-y-2">
                        <Label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            Contact No.
                        </Label>
                        <Input
                            id="contact"
                            placeholder="e.g. +91 8919114957"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                        <Label htmlFor="designation" className="flex items-center gap-2 text-sm font-medium">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            Designation
                        </Label>
                        <Input
                            id="designation"
                            placeholder="e.g. President"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="photo" className="flex items-center gap-2 text-sm font-medium">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            Photo
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            {photoPreview && (
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                        <Button
                            onClick={handleGenerate}
                            className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Generate ID Card
                        </Button>
                        {showPreview && (
                            <Button
                                onClick={handleDownloadPdf}
                                disabled={downloading}
                                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
                            >
                                {downloading ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Card Preview</h2>
                    {showPreview ? (
                        <div className="flex justify-center">
                            <div className="transform scale-[0.6] origin-top">
                                <IdCardDesign
                                    cardRef={cardRef}
                                    name={name}
                                    dob={dob}
                                    contactNo={contactNo}
                                    designation={designation}
                                    photoUrl={photoPreview!}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                <CreditCard className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Fill in the form and click &quot;Generate&quot; to preview the ID card.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   ID CARD DESIGN COMPONENT — pixel-perfect match to reference image
   ================================================================ */

interface IdCardDesignProps {
    cardRef: React.RefObject<HTMLDivElement | null>;
    name: string;
    dob: string;
    contactNo: string;
    designation: string;
    photoUrl: string;
}

function IdCardDesign({ cardRef, name, dob, contactNo, designation, photoUrl }: IdCardDesignProps) {
    return (
        <div
            ref={cardRef}
            style={{
                width: 450,
                height: 750,
                position: "relative",
                overflow: "hidden",
                borderRadius: 18,
                fontFamily: "Arial, Helvetica, sans-serif",
                userSelect: "none",
            }}
        >
            {/* ── Background: Blue-Green Gradient ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, #1a3a8a 0%, #1565a0 25%, #0d8a5f 55%, #0a6e3f 100%)",
                    zIndex: 0,
                }}
            />

            {/* ── Left Green Curved Accent ── */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: -80,
                    width: 300,
                    height: "100%",
                    backgroundColor: "#0b6e2f",
                    borderRadius: "0 60% 60% 0",
                    zIndex: 1,
                    opacity: 0.4,
                }}
            />

            {/* ── Right Golden Curved Accent ── */}
            <div
                style={{
                    position: "absolute",
                    top: 180,
                    right: -60,
                    width: 200,
                    height: 400,
                    backgroundColor: "#c8a832",
                    borderRadius: "50% 0 0 50%",
                    zIndex: 1,
                    opacity: 0.25,
                }}
            />

            {/* ── 1. "IDENTITY CARD" Green Top Banner ── */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 52,
                    backgroundColor: "#1a7a3a",
                    borderRadius: "18px 18px 0 0",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: "#ffd700",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                >
                    IDENTITY CARD
                </span>
            </div>

            {/* ── 2. Logo Circle ── */}
            <div
                style={{
                    position: "absolute",
                    top: 65,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 130,
                        height: 130,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: "4px solid #c8a832",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo/logo.jpeg"
                        alt="JJKT Logo"
                        style={{
                            width: 110,
                            height: 110,
                            objectFit: "contain",
                            borderRadius: "50%",
                        }}
                    />
                </div>
            </div>

            {/* ── 3. Trust Name & Location ── */}
            <div
                style={{
                    position: "absolute",
                    top: 205,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    zIndex: 5,
                }}
            >
                <p
                    style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#ffffff",
                        letterSpacing: "1px",
                        margin: 0,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
                    }}
                >
                    JHARKHAND JAN KALYAN TRUST
                </p>
                <p
                    style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#ffd700",
                        margin: "4px 0 0 0",
                        letterSpacing: "0.5px",
                    }}
                >
                    Ranchi-Jharkhand
                </p>
            </div>

            {/* ── 4. Decorative Curves Around Photo ── */}
            {/* Left green curve */}
            <div
                style={{
                    position: "absolute",
                    top: 275,
                    left: 20,
                    width: 120,
                    height: 200,
                    borderRadius: "50%",
                    border: "4px solid #1a7a3a",
                    borderRight: "none",
                    zIndex: 2,
                }}
            />
            {/* Right golden curve */}
            <div
                style={{
                    position: "absolute",
                    top: 275,
                    right: 20,
                    width: 120,
                    height: 200,
                    borderRadius: "50%",
                    border: "4px solid #c8a832",
                    borderLeft: "none",
                    zIndex: 2,
                }}
            />

            {/* ── 5. Member Photo ── */}
            <div
                style={{
                    position: "absolute",
                    top: 280,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 5,
                }}
            >
                <div
                    style={{
                        width: 170,
                        height: 200,
                        borderRadius: "50% 50% 50% 50%",
                        overflow: "hidden",
                        border: "5px solid #b0e0f0",
                        backgroundColor: "#d4eef8",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photoUrl}
                        alt="Member Photo"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>

            {/* ── 6. Member Details Section ── */}
            <div
                style={{
                    position: "absolute",
                    top: 500,
                    left: 30,
                    right: 30,
                    zIndex: 5,
                }}
            >
                {/* Name Row */}
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: "#ffd700",
                            width: 155,
                            flexShrink: 0,
                        }}
                    >
                        Name
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffd700",
                            marginRight: 8,
                        }}
                    >
                        :
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffffff",
                        }}
                    >
                        {name}
                    </span>
                </div>

                {/* DOB Row */}
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: "#ffd700",
                            width: 155,
                            flexShrink: 0,
                        }}
                    >
                        DOB
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffd700",
                            marginRight: 8,
                        }}
                    >
                        :
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffffff",
                        }}
                    >
                        {dob}
                    </span>
                </div>

                {/* Contact No Row */}
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: "#ffd700",
                            width: 155,
                            flexShrink: 0,
                        }}
                    >
                        Contact No.
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffd700",
                            marginRight: 8,
                        }}
                    >
                        :
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffffff",
                        }}
                    >
                        {contactNo}
                    </span>
                </div>

                {/* Designation Row */}
                <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10 }}>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 900,
                            color: "#ffd700",
                            width: 155,
                            flexShrink: 0,
                        }}
                    >
                        Designation
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffd700",
                            marginRight: 8,
                        }}
                    >
                        :
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#ffffff",
                        }}
                    >
                        {designation}
                    </span>
                </div>
            </div>

            {/* ── 7. Authorized Signatory Section ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 52,
                    right: 25,
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 180,
                        height: 80,
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/signature/president.jpeg"
                        alt="Authorized Signatory"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            mixBlendMode: "multiply",
                            filter: "brightness(1.1) contrast(1.1)"
                        }}
                    />
                </div>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#ffd700",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                    }}
                >
                    AUTHORIZED SIGNATORY
                </span>
            </div>

            {/* ── 8. Bottom Address Bar ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 42,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    borderRadius: "0 0 18px 18px",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 15px",
                }}
            >
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#ffffff",
                        textAlign: "center",
                        letterSpacing: "0.3px",
                    }}
                >
                    Opp. Bank of India Street, Kokar, Ranchi-834001
                </span>
            </div>
        </div>
    );
}
