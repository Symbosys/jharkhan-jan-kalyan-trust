import {
    Activity,
    BookOpen,
    TrendingUp,
    Utensils,
    Heart,
    Wind,
    Trees,
    ArrowRight,
    Users
} from "lucide-react";
import Link from "next/link";

const benefits = [
    {
        title: "स्वास्थ्य शिविर",
        englishTitle: "Health Camps",
        description: "Organizing regular medical checkups and health awareness programs for the community.",
        icon: Activity,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        title: "मुफ्त शिक्षा",
        englishTitle: "Free Education",
        description: "Providing quality education and learning resources to underprivileged children.",
        icon: BookOpen,
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        title: "समाज प्रगति",
        englishTitle: "Social Progress",
        description: "Driving community development and social empowerment initiatives at the grassroots level.",
        icon: TrendingUp,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    },
    {
        title: "मुफ्त भोजन",
        englishTitle: "Free Food",
        description: "Ensuring nutrition security through regular food distribution drives for the needy.",
        icon: Utensils,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10"
    },
    {
        title: "महिला कल्याण",
        englishTitle: "Women Welfare",
        description: "Empowering women through skill development, health support, and social advocacy.",
        icon: Heart,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10"
    },
    {
        title: "वातावरण, जल, वायु सुरक्षा",
        englishTitle: "Environment Safety",
        description: "Protecting our natural resources through water conservation and air quality initiatives.",
        icon: Wind,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10"
    },
    {
        title: "वृक्षारोपण",
        englishTitle: "Tree Plantation",
        description: "Promoting a greener future through sustainable plantation and forest preservation.",
        icon: Trees,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10"
    }
];

export function BenefitsSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/50 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                {/* Header Area */}
                <div className="max-w-3xl mb-20 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-primary" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-primary">Our Benefits</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-tertiary leading-[1.1] tracking-tight">
                        झारखंड जन कल्याण ट्रस्ट <br />
                        <span className="text-foreground italic">हमारी सुविधाएँ</span>
                    </h2>

                    <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Dedicated to serving humanity through comprehensive facilities designed to empower every citizen of Jharkhand.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-[2.5rem] bg-background border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                        >
                            <div className="space-y-6">
                                <div className={`h-14 w-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                                    <benefit.icon className={`h-7 w-7 ${benefit.color}`} />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground leading-tight transition-colors duration-300 group-hover:text-primary">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                        {benefit.englishTitle}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium pt-2">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>



                            {/* Decorative corner element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-all duration-500" />
                        </div>
                    ))}

                    {/* Join Us Card */}
                    <div className="group relative p-8 rounded-[2.5rem] bg-primary text-white shadow-xl shadow-primary/20 flex flex-col justify-between overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Users className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black leading-none">
                                    हमसे जुड़िये !
                                </h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/80">
                                    Join Our Mission
                                </p>
                                <p className="text-sm font-medium leading-relaxed pt-2">
                                    Become a part of the change. Your small step can create a massive impact.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/member-apply"
                            className="relative z-10 mt-8 py-3 bg-white text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all group-hover:gap-4"
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>
                </div>

                {/* Footer Slogan */}
                <div className="mt-24 pt-12 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Our Philosophy</p>
                            <p className="text-2xl font-black text-foreground">हमारा विश्वास</p>
                        </div>
                        <div className="h-12 w-px bg-border/60 hidden md:block" />
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-1">Your Wellbeing</p>
                            <p className="text-2xl font-black text-foreground">आपकी सुरक्षा</p>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-tertiary/10 border border-tertiary/20 rounded-full">
                        <p className="text-tertiary font-black text-xl tracking-tighter uppercase italic">
                            सुरक्षित रहिये !!
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
