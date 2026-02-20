"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Heart,
    CheckCircle,
    Loader2,
    Upload,
    X,
    Landmark,
    QrCode,
    Copy,
    IndianRupee,
    Sparkles,
} from "lucide-react";
import { createDonar } from "@/actions/donar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";
import Image from "next/image";

// ── Constants ──
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const PAYMENT_MODES = [
    { value: "BANK_TRANSFER", label: "Bank Transfer / NEFT / RTGS" },
    { value: "GOOGLE_PAY", label: "Google Pay" },
    { value: "PHONE_PE", label: "PhonePe" },
    { value: "PAYTM", label: "Paytm" },
    { value: "AMAZON_PAY", label: "Amazon Pay" },
    { value: "CHEQUE", label: "Cheque" },
    { value: "CASH", label: "Cash" },
    { value: "OTHER", label: "Other" },
];

const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

// ── File validation helper ──
const fileSchema = z
    .string()
    .min(1, "Payment receipt is required")
    .refine(
        (val) => {
            if (!val || !val.startsWith("data:")) return true;
            const base64 = val.split(",")[1];
            if (!base64) return false;
            const sizeInBytes = (base64.length * 3) / 4;
            return sizeInBytes <= MAX_FILE_SIZE;
        },
        { message: "File must be less than 1 MB" }
    );

const optionalFileSchema = z
    .string()
    .optional()
    .refine(
        (val) => {
            if (!val || !val.startsWith("data:")) return true;
            const base64 = val.split(",")[1];
            if (!base64) return true;
            const sizeInBytes = (base64.length * 3) / 4;
            return sizeInBytes <= MAX_FILE_SIZE;
        },
        { message: "File must be less than 1 MB" }
    );

// ── Zod Schema ──
const donateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    panNumber: z.string().min(1, "PAN number is required").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN (e.g., ABCDE1234F)"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    amount: z.number().min(1, "Amount must be at least ₹1"),
    donorImage: optionalFileSchema,
    paymentMode: z.string().min(1, "Payment mode is required"),
    payment: fileSchema,
});

type DonateFormValues = z.infer<typeof donateSchema>;

interface PaymentDetails {
    id: number;
    image: any;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

interface DonateFormProps {
    paymentDetails: PaymentDetails | null;
}

export function DonateForm({ paymentDetails }: DonateFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<DonateFormValues>({
        resolver: zodResolver(donateSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            panNumber: "",
            address: "",
            amount: 0,
            donorImage: "",
            paymentMode: "",
            payment: "",
        },
    });

    const handleFileChange = useCallback(
        (fieldName: keyof DonateFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > MAX_FILE_SIZE) {
                toast.error("File too large", { description: "Maximum file size is 1 MB" });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                form.setValue(fieldName, reader.result as string, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        },
        [form]
    );

    const onSubmit = async (values: DonateFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await createDonar({
                ...values,
                paymentMode: values.paymentMode as any,
            });

            if (result.success) {
                setSubmitted(true);
                toast.success("Donation submitted successfully! Thank you for your generosity.");
            } else {
                toast.error(result.error || "Failed to submit donation");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success Screen ──
    if (submitted) {
        return (
            <div className="text-center py-20 space-y-8 animate-in fade-in duration-500">
                <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                    <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 shadow-2xl shadow-green-500/10">
                        <Heart className="h-14 w-14 text-green-500 fill-green-500" />
                    </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    Thank You! 🙏
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Your generous contribution has been received. Our team will verify the payment and add you to our honored donors list.
                </p>
                <div className="inline-block px-8 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                        Your Donation
                    </span>
                    <span className="text-3xl font-black text-primary">₹{form.getValues("amount").toLocaleString("en-IN")}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    A tax receipt (80G) will be sent to your email after verification.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* ── Left Column: Payment Details Card ── */}
            <div className="lg:col-span-2 space-y-8">
                {/* Payment Details Card */}
                {paymentDetails && (
                    <div className="rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 bg-linear-to-br from-primary/4 via-white/50 to-blue-50/50 dark:from-primary/8 dark:via-black/20 dark:to-blue-950/20 sticky top-32">
                        {/* Header */}
                        <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Landmark className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Payment Details</h4>
                                    <p className="text-[10px] text-white/70 font-medium">Transfer to the account below</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* QR Code */}
                            {paymentDetails.image && (paymentDetails.image as any).url && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-3xl bg-white shadow-xl border border-gray-200 ring-4 ring-primary/10">
                                        <Image
                                            src={(paymentDetails.image as any).url}
                                            alt="Scan to Pay — QR Code"
                                            width={240}
                                            height={240}
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                        <QrCode className="h-3.5 w-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Scan QR to Pay</span>
                                    </div>
                                </div>
                            )}

                            {/* Bank Details */}
                            <div className="space-y-3">
                                {[
                                    { label: "Bank Name", value: paymentDetails.bankName },
                                    { label: "Account Number", value: paymentDetails.accountNumber },
                                    { label: "IFSC Code", value: paymentDetails.ifscCode },
                                    { label: "Account Holder", value: paymentDetails.accountHolderName },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                            <span className="text-sm font-bold text-foreground tracking-wide">{item.value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.value);
                                                toast.success(`${item.label} copied!`);
                                            }}
                                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                                            title={`Copy ${item.label}`}
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tax Benefit Info */}
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="text-sm font-black text-green-700 dark:text-green-400">Tax Benefits under 80G</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        All donations to Jharkhand Jan Kalyan Trust are eligible for tax deduction under Section 80G of the Income Tax Act. A receipt will be emailed to you after verification.
                    </p>
                </div>
            </div>

            {/* ── Right Column: Donation Form ── */}
            <div className="lg:col-span-3">
                <div className="rounded-[2.5rem] p-8 md:p-10 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">Make a Donation</h3>
                            <p className="text-xs text-muted-foreground">Fill in your details & upload payment proof</p>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                            {/* Donation Amount */}
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-base">Donation Amount *</FormLabel>
                                        {/* Quick Amounts */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {SUGGESTED_AMOUNTS.map((amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => form.setValue("amount", amt, { shouldValidate: true })}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${field.value === amt
                                                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                                        : "bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 text-foreground hover:border-primary/40 hover:bg-primary/5"
                                                        }`}
                                                >
                                                    ₹{amt.toLocaleString("en-IN")}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Custom Amount */}
                                        <div className="relative mt-3">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter custom amount"
                                                    value={field.value || ""}
                                                    onChange={(e) => form.setValue("amount", Number(e.target.value) || 0, { shouldValidate: true })}
                                                    className="pl-9 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 text-lg font-bold"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Personal Details */}
                            <div className="space-y-5">
                                <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Your Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Full Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your full name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Email *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="you@example.com" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Mobile *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="9876543210" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="panNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">PAN Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ABCDE1234F" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 uppercase" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Address *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Your full address" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 min-h-[80px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Payment Section */}
                            <div className="space-y-5">
                                <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Payment Proof</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        control={form.control}
                                        name="paymentMode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Payment Mode *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                            <SelectValue placeholder="Select payment mode" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {PAYMENT_MODES.map((pm) => (
                                                            <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="payment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Payment Receipt *</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-2">
                                                        <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                            {field.value ? (
                                                                <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Receipt uploaded</span>
                                                            ) : (
                                                                <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                                    <Upload className="h-4 w-4" /> Upload receipt
                                                                </span>
                                                            )}
                                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange("payment")} />
                                                        </label>
                                                        {field.value && (
                                                            <button type="button" onClick={() => form.setValue("payment", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                                                                <X className="h-3 w-3" /> Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Optional: Donor Photo */}
                                <FormField
                                    control={form.control}
                                    name="donorImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Your Photo <span className="text-muted-foreground font-normal text-xs">(Optional — for donors wall)</span></FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                        {field.value ? (
                                                            <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Photo uploaded</span>
                                                        ) : (
                                                            <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                                <Upload className="h-4 w-4" /> Upload photo (optional)
                                                            </span>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange("donorImage")} />
                                                    </label>
                                                    {field.value && (
                                                        <button type="button" onClick={() => form.setValue("donorImage", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                                                            <X className="h-3 w-3" /> Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl gap-3 font-black text-lg h-14 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" /> Donate Now
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
