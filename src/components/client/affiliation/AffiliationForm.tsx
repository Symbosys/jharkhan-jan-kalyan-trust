"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Building,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Globe,
    FileText,
    Upload,
    CheckCircle,
    Loader2,
    X,
} from "lucide-react";
import { createAffiliation } from "@/actions/affiliation";
import { uploadImageClient } from "@/utils/cloudinary-client";
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";

// ── Constants ──
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ORGANIZATION_TYPES = [
    "NGO",
    "Educational Institution",
    "Healthcare Organization",
    "Community Welfare Society",
    "Women Empowerment Organization",
    "Youth Organization",
    "Environmental Group",
    "Religious Organization",
    "Cooperative Society",
    "Other"
];

// ── File validation helper ──
const optionalFileSchema = z
    .string()
    .optional()
    .refine(
        (val) => {
            if (!val || typeof val !== 'string') return true;
            if (!val.startsWith("data:")) return true;
            const base64 = val.split(",")[1];
            if (!base64) return true;
            const sizeInBytes = (base64.length * 3) / 4;
            return sizeInBytes <= MAX_FILE_SIZE;
        },
        { message: "File must be less than 2 MB" }
    );

// ── Zod Schema ──
const affiliationSchema = z.object({
    organizationName: z.string().min(2, "Organization name is required"),
    registrationNumber: z.string().optional(),
    establishedYear: z.number().min(1900, "Please enter a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
    organizationType: z.string().min(1, "Organization type is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: z.string().email("Invalid email address"),
    website: z.string().optional().refine(
        (val) => !val || val.startsWith('http'),
        { message: "Website must start with http:// or https://" }
    ),
    directorName: z.string().min(2, "Director name is required"),
    directorMobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    directorEmail: z.string().email("Invalid email address").optional(),
    documents: optionalFileSchema,
});

type AffiliationFormValues = z.infer<typeof affiliationSchema>;

export function AffiliationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<{ AffiliationNumber: string } | false>(false);

    const form = useForm<AffiliationFormValues>({
        resolver: zodResolver(affiliationSchema),
        mode: "onChange",
        defaultValues: {
            organizationName: "",
            registrationNumber: undefined,
            establishedYear: undefined,
            organizationType: "",
            address: "",
            city: "",
            mobile: "",
            email: "",
            website: undefined,
            directorName: "",
            directorMobile: "",
            directorEmail: undefined,
            documents: undefined,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid file type", {
                description: "Please upload a valid document (JPEG, PNG, GIF, WEBP, PDF)"
            });
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File too large", {
                description: `Maximum file size is ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)} MB`
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (!result || !result.startsWith('data:')) {
                toast.error("File processing failed", {
                    description: "Could not process the selected file"
                });
                return;
            }
            form.setValue("documents", result, { shouldValidate: true });
        };
        reader.onerror = () => {
            toast.error("File reading failed", {
                description: "Could not read the selected file"
            });
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (values: AffiliationFormValues) => {
        setIsSubmitting(true);
        try {
            // Upload documents if provided
            let documentsData;
            if (values.documents) {
                try {
                    documentsData = await uploadImageClient(values.documents, "affiliations");
                } catch (err: any) {
                    console.error("Document upload error:", err);
                    toast.error("Document upload failed: " + (err.message || "Unknown error"));
                    setIsSubmitting(false);
                    return;
                }
            }

            // Exclude base64 string from payload
            const { documents, ...filteredValues } = values;

            const result = await createAffiliation({
                ...filteredValues,
                documents: documentsData
            });

            if (result.success && result.data) {
                setSubmitted({ AffiliationNumber: result.data.AffiliationNumber });
                toast.success("Affiliation request submitted successfully!");
            } else {
                toast.error(result.error || "Failed to submit affiliation request");
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            toast.error("An unexpected error occurred: " + (err.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success Screen ──
    if (submitted) {
        return (
            <div className="text-center py-20 space-y-8">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-4 shadow-xl">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-foreground tracking-tight">Request Submitted!</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Thank you for your interest in partnering with Jharkhand Jan Kalyan Trust. Your affiliation request has been received.
                </p>
                <div className="space-y-4">
                    <div className="inline-block px-8 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl">
                        <p className="text-sm text-muted-foreground">
                            Your affiliation number is: <span className="font-bold text-foreground">{submitted.AffiliationNumber}</span>
                        </p>
                    </div>
                    <div className="inline-block px-8 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl">
                        <p className="text-sm text-muted-foreground">
                            We typically respond within 3-5 business days. You will receive an email confirmation shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[2.5rem] p-8 md:p-12 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-6">Organization Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Organization Name *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="Enter organization name" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="registrationNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Registration Number</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Registration certificate number" 
                                                {...field} 
                                                className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="establishedYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Established Year *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    type="number"
                                                    placeholder="YYYY" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organizationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Organization Type *</FormLabel>
                                        <FormControl>
                                            <select 
                                                {...field}
                                                className="w-full px-3 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-white/40 dark:border-white/10 text-foreground"
                                            >
                                                <option value="">Select organization type</option>
                                                {ORGANIZATION_TYPES.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="font-bold">Website</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="https://your-organization.com" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="font-bold">Registered Address *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Textarea 
                                                    placeholder="Full registered address" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 min-h-20" 
                                                />
                                            </div>
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
                                        <FormLabel className="font-bold">City *</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="City" 
                                                {...field} 
                                                className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                            />
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
                                        <FormLabel className="font-bold">Organization Mobile *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="9876543210" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="font-bold">Organization Email *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="contact@organization.com" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-6">Director/Representative Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="directorName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Director/Representative Name *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="Full name" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="directorMobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Director Mobile *</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="9876543210" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="directorEmail"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="font-bold">Director Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="director@organization.com" 
                                                    {...field} 
                                                    className="pl-10 rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-6">Supporting Documents</h3>
                        
                        <FormField
                            control={form.control}
                            name="documents"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Upload Documents</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <label className="flex items-center justify-center w-full h-12 rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                {field.value ? (
                                                    <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                                                        <CheckCircle className="h-4 w-4" /> Document uploaded
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                        <Upload className="h-4 w-4" /> Upload registration certificate or other supporting documents (max 2 MB)
                                                    </span>
                                                )}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*,application/pdf" 
                                                    onChange={handleFileChange} 
                                                />
                                            </label>
                                            {field.value && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => form.setValue("documents", undefined, { shouldValidate: true })} 
                                                    className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline"
                                                >
                                                    <X className="h-3 w-3" /> Remove document
                                                </button>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-6 border-t border-white/40 dark:border-white/10">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl gap-2 font-black text-lg h-12 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting Request...
                                </>
                            ) : (
                                "Submit Affiliation Request"
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            By submitting this form, you agree to our partnership terms and conditions.
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}