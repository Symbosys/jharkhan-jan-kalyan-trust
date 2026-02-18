"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Search,
    ShieldCheck,
    Mail,
    User,
    Key,
    AlertCircle,
    UserPlus,
} from "lucide-react";
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
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from "@/actions/admin";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema, AdminInput } from "@/validators/admin";

export default function AdminsPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AdminInput>({
        resolver: zodResolver(adminSchema) as any,
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "ADMIN"
        }
    });

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            const data = await getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            const formData = data as AdminInput;
            let res;
            if (editingItem) {
                res = await updateAdmin(editingItem.id, formData);
            } else {
                // Password is required for new admin
                if (!formData.password) {
                    alert("Password is required for new admin");
                    setIsSubmitting(false);
                    return;
                }
                res = await createAdmin(formData as any);
            }

            if (res.success) {
                setIsDialogOpen(false);
                handleResetForm();
                fetchAdmins();
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
        if (!confirm("Are you sure you want to delete this admin account? This action cannot be undone.")) return;

        try {
            const res = await deleteAdmin(id);
            if (res.success) {
                fetchAdmins();
            } else {
                alert(res.error || "Failed to delete admin");
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        reset({
            name: item.name,
            email: item.email,
            password: "",
            role: item.role
        });
        setIsDialogOpen(true);
    };

    const handleResetForm = () => {
        reset({
            name: "",
            email: "",
            password: "",
            role: "ADMIN"
        });
        setEditingItem(null);
    };

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Admin Management</h1>
                    <p className="text-slate-500 text-sm font-medium">Control access and manage system administrators.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search admins..."
                            className="pl-10 bg-white border-slate-200 rounded-xl focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) handleResetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all rounded-xl">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] rounded-3xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">{editingItem ? "Edit Admin Account" : "Create Admin Account"}</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Fill in the details to {editingItem ? "update" : "grant"} administrative access.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                placeholder="Admin Name"
                                                className={cn("pl-10 rounded-xl bg-slate-50 border-slate-100", errors.name && "border-destructive")}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder="admin@jankalyan.org"
                                                className={cn("pl-10 rounded-xl bg-slate-50 border-slate-100", errors.email && "border-destructive")}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700 font-semibold">
                                            {editingItem ? "New Password (Optional)" : "Password"}
                                        </Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                {...register("password")}
                                                placeholder={editingItem ? "Leave blank to keep current" : "Min. 6 characters"}
                                                className={cn("pl-10 rounded-xl bg-slate-50 border-slate-100", errors.password && "border-destructive")}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-md">
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingItem ? "Update Access" : "Create Account"}
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
                    <p className="text-sm text-slate-500 mt-4 font-medium italic">Fetching authorized users...</p>
                </div>
            ) : filteredAdmins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAdmins.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all rounded-3xl">
                            <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4 space-y-0">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="text-base font-bold text-slate-900 truncate">{item.name}</CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 truncate">{item.email}</CardDescription>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 rounded-lg text-[10px] font-bold">
                                    ACTIVE
                                </Badge>
                            </CardHeader>

                            <CardContent className="px-6 py-4 border-y border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Level</span>
                                        <span className="text-xs font-bold text-slate-700">{item.role}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">UID: #{item.id}</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-white hover:bg-primary hover:text-white transition-all border border-slate-200 shadow-sm text-slate-600"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-white hover:bg-destructive hover:text-white transition-all border border-slate-200 shadow-sm text-slate-600"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                    <div className="p-6 rounded-full bg-white shadow-sm mb-6 border border-slate-50">
                        <ShieldCheck className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No admins found</h3>
                    <p className="text-slate-500 text-sm mt-2 font-medium max-w-[300px] text-center">
                        {searchQuery ? "No accounts match your search query." : "Register authorized users to manage the platform."}
                    </p>
                    <Button className="mt-6 rounded-xl px-10" onClick={() => setIsDialogOpen(true)}>
                        Create New Admin
                    </Button>
                </div>
            )}
        </div>
    );
}
