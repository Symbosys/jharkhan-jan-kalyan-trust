import {
    Users,
    BookOpen,
    HeartHandshake,
    TreePine,
    ShieldCheck,
    Sparkles,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Users,
        title: "Community Support",
        description: "Building resilient families by providing essential resources, counseling, and grassroots support systems.",
        accent: "text-primary",
        iconBg: "bg-primary/10",
        border: "hover:border-primary/30",
        glow: "group-hover:shadow-primary/10",
    },
    {
        icon: BookOpen,
        title: "Education & Scholarships",
        description: "Empowering the next generation through free education, digital literacy programs, and merit-based scholarships.",
        accent: "text-secondary",
        iconBg: "bg-secondary/10",
        border: "hover:border-secondary/30",
        glow: "group-hover:shadow-secondary/10",
    },
    {
        icon: HeartHandshake,
        title: "Healthcare Access",
        description: "Delivering free medical camps, maternal care, and preventive health drives directly to remote villages.",
        accent: "text-tertiary",
        iconBg: "bg-tertiary/10",
        border: "hover:border-tertiary/30",
        glow: "group-hover:shadow-tertiary/10",
    },
    {
        icon: TreePine,
        title: "Environment & Nature",
        description: "Planting thousands of trees and safeguarding water bodies to ensure a sustainable future for Jharkhand.",
        accent: "text-green-600",
        iconBg: "bg-green-500/10",
        border: "hover:border-green-500/30",
        glow: "group-hover:shadow-green-500/10",
    },
    {
        icon: ShieldCheck,
        title: "Women Empowerment",
        description: "Creating safe spaces and skill-building programs that drive financial independence for women.",
        accent: "text-rose-500",
        iconBg: "bg-rose-500/10",
        border: "hover:border-rose-500/30",
        glow: "group-hover:shadow-rose-500/10",
    },
    {
        icon: Sparkles,
        title: "Rural Development",
        description: "Infrastructure, sanitation, and livelihood programs that transform villages into thriving, self-sufficient communities.",
        accent: "text-violet-500",
        iconBg: "bg-violet-500/10",
        border: "hover:border-violet-500/30",
        glow: "group-hover:shadow-violet-500/10",
    },
];

const stats = [
    { value: "12k+", label: "Lives Impacted" },
    { value: "50+", label: "Villages Served" },
    { value: "15+", label: "Active Projects" },
    { value: "100%", label: "Transparent" },
];

export function Features() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-5">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">What We Do</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[1.05]">
                        Our Core <span className="text-primary italic">Focus Areas</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                        Serving humanity through six essential pillars that drive real, sustainable change across Jharkhand's most underserved regions.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap justify-center gap-px mb-20 rounded-3xl overflow-hidden border border-border bg-border">
                    {stats.map((s) => (
                        <div key={s.label} className="flex-1 min-w-[140px] bg-background px-8 py-6 text-center">
                            <p className="text-4xl font-black text-primary">{s.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className={`group relative bg-background rounded-[2rem] p-8 border border-border/60 ${feature.border} hover:shadow-2xl ${feature.glow} transition-all duration-500 hover:-translate-y-2 flex flex-col gap-6 overflow-hidden`}
                        >
                            {/* Background Decoration */}
                            <div className={`absolute -top-6 -right-6 h-24 w-24 rounded-full ${feature.iconBg} blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-700`} />

                            {/* Icon */}
                            <div className={`h-14 w-14 rounded-2xl ${feature.iconBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                                <feature.icon className={`h-7 w-7 ${feature.accent}`} />
                            </div>

                            {/* Content */}
                            <div className="space-y-3 relative z-10">
                                <h3 className={`text-xl font-extrabold text-foreground group-hover:${feature.accent} transition-colors duration-300 leading-tight tracking-tight`}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <Link
                        href="/about-us"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 group"
                    >
                        Explore Our Full Mission
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
