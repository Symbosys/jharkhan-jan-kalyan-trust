import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { ComplaintForm } from "@/components/client/complaint/ComplaintForm";
import { ShieldAlert, Scale, Gavel, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Register Your Problem | Jharkhand Jan Kalyan Trust",
    description: "Submit your grievances and legal problems to Jharkhand Jan Kalyan Trust. We are committed to seeking justice and providing support to the common citizens of Jharkhand.",
};

const FEATURES = [
    {
        icon: Scale,
        title: "Legal Guidance",
        desc: "Expert legal advice for marginalized communities.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Gavel,
        title: "Advocacy",
        desc: "Representing your voice in administrative circles.",
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    {
        icon: ShieldCheck,
        title: "Direct Support",
        desc: "Ground-level intervention for urgent problems.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export default function RegisterComplaintPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-red-500/30 selection:text-red-600">
            <Header />
            <main className="flex-1 relative overflow-hidden">
                {/* ── Liquid Light Background ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-400/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-[20%] w-[40vw] h-[40vw] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
                </div>

                {/* ── Hero Section ── */}
                <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-24 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 backdrop-blur-md shadow-2xl shadow-red-500/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <ShieldAlert className="h-4 w-4 text-red-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                                Citizen Grievance Cell
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-8 drop-shadow-sm">
                            Justice for All.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed mb-12">
                            Is a problem bothering you or your community? Tell us your grievance. Our team of experts and legal advisors will analyze your case and provide the necessary support.
                        </p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap justify-center gap-6">
                            {FEATURES.map((f, i) => (
                                <div key={i} className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${f.bg} border border-white/40 dark:border-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700`} style={{ animationDelay: `${i * 150}ms` }}>
                                    <f.icon className={`h-5 w-5 ${f.color}`} />
                                    <div className="text-left">
                                        <h4 className="text-sm font-black text-foreground">{f.title}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Complaint Form Section ── */}
                <section className="relative z-10 py-12 pb-32 px-6">
                    <div className="container mx-auto max-w-5xl">
                        <ComplaintForm />
                    </div>
                </section>

                {/* ── Help Footer Card ── */}
                <section className="relative z-10 pb-20 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="rounded-[3rem] p-10 md:p-14 bg-linear-to-br from-red-500/5 via-white/40 to-primary/5 dark:from-red-500/10 dark:via-black/20 dark:to-primary/10 border border-white/40 dark:border-white/10 backdrop-blur-2xl text-center space-y-6 shadow-2xl">
                            <h3 className="text-3xl font-black text-foreground tracking-tight">
                                Important Notice
                            </h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                                Jharkhand Jan Kalyan Trust is a non-governmental social welfare organization. We provide legal guidance and administrative advocacy. For immediate police assistance or medical emergencies, please dial <strong className="text-foreground">100</strong> or <strong className="text-foreground">108</strong> respectively.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
