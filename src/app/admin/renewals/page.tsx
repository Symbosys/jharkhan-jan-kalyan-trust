"use client";

import {
    getAllRenewals,
    verifyRenewal
} from "@/actions/membership-renewal";
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
    User,
    XCircle,
    FileText,
    History
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type RenewalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function RenewalsPage() {
    const [renewals, setRenewals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null);
    const [selectedRenewal, setSelectedRenewal] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [adminComment, setAdminComment] = useState("");

    // Filters and Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchRenewals = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
            };

            if (statusFilter !== "ALL") options.status = statusFilter as RenewalStatus;

            const res = await getAllRenewals(options);
            setRenewals(res.renewals);
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
        } catch (error) {
            console.error("Failed to fetch renewals", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRenewals();
    }, [currentPage, statusFilter, debouncedSearch]);

    const handleVerify = async (id: number, status: RenewalStatus) => {
        const action = status === 'APPROVED' ? 'approve' : 'reject';
        if (!confirm(`Are you sure you want to ${action} this renewal?`)) return;
        try {
            setIsActionLoading(id);
            const res = await verifyRenewal(id, status, adminComment);
            if (res.success) {
                fetchRenewals();
                setIsDetailsOpen(false);
                setAdminComment("");
            } else {
                alert(res.error || "Failed to verify renewal");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setIsActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-none px-2 rounded-lg text-[10px] font-bold">APPROVED</Badge>;
            case "PENDING":
                return <Badge className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-none px-2 rounded-lg text-[10px] font-bold">PENDING</Badge>;
            case "REJECTED":
                return <Badge className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-none px-2 rounded-lg text-[10px] font-bold">REJECTED</Badge>;
            default:
                return <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 border-none px-2 rounded-lg text-[10px] font-bold">{status}</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-outfit">Renewal Requests</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage and verify membership renewal applications.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
                    <Card className="p-3 border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pending</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{renewals.filter(r => r.status === 'PENDING').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Approved</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{renewals.filter(r => r.status === 'APPROVED').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-3 border-slate-100 dark:border-slate-800 shadow-sm hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg"><History className="h-4 w-4 text-slate-600" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Requests</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{totalItems}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by name, ID or mobile..."
                            className="pl-12 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:ring-primary/20 rounded-xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[160px] h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-transparent">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Renewals Table */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
                        <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                            <TableHead>Member</TableHead>
                            <TableHead>Membership ID</TableHead>
                            <TableHead>Target Plan</TableHead>
                            <TableHead>Payment Mode</TableHead>
                            <TableHead>Submitted On</TableHead>
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
                                        <p className="text-sm text-slate-500 font-medium italic">Fetching requests...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : renewals.length > 0 ? (
                            renewals.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-100">
                                                <Image
                                                    src={item.membership?.profilePicture?.url || "/placeholder-avatar.png"}
                                                    alt={item.membership?.name || "Member"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{item.membership?.name}</span>
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> {item.membership?.mobile}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                                            {item.membership?.memberShipNumber}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-primary">{item.plan?.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold tracking-tight">₹{item.plan?.amount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                            <CreditCard className="h-3 w-3" /> {item.paymentMode.replace(/_/g, " ")}
                                        </span>
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
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white transition-all text-slate-600 dark:text-slate-300 shadow-sm"
                                            onClick={() => { setSelectedRenewal(item); setIsDetailsOpen(true); }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <Shield className="h-10 w-10 text-slate-200" />
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No renewal requests found</h3>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading} className="h-9 px-4 rounded-xl border-slate-200">
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading} className="h-9 px-4 rounded-xl border-slate-200">
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Verification Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-4xl p-0 border-none rounded-[32px] shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-900 max-h-[95vh] w-[95vw] sm:w-full">
                    {selectedRenewal && (
                        <>
                            <div className="bg-slate-900 text-white p-8 relative flex flex-col md:flex-row gap-6 shrink-0">
                                <div className="relative h-28 w-28 rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-xl shrink-0">
                                    <Image
                                        src={selectedRenewal.membership?.profilePicture?.url || "/placeholder-avatar.png"}
                                        alt={selectedRenewal.membership?.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-extrabold tracking-tight font-outfit">{selectedRenewal.membership?.name}</h2>
                                        {getStatusBadge(selectedRenewal.status)}
                                    </div>
                                    <p className="text-slate-400 font-medium">
                                        Renewing for <span className="text-primary font-bold">{selectedRenewal.plan?.name}</span> (₹{selectedRenewal.plan?.amount})
                                    </p>
                                    <div className="flex gap-4">
                                        <Badge variant="outline" className="border-white/10 text-white/60">{selectedRenewal.membership?.memberShipNumber}</Badge>
                                        <span className="text-xs text-white/40 flex items-center gap-1"><Calendar className="h-3 w-3" /> Requested: {new Date(selectedRenewal.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50 dark:bg-slate-950/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Payment Proof</h4>
                                        <div className="relative aspect-3/4 rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-sm group cursor-zoom-in">
                                            {selectedRenewal.paymentProof?.url ? (
                                                <Image src={selectedRenewal.paymentProof.url} alt="Payment Proof" fill className="object-contain p-4 transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center italic text-slate-400 font-medium">No image available</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Verification Steps</h4>
                                            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</div>
                                                    <p className="text-sm font-medium text-slate-600">Cross-reference the payment proof with bank statements for ₹{selectedRenewal.plan?.amount}.</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</div>
                                                    <p className="text-sm font-medium text-slate-600">Verify the target plan duration ({selectedRenewal.plan?.duration} {selectedRenewal.plan?.durationType.toLowerCase()}).</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Admin Comment (Optional)</label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Add a remark for the member..."
                                                    className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-primary/20"
                                                    value={adminComment}
                                                    onChange={(e) => setAdminComment(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 bg-white p-6 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
                                <Button variant="ghost" className="rounded-2xl h-11 px-8" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                                {selectedRenewal.status === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl h-11 px-8 font-bold"
                                            onClick={() => handleVerify(selectedRenewal.id, 'REJECTED')}
                                            disabled={isActionLoading === selectedRenewal.id}
                                        >
                                            {isActionLoading === selectedRenewal.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Reject Renewal
                                        </Button>
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-2xl h-11 px-10 font-bold"
                                            onClick={() => handleVerify(selectedRenewal.id, 'APPROVED')}
                                            disabled={isActionLoading === selectedRenewal.id}
                                        >
                                            {isActionLoading === selectedRenewal.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Approve & Update
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
