"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Image as ImageIcon,
    Search,
    ExternalLink,
    Calendar,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Video,
    Filter
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
import {
    getAllGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from "@/actions/gallery";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, GalleryInput } from "@/validators/gallery";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function GalleryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Filters and Pagination
    const [activeTab, setActiveTab] = useState<string>("ALL");
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
        watch,
        control,
        formState: { errors }
    } = useForm<GalleryInput>({
        resolver: zodResolver(gallerySchema),
        defaultValues: {
            type: "IMAGE",
            category: "ACTIVITIES",
            image: "",
            videoUrl: ""
        }
    });

    const watchedType = watch("type");

    const fetchGallery = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 12
            };
            if (activeTab !== "ALL") {
                options.category = activeTab;
            }

            const data = await getAllGalleryItems(options);
            setItems(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch gallery", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [currentPage, activeTab]);

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

    const onSubmit = async (data: GalleryInput) => {
        try {
            setIsSubmitting(true);
            let res;
            if (editingItem) {
                res = await updateGalleryItem(editingItem.id, data);
            } else {
                res = await createGalleryItem(data);
            }

            if (res.success) {
                setIsDialogOpen(false);
                handleResetForm();
                fetchGallery();
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
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await deleteGalleryItem(id);
            if (res.success) {
                fetchGallery();
            } else {
                alert(res.error || "Failed to delete item");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        reset({
            type: item.type,
            category: item.category,
            image: "",
            videoUrl: item.videoUrl || ""
        });
        setPreview(item.image?.url || "");
        setIsDialogOpen(true);
    };

    const handleResetForm = () => {
        reset({
            type: "IMAGE",
            category: "ACTIVITIES",
            image: "",
            videoUrl: ""
        });
        setPreview("");
        setEditingItem(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Media Gallery</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage activities and press highlights media.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) handleResetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Media
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Media" : "Add New Media"}</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Choose media type and upload content.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Controller
                                                name="type"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="IMAGE">Image</SelectItem>
                                                            <SelectItem value="VIDEO">Video</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                        <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl">
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ACTIVITIES">Activities</SelectItem>
                                                            <SelectItem value="PRESS">Press</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {watchedType === "IMAGE" ? (
                                        <div className="space-y-2">
                                            <Label>Image Content</Label>
                                            <div className={cn(
                                                "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all h-[200px] relative overflow-hidden",
                                                errors.image ? "border-destructive/50" : "border-slate-200 dark:border-slate-800"
                                            )}>
                                                {preview ? (
                                                    <>
                                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button type="button" variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm" onClick={() => { setPreview(""); setValue("image", ""); }}>
                                                                Change Image
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-2 group">
                                                        <div className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Click to upload photo</span>
                                                        <input id="gallery-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                )}
                                            </div>
                                            {errors.image && (
                                                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3" /> {errors.image.message}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="videoUrl">Video/Embed URL</Label>
                                            <Input
                                                id="videoUrl"
                                                {...register("videoUrl")}
                                                placeholder="YouTube or Vimeo link..."
                                                className={cn("rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800", errors.videoUrl && "border-destructive")}
                                            />
                                            {errors.videoUrl && (
                                                <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> {errors.videoUrl.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingItem ? "Update" : "Save Media"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl h-11">
                        <TabsTrigger value="ALL" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-500 dark:text-slate-400">All Media</TabsTrigger>
                        <TabsTrigger value="ACTIVITIES" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-500 dark:text-slate-400">Activities</TabsTrigger>
                        <TabsTrigger value="PRESS" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 text-slate-500 dark:text-slate-400">Press Coverage</TabsTrigger>
                    </TabsList>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                        <p className="text-sm text-slate-500 mt-4 font-medium italic">Shuffling the gallery...</p>
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="group relative aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900">
                                {item.type === "IMAGE" && item.image?.url ? (
                                    <Image
                                        src={item.image.url}
                                        alt="Gallery item"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : item.videoUrl && getYoutubeId(item.videoUrl) ? (
                                    <div className="w-full h-full relative group/video">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${getYoutubeId(item.videoUrl)}?modestbranding=1&rel=0`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 z-0 pointer-events-none group-hover/video:pointer-events-auto"
                                        ></iframe>
                                        <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover/video:bg-transparent transition-colors z-1"></div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                                        <div className="p-4 rounded-full bg-primary/10">
                                            <Video className="h-8 w-8 text-primary" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 truncate max-w-full">
                                            {item.videoUrl ? "External Video" : "No Content"}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <Badge className="bg-white/90 dark:bg-black/60 backdrop-blur-sm text-slate-900 dark:text-white border-none text-[10px] font-bold shadow-sm rounded-full">
                                        {item.category}
                                    </Badge>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 pointer-events-none">
                                    <div className="flex gap-2 pointer-events-auto">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-10 w-10 rounded-full bg-white hover:bg-white/90 text-slate-900 border-none shadow-xl transition-all"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-10 w-10 rounded-full shadow-xl transition-all"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">ID: #{item.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="p-6 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-6 border border-slate-100 dark:border-slate-800">
                            <ImageIcon className="h-12 w-12 text-slate-200 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gallery is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Start building your NGO's visual history.</p>
                        <Button className="mt-6 rounded-xl px-8" onClick={() => setIsDialogOpen(true)}>
                            Upload First Media
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-10">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-11 w-11 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="text-sm font-bold bg-slate-100 dark:bg-slate-800 px-6 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-inner dark:text-slate-200">
                            {currentPage} <span className="text-slate-400 mx-1">/</span> {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-11 w-11 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </Tabs>
        </div>
    );
}
