"use client";

import React, { useState } from "react";
import {
    Search,
    RefreshCw,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Calendar,
    User,
    CreditCard,
    Upload,
    Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getMembershipByNumber } from "@/actions/membership";
import { submitRenewalRequest } from "@/actions/membership-renewal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const lookupSchema = z.object({
    membershipNumber: z.string().min(5, "Invalid Membership Number"),
});

const renewalSchema = z.object({
    planId: z.number().min(1, "Please select a plan"),
    paymentMode: z.string().min(1, "Please select payment mode"),
    paymentProof: z.string().min(1, "Payment proof is required"),
});

type LookupInput = z.infer<typeof lookupSchema>;
type RenewalInput = z.infer<typeof renewalSchema>;

interface MembershipPlan {
    id: number;
    name: string;
    amount: number;
    duration: number;
    durationType: string;
}

interface RenewalRequestFormProps {
    plans: MembershipPlan[];
    paymentDetails: any;
}

export function RenewalRequestForm({ plans, paymentDetails }: RenewalRequestFormProps) {
    const [membership, setMembership] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Lookup, 2: Form, 3: Success
    const [preview, setPreview] = useState<string>("");

    const lookupForm = useForm<LookupInput>({
        resolver: zodResolver(lookupSchema),
        defaultValues: { membershipNumber: "" }
    });

    const renewalForm = useForm<RenewalInput>({
        resolver: zodResolver(renewalSchema),
        defaultValues: {
            planId: 0,
            paymentMode: "BANK_TRANSFER",
            paymentProof: ""
        }
    });

    const onSearch = async (data: LookupInput) => {
        try {
            setIsSearching(true);
            setError(null);
            const res = await getMembershipByNumber(data.membershipNumber);
            if (!res) {
                setError("No membership found with this number.");
                return;
            }
            setMembership(res);
            setStep(2);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                renewalForm.setValue("paymentProof", base64);
                setPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onRenew = async (data: RenewalInput) => {
        try {
            setIsSearching(true);
            const res = await submitRenewalRequest({
                membershipId: membership.id,
                planId: data.planId,
                paymentMode: data.paymentMode as any,
                paymentProof: data.paymentProof
            });

            if (res.success) {
                setStep(3);
            } else {
                setError(res.error || "Failed to submit renewal request.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsSearching(false);
        }
    };

    if (step === 3) {
        return (
            <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-500">
                <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-black mb-4">Request Submitted!</CardTitle>
                    <CardDescription className="text-lg max-w-md mx-auto mb-8">
                        Your renewal request has been received. Our team will verify the payment and update your status within 24-48 hours.
                    </CardDescription>
                    <Button onClick={() => window.location.href = "/"} className="rounded-full px-8 py-6 h-auto text-lg font-bold">
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {step === 1 && (
                <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="p-8 pb-4 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <RefreshCw className="w-8 h-8 text-primary shadow-sm" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Renew Membership</CardTitle>
                        <CardDescription className="text-base font-medium">
                            Enter your membership number to start the renewal process.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <form onSubmit={lookupForm.handleSubmit(onSearch)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Membership ID</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <Input
                                        {...lookupForm.register("membershipNumber")}
                                        placeholder="JK-YYYYMMDD-XXXX"
                                        className="pl-12 h-14 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 rounded-2xl text-lg font-bold placeholder:text-muted-foreground/50 focus:ring-4 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                {lookupForm.formState.errors.membershipNumber && (
                                    <p className="text-sm font-bold text-destructive mt-2 pl-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {lookupForm.formState.errors.membershipNumber.message}
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex gap-3 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-bold italic">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSearching}
                                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/25 transition-all active:scale-95 group"
                            >
                                {isSearching ? (
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Find Membership <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {step === 2 && membership && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Membership Info Card */}
                    <Card className="border-none shadow-xl bg-primary/5 dark:bg-primary/10 backdrop-blur-md overflow-hidden ring-1 ring-primary/20">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="relative w-24 h-24 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-lg shadow-primary/10">
                                    <Image
                                        src={membership.profilePicture?.url || "/placeholder-avatar.png"}
                                        alt={membership.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center md:text-left space-y-1">
                                    <h3 className="text-2xl font-black">{membership.name}</h3>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-sm">
                                            <Badge variant="outline" className="bg-white/50 dark:bg-slate-900/50 border-primary/20 font-black tracking-wider text-[10px] uppercase">
                                                ID: {membership.memberShipNumber}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-sm">
                                            <Timer className="w-4 h-4 text-primary" />
                                            <span>Current: {membership.plan?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-sm">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>Expiry: {membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            className={cn(
                                                "rounded-full px-4 py-1 font-black",
                                                membership.status === "ACTIVE" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                    membership.status === "EXPIRED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                        "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                            )}
                                            variant="outline"
                                        >
                                            {membership.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Renewal Form Card */}
                    <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-black">Renewal Details</CardTitle>
                            <CardDescription className="text-base font-medium">Select a new plan and provide payment proof.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={renewalForm.handleSubmit(onRenew)} className="space-y-8">
                                {/* Plan Selection */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <RefreshingCw className="w-4 h-4 text-primary" /> Choose New Plan
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {plans.map((plan) => (
                                            <div
                                                key={plan.id}
                                                onClick={() => renewalForm.setValue("planId", plan.id)}
                                                className={cn(
                                                    "relative p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:shadow-lg",
                                                    renewalForm.watch("planId") === plan.id
                                                        ? "border-primary bg-primary/5 shadow-primary/10"
                                                        : "border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-black text-lg">{plan.name}</h4>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                                        renewalForm.watch("planId") === plan.id ? "border-primary bg-primary text-white" : "border-slate-300"
                                                    )}>
                                                        {renewalForm.watch("planId") === plan.id && <CheckCircle2 className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-black text-primary">₹{plan.amount}</div>
                                                <p className="text-xs font-bold text-muted-foreground mt-1">Duration: {plan.duration} {plan.durationType}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {renewalForm.formState.errors.planId && (
                                        <p className="text-sm font-bold text-destructive pl-1 animate-pulse flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {renewalForm.formState.errors.planId.message}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Info */}
                                {paymentDetails && (
                                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-6">
                                        <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary">
                                            <div className="p-2 rounded-xl bg-primary/10">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            Bank Transfer Details
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8 items-center lg:items-start">
                                            {/* QR Code Section */}
                                            {paymentDetails.image?.url && (
                                                <div className="shrink-0 space-y-3 flex flex-col items-center">
                                                    <div className="relative w-44 h-44 p-2 bg-white rounded-2xl shadow-xl shadow-black/5 ring-1 ring-slate-100 dark:ring-slate-800 translate-y-0 hover:-translate-y-1 transition-transform">
                                                        <Image
                                                            src={paymentDetails.image.url}
                                                            alt="Payment QR Code"
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">Scan to pay</p>
                                                </div>
                                            )}

                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 w-full">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Bank Name</p>
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-base">{paymentDetails.bankName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Account Number</p>
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-base">{paymentDetails.accountNumber}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">IFSC Code</p>
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-base">{paymentDetails.ifscCode}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Account Holder</p>
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-base">{paymentDetails.accountHolderName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Mode */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Payment Mode</label>
                                    <select
                                        {...renewalForm.register("paymentMode")}
                                        className="w-full h-14 bg-white/50 dark:bg-slate-900/50 border-white/20 dark:border-slate-800/50 rounded-2xl px-4 font-black focus:ring-4 focus:ring-primary/20 appearance-none outline-none"
                                    >
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="PAYTM">Paytm</option>
                                        <option value="GOOGLE_PAY">Google Pay</option>
                                        <option value="PHONE_PE">PhonePe</option>
                                        <option value="CASH">Cash</option>
                                        <option value="CHEQUE">Cheque</option>
                                    </select>
                                </div>

                                {/* Payment Proof Upload */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Upload Payment Receipt</label>
                                    <div className={cn(
                                        "relative group flex flex-col items-center justify-center border-4 border-dashed rounded-[2rem] p-8 transition-all min-h-[240px] overflow-hidden",
                                        preview ? "border-primary/40" : "border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-primary/5"
                                    )}>
                                        {preview ? (
                                            <div className="relative w-full h-full flex flex-col items-center gap-4">
                                                <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-2">
                                                    <Image src={preview} alt="Receipt preview" fill className="object-cover" />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="rounded-full font-bold shadow-lg"
                                                    onClick={() => { setPreview(""); renewalForm.setValue("paymentProof", ""); }}
                                                >
                                                    Change Image
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex flex-col items-center justify-center w-full gap-4">
                                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="w-10 h-10 text-primary" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-black">Drop receipt here</p>
                                                    <p className="text-sm font-medium text-muted-foreground">or click to browse files</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {renewalForm.formState.errors.paymentProof && (
                                        <p className="text-sm font-bold text-destructive pl-1 animate-pulse flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> {renewalForm.formState.errors.paymentProof.message}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-bold text-sm italic">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded-2xl h-16 text-lg font-bold hover:bg-slate-100 flex-1"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSearching}
                                        className="h-16 rounded-2xl bg-primary hover:bg-primary/90 text-xl font-black shadow-xl shadow-primary/25 flex-2 transition-all active:scale-95 group"
                                    >
                                        {isSearching ? (
                                            <RefreshCw className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Confirm Renewal <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform text-white/90" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function RefreshingCw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    )
}
