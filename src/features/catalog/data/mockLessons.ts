import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "wpilib-java",
    program: "FRC",
    group: "Yazılım",
    topic: "Programming",
    title: "WPILib Java ile ilk robot kodu",
    summary:
      "Bir FRC projesinin yapısını ve ilk komutların robota nasıl ulaştığını keşfet.",
    longDescription:
      "Bu taslak derste WPILib projesindeki temel dosyaları, robot kodunun çalışma akışını ve bir komutun donanımla ilişkisini adım adım ele alıyoruz. Gerçek video ve uygulama dosyaları eklendiğinde bu alan ders materyalleriyle genişletilecek.",
    coverLabel: "WPILib Java",
  },
  {
    id: "frc-mechanics",
    program: "FRC",
    group: "Mekanik",
    topic: "Mechanics",
    title: "FRC mekanik: hareket sistemi",
    summary:
      "Şasi, motor ve aktarma parçalarının robot hareketini nasıl oluşturduğunu öğren.",
    longDescription:
      "Robotun hareket edebilmesi için mekanik parçaların birlikte nasıl çalışması gerektiğini inceliyoruz. Şasi düzeni, motor seçimi ve hareketin tekerleklere aktarılması gibi başlıklar, ileride eklenecek uygulama videosunun omurgasını oluşturuyor.",
    coverLabel: "FRC Mechanics",
  },
  {
    id: "gyro-sensor",
    program: "FRC",
    group: "Elektronik",
    topic: "Electronics",
    title: "Gyro ve sensörlerle yön takibi",
    summary:
      "Sensör verisinin robotun yönünü anlamasına nasıl yardımcı olduğunu gör.",
    longDescription:
      "Gyro sensörünün ürettiği açı bilgisini ve bu bilginin robot kontrolünde nerede kullanıldığını açıklıyoruz. Bağlantı, veri okuma ve doğrulama adımları gerçek ders içeriği hazır olduğunda burada gösterilecek.",
    coverLabel: "Gyro + Sensors",
  },
  {
    id: "pid-otonom",
    program: "FRC",
    group: "Yazılım",
    topic: "Programming",
    title: "Otonom sürüş ve PID mantığı",
    summary:
      "Hedefe yaklaşırken ölçüm ve düzeltme döngüsünü sade bir örnekle tanı.",
    longDescription:
      "Bu ders taslağı, otonom hareket için bir hedef belirlemeyi ve robotun ölçtüğü değere göre hareketini düzeltmesini anlatır. PID kavramını formülden önce sezgisel bir döngü olarak ele alıp gerçek robot örneğine bağlamayı amaçlar.",
    coverLabel: "Otonom + PID",
  },
  {
    id: "takim-surekliligi",
    program: "FRC",
    group: "Business Management",
    topic: "Sustainability",
    title: "Takımın bilgisini geleceğe taşı",
    summary:
      "Dokümantasyon ve görev paylaşımıyla birikimin sonraki sezona kalmasını sağla.",
    longDescription:
      "Bir FRC takımının yalnızca robot üretmediğini; bilgi, deneyim ve çalışma alışkanlıkları da geliştirdiğini konuşuyoruz. Bu taslak içerik, yeni üyelerin katılımı ve devir süreçleri için kullanılabilecek temel fikirleri toplar.",
    coverLabel: "Business Management",
  },
  {
    id: "fll-mindstorms",
    program: "FLL",
    group: "Programlama",
    topic: "Programlama",
    title: "Mindstorms: kırmızı bloklar",
    summary:
      "Bluetooth bağlantısını ve robotu uyanık tutma mantığını birlikte keşfet.",
    longDescription:
      "Paylaşılan eski kapaktaki Mindstorms dersi, FLL programlama örneği olarak burada yer alıyor. Kırmızı bloklar, Bluetooth bağlantısı ve robotun hazır durumda tutulması başlıkları gerçek video yüklendiğinde ayrıntılı ders akışına dönüşecek.",
    coverLabel: "FLL Yazılım",
    image: "/fll-cover.png",
  },
  {
    id: "fll-robot-yapimi",
    program: "FLL",
    group: "Robot Yapımı",
    topic: "Robot Yapımı",
    title: "FLL robotunu göreve hazırla",
    summary:
      "Bir görevin ihtiyacından başlayarak basit ve geliştirilebilir robot kur.",
    longDescription:
      "FLL robotu tasarlarken görev koşullarını okuma, parçaları yerleştirme ve deneme sonucuna göre düzenleme adımlarını ele alıyoruz. Bu açıklama ders planı taslağıdır; gerçek yapım görüntüleri daha sonra eklenecek.",
    coverLabel: "FLL Donanım",
  },
  {
    id: "fll-ozdegerler",
    program: "FLL",
    group: "Özdeğerler",
    topic: "Özdeğerler",
    title: "Özdeğerlerle takım olmak",
    summary:
      "Birlikte öğrenme, paylaşma ve birbirini destekleme üzerine düşün.",
    longDescription:
      "FLL deneyiminin önemli bir parçası olan takım kültürünü günlük çalışma örnekleriyle açmayı planlıyoruz. Bu taslak bölüm, ortak karar alma ve herkesin katkısını görünür kılma üzerine kuruludur.",
    coverLabel: "FLL Özdeğerler",
  },
  {
    id: "fll-proje",
    program: "FLL",
    group: "Proje",
    topic: "Proje",
    title: "Bir fikirden proje sunumuna",
    summary:
      "Problemi araştır, çözümünü geliştir ve hikâyeni anlaşılır biçimde anlat.",
    longDescription:
      "Proje sürecinin başlangıcında doğru soruyu sormak, farklı çözüm fikirlerini karşılaştırmak ve ekip olarak bir sunum oluşturmak gerekir. Gerçek proje örnekleri geldiğinde bu alanda adım adım içerik yer alacak.",
    coverLabel: "FLL Proje",
  },
];
