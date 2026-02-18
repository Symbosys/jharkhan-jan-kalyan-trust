import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Users,
    CreditCard,
    Calendar,
    Activity,
    ArrowUpRight,
    TrendingUp,
    MoreHorizontal,
    DollarSign,
    UserPlus,
    FileText,
    Bell,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DashboardDate } from "@/components/admin/DashboardDate";

export default function AdminDashboard() {
    // Mock data for the "Activity Overview" chart
    const activityData = [45, 72, 55, 88, 62, 75, 92, 65, 78, 55, 80, 75];

    const stats = [
        {
            title: "Total Members",
            value: "1,284",
            change: "+12.5%",
            trend: "up",
            period: "last 30 days",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Total Revenue",
            value: "₹8,45,200",
            change: "+5.2%",
            trend: "up",
            period: "last 30 days",
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            title: "Active Events",
            value: "12",
            change: "3 occurring now",
            trend: "neutral",
            period: "current",
            icon: Calendar,
            color: "text-violet-600",
            bg: "bg-violet-50",
            borderColor: "border-violet-100"
        },
        {
            title: "Pending Enquiries",
            value: "42",
            change: "+8 new",
            trend: "up",
            period: "since yesterday",
            icon: FileText,
            color: "text-amber-600",
            bg: "bg-amber-50",
            borderColor: "border-amber-100"
        },
    ];

    const recentActions = [
        {
            title: "New Membership Application",
            description: "Rahul Sharma applied for Gold Membership",
            time: "2 hours ago",
            user: "RS",
            type: "Membership",
            color: "bg-blue-100 text-blue-700"
        },
        {
            title: "Donation Received",
            description: "₹5,000 received from Anita Devi",
            time: "5 hours ago",
            user: "AD",
            type: "Finance",
            color: "bg-emerald-100 text-emerald-700"
        },
        {
            title: "New Event Booking",
            description: "Booking #2024-001 connected by Vivek Kumar",
            time: "1 day ago",
            user: "VK",
            type: "Event",
            color: "bg-violet-100 text-violet-700"
        },
        {
            title: "Volunteer Enquiry",
            description: "Suresh P. asked about volunteering opportunities",
            time: "1 day ago",
            user: "SP",
            type: "Support",
            color: "bg-amber-100 text-amber-700"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 max-w-[1600px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                    <DashboardDate />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative md:w-64 hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search anything..."
                            className="pl-9 bg-white border-slate-200 focus-visible:ring-primary"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0 bg-white border-slate-200">
                        <Bell className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-lg shadow-slate-900/20">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("h-4 w-4", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <div className="flex items-center text-xs mt-1">
                                <span className={cn(
                                    "font-medium flex items-center px-1.5 py-0.5 rounded",
                                    stat.trend === "up" ? "text-emerald-700 bg-emerald-50" : "text-slate-600 bg-slate-100"
                                )}>
                                    {stat.change}
                                    {stat.trend === "up" && <TrendingUp className="h-3 w-3 ml-1" />}
                                </span>
                                <span className="text-slate-400 ml-2">{stat.period}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Chart & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Chart Section (CSS Based) */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Activity Overview</CardTitle>
                                    <CardDescription>Engagement metrics over the last 12 months</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="hidden sm:flex text-xs h-8">
                                    View Report <ArrowUpRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
                                {activityData.map((height, i) => (
                                    <div key={i} className="w-full h-full flex flex-col justify-end group cursor-pointer">
                                        <div
                                            className="w-full bg-slate-900/5 rounded-t-sm group-hover:bg-primary/20 transition-all relative"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none">
                                                {height}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-slate-400 uppercase font-medium">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions / Data Table */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions performed across the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {recentActions.map((action, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="relative mt-1">
                                            <Avatar className="h-9 w-9 border border-slate-200">
                                                <AvatarImage src="" />
                                                <AvatarFallback className={cn("text-xs font-semibold", action.color.split(" ")[1], action.color.split(" ")[0].replace("100", "50"))}>
                                                    {action.user}
                                                </AvatarFallback>
                                            </Avatar>
                                            {i !== recentActions.length - 1 && (
                                                <div className="absolute left-1/2 top-10 bottom-[-20px] w-px bg-slate-100 -translate-x-1/2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-semibold text-slate-900">{action.title}</h4>
                                                <span className="text-[11px] text-slate-400">{action.time}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-xs font-medium text-slate-500 hover:text-slate-900">
                                View Full History
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Quick Stats & Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <Card className="bg-slate-900 text-white border-none shadow-xl shadow-slate-900/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-400" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link href="/admin/members" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                <UserPlus className="h-5 w-5 mb-2 text-indigo-300" />
                                <span className="text-xs font-medium">Add Member</span>
                            </Link>
                            <Link href="/admin/events" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                <Calendar className="h-5 w-5 mb-2 text-emerald-300" />
                                <span className="text-xs font-medium">New Event</span>
                            </Link>
                            <Link href="/admin/donations" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                <DollarSign className="h-5 w-5 mb-2 text-amber-300" />
                                <span className="text-xs font-medium">Record Donation</span>
                            </Link>
                            <Link href="/admin/reports" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                <FileText className="h-5 w-5 mb-2 text-pink-300" />
                                <span className="text-xs font-medium">Reports</span>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Server Load</span>
                                    <span className="text-emerald-600 font-medium">Optimal</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[35%]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Database Storage</span>
                                    <span className="text-slate-600 font-medium">64%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[64%]" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-600">All services operational</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Mini List */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center justify-center h-10 w-10 rounded-md bg-slate-100 text-slate-600 shrink-0">
                                    <span className="text-[10px] font-bold uppercase">Feb</span>
                                    <span className="text-sm font-bold">24</span>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-slate-900">Charity Gala</h5>
                                    <p className="text-xs text-slate-500">6:00 PM • Main Hall</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center justify-center h-10 w-10 rounded-md bg-slate-100 text-slate-600 shrink-0">
                                    <span className="text-[10px] font-bold uppercase">Mar</span>
                                    <span className="text-sm font-bold">02</span>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-slate-900">Health Camp</h5>
                                    <p className="text-xs text-slate-500">9:00 AM • Sector 4</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
