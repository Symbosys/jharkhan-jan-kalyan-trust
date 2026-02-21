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
    LayoutDashboard,
    MoveUp,
    MoveDown,
    MapPin,
    Clock,
    LayoutGrid,
    CheckCircle2,
    XCircle,
    X,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity
} from "@/actions/activity";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, ActivityInput } from "@/validators/activity";

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<any[]>([]);
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
        watch,
        formState: { errors }
    } = useForm<ActivityInput>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            title: "",
            description: "",
            type: "IMAGE",
            image: "",
            videoUrl: "",
            order: 0
        }
    });

    const selectedType = watch("type");

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            const data = await getAllActivities({
                page: currentPage,
                limit: 9,
                search: searchQuery
            });
            setActivities(data.activities);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
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

    const onSubmit = async (data: ActivityInput) => {
        try {
            setIsSubmitting(true);
            let res;
            if (editingItem) {
                res = await updateActivity(editingItem.id, data);
            } else {
                res = await createActivity(data);
            }

            if (res.success) {
                setIsDialogOpen(false);
                handleResetForm();
                fetchActivities();
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
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            const res = await deleteActivity(id);
            if (res.success) {
                fetchActivities();
            } else {
                alert(res.error || "Failed to delete activity");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        reset({
            title: item.title,
            description: item.description,
            type: item.type,
            image: "",
            videoUrl: item.videoUrl || "",
            order: item.order || 0
        });
        setPreview(item.image?.url || "");
        setIsDialogOpen(true);
    };

    const handleResetForm = () => {
        reset({
            title: "",
            description: "",
            type: "IMAGE",
            image: "",
            videoUrl: "",
            order: 0
        });
        setPreview("");
        setEditingItem(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Activity Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage NGO activities, events and achievements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search activities..."
                            className="pl-10 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
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
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-2xl">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl flex flex-col">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                                <div className="bg-slate-900 text-white p-5 shrink-0">
                                    <DialogTitle className="text-xl font-bold font-outfit uppercase tracking-tight">
                                        {editingItem ? "Edit Activity" : "New Activity Record"}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400 mt-0.5 text-[10px] font-medium uppercase tracking-wider">
                                        Showcase a new achievement or event in the system.
                                    </DialogDescription>
                                </div>

                                <div className="p-5 space-y-5 bg-white dark:bg-slate-900 flex-1 overflow-y-auto min-h-0">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <Label htmlFor="title" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Activity Title</Label>
                                            {errors.title && (
                                                <span className="text-[10px] text-destructive font-bold flex items-center gap-1 animate-pulse">
                                                    <AlertCircle className="h-2.5 w-2.5" /> {errors.title.message}
                                                </span>
                                            )}
                                        </div>
                                        <Input
                                            id="title"
                                            {...register("title")}
                                            placeholder="Enter activity title..."
                                            className={cn("h-11 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all", errors.title && "border-destructive focus-visible:ring-destructive")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <Label htmlFor="description" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Detailed Description</Label>
                                            {errors.description && (
                                                <span className="text-[10px] text-destructive font-bold flex items-center gap-1 animate-pulse">
                                                    <AlertCircle className="h-2.5 w-2.5" /> {errors.description.message}
                                                </span>
                                            )}
                                        </div>
                                        <Textarea
                                            id="description"
                                            {...register("description")}
                                            placeholder="Tell the story behind this activity..."
                                            className={cn(
                                                "min-h-[90px] bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all resize-none text-sm leading-relaxed",
                                                errors.description && "border-destructive focus-visible:ring-destructive"
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Media Format</Label>
                                            <Select
                                                onValueChange={(value: "IMAGE" | "VIDEO") => {
                                                    setValue("type", value);
                                                    if (value === "IMAGE") setValue("videoUrl", "");
                                                    else setValue("image", "");
                                                }}
                                                defaultValue={selectedType}
                                            >
                                                <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-950 border-transparent focus:ring-primary/20 rounded-xl">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="IMAGE">Still Image</SelectItem>
                                                    <SelectItem value="VIDEO">Dynamic Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="order" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Display Index</Label>
                                            <Input
                                                id="order"
                                                type="number"
                                                {...register("order", { valueAsNumber: true })}
                                                placeholder="0"
                                                className="h-11 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-50 dark:border-slate-800/50">
                                        {selectedType === "IMAGE" ? (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Upload Activity Photo</Label>
                                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all group overflow-hidden relative h-[140px] shadow-inner">
                                                    {preview ? (
                                                        <>
                                                            <Image src={preview} alt="Preview" fill className="object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                                <Button type="button" variant="secondary" size="sm" className="h-9 rounded-xl font-bold uppercase text-[10px]" onClick={() => { setPreview(""); setValue("image", ""); }}>
                                                                    Replace Image
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full gap-2">
                                                            <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                                                <ImageIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Click to browse file</span>
                                                            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex justify-between items-center px-1">
                                                    <Label htmlFor="videoUrl" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">YouTube Content Link</Label>
                                                    {errors.videoUrl && (
                                                        <span className="text-[10px] text-destructive font-bold flex items-center gap-1 animate-pulse">
                                                            <AlertCircle className="h-2.5 w-2.5" /> {errors.videoUrl.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    <Input
                                                        id="videoUrl"
                                                        {...register("videoUrl")}
                                                        placeholder="https://www.youtube.com/watch?v=..."
                                                        className={cn("h-11 pl-11 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all", errors.videoUrl && "border-destructive focus-visible:ring-destructive")}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium px-1 flex items-center gap-1.5">
                                                    <XCircle className="h-3 w-3" /> Image upload is disabled for video content.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter className="bg-slate-50 dark:bg-slate-950 p-4 shrink-0 flex flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-10 px-6 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 text-white font-bold h-10 px-8 rounded-xl shadow-lg shadow-slate-200 dark:shadow-none transition-all">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingItem ? "Commit Changes" : "Save Activity"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
                    <p className="text-sm text-muted-foreground mt-4 font-medium">Fetching activities...</p>
                </div>
            ) : activities.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                        {activities.map((item) => (
                            <Card key={item.id} className="group relative overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col h-full border-none">
                                <div className="absolute top-0 right-0 p-5 flex gap-2 z-10">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-md hover:bg-primary hover:text-white rounded-2xl transition-all border border-slate-200 dark:border-slate-800 text-primary dark:text-primary-foreground"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-md hover:bg-destructive hover:text-white rounded-2xl transition-all border border-slate-200 dark:border-slate-800 text-destructive dark:text-destructive-foreground"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="relative aspect-video overflow-hidden bg-slate-50 dark:bg-slate-950">
                                    {item.image?.url ? (
                                        <Image
                                            src={item.image.url}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : item.type === "VIDEO" ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 dark:bg-slate-950 text-white">
                                            <Video className="h-12 w-12 opacity-40 mb-3 animate-pulse" />
                                            <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Video Feed</span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30">
                                            <ImageIcon className="h-12 w-12 text-slate-300" />
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <Badge className={cn(
                                            "shadow-xl border-none font-black text-[9px] px-3 h-6 rounded-lg uppercase tracking-widest",
                                            item.type === "IMAGE" ? "bg-blue-500/90" : "bg-red-500/90"
                                        )}>
                                            {item.type === "IMAGE" ? "STILL" : "VIDEO"}
                                        </Badge>
                                        <Badge variant="outline" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-transparent py-1 px-3 h-6 text-slate-900 dark:text-slate-100 font-bold text-[10px] shadow-sm rounded-lg">
                                            RANK #{item.order}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="p-6 space-y-3">
                                    <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-black gap-2 uppercase tracking-widest">
                                        <Clock className="h-3 w-3 text-primary" />
                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <CardTitle className="text-xl font-bold font-outfit leading-tight line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="px-6 pb-6 pt-0 grow">
                                    <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>

                                <CardFooter className="p-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
                                    <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">REC ID: #{item.id}</span>
                                    {item.videoUrl && (
                                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="h-8 pl-4 pr-3 py-1 bg-primary text-white hover:bg-primary/90 rounded-xl flex items-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                                            Stream <ExternalLink className="h-3 w-3 ml-2" />
                                        </a>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-11 px-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all font-bold text-slate-600 dark:text-slate-300"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                            </Button>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4">
                                Page <span className="text-slate-900 dark:text-slate-100">{currentPage}</span> of <span className="text-slate-900 dark:text-slate-100">{totalPages}</span>
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-11 px-6 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all font-bold text-slate-600 dark:text-slate-300"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg mb-6 text-slate-200 dark:text-slate-700">
                        <LayoutDashboard className="h-16 w-16" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-outfit">Gallery is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[320px] mx-auto font-medium">Click the button above to start showcasing your accomplishments with the world.</p>
                    </div>
                    {searchQuery && (
                        <Button variant="link" className="mt-4 text-primary font-bold uppercase text-[10px]" onClick={() => setSearchQuery("")}>Reset Filters</Button>
                    )}
                </div>
            )}
        </div>
    );
}
