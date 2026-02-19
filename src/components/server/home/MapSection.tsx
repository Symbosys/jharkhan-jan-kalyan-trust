import { getWebSettings } from "@/actions/webSetting";
import { MapPin } from "lucide-react";

export async function MapSection() {
    // Try to get a map embed URL from web settings, fallback to Jharkhand
    const settings = await getWebSettings();
    const mapEmbedUrl = settings?.map_embed_url ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.5!2d85.3096!3d23.3441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDIwJzM4LjgiTiA4NcKwMTgnMzQuNiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin";

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/40 w-[90%]mx-auto">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 mx-auto">
                        <MapPin className="h-3 w-3 text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Find Us</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        Our <span className="text-primary italic">Location.</span>
                    </h2>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto">
                        Visit us at our headquarters in Jharkhand. We are always open to partners, volunteers, and well-wishers.
                    </p>
                </div>

                {/* Map Frame */}
                <div className="relative rounded-[3rem] overflow-hidden border-4 border-background shadow-2xl aspect-video max-h-[500px] w-full mx-auto">
                    <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Jharkhand Jan Kalyan Trust — Location"
                        className="w-full h-full min-h-[400px]"
                    />
                    {/* Overlay corner accent */}
                    <div className="absolute top-5 left-5 px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center gap-2 pointer-events-none">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-xs font-black text-foreground">Jharkhand Jan Kalyan Trust</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
