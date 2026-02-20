"use client"
import { Heart } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-700">
            {/* ── Liquid Light Background Elements ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            {/* ── Center Content ── */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                {/* Stunning Loader Animation */}
                <div className="relative h-32 w-32 flex items-center justify-center">
                    {/* Pulsing outer rings */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                    <div className="absolute -inset-4 rounded-full border-2 border-primary/10 animate-[spin_3s_linear_infinite]" />
                    <div className="absolute -inset-8 rounded-full border border-primary/5 animate-[spin_5s_linear_reverse_infinite]" />

                    {/* Inner Core */}
                    <div className="relative h-24 w-24 rounded-full bg-white/40 dark:bg-white/10 border border-white/60 dark:border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-primary/5 animate-pulse" />
                        <Heart className="h-10 w-10 text-primary fill-primary animate-pulse relative z-10" />
                    </div>
                </div>

                {/* Text Indicator */}
                <div className="space-y-3 px-6">
                    <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] text-foreground uppercase opacity-80 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                        Jharkhand Jan Kalyan Trust
                    </h2>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.4em] ml-2 opacity-60">
                            Illuminating Hope for Humanity
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Progress Bar (Subtle & Modern) */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/5 overflow-hidden">
                <div className="h-full bg-linear-to-r from-primary/0 via-primary to-primary/0 w-48 animate-[loading_2s_ease-in-out_infinite]" />
            </div>

            <style jsx global>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(800%); }
                }
            `}</style>
        </div>
    );
}
