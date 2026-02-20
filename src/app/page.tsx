import { Header } from "@/components/client/Header";
import { HeroSlider } from "@/components/client/home/HeroSlider";
import { AboutSection } from "@/components/server/home/AboutSection";
import { ActivitySection } from "@/components/server/home/ActivitySection";
import { BenefitsSection } from "@/components/server/home/BenefitsSection";
import { NewsSection } from "@/components/server/home/NewsSection";
import { Features } from "@/components/server/home/Features";
import { TeamSection } from "@/components/server/home/TeamSection";

import { GallerySection } from "@/components/server/home/GallerySection";
import { MembershipSection } from "@/components/server/home/MembershipSection";
import { TestimonialSection } from "@/components/server/home/TestimonialSection";
import { DonorsSection } from "@/components/server/home/DonorsSection";
import { DonateSection } from "@/components/server/home/DonateSection";
import { MapSection } from "@/components/server/home/MapSection";
import { Footer } from "@/components/server/Footer";
import { getAllSliders } from "@/actions/slider";
import { getAllDonars } from "@/actions/donar";

export default async function Home() {
  const { sliders } = await getAllSliders(1, 20);
  const { donars, pagination } = await getAllDonars({ limit: 3, status: "VERIFIED" });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-secondary/20 selection:text-secondary">
      <Header />
      <main className="flex-1">
        <HeroSlider sliders={sliders} />
        <AboutSection />
        <ActivitySection />
        <BenefitsSection />
        <NewsSection />
        <Features />
        <TeamSection />

        <GallerySection />
        <MembershipSection />
        <DonateSection donors={donars} totalDonors={pagination.total} />
        <TestimonialSection />
        <DonorsSection />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}
