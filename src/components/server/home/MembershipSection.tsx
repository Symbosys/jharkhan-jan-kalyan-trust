import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, IdCard, UserPlus } from "lucide-react";

const steps = [
    { icon: FileText, title: "Fill the Form", description: "Complete the online membership application with your personal details." },
    { icon: IdCard, title: "Submit Documents", description: "Upload your ID proof, address document, and a recent passport photo." },
    { icon: CheckCircle2, title: "Get Verified", description: "Our team reviews and approves your application within 3–5 working days." },
    { icon: UserPlus, title: "Join the Family", description: "Receive your member ID and become part of Jharkhand's change movement." },
];

export function MembershipSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Subtle dot grid background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[28px_28px]" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-center">

                    {/* Left — Content */}
                    <div className="w-full lg:w-1/2 space-y-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <UserPlus className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Join the Movement</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight">
                                Become a <br />
                                <span className="text-primary italic">Member Today.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                                Join thousands of committed citizens who are actively shaping a better future for Jharkhand's most underserved communities. Your membership fuels real impact.
                            </p>
                        </div>

                        {/* Perks */}
                        <div className="space-y-3">
                            {["Official Member ID Card", "Access to Exclusive Events", "Monthly Impact Reports", "Voting Rights in NGO decisions", "Certificate of Membership"].map((perk) => (
                                <div key={perk} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-sm font-semibold text-foreground">{perk}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/membership/apply"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
                        >
                            Apply for Membership
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>

                    {/* Right — 4 Steps */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            {/* Connecting vertical line */}
                            <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-linear-to-b from-primary/30 via-secondary/30 to-transparent hidden sm:block" />

                            <div className="space-y-6">
                                {steps.map((step, i) => (
                                    <div key={step.title} className="group relative flex gap-6 items-start p-6 rounded-[2rem] bg-background border border-border/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-400">
                                        {/* Step Number + Icon */}
                                        <div className="shrink-0 h-14 w-14 rounded-[1.2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Step {i + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-extrabold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
