"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Loader2,
    Upload,
    User,
    FileText,
    CreditCard,
    X,
    Landmark,
    QrCode,
    Copy,
} from "lucide-react";
import { applyMembership } from "@/actions/membership";
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
import { useCallback, useRef, useState } from "react";
import Image from "next/image";

// ── Constants ──
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const GENDER_OPTIONS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
];

const GUARDIAN_TYPES = [
    { value: "FATHER", label: "Father" },
    { value: "MOTHER", label: "Mother" },
    { value: "WIFE", label: "Wife" },
    { value: "HUSBAND", label: "Husband" },
];

const DOCUMENT_TYPES = [
    { value: "AADHAAR", label: "Aadhaar Card" },
    { value: "PAN", label: "PAN Card" },
    { value: "VOTER_ID", label: "Voter ID" },
    { value: "DRIVING_LICENSE", label: "Driving License" },
    { value: "RASHAN_CARD", label: "Ration Card" },
    { value: "CLASS_10_CERTIFICATE", label: "Class 10 Certificate" },
    { value: "CLASS_12_CERTIFICATE", label: "Class 12 Certificate" },
];

const PAYMENT_MODES = [
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "PAYTM", label: "Paytm" },
    { value: "GOOGLE_PAY", label: "Google Pay" },
    { value: "PHONE_PE", label: "PhonePe" },
    { value: "AMAZON_PAY", label: "Amazon Pay" },
    { value: "CHEQUE", label: "Cheque" },
    { value: "CASH", label: "Cash" },
    { value: "OTHER", label: "Other" },
];

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// ── File validation helper ──
const fileSchema = z
    .string()
    .min(1, "This file is required")
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
const membershipSchema = z.object({
    // Step 1: Personal
    name: z.string().min(2, "Name must be at least 2 characters"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    gurdianType: z.string().min(1, "Guardian type is required"),
    gurdianName: z.string().min(2, "Guardian name is required"),
    profession: z.string().min(2, "Profession is required"),
    bloodGroup: z.string().min(1, "Blood group is required"),

    // Step 2: Contact & Address
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: z.string().email("Invalid email address"),
    aadhaar: z.string().regex(/^[0-9]{12}$/, "Aadhaar must be 12 digits"),
    state: z.string().min(1, "State is required"),
    district: z.string().min(2, "District is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    pinCode: z.string().regex(/^[0-9]{6}$/, "PIN Code must be 6 digits"),

    // Step 3: Documents
    profilePicture: fileSchema,
    documentsType: z.string().min(1, "Document type is required"),
    documents: fileSchema,
    otherDocuments: optionalFileSchema,

    // Step 4: Plan & Payment
    planId: z.number("Please select a plan").min(1, "Please select a plan"),
    paymentMode: z.string().min(1, "Payment mode is required"),
    paymentImage: fileSchema,
});

type MembershipFormValues = z.infer<typeof membershipSchema>;

interface Plan {
    id: number;
    name: string;
    amount: number;
    duration: number;
    durationType: string;
    description: string;
    isActive: boolean;
}

interface PaymentDetails {
    id: number;
    image: any;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
}

interface MembershipFormProps {
    plans: Plan[];
    paymentDetails: PaymentDetails | null;
}

const STEPS = [
    { label: "Personal", icon: User },
    { label: "Address", icon: FileText },
    { label: "Documents", icon: Upload },
    { label: "Payment", icon: CreditCard },
];

const STEP_FIELDS: (keyof MembershipFormValues)[][] = [
    ["name", "gender", "dob", "gurdianType", "gurdianName", "profession", "bloodGroup"],
    ["mobile", "email", "aadhaar", "state", "district", "address", "pinCode"],
    ["profilePicture", "documentsType", "documents", "otherDocuments"],
    ["planId", "paymentMode", "paymentImage"],
];

export function MembershipForm({ plans, paymentDetails }: MembershipFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [membershipNumber, setMembershipNumber] = useState("");

    const form = useForm<MembershipFormValues>({
        resolver: zodResolver(membershipSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            gender: "",
            dob: "",
            gurdianType: "",
            gurdianName: "",
            profession: "",
            bloodGroup: "",
            mobile: "",
            email: "",
            aadhaar: "",
            state: "",
            district: "",
            address: "",
            pinCode: "",
            profilePicture: "",
            documentsType: "",
            documents: "",
            otherDocuments: "",
            planId: 0,
            paymentMode: "",
            paymentImage: "",
        },
    });

    const handleFileChange = useCallback(
        (fieldName: keyof MembershipFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const nextStep = async () => {
        const fieldsToValidate = STEP_FIELDS[currentStep];
        const valid = await form.trigger(fieldsToValidate);
        if (valid) {
            const next = Math.min(currentStep + 1, STEPS.length - 1);
            // Clear errors for the next step so they don't show prematurely
            STEP_FIELDS[next]?.forEach((f) => form.clearErrors(f));
            setCurrentStep(next);
        }
    };

    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const onSubmit = async (values: MembershipFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await applyMembership({
                ...values,
                gender: values.gender as any,
                dob: new Date(values.dob),
                gurdianType: values.gurdianType as any,
                documentsType: values.documentsType as any,
                paymentMode: values.paymentMode as any,
            });

            if (result.success) {
                setMembershipNumber(result.data?.memberShipNumber || "");
                setSubmitted(true);
                toast.success("Application submitted successfully!");
            } else {
                toast.error(result.error || "Failed to submit application");
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
            <div className="text-center py-20 space-y-8">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-4 shadow-xl">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-foreground tracking-tight">Application Submitted!</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Your membership application has been received. Our team will review it and get back to you soon.
                </p>
                {membershipNumber && (
                    <div className="inline-block px-8 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                            Your Membership Number
                        </span>
                        <span className="text-3xl font-black text-primary">{membershipNumber}</span>
                    </div>
                )}
                <p className="text-sm text-muted-foreground">Please save your membership number for future reference.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* ── Step Indicator ── */}
            <div className="flex items-center justify-center gap-2 md:gap-4">
                {STEPS.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (index < currentStep) setCurrentStep(index);
                            }}
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${index === currentStep
                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                : index < currentStep
                                    ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-pointer hover:bg-green-500/20"
                                    : "bg-white/40 dark:bg-white/5 text-muted-foreground border border-white/60 dark:border-white/10"
                                }`}
                        >
                            {index < currentStep ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <step.icon className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {index < STEPS.length - 1 && (
                            <div
                                className={`w-8 md:w-12 h-0.5 rounded-full transition-colors ${index < currentStep ? "bg-green-500" : "bg-white/40 dark:bg-white/10"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* ── Form ── */}
            <div className="rounded-[2.5rem] p-8 md:p-12 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* ── Step 1: Personal Info ── */}
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-black text-foreground tracking-tight mb-6">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Full Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your full name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Gender *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {GENDER_OPTIONS.map((g) => (
                                                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Date of Birth *</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bloodGroup"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Blood Group *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                            <SelectValue placeholder="Select blood group" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {BLOOD_GROUPS.map((bg) => (
                                                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gurdianType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Guardian Type *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                            <SelectValue placeholder="Select guardian type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {GUARDIAN_TYPES.map((g) => (
                                                            <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gurdianName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Guardian Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Guardian's full name" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="profession"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="font-bold">Profession *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your profession" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step 2: Contact & Address ── */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-black text-foreground tracking-tight mb-6">Contact & Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Mobile Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="9876543210" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
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
                                        name="aadhaar"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">Aadhaar Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="XXXX XXXX XXXX" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">State *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                            <SelectValue placeholder="Select state" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {INDIAN_STATES.map((s) => (
                                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">District *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your district" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pinCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold">PIN Code *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="834001" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
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
                                                <FormLabel className="font-bold">Full Address *</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Street, Area, Landmark..." {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 min-h-[100px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step 3: Documents ── */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tight">Upload Documents</h3>
                                    <p className="text-sm text-muted-foreground mt-1">All files must be under 1 MB. Accepted formats: JPG, PNG, PDF.</p>
                                </div>

                                {/* Profile Photo */}
                                <FormField
                                    control={form.control}
                                    name="profilePicture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Profile Photo *</FormLabel>
                                            <FormControl>
                                                <div className="flex items-start gap-6">
                                                    <label className="relative shrink-0 flex items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 hover:bg-white/40 dark:hover:bg-black/20 transition-colors cursor-pointer overflow-hidden">
                                                        {field.value ? (
                                                            <Image src={field.value} alt="Profile" width={128} height={128} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                                                                <User className="h-8 w-8" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest">Upload</span>
                                                            </div>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange("profilePicture")} />
                                                    </label>
                                                    <div className="pt-2 space-y-2">
                                                        <p className="text-sm text-muted-foreground">Upload a clear passport-size photo. Max 1 MB.</p>
                                                        {field.value && (
                                                            <button type="button" onClick={() => form.setValue("profilePicture", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                                                                <X className="h-3 w-3" /> Remove photo
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* ID Document */}
                                <div className="p-6 rounded-2xl bg-white/20 dark:bg-white/3 border border-white/40 dark:border-white/10 space-y-5">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground/70">Identity Document</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="documentsType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Document Type *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                                <SelectValue placeholder="Select document type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {DOCUMENT_TYPES.map((d) => (
                                                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="documents"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold">Upload Document *</FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-2">
                                                            <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                                {field.value ? (
                                                                    <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> File selected</span>
                                                                ) : (
                                                                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                                        <Upload className="h-4 w-4" /> Choose file
                                                                    </span>
                                                                )}
                                                                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange("documents")} />
                                                            </label>
                                                            {field.value && (
                                                                <button type="button" onClick={() => form.setValue("documents", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
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

                                {/* Other Documents (optional) */}
                                <FormField
                                    control={form.control}
                                    name="otherDocuments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Other Supporting Document <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <label className="flex items-center justify-center w-full h-[42px] rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors cursor-pointer px-4">
                                                        {field.value ? (
                                                            <span className="text-sm font-bold text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> File selected</span>
                                                        ) : (
                                                            <span className="flex items-center gap-2 text-muted-foreground text-sm">
                                                                <Upload className="h-4 w-4" /> Choose file (optional)
                                                            </span>
                                                        )}
                                                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange("otherDocuments")} />
                                                    </label>
                                                    {field.value && (
                                                        <button type="button" onClick={() => form.setValue("otherDocuments", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
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
                        )}

                        {/* ── Step 4: Plan & Payment ── */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-2xl font-black text-foreground tracking-tight">Select Plan & Payment</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Choose a plan below, then make payment and upload your receipt.</p>
                                </div>

                                {/* Plan Selection */}
                                <FormField
                                    control={form.control}
                                    name="planId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-base">Membership Plan *</FormLabel>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                                {plans.map((plan) => (
                                                    <button
                                                        type="button"
                                                        key={plan.id}
                                                        onClick={() => form.setValue("planId", plan.id, { shouldValidate: true })}
                                                        className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${field.value === plan.id
                                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                                                            : "border-white/40 dark:border-white/10 bg-white/20 dark:bg-black/10 hover:border-primary/30"
                                                            }`}
                                                    >
                                                        {field.value === plan.id && (
                                                            <div className="absolute top-3 right-3">
                                                                <CheckCircle className="h-5 w-5 text-primary" />
                                                            </div>
                                                        )}
                                                        <span className="text-2xl font-black text-foreground block">₹{plan.amount}</span>
                                                        <span className="text-sm font-bold text-primary block mt-1">{plan.name}</span>
                                                        <span className="text-xs text-muted-foreground block mt-1">
                                                            {plan.duration} {plan.durationType.toLowerCase()}{plan.duration > 1 ? "s" : ""}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground mt-2 block leading-relaxed">{plan.description}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* ── Payment Information Card ── */}
                                {paymentDetails && (
                                    <div className="rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10 bg-linear-to-br from-primary/4 via-white/50 to-blue-50/50 dark:from-primary/8 dark:via-black/20 dark:to-blue-950/20">
                                        {/* Header Bar */}
                                        <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-4 flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                                                <Landmark className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-white">Payment Details</h4>
                                                <p className="text-[10px] text-white/70 font-medium">Complete your payment to the account below</p>
                                            </div>
                                        </div>

                                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                            {/* QR Code Side */}
                                            {paymentDetails.image && (paymentDetails.image as any).url && (
                                                <div className="shrink-0 flex flex-col items-center gap-4">
                                                    <div className="p-4 rounded-3xl bg-white shadow-xl border border-gray-200 ring-4 ring-primary/10">
                                                        <Image
                                                            src={(paymentDetails.image as any).url}
                                                            alt="Scan to Pay — QR Code"
                                                            width={220}
                                                            height={220}
                                                            className="rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                                        <QrCode className="h-3.5 w-3.5 text-primary" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Scan QR to Pay</span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Bank Details Side */}
                                            <div className="flex-1 space-y-5 w-full">
                                                <p className="text-sm text-muted-foreground leading-relaxed">Transfer the membership fee via <strong className="text-foreground">bank transfer</strong> or <strong className="text-foreground">UPI</strong>, then upload the receipt below.</p>
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
                                    </div>
                                )}

                                {/* Payment Mode + Receipt — clean two-column row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        name="paymentImage"
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
                                                                    <Upload className="h-4 w-4" /> Upload receipt (max 1 MB)
                                                                </span>
                                                            )}
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange("paymentImage")} />
                                                        </label>
                                                        {field.value && (
                                                            <button type="button" onClick={() => form.setValue("paymentImage", "", { shouldValidate: true })} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
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
                        )}

                        {/* ── Navigation Buttons ── */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/40 dark:border-white/10">
                            {currentStep > 0 ? (
                                <Button type="button" variant="outline" onClick={prevStep} className="rounded-xl gap-2 font-bold">
                                    <ArrowLeft className="h-4 w-4" /> Previous
                                </Button>
                            ) : (
                                <div />
                            )}

                            {currentStep < STEPS.length - 1 ? (
                                <Button type="button" onClick={nextStep} className="rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
                                    Next <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl gap-2 font-black text-lg h-12 px-10 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
