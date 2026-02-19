"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Search,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    Image as ImageIcon,
    X,
    TrendingUp,
    Heart,
    BadgeCheck,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getAllDonars,
    createDonar,
    updateDonar,
    updateDonarStatus,
    deleteDonar
} from "@/actions/donar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDebounce } from "@/hooks/use-debounce";

// Local Type Definitions for safety
type DonarStatus = 'PENDING' | 'VERIFIED';
const PaymentMode = {
    BANK_TRANSFER: 'BANK_TRANSFER',
    PAYTM: 'PAYTM',
    GOOGLE_PAY: 'GOOGLE_PAY',
    PHONE_PE: 'PHONE_PE',
    AMAZON_PAY: 'AMAZON_PAY',
    CHEQUE: 'CHEQUE',
    CASH: 'CASH',
    OTHER: 'OTHER'
} as const;
type PaymentMode = typeof PaymentMode[keyof typeof PaymentMode];

export default function DonorsPage() {
    const [donors, setDonors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState<any>(null);
    const [editingDonor, setEditingDonor] = useState<any>(null);

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        panNumber: "",
        address: "",
        amount: "",
        paymentMode: "BANK_TRANSFER" as PaymentMode,
        donorImage: "",
        payment: "",
    });
    const [donorImagePreview, setDonorImagePreview] = useState("");
    const [paymentPreview, setPaymentPreview] = useState("");

    const fetchDonors = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
            };
            if (statusFilter !== "ALL") options.status = statusFilter as DonarStatus;

            const res = await getAllDonars(options);
            setDonors(res.donars);
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
        } catch (error) {
            console.error("Failed to fetch donors", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, [currentPage, statusFilter, debouncedSearch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'donorImage' | 'payment') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFormData(prev => ({ ...prev, [field]: base64 }));
                if (field === 'donorImage') setDonorImagePreview(base64);
                if (field === 'payment') setPaymentPreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const payload = {
                ...formData,
                amount: parseInt(formData.amount),
            };

            if (editingDonor) {
                const res = await updateDonar(editingDonor.id, {
                    ...payload,
                    donorImage: formData.donorImage.startsWith('data:') ? formData.donorImage : undefined,
                    payment: formData.payment.startsWith('data:') ? formData.payment : undefined,
                });
                if (res.success) {
                    setIsDialogOpen(false);
                    fetchDonors();
                } else {
                    alert(res.error || "Failed to update donor");
                }
            } else {
                if (!formData.payment) {
                    alert("Please upload payment receipt");
                    return;
                }
                const res = await createDonar(payload as any);
                if (res.success) {
                    setIsDialogOpen(false);
                    fetchDonors();
                } else {
                    alert(res.error || "Failed to create donor record");
                }
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (donor: any) => {
        setEditingDonor(donor);
        setFormData({
            name: donor.name,
            mobile: donor.mobile,
            email: donor.email,
            panNumber: donor.panNumber,
            address: donor.address,
            amount: donor.amount.toString(),
            paymentMode: donor.paymentMode,
            donorImage: donor.donorImage?.url || "",
            payment: donor.payment?.url || "",
        });
        setDonorImagePreview(donor.donorImage?.url || "");
        setPaymentPreview(donor.payment?.url || "");
        setIsDialogOpen(true);
    };

    const handleStatusUpdate = async (id: number, status: DonarStatus) => {
        if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
        try {
            const res = await updateDonarStatus(id, status);
            if (res.success) {
                fetchDonors();
                if (selectedDonor?.id === id) {
                    setSelectedDonor({ ...selectedDonor, status });
                }
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this donor record?")) return;
        try {
            const res = await deleteDonar(id);
            if (res.success) {
                fetchDonors();
            }
        } catch (error) {
            alert("An error occurred");
        }
    };

    const resetForm = () => {
        setEditingDonor(null);
        setFormData({
            name: "",
            mobile: "",
            email: "",
            panNumber: "",
            address: "",
            amount: "",
            paymentMode: "BANK_TRANSFER",
            donorImage: "",
            payment: "",
        });
        setDonorImagePreview("");
        setPaymentPreview("");
    };

    const getStatusBadge = (status: string) => {
        if (status === 'VERIFIED') {
            return <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-none px-2 rounded-lg text-[10px] font-bold">VERIFIED</Badge>;
        }
        return <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-none px-2 rounded-lg text-[10px] font-bold">PENDING</Badge>;
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Donations Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Review and manage NGO donations and contributors.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-6 mr-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Donors</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalItems}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Success Rate</p>
                            <p className="text-xl font-bold text-emerald-500">{Math.round((donors.filter(d => d.status === 'VERIFIED').length / (donors.length || 1)) * 100)}%</p>
                        </div>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-2xl">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Donation Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl bg-white dark:bg-slate-900">
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-8 flex items-center justify-between">
                                    <div>
                                        <DialogTitle className="text-2xl font-bold font-outfit text-slate-900 dark:text-slate-100">
                                            {editingDonor ? "Edit Donor Record" : "New Donation Record"}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                            {editingDonor ? "Modify existing contribution details." : "Register a new manual donation to the NGO system."}
                                        </DialogDescription>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Heart className="h-6 w-6 text-primary" />
                                    </div>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Left Side: Personal Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-6 w-1 bg-primary rounded-full" />
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Donor Identity</h4>
                                        </div>

                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative h-32 w-32 rounded-[2rem] border-4 border-slate-50 shadow-inner bg-slate-100 dark:bg-slate-800 group overflow-hidden">
                                                {donorImagePreview ? (
                                                    <Image src={donorImagePreview} alt="Donor" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                        <User className="h-12 w-12" />
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                                                    <ImageIcon className="h-6 w-6 text-white" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'donorImage')} />
                                                </label>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Upload Profile Photo (Optional)</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Full Name</Label>
                                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Rahul Sharma" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Mobile Number</Label>
                                                    <Input required value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="10-digit number" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">PAN Number</Label>
                                                    <Input required value={formData.panNumber} onChange={e => setFormData({ ...formData, panNumber: e.target.value })} placeholder="ABCDE1234F" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all uppercase" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Email Address</Label>
                                                <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Donation Details */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-6 w-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full" />
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Contribution Info</h4>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Amount (INR)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-emerald-600 dark:text-emerald-400">₹</span>
                                                    <Input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="h-12 pl-10 bg-emerald-50/30 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl font-bold text-lg text-emerald-700 dark:text-emerald-400 transition-all border-2" />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Payment Mode</Label>
                                                <Select value={formData.paymentMode} onValueChange={(v: PaymentMode) => setFormData({ ...formData, paymentMode: v })}>
                                                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(PaymentMode).map(mode => (
                                                            <SelectItem key={mode} value={mode}>{mode.replace(/_/g, " ")}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Payment Proof / Receipt</Label>
                                                <label className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center group cursor-pointer hover:bg-slate-100 dark:bg-slate-800 transition-all overflow-hidden">
                                                    {paymentPreview ? (
                                                        <Image src={paymentPreview} alt="Receipt" fill className="object-contain p-4" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                                                <ImageIcon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest italic font-bold">Attach Evidence</span>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'payment')} />
                                                    {paymentPreview && (
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                            <Button type="button" variant="secondary" className="h-8 rounded-xl text-[10px] font-bold uppercase" onClick={(e) => { e.preventDefault(); setPaymentPreview(""); setFormData(p => ({ ...p, payment: "" })); }}>Change Receipt</Button>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">Permanent Address</Label>
                                                <Input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full address details" className="h-12 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 rounded-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                    <Button type="button" variant="ghost" className="rounded-2xl h-12 px-8 font-bold text-slate-500 dark:text-slate-400" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-12 font-bold shadow-xl shadow-slate-200">
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : editingDonor ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        {editingDonor ? "Save Changes" : "Create Record"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-all" />
                        <Input
                            placeholder="Search by name, mobile, email or PAN..."
                            className="pl-12 h-12 bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[180px] h-12 bg-slate-50 dark:bg-slate-950 border-transparent rounded-2xl">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="VERIFIED">Verified</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800"
                            onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); setCurrentPage(1); }}
                        >
                            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead className="w-[80px]">Donor</TableHead>
                            <TableHead>Personal Details</TableHead>
                            <TableHead>Contribution</TableHead>
                            <TableHead>Tax Info (PAN)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                                        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest italic">Retrieving donation records...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : donors.length > 0 ? (
                            donors.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-all">
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
                                            {item.donorImage?.url ? (
                                                <Image src={item.donorImage.url} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><User className="h-6 w-6 text-slate-200 dark:text-slate-700" /></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                                                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.mobile}</span>
                                                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-md font-extrabold text-emerald-600 dark:text-emerald-400">₹{item.amount.toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-tight">
                                                <CreditCard className="h-3 w-3" /> {item.paymentMode.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-[10px] border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-lg">
                                            {item.panNumber}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all shadow-none group/btn"
                                                onClick={() => { setSelectedDonor(item); setIsDetailsOpen(true); }}
                                            >
                                                <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover/btn:text-primary transition-colors" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-none group/btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover/btn:text-white transition-colors" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-none group/btn"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover/btn:text-destructive transition-colors" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="p-6 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"><Heart className="h-12 w-12 text-slate-100" /></div>
                                        <p className="text-slate-400 dark:text-slate-500 font-medium italic">No donation records found for your search criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4">Page {currentPage} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-10 px-6 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-10 px-6 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                Next <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Verification Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] bg-white dark:bg-slate-900">
                    {selectedDonor && (
                        <div className="flex flex-col h-[85vh]">
                            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="relative h-32 w-32 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-slate-100 dark:bg-slate-800 shrink-0 transform -rotate-3 hover:rotate-0 transition-all duration-500">
                                    {selectedDonor.donorImage?.url ? (
                                        <Image src={selectedDonor.donorImage.url} alt={selectedDonor.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700"><User className="h-14 w-14" /></div>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-3">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <h2 className="text-4xl font-black tracking-tight font-outfit text-slate-900 dark:text-slate-100 leading-tight">{selectedDonor.name}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            {getStatusBadge(selectedDonor.status)}
                                            <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl px-3 h-8 flex items-center gap-2 font-mono">
                                                <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
                                                ID: #{selectedDonor.id.toString().padStart(4, '0')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"><Phone className="h-3.5 w-3.5 text-primary" /> {selectedDonor.mobile}</span>
                                        <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm"><Mail className="h-3.5 w-3.5 text-primary" /> {selectedDonor.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 bg-[#fafafa] dark:bg-slate-950">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    {/* Verification Column */}
                                    <div className="md:col-span-4 space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Identity & Status</h3>
                                            <Card className="p-6 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Verification Level</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-colors", selectedDonor.status === 'VERIFIED' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : "bg-amber-50 dark:bg-amber-900/20 text-amber-500")}>
                                                                {selectedDonor.status === 'VERIFIED' ? <BadgeCheck className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                                            </div>
                                                            <p className="font-bold text-slate-700">{selectedDonor.status === 'VERIFIED' ? "Bank Verified" : "Verification Pending"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Registered PAN</p>
                                                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 font-mono text-center text-lg font-black text-slate-600 tracking-wider">
                                                            {selectedDonor.panNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Account Summary</h3>
                                            <Card className="p-8 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900 text-center">
                                                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase mb-2">Total Contribution</p>
                                                <h4 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit mb-4 italic">₹{selectedDonor.amount.toLocaleString()}</h4>
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border border-emerald-100/50">
                                                    <CreditCard className="h-3 w-3" /> {selectedDonor.paymentMode.replace(/_/g, " ")}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    {/* Document Preview Column */}
                                    <div className="md:col-span-8 space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Transaction Evidence</h3>
                                            <span className="text-[10px] font-bold text-primary flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg">
                                                <ImageIcon className="h-3 w-3" /> OFFICIAL RECEIPT
                                            </span>
                                        </div>
                                        <div className="group relative aspect-video rounded-[3rem] border-8 border-white shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center transition-all hover:shadow-[0_32px_70px_-12px_rgba(0,0,0,0.15)] bg-grid-slate-100/[0.2]">
                                            {selectedDonor.payment?.url ? (
                                                <Image src={selectedDonor.payment.url} alt="Receipt" fill className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-700" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-slate-600 italic font-medium">
                                                    <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><XCircle className="h-8 w-8" /></div>
                                                    No Evidence Found
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black/20 to-transparent group-hover:opacity-0 transition-all pointer-events-none">
                                                <p className="text-white text-xs font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                                                    <Search className="h-4 w-4" /> Hover to focus
                                                </p>
                                            </div>
                                        </div>
                                        <Card className="p-6 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0">
                                                    <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">Registered Address</p>
                                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic pr-6">{selectedDonor.address}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 py-2 px-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Document Created</span>
                                        <span className="text-xs font-bold text-slate-600">{new Date(selectedDonor.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <Button variant="ghost" className="rounded-2xl h-14 px-8 font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 w-full md:w-auto" onClick={() => setIsDetailsOpen(false)}>Close Summary</Button>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden md:block" />
                                    {selectedDonor.status === 'PENDING' ? (
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-10 font-black tracking-wide shadow-xl shadow-emerald-200 group w-full md:w-auto" onClick={() => handleStatusUpdate(selectedDonor.id, 'VERIFIED')}>
                                            <CheckCircle2 className="h-5 w-5 mr-3 group-hover:scale-125 transition-transform" />
                                            VERIFY CONTRIBUTION
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="border-amber-200 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-900/20 rounded-2xl h-14 px-10 font-black tracking-wide w-full md:w-auto" onClick={() => handleStatusUpdate(selectedDonor.id, 'PENDING')}>
                                            <Clock className="h-5 w-5 mr-3" />
                                            REVERT TO PENDING
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
