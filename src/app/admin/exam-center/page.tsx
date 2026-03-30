"use client";

import { useEffect, useState } from "react";
import {
    createExamCenter,
    deleteExamCenter,
    getAllExamCenters,
    updateExamCenter,
} from "@/actions/examCenter";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Building2,
    Loader2,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
    Globe,
    Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ExamCenter {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    mobile: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
    capacity: number;
    createdAt: Date;
    updatedAt: Date;
    _count: {
        schoolEnquiries: number;
    };
}

export default function ExamCenterPage() {
    const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        mobile: "",
        email: "",
        website: "",
        description: "",
        capacity: "500",
    });

    const fetchExamCenters = async () => {
        setLoading(true);
        try {
            const data = await getAllExamCenters({ search, limit: 100 });
            setExamCenters(data.examCenters as any);
        } catch (error) {
            console.error("Fetch exam centers error:", error);
            toast.error("Failed to fetch exam centers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchExamCenters();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const resetForm = () => {
        setFormData({
            name: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            mobile: "",
            email: "",
            website: "",
            description: "",
            capacity: "500",
        });
        setEditingId(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (center: ExamCenter) => {
        setFormData({
            name: center.name,
            address: center.address,
            city: center.city,
            state: center.state,
            pinCode: center.pinCode,
            mobile: center.mobile || "",
            email: center.email || "",
            website: center.website || "",
            description: center.description || "",
            capacity: center.capacity.toString(),
        });
        setEditingId(center.id);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pinCode: formData.pinCode,
                mobile: formData.mobile || undefined,
                email: formData.email || undefined,
                website: formData.website || undefined,
                description: formData.description || undefined,
                capacity: parseInt(formData.capacity) || 500,
            };

            let res;
            if (editingId) {
                res = await updateExamCenter(editingId, data);
            } else {
                res = await createExamCenter(data);
            }

            if (res.success) {
                toast.success(editingId ? "Exam center updated" : "Exam center created");
                setIsDialogOpen(false);
                resetForm();
                fetchExamCenters();
            } else {
                toast.error(res.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this exam center?")) return;
        setIsDeleting(id);
        try {
            const res = await deleteExamCenter(id);
            if (res.success) {
                toast.success("Exam center deleted");
                fetchExamCenters();
            } else {
                toast.error(res.error || "Delete failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const getSeatStatus = (occupied: number, capacity: number) => {
        const available = capacity - occupied;
        if (available <= 0) {
            return { label: "Full", variant: "destructive" as const, color: "text-red-600" };
        } else if (available <= 20) {
            return { label: `${available} left`, variant: "warning" as const, color: "text-amber-600" };
        } else {
            return { label: `${available} available`, variant: "success" as const, color: "text-green-600" };
        }
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-primary" />
                        Exam Centers
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage exam centers for GK Competition. Set custom capacity for each center.
                    </p>
                </div>

                <Button
                    onClick={openCreateDialog}
                    className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Exam Center
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Centers</p>
                                <p className="text-3xl font-bold text-foreground">{examCenters.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                                <p className="text-3xl font-bold text-foreground">
                                    {examCenters.reduce((acc, center) => acc + center.capacity, 0)}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Registered Students</p>
                                <p className="text-3xl font-bold text-foreground">
                                    {examCenters.reduce((acc, center) => acc + center._count.schoolEnquiries, 0)}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Card */}
            <Card className="border-border shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border bg-slate-50/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search exam centers..."
                                className="pl-9 bg-background border-border"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Badge variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
                            Custom capacity per center enabled
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && examCenters.length === 0 ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : examCenters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <Building2 className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No exam centers found</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-1">
                                You haven&apos;t created any exam centers yet.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={openCreateDialog}>
                                Add your first exam center
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="font-semibold text-foreground">Center Name</TableHead>
                                        <TableHead className="font-semibold text-foreground">Location</TableHead>
                                        <TableHead className="font-semibold text-foreground">Contact</TableHead>
                                        <TableHead className="font-semibold text-foreground text-center">Seats</TableHead>
                                        <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {examCenters.map((center) => {
                                        const seatStatus = getSeatStatus(center._count.schoolEnquiries, center.capacity);
                                        return (
                                            <TableRow key={center.id} className="hover:bg-primary/5 transition-colors">
                                                <TableCell>
                                                    <div className="font-medium text-foreground">{center.name}</div>
                                                    {center.description && (
                                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {center.description}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                                        <div className="text-sm">
                                                            <div className="text-foreground">{center.address}</div>
                                                            <div className="text-muted-foreground">
                                                                {center.city}, {center.state} - {center.pinCode}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {center.mobile && (
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span className="text-foreground">{center.mobile}</span>
                                                            </div>
                                                        )}
                                                        {center.email && (
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span className="text-foreground text-xs">{center.email}</span>
                                                            </div>
                                                        )}
                                                        {center.website && (
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span className="text-foreground text-xs truncate max-w-[150px]">
                                                                    {center.website}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="text-sm font-semibold">
                                                            {center._count.schoolEnquiries} / {center.capacity}
                                                        </div>
                                                        <Badge 
                                                            variant={seatStatus.variant === "destructive" ? "destructive" : "secondary"}
                                                            className={`text-xs ${seatStatus.color}`}
                                                        >
                                                            {seatStatus.label}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                            onClick={() => openEditDialog(center)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => handleDelete(center.id)}
                                                            disabled={isDeleting === center.id}
                                                        >
                                                            {isDeleting === center.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Exam Center" : "Create Exam Center"}</DialogTitle>
                        <DialogDescription>
                            {editingId 
                                ? "Update the exam center details below." 
                                : "Add a new exam center for GK Competition registrations."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name">Center Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. St. Xavier's School"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    placeholder="Full address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g. Ranchi"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Input
                                    id="state"
                                    placeholder="e.g. Jharkhand"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pinCode">PIN Code *</Label>
                                <Input
                                    id="pinCode"
                                    placeholder="e.g. 834001"
                                    value={formData.pinCode}
                                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile</Label>
                                <Input
                                    id="mobile"
                                    placeholder="e.g. +91 98765 43210"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. contact@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    placeholder="e.g. www.example.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity *</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Additional information about the center"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {editingId ? "Save Changes" : "Create Center"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
