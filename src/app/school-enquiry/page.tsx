import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { SchoolEnquiryForm } from "@/components/client/school-enquiry/SchoolEnquiryForm";
import { PaymentDetailsCard } from "@/components/client/school-enquiry/PaymentDetailsCard";
import { getPaymentDetails } from "@/actions/payment";
import { GraduationCap, BookOpen, Users, Award, IndianRupee } from "lucide-react";

export const metadata = {
    title: "School Enquiry | Jharkhand Jan Kalyan Trust",
    description:
        "Submit your school enquiry for admission support, scholarships, and educational assistance programs.",
};

const FEATURES = [
    {
        icon: BookOpen,
        title: "Quality Education",
        description: "Access to quality educational resources and support",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },
    {
        icon: Users,
        title: "Expert Guidance",
        description: "Get guidance from experienced educators",
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
    },
    {
        icon: Award,
        title: "Scholarship Support",
        description: "Information about available scholarships",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
];

export default async function SchoolEnquiryPage() {
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
                            <GraduationCap className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
                                Educational Support
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-6 drop-shadow-sm">
                            School Enquiry.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Looking for educational support? Fill out the enquiry form and our team will get back to you with guidance on admissions, scholarships, and more.
                        </p>
                    </div>
                </section>

                {/* ── Features Section ── */}
                <section className="relative z-10 px-6 pb-16">
                    <div className="container mx-auto max-w-5xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {FEATURES.map((item) => (
                                <div
                                    key={item.title}
                                    className={`group relative p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                                >
                                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                                        <item.icon className={`h-5 w-5 ${item.color}`} />
                                    </div>
                                    <span className="text-base font-black text-foreground block">{item.title}</span>
                                    <span className="text-xs text-muted-foreground block mt-1 leading-relaxed">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Payment & Enquiry Form Section ── */}
                <section className="relative z-10 py-12 pb-28 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
                            {/* ── Left Column: Payment Details Card ── */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Payment Details Card */}
                                {payment && <PaymentDetailsCard payment={payment} />}

                                {/* Fee Info */}
                                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="h-5 w-5 text-blue-600" />
                                        <h4 className="text-sm font-black text-blue-700 dark:text-blue-400">Processing Fee: ₹501</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        A processing fee of ₹501 is applicable for submitting your school enquiry. Please make the payment before filling the form.
                                    </p>
                                </div>
                            </div>

                            {/* ── Right Column: Enquiry Form ── */}
                            <div className="lg:col-span-3">
                                <SchoolEnquiryForm paymentDetails={payment} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Info Section ── */}
                <section className="relative z-10 pb-20 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="rounded-[2.5rem] p-8 md:p-12 bg-white/20 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl text-center space-y-6 shadow-xl">
                            <h3 className="text-2xl font-black text-foreground tracking-tight">
                                Need Help?
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
                                If you have any questions about the admission process, scholarships, or our educational programs, feel free to reach out to us. Our team is here to help you every step of the way.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">📞</span>
                                    </div>
                                    <p className="font-bold text-foreground">Call Us</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Mon-Sat, 9 AM - 6 PM
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">✉️</span>
                                    </div>
                                    <p className="font-bold text-foreground">Email Us</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Quick response within 24 hours
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-xl">📍</span>
                                    </div>
                                    <p className="font-bold text-foreground">Visit Us</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Our office is open for walk-ins
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
