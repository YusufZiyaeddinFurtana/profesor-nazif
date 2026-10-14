# 14 Ekim 2026 revizyonları

Kaynak: kullanıcının sağladığı “Prof Nazif Website Revizeleri.pdf”. Sonraki kullanıcı yönlendirmeleri PDF'nin önündedir.

## Uygulananlar

- Ana sayfa FRC, FTC ve FLL'yi içerir. Program sıra etiketleri ve ayrı FRC konu haritası kaldırıldı.
- Ana menüde ayrı Anasayfa/Eğitimler bağlantıları kaldırıldı; logo ana sayfaya, Eğitmenlerimiz ayrı sayfaya açılır. FRC/FTC/FLL açılır menülerinde tekrarlanan program-genel bağlantıları kaldırıldı.
- Nazif görseli dil değişiminde aynı kalır. Yazıyla oluşturulmuş navbar/footer marka adı kaldırıldı. Birleşik logo geldiğinde `src/config/site.ts` içindeki `brandAssets.wordmark` güncellenir.
- Takım adı, logosu ve bağlantıları arayüzden tamamen çıkarıldı. Yalnızca onaylı Profesör Nazif Instagram adresi eklenecek; adres bilinmediğinden sosyal bağlantı şu anda gizlidir.
- Öğrenme akışı: videoyu izle, ders alıştırmasını tamamla, takımında kullan. “Öğren. Dene. Takımında kullan.” geçici ortak motto olarak kullanılıyor; outreach ekibi nihai metni belirleyince dört dilde aynı mesaj anahtarları güncellenebilir.
- Eğitmenlerimiz ana sayfada kısa liste, ayrı sayfada tam liste ve her eğitmen için profil sayfası olarak hazırlandı.
- Kurs ana sayfasındaki tekrar eden açıklama ve ders listesi kaldırıldı; kazanımlar, uygulama açıklaması ve derse başlama bağlantısı eklendi. Sol menü korunuyor; FTC seçeneği eklendi.
- Özel dersin bilgi → program → konu → takvim arayüzü hazır. Gerçek takvim bağlantısı bulunmadığında açık bir kapalı-takvim durumu gösterilir; saat veya başarılı rezervasyon uydurulmaz.

## Kullanıcının açıkça beklettiği işler

Veritabanı kararı verilene kadar kayıt/giriş, öğrenciye özel video erişimi, izleme ilerlemesi, alıştırma tamamlama state'i ve sertifika/e-posta otomasyonu bekletildi. Bu revizyonda veritabanı, auth sağlayıcısı, kullanıcı hesabı veya e-posta hizmeti kurulmadı. Durum ikonları sunum bileşeni olarak mevcut; kişisel ilerleme kaydı yok.

Mevcut Türkçe, İngilizce, basitleştirilmiş Çince ve Hiligaynon dil seçenekleri korundu. Yeni dil eklenmedi.

Kara tahtanın yeni marka renkleriyle değiştirilmesi PDF'de bir ekip kararı olarak bırakılmıştı. Mevcut tahta görünümü, Nazif animasyonu, fontlar ve açık/koyu tema korundu.

## İçerik ekibi sağlayınca tamamlanacaklar

| Eksik içerik | Ekleneceği yer |
| --- | --- |
| Onaylı birleşik logo | `src/config/site.ts` → `brandAssets.wordmark` |
| Eğitmen fotoğrafı, üniversitesi, FIRST deneyimi, biyografisi | `src/features/instructors/data/instructors.ts` |
| Kesin kurs kazanımları ve kullanım açıklamaları | `src/features/education/data/curricula.ts` |
| Program/konu/eğitmen bazlı Google randevu bağlantıları | `src/features/booking/bookingConfig.ts` |
| Profesör Nazif Instagram adresi | `src/config/site.ts` → `instagramUrl` |
| Ders videoları ve alıştırma PDF'leri | Veritabanı ve erişim kararı sonrasında ders veri sözleşmesi |

Eğitmenler için yalnızca verilen isimler kullanıldı. Prestijli üniversite, mezuniyet veya program deneyimi hakkında doğrulanmamış kişisel iddialar eklenmedi.
