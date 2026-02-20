"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createBooking } from "@/actions/eventBooking";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const bookingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits)"),
    email: z.string().email("Invalid email address"),
    city: z.string().min(2, "City is required"),
    isTeamMember: z.boolean(),
    memberShipNumber: z.string().optional(),
}).refine((data) => {
    if (data.isTeamMember && !data.memberShipNumber) {
        return false;
    }
    return true;
}, {
    message: "Membership number is required for team members",
    path: ["memberShipNumber"],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: number;
    eventTitle: string;
}

export function BookingModal({ isOpen, onClose, eventId, eventTitle }: BookingModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: "",
            mobile: "",
            email: "",
            city: "",
            isTeamMember: false,
            memberShipNumber: "",
        },
    });

    const isTeamMember = form.watch("isTeamMember");

    const onSubmit = async (values: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await createBooking({
                eventId,
                ...values,
            });

            if (result.success) {
                toast.success("Booking request sent successfully!", {
                    description: "Our team will confirm your seat soon.",
                });
                form.reset();
                onClose();
            } else {
                toast.error(result.error || "Failed to book seat");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-white/60 dark:border-white/10 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                        Book a Seat
                    </DialogTitle>
                    <DialogDescription className="font-bold text-primary">
                        Event: {eventTitle}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} className="rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20" />
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
                                        <FormLabel className="font-bold">Mobile</FormLabel>
                                        <FormControl>
                                            <Input placeholder="9876543210" {...field} className="rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} className="rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20" />
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
                                    <FormLabel className="font-bold">City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ranchi" {...field} className="rounded-xl border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <FormField
                                control={form.control}
                                name="isTeamMember"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between space-y-0">
                                        <div className="space-y-0.5">
                                            <FormLabel className="font-bold">Are you a Team Member?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {isTeamMember && (
                                <FormField
                                    control={form.control}
                                    name="memberShipNumber"
                                    render={({ field }) => (
                                        <FormItem className="animate-in slide-in-from-top-2 duration-300">
                                            <FormLabel className="font-bold text-xs uppercase tracking-widest text-primary">Membership Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="JKNGO-XXXX"
                                                    {...field}
                                                    className="rounded-xl border-primary/20 bg-white/50 dark:bg-black/20"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
