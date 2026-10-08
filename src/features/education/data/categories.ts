import type { Lesson, Program } from "../../catalog/types";
import type { CourseGroup, EducationCategory } from "../types";

export const courseGroups: CourseGroup[] = [
  {
    id: "frc-mekanik",
    categorySlug: "mechanics",
    program: "FRC",
    title: "Mekanik",
    description:
      "Robotun gövdesi, hareket sistemi ve parçaların birlikte çalışma mantığı.",
  },
  {
    id: "frc-elektronik",
    categorySlug: "electronics",
    program: "FRC",
    title: "Elektronik",
    description:
      "Güç, bağlantılar ve sensörlerden gelen bilgiyi güvenle kullanma.",
  },
  {
    id: "frc-yazilim",
    categorySlug: "programming",
    program: "FRC",
    title: "Yazılım",
    description:
      "WPILib, Java, otonom davranışlar ve robot kontrolünün temelleri.",
  },
  {
    id: "frc-business",
    categorySlug: "business-management",
    program: "FRC",
    title: "Business Management",
    description:
      "Kaynak geliştirme, takım sürekliliği, liderlik ve hikâyemizi anlatma.",
  },
  {
    id: "fll-robot",
    categorySlug: "robot-yapimi",
    program: "FLL",
    title: "Robot Yapımı",
    description: "Göreve uygun robot tasarlama, kurma ve iyileştirme adımları.",
  },
  {
    id: "fll-programlama",
    categorySlug: "programlama",
    program: "FLL",
    title: "Programlama",
    description:
      "Bloklarla komut verme, sensörleri kullanma ve görev akışları kurma.",
  },
  {
    id: "fll-ozdegerler",
    categorySlug: "ozdegerler",
    program: "FLL",
    title: "Özdeğerler",
    description: "Birlikte üretme, saygı ve öğrendiklerini paylaşma kültürü.",
  },
  {
    id: "fll-proje",
    categorySlug: "proje",
    program: "FLL",
    title: "Proje",
    description: "Bir problemi keşfetme, fikir geliştirme ve çözümü sunma.",
  },
];

const frcTopics = [
  {
    slug: "scouting",
    title: "Scouting",
    group: "Business Management",
    description: "Maçları gözlemleyip bilgiyi takım kararlarına dönüştürme.",
  },
  {
    slug: "mechanics",
    title: "Mechanics",
    group: "Mekanik",
    description: "Şasi, hareket ve mekanizma tasarımının temelleri.",
  },
  {
    slug: "programming",
    title: "Programming",
    group: "Yazılım",
    description: "Robot kodu, kontrol akışı ve otonom davranışlar.",
  },
  {
    slug: "electronics",
    title: "Electronics",
    group: "Elektronik",
    description: "Kablolama, güç dağıtımı ve sensör bağlantıları.",
  },
  {
    slug: "fundraising",
    title: "Fundraising",
    group: "Business Management",
    description: "Kaynak arama ve destek ilişkilerini planlama.",
  },
  {
    slug: "sustainability",
    title: "Sustainability",
    group: "Business Management",
    description: "Takım bilgisini ve işleyişini gelecek sezona taşıma.",
  },
  {
    slug: "leadership",
    title: "Leadership",
    group: "Business Management",
    description: "Görev paylaşımı, iletişim ve takım içi karar alma.",
  },
  {
    slug: "first",
    title: "FIRST",
    group: "Business Management",
    description: "FIRST kültürünü ve programın temel yaklaşımını tanıma.",
  },
  {
    slug: "media",
    title: "Media",
    group: "Business Management",
    description: "Takım çalışmalarını anlaşılır ve etkili biçimde paylaşma.",
  },
];

/** Route slugs are stable identifiers; display names can change independently. */
export const categories: EducationCategory[] = [
  ...frcTopics.map((item) => ({
    ...item,
    program: "FRC" as const,
    topic: item.title,
  })),
  {
    slug: "business-management",
    program: "FRC",
    title: "Business Management",
    group: "Business Management",
    description:
      "Kaynak geliştirme, liderlik, iletişim ve sürdürülebilirlik ile takım çalışmalarını yönetmeyi keşfet.",
  },
  ...courseGroups
    .filter((item) => item.program === "FLL")
    .map((item) => ({
      slug: item.categorySlug,
      program: item.program,
      title: item.title,
      group: item.title,
      description: item.description,
    })),
];
export const frcCategories = categories.filter(
  (item) => item.program === "FRC" && item.topic,
);
export function findCategory(program: Program, slug: string) {
  return categories.find(
    (item) => item.program === program && item.slug === slug,
  );
}
export function getCategoryForLesson(lesson: Lesson) {
  return (
    categories.find(
      (item) => item.program === lesson.program && item.topic === lesson.topic,
    ) ??
    categories.find(
      (item) =>
        item.program === lesson.program &&
        item.group === lesson.group &&
        !item.topic,
    )
  );
}
export function lessonsInCategory(
  lessons: Lesson[],
  category: EducationCategory,
) {
  return lessons.filter(
    (lesson) =>
      lesson.program === category.program &&
      (category.topic
        ? lesson.topic === category.topic
        : lesson.group === category.group),
  );
}
