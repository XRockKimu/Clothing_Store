// src/pages/Home.jsx
import HeroSection from "../components/HeroSection";
import RankingSection from "../components/RankingSection";
import ProductGrid from "../components/ProductGrid";
export default function Home() {
  return (
    <div>
      <HeroSection />
      <RankingSection />
      <ProductGrid />
    </div>
  );
}
