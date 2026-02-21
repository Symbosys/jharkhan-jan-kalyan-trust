import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { MembershipCardPortal } from "@/components/membership/IdCardPortal";

export default function DownloadMembershipCardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 selection:text-primary">
            <Header />

            <main className="flex-1 relative overflow-hidden">
                {/* ── Subtle Background Glow ── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[15%] w-[30vw] h-[30vw] bg-primary/8 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] bg-secondary/8 rounded-full blur-[100px]" />
                </div>

                <MembershipCardPortal />
            </main>

            <Footer />
        </div>
    );
}
