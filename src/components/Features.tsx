import { Heart, Users } from "lucide-react";

export function Features() {
    return (
        <section className="py-24 bg-background/50 backdrop-blur-sm sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-secondary">Our Focus</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-tertiary sm:text-4xl">
                        Dedicated Services for the Community
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        We focus on key areas that drive sustainable development and improve the quality of life for those in need.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {[
                            {
                                name: "Community Support",
                                description: "Providing essential resources and support systems to help families thrive in challenging environments.",
                                icon: Users,
                                color: "bg-secondary",
                                shadow: "shadow-secondary/30",
                                hover: "group-hover:bg-secondary/90"
                            },
                            {
                                name: "Education & Growth",
                                description: "Empowering the next generation through educational programs, scholarships, and mentorship.",
                                icon: Heart,
                                color: "bg-primary",
                                shadow: "shadow-primary/30",
                                hover: "group-hover:bg-primary/90"
                            },
                        ].map((feature) => (
                            <div key={feature.name} className="relative pl-16 group">
                                <dt className="text-base font-semibold leading-7 text-tertiary">
                                    <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg ${feature.color} ${feature.hover} transition-colors shadow-lg ${feature.shadow}`}>
                                        <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
