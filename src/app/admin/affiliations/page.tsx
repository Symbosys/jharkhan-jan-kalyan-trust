"use client";

import { deleteAffiliation, getAllAffiliations, updateAffiliationStatus, updateAffiliationValidity } from "@/actions/affiliation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
    Building,
    Calendar,
    CheckCircle,
    Eye,
    GraduationCap,
    Handshake,
    Loader2,
    Mail,
    Phone,
    Search,
    ShieldAlert,
    Trash2,
    User,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface Affiliation {
    id: number;
    AffiliationNumber: string;
    organizationName: string;
    registrationNumber: string | null;
    establishedYear: number;
    organizationType: string;
    address: string;
    city: string;
    mobile: string;
    email: string;
    website: string | null;
    directorName: string;
    directorMobile: string;
    directorEmail: string | null;
    documents: { url: string; public_id: string } | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    validFrom: Date | null;
    validTill: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function AffiliationsPage() {
    const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedAffiliation, setSelectedAffiliation] = useState<Affiliation | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [validFromDate, setValidFromDate] = useState<string>("");
    const [validTillDate, setValidTillDate] = useState<string>("");

    const fetchAffiliations = async () => {
        setLoading(true);
        try {
            const data = await getAllAffiliations({ 
                search,
                status: statusFilter !== "ALL" ? statusFilter as any : undefined
            });
            setAffiliations(data.data?.affiliations as any);
        } catch (error) {
            console.error("Fetch affiliations error:", error);
            toast.error("Failed to fetch affiliations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAffiliations();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this affiliation request?")) return;

        setIsDeleting(id);
        try {
            const res = await deleteAffiliation(id);
            if (res.success) {
                toast.success("Affiliation request deleted successfully");
                fetchAffiliations();
            } else {
                toast.error(res.error || "Failed to delete affiliation request");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleViewDetail = (affiliation: Affiliation) => {
        setSelectedAffiliation(affiliation);
        // Initialize validity dates if they exist
        if (affiliation.validFrom) {
            setValidFromDate(format(new Date(affiliation.validFrom), "yyyy-MM-dd"));
        } else {
            setValidFromDate("");
        }
        if (affiliation.validTill) {
            setValidTillDate(format(new Date(affiliation.validTill), "yyyy-MM-dd"));
        } else {
            setValidTillDate("");
        }
        setIsDetailOpen(true);
    };

    const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this affiliation request?`)) return;

        setIsUpdating(id);
        try {
            const res = await updateAffiliationStatus(id, status);
            if (res.success) {
                toast.success(`Affiliation request ${status.toLowerCase()} successfully`);
                fetchAffiliations();
                setIsDetailOpen(false);
            } else {
                toast.error(res.error || `Failed to ${status.toLowerCase()} affiliation request`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleValidityUpdate = async (id: number) => {
        if (!validFromDate || !validTillDate) {
            toast.error("Please select both valid from and valid till dates");
            return;
        }

        if (new Date(validFromDate) >= new Date(validTillDate)) {
            toast.error("Valid from date must be before valid till date");
            return;
        }

        setIsUpdating(id);
        try {
            const res = await updateAffiliationValidity(
                id, 
                new Date(validFromDate), 
                new Date(validTillDate)
            );
            if (res.success) {
                toast.success("Validity period updated successfully");
                fetchAffiliations();
                setIsDetailOpen(false);
            } else {
                toast.error(res.error || "Failed to update validity period");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
                        Affiliation Requests
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage organization affiliation requests and partnership applications.
                    </p>
                </div>
            </div>

            <Card className="border-border shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by org name, email, city..."
                                    className="pl-9 bg-background border-border"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select 
                                className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="px-3 py-1 bg-background font-medium text-muted-foreground border-border">
                                    {affiliations.length} Requests Found
                                </Badge>
                                {statusFilter !== "ALL" && (
                                    <Badge variant="secondary" className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50">
                                        {statusFilter} Only
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && affiliations.length === 0 ? (
                        <div className="flex h-[400px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : affiliations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Handshake className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No affiliation requests found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                No organizations have submitted affiliation requests yet or your search criteria didn't match.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                                        <TableHead className="w-[200px] font-semibold text-foreground">Organization</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground">Type</TableHead>
                                        <TableHead className="w-[200px] font-semibold text-foreground">Contact Details</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-foreground">City</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-foreground">Status</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground text-right">Submitted On</TableHead>
                                        <TableHead className="w-[150px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {affiliations.map((affiliation) => (
                                        <TableRow key={affiliation.id} className="group hover:bg-muted/30 transition-colors border-border">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                                        <Building className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-foreground block">{affiliation.organizationName}</span>
                                                        {affiliation.registrationNumber && (
                                                            <span className="text-xs text-muted-foreground">
                                                                Reg: {affiliation.registrationNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors capitalize px-2.5 py-0.5 font-medium">
                                                    {affiliation.organizationType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Mail className="h-3.5 w-3.5 text-blue-400 dark:text-blue-500" /> {affiliation.email}
                                                    </span>
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Phone className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-500" /> {affiliation.mobile}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium text-foreground">{affiliation.city}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={
                                                        affiliation.status === 'PENDING' ? 'secondary' : 
                                                        affiliation.status === 'APPROVED' ? 'default' : 'destructive'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {affiliation.status.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-sm text-foreground font-medium flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {format(new Date(affiliation.createdAt), "dd MMM, yyyy")}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground pr-5">
                                                        {format(new Date(affiliation.createdAt), "hh:mm a")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                        disabled={isUpdating === affiliation.id}
                                                        onClick={() => {
                                                            setSelectedAffiliation(affiliation);
                                                            setIsDetailOpen(true);
                                                        }}
                                                        title="Review and manage status"
                                                    >
                                                        {isUpdating === affiliation.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        onClick={() => handleViewDetail(affiliation)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        disabled={isDeleting === affiliation.id}
                                                        onClick={() => handleDelete(affiliation.id)}
                                                    >
                                                        {isDeleting === affiliation.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
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

            {/* Affiliation Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] border-border bg-background max-h-[90vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
                            <Handshake className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            Affiliation Request Details
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Request submitted on {selectedAffiliation && format(new Date(selectedAffiliation.createdAt), "MMMM dd, yyyy")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto py-4">
                        {selectedAffiliation && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Affiliation Number</p>
                                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Handshake className="h-4 w-4 text-blue-500" /> {selectedAffiliation.AffiliationNumber}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization Name</p>
                                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Building className="h-4 w-4 text-blue-500" /> {selectedAffiliation.organizationName}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                                        <Badge 
                                            variant={
                                                selectedAffiliation.status === 'PENDING' ? 'secondary' : 
                                                selectedAffiliation.status === 'APPROVED' ? 'default' : 'destructive'
                                            }
                                            className="capitalize text-sm px-3 py-1"
                                        >
                                            {selectedAffiliation.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    {selectedAffiliation.registrationNumber && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration Number</p>
                                            <p className="text-sm font-medium text-foreground">{selectedAffiliation.registrationNumber}</p>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Established Year</p>
                                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-500" /> {selectedAffiliation.establishedYear}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization Type</p>
                                        <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50">
                                            {selectedAffiliation.organizationType}
                                        </Badge>
                                    </div>
                                    {selectedAffiliation.website && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website</p>
                                            <a href={selectedAffiliation.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                                                {selectedAffiliation.website}
                                            </a>
                                        </div>
                                    )}
                                    {selectedAffiliation.validFrom && selectedAffiliation.validTill && (
                                        <div className="space-y-1 md:col-span-2">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Validity Period</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {format(new Date(selectedAffiliation.validFrom), "dd MMM yyyy")} to {format(new Date(selectedAffiliation.validTill), "dd MMM yyyy")}
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-1 md:col-span-2">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registered Address</p>
                                        <p className="text-sm font-medium text-foreground">{selectedAffiliation.address}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</p>
                                        <p className="text-sm font-medium text-foreground">{selectedAffiliation.city}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization Contact</p>
                                        <div className="space-y-1">
                                            <p className="text-sm flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-emerald-500" /> {selectedAffiliation.mobile}
                                            </p>
                                            <p className="text-sm flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-500" /> {selectedAffiliation.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Director/Representative</p>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">{selectedAffiliation.directorName}</p>
                                            <p className="text-sm flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-emerald-500" /> {selectedAffiliation.directorMobile}
                                            </p>
                                            {selectedAffiliation.directorEmail && (
                                                <p className="text-sm flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-blue-500" /> {selectedAffiliation.directorEmail}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {selectedAffiliation.documents && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uploaded Documents</p>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-muted-foreground">Supporting Documents</p>
                                                <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-border">
                                                    {selectedAffiliation.documents.url.match(/\.(pdf|doc|docx)$/i) ? (
                                                        <div className="h-full w-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">PDF/DOC</span>
                                                        </div>
                                                    ) : (
                                                        <Image
                                                            src={selectedAffiliation.documents.url}
                                                            alt="Supporting documents"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <a 
                                                    href={selectedAffiliation.documents.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4 pt-4 border-t border-border">
                                    <h4 className="font-semibold text-foreground">Manage Status</h4>
                                    <div className="flex gap-2">
                                        {selectedAffiliation.status !== 'APPROVED' && (
                                            <Button
                                                variant="default"
                                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                                disabled={isUpdating === selectedAffiliation.id}
                                                onClick={() => handleStatusUpdate(selectedAffiliation.id, 'APPROVED')}
                                            >
                                                {isUpdating === selectedAffiliation.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4" />
                                                )}
                                                Approve Request
                                            </Button>
                                        )}
                                        {selectedAffiliation.status !== 'REJECTED' && (
                                            <Button
                                                variant="destructive"
                                                className="flex-1 gap-2"
                                                disabled={isUpdating === selectedAffiliation.id}
                                                onClick={() => handleStatusUpdate(selectedAffiliation.id, 'REJECTED')}
                                            >
                                                {isUpdating === selectedAffiliation.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="h-4 w-4" />
                                                )}
                                                Reject Request
                                            </Button>
                                        )}
                                        {selectedAffiliation.status !== 'PENDING' && (
                                            <Button
                                                variant="secondary"
                                                className="flex-1 gap-2"
                                                disabled={isUpdating === selectedAffiliation.id}
                                                onClick={() => handleStatusUpdate(selectedAffiliation.id, 'PENDING')}
                                            >
                                                {isUpdating === selectedAffiliation.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShieldAlert className="h-4 w-4" />
                                                )}
                                                Set to Pending
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedAffiliation.status === 'APPROVED' && (
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <h4 className="font-semibold text-foreground">Update Validity Period</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">
                                                    Valid From
                                                </label>
                                                <input
                                                    type="date"
                                                    value={validFromDate}
                                                    onChange={(e) => setValidFromDate(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">
                                                    Valid Till
                                                </label>
                                                <input
                                                    type="date"
                                                    value={validTillDate}
                                                    onChange={(e) => setValidTillDate(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="default"
                                            className="w-full gap-2"
                                            disabled={isUpdating === selectedAffiliation.id}
                                            onClick={() => handleValidityUpdate(selectedAffiliation.id)}
                                        >
                                            {isUpdating === selectedAffiliation.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Calendar className="h-4 w-4" />
                                            )}
                                            Update Validity Period
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="shrink-0 mt-4 gap-3 sm:gap-0 border-t border-border pt-6">
                        <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsDetailOpen(false)}>
                            Close
                        </Button>
                        {selectedAffiliation && selectedAffiliation.status !== 'PENDING' && (
                            <Button
                                variant="outline"
                                className="flex-1 sm:flex-none gap-2"
                                onClick={() => {
                                    handleDelete(selectedAffiliation.id);
                                    setIsDetailOpen(false);
                                }}
                            >
                                <Trash2 className="h-4 w-4" /> Delete Request
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}