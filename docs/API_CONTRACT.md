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

`id` benzersiz, boş olmayan bir string; `program` yalnızca `FRC` veya `FLL`. Örnekteki diğer string alanları zorunlu. `image` isteğe bağlıdır; aynı siteye ait `/` ile başlayan yol veya HTTPS adresi kabul edilir. `youtubeVideoId` isteğe bağlıdır ve 11 karakterlik YouTube kimliği olmalıdır. Tipler: `src/features/catalog/types.ts`.

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

## YouTube

Oynatıcı `youtube-nocookie.com/embed/:id` adresini kullanıcı oynatmaya basınca açar. Video YouTube'da gömmeye kapalıysa veya erişimi kısıtlıysa oynatımı YouTube belirler; alternatif doğrudan video bağlantısı her zaman görünür.
