"use client";

import {
    BookOpen,
    Calendar,
    CircleAlert,
    CircleHelp,
    CreditCard,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    MessageSquareQuote,
    Newspaper,
    Settings,
    RefreshCw,
    ShieldCheck,
    Trophy,
    User,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const data = {
    navMain: [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: "/admin",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    title: "Sliders",
                    url: "/admin/sliders",
                    icon: ImageIcon,
                },
                {
                    title: "News & Updates",
                    url: "/admin/news",
                    icon: Newspaper,
                },
                {
                    title: "Gallery",
                    url: "/admin/gallery",
                    icon: ImageIcon,
                },
                {
                    title: "Testimonials",
                    url: "/admin/testimonials",
                    icon: MessageSquareQuote,
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Admins",
                    url: "/admin/admins",
                    icon: ShieldCheck,
                },
                {
                    title: "Members",
                    url: "/admin/members",
                    icon: User,
                },
                {
                    title: "Renewals",
                    url: "/admin/renewals",
                    icon: RefreshCw,
                },
                {
                    title: "Team",
                    url: "/admin/team",
                    icon: Users,
                },
                {
                    title: "Donors",
                    url: "/admin/donors",
                    icon: Trophy,
                },
            ],
        },
        {
            title: "Events",
            items: [
                {
                    title: "All Events",
                    url: "/admin/events",
                    icon: Calendar,
                },
                {
                    title: "Bookings",
                    url: "/admin/bookings",
                    icon: BookOpen,
                },
                {
                    title: "Activities",
                    url: "/admin/activities",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "Finance",
            items: [
                {
                    title: "Payments",
                    url: "/admin/payments",
                    icon: CreditCard,
                },
                {
                    title: "Plans",
                    url: "/admin/plans",
                    icon: ShieldCheck,
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    title: "Complaints",
                    url: "/admin/complaints",
                    icon: CircleAlert,
                },
                {
                    title: "Enquiries",
                    url: "/admin/enquiries",
                    icon: CircleHelp,
                },
            ],
        },
        {
            title: "System",
            items: [
                {
                    title: "Settings",
                    url: "/admin/settings",
                    icon: Settings,
                },
            ],
        },
    ],
};

import { logout } from "@/actions/auth";

export function AdminSidebar({ user }: { user?: any }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-border bg-card">
            <SidebarHeader className="h-14 flex items-center px-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden border border-border/50">
                        <Image
                            src="/logo/logo.jpeg"
                            alt="Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                        <span className="font-semibold text-sm text-foreground truncate">Jharkhand Jan Kalyan Trust</span>
                        <span className="text-xs text-muted-foreground truncate">Administration</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-2">
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title} className="mb-1">
                        <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 group-data-[collapsible=icon]:hidden">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const active = pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={item.title}
                                                className={cn(
                                                    "h-9 px-2.5 rounded-md transition-all duration-200",
                                                    active
                                                        ? "bg-primary/5 text-primary"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                )}
                                            >
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    <item.icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                    <span className={cn("text-sm", active ? "font-medium" : "font-normal")}>
                                                        {item.title}
                                                    </span>
                                                    {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter className="p-3 border-t border-border space-y-3">
                <div className="flex items-center gap-3 p-1.5 rounded-lg">
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {user?.name?.slice(0, 2).toUpperCase() || "AD"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                        <span className="text-sm font-semibold text-foreground truncate">{user?.name || "Admin"}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
                    </div>
                </div>
                <form action={handleLogout} className="group-data-[collapsible=icon]:hidden">
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-950/40 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </form>
            </SidebarFooter>
        </Sidebar>
    );
}
