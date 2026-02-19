"use client";

import { useState, useEffect } from "react";
import { getAllComplaints, deleteComplaint } from "@/actions/complaint";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search,
    Trash2,
    Eye,
    Loader2,
    AlertCircle,
    Phone,
    MapPin,
    User,
    Calendar,
    FileText,
    Video,
    ExternalLink,
    MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Complaint {
    id: number;
    name: string;
    mobile: string;
    city: string;
    message: string;
    description: string;
    videoUrl: string;
    document1: any;
    document2: any;
    createdAt: Date;
    updatedAt: Date;
}

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const data = await getAllComplaints({ search });
            setComplaints(data.complaints as any);
        } catch (error) {
            console.error("Fetch complaints error:", error);
            toast.error("Failed to fetch complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchComplaints();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) return;

        setIsDeleting(id);
        try {
            const res = await deleteComplaint(id);
            if (res.success) {
                toast.success("Complaint deleted successfully");
                fetchComplaints();
            } else {
                toast.error(res.error || "Failed to delete complaint");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleViewDetail = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
                        Registered Complaints
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Review and manage grievances submitted by users.
                    </p>
                </div>
            </div>

            <Card className="border-border shadow-sm overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-border bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, mobile, city..."
                                className="pl-9 bg-background border-border placeholder:text-muted-foreground/60 focus:bg-background transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="px-3 py-1 bg-background border-border text-muted-foreground font-medium">
                                Total: {complaints.length} Records
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && complaints.length === 0 ? (
                        <div className="flex h-[400px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <AlertCircle className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No complaints found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                There are no registered complaints matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                                        <TableHead className="w-[200px] font-semibold text-foreground">User</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground">Contact</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground">City</TableHead>
                                        <TableHead className="font-semibold text-foreground">Message</TableHead>
                                        <TableHead className="w-[150px] font-semibold text-foreground text-right">Date</TableHead>
                                        <TableHead className="w-[100px] text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {complaints.map((complaint) => (
                                        <TableRow key={complaint.id} className="group hover:bg-muted/30 transition-colors border-border">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                                        {complaint.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-foreground">{complaint.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground font-medium">
                                                        <Phone className="h-3 w-3 text-primary/70" /> {complaint.mobile}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm flex items-center gap-1.5 text-muted-foreground">
                                                    <MapPin className="h-3 w-3 text-red-400 dark:text-red-500" /> {complaint.city}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                                                    {complaint.message}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-xs text-muted-foreground flex flex-col items-end gap-0.5 pr-2">
                                                    <span className="flex items-center gap-1 font-medium text-foreground/80 lowercase">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" /> {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                                                    </span>
                                                    <span>{format(new Date(complaint.createdAt), "hh:mm a")}</span>
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                        onClick={() => handleViewDetail(complaint)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        disabled={isDeleting === complaint.id}
                                                        onClick={() => handleDelete(complaint.id)}
                                                    >
                                                        {isDeleting === complaint.id ? (
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

            {/* Complaint Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-border bg-background">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold font-outfit text-foreground">Complaint Details</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Detailed information about the complaint submitted by {selectedComplaint?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedComplaint && (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 border-b border-border pb-1">
                                            <User className="h-4 w-4 text-primary" /> User Information
                                        </h4>
                                        <div className="p-3 bg-muted/40 rounded-lg space-y-2 border border-border/50">
                                            <p className="text-sm flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{selectedComplaint.name}</span></p>
                                            <p className="text-sm flex justify-between"><span className="text-muted-foreground">Mobile:</span> <span className="font-medium text-foreground">{selectedComplaint.mobile}</span></p>
                                            <p className="text-sm flex justify-between"><span className="text-muted-foreground">City:</span> <span className="font-medium text-foreground">{selectedComplaint.city}</span></p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 border-b border-border pb-1">
                                            <Calendar className="h-4 w-4 text-primary" /> Submission Date
                                        </h4>
                                        <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                            <p className="text-sm font-medium text-foreground">{format(new Date(selectedComplaint.createdAt), "EEEE, MMMM dd, yyyy 'at' hh:mm a")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 border-b border-border pb-1">
                                            <FileText className="h-4 w-4 text-primary" /> Subject / Message
                                        </h4>
                                        <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                            <p className="text-sm font-medium text-foreground leading-snug">{selectedComplaint.message}</p>
                                        </div>
                                    </div>

                                    {(selectedComplaint.document1?.url || selectedComplaint.document2?.url || selectedComplaint.videoUrl) && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 border-b border-border pb-1">
                                                <ExternalLink className="h-4 w-4 text-primary" /> Attachments
                                            </h4>
                                            <div className="p-3 bg-muted/40 rounded-lg flex flex-wrap gap-2 border border-border/50">
                                                {selectedComplaint.document1?.url && (
                                                    <Button variant="outline" size="sm" className="bg-background border-border hover:bg-muted" asChild>
                                                        <a href={selectedComplaint.document1.url} target="_blank" rel="noopener noreferrer">
                                                            <FileText className="h-3 w-3 mr-2 text-primary" /> Doc 1
                                                        </a>
                                                    </Button>
                                                )}
                                                {selectedComplaint.document2?.url && (
                                                    <Button variant="outline" size="sm" className="bg-background border-border hover:bg-muted" asChild>
                                                        <a href={selectedComplaint.document2.url} target="_blank" rel="noopener noreferrer">
                                                            <FileText className="h-3 w-3 mr-2 text-primary" /> Doc 2
                                                        </a>
                                                    </Button>
                                                )}
                                                {selectedComplaint.videoUrl && (
                                                    <Button variant="outline" size="sm" className="bg-background border-border hover:bg-muted" asChild>
                                                        <a href={selectedComplaint.videoUrl} target="_blank" rel="noopener noreferrer">
                                                            <Video className="h-3 w-3 mr-2 text-red-500" /> Video
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" /> Description
                                </h4>
                                <div className="p-4 bg-muted/40 rounded-lg border border-border/50">
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                                        {selectedComplaint.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-8 border-t border-border pt-6 gap-3">
                        <Button variant="outline" className="hover:bg-muted font-medium" onClick={() => setIsDetailOpen(false)}>
                            Close
                        </Button>
                        <Button
                            variant="destructive"
                            className="gap-2 font-medium dark:bg-red-900/80 dark:hover:bg-red-900 transition-colors"
                            onClick={() => {
                                if (selectedComplaint) {
                                    handleDelete(selectedComplaint.id);
                                    setIsDetailOpen(false);
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" /> Delete Complaint
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
