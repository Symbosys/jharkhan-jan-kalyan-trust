import { Header } from "@/components/layout/Header";
// import { Hero } from "@/components/Hero";
import { HeroSlider } from "@/components/HeroSlider";
import { Features } from "@/components/Features";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-secondary/20 selection:text-secondary">
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
