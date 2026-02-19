"use client";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "@/actions/event";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

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
        form.setValue("videoUrl", ""); // Clear video URL when image is set
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
          image: values.image?.startsWith("data:") ? values.image : undefined,
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
    const type = event.videoUrl ? "video" : "image";
    setMediaType(type);
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
    if (
      !confirm(
        "Are you sure you want to delete this event? This will also delete all associated bookings.",
      )
    )
      return;
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
    setMediaType("image");
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

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
            Events Management
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Create and organize NGO events and workshops.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6 rounded-2xl cursor-pointer text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 border-none rounded-[32px] shadow-2xl bg-background max-h-[90vh] overflow-hidden flex flex-col">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col h-full overflow-hidden"
                >
                  <DialogHeader className="bg-muted/50 border-b border-border p-5 shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <DialogTitle className="text-xl font-bold font-outfit text-foreground">
                          {editingEvent ? "Edit Event" : "Create Event"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground mt-1 font-medium">
                          {editingEvent
                            ? "Update the details of your existing event."
                            : "Plan and publish a new event for the NGO."}
                        </DialogDescription>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto bg-background min-h-0">
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Side: General Info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-6 w-1 bg-primary rounded-full" />
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">
                            Event Identity
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Event Title
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g. Annual Charity Gala"
                                    className="h-12 bg-muted/30 border-border focus:bg-background rounded-2xl transition-all"
                                    {...field}
                                  />
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
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Event Type / Category
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-12 bg-muted/30 border-border focus:bg-background rounded-2xl transition-all shadow-none">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-2xl border-border shadow-xl font-medium">
                                    <SelectItem value="COMMUNITY">
                                      Community
                                    </SelectItem>
                                    <SelectItem value="WORKSHOP">
                                      Workshop
                                    </SelectItem>
                                    <SelectItem value="FUNDRAISER">
                                      Fundraiser
                                    </SelectItem>
                                    <SelectItem value="VOLUNTEER">
                                      Volunteer
                                    </SelectItem>
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
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Location
                                </FormLabel>
                                <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <FormControl>
                                    <Input
                                      placeholder="Venue name or address"
                                      className="h-12 pl-11 bg-muted/30 border-border focus:bg-background rounded-2xl transition-all"
                                      {...field}
                                    />
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
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Event Date
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "h-12 bg-muted/30 border-border focus:bg-background rounded-2xl transition-all font-medium text-left px-4",
                                          !field.value &&
                                          "text-muted-foreground",
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
                                  <PopoverContent
                                    className="w-auto p-0 rounded-2xl border-border shadow-2xl"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date <
                                        new Date(
                                          new Date().setHours(0, 0, 0, 0),
                                        )
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
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">
                            Media & Description
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Media Type</Label>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="media-image"
                                  name="mediaType"
                                  value="image"
                                  checked={mediaType === "image"}
                                  onChange={() => {
                                    setMediaType("image");
                                    form.setValue("videoUrl", "");
                                  }}
                                  className="accent-primary h-4 w-4 cursor-pointer"
                                />
                                <Label htmlFor="media-image" className="cursor-pointer font-bold text-xs text-foreground">Upload Image</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id="media-video"
                                  name="mediaType"
                                  value="video"
                                  checked={mediaType === "video"}
                                  onChange={() => {
                                    setMediaType("video");
                                    form.setValue("image", "");
                                    setImagePreview("");
                                  }}
                                  className="accent-primary h-4 w-4 cursor-pointer"
                                />
                                <Label htmlFor="media-video" className="cursor-pointer font-bold text-xs text-foreground">Video URL</Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-muted-foreground ml-1">
                              Cover Image
                            </Label>
                            <label className={cn(
                              "relative aspect-video rounded-3xl border-2 border-dashed border-border flex items-center justify-center group transition-all overflow-hidden",
                              mediaType === "video"
                                ? "bg-muted opacity-50 cursor-not-allowed pointer-events-none"
                                : "bg-muted/30 cursor-pointer hover:bg-muted/50"
                            )}>
                              {imagePreview ? (
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="p-3 bg-background rounded-full shadow-sm">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                                    Upload Poster
                                  </span>
                                </div>
                              )}
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={mediaType === "video"}
                              />
                              {imagePreview && mediaType === "image" && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-8 rounded-xl text-[10px] font-bold uppercase"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setImagePreview("");
                                      form.setValue("image", "");
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </label>
                          </div>

                          <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Video Reference URL
                                </FormLabel>
                                <div className="relative">
                                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <FormControl>
                                    <Input
                                      placeholder="YouTube or direct link"
                                      className="h-12 pl-11 bg-muted/30 border-border focus:bg-background rounded-2xl transition-all"
                                      {...field}
                                      disabled={mediaType === "image"}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        if (e.target.value) {
                                          form.setValue("image", "");
                                          setImagePreview("");
                                        }
                                      }}
                                    />
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
                                <FormLabel className="text-[11px] font-bold text-muted-foreground ml-1">
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us more about the event..."
                                    className="w-full min-h-[100px] bg-muted/30 border-border focus:bg-background rounded-2xl p-4 text-sm resize-none transition-all shadow-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="bg-muted/50 p-4 flex items-center justify-between border-t border-border shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-xl h-10 px-6 font-bold text-muted-foreground"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-8 font-bold shadow-xl shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : editingEvent ? (
                        <Pencil className="h-4 w-4 mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
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
      <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all" />
            <Input
              placeholder="Search by title, location or type..."
              className="pl-12 h-12 bg-muted/50 border-input focus-visible:bg-background focus-visible:ring-primary/20 rounded-2xl transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            variant="ghost"
            className="h-12 px-6 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground font-bold"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
          >
            <Filter className="h-4 w-4 mr-2" /> Reset
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border shadow-sm rounded-3xl overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
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
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest italic">
                      Syncing event calendar...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : events.length > 0 ? (
              events.map((item) => (
                <TableRow
                  key={item.id}
                  className="group border-border hover:bg-muted/50 transition-all"
                >
                  <TableCell>
                    <div className="relative h-14 w-20 rounded-xl overflow-hidden border border-border shadow-sm bg-muted/50">
                      {item.videoUrl && getYoutubeId(item.videoUrl) ? (
                        <img
                          src={`https://img.youtube.com/vi/${getYoutubeId(item.videoUrl)}/mqdefault.jpg`}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      ) : item.image?.url ? (
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col max-w-[300px]">
                      <span className="font-bold text-foreground text-base leading-tight truncate">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {item.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {item.location}
                      </div>
                      <Badge
                        variant="outline"
                        className="w-fit text-[10px] font-bold bg-muted/50 border-border text-muted-foreground uppercase rounded-lg"
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tighter ml-5">
                        {new Date(item.date) < new Date()
                          ? "PAST EVENT"
                          : "UPCOMING"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-2xl bg-background border-border hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
                        onClick={() => {
                          setSelectedEvent(item);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-2xl bg-background border-border hover:bg-foreground hover:text-background transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground group-hover/btn:text-background transition-colors" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-2xl bg-background border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all shadow-none group/btn cursor-pointer md:group-hover:flex"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-5 w-5 text-muted-foreground group-hover/btn:text-destructive transition-colors" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-6 rounded-full bg-muted/50 border border-border">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-medium italic">
                      No events found in your schedule.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-muted/50 border-t border-border flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-6 rounded-xl border-border bg-background shadow-none font-bold"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="h-10 px-6 rounded-xl border-border bg-background shadow-none font-bold"
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-[24px] shadow-2xl bg-background max-h-[90vh] flex flex-col outline-none">
          {selectedEvent && (
            <>
              <DialogHeader className="px-6 py-4 border-b border-border bg-background shrink-0 flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <DialogTitle className="text-lg font-bold font-outfit text-foreground tracking-tight leading-tight">
                    {selectedEvent.title}
                  </DialogTitle>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    ID: #{selectedEvent.id}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsDetailsOpen(false)}>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto bg-muted/5">
                <div className="p-5 space-y-5">

                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-border/50 bg-black shadow-sm relative group ring-1 ring-border/50">
                    {selectedEvent.videoUrl && getYoutubeId(selectedEvent.videoUrl) ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedEvent.videoUrl)}`}
                        title={selectedEvent.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    ) : selectedEvent.image?.url ? (
                      <Image
                        src={selectedEvent.image.url}
                        alt={selectedEvent.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                        <ImageIcon className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">Location</p>
                        <p className="font-bold text-foreground text-xs leading-tight truncate">{selectedEvent.location}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">Date</p>
                        <p className="font-bold text-foreground text-xs leading-tight truncate">
                          {format(new Date(selectedEvent.date), "PPP")}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <LayoutGrid className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">Event Type</p>
                        <p className="font-bold text-foreground text-xs leading-tight truncate">{selectedEvent.type}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border shadow-sm flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">Created</p>
                        <p className="font-bold text-foreground text-xs leading-tight truncate">
                          {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-background p-4 rounded-xl border border-border shadow-sm">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      Description
                    </h4>
                    <p className="text-xs font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-4 border-t border-border bg-background shrink-0 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailsOpen(false)}
                  className="rounded-lg font-bold text-muted-foreground hover:text-foreground h-9 px-4"
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this event?")) {
                        handleDelete(selectedEvent.id);
                        setIsDetailsOpen(false);
                      }
                    }}
                    className="rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold h-9 px-4 bg-transparent shadow-none"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleEdit(selectedEvent);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg h-9 px-6 shadow-md shadow-primary/20"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
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
