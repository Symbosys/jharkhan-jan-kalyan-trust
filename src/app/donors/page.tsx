import { getAllDonars } from "@/actions/donar";
import { Header } from "@/components/client/Header";
import { DonorInfiniteList } from "@/components/client/donors/DonorInfiniteList";
import { Footer } from "@/components/server/Footer";

export default async function DonorsPage() {
    // Initial fetch: Verified only
    const options = {
        page: 1,
        limit: 12,
        status: "VERIFIED" as any
    };

    // Server action call
    const response = await getAllDonars(options);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary">
            <Header />
            <main className="flex-1 relative overflow-hidden">
                {/* ── Liquid Light Background Elements ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-[20%] w-[40vw] h-[40vw] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
                </div>

                <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32">
                    {/* Header Section */}
                    <div className="text-center mb-24 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md shadow-xl shadow-black/5 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">Our Philanthropists</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 drop-shadow-sm">
                            Our Supporters.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Gratitude to the hearts that fuel our mission. Every contribution is a ripple that becomes a wave of transformation.
                        </p>
                    </div>

                    {/* Infinite Scroll List */}
                    <div className="relative">
                        <DonorInfiniteList
                            initialData={(response?.donars || []) as any[]}
                            totalCount={response?.pagination?.total || 0}
                            fetchDonors={getAllDonars}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
