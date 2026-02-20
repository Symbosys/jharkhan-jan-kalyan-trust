import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import {
    ArrowRight,
    BookOpen,
    Droplets,
    GraduationCap,
    HandHeart,
    Heart,
    Leaf,
    Scale,
    Shield,
    Sparkles,
    Target,
    TreePine,
    Users,
} from "lucide-react";
import Link from "next/link";

const solutions = [
    {
        title: "Education & Literacy",
        hindi: "शिक्षा एवं साक्षरता",
        description:
            "Empowering communities through free coaching centers, scholarship programs, and digital literacy workshops. We bridge the gap between potential and opportunity with quality education for every child.",
        icon: GraduationCap,
        gradient: "from-blue-500 to-indigo-600",
        bgGlow: "bg-blue-500/20",
        stats: [
            { label: "Students Supported", value: "2,500+" },
            { label: "Schools Built", value: "8" },
        ],
    },
    {
        title: "Healthcare Access",
        hindi: "स्वास्थ्य सेवा",
        description:
            "Organizing free medical camps, health awareness drives, and mobile clinics in underserved rural areas. Providing preventive care, essential medicines, and referral services to thousands.",
        icon: Heart,
        gradient: "from-rose-500 to-pink-600",
        bgGlow: "bg-rose-500/20",
        stats: [
            { label: "Camps Organized", value: "120+" },
            { label: "People Treated", value: "15,000+" },
        ],
    },
    {
        title: "Women Empowerment",
        hindi: "महिला सशक्तिकरण",
        description:
            "Building self-reliance through vocational training, self-help groups, and micro-finance support. Empowering women to become leaders, entrepreneurs, and change-makers in their communities.",
        icon: Users,
        gradient: "from-violet-500 to-purple-600",
        bgGlow: "bg-violet-500/20",
        stats: [
            { label: "Women Trained", value: "1,800+" },
            { label: "SHGs Formed", value: "45" },
        ],
    },
    {
        title: "Clean Water & Sanitation",
        hindi: "स्वच्छ जल एवं स्वच्छता",
        description:
            "Installing water purification plants, building community toilets, and running hygiene awareness programs. Ensuring every family has access to clean drinking water and proper sanitation.",
        icon: Droplets,
        gradient: "from-cyan-500 to-teal-600",
        bgGlow: "bg-cyan-500/20",
        stats: [
            { label: "Villages Covered", value: "35+" },
            { label: "Water Units", value: "12" },
        ],
    },
    {
        title: "Legal Aid & Rights",
        hindi: "कानूनी सहायता एवं अधिकार",
        description:
            "Providing free legal consultation, awareness workshops on fundamental rights, and support for land dispute resolution. Empowering the marginalized to stand up for their rights.",
        icon: Scale,
        gradient: "from-amber-500 to-orange-600",
        bgGlow: "bg-amber-500/20",
        stats: [
            { label: "Cases Supported", value: "500+" },
            { label: "Workshops Held", value: "80+" },
        ],
    },
    {
        title: "Environmental Conservation",
        hindi: "पर्यावरण संरक्षण",
        description:
            "Leading massive tree plantation drives, waste management initiatives, and eco-awareness campaigns. Building a sustainable future one sapling at a time across Jharkhand.",
        icon: TreePine,
        gradient: "from-emerald-500 to-green-600",
        bgGlow: "bg-emerald-500/20",
        stats: [
            { label: "Trees Planted", value: "50,000+" },
            { label: "Eco-Drives", value: "60+" },
        ],
    },
];

const impactNumbers = [
    { value: "10+", label: "Years of Impact" },
    { value: "50+", label: "Villages Reached" },
    { value: "25,000+", label: "Lives Touched" },
    { value: "200+", label: "Active Volunteers" },
];

export default function SolutionsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary">
            <Header />
            <main className="flex-1 relative overflow-hidden">
                {/* ── Liquid Light Background ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-[20%] w-[40vw] h-[40vw] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
                </div>

                {/* ── Hero Section ── */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                What We Do
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-8 drop-shadow-sm">
                            Our Solutions.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Comprehensive programs designed to uplift communities, empower individuals, and create lasting change across Jharkhand.
                        </p>
                    </div>
                </section>

                {/* ── Impact Numbers ── */}
                <section className="relative py-12 px-6 z-10">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {impactNumbers.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative text-center p-8 rounded-[2.5rem] bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-xl"
                                >
                                    <span className="block text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary to-purple-500 mb-2">
                                        {item.value}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Solutions Grid ── */}
                <section className="py-24 px-6 relative z-10">
                    <div className="container mx-auto">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
                                Programs That{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">
                                    Transform
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                                Each initiative is carefully crafted to address the root causes of inequality and build sustainable pathways to progress.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {solutions.map((solution, index) => (
                                <div
                                    key={index}
                                    className="group relative flex flex-col p-10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-3"
                                >
                                    {/* Glass Background */}
                                    <div className="absolute inset-0 bg-white/35 dark:bg-white/5 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2.5rem] shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500" />

                                    {/* Hover Glow */}
                                    <div
                                        className={`absolute -top-20 -right-20 w-40 h-40 ${solution.bgGlow} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Icon */}
                                        <div
                                            className={`h-16 w-16 rounded-2xl bg-linear-to-br ${solution.gradient} flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                                        >
                                            <solution.icon className="h-8 w-8" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-black text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">
                                            {solution.title}
                                        </h3>
                                        <p className="text-sm font-serif text-primary/70 mb-5">{solution.hindi}</p>

                                        {/* Description */}
                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 flex-1">
                                            {solution.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex gap-4 pt-6 border-t border-white/40 dark:border-white/10">
                                            {solution.stats.map((stat, si) => (
                                                <div key={si} className="flex-1">
                                                    <span className="block text-xl font-black text-foreground">
                                                        {stat.value}
                                                    </span>
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                                        {stat.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Approach Section ── */}
                <section className="py-24 px-6 relative z-10">
                    <div className="container mx-auto">
                        <div className="relative rounded-[3rem] p-10 md:p-20 overflow-hidden border border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-50" />

                            <div className="text-center mb-16 space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                                    Our Approach
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                                    A proven methodology that ensures sustainable, community-driven impact.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                {[
                                    {
                                        step: "01",
                                        title: "Identify",
                                        desc: "Deep community assessments to understand real needs and challenges.",
                                        icon: Target,
                                    },
                                    {
                                        step: "02",
                                        title: "Design",
                                        desc: "Co-create solutions with local stakeholders for maximum relevance.",
                                        icon: Sparkles,
                                    },
                                    {
                                        step: "03",
                                        title: "Implement",
                                        desc: "Deploy programs with trained volunteers and local partnerships.",
                                        icon: HandHeart,
                                    },
                                    {
                                        step: "04",
                                        title: "Sustain",
                                        desc: "Monitor progress and build community ownership for lasting impact.",
                                        icon: Leaf,
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="text-center group">
                                        <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <item.icon className="h-8 w-8 text-primary" />
                                            <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-lg">
                                                {item.step}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-foreground mb-2">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ── */}
                <section className="py-20 px-6 relative z-10">
                    <div className="container mx-auto max-w-4xl">
                        <div className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden text-center">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary via-purple-500 to-blue-500 opacity-90" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />

                            <div className="relative z-10 space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                    Be Part of the Solution.
                                </h2>
                                <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto">
                                    Every contribution amplifies our impact. Together, we can transform lives and build
                                    a brighter future for Jharkhand.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/member-apply"
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl shadow-black/20"
                                    >
                                        Join as Member
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    <Link
                                        href="/donors"
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 text-white border border-white/30 font-bold text-lg rounded-full hover:scale-105 hover:bg-white/20 transition-all backdrop-blur-md"
                                    >
                                        Become a Donor
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
