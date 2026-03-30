"use client";

import { deleteSchoolEnquiry, getAllSchoolEnquiries, updateSchoolEnquiry } from "@/actions/schoolEnquiry";
import { upsertExamResult } from "@/actions/exam-results";
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
    BookOpen,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    GraduationCap,
    Loader2,
    Mail,
    Phone,
    Search,
    School,
    Trash2,
    User,
    XCircle,
    CreditCard,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface SchoolEnquiry {
    id: number;
    name: string;
    mobile: string;
    email: string;
    school: string;
    class: string;
    board: string;
    aadhaar: string;
    registrationNumber: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    photo: { url: string; public_id: string } | null;
    payment: { url: string; public_id: string } | null;
    examCenter?: {
        id: number;
        name: string;
        address: string;
        city: string;
        state: string;
        pinCode?: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    examResult?: {
        marks: number;
    } | null;
}

export default function SchoolEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<SchoolEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedEnquiry, setSelectedEnquiry] = useState<SchoolEnquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [marks, setMarks] = useState<string>("");
    const [isSavingMarks, setIsSavingMarks] = useState(false);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const data = await getAllSchoolEnquiries({ 
                search,
                status: statusFilter !== "ALL" ? statusFilter as any : undefined,
                page: currentPage,
                limit: itemsPerPage
            });
            setEnquiries(data.enquiries as any);
            setTotalPages(data.pagination.totalPages);
            setTotalItems(data.pagination.total);
        } catch (error) {
            console.error("Fetch school enquiries error:", error);
            toast.error("Failed to fetch school enquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEnquiries();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, statusFilter, currentPage]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this school enquiry?")) return;

        setIsDeleting(id);
        try {
            const res = await deleteSchoolEnquiry(id);
            if (res.success) {
                toast.success("School enquiry deleted successfully");
                fetchEnquiries();
            } else {
                toast.error(res.error || "Failed to delete school enquiry");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleViewDetail = (enquiry: SchoolEnquiry) => {
        setSelectedEnquiry(enquiry);
        setMarks(enquiry.examResult?.marks?.toString() || "");
        setIsDetailOpen(true);
    };

    const handleSaveMarks = async () => {
        if (!selectedEnquiry) return;
        const marksNum = parseFloat(marks);
        if (isNaN(marksNum)) {
            toast.error("Please enter a valid number for marks");
            return;
        }

        setIsSavingMarks(true);
        try {
            const res = await upsertExamResult(selectedEnquiry.id, marksNum);
            if (res.success) {
                toast.success("Marks saved successfully");
                fetchEnquiries();
                // Update selected enquiry in modal
                setSelectedEnquiry({
                    ...selectedEnquiry,
                    examResult: { marks: marksNum }
                });
            } else {
                toast.error(res.error || "Failed to save marks");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSavingMarks(null as any); // Resetting back to false requires fixing the type or just using actual boolean
            setIsSavingMarks(false);
        }
    };

    const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this registration?`)) return;

        setIsUpdating(id);
        try {
            const res = await updateSchoolEnquiry(id, { status: status as any });
            if (res.success) {
                toast.success(`Registration ${status.toLowerCase()} successfully`);
                fetchEnquiries();
            } else {
                toast.error(res.error || `Failed to ${status.toLowerCase()} registration`);
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
                        GK Competition Registrations
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage GK competition registrations and participant information.
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
                                    placeholder="Search by name, email, reg number..."
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
                                    {totalItems} Registrations Found
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
                    {loading && enquiries.length === 0 ? (
                        <div className="flex h-[400px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <GraduationCap className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No registrations found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                No participants have registered yet or your search criteria didn't match.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                                        <TableHead className="w-[150px] font-semibold text-foreground">Reg Number</TableHead>
                                        <TableHead className="w-[200px] font-semibold text-foreground">Participant</TableHead>
                                        <TableHead className="w-[200px] font-semibold text-foreground">Contact Details</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground">School Info</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-foreground">Status</TableHead>
                                        <TableHead className="w-[100px] font-semibold text-foreground">Marks</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground text-right">Submitted On</TableHead>
                                        <TableHead className="w-[150px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enquiries.map((enquiry) => (
                                        <TableRow key={enquiry.id} className="group hover:bg-muted/30 transition-colors border-border">
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-sm">
                                                    {enquiry.registrationNumber}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {enquiry.photo ? (
                                                        <div className="relative h-9 w-9 rounded-full overflow-hidden">
                                                            <Image
                                                                src={enquiry.photo.url}
                                                                alt={enquiry.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                                            {enquiry.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-foreground">{enquiry.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Mail className="h-3.5 w-3.5 text-blue-400 dark:text-blue-500" /> {enquiry.email}
                                                    </span>
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Phone className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-500" /> {enquiry.mobile}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors capitalize px-2.5 py-0.5 font-medium">
                                                        {enquiry.school}
                                                    </Badge>
                                                    <div className="flex gap-2">
                                                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                            Class {enquiry.class}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                            {enquiry.board}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={
                                                        enquiry.status === 'PENDING' ? 'secondary' : 
                                                        enquiry.status === 'APPROVED' ? 'default' : 'destructive'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {enquiry.status.toLowerCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {enquiry.examResult ? (
                                                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50">
                                                        {enquiry.examResult.marks}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Not assigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-sm text-foreground font-medium flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {format(new Date(enquiry.createdAt), "dd MMM, yyyy")}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground pr-5">
                                                        {format(new Date(enquiry.createdAt), "hh:mm a")}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    {enquiry.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                disabled={isUpdating === enquiry.id}
                                                                onClick={() => handleStatusUpdate(enquiry.id, 'APPROVED')}
                                                                title="Approve registration"
                                                            >
                                                                {isUpdating === enquiry.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                disabled={isUpdating === enquiry.id}
                                                                onClick={() => handleStatusUpdate(enquiry.id, 'REJECTED')}
                                                                title="Reject registration"
                                                            >
                                                                {isUpdating === enquiry.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        onClick={() => handleViewDetail(enquiry)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        disabled={isDeleting === enquiry.id}
                                                        onClick={() => handleDelete(enquiry.id)}
                                                    >
                                                        {isDeleting === enquiry.id ? (
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
                {totalPages > 1 && (
                    <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="text-sm text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-foreground">{totalItems}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || loading}
                                className="h-8 px-2"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Logic to show pages around current page
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            disabled={loading}
                                            className={`h-8 w-8 p-0 ${currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}`}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || loading}
                                className="h-8 px-2"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Enquiry Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] border-border bg-background max-h-[90vh] flex flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            GK Competition Registration Details
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Registration received on {selectedEnquiry && format(new Date(selectedEnquiry.createdAt), "MMMM dd, yyyy")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEnquiry && (
                        <div className="grow overflow-y-auto py-4 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registration Number</p>
                                    <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                                        {selectedEnquiry.registrationNumber}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                                    <Badge 
                                        variant={
                                            selectedEnquiry.status === 'PENDING' ? 'secondary' : 
                                            selectedEnquiry.status === 'APPROVED' ? 'default' : 'destructive'
                                        }
                                        className="capitalize text-sm px-3 py-1"
                                    >
                                        {selectedEnquiry.status.toLowerCase()}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Participant Name</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-500" /> {selectedEnquiry.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-blue-500" /> {selectedEnquiry.email}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-blue-500" /> {selectedEnquiry.mobile}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">School/Institution</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <School className="h-4 w-4 text-blue-500" /> {selectedEnquiry.school}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aadhaar Number</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {selectedEnquiry.aadhaar}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</p>
                                    <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50">
                                        <BookOpen className="h-3 w-3 mr-1.5" /> Class {selectedEnquiry.class}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Board</p>
                                    <Badge className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/50">
                                        {selectedEnquiry.board}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Center</p>
                                    {selectedEnquiry.examCenter ? (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">{selectedEnquiry.examCenter.name}</p>
                                            <p className="text-xs text-muted-foreground">{selectedEnquiry.examCenter.address}</p>
                                            <p className="text-xs text-muted-foreground">{selectedEnquiry.examCenter.city}, {selectedEnquiry.examCenter.state} {selectedEnquiry.examCenter.pinCode}</p>
                                        </div>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">
                                            Not Selected
                                        </Badge>
                                    )}
                                </div>

                                <div className="md:col-span-2 border-t border-border pt-6 mt-2">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                                                <GraduationCap className="h-4 w-4 text-emerald-500" />
                                                Exam Result Management
                                            </h3>
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-border">
                                                <div className="flex-1 max-w-[200px]">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assign Marks</p>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter marks"
                                                        value={marks}
                                                        onChange={(e) => setMarks(e.target.value)}
                                                        className="bg-background border-border"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 opacity-0">Action</p>
                                                    <Button 
                                                        onClick={handleSaveMarks}
                                                        disabled={isSavingMarks}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    >
                                                        {isSavingMarks ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Save Marks
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                {selectedEnquiry.examResult && (
                                                    <div className="flex-1 text-right">
                                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Score</p>
                                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                            {selectedEnquiry.examResult.marks}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {(selectedEnquiry.photo || selectedEnquiry.payment) && (
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uploaded Documents</p>
                                    <div className="flex gap-4">
                                        {selectedEnquiry.photo && (
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-muted-foreground">Participant Photo</p>
                                                <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-border">
                                                    <Image
                                                        src={selectedEnquiry.photo.url}
                                                        alt="Student photo"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {selectedEnquiry.payment && (
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-xs text-muted-foreground">Payment Proof</p>
                                                <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-border">
                                                    <Image
                                                        src={selectedEnquiry.payment.url}
                                                        alt="Payment proof"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-8 gap-3 sm:gap-0 border-t border-border pt-6 shrink-0">
                        <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsDetailOpen(false)}>
                            Back to List
                        </Button>
                        {selectedEnquiry && (
                            <>
                                {selectedEnquiry.status === 'PENDING' && (
                                    <div className="flex gap-2 flex-1">
                                        <Button
                                            variant="default"
                                            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                            onClick={() => {
                                                handleStatusUpdate(selectedEnquiry.id, 'APPROVED');
                                                setIsDetailOpen(false);
                                            }}
                                        >
                                            <CheckCircle className="h-4 w-4" /> Approve
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                                handleStatusUpdate(selectedEnquiry.id, 'REJECTED');
                                                setIsDetailOpen(false);
                                            }}
                                        >
                                            <XCircle className="h-4 w-4" /> Reject
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:flex-none gap-2"
                                    onClick={() => {
                                        handleDelete(selectedEnquiry.id);
                                        setIsDetailOpen(false);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" /> Delete Registration
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
