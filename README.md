# Profesör Nazif

Cymurghs #7466 eğitim sitesi. React + TypeScript + Vite frontend'i; backend ayrı geliştirilebilir.

## Çalıştırma

Proje dizininde:

```bash
npm ci
npm run dev
```

Üretim kontrolü: `npm run build`, ardından `npm run preview`.

## Dosya yapısı

```text
src/
  app/                 Uygulama ve History API ile sayfa gezinmesi
  pages/               Ana sayfa, ders detayı, bulunamayan sayfa
  components/
    home/              Ana sayfanın bağımsız bölümleri
    layout/            Navbar ve footer
    branding/          Özgün Nazif çizimi, takım logosu açılışı
    lessons/           Kapak, yüklenme/hata durumu, YouTube oynatıcısı
    ui/                Ortak küçük arayüz parçaları
  features/catalog/    Ders tipleri, veri kaynağı, filtreler, katalog state'i
  services/            Ortak HTTP erişimi
  data/                Örnek dersler ve sabit site içerikleri
  theme/               Açık/koyu tema ve kalıcı kullanıcı tercihi
  styles/              Tema renkleri, temel stiller, düzen ve mobil kurallar
```

Bileşenler doğrudan mock veriyi okumaz. `CatalogProvider → catalogService → HTTP / mock` akışı kullanılır. API açılınca örnek ders modülü yüklenmez. Ana sayfanın sabit kategori ve takım bilgileri `src/data/siteContent.ts` içindedir.

### Sayfalar

- `/`: ana sayfa.
- `/ders/:id`: paylaşılabilir ders sayfası.
- `/?program=FRC&topic=Programming#dersler`: filtrelenmiş katalog.
- Filtreler ve arama URL'de saklanır; yenileme ve geri dönüşte korunur.
- Vercel SPA rewrite ayarı, ders adresinin doğrudan açılmasını destekler.

### Backend bağlama

`.env.example` dosyasını `.env.local` olarak kopyalayın ve kendi API adresinizi girin:

```dotenv
VITE_API_BASE_URL=https://api.example.com
```

Frontend `GET https://api.example.com/lessons` çağırır. Değişiklik sonrası yerel sunucuyu yeniden başlatın; Vercel'de değişkeni tanımlayıp yeniden deploy edin. Değişken boşsa örnek dersler kullanılır.

Yanıt biçimi ve ekip için entegrasyon sınırları: [API sözleşmesi](docs/API_CONTRACT.md).

Login, oturum, öneri algoritması, veri tabanı ve yönetim paneli henüz uygulanmadı. Bunlar takım tarafından ayrı özellikler olarak eklenebilir; ders sayfalarının görsel bileşenleri değişmeden servis katmanı genişletilebilir. Ön yüz değişkenlerine gizli anahtar koymayın.

### YouTube videosu ekleme

`src/data/mockLessons.ts` içindeki bir derse `youtubeVideoId` alanı ekleyin veya aynı alanı API'den döndürün. Tam bağlantı yerine videonun 11 karakterlik kimliğini kullanın. Video verilmediyse kapak ve hazırlık mesajı görünür. Verildiyse kullanıcı oynatmaya basınca YouTube iframe'i yüklenir; ayrıca YouTube'da aç bağlantısı bulunur.

Tebeşir açılışı sitenin arayüz animasyonudur; YouTube videosunun dosyasını değiştirmez. Videolarınıza aynı açılışı eklemek için yayınladığınız videonun başında bulunması gerekir.

### Tasarım

- Üst menüdeki tema düğmesi açık/koyu görünümü değiştirir; tercih tarayıcıda saklanır. İlk ziyaret sistem temasını izler.
- `src/styles/tokens.css` iki temanın ortak renk sözleşmesidir.
- Girişte takımın özgün tebeşir logosu, kısa terminal/boot animasyonu ile görünür; içerik ve bağlantılar bekletilmez. Yeniden oynatma ve azaltılmış hareket desteği bulunur.
- Google Fonts: DM Sans ve Kalam. Kullanıcı görselleri `public/` içindedir; yeni görsel üretimi yapılmamıştır.

## Yayınlama

GitHub reposunu Vercel'e aktarın. Framework: Vite. Build: `npm run build`. Output: `dist`. Ayarlar `vercel.json` içindedir.

## Mevcut içerik

Örnek dersler taslaktır; gerçek video kimlikleri ve kesin müfredat beklenir. Öğretmen adları kullanıcı dokümanından alınmıştır; fotoğraf, biyografi ve ders eşleştirmesi henüz verilmemiştir. Takım logosu ve sosyal bağlantılar [resmî takım sitesinden](https://www.cymurghs7466.com/) alınmıştır.
