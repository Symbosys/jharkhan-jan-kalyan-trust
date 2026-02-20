import {
    Activity,
    Bell,
    Calendar,
    DollarSign,
    FileText,
    Heart,
    UserPlus,
    Users
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { DashboardDate } from "@/components/admin/DashboardDate";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    getDashboardStats,
    getDonationTrends,
    getMembershipDistribution,
    getRecentActivities
} from "@/actions/dashboard";

export default async function AdminDashboard() {
    // Opt into dynamic rendering so server actions can use new Date()
    await connection();
    const stats = await getDashboardStats();
    const donationTrends = await getDonationTrends();
    const membershipDistribution = await getMembershipDistribution();
    const recentActivities = await getRecentActivities();

    const mainStats = [
        {
            title: "Total Members",
            value: stats.memberCount.toLocaleString(),
            description: "Total active members",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            description: "Donations + Memberships",
            icon: DollarSign,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
        {
            title: "Active Events",
            value: stats.activeEvents.toString(),
            description: "Upcoming drives",
            icon: Calendar,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
        },
        {
            title: "Pending Enquiries",
            value: stats.pendingEnquiries.toString(),
            description: "Needs attention",
            icon: FileText,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-8 max-w-[1600px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-100">Control Center.</h1>
                    <DashboardDate />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, i) => (
                    <Card key={i} className="border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-white dark:bg-slate-900 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{stat.value}</div>
                            <div className="flex items-center text-[11px] mt-2">
                                <span className="text-slate-400 dark:text-slate-500 font-medium">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Details */}
            <div className="space-y-6">
                <DashboardCharts
                    donationData={donationTrends}
                    membershipData={membershipDistribution}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                            <CardHeader className="pb-3">
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest actions performed across the platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {recentActivities.map((action, i) => (
                                        <div key={i} className="flex gap-4 group cursor-pointer">
                                            <div className="relative mt-1">
                                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback className={cn("text-xs font-semibold", action.className)}>
                                                        {action.user}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {i !== recentActivities.length - 1 && (
                                                    <div className="absolute left-1/2 top-10 bottom-[-20px] w-px bg-slate-100 dark:bg-slate-800 -translate-x-1/2" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{action.title}</h4>
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{action.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{action.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 dark:bg-slate-800 text-white border-none shadow-xl shadow-slate-900/10">
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
                                <Link href="/admin/donors" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                    <Heart className="h-5 w-5 mb-2 text-rose-300" />
                                    <span className="text-xs font-medium">Donors</span>
                                </Link>
                                <Link href="/admin/payments" className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/5">
                                    <DollarSign className="h-5 w-5 mb-2 text-amber-300" />
                                    <span className="text-xs font-medium">Payments</span>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
