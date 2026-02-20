"use client"
import Link from "next/link";
import { Heart, ChevronDown, Menu, X, Smartphone, Globe, Briefcase, Calendar, Image as ImageIcon, Camera, Download, RefreshCw, IdCard, UserPlus, Coins, FileText, Users, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleDropdown = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    interface SubItem {
        label: string;
        href: string;
        icon?: React.ElementType;
        isNested?: boolean;
        nestedItems?: SubItem[];
    }

    interface MenuItem {
        label: string;
        href?: string;
        dropdown?: SubItem[];
    }

    const menuItems: MenuItem[] = [
        { label: "Home", href: "/" },
        {
            label: "About Us",
            dropdown: [
                { label: "Our Story", href: "/about-us" },
                { label: "Management Team", href: "/team/management-team" },
                { label: "Our Members", href: "/team/our-members" },
                { label: "List of Donors", href: "/donors" },
            ],
        },
        {
            label: "Gallery",
            dropdown: [
                { label: "Photo Gallery", href: "/gallery/photos", icon: ImageIcon },
                { label: "Press Media", href: "/gallery/press", icon: Camera },
            ],
        },
        {
            label: "Our Initiatives",
            dropdown: [
                { label: "Upcoming Events", href: "/events", icon: Calendar },
                { label: "Our Solutions", href: "/solutions", icon: Globe },
                { label: "Key Challenges", href: "/challenges", icon: Smartphone },
                { label: "Our Projects", href: "/projects", icon: Briefcase },
            ],
        },
        {
            label: "Membership",
            dropdown: [
                { label: "Apply for Membership", href: "/member-apply", icon: UserPlus },
                { label: "Download ID Card", href: "/membership/download-id", icon: IdCard },
                { label: "Renew ID Card", href: "/membership/renew", icon: RefreshCw },
            ],
        },
        {
            label: "Donations",
            dropdown: [
                { label: "Donate Now", href: "/donate", icon: Heart },
                { label: "Crowd Funding", href: "/donations/crowd-funding", icon: Coins },
                { label: "List of Donors", href: "/donors", icon: Users },
                { label: "Audit Reports", href: "/donations/audit-reports", icon: FileText },
            ],
        },
        { label: "Contact Us", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-primary to-secondary group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
                            <Heart className="h-6 w-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-tertiary leading-none">Jan Kalyan</span>
                            <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">NGO Foundation</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {menuItems.map((item) => (
                            <div key={item.label} className="relative group px-1">
                                {item.dropdown ? (
                                    <button className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-secondary/5 group-hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                                        {item.label}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href || "#"}
                                        className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-secondary/5 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        {item.label}
                                    </Link>
                                )}

                                {/* Dropdown Menu */}
                                {item.dropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl shadow-black/5 p-2 overflow-hidden ring-1 ring-black/5">
                                            {item.dropdown.map((subItem) => (
                                                <div key={subItem.label} className="relative group/nested">
                                                    {subItem.isNested ? (
                                                        <>
                                                            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left text-muted-foreground hover:text-primary hover:bg-secondary/10 rounded-xl transition-colors">
                                                                <span>{subItem.label}</span>
                                                                <ChevronDown className="h-4 w-4 -rotate-90 group-hover/nested:rotate-0 transition-transform" />
                                                            </button>
                                                            {/* Nested Dropdown (Gallery) */}
                                                            <div className="absolute left-full top-0 ml-2 w-56 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200 transform -translate-x-2 group-hover/nested:translate-x-0">
                                                                <div className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl p-2 ring-1 ring-black/5">
                                                                    {subItem.nestedItems?.map((nestedItem) => (
                                                                        <Link
                                                                            key={nestedItem.label}
                                                                            href={nestedItem.href}
                                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/10 rounded-xl transition-colors"
                                                                        >
                                                                            {nestedItem.icon && <nestedItem.icon className="h-4 w-4 text-green-500" />}
                                                                            {nestedItem.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Link
                                                            href={subItem.href}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/10 rounded-xl transition-colors"
                                                        >
                                                            {subItem.icon && <subItem.icon className="h-4 w-4 text-green-500" />}
                                                            {subItem.label}
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                            ) : (
                                <div className="h-5 w-5" />
                            )}
                        </button>
                        <Link
                            href="/donate"
                            className="flex items-center justify-center rounded-xl bg-linear-to-r from-primary to-green-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            Donate Now
                            <Heart className="ml-2 h-4 w-4 fill-white animate-pulse" />
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                            ) : (
                                <div className="h-5 w-5" />
                            )}
                        </button>
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-4">
                    <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        <div className="flex flex-col space-y-2">
                            {menuItems.map((item) => (
                                <div key={item.label} className="border-b border-border/20 last:border-0 pb-2 last:pb-0">
                                    {item.dropdown ? (
                                        <div>
                                            <button
                                                onClick={() => toggleDropdown(item.label)}
                                                className="flex w-full items-center justify-between py-3 text-base font-medium text-foreground hover:text-primary"
                                            >
                                                {item.label}
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                            {activeDropdown === item.label && (
                                                <div className="ml-4 space-y-1 border-l-2 border-primary/20 pl-4 py-2 animate-in slide-in-from-top-2">
                                                    {item.dropdown.map((subItem) => (
                                                        <div key={subItem.label}>
                                                            {subItem.isNested ? (
                                                                <div className="space-y-1">
                                                                    <div className="py-2 text-sm font-medium text-muted-foreground">{subItem.label}</div>
                                                                    <div className="ml-4 space-y-1 border-l border-border pl-4">
                                                                        {subItem.nestedItems?.map((nested) => (
                                                                            <Link
                                                                                key={nested.label}
                                                                                href={nested.href}
                                                                                className="block py-2 text-sm text-muted-foreground hover:text-primary"
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                            >
                                                                                {nested.label}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Link
                                                                    href={subItem.href}
                                                                    className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                                                    {subItem.label}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href || "#"}
                                            className="block py-3 text-base font-medium text-foreground hover:text-primary"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                <Link
                                    href="/donate"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-base font-bold text-white shadow-lg shadow-primary/25"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Donate Now
                                    <Heart className="h-5 w-5 fill-white" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
