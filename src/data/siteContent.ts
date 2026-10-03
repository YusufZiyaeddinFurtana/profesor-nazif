import type { CourseGroup } from "../features/catalog/types";

export const courseGroups: CourseGroup[] = [
  {
    id: "frc-mekanik",
    program: "FRC",
    title: "Mekanik",
    description:
      "Robotun gövdesi, hareket sistemi ve parçaların birlikte çalışma mantığı.",
  },
  {
    id: "frc-elektronik",
    program: "FRC",
    title: "Elektronik",
    description:
      "Güç, bağlantılar ve sensörlerden gelen bilgiyi güvenle kullanma.",
  },
  {
    id: "frc-yazilim",
    program: "FRC",
    title: "Yazılım",
    description:
      "WPILib, Java, otonom davranışlar ve robot kontrolünün temelleri.",
  },
  {
    id: "frc-business",
    program: "FRC",
    title: "Business Management",
    description:
      "Kaynak geliştirme, takım sürekliliği, liderlik ve hikâyemizi anlatma.",
  },
  {
    id: "fll-robot",
    program: "FLL",
    title: "Robot Yapımı",
    description: "Göreve uygun robot tasarlama, kurma ve iyileştirme adımları.",
  },
  {
    id: "fll-programlama",
    program: "FLL",
    title: "Programlama",
    description:
      "Bloklarla komut verme, sensörleri kullanma ve görev akışları kurma.",
  },
  {
    id: "fll-ozdegerler",
    program: "FLL",
    title: "Özdeğerler",
    description: "Birlikte üretme, saygı ve öğrendiklerini paylaşma kültürü.",
  },
  {
    id: "fll-proje",
    program: "FLL",
    title: "Proje",
    description: "Bir problemi keşfetme, fikir geliştirme ve çözümü sunma.",
  },
];

export const frcTopics = [
  {
    title: "Scouting",
    group: "Business Management",
    description: "Maçları gözlemleyip bilgiyi takım kararlarına dönüştürme.",
  },
  {
    title: "Mechanics",
    group: "Mekanik",
    description: "Şasi, hareket ve mekanizma tasarımının temelleri.",
  },
  {
    title: "Programming",
    group: "Yazılım",
    description: "Robot kodu, kontrol akışı ve otonom davranışlar.",
  },
  {
    title: "Electronics",
    group: "Elektronik",
    description: "Kablolama, güç dağıtımı ve sensör bağlantıları.",
  },
  {
    title: "Fundraising",
    group: "Business Management",
    description: "Kaynak arama ve destek ilişkilerini planlama.",
  },
  {
    title: "Sustainability",
    group: "Business Management",
    description: "Takım bilgisini ve işleyişini gelecek sezona taşıma.",
  },
  {
    title: "Leadership",
    group: "Business Management",
    description: "Görev paylaşımı, iletişim ve takım içi karar alma.",
  },
  {
    title: "FIRST",
    group: "Business Management",
    description: "FIRST kültürünü ve programın temel yaklaşımını tanıma.",
  },
  {
    title: "Media",
    group: "Business Management",
    description: "Takım çalışmalarını anlaşılır ve etkili biçimde paylaşma.",
  },
];

export const teachers = [
  "Yunus Emre Zent",
  "Ervin Nur Doğuş",
  "Ayşe Zümra Barmak",
  "Mert Doğulu",
  "Elizaveta Grintseviç",
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/cymurghs/?hl=en" },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCSktvl3F2j85QU-7_LKIjvw",
  },
  { label: "GitHub", href: "https://github.com/Team7466" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/cymurghs/?originalSubdomain=tr",
  },
];

export const contactUrl =
  "https://www.cymurghs7466.com/html/turkish/contact-tr.html";
