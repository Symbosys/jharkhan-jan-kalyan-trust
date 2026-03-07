"use client";

import { GraduationCap, QrCode, Copy, IndianRupee } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface PaymentDetails {
    id: number;
    image: any;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

export function PaymentDetailsCard({ payment }: { payment: PaymentDetails }) {
    const handleCopy = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        toast.success(`${label} copied!`);
    };

    return (
        <div className="rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 bg-linear-to-br from-primary/4 via-white/50 to-blue-50/50 dark:from-primary/8 dark:via-black/20 dark:to-blue-950/20 sticky top-32">
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Payment Details</h4>
                        <p className="text-[10px] text-white/70 font-medium">Transfer ₹501 to the account below</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* QR Code */}
                {payment.image && (payment.image as any).url && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-3xl bg-white shadow-xl border border-gray-200 ring-4 ring-primary/10">
                            <Image
                                src={(payment.image as any).url}
                                alt="Scan to Pay — QR Code"
                                width={240}
                                height={240}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                            <QrCode className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Scan QR to Pay ₹501</span>
                        </div>
                    </div>
                )}

                {/* Bank Details */}
                <div className="space-y-3">
                    {[
                        { label: "Bank Name", value: payment.bankName },
                        { label: "Account Number", value: payment.accountNumber },
                        { label: "IFSC Code", value: payment.ifscCode },
                        { label: "Account Holder", value: payment.accountHolderName },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                <span className="text-sm font-bold text-foreground tracking-wide">{item.value}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopy(item.value, item.label)}
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
    );
}
