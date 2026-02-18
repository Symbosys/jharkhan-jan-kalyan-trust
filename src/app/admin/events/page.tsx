"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Loader2,
    Search,
    Calendar as CalendarIcon,
    MapPin,
    Image as ImageIcon,
    X,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    Clock,
    Video,
    LayoutGrid,
    Type,
    Heart,
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDebounce } from "@/hooks/use-debounce";
import {
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from "@/actions/event";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const eventSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.string().min(1, "Event type is required"),
    location: z.string().min(1, "Location is required"),
    image: z.string().optional(),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    date: z.date("Date is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [editingEvent, setEditingEvent] = useState<any>(null);

    // Filters & Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const [imagePreview, setImagePreview] = useState("");

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "COMMUNITY",
            location: "",
            image: "",
            videoUrl: "",
            date: undefined,
        },
    });

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const res = await getAllEvents({
                page: currentPage,
                limit: 10,
                search: debouncedSearch,
            });
            setEvents(res.events);
            setTotalPages(res.pagination.totalPages);
            setTotalItems(res.pagination.total);
        } catch (error) {
            console.error("Failed to fetch events", error);
            toast.error("Failed to load events");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentPage, debouncedSearch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                form.setValue("image", base64);
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: EventFormValues) => {
        try {
            setIsSubmitting(true);
            const payload = {
                ...values,
                date: values.date,
            };

            if (editingEvent) {
                const res = await updateEvent(editingEvent.id, {
                    ...payload,
                    image: values.image?.startsWith('data:') ? values.image : undefined,
                } as any);
                if (res.success) {
                    toast.success("Event updated successfully");
                    setIsDialogOpen(false);
                    fetchEvents();
                } else {
                    toast.error(res.error || "Failed to update event");
                }
            } else {
                const res = await createEvent(payload as any);
                if (res.success) {
                    toast.success("Event created successfully");
                    setIsDialogOpen(false);
                    fetchEvents();
                } else {
                    toast.error(res.error || "Failed to create event");
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        form.reset({
            title: event.title,
            description: event.description,
            type: event.type,
            location: event.location,
            image: event.image?.url || "",
            videoUrl: event.videoUrl || "",
            date: new Date(event.date),
        });
        setImagePreview(event.image?.url || "");
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event? This will also delete all associated bookings.")) return;
        try {
            const res = await deleteEvent(id);
            if (res.success) {
                toast.success("Event deleted successfully");
                fetchEvents();
            } else {
                toast.error(res.error || "Failed to delete event");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setEditingEvent(null);
        form.reset({
            title: "",
            description: "",
            type: "COMMUNITY",
            location: "",
            image: "",
            videoUrl: "",
            date: undefined,
        });
        setImagePreview("");
    };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">Events Management</h1>
                    <p className="text-slate-500 text-sm font-medium">Create and organize NGO events and workshops.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-2xl cursor-pointer">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0 border-none rounded-[32px] shadow-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                                    <DialogHeader className="bg-slate-50 border-b border-slate-100 p-8 shrink-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <DialogTitle className="text-2xl font-bold font-outfit text-slate-900">
                                                    {editingEvent ? "Edit Event" : "Create Event"}
                                                </DialogTitle>
                                                <DialogDescription className="text-slate-500 mt-1 font-medium">
                                                    {editingEvent ? "Update the details of your existing event." : "Plan and publish a new event for the NGO."}
                                                </DialogDescription>
                                            </div>
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <CalendarIcon className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <div className="flex-1 overflow-y-auto bg-white min-h-0">
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {/* Left Side: General Info */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-6 w-1 bg-primary rounded-full" />
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Event Identity</h4>
                                                </div>

                                                <div className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Event Title</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="e.g. Annual Charity Gala" className="h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-2xl transition-all" {...field} />
                                                                </FormControl>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Event Type / Category</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-2xl transition-all shadow-none">
                                                                            <SelectValue placeholder="Select type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-medium">
                                                                        <SelectItem value="COMMUNITY">Community</SelectItem>
                                                                        <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                                                        <SelectItem value="FUNDRAISER">Fundraiser</SelectItem>
                                                                        <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="location"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Location</FormLabel>
                                                                <div className="relative">
                                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                                    <FormControl>
                                                                        <Input placeholder="Venue name or address" className="h-12 pl-11 bg-slate-50 border-slate-100 focus:bg-white rounded-2xl transition-all" {...field} />
                                                                    </FormControl>
                                                                </div>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="date"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5 flex flex-col">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Event Date</FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "h-12 bg-slate-50 border-slate-100 focus:bg-white rounded-2xl transition-all font-medium text-left px-4",
                                                                                    !field.value && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                {field.value ? (
                                                                                    format(field.value, "PPP")
                                                                                ) : (
                                                                                    <span>Pick a date</span>
                                                                                )}
                                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value}
                                                                            onSelect={field.onChange}
                                                                            disabled={(date) =>
                                                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                                                            }
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Right Side: Media & Details */}
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-6 w-1 bg-emerald-500 rounded-full" />
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Media & Description</h4>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[11px] font-bold text-slate-500 ml-1">Cover Image</Label>
                                                        <label className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center group cursor-pointer hover:bg-slate-100 transition-all overflow-hidden">
                                                            {imagePreview ? (
                                                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                                                        <ImageIcon className="h-6 w-6 text-slate-400" />
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Upload Poster</span>
                                                                </div>
                                                            )}
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                            {imagePreview && (
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                                    <Button type="button" variant="secondary" className="h-8 rounded-xl text-[10px] font-bold uppercase" onClick={(e) => { e.preventDefault(); setImagePreview(""); form.setValue("image", ""); }}>Change Image</Button>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name="videoUrl"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Video Reference (Optional URL)</FormLabel>
                                                                <div className="relative">
                                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                                    <FormControl>
                                                                        <Input placeholder="YouTube or direct link" className="h-12 pl-11 bg-slate-50 border-slate-100 focus:bg-white rounded-2xl transition-all" {...field} />
                                                                    </FormControl>
                                                                </div>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="description"
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-1.5">
                                                                <FormLabel className="text-[11px] font-bold text-slate-500 ml-1">Description</FormLabel>
                                                                <FormControl>
                                                                    <Textarea placeholder="Tell us more about the event..." className="w-full min-h-[100px] bg-slate-50 border-slate-100 focus:bg-white rounded-2xl p-4 text-sm resize-none transition-all shadow-none" {...field} />
                                                                </FormControl>
                                                                <FormMessage className="text-[10px] font-bold ml-1" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter className="bg-slate-50 p-8 flex items-center justify-between border-t border-slate-100 shrink-0">
                                        <Button type="button" variant="ghost" className="rounded-2xl h-12 px-8 font-bold text-slate-500" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-12 font-bold shadow-xl shadow-slate-200">
                                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : editingEvent ? <Pencil className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                            {editingEvent ? "Save Changes" : "Create Event"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-all" />
                        <Input
                            placeholder="Search by title, location or type..."
                            className="pl-12 h-12 bg-slate-100/50 border-slate-200 focus-visible:bg-white focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <Button
                        variant="ghost" className="h-12 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold"
                        onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                    >
                        <Filter className="h-4 w-4 mr-2" /> Reset
                    </Button>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[100px]">Cover</TableHead>
                            <TableHead>Event Details</TableHead>
                            <TableHead>Location & Type</TableHead>
                            <TableHead>Schedules</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">Syncing event calendar...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : events.length > 0 ? (
                            events.map((item) => (
                                <TableRow key={item.id} className="group border-slate-100 hover:bg-slate-50/50 transition-all">
                                    <TableCell>
                                        <div className="relative h-14 w-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-100">
                                            {item.image?.url ? (
                                                <Image src={item.image.url} alt={item.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-200" /></div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col max-w-[300px]">
                                            <span className="font-bold text-slate-900 text-base leading-tight truncate">{item.title}</span>
                                            <span className="text-xs text-slate-500 line-clamp-1 mt-1">{item.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                                {item.location}
                                            </div>
                                            <Badge variant="outline" className="w-fit text-[10px] font-bold bg-slate-50 border-slate-200 text-slate-500 uppercase rounded-lg">
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                                                {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter ml-5">
                                                {new Date(item.date) < new Date() ? "PAST EVENT" : "UPCOMING"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 border-slate-100 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
                                                onClick={() => { setSelectedEvent(item); setIsDetailsOpen(true); }}
                                            >
                                                <Eye className="h-5 w-5 text-slate-400 group-hover/btn:text-primary transition-colors" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-400 group-hover/btn:text-white transition-colors" />
                                            </Button>
                                            <Button
                                                variant="outline" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 border-slate-100 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
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
                                <TableCell colSpan={5} className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="p-6 rounded-full bg-slate-50 border border-slate-100"><CalendarIcon className="h-12 w-12 text-slate-100" /></div>
                                        <p className="text-slate-400 font-medium italic">No events found in your schedule.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Page {currentPage} of {totalPages}</p>
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

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-4xl p-0 border-none rounded-[40px] shadow-2xl bg-white max-h-[90vh] overflow-hidden flex flex-col">
                    {selectedEvent && (
                        <>
                            {/* Header / Banner */}
                            <div className="relative h-64 w-full shrink-0 group">
                                {selectedEvent.image?.url ? (
                                    <Image src={selectedEvent.image.url} alt={selectedEvent.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                                        <ImageIcon className="h-20 w-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
                                <div className="absolute bottom-8 left-10 text-white space-y-2">
                                    <Badge className="bg-primary hover:bg-primary border-none text-white rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none h-6 flex items-center w-fit">{selectedEvent.type}</Badge>
                                    <h2 className="text-4xl font-black tracking-tight font-outfit leading-none">{selectedEvent.title}</h2>
                                </div>
                            </div>

                            {/* Scrollable Content Body */}
                            <div className="flex-1 overflow-y-auto bg-white min-h-0">
                                <div className="p-10">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">About Event</h3>
                                                <p className="text-slate-600 leading-relaxed text-lg font-medium">{selectedEvent.description}</p>
                                            </div>

                                            {selectedEvent.videoUrl && (
                                                <div className="space-y-4">
                                                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Video Reference</h3>
                                                    <a href={selectedEvent.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group">
                                                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                                            <Video className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 leading-none">Watch Event Promo</p>
                                                            <p className="text-xs font-medium text-slate-500 mt-1 truncate max-w-[200px] md:max-w-md">{selectedEvent.videoUrl}</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-4 space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Event Logistics</h3>
                                                <Card className="p-6 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-slate-50/50 space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                            <CalendarIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Date</p>
                                                            <p className="text-sm font-bold text-slate-700">{new Date(selectedEvent.date).toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                            <MapPin className="h-5 w-5 text-emerald-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Venue</p>
                                                            <p className="text-sm font-bold text-slate-700">{selectedEvent.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                            <LayoutGrid className="h-5 w-5 text-amber-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Event ID</p>
                                                            <p className="text-sm font-bold text-slate-700 font-mono">#{selectedEvent.id.toString().padStart(4, '0')}</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Engagement</h3>
                                                <Card className="p-8 rounded-[2rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-primary flex flex-col items-center text-center">
                                                    <div className="h-14 w-14 rounded-[1.5rem] bg-white/10 flex items-center justify-center mb-4">
                                                        <Plus className="h-8 w-8 text-white" />
                                                    </div>
                                                    <h4 className="text-3xl font-black text-white font-outfit leading-none">{selectedEvent._count?.eventBookings || 0}</h4>
                                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2 px-2">Confirmed Attendees</p>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <DialogFooter className="p-10 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 text-slate-400">
                                    <Clock className="h-4 w-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-tighter">Event Created: {new Date(selectedEvent.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <Button variant="ghost" className="rounded-2xl h-14 px-8 font-bold text-slate-400 hover:text-slate-600 w-full md:w-auto cursor-pointer" onClick={() => setIsDetailsOpen(false)}>Close View</Button>
                                    <div className="h-8 w-px bg-slate-200 hidden md:block" />
                                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-10 font-black tracking-wide shadow-xl shadow-slate-200 w-full md:w-auto cursor-pointer" onClick={() => { setIsDetailsOpen(false); handleEdit(selectedEvent); }}>
                                        <Pencil className="h-5 w-5 mr-3" />
                                        EDIT DETAILS
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
