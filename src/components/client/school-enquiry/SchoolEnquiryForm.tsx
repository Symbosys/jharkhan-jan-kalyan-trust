"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    GraduationCap,
    CheckCircle,
    Loader2,
    Upload,
    X,
    Sparkles,
    Copy,
    Building2,
    MapPin,
    Users,
} from "lucide-react";
import { createSchoolEnquiry } from "@/actions/schoolEnquiry";
import { getAvailableExamCenters } from "@/actions/examCenter";
import { uploadImageClient } from "@/utils/cloudinary-client";
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCallback, useState, useEffect } from "react";

interface PaymentDetails {
    id: number;
    image: any;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

interface SchoolEnquiryFormProps {
    paymentDetails: PaymentDetails | null;
}

// ── Constants ──
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const BOARDS = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "State Board", label: "State Board" },
    { value: "IB", label: "IB" },
    { value: "IGCSE", label: "IGCSE" },
    { value: "Other", label: "Other" },
];

const CLASSES = [
    { value: "Nursery", label: "Nursery" },
    { value: "LKG", label: "LKG" },
    { value: "UKG", label: "UKG" },
    { value: "1", label: "Class 1" },
    { value: "2", label: "Class 2" },
    { value: "3", label: "Class 3" },
    { value: "4", label: "Class 4" },
    { value: "5", label: "Class 5" },
    { value: "6", label: "Class 6" },
    { value: "7", label: "Class 7" },
    { value: "8", label: "Class 8" },
    { value: "9", label: "Class 9" },
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" },
];

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
const schoolEnquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    school: z.string().min(2, "School name must be at least 2 characters"),
    class: z.string().min(1, "Class is required"),
    board: z.string().min(1, "Board is required"),
    aadhaar: z.string().min(12, "Aadhaar number must be 12 digits").max(12, "Aadhaar number must be 12 digits"),
    examCenterId: z.string().min(1, "Exam center is required"),
    photo: optionalFileSchema,
    payment: fileSchema,
});

type SchoolEnquiryFormValues = z.infer<typeof schoolEnquirySchema>;

interface ExamCenter {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    availableSeats: number;
}

export function SchoolEnquiryForm({ paymentDetails }: SchoolEnquiryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<{ success: boolean; registrationNumber?: string }>({ success: false });
    const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
    const [loadingCenters, setLoadingCenters] = useState(true);

    // Fetch available exam centers on mount
    useEffect(() => {
        async function fetchExamCenters() {
            try {
                const data = await getAvailableExamCenters();
                setExamCenters(data.examCenters as ExamCenter[]);
            } catch (error) {
                console.error("Failed to fetch exam centers:", error);
                toast.error("Failed to load exam centers");
            } finally {
                setLoadingCenters(false);
            }
        }
        fetchExamCenters();
    }, []);

    const form = useForm<SchoolEnquiryFormValues>({
        resolver: zodResolver(schoolEnquirySchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            school: "",
            class: "",
            board: "",
            aadhaar: "",
            examCenterId: "",
            photo: "",
            payment: "",
        },
    });

    const handleFileChange = useCallback(
        (fieldName: keyof SchoolEnquiryFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const onSubmit = async (values: SchoolEnquiryFormValues) => {
        setIsSubmitting(true);
        let photoData = undefined;
        let paymentData = undefined;

        try {
            // 1. Upload images to Cloudinary from client side

            // Upload photo if provided
            if (values.photo) {
                try {
                    photoData = await uploadImageClient(values.photo, "school-enquiries");
                } catch (err: any) {
                    toast.error("Failed to upload photo: " + err.message);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Upload payment proof if provided
            if (values.payment) {
                try {
                    paymentData = await uploadImageClient(values.payment, "school-enquiries");
                } catch (err: any) {
                    toast.error("Failed to upload payment proof: " + err.message);
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Send payload to server action
            const result = await createSchoolEnquiry({
                name: values.name,
                mobile: values.mobile,
                email: values.email,
                school: values.school,
                class: values.class,
                board: values.board,
                aadhaar: values.aadhaar,
                examCenterId: parseInt(values.examCenterId),
                photoData,
                paymentData,
            });

            if (result.success && result.data) {
                setSubmitted({ success: true, registrationNumber: result.data.registrationNumber });
                toast.success("Registration successful! Your 6-digit registration number: " + result.data.registrationNumber);
            } else {
                toast.error(result.error || "Failed to register for competition");
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success Screen ──
    if (submitted.success) {
        return (
            <div className="text-center py-20 space-y-8 animate-in fade-in duration-500">
                <div className="relative inline-block">
                    <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                    <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 shadow-2xl shadow-green-500/10">
                        <GraduationCap className="h-14 w-14 text-green-500" />
                    </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    Registration Successful! 🎓
                </h2>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Thank you for registering for the GK competition. Our team will review your application and contact you with further details.
                </p>
                
                {/* Registration Number Display */}
                <div className="inline-block px-8 py-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block">
                        Registration Number
                    </span>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-black text-primary tracking-wider">
                            {submitted.registrationNumber}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(submitted.registrationNumber || '');
                                toast.success("Registration number copied!");
                            }}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                            title="Copy registration number"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        6-digit registration number for your records
                    </p>
                </div>
                
                <div className="inline-block px-8 py-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                        Participant Details
                    </span>
                    <span className="text-xl font-black text-primary">{form.getValues("name")}</span>
                </div>
                
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Please save your registration number for future reference. A confirmation email with competition details has been sent to your email address.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-[2.5rem] p-8 md:p-10 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">GK Competition Registration</h3>
                    <p className="text-xs text-muted-foreground">Fill in your details to register for the competition</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    {/* Personal Details */}
                    <div className="space-y-5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Student Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Full Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Participant's full name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
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
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">School/Institution *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter school or institution name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Class *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {CLASSES.map((cls) => (
                                                    <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="board"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Board *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                    <SelectValue placeholder="Select board" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {BOARDS.map((board) => (
                                                    <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="aadhaar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Aadhaar Number *</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="123456789012" 
                                                {...field} 
                                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                                className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Exam Center Selection */}
                    <div className="space-y-5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Exam Center *
                        </h4>
                        <FormField
                            control={form.control}
                            name="examCenterId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Select Exam Center *</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        disabled={loadingCenters || examCenters.length === 0}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                <SelectValue placeholder={loadingCenters ? "Loading exam centers..." : examCenters.length === 0 ? "No exam centers available" : "Select your preferred exam center"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {examCenters.map((center) => (
                                                <SelectItem key={center.id} value={center.id.toString()}>
                                                    <div className="flex items-center justify-between w-full gap-4">
                                                        <span className="font-medium">{center.name}</span>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <MapPin className="h-3 w-3" />
                                                            {center.city}, {center.state}
                                                            <span className={`px-2 py-0.5 rounded-full ${
                                                                center.availableSeats <= 10 
                                                                    ? 'bg-red-100 text-red-700' 
                                                                    : center.availableSeats <= 30 
                                                                        ? 'bg-amber-100 text-amber-700' 
                                                                        : 'bg-green-100 text-green-700'
                                                            }`}>
                                                                {center.availableSeats} seats left
                                                            </span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-xs">
                                        Select the exam center where you want to appear for the GK Competition. Each center has a maximum capacity of 120 students.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {examCenters.length === 0 && !loadingCenters && (
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
                                No exam centers are currently available. Please contact the administrator.
                            </div>
                        )}
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Documents (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Photo Upload */}
                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Participant Photo <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                    {field.value ? (
                                                        <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Photo uploaded</span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                            <Upload className="h-4 w-4" /> Upload photo
                                                        </span>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange("photo")} />
                                                </label>
                                                {field.value && (
                                                    <button type="button" onClick={() => form.setValue("photo", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                                                        <X className="h-3 w-3" /> Remove
                                                    </button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Payment Upload */}
                            <FormField
                                control={form.control}
                                name="payment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Payment Receipt * <span className="text-muted-foreground font-normal text-xs">(₹50 Registration Fee)</span></FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                    {field.value ? (
                                                        <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Payment receipt uploaded</span>
                                                    ) : (
                                                        <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                            <Upload className="h-4 w-4" /> Upload payment receipt
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
                                <Sparkles className="h-5 w-5" /> Register Now
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
