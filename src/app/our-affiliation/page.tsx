import { getAllAffiliations } from "@/actions/affiliation";
import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { AffiliationPortal } from "@/components/affiliation/AffiliationPortal";

export const metadata = {
    title: "Our Affiliations | Symbosys Jan Kalyan Trust",
    description: "Explore our verified partners and educational institutions working together for community welfare and developmental goals.",
};

export default async function AffiliationPage() {
    // Initial fetch for approved affiliations
    const response = await getAllAffiliations({ 
        status: 'APPROVED', 
        limit: 12 
    });

    const affiliations = response.success && response.data ? response.data.affiliations : [];
    const totalCount = response.success && response.data ? response.data.totalCount : 0;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden">
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* ── Fluid Background Lights ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-15%] left-[-15%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[140px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/10 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-[20%] w-[45vw] h-[45vw] bg-blue-400/10 rounded-full blur-[130px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                </div>

                <AffiliationPortal 
                    initialAffiliations={affiliations} 
                    initialTotal={totalCount} 
                />
            </main>

            <Footer />
        </div>
    );
}
