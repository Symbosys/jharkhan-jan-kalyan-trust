import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { MembershipForm } from "@/components/client/membership/MembershipForm";
import { getAllMembershipPlans } from "@/actions/membershipPlan";
import { getPaymentDetails } from "@/actions/payment";

export const metadata = {
    title: "Apply for Membership | Jharkhand Jan Kalyan Trust",
    description:
        "Join the Jharkhand Jan Kalyan Trust family. Apply for membership and become a catalyst for change in your community.",
};

export default async function MemberApplyPage() {
    const [plansData, paymentDetails] = await Promise.all([
        getAllMembershipPlans({ isActive: true, limit: 50 }),
        getPaymentDetails(),
    ]);

    const plans = plansData.plans.map((p) => ({
        id: p.id,
        name: p.name,
        amount: p.amount,
        duration: p.duration,
        durationType: p.durationType,
        description: p.description,
        isActive: p.isActive,
    }));

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
                <section className="relative pt-32 pb-12 lg:pt-44 lg:pb-16 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                Become a Member
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-6 drop-shadow-sm">
                            Apply Now.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Join our family of changemakers. Fill out the form below and take the first step towards creating lasting impact.
                        </p>
                    </div>
                </section>

                {/* ── Form Section ── */}
                <section className="relative py-12 pb-28 px-6 z-10">
                    <div className="container mx-auto max-w-4xl">
                        <MembershipForm plans={plans} paymentDetails={payment} />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
