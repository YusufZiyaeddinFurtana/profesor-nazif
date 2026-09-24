export type Program = 'FRC' | 'FLL';

export type CourseGroup = {
  id: string;
  program: Program;
  title: string;
  description: string;
};

export type Lesson = {
  id: string;
  program: Program;
  group: string;
  topic: string;
  title: string;
  summary: string;
  longDescription: string;
  coverLabel: string;
  image?: string;
};

export const courseGroups: CourseGroup[] = [
  { id: 'frc-mekanik', program: 'FRC', title: 'Mekanik', description: 'Robotun gövdesi, hareket sistemi ve parçaların birlikte çalışma mantığı.' },
  { id: 'frc-elektronik', program: 'FRC', title: 'Elektronik', description: 'Güç, bağlantılar ve sensörlerden gelen bilgiyi güvenle kullanma.' },
  { id: 'frc-yazilim', program: 'FRC', title: 'Yazılım', description: 'WPILib, Java, otonom davranışlar ve robot kontrolünün temelleri.' },
  { id: 'frc-business', program: 'FRC', title: 'Business Management', description: 'Kaynak geliştirme, takım sürekliliği, liderlik ve hikâyemizi anlatma.' },
  { id: 'fll-robot', program: 'FLL', title: 'Robot Yapımı', description: 'Göreve uygun robot tasarlama, kurma ve iyileştirme adımları.' },
  { id: 'fll-programlama', program: 'FLL', title: 'Programlama', description: 'Bloklarla komut verme, sensörleri kullanma ve görev akışları kurma.' },
  { id: 'fll-ozdegerler', program: 'FLL', title: 'Özdeğerler', description: 'Birlikte üretme, saygı ve öğrendiklerini paylaşma kültürü.' },
  { id: 'fll-proje', program: 'FLL', title: 'Proje', description: 'Bir problemi keşfetme, fikir geliştirme ve çözümü sunma.' },
];

export const frcTopics = [
  { title: 'Scouting', group: 'Business Management', description: 'Maçları gözlemleyip bilgiyi takım kararlarına dönüştürme.' },
  { title: 'Mechanics', group: 'Mekanik', description: 'Şasi, hareket ve mekanizma tasarımının temelleri.' },
  { title: 'Programming', group: 'Yazılım', description: 'Robot kodu, kontrol akışı ve otonom davranışlar.' },
  { title: 'Electronics', group: 'Elektronik', description: 'Kablolama, güç dağıtımı ve sensör bağlantıları.' },
  { title: 'Fundraising', group: 'Business Management', description: 'Kaynak arama ve destek ilişkilerini planlama.' },
  { title: 'Sustainability', group: 'Business Management', description: 'Takım bilgisini ve işleyişini gelecek sezona taşıma.' },
  { title: 'Leadership', group: 'Business Management', description: 'Görev paylaşımı, iletişim ve takım içi karar alma.' },
  { title: 'FIRST', group: 'Business Management', description: 'FIRST kültürünü ve programın temel yaklaşımını tanıma.' },
  { title: 'Media', group: 'Business Management', description: 'Takım çalışmalarını anlaşılır ve etkili biçimde paylaşma.' },
];

export const lessons: Lesson[] = [
  {
    id: 'wpilib-java', program: 'FRC', group: 'Yazılım', topic: 'Programming',
    title: 'WPILib Java ile ilk robot kodu',
    summary: 'Bir FRC projesinin yapısını ve ilk komutların robota nasıl ulaştığını keşfet.',
    longDescription: 'Bu taslak derste WPILib projesindeki temel dosyaları, robot kodunun çalışma akışını ve bir komutun donanımla ilişkisini adım adım ele alıyoruz. Gerçek video ve uygulama dosyaları eklendiğinde bu alan ders materyalleriyle genişletilecek.',
    coverLabel: 'WPILib Java',
  },
  {
    id: 'frc-mechanics', program: 'FRC', group: 'Mekanik', topic: 'Mechanics',
    title: 'FRC mekanik: hareket sistemi',
    summary: 'Şasi, motor ve aktarma parçalarının robot hareketini nasıl oluşturduğunu öğren.',
    longDescription: 'Robotun hareket edebilmesi için mekanik parçaların birlikte nasıl çalışması gerektiğini inceliyoruz. Şasi düzeni, motor seçimi ve hareketin tekerleklere aktarılması gibi başlıklar, ileride eklenecek uygulama videosunun omurgasını oluşturuyor.',
    coverLabel: 'FRC Mechanics',
  },
  {
    id: 'gyro-sensor', program: 'FRC', group: 'Elektronik', topic: 'Electronics',
    title: 'Gyro ve sensörlerle yön takibi',
    summary: 'Sensör verisinin robotun yönünü anlamasına nasıl yardımcı olduğunu gör.',
    longDescription: 'Gyro sensörünün ürettiği açı bilgisini ve bu bilginin robot kontrolünde nerede kullanıldığını açıklıyoruz. Bağlantı, veri okuma ve doğrulama adımları gerçek ders içeriği hazır olduğunda burada gösterilecek.',
    coverLabel: 'Gyro + Sensors',
  },
  {
    id: 'pid-otonom', program: 'FRC', group: 'Yazılım', topic: 'Programming',
    title: 'Otonom sürüş ve PID mantığı',
    summary: 'Hedefe yaklaşırken ölçüm ve düzeltme döngüsünü sade bir örnekle tanı.',
    longDescription: 'Bu ders taslağı, otonom hareket için bir hedef belirlemeyi ve robotun ölçtüğü değere göre hareketini düzeltmesini anlatır. PID kavramını formülden önce sezgisel bir döngü olarak ele alıp gerçek robot örneğine bağlamayı amaçlar.',
    coverLabel: 'Otonom + PID',
  },
  {
    id: 'takim-surekliligi', program: 'FRC', group: 'Business Management', topic: 'Sustainability',
    title: 'Takımın bilgisini geleceğe taşı',
    summary: 'Dokümantasyon ve görev paylaşımıyla birikimin sonraki sezona kalmasını sağla.',
    longDescription: 'Bir FRC takımının yalnızca robot üretmediğini; bilgi, deneyim ve çalışma alışkanlıkları da geliştirdiğini konuşuyoruz. Bu taslak içerik, yeni üyelerin katılımı ve devir süreçleri için kullanılabilecek temel fikirleri toplar.',
    coverLabel: 'Business Management',
  },
  {
    id: 'fll-mindstorms', program: 'FLL', group: 'Programlama', topic: 'Programlama',
    title: 'Mindstorms: kırmızı bloklar',
    summary: 'Bluetooth bağlantısını ve robotu uyanık tutma mantığını birlikte keşfet.',
    longDescription: 'Paylaşılan eski kapaktaki Mindstorms dersi, FLL programlama örneği olarak burada yer alıyor. Kırmızı bloklar, Bluetooth bağlantısı ve robotun hazır durumda tutulması başlıkları gerçek video yüklendiğinde ayrıntılı ders akışına dönüşecek.',
    coverLabel: 'FLL Yazılım', image: '/fll-cover.png',
  },
  {
    id: 'fll-robot-yapimi', program: 'FLL', group: 'Robot Yapımı', topic: 'Robot Yapımı',
    title: 'FLL robotunu göreve hazırla',
    summary: 'Bir görevin ihtiyacından başlayarak basit ve geliştirilebilir robot kur.',
    longDescription: 'FLL robotu tasarlarken görev koşullarını okuma, parçaları yerleştirme ve deneme sonucuna göre düzenleme adımlarını ele alıyoruz. Bu açıklama ders planı taslağıdır; gerçek yapım görüntüleri daha sonra eklenecek.',
    coverLabel: 'FLL Donanım',
  },
  {
    id: 'fll-ozdegerler', program: 'FLL', group: 'Özdeğerler', topic: 'Özdeğerler',
    title: 'Özdeğerlerle takım olmak',
    summary: 'Birlikte öğrenme, paylaşma ve birbirini destekleme üzerine düşün.',
    longDescription: 'FLL deneyiminin önemli bir parçası olan takım kültürünü günlük çalışma örnekleriyle açmayı planlıyoruz. Bu taslak bölüm, ortak karar alma ve herkesin katkısını görünür kılma üzerine kuruludur.',
    coverLabel: 'FLL Özdeğerler',
  },
  {
    id: 'fll-proje', program: 'FLL', group: 'Proje', topic: 'Proje',
    title: 'Bir fikirden proje sunumuna',
    summary: 'Problemi araştır, çözümünü geliştir ve hikâyeni anlaşılır biçimde anlat.',
    longDescription: 'Proje sürecinin başlangıcında doğru soruyu sormak, farklı çözüm fikirlerini karşılaştırmak ve ekip olarak bir sunum oluşturmak gerekir. Gerçek proje örnekleri geldiğinde bu alanda adım adım içerik yer alacak.',
    coverLabel: 'FLL Proje',
  },
];

export const teachers = [
  'Yunus Emre Zent',
  'Ervin Nur Doğuş',
  'Ayşe Zümra Barmak',
  'Mert Doğulu',
  'Elizaveta Grintseviç',
];

export const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/cymurghs/?hl=en' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCSktvl3F2j85QU-7_LKIjvw' },
  { label: 'GitHub', href: 'https://github.com/Team7466' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/cymurghs/?originalSubdomain=tr' },
];
