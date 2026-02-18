"use client";

import React, { useState, useEffect } from "react";
import {
    Trash2,
    Loader2,
    Search,
    Calendar,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    User,
    ShieldCheck,
    ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/actions/eventBooking";
import { getAllEvents } from "@/actions/event";

import { toast } from "sonner";

// Local Type Definition
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [eventFilter, setEventFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchEvents = async () => {
        try {
            setIsLoadingEvents(true);
            const res = await getAllEvents({ limit: 100 }); // Get all for filter
            setEvents(res.events);
        } catch (error) {
            console.error("Failed to fetch events for filter", error);
            toast.error("Failed to load events list");
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const options: any = {
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
            };
            if (statusFilter !== "ALL") options.status = statusFilter as BookingStatus;
            if (eventFilter !== "ALL") options.eventId = parseInt(eventFilter);

            const res = await getAllBookings(options);
            setBookings(res.bookings);
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, statusFilter, eventFilter, debouncedSearch]);

    const handleStatusUpdate = async (id: number, status: BookingStatus) => {
        if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
        try {
            const res = await updateBookingStatus(id, status);
            if (res.success) {
                toast.success(`Booking ${status.toLowerCase()} successfully`);
                fetchBookings();
                if (selectedBooking?.id === id) {
                    setSelectedBooking({ ...selectedBooking, status });
                }
            } else {
                toast.error(res.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this booking record?")) return;
        try {
            const res = await deleteBooking(id);
            if (res.success) {
                toast.success("Booking record deleted");
                fetchBookings();
                setIsDetailsOpen(false);
            } else {
                toast.error(res.error || "Failed to delete booking");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case 'CONFIRMED':
                return <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 rounded-xl text-[10px] font-black uppercase tracking-wider h-7 flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> CONFIRMED</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-red-50 text-red-600 border-none px-3 rounded-xl text-[10px] font-black uppercase tracking-wider h-7 flex items-center gap-1.5"><XCircle className="h-3 w-3" /> REJECTED</Badge>;
            default:
                return <Badge className="bg-amber-50 text-amber-600 border-none px-3 rounded-xl text-[10px] font-black uppercase tracking-wider h-7 flex items-center gap-1.5"><Clock className="h-3 w-3" /> PENDING</Badge>;
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Event Bookings</h1>
                    <p className="text-slate-500 text-sm font-medium">Monitor and manage attendee registrations for NGO events.</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ongoing Bookings</p>
                        <p className="text-2xl font-black text-slate-900">{totalItems}</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100" />
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary">
                        <ArrowUpRight className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                        <Input
                            placeholder="Search attendee by name, email, city..."
                            className="pl-12 h-12 bg-slate-50 border-slate-100 focus:bg-white focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Select value={eventFilter} onValueChange={v => { setEventFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20 shadow-none">
                                <SelectValue placeholder="All Events" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                <SelectItem value="ALL">All Events</SelectItem>
                                {events.map(ev => (
                                    <SelectItem key={ev.id} value={ev.id.toString()}>{ev.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-3">
                        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary/20 shadow-none">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending Approval</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed Entry</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-end">
                        <Button
                            variant="ghost" className="h-12 w-full rounded-2xl border border-slate-100 hover:bg-slate-50 text-slate-400 font-bold cursor-pointer"
                            onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); setEventFilter("ALL"); setCurrentPage(1); }}
                        >
                            <Filter className="h-4 w-4 mr-2" /> Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[80px]">Ref</TableHead>
                            <TableHead>Attendee Information</TableHead>
                            <TableHead>Event Assignment</TableHead>
                            <TableHead>Location</TableHead>
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
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">Retrieving registrations...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : bookings.length > 0 ? (
                            bookings.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 hover:bg-slate-50/50 transition-all">
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-mono text-[10px] font-black text-slate-400">
                                            #{item.id.toString().padStart(3, '0')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 flex items-center gap-2">
                                                    {item.name}
                                                    {item.isTeamMember && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                                                </span>
                                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {item.mobile}</span>
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {item.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-700 text-xs leading-tight">{item.event?.title}</span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(item.event?.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 italic">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {item.city}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 border-slate-100 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all shadow-none group/btn"
                                                onClick={() => { setSelectedBooking(item); setIsDetailsOpen(true); }}
                                            >
                                                <Eye className="h-5 w-5 text-slate-400 group-hover/btn:text-primary transition-colors" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 border-slate-100 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-none group/btn"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="h-5 w-5 text-slate-400 group-hover/btn:text-destructive transition-colors" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="p-6 rounded-full bg-slate-50 border border-slate-100"><Filter className="h-12 w-12 text-slate-100" /></div>
                                        <p className="text-slate-400 font-medium italic">No registrations found matching your criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Showing {bookings.length} of {totalItems} Bookings</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-10 px-6 rounded-xl border-slate-200 bg-white shadow-none font-bold">
                                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-10 px-6 rounded-xl border-slate-200 bg-white shadow-none font-bold">
                                Next <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Booking Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 border-none rounded-[40px] shadow-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedBooking && (
                        <>
                            {/* Modal Header */}
                            <div className="bg-slate-50 border-b border-slate-100 p-10 flex items-center gap-6 shrink-0">
                                <div className="h-16 w-16 rounded-[1.2rem] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <User className="h-8 w-8" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-2xl font-black font-outfit text-slate-900">{selectedBooking.name}</h2>
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedBooking.isTeamMember && <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black tracking-widest">TEAM MEMBER</Badge>}
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Registration ID: #{selectedBooking.id.toString().padStart(6, '0')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Modal Body */}
                            <div className="flex-1 overflow-y-auto bg-white min-h-0">
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Contact Details</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center"><Phone className="h-4 w-4 text-slate-400" /></div>
                                                    <span className="text-sm font-bold text-slate-700">{selectedBooking.mobile}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center"><Mail className="h-4 w-4 text-slate-400" /></div>
                                                    <span className="text-sm font-bold text-slate-700">{selectedBooking.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-slate-400" /></div>
                                                    <span className="text-sm font-bold text-slate-700">{selectedBooking.city}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Event Details</h4>
                                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                                <p className="text-xs font-black text-slate-900 leading-tight">{selectedBooking.event?.title}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(selectedBooking.event?.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedBooking.memberShipNumber && (
                                        <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-primary" /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest leading-none">Membership Holder</p>
                                                    <p className="text-sm font-black text-primary mt-1">{selectedBooking.memberShipNumber}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-primary uppercase border border-primary/10 tracking-widest">VERIFIED ACCOUNT</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                                        disabled={selectedBooking.status === 'CONFIRMED'}
                                        className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black tracking-wide shadow-xl shadow-emerald-200 cursor-pointer"
                                    >
                                        <CheckCircle2 className="h-5 w-5 mr-3" /> CONFIRM BOOKING
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                                        disabled={selectedBooking.status === 'CANCELLED'}
                                        className="h-14 rounded-2xl bg-white border border-red-100 text-red-500 hover:bg-red-50 font-black tracking-wide cursor-pointer"
                                    >
                                        <XCircle className="h-5 w-5 mr-3" /> CANCEL ENTRY
                                    </Button>
                                </div>
                                <Button variant="ghost" className="h-12 rounded-2xl text-slate-400 font-bold cursor-pointer" onClick={() => setIsDetailsOpen(false)}>Close View</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
