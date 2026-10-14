# Profesör Nazif

React + TypeScript + Vite ile eğitim sitesi. FRC/FTC/FLL alanları kendi sayfalarında açılır; her alanın sol menüsünden ders seçilir.

## Çalıştırma

Node.js 22.18+ gereklidir. Proje dizininde:

```bash
npm ci
npm run dev
```

```bash
npm test          # Kategori eşleştirme, URL ve API veri kontrolleri
npm run build    # TypeScript kontrolü ve üretim derlemesi
npm run preview  # Derlenmiş siteyi yerelde açma
```

## Sayfalar

- `/`: ana sayfa ve eğitim alanlarına giriş.
- `/egitimler/frc`, `/egitimler/ftc` ve `/egitimler/fll`: programın tüm alanları.
- `/egitmenler` ve `/egitmenler/:id`: eğitmen listesi ve profil sayfası.
- `/ozel-ders`: bilgi, program, konu ve uygun saat seçimi akışı.
- `/egitimler/frc/programming`: alan açıklaması ve solda ders menüsü.
- `/egitimler/frc/programming/wpilib-java`: seçili ders, Nazif açılışı ve video için kara tahta çerçevesi.
- Eski `/ders/:id` bağlantıları uygun yeni ders adresine yönlendirilir.

## Geliştirme yapısı

```text
src/
  app/                   Uygulama kabuğu, URL çözümleme, gezinme
  components/            Ortak navbar/footer, Nazif çizimi, küçük UI parçaları
  config/                Site bağlantıları ve iletişim ayarları
  features/
    home/                Ana sayfa, bölümleri, eğitmen özeti, kendi CSS'i
    education/           Kategoriler, sol menü, program/alan sayfaları, kendi CSS'i
    lessons/             Ders içeriği, korunmuş tebeşir açılışı, video çerçevesi
    catalog/             Ders tipleri, API servisi, veri doğrulama, state, örnek veriler
    instructors/         Eğitmen listesi, profil bilgileri ve sayfaları
    booking/             Özel ders seçim adımları ve Google randevu eşleştirmeleri
  i18n/                  Dört dil, çeviri metinleri, seçici ve dil state’i
  pages/                 Bulunamayan sayfa ve eski URL yönlendirmesi
  services/              Ortak HTTP erişimi
  styles/                Tema renkleri, temel stiller ve ortak sayfa düzeni
  theme/                 Açık/koyu tema, tarayıcıda saklanan tercih
```

Yeni özellik ekleme, dosyaların sorumlulukları ve veri akışı: [Mimari rehberi](docs/ARCHITECTURE.md).

## İçerik ekleme

- Kategori ve ana sayfadaki grup bilgileri: `src/features/education/data/categories.ts`.
- Örnek dersler: `src/features/catalog/data/mockLessons.ts`.
- Eğitmen isimleri ve profilleri: `src/features/instructors/data/instructors.ts`.
- Onaylı kurs kazanımları: `src/features/education/data/curricula.ts`.
- Konu/eğitmen/Google randevu takvimi eşleştirmeleri: `src/features/booking/bookingConfig.ts`.
- Logo ve Profesör Nazif Instagram adresi: `src/config/site.ts`.
- Tema renkleri: `src/styles/tokens.css`.

Kategori adı ile URL kimliği ayrıdır. İsimleri değiştirirken `slug` değerlerini sabit tutun. Dersler `program`, `topic` ve `group` ile kategoriye eşlenir. Eklenen bir ders, ilgili alanın menüsünde otomatik görünür; ders başına yeni sayfa dosyası oluşturulmaz.

## Backend bağlama

`.env.example` dosyasını `.env.local` olarak kopyalayıp API adresini girin:

```dotenv
VITE_API_BASE_URL=https://api.example.com
```

Adres boşsa örnek dersler kullanılır. Tanımlıysa frontend `GET /lessons` çağırır. Yerelde sunucuyu yeniden başlatın; Vercel'de değişken değiştiğinde yeniden deploy edin. API'nin veri biçimi: [API sözleşmesi](docs/API_CONTRACT.md).

Login, oturum, öneriler, veri tabanı ve yönetim paneli henüz uygulanmadı. Bu özellikler kendi feature klasörlerinde geliştirilebilir. Gizli anahtarları `VITE_` değişkenlerine koymayın; bu değişkenler tarayıcıya gönderilir.

## Video alanı

Nazif'in mevcut tebeşir animasyonu korunmuştur. Mavi kapaklı ikinci alan kaldırılmıştır. `LessonVideo.tsx` şimdilik kara tahta çerçevesinde bir hazırlık alanı gösterir; herhangi bir video veya YouTube iframe'i yüklenmez. Gerçek oynatıcı eklenirken bu bileşenin içi değiştirilir. `youtubeVideoId` veri alanı ileride kullanım için korunur; tek başına video oynatmaz.

## Fontlar

- **DM Sans** — gövde metinleri, menüler ve kontroller.
- **Kalam** — tebeşir başlıkları ve el yazısı vurgular.
- **Ma Shan Zheng** — Çince tebeşir başlıkları ve el yazısı notları.

Ağırlıklar ve kaynak: [Font listesi](docs/FONTS.md).

## Tasarım ve yayın

Açık/koyu tema menüdeki düğmeyle değişir; tercih tarayıcıda korunur. Hareket azaltma tercihi desteklenir. Takım logosu, adı ve bağlantıları arayüzden kaldırılmıştır. Nazif görsel kimliği dil değişiminden bağımsızdır.

GitHub reposunu Vercel'e aktarın: framework Vite, build `npm run build`, output `dist`. `vercel.json`, eğitim adreslerinin doğrudan açılmasını destekleyen SPA rewrite ayarını içerir.

Mevcut ders açıklamaları örnek içeriktir; gerçek videolar, kesin müfredat, eğitmen fotoğrafları ve ders eşleştirmeleri ekip tarafından tamamlanmalıdır.

## Diller

Navbar'dan Türkçe, İngilizce, basitleştirilmiş Çince ve Hiligaynon seçilebilir. Dil tercihi tarayıcıda saklanır; açık dersin adresi ve tema değişmez. Arayüz metinleri, kategori açıklamaları ve örnek ders içerikleri çevrilir. Dosya sorumlulukları, API ders çevirileri ve Hiligaynon dil kontrolü: [Dil rehberi](docs/I18N.md).

## Son revizyon ve bekleyen bağlantılar

PDF revizyonlarının uygulanan ve bekletilen kısımları: [Revizyon notları](docs/REVISIONS.md). Giriş, kullanıcıya özel ilerleme ve sertifika bildirimleri veritabanı kararı gelene kadar uygulanmadı. Özel ders arayüzü saat uydurmaz veya rezervasyon yapıldığını söylemez: Google randevu bağlantısı yoksa takvimin kapalı olduğunu gösterir. Mevcut dört dil korunur.
