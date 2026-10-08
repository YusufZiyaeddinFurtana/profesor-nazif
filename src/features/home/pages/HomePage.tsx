import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { TopicsSection } from "../components/TopicsSection";
import { JourneySection } from "../components/JourneySection";
import { TeachersSection } from "../components/TeachersSection";
import { ContactSection } from "../components/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <TopicsSection />
      <JourneySection />
      <TeachersSection />
      <ContactSection />
    </>
  );
}
