import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { RenewalRequestForm } from "@/components/client/membership/RenewalRequestForm";
import { getAllMembershipPlans } from "@/actions/membershipPlan";
import { getPaymentDetails } from "@/actions/payment";

export const metadata = {
    title: "Renew Membership | Jharkhand Jan Kalyan Trust",
    description: "Renew your Jharkhand Jan Kalyan Trust membership to continue supporting our community initiatives.",
};

export default async function RenewPage() {
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
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                </div>

                {/* ── Hero Section ── */}
                <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 px-6">
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                Membership Renewal
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-6 drop-shadow-sm">
                            Stay with Us.
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                            Your support is vital to our mission. Renew your membership today to continue making a difference in Jharkhand.
                        </p>
                    </div>
                </section>

                {/* ── Form Section ── */}
                <section className="relative py-12 pb-28 px-6 z-10">
                    <div className="container mx-auto">
                        <RenewalRequestForm plans={plans} paymentDetails={payment} />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
