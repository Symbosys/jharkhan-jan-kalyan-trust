import { Header } from "@/components/client/Header";
import { Footer } from "@/components/server/Footer";
import { ContactForm } from "@/components/client/contact/ContactForm";
import { getWebSettings } from "@/actions/webSetting";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export const metadata = {
    title: "Contact Us | Jharkhand Jan Kalyan Trust",
    description: "Get in touch with Jharkhand Jan Kalyan Trust. We are here to answer your questions and listen to your feedback.",
};

export default async function ContactPage() {
    const settings = await getWebSettings();

    // Data from webSettings as per USER instructions
    const contactInfo = {
        address: settings.address || "Kokar Chauk, Ranchi, Jharkhand",
        email: settings.email || "amitkumardss068@gmail.com",
        phone: settings.phone || "amitkumardss068@gmail.com", // Keeping as per user's data-entry if that's what's in DB
    };

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
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">Connect with Us</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/80 to-foreground/50 mb-6 drop-shadow-sm">
                            Get in Touch.
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </section>

                {/* ── Contact Section ── */}
                <section className="relative z-10 py-12 pb-32 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

                            {/* Left Column: Contact Info */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">Contact Information</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Reach out to us directly through any of these channels. Our office is open Monday to Saturday, 9:00 AM — 6:00 PM.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Address Card */}
                                    <div className="group p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-white/10 shadow-lg shadow-black/5">
                                        <div className="flex gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Location</span>
                                                <p className="text-lg font-bold text-foreground leading-tight">{contactInfo.address}</p>
                                                <p className="text-xs text-muted-foreground">Ranchi, Jharkhand</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Card */}
                                    <div className="group p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-white/10 shadow-lg shadow-black/5">
                                        <div className="flex gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Email Us</span>
                                                <p className="text-lg font-bold text-foreground leading-tight break-all">{contactInfo.email}</p>
                                                <p className="text-xs text-muted-foreground">Expect a reply in 24h</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Card */}
                                    <div className="group p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/60 dark:hover:bg-white/10 shadow-lg shadow-black/5">
                                        <div className="flex gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                                <Phone className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Call Us</span>
                                                <p className="text-lg font-bold text-foreground leading-tight">{contactInfo.phone}</p>
                                                <p className="text-xs text-muted-foreground">Available 9am to 6pm</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            {/* Right Column: Contact Form */}
                            <div className="lg:col-span-3">
                                <ContactForm />
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
