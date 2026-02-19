"use client";

import { deleteEnquiry, getAllEnquiries } from "@/actions/enquiry";
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
    Calendar,
    Eye,
    Loader2,
    Mail,
    MessageSquare,
    Phone,
    Search,
    Tag,
    Trash2,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Enquiry {
    id: number;
    name: string;
    mobile: string;
    email: string;
    topic: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const data = await getAllEnquiries({ search });
            setEnquiries(data.enquiries as any);
        } catch (error) {
            console.error("Fetch enquiries error:", error);
            toast.error("Failed to fetch enquiries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEnquiries();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;

        setIsDeleting(id);
        try {
            const res = await deleteEnquiry(id);
            if (res.success) {
                toast.success("Enquiry deleted successfully");
                fetchEnquiries();
            } else {
                toast.error(res.error || "Failed to delete enquiry");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleViewDetail = (enquiry: Enquiry) => {
        setSelectedEnquiry(enquiry);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
                        General Enquiries
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage information requests and questions from website visitors.
                    </p>
                </div>
            </div>

            <Card className="border-border shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, topic..."
                                className="pl-9 bg-background border-border"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="px-3 py-1 bg-background font-medium text-muted-foreground border-border">
                                {enquiries.length} Enquiries Found
                            </Badge>
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
                                <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No enquiries found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                Visitors haven't submitted any questions yet or your search criteria didn't match.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                                        <TableHead className="w-[200px] font-semibold text-foreground">Visitor</TableHead>
                                        <TableHead className="w-[250px] font-semibold text-foreground">Contact Details</TableHead>
                                        <TableHead className="w-[200px] font-semibold text-foreground">Topic</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground text-right">Submitted On</TableHead>
                                        <TableHead className="w-[100px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enquiries.map((enquiry) => (
                                        <TableRow key={enquiry.id} className="group hover:bg-muted/30 transition-colors border-border">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                        {enquiry.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-foreground">{enquiry.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Mail className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-500" /> {enquiry.email}
                                                    </span>
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                                        <Phone className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-500" /> {enquiry.mobile}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors capitalize px-2.5 py-0.5 font-medium">
                                                    {enquiry.topic}
                                                </Badge>
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
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
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
            </Card>

            {/* Enquiry Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px] border-border bg-background">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
                            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            Enquiry Details
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Information request received on {selectedEnquiry && format(new Date(selectedEnquiry.createdAt), "MMMM dd, yyyy")}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEnquiry && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visitor Name</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <User className="h-4 w-4 text-indigo-500" /> {selectedEnquiry.name}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inquiry Topic</p>
                                    <Badge className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50">
                                        <Tag className="h-3 w-3 mr-1.5" /> {selectedEnquiry.topic}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-indigo-500" /> {selectedEnquiry.email}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-indigo-500" /> {selectedEnquiry.mobile}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-4">Description</p>
                                <div className="p-4 bg-muted/40 rounded-xl border border-border min-h-[120px]">
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                        {selectedEnquiry.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-8 gap-3 sm:gap-0 border-t border-border pt-6">
                        <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsDetailOpen(false)}>
                            Back to List
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 sm:flex-none gap-2 hover:bg-red-600 dark:bg-red-900/80 dark:hover:bg-red-900 transition-colors"
                            onClick={() => {
                                if (selectedEnquiry) {
                                    handleDelete(selectedEnquiry.id);
                                    setIsDetailOpen(false);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" /> Delete enquiry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
