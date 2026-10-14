import { HeroSection } from "../components/HeroSection";
import { CategoriesSection } from "../components/CategoriesSection";
import { JourneySection } from "../components/JourneySection";
import { TeachersSection } from "../components/TeachersSection";
import { ContactSection } from "../components/ContactSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <JourneySection />
      <TeachersSection />
      <ContactSection />
    </>
  );
}
