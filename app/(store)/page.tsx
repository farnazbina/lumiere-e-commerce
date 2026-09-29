import BestSellers from "@/components/home/BestSellers";
import Categories from "@/components/home/Categories";
import HeroCarousel from "@/components/home/HeroCarousel";
import LuxuryBanner from "@/components/home/LuxuryBanner";
import Testimonials from "@/components/home/Testimonials";
import StoreBenefits from "@/components/home/StoreBenefits";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <Categories />
      <BestSellers />
      <LuxuryBanner />
      <Testimonials />
      <StoreBenefits />
    </main>
  );
}
