"use client";

import {
    createSlider,
    deleteSlider,
    getAllSliders
} from "@/actions/slider";
import { Button } from "@/components/ui/button";
import {
    Card
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
    Image as ImageIcon,
    Loader2,
    Plus,
    Trash2
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function SlidersPage() {
    const [sliders, setSliders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [image, setImage] = useState<string>("");
    const [order, setOrder] = useState<number>(0);
    const [preview, setPreview] = useState<string>("");

    const fetchSliders = async () => {
        try {
            setIsLoading(true);
            const data = await getAllSliders(1, 100);
            setSliders(data.sliders);
        } catch (error) {
            console.error("Failed to fetch sliders", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImage(base64);
                setPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        try {
            setIsSubmitting(true);
            const res = await createSlider({ image, order });
            if (res.success) {
                setIsDialogOpen(false);
                setImage("");
                setPreview("");
                setOrder(0);
                fetchSliders();
            } else {
                alert(res.error || "Failed to create slider");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this slider?")) return;

        try {
            const res = await deleteSlider(id);
            if (res.success) {
                fetchSliders();
            } else {
                alert(res.error || "Failed to delete slider");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Slider Management</h1>
                    <p className="text-muted-foreground text-sm">Upload and manage images for the homepage slider.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slider
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>Add New Slider</DialogTitle>
                                <DialogDescription>
                                    Upload an image and set its display order.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Slider Image</Label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        {preview ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                                                <Image
                                                    src={preview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-white"
                                                        onClick={() => { setPreview(""); setImage(""); }}
                                                    >
                                                        Change Image
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                                <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
                                                <span className="text-sm text-slate-500 font-medium">Click to upload image</span>
                                                <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    required
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting || !image}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Upload Slider
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
                    <p className="text-sm text-muted-foreground mt-4 font-medium">Loading sliders...</p>
                </div>
            ) : sliders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sliders.map((slider) => (
                        <Card key={slider.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="relative aspect-video">
                                <Image
                                    src={slider.image.url}
                                    alt={`Slider ${slider.id}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wider">
                                    Order: {slider.order}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1.5">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 shadow-lg"
                                        onClick={() => handleDelete(slider.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                        <ImageIcon className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No sliders found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-[280px] text-center">
                        You haven't added any slider images yet. Click the button above to add your first slider.
                    </p>
                </div>
            )}
        </div>
    );
}
