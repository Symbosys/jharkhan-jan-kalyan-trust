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
    MoveDown
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
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Activity Management</h1>
                    <p className="text-muted-foreground text-sm">Manage NGO activities, events and achievements.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search activities..."
                            className="pl-9 bg-white"
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
                            <Button className="bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle>{editingItem ? "Edit Activity" : "Create New Activity"}</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details below to showcase a new activity.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="title">Title</Label>
                                            {errors.title && (
                                                <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
                                                    <AlertCircle className="h-2.5 w-2.5" /> {errors.title.message}
                                                </span>
                                            )}
                                        </div>
                                        <Input
                                            id="title"
                                            {...register("title")}
                                            placeholder="Enter activity title..."
                                            className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="description">Description</Label>
                                            {errors.description && (
                                                <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
                                                    <AlertCircle className="h-2.5 w-2.5" /> {errors.description.message}
                                                </span>
                                            )}
                                        </div>
                                        <Textarea
                                            id="description"
                                            {...register("description")}
                                            placeholder="Detailed description of the activity..."
                                            className={cn(
                                                "min-h-[100px] resize-none",
                                                errors.description && "border-destructive focus-visible:ring-destructive"
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Media Type</Label>
                                            <Select
                                                onValueChange={(value) => setValue("type", value as "IMAGE" | "VIDEO")}
                                                defaultValue={selectedType}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="IMAGE">Image</SelectItem>
                                                    <SelectItem value="VIDEO">Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="order">Display Order</Label>
                                            <Input
                                                id="order"
                                                type="number"
                                                {...register("order", { valueAsNumber: true })}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Activity Image {selectedType === "VIDEO" && "(Optional Thumbnail)"}</Label>
                                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors h-[120px]">
                                                {preview ? (
                                                    <div className="relative w-full h-full rounded-lg overflow-hidden group">
                                                        <Image src={preview} alt="Preview" fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button type="button" variant="ghost" size="sm" className="text-white h-8" onClick={() => { setPreview(""); setValue("image", ""); }}>
                                                                Change
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center w-full">
                                                        <ImageIcon className="h-6 w-6 text-slate-300 mb-1" />
                                                        <span className="text-xs text-slate-500 font-medium text-center px-2">Click to upload</span>
                                                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="videoUrl">Video URL (Required for Video type)</Label>
                                                {errors.videoUrl && (
                                                    <span className="text-[10px] text-destructive font-medium flex items-center gap-1">
                                                        <AlertCircle className="h-2.5 w-2.5" /> {errors.videoUrl.message}
                                                    </span>
                                                )}
                                            </div>
                                            <Input
                                                id="videoUrl"
                                                {...register("videoUrl")}
                                                placeholder="YouTube / Vimeo link"
                                                className={cn(errors.videoUrl && "border-destructive focus-visible:ring-destructive")}
                                                disabled={selectedType === "IMAGE"}
                                            />
                                            <p className="text-[10px] text-slate-400">Embed link for video content.</p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingItem ? "Update Activity" : "Create Activity"}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((item) => (
                            <Card key={item.id} className="group relative overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    {item.image?.url ? (
                                        <Image
                                            src={item.image.url}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : item.type === "VIDEO" ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                                            <Video className="h-10 w-10 opacity-50 mb-2" />
                                            <span className="text-xs opacity-50 uppercase tracking-widest">Video Content</span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-10 w-10 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 shadow-md bg-white/90 backdrop-blur-sm"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 shadow-md"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-2 left-2 flex gap-1.5">
                                        <Badge className={cn(
                                            "shadow-sm border-none py-0.5",
                                            item.type === "IMAGE" ? "bg-blue-500" : "bg-red-500"
                                        )}>
                                            {item.type}
                                        </Badge>
                                        <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200 py-0.5 text-slate-700 font-bold">
                                            #{item.order}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="p-4 space-y-1">
                                    <div className="flex items-center text-[11px] text-slate-400 gap-2 mb-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                    <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-4 pt-0 grow">
                                    <CardDescription className="line-clamp-3 text-slate-600 text-sm">
                                        {item.description}
                                    </CardDescription>
                                </CardContent>

                                <CardFooter className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">ID: #{item.id}</span>
                                    {item.videoUrl && (
                                        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-xs font-semibold">
                                            View Video <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-9 w-9"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-sm font-medium px-4 bg-white border rounded-md h-9 flex items-center">
                                Page {currentPage} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-9 w-9"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                        <LayoutDashboard className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No activities found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-[280px] text-center">
                        {searchQuery ? "Try adjusting your search terms." : "You haven't added any activities yet. Click the button above to showcase your work."}
                    </p>
                    {searchQuery && (
                        <Button variant="link" className="mt-2 text-primary" onClick={() => setSearchQuery("")}>Clear search</Button>
                    )}
                </div>
            )}
        </div>
    );
}
