# Frontend / backend sınırı

## Ders listesi

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

`id` benzersiz, boş olmayan bir string; `program` yalnızca `FRC` veya `FLL`. Örnekteki diğer string alanlarından `coverLabel` dışındakiler zorunlu. `coverLabel` isteğe bağlı eski kapak etiketidir ve mevcut arayüzde gösterilmez. `image` isteğe bağlıdır; aynı siteye ait `/` ile başlayan yol veya HTTPS adresi kabul edilir. `youtubeVideoId` isteğe bağlıdır ve 11 karakterlik YouTube kimliği olmalıdır. Tipler: `src/features/catalog/types.ts`.

Şimdilik tüm katalog tek çağrıyla alınır; ders detayları bu listeden seçilir. Büyük katalogda backend sayfalama/arama ve ayrı detay endpoint'i eklenirken `catalogService` ve provider genişletilmelidir.

## Hatalar ve durumlar

- İstek sürerken yüklenme mesajı gösterilir.
- HTTP hatası, ağ hatası veya geçersiz veri: hata mesajı + yeniden deneme.
- `[]`: boş katalog.
- Olmayan ders kimliği: bulunamayan sayfa.
- İptal edilen istek ekrana eski sonuç yazmaz.
- API farklı domaindeyse frontend domain'i için CORS ayarı gerekir.

## Login ve öneriler

Bu teslim, oturum veya öneri endpoint'i tanımlamaz. Ekip bu sözleşmeleri belirleyip `features/auth` ve `features/recommendations` gibi bağımsız özellikler ekleyebilir. Ortak istek davranışı `services/http.ts` üzerinden genişletilebilir. Korumalı endpoint yetkilendirmesi backend'de yapılmalıdır; frontend'de bir düğmeyi gizlemek erişim kontrolü değildir.

## Video

Bu sürümde video embed edilmez. `youtubeVideoId` alanı ileride YouTube oynatıcısına bağlanmak üzere korunur; geçerli bir kimlik döndürülmesi şu an otomatik iframe yüklemez. Oynatıcı entegrasyon noktası `src/features/lessons/components/LessonVideo.tsx` dosyasıdır.

## İsteğe bağlı ders çevirileri

`translations`, `tr`, `en`, `zh-Hans`, `hil` dil kodlarıyla kayıtlar taşıyabilir. Her kayıt üç metin alanını birlikte içermelidir: `title`, `summary`, `longDescription` (string). İstenen dil yoksa dersin özgün metni gösterilir; kimlik ve kategori eşleme alanları çevrilmez. Örnek ve entegrasyon ayrıntıları için [Dil rehberi](I18N.md).
