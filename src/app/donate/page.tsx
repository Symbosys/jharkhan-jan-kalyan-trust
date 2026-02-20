import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { DonateForm } from "@/components/client/donate/DonateForm";
import { getPaymentDetails } from "@/actions/payment";
import { Heart, GraduationCap, Stethoscope, Lightbulb, Droplets } from "lucide-react";

export const metadata = {
    title: "Donate | Jharkhand Jan Kalyan Trust",
    description:
        "Support the Jharkhand Jan Kalyan Trust with your generous donation. Every contribution helps transform lives through education, healthcare, and community empowerment.",
};

const IMPACT_ITEMS = [
    {
        icon: GraduationCap,
        amount: "₹500",
        description: "Educates a child for one month",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },
    {
        icon: Stethoscope,
        amount: "₹1,000",
        description: "Provides medical care for a family",
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
    },
    {
        icon: Lightbulb,
        amount: "₹2,500",
        description: "Sponsors a skill development workshop",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
    {
        icon: Droplets,
        amount: "₹5,000",
        description: "Brings clean water to a village for a month",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
    },
];

export default async function DonatePage() {
    const paymentDetails = await getPaymentDetails();

    const payment = paymentDetails
        ? {
            id: paymentDetails.id,
            image: paymentDetails.image,
            bankName: paymentDetails.bankName,
            accountNumber: paymentDetails.accountNumber,
            ifscCode: paymentDetails.ifscCode,
            accountHolderName: paymentDetails.accountHolderName,
        }
        : null;

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
                <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                Every Rupee Matters
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-6 drop-shadow-sm">
                            Donate Now.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Your generosity fuels our mission. Help us transform lives across Jharkhand through education, healthcare, and community empowerment.
                        </p>
                    </div>
                </section>

                {/* ── Impact Section ── */}
                <section className="relative z-10 px-6 pb-16">
                    <div className="container mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {IMPACT_ITEMS.map((item) => (
                                <div
                                    key={item.amount}
                                    className={`group relative p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                                >
                                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                                        <item.icon className={`h-5 w-5 ${item.color}`} />
                                    </div>
                                    <span className="text-2xl font-black text-foreground block">{item.amount}</span>
                                    <span className="text-xs text-muted-foreground block mt-1 leading-relaxed">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Donation Form Section ── */}
                <section className="relative z-10 py-12 pb-28 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <DonateForm paymentDetails={payment} />
                    </div>
                </section>

                {/* ── Trust Badges ── */}
                <section className="relative z-10 pb-20 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="rounded-[2.5rem] p-8 md:p-12 bg-white/20 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl text-center space-y-6 shadow-xl">
                            <h3 className="text-2xl font-black text-foreground tracking-tight">
                                Why Donate to Us?
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">🛡️</span>
                                    </div>
                                    <p className="font-bold text-foreground">100% Transparent</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Every donation is tracked and reported. View our annual audit reports.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">📜</span>
                                    </div>
                                    <p className="font-bold text-foreground">80G Tax Benefits</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Receive tax deduction certificates for all donations under Section 80G.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">🌍</span>
                                    </div>
                                    <p className="font-bold text-foreground">Real Impact</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        10+ years of on-ground work transforming communities across Jharkhand.
                                    </p>
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
