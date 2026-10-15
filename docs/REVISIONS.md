# PDF revizyonlarının kontrolü — 16 Ekim 2026

Kaynak: kullanıcının sağladığı “Prof Nazif Website Revizeleri.pdf” (5 sayfa; son sayfa boş). Sonraki kullanıcı kararları PDF'nin önündedir. Bu liste kodla ve ekranlarla karşılaştırılarak güncellendi; hazırlık alanları tamamlanmış içerik sayılmaz.

## Tamamlanan uygulama

| PDF maddesi                        | Durum ve uygulama                                                                                                                                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ortak motto ve tutarlı anlatım     | “Öğren. Dene. Takımında kullan.” ana sayfa, footer, üyelik ve rezervasyonda ortak. Başlangıç HTML başlığı/açıklaması da güncellendi. Outreach nihai mottoyu henüz sağlamadı.                                                                           |
| FTC eklenmesi                      | Ana sayfa, navbar, sol menü, kategori sayfaları, rezervasyon ve ilgi alanlarında FRC / FTC / FLL mevcut.                                                                                                                                               |
| Üç Nazif marka kullanımı           | Mevcut portre, sağlanan birleşik logo ve özgün tebeşir animasyonu mevcut.                                                                                                                                                                              |
| Sol üstte birleşik logo            | 16 Ekim'de sağlanan şeffaf PNG navbar ve footer'a eklendi. Marka yazısı görselin içindedir; ayrı fontla oluşturulmaz. Koyu zeminde yalnızca yazının rengi açılır; Nazif'in renkleri korunur.                                                           |
| Dil değişiminde logo sabit kalsın  | Dört dilde aynı logo dosyası kullanılır. Ayrı İngilizce logo dosyası sağlanmadı; otomatik çevrilmez.                                                                                                                                                   |
| Program başlığı ve sıra etiketleri | “Tüm FIRST programları”; 01/02 program etiketleri kaldırılmış durumda.                                                                                                                                                                                 |
| Ayrı FRC konu haritasını kaldır    | Ana sayfada bu tekrar eden bölüm yok.                                                                                                                                                                                                                  |
| Öğrenme yöntemi                    | Videoyu izle → ders alıştırması → takımında kullan. Tek başına “Profesör” hitabı yok.                                                                                                                                                                  |
| Eğitmenlerimiz                     | Ana sayfada özet, ayrı liste ve her isim için profil sayfası mevcut. Üniversite/deneyim hakkında doğrulanmamış iddia eklenmedi.                                                                                                                        |
| Navbar                             | Logo ana sayfaya açılır. Anasayfa/Eğitimler tekrarları yok; Eğitmenlerimiz ayrı sayfaya açılır. Program menülerinde tekrar eden program-genel bağlantısı yok.                                                                                          |
| Kurs ana sayfası                   | Solda program/alan/ders menüsü; ana içerikte kazanımlar ve uygulama alanı var. Tekrar eden ders listesi kaldırıldı.                                                                                                                                    |
| Ders durumları                     | Henüz başlanmadı / devam ediyor / tamamlandı durumları Supabase'deki öğrenci kaydından gelir. Tamamlandı için video ve alıştırmanın ikisi de gerekir.                                                                                                  |
| Öğrencilere özel video erişimi     | Oturum açmadan video kimliklerine ve alıştırma dosyalarına veritabanı erişimi kapalı. Nazif açılışı ve kurs açıklamaları herkese açık.                                                                                                                 |
| YouTube oynatıcı                   | Gerçek ders yayınlandığında kara tahta çerçevesi içinde oynar. Mavi kapaklı ikinci alan yok; Nazif açılışı korunur.                                                                                                                                    |
| İzleme ilerlemesi                  | Gerçek oynatma aralıkları kaydedilir; tekrar izleme iki kez sayılmaz, ileri sarılan boşluk eklenmez. Videonun %95'i izlenince video tamamlanır.                                                                                                        |
| Ders alıştırması                   | Özel Storage alanından PDF indirme ve “Alıştırmayı tamamladım” işlemi bağlı. Öğrenciden cevap dosyası istenmez; tamamlama öğrenci beyanıdır.                                                                                                           |
| Kurs ve sertifika talebi           | Yayınlanmış kursun tüm videoları/alıştırmaları tamamlanınca veritabanında bir kez talep oluşur. E-posta servisi bu talepleri ekip bildirimi için işler; gönderici kurulumu bekliyor. Sertifika tasarımı ve öğrenciye gönderim PDF'deki gibi manueldir. |
| Özel ders akışı                    | Bilgi → program → konu → uygun saatler arayüzü hazır; Google randevu bağlantısı verilince eğitmen takvimi açılır. Bağlantı yokken rezervasyon yapılmış gibi gösterilmez.                                                                               |
| Footer ve takım reklamları | Footer Nazif logosunu kullanır. Takım adı/logo tanıtımı kaldırılmıştır. Kullanıcının 16 Ekim’de açıkça verdiği `https://www.instagram.com/cymurghs/` adresi, yalnızca footer’daki Instagram bağlantısı olarak eklendi. |
| Açık/koyu tema                     | Korundu; logo iki temada da okunur.                                                                                                                                                                                                                    |
| Diller                             | Kullanıcının sonraki kararı gereği mevcut Türkçe, İngilizce, basitleştirilmiş Çince ve Hiligaynon korundu. Yeni dil eklenmedi.                                                                                                                         |

## Sağlanması gereken gerçek içerik ve bağlantılar

| Gereken                                                      | Neden hâlâ açık?                                                                                                    | Ekleneceği yer                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| YouTube ders adresleri ve gerçek süreleri                    | Henüz eğitim videosu verilmedi. Örnek videolar canlı kataloğa eklenmedi.                                            | `lesson_materials`; [Ders rehberi](LEARNING.md)             |
| Her dersin alıştırma PDF'si                                  | Müfredatın gerçek alıştırmaları ekipten gelmeli.                                                                    | `lesson-exercises` özel Storage alanı                       |
| Onaylı kazanımlar ve müfredat                                | Mevcut kazanımlar taslak olarak işaretli.                                                                           | `src/features/education/data/curricula.ts`                  |
| Eğitmen fotoğrafı, üniversite, FIRST deneyimi ve biyografisi | Kullanıcı “hazır değil; mevcut görsellerle devam et” dedi. İsimler mevcut; diğer bilgiler uydurulmadı.              | `src/features/instructors/data/instructors.ts`              |
| Eğitmen Google randevu bağlantıları                          | Gerçek müsaitlik takvimleri henüz verilmedi.                                                                        | `src/features/booking/bookingConfig.ts`                     |
| Sertifika bildirim göndericisi ve ekip alıcı adresi          | Resend/SMTP henüz kurulmadı. Worker yayınlandı; gönderim ayarları olmadan kuyruk tüketilmez ve e-posta gönderilmez. | Supabase Edge Function secrets; [Ders rehberi](LEARNING.md) |
| Sertifika şablonu                                            | Medya ekibi hazırlayacak; otomatik sertifika üretimi istenmedi.                                                     | Ekip iş akışı                                               |

## Bilinçli olarak korunan kararlar

- Kara tahta renkleri PDF'de ekip tartışmasına bırakılmıştı. Kullanıcının beğendiği Nazif animasyonu, fontlar ve tahta kimliği korundu.
- Birleşik logonun sağlanan Türkçe hali bütün dillerde kullanılır.
- Hesap sistemi ve ilgi alanlarına göre öneriler Supabase'e bağlıdır. 16 Ekim'deki açık onayla ilerleme/alıştırma/sertifika kuyruğu da bağlandı; bunlar artık “veritabanı kararı bekliyor” değildir.
- Doğrulama e-postaları hâlâ Supabase'in test göndericisindedir; tüm ziyaretçilere gönderim için özel SMTP gerekir.

## Doğrulama

29 otomatik test: kullanıcılar arası veri ayrımı, anonim erişim engeli, yayınlanmamış dersler, tekrar izleme, video + alıştırma şartı, tek sertifika talebi, bildirim worker yetkisi/hata davranışı ve dört dil anahtarları. Canlı Supabase'de geri alınan bir işlemle aynı ilerleme/kuyruk/erişim kontrolleri geçti; test hesabı veya yayınlanmış test videosu bırakılmadı. Görsel kontrol masaüstü/mobil ve açık/koyu temada yapıldı.
