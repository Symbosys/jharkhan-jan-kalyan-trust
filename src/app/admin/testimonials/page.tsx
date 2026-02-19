"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Image as ImageIcon,
    Search,
    Quote,
    Star,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} from "@/actions/testimonial";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, TestimonialInput } from "@/validators/testimonial";

export default function TestimonialPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Search and Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Image preview state
    const [preview, setPreview] = useState<string>("");

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<TestimonialInput>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            name: "",
            position: "",
            message: "",
            image: ""
        }
    });

    const fetchTestimonials = async () => {
        try {
            setIsLoading(true);
            const data = await getAllTestimonials({
                page: currentPage,
                limit: 9,
                search: searchQuery
            });
            setTestimonials(data.testimonials);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, [currentPage, searchQuery]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue("image", base64);
                setPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: TestimonialInput) => {
        try {
            setIsSubmitting(true);
            let res;
            if (editingItem) {
                res = await updateTestimonial(editingItem.id, data);
            } else {
                res = await createTestimonial(data);
            }

            if (res.success) {
                setIsDialogOpen(false);
                handleResetForm();
                fetchTestimonials();
            } else {
                alert(res.error || "Something went wrong");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await deleteTestimonial(id);
            if (res.success) {
                fetchTestimonials();
            } else {
                alert(res.error || "Failed to delete testimonial");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        reset({
            name: item.name,
            position: item.position,
            message: item.message,
            image: "" // Don't set image unless user changes it
        });
        setPreview(item.image?.url || "");
        setIsDialogOpen(true);
    };

    const handleResetForm = () => {
        reset({
            name: "",
            position: "",
            message: "",
            image: ""
        });
        setPreview("");
        setEditingItem(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Testimonials</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage and display feedback from donors and members.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) handleResetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all rounded-xl">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Testimonial
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Fill in the testimonial details below.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                placeholder="John Doe"
                                                className={cn("rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800", errors.name && "border-destructive")}
                                            />
                                            {errors.name && (
                                                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Position/Role</Label>
                                            <Input
                                                id="position"
                                                {...register("position")}
                                                placeholder="Donor / Volunteer"
                                                className={cn("rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800", errors.position && "border-destructive")}
                                            />
                                            {errors.position && (
                                                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3" /> {errors.position.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Testimonial Message</Label>
                                        <Textarea
                                            id="message"
                                            {...register("message")}
                                            placeholder="Write the feedback here..."
                                            className={cn("rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 min-h-[100px] resize-none", errors.message && "border-destructive")}
                                        />
                                        {errors.message && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.message.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Display Photo</Label>
                                        <div className={cn(
                                            "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all h-[120px] relative overflow-hidden",
                                            errors.image ? "border-destructive/50" : "border-slate-200 dark:border-slate-800"
                                        )}>
                                            {preview ? (
                                                <>
                                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button type="button" variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm" onClick={() => { setPreview(""); setValue("image", ""); }}>
                                                            Change Photo
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <label htmlFor="testimonial-upload" className="cursor-pointer flex flex-col items-center gap-2 group">
                                                    <div className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                                                        <UserCircle className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to upload photo</span>
                                                    <input id="testimonial-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingItem ? "Update" : "Save Testimonial"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                    <p className="text-sm text-slate-500 mt-4 font-medium italic">Gathering voices...</p>
                </div>
            ) : testimonials.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((item) => (
                            <Card key={item.id} className="group relative overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl bg-white dark:bg-slate-900">
                                <div className="p-6 pb-0 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                                            {item.image?.url ? (
                                                <Image src={item.image.url} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                    <UserCircle className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-none mb-1">{item.name}</h3>
                                            <p className="text-xs text-primary font-semibold">{item.position}</p>
                                        </div>
                                    </div>
                                    <Quote className="h-8 w-8 text-primary/5 -mr-1" />
                                </div>

                                <CardHeader className="p-6 pt-4 space-y-3 grow">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium italic">
                                        "{item.message}"
                                    </CardDescription>
                                </CardHeader>

                                <CardFooter className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">REF: #{item.id}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors border border-slate-100 dark:border-slate-800 shadow-sm"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 hover:bg-destructive hover:text-white transition-colors border border-slate-100 dark:border-slate-800 shadow-sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-10">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-xs font-bold bg-white dark:bg-slate-900 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:text-slate-200">
                                {currentPage} <span className="text-slate-300 dark:text-slate-600 mx-1">/</span> {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="p-6 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-6 border border-slate-50 dark:border-slate-800">
                        <Quote className="h-10 w-10 text-slate-200 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No testimonials yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium max-w-[300px] text-center">
                        {searchQuery ? "No results found for your search." : "Share what your donors and members are saying about your NGO."}
                    </p>
                    <Button className="mt-6 rounded-xl px-10" onClick={() => setIsDialogOpen(true)}>
                        Create First Testimonial
                    </Button>
                </div>
            )}
        </div>
    );
}
