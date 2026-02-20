"use client";

import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

interface DashboardChartsProps {
    donationData: any[];
    membershipData: any[];
}

export function DashboardCharts({ donationData, membershipData }: DashboardChartsProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-[400px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />
                <Card className="h-[400px] border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Donation Chart */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden group">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold tracking-tight">Total Donation Overview</CardTitle>
                    <CardDescription>Donation trends and donor growth for the current year</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={donationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    formatter={(value: any, name: any) => {
                                        const val = typeof value === 'number' ? `₹${value.toLocaleString()}` : value;
                                        return [name === "Total Donation" ? val : value, name];
                                    }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    name="Total Donation"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                    animationDuration={1500}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="donors"
                                    name="Donors"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={0}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Membership Overview Chart */}
            <Card className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold tracking-tight">Membership Overview</CardTitle>
                    <CardDescription>Distribution of members across different categories</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px] w-full flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={membershipData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                        animationDuration={1500}
                                        cornerRadius={4}
                                    >
                                        {membershipData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
