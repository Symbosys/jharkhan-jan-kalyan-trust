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
                borderRadius: 0, // Using 0 for square print bounds, matching the exact edge-to-edge layout
                fontFamily: "Arial, Helvetica, sans-serif",
                userSelect: "none",
                backgroundColor: "#2B2889", // Base blue background (Layer 0)
            }}
        >
            {/* ── Layer 1: Top Blue Background (formerly Green) ── */}
            <div
                style={{
                    position: "absolute",
                    top: 52,
                    left: 0,
                    width: "100%",
                    height: 350,
                    backgroundColor: "#2B2889", // Changed to match base blue
                    zIndex: 1,
                }}
            />

            {/* ── Layer 2: Gold Ellipse Sliver ── */}
            <div
                style={{
                    position: "absolute",
                    top: 135,
                    left: -110,
                    width: 600,
                    height: 280,
                    borderRadius: "50%",
                    backgroundColor: "#CBA735",
                    zIndex: 2,
                }}
            />

            {/* ── Layer 3: Dark Blue Ellipse Sliver (formerly dark green) ── */}
            <div
                style={{
                    position: "absolute",
                    top: 120,
                    left: -90,
                    width: 600,
                    height: 280,
                    borderRadius: "50%",
                    backgroundColor: "#2B2889", // Changed to match the base blue background
                    zIndex: 3,
                }}
            />

            {/* ── Layer 4: Main White Ellipse ── */}
            <div
                style={{
                    position: "absolute",
                    top: 100,
                    left: -75,
                    width: 600,
                    height: 280,
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    zIndex: 4,
                }}
            />

            {/* ── 1. "IDENTITY CARD" Top Blue Banner ── */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 52,
                    backgroundColor: "#272379",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
            >
                <span
                    style={{
                        fontSize: 30,
                        fontWeight: 900,
                        color: "#F4D33C", // Official yellow text
                        letterSpacing: "1.5px",
                        fontFamily: "'Arial Narrow', Arial, sans-serif",
                    }}
                >
                    IDENTITY CARD
                </span>
            </div>

            {/* ── 2. Logo inside White Ellipse ── */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
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
                        width: 120, // Increased from 95
                        height: 120, // Increased from 95
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: "3px solid #D6B75B", // Thin gold border
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 3,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo/logo.jpeg"
                        alt="JJKT Logo"
                        style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }}
                    />
                </div>
            </div>

            {/* ── 3. Trust Name & Location (Inside White Shape) ── */}
            <div
                style={{
                    position: "absolute",
                    top: 220, // Pushed down slightly to account for bigger logo
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        fontSize: 24, // Increased from 22
                        fontWeight: 900,
                        color: "#BA9B38", // Gold text
                        letterSpacing: "-0.2px",
                        transform: "scaleY(1.3)", // Stretch vertically slightly
                        marginBottom: 10,
                        marginTop: 10,
                    }}
                >
                    JHARKHAND JAN KALYAN TRUST
                </div>
                <div
                    style={{
                        fontSize: 19, // Increased from 18
                        fontWeight: 900,
                        color: "#0A5F2C", // Green location text
                        letterSpacing: "0.2px",
                    }}
                >
                    Ranchi-Jharkhand
                </div>
            </div>

            {/* ── 4. Member Photo ── */}
            <div
                style={{
                    position: "absolute",
                    top: 310,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 15,
                }}
            >
                <div
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "4px solid #ffffff",
                        backgroundColor: "#e0e0e0",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photoUrl}
                        alt="Member Photo"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* ── 5. Member Details Rows ── */}
            <div
                style={{
                    position: "absolute",
                    top: 480,
                    left: 25,
                    right: 15,
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12, // Reduced slightly to fit bigger fonts
                }}
            >
                {/* Fixed Labels perfectly aligned */}
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 145, flexShrink: 0 }}>Name</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 15 }}>:</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 145, flexShrink: 0 }}>DOB</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 15 }}>:</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dob}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 145, flexShrink: 0 }}>Contact No.</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 15 }}>:</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contactNo}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 145, flexShrink: 0 }}>Designation</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", width: 15 }}>:</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#fff", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{designation}</span>
                </div>
            </div>

            {/* ── 6. Authorized Signatory Section ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 45,
                    right: 25,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 140,
                        height: 40,
                        backgroundColor: "#fff",
                        borderRadius: 20, // Pill shape
                        border: "2px solid #CD2C29", // Red border
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/signature/president.jpeg"
                        alt="Authorized Signatory"
                        style={{ width: "95%", height: "95%", objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                </div>
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "0.5px",
                        marginTop: 4,
                    }}
                >
                    AUTHORIZED SIGNATORY
                </span>
            </div>

            {/* ── 7. Bottom Address Bar ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: 35,
                    backgroundColor: "#16A54B", // Added green background
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        fontSize: 14, // Increased from 13
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.2px",
                    }}
                >
                    Opp. Bank of India Street, Kokar, Ranchi-834001
                </span>
            </div>
        </div>
    );
}
