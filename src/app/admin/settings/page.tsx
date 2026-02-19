"use client";

import { useState, useEffect } from "react";
import {
    getAllWebSettings,
    updateWebSetting,
    deleteWebSetting,
} from "@/actions/webSetting";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    Settings2,
    Save,
    X,
    Key,
    Type,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const settingSchema = z.object({
    key: z
        .string()
        .min(2, "Key must be at least 2 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Key must be alphanumeric with underscores only"),
    value: z.string().min(1, "Value is required"),
});

type SettingFormValues = z.infer<typeof settingSchema>;

interface WebSetting {
    id: number;
    key: string;
    value: string;
    updatedAt: Date;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<WebSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SettingFormValues>({
        resolver: zodResolver(settingSchema),
        defaultValues: {
            key: "",
            value: "",
        },
    });

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await getAllWebSettings({ search });
            setSettings(data.settings as any);
        } catch (error) {
            console.error("Fetch settings error:", error);
            toast.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSettings();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const onSubmit = async (values: SettingFormValues) => {
        setIsSubmitting(true);
        try {
            const res = await updateWebSetting(values.key, values.value);
            if (res.success) {
                toast.success(editingKey ? "Setting updated" : "Setting created");
                setIsDialogOpen(false);
                fetchSettings();
                form.reset();
            } else {
                toast.error(res.error || "Execution failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Are you sure you want to delete the setting '${key}'?`)) return;
        try {
            const res = await deleteWebSetting(key);
            if (res.success) {
                toast.success("Setting deleted");
                fetchSettings();
            } else {
                toast.error(res.error || "Delete failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    const handleEdit = (setting: WebSetting) => {
        setEditingKey(setting.key);
        form.reset({
            key: setting.key,
            value: setting.value,
        });
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingKey(null);
        form.reset({
            key: "",
            value: "",
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-6 max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit flex items-center gap-3">
                        <Settings2 className="h-8 w-8 text-primary" />
                        Website Configuration
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage dynamic key-value pairs for website content and settings.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingKey(null);
                        form.reset();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Setting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingKey ? "Edit Setting" : "Create New Setting"}</DialogTitle>
                            <DialogDescription>
                                Configure a custom key-value pair that can be used throughout the website.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                                <FormField
                                    control={form.control as any}
                                    name="key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-slate-400" /> Key Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. support_phone"
                                                    disabled={!!editingKey}
                                                    {...field}
                                                    className="bg-muted/50 focus:bg-background transition-colors"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Internal identifier (use underscores, no spaces).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Type className="h-4 w-4 text-slate-400" /> Value Content
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. +91 98765 43210"
                                                    {...field}
                                                    className="bg-muted/50 focus:bg-background transition-colors"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The actual data associated with this key.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter className="pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        {editingKey ? "Save Changes" : "Create Setting"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border bg-slate-50/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search settings..."
                                className="pl-9 bg-background border-border"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
                                {settings.length} Active Settings
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && settings.length === 0 ? (
                        <div className="flex h-[300px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : settings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <AlertCircle className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No settings found</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-1">
                                You haven't created any custom settings yet.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={openCreateDialog}>
                                Add your first setting
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[300px] font-semibold text-foreground">Setting Key</TableHead>
                                        <TableHead className="font-semibold text-foreground">Value</TableHead>
                                        <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {settings.map((setting) => (
                                        <TableRow key={setting.key} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                    <span className="text-foreground font-semibold tracking-tight">{setting.key}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-muted-foreground truncate max-w-[500px]" title={setting.value}>
                                                    {setting.value}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5"
                                                        onClick={() => handleEdit(setting)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50/10"
                                                        onClick={() => handleDelete(setting.key)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20 flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Pro Tip</h4>
                    <p className="text-sm text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
                        These settings act as global variables. You can add keys like <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded text-blue-800 dark:text-blue-300">contact_number</code>, <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded text-blue-800 dark:text-blue-300">office_address</code>, or <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded text-blue-800 dark:text-blue-300">alert_banner_text</code> and they will be used dynamically across the website.
                    </p>
                </div>
            </div>
        </div>
    );
}
