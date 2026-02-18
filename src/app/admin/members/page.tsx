"use client";

import {
    deleteMembership,
    getAllMemberships,
    updateMembershipStatus
} from "@/actions/membership";
import { getAllMembershipPlans } from "@/actions/membershipPlan";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
    AlertCircle,
    BadgeCheck,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    Loader2,
    Phone,
    Search,
    Shield,
    Trash2,
    User,
    UserCheck,
    UserX,
    XCircle
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
// Define types locally since we cannot import Prisma client in a client component
type MemberShipStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'CANCELLED' | 'REJECTED';
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

export default function MembersPage() {
    const [memberships, setMemberships] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Filters and Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [planFilter, setPlanFilter] = useState<string>("ALL");
    const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchPlans = async () => {
        try {
            const res = await getAllMembershipPlans({ limit: 100 });
            setPlans(res.plans);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        }
    };

    const fetchMemberships = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
            };

            if (statusFilter !== "ALL") options.status = statusFilter as MemberShipStatus;
            if (planFilter !== "ALL") options.planId = parseInt(planFilter);
            if (paymentFilter !== "ALL") options.paymentMode = paymentFilter as PaymentMode;

            const res = await getAllMemberships(options);
            setMemberships(res.memberships);
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
        } catch (error) {
            console.error("Failed to fetch memberships", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        fetchMemberships();
    }, [currentPage, statusFilter, planFilter, paymentFilter, debouncedSearch]);

    const handleUpdateStatus = async (id: number, status: MemberShipStatus) => {
        if (!confirm(`Are you sure you want to change the status to ${status}?`)) return;
        try {
            setIsActionLoading(id);
            const res = await updateMembershipStatus(id, status);
            if (res.success) {
                fetchMemberships();
                if (selectedMember && selectedMember.id === id) {
                    setSelectedMember({ ...selectedMember, status });
                }
            } else {
                alert(res.error || "Failed to update status");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this membership? This will remove all files from storage.")) return;
        try {
            setIsActionLoading(id);
            const res = await deleteMembership(id);
            if (res.success) {
                fetchMemberships();
                if (isDetailsOpen) setIsDetailsOpen(false);
            } else {
                alert(res.error || "Failed to delete membership");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none px-2 rounded-lg text-[10px] font-bold">ACTIVE</Badge>;
            case "PENDING":
                return <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-none px-2 rounded-lg text-[10px] font-bold">PENDING</Badge>;
            case "REJECTED":
                return <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-50 border-none px-2 rounded-lg text-[10px] font-bold">REJECTED</Badge>;
            case "EXPIRED":
                return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 rounded-lg text-[10px] font-bold">EXPIRED</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none px-2 rounded-lg text-[10px] font-bold">{status}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Membership Requests</h1>
                    <p className="text-slate-500 text-sm font-medium">Verify and manage NGO memberships and renewals.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    <Card className="p-3 border-slate-100 shadow-sm col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg"><Clock className="h-4 w-4 text-blue-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Pending</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{memberships.filter(m => m.status === 'PENDING').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 border-slate-100 shadow-sm col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg"><UserCheck className="h-4 w-4 text-emerald-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Verified</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{memberships.filter(m => m.status === 'ACTIVE').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 border-slate-100 shadow-sm col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg"><User className="h-4 w-4 text-slate-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Total</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{totalItems}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 border-slate-100 shadow-sm col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-50 rounded-lg"><UserX className="h-4 w-4 text-rose-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Rejected</p>
                                <p className="text-sm font-bold text-slate-900 mt-1">{memberships.filter(m => m.status === 'REJECTED').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by name, email, mobile or membership #..."
                            className="pl-12 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-primary/20 rounded-xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-slate-50 border-transparent">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[160px] h-11 rounded-xl bg-slate-50 border-transparent">
                                <SelectValue placeholder="Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Plans</SelectItem>
                                {plans.map(plan => (
                                    <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-slate-50 border-transparent">
                                <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Payment Mode</SelectItem>
                                {Object.values(PaymentMode).map(mode => (
                                    <SelectItem key={mode} value={mode}>{mode.replace(/_/g, " ")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 rounded-xl bg-slate-50 hover:bg-slate-100"
                            onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("ALL");
                                setPlanFilter("ALL");
                                setPaymentFilter("ALL");
                                setCurrentPage(1);
                            }}
                        >
                            <XCircle className="h-4 w-4 text-slate-400" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[80px]">Photo</TableHead>
                            <TableHead>Member Details</TableHead>
                            <TableHead>Membership #</TableHead>
                            <TableHead>Plan & Payment</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
                                        <p className="text-sm text-slate-500 font-medium italic">Scanning database...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : memberships.length > 0 ? (
                            memberships.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100">
                                            {item.profilePicture?.url ? (
                                                <Image
                                                    src={item.profilePicture.url}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="h-6 w-6 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-900">{item.name}</span>
                                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {item.mobile}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-[10px] border-slate-200 text-slate-600 bg-slate-50 rounded-lg">
                                            {item.memberShipNumber}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-primary">{item.plan?.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tight">
                                                <CreditCard className="h-3 w-3" /> {item.paymentMode.replace(/_/g, " ")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-primary hover:text-white transition-all text-slate-600 shadow-sm"
                                                onClick={() => { setSelectedMember(item); setIsDetailsOpen(true); }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {item.status === 'PENDING' && (
                                                <>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-emerald-500 hover:text-white transition-all text-slate-600 shadow-sm"
                                                        onClick={() => handleUpdateStatus(item.id, 'ACTIVE')}
                                                        disabled={isActionLoading === item.id}
                                                    >
                                                        {isActionLoading === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-rose-500 hover:text-white transition-all text-slate-600 shadow-sm"
                                                        onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                                                        disabled={isActionLoading === item.id}
                                                    >
                                                        {isActionLoading === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                                    </Button>
                                                </>
                                            )}

                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8 rounded-xl bg-white border border-slate-200 hover:bg-destructive hover:text-white transition-all text-slate-600 shadow-sm"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isActionLoading === item.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="p-5 rounded-full bg-slate-50 border border-slate-100">
                                            <Shield className="h-10 w-10 text-slate-200" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-slate-900">No verification requests</h3>
                                            <p className="text-slate-500 text-sm font-medium">Clear your filters or check back later for new applications.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                                className="h-9 px-4 rounded-xl border-slate-200 bg-white"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || isLoading}
                                className="h-9 px-4 rounded-xl border-slate-200 bg-white"
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Verification & Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-4xl p-0 border-none rounded-[32px] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
                    {selectedMember && (
                        <>
                            {/* Sticky Header */}
                            <div className="bg-slate-900 text-white p-8 relative flex flex-col md:flex-row gap-6">
                                <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-xl shrink-0">
                                    {selectedMember.profilePicture?.url ? (
                                        <Image src={selectedMember.profilePicture.url} alt={selectedMember.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                            <User className="h-12 w-12 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <BadgeCheck className="h-8 w-8 text-emerald-400" />
                                        {getStatusBadge(selectedMember.status)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-extrabold tracking-tight font-outfit">{selectedMember.name}</h2>
                                        <p className="text-slate-400 font-medium flex items-center gap-2 mt-1">
                                            {selectedMember.memberShipNumber} • Joined {new Date(selectedMember.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 blur-[100px] pointer-events-none" />
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Card className="border-none shadow-sm p-4 rounded-3xl bg-white">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Mobile</span><span className="text-sm font-bold text-slate-900">{selectedMember.mobile}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Email</span><span className="text-sm font-bold text-slate-900">{selectedMember.email}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Address</span><span className="text-xs font-medium text-slate-600 leading-relaxed">{selectedMember.address}, {selectedMember.district}, {selectedMember.state} - {selectedMember.pinCode}</span></div>
                                        </div>
                                    </Card>

                                    <Card className="border-none shadow-sm p-4 rounded-3xl bg-white">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Personal Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Guardian ({selectedMember.gurdianType})</span><span className="text-sm font-bold text-slate-900">{selectedMember.gurdianName}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">DOB & Gender</span><span className="text-sm font-bold text-slate-900">{new Date(selectedMember.dob).toLocaleDateString()} • {selectedMember.gender}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Profession</span><span className="text-sm font-bold text-slate-900">{selectedMember.profession}</span></div>
                                        </div>
                                    </Card>

                                    <Card className="border-none shadow-sm p-4 rounded-3xl bg-white">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Plan & verification</h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Selected Plan</span><span className="text-sm font-bold text-primary underline">{selectedMember.plan?.name}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Aadhaar / ID</span><span className="text-sm font-bold text-slate-900">{selectedMember.aadhaar}</span></div>
                                            <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</span><Badge className="w-fit bg-rose-50 text-rose-600 border-none rounded-md font-bold text-[10px] mt-1">{selectedMember.bloodGroup}</Badge></div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 font-outfit px-2">Verification Documents</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Identity Proof ({selectedMember.documentsType})</span>
                                            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border-2 border-slate-200 group cursor-zoom-in bg-white shadow-sm">
                                                {selectedMember.documents?.url ? (
                                                    <Image src={selectedMember.documents.url} alt="ID Proof" fill className="object-contain p-4 transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium italic">Document not found</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Payment Receipt ({selectedMember.paymentMode.replace(/_/g, " ")})</span>
                                            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border-2 border-slate-200 group cursor-zoom-in bg-white shadow-sm">
                                                {selectedMember.payment?.url ? (
                                                    <Image src={selectedMember.payment.url} alt="Receipt" fill className="object-contain p-4 transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium italic">No receipt provided</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="border-t border-slate-100 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Please review all documents carefully before verification.</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Button variant="ghost" className="rounded-2xl h-11 px-8" onClick={() => setIsDetailsOpen(false)}>Close Review</Button>
                                    {selectedMember.status === 'PENDING' && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-none rounded-2xl h-11 px-8 font-bold"
                                                onClick={() => handleUpdateStatus(selectedMember.id, 'REJECTED')}
                                                disabled={isActionLoading === selectedMember.id}
                                            >
                                                {isActionLoading === selectedMember.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Reject Application
                                            </Button>
                                            <Button
                                                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-2xl h-11 px-10 font-bold"
                                                onClick={() => handleUpdateStatus(selectedMember.id, 'ACTIVE')}
                                                disabled={isActionLoading === selectedMember.id}
                                            >
                                                {isActionLoading === selectedMember.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Verify & Activate
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
