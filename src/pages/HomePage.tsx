import { HeroSection } from "../components/home/HeroSection";
import { IntroSection } from "../components/home/IntroSection";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { TopicsSection } from "../components/home/TopicsSection";
import { CatalogSection } from "../components/home/CatalogSection";
import { JourneySection } from "../components/home/JourneySection";
import { TeachersSection } from "../components/home/TeachersSection";
import { AboutSection } from "../components/home/AboutSection";
import { ContactSection } from "../components/home/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <CategoriesSection />
      <TopicsSection />
      <CatalogSection />
      <JourneySection />
      <TeachersSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
