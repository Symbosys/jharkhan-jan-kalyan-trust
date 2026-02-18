"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, QrCode, Landmark, User, CreditCard } from "lucide-react";
import { getPaymentDetails, upsertPaymentDetails } from "@/actions/payment";
import Image from "next/image";

const paymentSchema = z.object({
    bankName: z.string().min(2, "Bank name is required"),
    accountNumber: z.string().min(8, "Account number is required"),
    ifscCode: z.string().min(4, "IFSC code is required"),
    accountHolderName: z.string().min(2, "Account holder name is required"),
    image: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountHolderName: "",
            image: "",
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getPaymentDetails();
                if (data) {
                    form.reset({
                        bankName: data.bankName,
                        accountNumber: data.accountNumber,
                        ifscCode: data.ifscCode,
                        accountHolderName: data.accountHolderName,
                    });
                    if (data.image && (data.image as any).url) {
                        setPreview((data.image as any).url);
                    }
                }
            } catch (error) {
                console.error("Failed to load payment details", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                form.setValue("image", base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: PaymentFormValues) => {
        setSubmitting(true);
        try {
            const result = await upsertPaymentDetails(values);
            if (result.success) {
                toast.success("Payment details updated successfully");
            } else {
                toast.error(result.error || "Failed to update payment details");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Payment Settings</h1>
                    <p className="text-slate-500 mt-1">Manage NGO bank details and donation QR code.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-primary" />
                            Bank Information
                        </CardTitle>
                        <CardDescription>Setup your official NGO bank account for transfers.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Bank Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Landmark className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input placeholder="e.g. HDFC Bank" className="pl-9 h-11 border-slate-200 focus:ring-primary/20" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="accountHolderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Account Holder Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input placeholder="NGO Name" className="pl-9 h-11 border-slate-200 focus:ring-primary/20" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Account Number</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input placeholder="1234567890" className="pl-9 h-11 border-slate-200 focus:ring-primary/20" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ifscCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">IFSC Code</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <QrCode className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input placeholder="HDFC0001234" className="pl-9 h-11 border-slate-200 focus:ring-primary/20" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto h-11 px-8 font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        "Save Account Details"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <QrCode className="h-4 w-4 text-primary" />
                                QR Code / Logo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col items-center">
                            <div className="relative w-full aspect-square max-w-[200px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden group">
                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="QR Code Preview"
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-xs font-medium">Upload QR Code</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-4 text-center">
                                Recommended size: 500x500px. <br />Supports JPG, PNG or WEBP.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/10 shadow-none">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Landmark className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-primary">Public Information</h4>
                                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                    These details will be shown to users on the donation and membership pages.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
