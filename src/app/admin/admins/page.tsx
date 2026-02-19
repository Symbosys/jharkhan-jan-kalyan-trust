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
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">Admin Management</h1>
                    <p className="text-muted-foreground text-sm font-medium">Control access and manage system administrators.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search admins..."
                            className="pl-10 bg-background border-input rounded-xl focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) handleResetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all rounded-xl text-primary-foreground">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] rounded-3xl bg-background border-border">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-foreground">{editingItem ? "Edit Admin Account" : "Create Admin Account"}</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        Fill in the details to {editingItem ? "update" : "grant"} administrative access.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-foreground font-semibold">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                {...register("name")}
                                                placeholder="Admin Name"
                                                className={cn("pl-10 rounded-xl bg-muted/30 border-input", errors.name && "border-destructive")}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                placeholder="admin@jankalyan.org"
                                                className={cn("pl-10 rounded-xl bg-muted/30 border-input", errors.email && "border-destructive")}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-foreground font-semibold">
                                            {editingItem ? "New Password (Optional)" : "Password"}
                                        </Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                {...register("password")}
                                                placeholder={editingItem ? "Leave blank to keep current" : "Min. 6 characters"}
                                                className={cn("pl-10 rounded-xl bg-muted/30 border-input", errors.password && "border-destructive")}
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
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-muted-foreground hover:text-foreground">Cancel</Button>
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
                    <p className="text-sm text-muted-foreground mt-4 font-medium italic">Fetching authorized users...</p>
                </div>
            ) : filteredAdmins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAdmins.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all rounded-3xl">
                            <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4 space-y-0">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CardTitle className="text-base font-bold text-foreground truncate">{item.name}</CardTitle>
                                    <CardDescription className="text-xs font-medium text-muted-foreground truncate">{item.email}</CardDescription>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-2 rounded-lg text-[10px] font-bold">
                                    ACTIVE
                                </Badge>
                            </CardHeader>

                            <CardContent className="px-6 py-4 border-y border-border bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Level</span>
                                        <span className="text-xs font-bold text-foreground">{item.role}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground tracking-wider font-mono">UID: #{item.id}</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-background hover:bg-primary hover:text-primary-foreground transition-all border border-input shadow-sm text-muted-foreground"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-background hover:bg-destructive hover:text-destructive-foreground transition-all border border-input shadow-sm text-muted-foreground"
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
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-[32px] bg-muted/20">
                    <div className="p-6 rounded-full bg-card shadow-sm mb-6 border border-border">
                        <ShieldCheck className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">No admins found</h3>
                    <p className="text-muted-foreground text-sm mt-2 font-medium max-w-[300px] text-center">
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
