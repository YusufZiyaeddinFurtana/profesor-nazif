# Video, ilerleme, alıştırma ve sertifika

## Kullanıcı akışı

1. Öğrenci giriş yapar; kurs açıklamaları ve Nazif açılışı girişsiz de görülebilir.
2. Yayınlanmış ders YouTube oynatıcısıyla kara tahta içinde açılır.
3. Oynatma aralıkları 5 saniyelik aralıklarla Supabase'e kaydedilir. İzlenen aralıkların birleşimi tutulur: yeniden izleme aynı saniyeyi tekrar saymaz, ileri sarmak boşluğu doldurmaz. %95 kapsama videoyu tamamlar; kurs yüzdesi gerçek sürelerle ağırlıklıdır.
4. Öğrenci alıştırma PDF'sini indirir; kendi beyanıyla tamamlandı olarak işaretler. Cevap yükleme veya puanlama yoktur.
5. Kursun bütün videoları ve alıştırmaları bitince tek `course_completions` kaydı oluşur. Ekip sertifikayı manuel hazırlayıp gönderir.

Bu takip bir sınav/kimlik doğrulama mekanizması değildir; istemci oynatma verisini bildirir. Ani sekme kapanmasında henüz gönderilmeyen son birkaç saniye kaybolabilir. Başka cihazda yenileme kaydedilmiş ilerlemeyi getirir; anlık cihazlar arası senkronizasyon yoktur.

## Dosyalar

| Dosya                                                | Sorumluluk                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `features/learning/LearningProvider.tsx`             | Oturuma göre kaynakları ve kişisel ilerlemeyi yükleme; hesap değişiminde eski veriyi gizleme |
| `features/learning/learningService.ts`               | Supabase tabloları, iki ilerleme RPC'si ve süreli PDF indirme URL'si                         |
| `features/learning/components/TrackedVideo.tsx`      | YouTube API, gerçek izleme aralıkları, kayıt kuyruğu, hata ve yeniden deneme                 |
| `features/learning/components/LessonExercise.tsx`    | PDF indirme ve öğrenci beyanı                                                                |
| `features/learning/components/CourseProgress.tsx`    | Kurs yüzdesi ve sertifika talebinin görünmesi                                                |
| `features/lessons/components/LessonVideo.tsx`        | Kara tahta çerçevesi, yayınlanmış oynatıcı veya gerçek hazırlık durumu                       |
| `features/education/components/EducationSidebar.tsx` | Kaydedilmiş ders durumları                                                                   |
| `supabase/migrations/*_lesson_progress.sql`          | Tablo, RLS, RPC, özel Storage ve mevcut katalog kimlikleri                                   |
| `supabase/functions/certificate-notifications/`      | Yalnızca sunucudan çağrılabilen ekip e-posta bildirimi                                       |

## Veritabanı

- `learning_courses`: `id` (`frc/programming`), program, kategori, kurs adı, `is_published`.
- `lesson_materials`: sabit `lesson_id`, YouTube kimliği, gerçek süre (saniye), özel PDF yolu, `is_published`.
- `course_lessons`: bir dersin hangi kurs(lar)a dahil olduğu ve sırası. Business Management gibi birden fazla konuyu kapsayan kurslar da desteklenir.
- `lesson_progress`: kullanıcı + ders için izleme aralıkları, benzersiz izlenen saniye, video/alıştırma tamamlanma zamanı.
- `course_completions`: kullanıcı + kurs için tek sertifika talebi; bildirim gönderim/claim bilgileri.

Anonim kullanıcılar materyal veya ilerleme okuyamaz. Öğrenciler yalnızca kendi ilerlemelerini ve taleplerini okur; doğrudan yazamaz. `record_lesson_watch` ve `complete_lesson_exercise` RPC'leri oturum sahibini sunucuda belirler, gerçek yayın durumunu kontrol eder ve gerekirse kurs talebini oluşturur. Yetkili yazım kodu Data API'ye açılmayan `private` şemasındadır. Yönetici `service_role` anahtarı frontend'e girmez.

### Gerçek dersi yayınlama

İlk kurulum mevcut 9 örnek dersin kimliklerini ve 18 kursun üyeliklerini oluşturur. Hepsi **taslaktır**; gerçek video/PDF olmadan yayınlanmaz.

Normal içerik ekleme akışı artık `/admin` panelidir: program/kategori, başlık/açıklama, YouTube bağlantısı, gerçek video süresi ve PDF seçilir; **Yayımla** ile ders görünür hale gelir. SQL Editor veya TS dosyası düzenlemek gerekmez. İlk admin ataması ve adımlar: [Admin rehberi](ADMIN.md).

Yayımlanmamış dersler zorunlu kurs ilerlemesine dahil edilmez. Daha önce kazanılmış tamamlama kayıtları içerik güncellemesiyle silinmez. Bir kere yayımlanmış videonun kimliği/süresi değiştirilmez; farklı içerik için yeni ders oluşturulur.

YouTube kimliğini herkese açık katalog API'sine koymayın; oynatıcı korumalı `lesson_materials` verisini kullanır. Üyelik kontrolü site ve veritabanı erişimini kapsar. YouTube videosunun kendisi DRM ile korunmaz; erişen öğrenci bağlantıyı paylaşabilir. Liste dışı yayın YouTube aramasında görünmeyi azaltır, bağlantı paylaşımını engellemez.

## Sertifika e-posta bildirimi

`certificate-notifications` Edge Function canlı projede JWT kontrolüyle yayınlandı. Ek olarak yalnızca server `service_role` Authorization değerini kabul eder; sıradan öğrenci JWT'si yeterli değildir. Öğrenci e-posta alıcısını belirleyemez.

Şu anda **gönderici/ekip adresi yok; gönderim ve zamanlayıcı etkin değil**. Talepler veritabanında bekler, sitede “gönderildi” denmez. Domain ve Resend kurulunca Supabase → Edge Functions → Secrets bölümüne:

- `RESEND_API_KEY`
- `CERTIFICATE_FROM_EMAIL` (doğrulanmış gönderici/domain)
- `CERTIFICATE_NOTIFY_TO` (ekibin sertifika taleplerini alacak adresi)

eklenir. Bunlar `VITE_` değişkeni veya frontend dosyası değildir. Supabase Auth SMTP ayrı ayardır: doğrulama/şifre yenileme e-postalarını gönderir; bu worker kurs tamamlanma bildirimini Resend API üzerinden gönderir.

Sonrasında yetkili sunucu/Supabase Cron, function'a POST yapacak şekilde kurulmalıdır. Kimlik bilgisini Supabase Vault/secret olarak tutun; kaynak koda veya SQL geçmişine düz anahtar yazmayın. Worker her çağrıda en çok 20 talebi 5 dakikalık lease ile alır; başarısız gönderim tekrar bekler. Resend isteği talebin sabit UUID'siyle idempotency key kullanır. Resend'in idempotency süresi dışındaki belirsiz gönderimler otomatik/manuel tekrar öncesi loglardan kontrol edilmelidir.

Bildirimde öğrenci adı, e-postası, program/kurs ve talep kimliği bulunur. Sertifika otomatik üretilmez; ekip template üzerinden oluşturup öğrenciye yollar.

## Doğrulama

`npm test` ve `npm run build`. `learning-database.test.ts` bütün migration'ları PGlite üzerinde çalıştırır; kullanıcı ayrımı, anonim erişim, doğrudan yazım engeli, yayın kontrolü, tekrar izleme, tamamlanma şartları ve kuyruk lease'ini kontrol eder. `learning.test.ts` zaman atlamaları ve worker auth/config/gönderim hatalarını kontrol eder.

Canlı Supabase'de aynı kritik davranışlar bir transaction içinde doğrulandı ve rollback yapıldı. Gerçek ders dosyası veya öğrenci hesabı bırakılmadı. Gerçek eğitim video/PDF'si sağlanmadığından bu içeriklerle uçtan uca kullanıcı testi henüz yapılmadı. Ekran testi yerel fixture üzerinden yapılır; fixture'daki resmi YouTube demo videosu canlı katalogda bulunmaz.
