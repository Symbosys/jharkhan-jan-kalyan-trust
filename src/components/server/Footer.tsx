import { getWebSettings } from "@/actions/webSetting";
import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Heart,
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    ArrowRight
} from "lucide-react";
import { CopyrightYear } from "@/components/client/CopyrightYear";

const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/team", label: "Our Team" },
    { href: "/activities", label: "Activities" },
    { href: "/gallery", label: "Gallery" },
    { href: "/news", label: "News" },
];

const supportLinks = [
    { href: "/membership/apply", label: "Apply for Membership" },
    { href: "/donate", label: "Donate Now" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact Us" },
    { href: "/complaints", label: "File a Complaint" },
];

export async function Footer() {
    const settings = await getWebSettings().catch(() => ({} as Record<string, string>));

    const phone = settings?.phone || "+91-XXXXXXXXXX";
    const email = settings?.email || "info@jankalyantrust.org";
    const address = settings?.address || "Jharkhand, India";
    const facebook = settings?.facebook || "#";
    const instagram = settings?.instagram || "#";
    const youtube = settings?.youtube || "#";
    const twitter = settings?.twitter || "#";

    return (
        <footer className="bg-foreground text-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="relative z-10">
                {/* Top CTA Strip */}
                <div className="border-b border-white/10">
                    <div className="container mx-auto px-6 lg:px-8 py-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-black text-background tracking-tight">
                                    Ready to make a <span className="text-primary italic">difference?</span>
                                </h3>
                                <p className="text-background/50 font-medium text-sm">Join us today and be part of a movement that matters.</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/donate"
                                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all"
                                >
                                    Donate Now
                                    <Heart className="h-3.5 w-3.5 fill-white" />
                                </Link>
                                <Link
                                    href="/membership/apply"
                                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-background font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 hover:-translate-y-0.5 transition-all"
                                >
                                    Join as Member
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="container mx-auto px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                        {/* Brand Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                        <Heart className="h-5 w-5 text-white fill-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-background text-lg leading-none tracking-tight">Jan Kalyan</p>
                                        <p className="text-[10px] text-background/40 font-bold uppercase tracking-widest">Trust</p>
                                    </div>
                                </div>
                                <p className="text-background/50 text-sm font-medium leading-relaxed max-w-sm">
                                    Jharkhand Jan Kalyan Trust is a grassroots NGO dedicated to improving lives through education, healthcare, and sustainable community development.
                                </p>
                            </div>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                {[
                                    { Icon: Facebook, href: facebook, label: "Facebook" },
                                    { Icon: Instagram, href: instagram, label: "Instagram" },
                                    { Icon: Youtube, href: youtube, label: "YouTube" },
                                    { Icon: Twitter, href: twitter, label: "Twitter" },
                                ].map(({ Icon, href, label }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-background/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-2 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-background/40">Navigate</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-semibold text-background/60 hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div className="lg:col-span-3 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-background/40">Get Involved</h4>
                            <ul className="space-y-3">
                                {supportLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm font-semibold text-background/60 hover:text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-3 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-background/40">Contact</h4>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-background/30 uppercase tracking-widest mb-0.5">Helpline</p>
                                        <Link href={`tel:${phone}`} className="text-sm font-bold text-background/70 hover:text-primary transition-colors">
                                            {phone}
                                        </Link>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail className="h-4 w-4 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-background/30 uppercase tracking-widest mb-0.5">Email</p>
                                        <Link href={`mailto:${email}`} className="text-sm font-bold text-background/70 hover:text-secondary transition-colors break-all">
                                            {email}
                                        </Link>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin className="h-4 w-4 text-tertiary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-background/30 uppercase tracking-widest mb-0.5">Address</p>
                                        <p className="text-sm font-semibold text-background/70 leading-relaxed">{address}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="container mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-background/40 font-medium">
                            &copy; <CopyrightYear /> Jharkhand Jan Kalyan Trust. All rights reserved.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-background/30 font-medium">
                            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 mx-1" /> for Jharkhand
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
