import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-secondary/30 via-primary/30 to-tertiary/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8 flex justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-primary/20 hover:ring-primary/40 bg-background/50 backdrop-blur-sm">
                            Join our latest initiative for community welfare.{" "}
                            <Link href="#" className="font-semibold text-secondary">
                                Read more <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-tertiary sm:text-6xl mb-6">
                        Constructing a Better Tomorrow, Together
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        At Jan Kalyan NGO, we are dedicated to empowering communities, uplifting the underprivileged, and creating sustainable change. Join us in making a difference.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="#"
                            className="rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all hover:shadow-secondary/20 hover:shadow-xl active:scale-95"
                        >
                            Join Our Mission
                        </Link>
                        <Link href="#" className="text-sm font-semibold leading-6 text-foreground flex items-center gap-1 group">
                            Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <div
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-tertiary/30 via-primary/30 to-secondary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </section>
    );
}
