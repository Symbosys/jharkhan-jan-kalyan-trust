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
        slug: "community-support",
        bgColor: "bg-primary/10",
        color: "text-primary",
    },
    {
        icon: BookOpen,
        title: "Education & Scholarships",
        description: "Empowering the next generation through free education, digital literacy programs, and merit-based scholarships.",
        slug: "education-scholarships",
        bgColor: "bg-secondary/10",
        color: "text-secondary",
    },
    {
        icon: HeartHandshake,
        title: "Healthcare Access",
        description: "Delivering free medical camps, maternal care, and preventive health drives directly to remote villages.",
        slug: "healthcare-access",
        bgColor: "bg-tertiary/10",
        color: "text-tertiary",
    },
    {
        icon: TreePine,
        title: "Environment & Nature",
        description: "Planting thousands of trees and safeguarding water bodies to ensure a sustainable future for Jharkhand.",
        slug: "environment-nature",
        bgColor: "bg-green-500/10",
        color: "text-green-600",
    },
    {
        icon: ShieldCheck,
        title: "Women Empowerment",
        description: "Creating safe spaces and skill-building programs that drive financial independence for women.",
        slug: "women-empowerment",
        bgColor: "bg-rose-500/10",
        color: "text-rose-500",
    },
    {
        icon: Sparkles,
        title: "Rural Development",
        description: "Infrastructure, sanitation, and livelihood programs that transform villages into thriving, self-sufficient communities.",
        slug: "rural-development",
        bgColor: "bg-violet-500/10",
        color: "text-violet-500",
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
                            className={`group relative p-8 rounded-[2.5rem] ${feature.bgColor} border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between`}
                        >
                            <div className="space-y-6">
                                <div className={`h-14 w-14 rounded-2xl ${feature.bgColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground leading-tight transition-colors duration-300 group-hover:text-primary">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium pt-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Learn More Link */}
                            <Link
                                href={`/features/${feature.slug}`}
                                className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${feature.color} hover:underline underline-offset-4 transition-all group/link`}
                            >
                                Learn More
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                            </Link>

                            {/* Decorative corner element */}
                            <div className={`absolute top-0 right-0 w-24 h-24 ${feature.bgColor} rounded-bl-[4rem] opacity-60 group-hover:opacity-100 transition-all duration-500`} />
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
