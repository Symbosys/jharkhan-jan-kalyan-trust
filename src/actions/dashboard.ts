"use server";

import { prisma } from "@/config/prisma";
import { MemberShipStatus, DonarStatus } from "../../generated/prisma/client";

export interface DashboardStats {
    memberCount: number;
    totalRevenue: number;
    activeEvents: number;
    pendingEnquiries: number;
}

export interface TrendData {
    name: string;
    amount: number;
    donors: number;
}

export interface DistributionData {
    name: string;
    value: number;
}

export interface ActivityData {
    title: string;
    description: string;
    time: string;
    user: string;
    type: string;
    className: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const [memberCount, totalDonations, activeEvents, pendingEnquiries] = await Promise.all([
            prisma.memberShip.count({
                where: { status: MemberShipStatus.ACTIVE }
            }),
            prisma.donar.aggregate({
                where: { status: DonarStatus.VERIFIED },
                _sum: { amount: true }
            }),
            prisma.event.count({
                where: { date: { gte: new Date() } }
            }),
            prisma.enquiry.count()
        ]);

        // Calculate membership revenue
        const members = await prisma.memberShip.findMany({
            where: { status: MemberShipStatus.ACTIVE },
            include: { plan: true }
        });
        
        const membershipRevenue = members.reduce((sum, m) => sum + Number(m.plan?.amount || 0), 0);
        const totalRevenue = Number(totalDonations._sum.amount || 0) + membershipRevenue;

        return {
            memberCount: Number(memberCount),
            totalRevenue: Number(totalRevenue),
            activeEvents: Number(activeEvents),
            pendingEnquiries: Number(pendingEnquiries)
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            memberCount: 0,
            totalRevenue: 0,
            activeEvents: 0,
            pendingEnquiries: 0
        };
    }
}

export async function getDonationTrends(): Promise<TrendData[]> {
    try {
        const donations = await prisma.donar.findMany({
            where: {
                status: DonarStatus.VERIFIED,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), 0, 1)
                }
            },
            select: {
                amount: true,
                createdAt: true
            }
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trends: TrendData[] = months.map(month => ({ name: month, amount: 0, donors: 0 }));

        donations.forEach(donation => {
            const monthIndex = donation.createdAt.getMonth();
            trends[monthIndex].amount += Number(donation.amount);
            trends[monthIndex].donors += 1;
        });

        return trends;
    } catch (error) {
        console.error("Error fetching donation trends:", error);
        return [];
    }
}

export async function getMembershipDistribution(): Promise<DistributionData[]> {
    try {
        const distribution = await prisma.memberShip.groupBy({
            by: ['planId'],
            where: { status: MemberShipStatus.ACTIVE },
            _count: { id: true }
        });

        const plans = await prisma.memberShipPlan.findMany({
            where: { id: { in: distribution.map(d => d.planId) } }
        });

        return distribution.map(d => ({
            name: plans.find(p => p.id === d.planId)?.name || "Other",
            value: Number(d._count.id)
        }));
    } catch (error) {
        console.error("Error fetching membership distribution:", error);
        return [];
    }
}

export async function getRecentActivities(): Promise<ActivityData[]> {
    try {
        const [recentMembers, recentDonors, recentEnquiries] = await Promise.all([
            prisma.memberShip.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { plan: true }
            }),
            prisma.donar.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.enquiry.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        const activities: ActivityData[] = [
            ...recentMembers.map(m => ({
                title: "New Membership Application",
                description: `${m.name} applied for ${m.plan?.name || 'a plan'}`,
                time: formatDate(m.createdAt),
                user: (m.name || "U").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                type: "Membership",
                className: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            })),
            ...recentDonors.map(d => ({
                title: "Donation Received",
                description: `₹${Number(d.amount).toLocaleString()} received from ${d.name}`,
                time: formatDate(d.createdAt),
                user: (d.name || "D").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                type: "Finance",
                className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
            })),
            ...recentEnquiries.map(e => ({
                title: "New Enquiry",
                description: `${e.name} asked about ${e.topic || 'Inquiry'}`,
                time: formatDate(e.createdAt),
                user: (e.name || "E").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                type: "Support",
                className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
            }))
        ];

        return activities;
    } catch (error) {
        console.error("Error fetching recent activities:", error);
        return [];
    }
}

function formatDate(date: Date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}
