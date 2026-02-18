"use client";

import { useEffect, useState } from "react";

export function DashboardDate() {
    const [date, setDate] = useState<string>("");

    useEffect(() => {
        setDate(new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    }, []);

    return <span className="text-slate-500">{date}</span>;
}
