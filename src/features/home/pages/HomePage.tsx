import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { JourneySection } from "../components/JourneySection";
import { TeachersSection } from "../components/TeachersSection";
import { ContactSection } from "../components/ContactSection";
import { RecommendationsSection } from "../../recommendations/components/RecommendationsSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <RecommendationsSection home />
      <CategoriesSection />
      <JourneySection />
      <TeachersSection />
      <ContactSection />
    </>
  );
}
