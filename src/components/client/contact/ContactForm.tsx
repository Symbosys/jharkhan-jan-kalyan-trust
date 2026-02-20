"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import {
    Send,
    Loader2,
    CheckCircle,
    MessageSquare,
    User,
    Smartphone,
    Mail,
    BookOpen
} from "lucide-react";
import { createEnquiry } from "@/actions/enquiry";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const enquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    email: z.string().email("Invalid email address"),
    topic: z.string().min(1, "Please select a topic"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

const TOPICS = [
    { value: "general", label: "General Inquiry" },
    { value: "membership", label: "Membership Support" },
    { value: "donation", label: "Donation Inquiry" },
    { value: "volunteer", label: "Volunteer Opportunity" },
    { value: "complaint", label: "Feedback/Complaint" },
    { value: "other", label: "Other" },
];

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<EnquiryFormValues>({
        resolver: zodResolver(enquirySchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            mobile: "",
            email: "",
            topic: "",
            description: "",
        },
    });

    const onSubmit = async (values: EnquiryFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await createEnquiry(values);
            if (result.success) {
                setSubmitted(true);
                toast.success("Enquiry sent successfully!", {
                    description: "We'll get back to you soon.",
                });
                form.reset();
            } else {
                toast.error(result.error || "Failed to send enquiry");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500 rounded-[2rem] bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Message Received!</h3>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                        Thank you for reaching out. Our team will review your enquiry and get back to you within 24-48 hours.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="rounded-xl px-8"
                >
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <div className="rounded-[2.5rem] p-8 md:p-10 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">Send an Enquiry</h3>
                    <p className="text-xs text-muted-foreground">We value your questions and feedback.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-primary" /> Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
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
                                        <Input placeholder="9876543210" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-primary" /> Email *
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold flex items-center gap-2">
                                        <BookOpen className="h-3.5 w-3.5 text-primary" /> Topic *
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10">
                                                <SelectValue placeholder="Select a topic" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {TOPICS.map((topic) => (
                                                <SelectItem key={topic.value} value={topic.value}>
                                                    {topic.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Description *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="How can we help you?"
                                        className="rounded-xl bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 min-h-[120px] resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" /> Send Message
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
