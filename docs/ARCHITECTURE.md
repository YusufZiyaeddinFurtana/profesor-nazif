# Geliştirme rehberi

## Sorumluluklar

`app/App.tsx` yalnızca URL'nin hangi sayfayı açacağını seçer ve ortak navbar/footer'ı kurar. `app/routes.ts` URL üretme ve çözümlemeyi tek yerde tutar. `app/Navigation.tsx` History API, geri/ileri gezinmesi ve sayfa odağını yönetir. Yeni uygulama rotası eklerken bu dosyaları güncelleyin.

Her `features/` klasörü bir kullanıcı işini kapsar. Klasör içinde yalnızca ihtiyaç duyulan `components`, `pages`, `data`, tipler ve stil dosyaları bulunur. Bir özellik kendi UI'sını ve davranışını taşır. Navbar/footer gibi tüm sitede kullanılan bileşenler `components/` altında kalır.

## Ders verisinin akışı

```text
.env.local / VITE_API_BASE_URL
           ↓
       catalogService
        ↙        ↘
 mockLessons     HTTP GET /lessons → parseLessons
        ↘        ↙
       CatalogProvider
           ↓
 EducationPage → kategori eşleştirme
        ↙              ↘
 EducationSidebar     CategoryOverview / LessonContent
```

Bileşenlerde doğrudan `fetch` veya örnek veri import'u yapılmaz. Provider ortak ders state'ini sağlar. HTTP erişimi servis katmanındadır. API'den gelen veri `parseLessons.ts` ile doğrulanır. Yüklenme, hata, yeniden deneme ve boş kategori durumları kullanıcıya gösterilir.

## Yeni ders eklemek

1. `features/catalog/data/mockLessons.ts` içine benzersiz `id` ile ders ekleyin veya aynı kaydı API'den döndürün.
2. `program` değeri `FRC`, `FTC` ya da `FLL` olmalıdır.
3. FRC alt başlıkları `topic` ile eşleşir: örneğin `Programming`. Business Management sayfası `group` üzerinden ilgili konuları birlikte gösterir.
4. FLL alanları `group` ile eşleşir: `Robot Yapımı`, `Programlama`, `Özdeğerler`, `Proje`.
5. Menü, ders içeriği ve paylaşılabilir URL otomatik oluşur.

## Yeni kategori eklemek

`features/education/data/categories.ts` kayıtlarına kararlı bir `slug`, program, başlık, açıklama ve eşleme bilgisi ekleyin. FRC başlıkları için topic kayıtları, FTC ve FLL için courseGroups kayıtları kullanılır. Ana sayfa grubu yeni kategoriye bağlanacaksa `categorySlug` değerini aynı yapın. Yeni sayfa dosyası kopyalamayın; bütün kategoriler `EducationPage` üzerinden render edilir.

Kategori slug'ını değiştirirseniz eski bağlantılar için ayrıca yönlendirme ekleyin. Güncel görünen başlıkları değiştirmek URL'yi değiştirmez.

## Video eklemek

`features/lessons/components/LessonVideo.tsx` şu an statik hazırlık alanıdır. Gerçek YouTube oynatıcısını bu bileşenin içine ekleyin; çerçeve ve eğitim sayfası düzenini koruyun. Veri kaynağı olarak `Lesson.youtubeVideoId` kullanılabilir. Nazif açılışı `LessonIntro.tsx` içinde ayrı tutulur; oynatıcı değişikliği animasyonu etkilemez.

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

`features/education/data/curricula.ts`, dil bazında kurs kazanımları ve kullanım açıklamasını tutar. Boşken mevcut ders özetleri açıkça taslak olarak gösterilir. Onaylı müfredat eklendiğinde `reviewed: true` yapılır. `LessonStatusIcon` yalnızca üç görsel durumu tanımlar; kullanıcı ilerlemesi tutmaz, backend ile bağlanmadı.

## Supabase üyelik

`features/auth/` kayıt, giriş, doğrulama ve şifre yenileme akışlarını taşır. `AuthProvider` navigasyonun içinde, katalog sağlayıcısının dışında bağlıdır. Sayfa bileşenleri `authService.ts` aracılığıyla resmi SDK'yı kullanır. Veritabanı profil izolasyonu `supabase/migrations/` içindeki RLS kurallarıyla sağlanır. [Kurulum rehberi](AUTH.md).
