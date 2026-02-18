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
    ShieldCheck,
    Trophy,
    User,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-100 bg-white">
            <SidebarHeader className="h-14 flex items-center px-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        JK
                    </div>
                    <div className="flex flex-col overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                        <span className="font-semibold text-sm text-slate-900 truncate">Jan Kalyan NGO</span>
                        <span className="text-xs text-slate-500 truncate">Administration</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-2">
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title} className="mb-1">
                        <SidebarGroupLabel className="px-2 text-xs font-medium text-slate-400/80 uppercase tracking-wider mb-1 group-data-[collapsible=icon]:hidden">
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
                                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                )}
                                            >
                                                <Link href={item.url} className="flex items-center gap-3">
                                                    <item.icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
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
            <SidebarFooter className="p-3 border-t border-slate-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center w-full gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group">
                            <Avatar className="h-8 w-8 border border-slate-100">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                                <span className="text-sm font-medium text-slate-700 truncate">Admin User</span>
                                <span className="text-xs text-slate-400 truncate">admin@jankalyan.org</span>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start" sideOffset={10}>
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
