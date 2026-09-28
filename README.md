# Profesör Nazif — frontend tasarım prototipi

Cymurghs #7466 için React ve TypeScript ile hazırlanmış eğitim sitesi arayüzü.

## Yerelde açma

```bash
cd profesor-nazif
npm install
npm run dev
```

Terminalin gösterdiği yerel adresi tarayıcıda açın. Üretim derlemesi için `npm run build` kullanın.

## İçerik ekleme

- FRC/FLL kategorileri, FRC menü başlıkları, ders taslakları, öğretmen adları ve sosyal bağlantılar `src/content.ts` içindedir.
- Gerçek kurs videoları, uzun açıklamalar, öğretmen fotoğrafları ve öğretmen ile ders eşleştirmeleri geldiğinde buradaki taslak veriler güncellenmelidir.
- Her dersin detayında özgün Nazif görselini aşamalı olarak ortaya çıkaran bir tebeşir açılışı önizlemesi ve video yeri vardır. Gerçek ders videolarının açılışı ayrıca video dosyalarına uygulanmalıdır.
- Kullanıcının sağladığı görseller `public/nazif-chalk.png`, `public/nazif-portrait.png`, `public/fll-cover.png` ve `public/cymurghs-chalk-logo.png` dosyalarındadır. Girişte özgün Nazif çizimi SVG filtresiyle koyu arka planından ayrılır; tebeşir dokulu takım logosu da tahtada yer alır.
- `public/cymurghs-logo.png` ve sosyal bağlantılar [Cymurghs resmî sitesinden](https://www.cymurghs7466.com/) alınmıştır.

Görünen kurslar tasarım ve içerik taslağıdır; yayınlanmış eğitimler veya videolar olarak sunulmaz.
