"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
    Send,
    Loader2,
    CheckCircle,
    AlertCircle,
    User,
    Smartphone,
    MapPin,
    FileText,
    Video,
    Upload,
    X,
    ShieldAlert
} from "lucide-react";
import { registerComplaint } from "@/actions/complaint";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const complaintSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    city: z.string().min(2, "City name is required"),
    message: z.string().min(5, "Subject/Title must be at least 5 characters"),
    description: z.string().min(20, "Please provide a detailed description (min 20 chars)"),
    videoUrl: z.string().url("Invalid video URL").or(z.literal("")),
    document1: z.string().optional(),
    document2: z.string().optional(),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export function ComplaintForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<ComplaintFormValues>({
        resolver: zodResolver(complaintSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            mobile: "",
            city: "",
            message: "",
            description: "",
            videoUrl: "",
            document1: "",
            document2: "",
        },
    });

    const handleFileChange = useCallback(
        (fieldName: "document1" | "document2") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > MAX_FILE_SIZE) {
                toast.error("File too large", { description: "Maximum file size is 2 MB" });
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

    const onSubmit = async (values: ComplaintFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await registerComplaint(values);
            if (result.success) {
                setSubmitted(true);
                toast.success("Complaint registered successfully!", {
                    description: "Our legal team will review your case shortly.",
                });
            } else {
                toast.error(result.error || "Failed to register complaint");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500 rounded-[3rem] bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    <div className="relative h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-xl shadow-red-500/10">
                        <ShieldAlert className="h-12 w-12 text-red-500" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-foreground tracking-tight">Case Registered!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Your problem has been recorded. Jharkhand Jan Kalyan Trust is committed to seeking justice for every citizen. We will contact you on your registered mobile number soon.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        setSubmitted(false);
                        form.reset();
                    }}
                    className="rounded-2xl px-10 h-12 font-bold hover:bg-primary hover:text-white transition-all"
                >
                    Register Another Problem
                </Button>
            </div>
        );
    }

    return (
        <div className="relative rounded-[3rem] p-8 md:p-12 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
            {/* Form Header */}
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/20">
                <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner">
                    <ShieldAlert className="h-7 w-7 text-red-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Register Your Problem</h3>
                    <p className="text-sm text-muted-foreground font-medium italic">"Justice delayed is justice denied — We stand with you."</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Personal Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-primary" /> Full Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 h-12" />
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
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <Smartphone className="h-3.5 w-3.5 text-primary" /> Mobile *
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="10-digit number" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-primary" /> City / Village *
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Current location" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Problem Summary */}
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 text-red-500" /> Problem Subject *
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Briefly state your problem (e.g. Land dispute, Harassment, etc.)" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 h-12" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Detailed Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5 text-primary" /> Detailed Description *
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Explain the incident/problem in detail with dates and names involved..."
                                        className="rounded-2xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 min-h-[150px] resize-none p-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Media Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <Video className="h-3.5 w-3.5 text-secondary" /> Video Link (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="YouTube or Drive link for proof" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 h-12" />
                                    </FormControl>
                                    <FormDescription className="text-[10px] italic">Provide a link to a video recording if available.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormLabel className="font-bold">Supporting Documents (Optional)</FormLabel>
                            <div className="flex gap-4">
                                {/* Doc 1 */}
                                <FormField
                                    control={form.control}
                                    name="document1"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative">
                                                    <label className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${field.value ? "border-green-500 bg-green-500/5 text-green-600" : "border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 hover:border-primary/40"}`}>
                                                        {field.value ? (
                                                            <>
                                                                <CheckCircle className="h-6 w-6 mb-1" />
                                                                <span className="text-[10px] font-bold">Doc 1 Added</span>
                                                                <button type="button" onClick={(e) => { e.preventDefault(); form.setValue("document1", ""); }} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"><X className="h-3 w-3" /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-6 w-6 mb-1 opacity-50" />
                                                                <span className="text-[10px] font-bold opacity-70 text-center">Identity Proof / FIR</span>
                                                            </>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange("document1")} />
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Doc 2 */}
                                <FormField
                                    control={form.control}
                                    name="document2"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative">
                                                    <label className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${field.value ? "border-green-500 bg-green-500/5 text-green-600" : "border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 hover:border-primary/40"}`}>
                                                        {field.value ? (
                                                            <>
                                                                <CheckCircle className="h-6 w-6 mb-1" />
                                                                <span className="text-[10px] font-bold">Doc 2 Added</span>
                                                                <button type="button" onClick={(e) => { e.preventDefault(); form.setValue("document2", ""); }} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"><X className="h-3 w-3" /></button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-6 w-6 mb-1 opacity-50" />
                                                                <span className="text-[10px] font-bold opacity-70 text-center">Supporting Doc</span>
                                                            </>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange("document2")} />
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-3xl font-black text-xl gap-4 shadow-xl shadow-red-500/20 bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" /> Submitting Your Case...
                            </>
                        ) : (
                            <>
                                <Send className="h-6 w-6" /> Submit Problem for Verification
                            </>
                        )}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground italic font-medium">
                        Privacy Note: All information is kept confidential between you and the legal team of JJT.
                    </p>
                </form>
            </Form>
        </div>
    );
}
