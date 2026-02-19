"use client";

import { useState, useEffect } from "react";
import {
  getAllMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "@/actions/membershipPlan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const planSchema = z.object({
  name: z.string().min(2, "Name is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  duration: z.coerce.number().min(1, "Duration is required"),
  durationType: z.enum(["MONTH", "YEAR", "LIFETIME"]),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  isActive: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface MembershipPlan {
  id: number;
  name: string;
  amount: number;
  duration: number;
  durationType: "MONTH" | "YEAR" | "LIFETIME";
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function MembershipPlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      name: "",
      amount: 0,
      duration: 1,
      durationType: "MONTH",
      description: "",
      isActive: true,
    },
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getAllMembershipPlans({ search });
      setPlans(data.plans as any);
    } catch (error) {
      console.error("Fetch plans error:", error);
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search]);

  const onSubmit: SubmitHandler<PlanFormValues> = async (values) => {
    try {
      if (editingPlan) {
        const res = await updateMembershipPlan(editingPlan.id, values);
        if (res.success) {
          toast.success("Plan updated successfully");
          setIsDialogOpen(false);
          fetchPlans();
        } else {
          toast.error(res.error || "Update failed");
        }
      } else {
        const res = await createMembershipPlan(values);
        if (res.success) {
          toast.success("Plan created successfully");
          setIsDialogOpen(false);
          fetchPlans();
        } else {
          toast.error(res.error || "Creation failed");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await deleteMembershipPlan(id);
      if (res.success) {
        toast.success("Plan deleted");
        fetchPlans();
      } else {
        toast.error(res.error || "Delete failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    form.reset({
      name: plan.name,
      amount: plan.amount,
      duration: plan.duration,
      durationType: plan.durationType,
      description: plan.description,
      isActive: plan.isActive,
    });
    setIsDialogOpen(true);
  };

  const formatDurationType = (type: string, count: number) => {
    const lower = type.toLowerCase();
    return count > 1 ? `${lower}s` : lower;
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
            Membership Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Design and manage subscription tiers for your members.
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingPlan(null);
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Plan" : "Create Plan"}
              </DialogTitle>
              <DialogDescription>
                Set up the pricing and duration for your membership tier.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Diamond Member" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel className="mb-2">Status</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2 h-10">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span className="text-sm text-muted-foreground">
                              {field.value ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="durationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MONTH">Month(s)</SelectItem>
                            <SelectItem value="YEAR">Year(s)</SelectItem>
                            <SelectItem value="LIFETIME">Lifetime</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control as any}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List benefits, eligibility, etc."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full">
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search plans..."
          className="pl-9 bg-background border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center bg-muted/20 border-border">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No plans found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Start by creating a new membership plan to offer subscription
            options to your users.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add your first plan
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "group border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden",
                !plan.isActive && "opacity-75 grayscale-[0.5]",
              )}
            >
              {!plan.isActive && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground border-none"
                  >
                    Inactive
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary mb-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(plan)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl font-bold font-outfit text-foreground">
                  {plan.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1.5 text-muted-foreground">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground font-outfit">
                    ₹{plan.amount}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    / {plan.duration}{" "}
                    {formatDurationType(plan.durationType, plan.duration)}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span>
                      Validity: {plan.duration}{" "}
                      {formatDurationType(plan.durationType, plan.duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {plan.isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span>Status: {plan.isActive ? "Active" : "Archived"}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-border text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all font-semibold"
                  onClick={() => handleEdit(plan)}
                >
                  Modify Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
