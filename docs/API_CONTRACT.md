# Frontend / backend sınırı

## Ders listesi

Canlı sitede varsayılan kaynak Supabase `lesson_catalog` tablosudur. Servis satırları aşağıdaki `Lesson` biçimine dönüştürür; yalnızca listelenen açıklamalar okunur. `videoAvailable` (isteğe bağlı boolean) gerçek materyalin yayımlanma durumunu bildirir, video kimliği içermez.

Alternatif `VITE_API_BASE_URL` yapılandırıldığında:

`GET /lessons` → `200 application/json`, doğrudan bir ders dizisi:

```json
[
  {
    "id": "wpilib-java",
    "program": "FRC",
    "group": "Yazılım",
    "topic": "Programming",
    "title": "WPILib Java ile ilk robot kodu",
    "summary": "Dersin kısa açıklaması.",
    "longDescription": "Dersin uzun açıklaması.",
    "coverLabel": "WPILib Java",
    "image": "/kapak.png"
  }
]
```

`id` benzersiz, boş olmayan bir string; `program` yalnızca `FRC`, `FTC` veya `FLL`. Örnekteki diğer string alanlarından `coverLabel` dışındakiler zorunlu. `coverLabel` isteğe bağlı eski kapak etiketidir ve mevcut arayüzde gösterilmez. `image` isteğe bağlıdır; aynı siteye ait `/` ile başlayan yol veya HTTPS adresi kabul edilir. `youtubeVideoId` isteğe bağlıdır ve 11 karakterlik YouTube kimliği olmalıdır. Tipler: `src/features/catalog/types.ts`.

Şimdilik tüm katalog tek çağrıyla alınır; ders detayları bu listeden seçilir. Büyük katalogda backend sayfalama/arama ve ayrı detay endpoint'i eklenirken `catalogService` ve provider genişletilmelidir.

## Hatalar ve durumlar

- İstek sürerken yüklenme mesajı gösterilir.
- HTTP hatası, ağ hatası veya geçersiz veri: hata mesajı + yeniden deneme.
- `[]`: boş katalog.
- Olmayan ders kimliği: bulunamayan sayfa.
- İptal edilen istek ekrana eski sonuç yazmaz.
- API farklı domaindeyse frontend domain'i için CORS ayarı gerekir.

## Login ve öneriler

Oturum işlemleri artık Supabase Auth SDK ile gerçekleştirilir; özel `/auth/*` API endpoint'leri uygulanmaz. Öneriler Supabase’de kaydedilen program/ilgi alanlarıyla mevcut katalogdan frontend’de hesaplanır. Ortak istek davranışı `services/http.ts` üzerinden genişletilebilir. Korumalı endpoint yetkilendirmesi backend'de yapılmalıdır; frontend'de bir düğmeyi gizlemek erişim kontrolü değildir.

## Video

Oynatıcı giriş yapan öğrenciler için korumalı Supabase `lesson_materials` kaydını kullanır. Katalogdaki `youtubeVideoId` alanı eski API uyumluluğu için doğrulanır; tek başına yayın/izleme yetkisi vermez. Gerçek video kimliklerini public katalog yerine `lesson_materials` içinde tutun. İlerleme, alıştırma ve sertifika veri sözleşmesi: [Ders rehberi](LEARNING.md).

## İsteğe bağlı ders çevirileri

`translations`, `tr`, `en`, `zh-Hans`, `hil` dil kodlarıyla kayıtlar taşıyabilir. Her kayıt üç metin alanını birlikte içermelidir: `title`, `summary`, `longDescription` (string). İstenen dil yoksa dersin özgün metni gösterilir; kimlik ve kategori eşleme alanları çevrilmez. Örnek ve entegrasyon ayrıntıları için [Dil rehberi](I18N.md).

## Admin içerik işlemleri

`is_admin` yalnızca sunucunun atadığı rolü kontrol eder. `admin_lessons` taslaklar dahil düzenleme verisini yalnızca adminlere döndürür. `admin_save_lesson(p_input)` rolü tekrar kontrol edip ders açıklaması, korumalı materyal ve kurs üyeliğini atomik kaydeder. Form ve ilk admin kurulumu: [Admin rehberi](ADMIN.md).
