# Geliştirme rehberi

## Sorumluluklar

`app/App.tsx` yalnızca URL'nin hangi sayfayı açacağını seçer ve ortak navbar/footer'ı kurar. `app/routes.ts` URL üretme ve çözümlemeyi tek yerde tutar. `app/Navigation.tsx` History API, geri/ileri gezinmesi ve sayfa odağını yönetir. Yeni uygulama rotası eklerken bu dosyaları güncelleyin.

Her `features/` klasörü bir kullanıcı işini kapsar. Klasör içinde yalnızca ihtiyaç duyulan `components`, `pages`, `data`, tipler ve stil dosyaları bulunur. Bir özellik kendi UI'sını ve davranışını taşır. Navbar/footer gibi tüm sitede kullanılan bileşenler `components/` altında kalır.

## Ders verisinin akışı

Varsayılan canlı kaynak Supabase `lesson_catalog` tablosudur. Bağlantısız geliştirmede `mockLessons` kullanılır. `VITE_API_BASE_URL` verilirse alternatif `GET /lessons` API'si önceliklidir. Admin panelinin kaydettiği dersleri göstermek için bu API'nin de Supabase kataloğunu okuması gerekir.

Katalog servisi → `parseLessons` → `CatalogProvider` → `EducationPage` → kategori menüsü / ders içeriği. YouTube kimliği ve özel PDF yolu bu herkese açık katalogdan ayrı, giriş gerektiren `lesson_materials` tablosunda tutulur.

Bileşenlerde doğrudan `fetch` veya örnek veri import'u yapılmaz. Provider ortak ders state'ini sağlar. HTTP erişimi servis katmanındadır. API'den gelen veri `parseLessons.ts` ile doğrulanır. Yüklenme, hata, yeniden deneme ve boş kategori durumları kullanıcıya gösterilir.

## Yeni ders eklemek

Admin yetkili hesapla `/admin` panelini kullanın. Kategori seçimi `program`, `group`, `topic`, kurs üyeliği ve URL eşleşmesini sunucuda birlikte oluşturur. Video kimliği, gerçek süre, PDF ve açıklamalar tek veritabanı işlemiyle kaydedilir. [Admin kurulumu ve kullanımı](ADMIN.md).

`mockLessons.ts` yalnızca Supabase yapılandırılmamış geliştirme ortamının örnek kaynağıdır; canlı siteye ders eklemek için değiştirilmez.

## Yeni kategori eklemek

`features/education/data/categories.ts` kayıtlarına kararlı bir `slug`, program, başlık, açıklama ve eşleme bilgisi ekleyin. FRC başlıkları için topic kayıtları, FTC ve FLL için courseGroups kayıtları kullanılır. Ana sayfa grubu yeni kategoriye bağlanacaksa `categorySlug` değerini aynı yapın. Supabase `learning_courses` ve `private.admin_categories` eşlemesine de yeni kategori için migration ekleyin. Yeni sayfa dosyası kopyalamayın; bütün kategoriler `EducationPage` üzerinden render edilir.

Kategori slug'ını değiştirirseniz eski bağlantılar için ayrıca yönlendirme ekleyin. Güncel görünen başlıkları değiştirmek URL'yi değiştirmez.

## Video eklemek

`features/lessons/components/LessonVideo.tsx`, korumalı Supabase materyali varsa `features/learning/components/TrackedVideo.tsx` oynatıcısını açar; yoksa hazırlık alanı gösterir. `LearningProvider` ilerleme ve alıştırma state’ini oturum sahibine göre yönetir. Nazif açılışı `LessonIntro.tsx` içinde ayrıdır. Tablo/RPC/Storage ve sertifika worker dosyaları: [Ders rehberi](LEARNING.md).

## Login veya öneri gibi yeni özellikler

Örneğin `features/auth/` altında gerekli sayfa, bileşen, servis ve state dosyalarını oluşturun. Uygulama genelinde oturum gerekiyorsa provider'ı `main.tsx` seviyesinde bağlayın. Backend sözleşmesini önce belirleyin; HTTP erişimini `services/http.ts` üzerinden genişletin. Yetkilendirme backend'de uygulanmalıdır.

Öneriler için `features/recommendations/` aynı düzeni izleyebilir. Ders görselleri ve menü bileşenlerini kopyalamak yerine mevcut özelliklerden doğrudan import edin. Küçük bir özelliğin ihtiyacı olmayan klasörleri önceden oluşturmayın.

## Stil düzeni

- `styles/tokens.css`: iki tema için ortak renk anlamları.
- `styles/base.css`: tipografi, erişilebilirlik ve ortak yüzey kuralları.
- `styles/layout.css`: navbar/footer.
- `features/*/*.css`: ilgili özelliğin stilleri; mobil kuralları aynı dosyada.
- `components/branding/chalk.css`: tekrar kullanılan Nazif reveal animasyonu.
- `theme/theme.css`: tema düğmesi.

Yeni özellikte yeni renk kodları çoğaltmak yerine mevcut tema değişkenlerini kullanın. CSS giriş dosyası `src/styles.css` içindeki import sırası tek yerde yönetilir.

## Kontrol

PR veya push öncesi `npm test` ve `npm run build` çalıştırın. Testler kategori/veri eşleşmelerini, bozuk URL'leri, eski ders adreslerini ve API veri doğrulamasını kapsar. UI değişikliği varsa açık/koyu tema ile masaüstü/mobil görünümü kontrol edin.

## Çok dil desteği

`i18n/` arayüz ve örnek içerik çevirilerini, dil seçiciyi ve ortak dil state'ini tutar. `LocaleProvider`, uygulama sağlayıcılarının dışında yer alır. Dil değişimi katalog verisini yeniden indirmez; `EducationPage` kararlı anahtarlarla eşlediği verinin yalnızca gösterilen metinlerini yerelleştirir. Yeni özelliklerde `useLocale()` kullanın. Dosya sorumlulukları ve backend çeviri sözleşmesi için [I18N.md](./I18N.md) belgesine bakın.

## Eğitmenler ve özel ders

`features/instructors/` kendi veri tiplerini, eğitmen listesini, portre bileşenini ve liste/profil sayfasını içerir. Ana sayfadaki kısa liste aynı veriyi kullanır. Profil alanları isteğe bağlıdır; eksik üniversite ve FIRST deneyimi için kurum veya başarı uydurulmaz.

`features/booking/` dört adımlı özel ders arayüzünü yönetir. Ad ve e-posta yalnızca bileşen state'inde tutulur; backend'e, localStorage'a veya URL'ye gönderilmez. Program değişince eski konu seçimi silinir. `bookingConfig.ts`, program+konu için eğitmen ve Google randevu bağlantısını belirler. `calendar.ts` yalnızca Google randevu sayfalarına izin verir; tam randevu sayfası gömülür, kısa Google bağlantısı yeni sekmede açılır. Saat seçimi, müsaitlik ve son onay Google'da yönetilir. Henüz yapılandırılmış canlı takvim yoktur.

`features/education/data/curricula.ts`, dil bazında kurs kazanımları ve kullanım açıklamasını tutar. Boşken mevcut ders özetleri açıkça taslak olarak gösterilir. Onaylı müfredat eklendiğinde `reviewed: true` yapılır. `LessonStatusIcon` üç görsel durumu tanımlar; `EducationSidebar` gerçek öğrenci durumunu `LearningProvider` üzerinden verir.

## Supabase üyelik

`features/auth/` kayıt, giriş, doğrulama ve şifre yenileme akışlarını taşır. `AuthProvider` navigasyonun içinde, katalog sağlayıcısının dışında bağlıdır. Sayfa bileşenleri `authService.ts` aracılığıyla resmi SDK'yı kullanır. Veritabanı profil izolasyonu `supabase/migrations/` içindeki RLS kurallarıyla sağlanır. [Kurulum rehberi](AUTH.md).

## İlgi alanları ve öneriler

`PreferencesProvider`, Auth oturumunun kullanıcı kimliğiyle profil tercihlerini yükler. `features/interests` veri erişimi ve seçim arayüzünü; `features/recommendations` katalogdan ders seçme kuralını ve öneri görünümünü içerir. Kayıt metadata'sı trigger ile PostgreSQL'e aktarılır; sonraki güncellemeler RLS altında `profiles` tablosuna yazılır. Detaylar: [RECOMMENDATIONS.md](RECOMMENDATIONS.md).
