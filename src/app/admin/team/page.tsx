"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Search,
    User,
    MapPin,
    Briefcase,
    X,
    Image as ImageIcon,
    MoreHorizontal,
    ShieldCheck,
    Users,
    ChevronLeft,
    ChevronRight,
    Filter,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getAllTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} from "@/actions/team";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Local Type Definition to avoid Prisma bundling issues
type TeamType = 'MEMBER' | 'MANAGMENT';

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);

    // Filter & Pagination State
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        location: "",
        type: "MEMBER" as TeamType,
        image: "" as string,
    });
    const [preview, setPreview] = useState<string>("");

    const fetchTeam = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 9,
                search: debouncedSearch,
            };
            if (typeFilter !== "ALL") options.type = typeFilter as TeamType;

            const res = await getAllTeam(options);
            setMembers(res.team);
            setTotalPages(res.pagination.totalPages);
        } catch (error) {
            console.error("Failed to fetch team members", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [currentPage, typeFilter, debouncedSearch]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData({ ...formData, image: base64 });
                setPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (editingMember) {
                const res = await updateTeamMember(editingMember.id, {
                    name: formData.name,
                    position: formData.position,
                    location: formData.location,
                    type: formData.type,
                    image: formData.image.startsWith('data:') ? formData.image : undefined
                });
                if (res.success) {
                    setIsDialogOpen(false);
                    fetchTeam();
                } else {
                    alert(res.error || "Failed to update member");
                }
            } else {
                if (!formData.image) {
                    alert("Please upload an image");
                    return;
                }
                const res = await createTeamMember(formData);
                if (res.success) {
                    setIsDialogOpen(false);
                    fetchTeam();
                } else {
                    alert(res.error || "Failed to create member");
                }
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (member: any) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            position: member.position,
            location: member.location || "",
            type: member.type,
            image: member.image?.url || "",
        });
        setPreview(member.image?.url || "");
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this team member?")) return;
        try {
            const res = await deleteTeamMember(id);
            if (res.success) {
                fetchTeam();
            } else {
                alert(res.error || "Failed to delete member");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const resetForm = () => {
        setEditingMember(null);
        setFormData({
            name: "",
            position: "",
            location: "",
            type: "MEMBER",
            image: "",
        });
        setPreview("");
    };

    const getTypeBadge = (type: string) => {
        if (type === 'MANAGMENT') {
            return <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 rounded-lg">MANAGEMENT</Badge>;
        }
        return <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-none text-[10px] font-bold px-2 rounded-lg">MEMBER</Badge>;
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Team Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage organization members and management staff.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-2xl">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Team Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] max-h-[90vh] p-0 overflow-hidden border-none rounded-[28px] shadow-2xl flex flex-col">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                            <div className="bg-slate-900 text-white p-4 shrink-0">
                                <DialogTitle className="text-lg font-bold font-outfit">
                                    {editingMember ? "Update Member" : "Add New Member"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 mt-0.5 text-[10px]">
                                    Fill in the details to {editingMember ? "modify" : "add"} a team member.
                                </DialogDescription>
                            </div>

                            <div className="p-4 space-y-4 bg-white dark:bg-slate-900 flex-1 overflow-y-auto min-h-0">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Profile Photo</Label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-3 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all group overflow-hidden relative aspect-square w-36 mx-auto shadow-inner">
                                        {preview ? (
                                            <>
                                                <Image
                                                    src={preview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-white h-auto p-0 hover:bg-transparent"
                                                        onClick={() => { setPreview(""); setFormData({ ...formData, image: "" }); }}
                                                    >
                                                        <X className="h-6 w-6" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <label htmlFor="team-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">
                                                    <ImageIcon className="h-6 w-6" />
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Upload Photo</span>
                                                <input
                                                    id="team-image-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                            className="h-10 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type" className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Member Type</Label>
                                        <Select value={formData.type} onValueChange={(v: TeamType) => setFormData({ ...formData, type: v })}>
                                            <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-950 border-transparent focus:ring-primary/20 rounded-xl text-sm">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MEMBER">Member</SelectItem>
                                                <SelectItem value="MANAGMENT">Management</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Job Position</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        placeholder="e.g. Project Manager"
                                        required
                                        className="h-10 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Location (Office/Branch)</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. New Delhi, India"
                                            className="h-10 pl-11 bg-slate-50 dark:bg-slate-950 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-xl transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="bg-slate-50 dark:bg-slate-950 p-3 shrink-0 flex flex-row items-center justify-between gap-4">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-9 px-4 font-bold text-slate-500 dark:text-slate-400 text-xs">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 px-8 rounded-xl shadow-lg shadow-slate-200 text-xs">
                                    {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                                    {editingMember ? "Update" : "Save"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-[2rem] overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-all" />
                        <Input
                            placeholder="Search by name, position or location..."
                            className="pl-12 h-12 bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[180px] h-12 bg-slate-50 dark:bg-slate-950 border-transparent focus:ring-primary/20 rounded-2xl">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                <SelectItem value="MEMBER">General Member</SelectItem>
                                <SelectItem value="MANAGMENT">Management</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 transition-colors"
                            onClick={() => {
                                setSearchQuery("");
                                setTypeFilter("ALL");
                                setCurrentPage(1);
                            }}
                        >
                            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/40 mb-4" />
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest italic">Synchronizing database...</p>
                </div>
            ) : members.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {members.map((item) => (
                            <Card key={item.id} className="group relative overflow-hidden border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white dark:bg-slate-900 pt-10 px-6 pb-6">
                                <div className="absolute top-0 right-0 p-6 flex gap-2 z-10">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 bg-white dark:bg-slate-900 backdrop-blur-md hover:bg-primary hover:text-white rounded-2xl shadow-2xl transition-all text-primary dark:text-primary-foreground border border-slate-200 dark:border-slate-800"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 bg-white dark:bg-slate-900 backdrop-blur-md hover:bg-destructive hover:text-white rounded-2xl shadow-2xl transition-all text-destructive dark:text-destructive-foreground border border-slate-200 dark:border-slate-800"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 dark:bg-slate-800 mb-2">
                                        {item.image?.url ? (
                                            <Image
                                                src={item.image.url}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="h-12 w-12 text-slate-200 dark:text-slate-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        {getTypeBadge(item.type)}
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-outfit mt-2">{item.name}</h3>
                                        <p className="text-primary font-bold text-sm tracking-tight flex items-center justify-center gap-1.5 uppercase">
                                            <Briefcase className="h-3 w-3" /> {item.position}
                                        </p>
                                    </div>

                                    {item.location && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-2xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2 border border-slate-100 dark:border-slate-800">
                                            <MapPin className="h-3 w-3 text-primary" />
                                            {item.location}
                                        </div>
                                    )}
                                </div>
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
                                className="h-11 px-6 rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all font-bold text-slate-600 dark:text-slate-300"
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
                                className="h-11 px-6 rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all font-bold text-slate-600 dark:text-slate-300"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg mb-6 text-slate-200 dark:text-slate-700">
                        <Users className="h-16 w-16" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-outfit">The team is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[320px] mx-auto font-medium">Click the button above to start assembling your organization's team and management staff.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
