# Admin hesabı ve içerik yönetimi

## İlk admin hesabını açmak

1. Sitede normal **Kayıt ol** akışıyla hesabını oluştur. E-posta doğrulaması açıksa doğrula. Test e-posta gönderimi kısıtlıysa Supabase Dashboard → Authentication → Users → Add user ile kendi hesabını oluşturabilirsin; gerçek parolanı yalnızca bu güvenilir ekranda gir.
2. Supabase projesinde **Authentication → Users** ekranından kendi hesabının **User UID** değerini kopyala.
3. **SQL Editor → New query** aç. Aşağıdaki UUID alanını kopyaladığın değerle değiştir ve çalıştır:

```sql
insert into public.user_roles (user_id, role)
values ('BURAYA-KENDI-USER-UID-DEGERIN', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

4. Sitede giriş yapıp sayfayı yenile. **Hesabım → İçerik yönetimi** bağlantısı görünür. Doğrudan `/admin` adresi de açılır.

Bunu yalnızca Supabase proje sahibi / veritabanını yönetebilen ekip üyesi yapabilir. Normal kayıt ekranında admin seçeneği yoktur. Hesap meta verisine `role=admin` yazmak yetki vermez. Panel üzerinden başka hesaplara admin yetkisi verilmez.

Yetki kaldırmak için SQL Editor:

```sql
delete from public.user_roles where user_id = 'ADMININ-USER-UID-DEGERI';
```

Sonraki yazma/yükleme isteği hemen engellenir; panel de sayfa yenileme veya odaklanma sonrası yetkiyi yeniden kontrol eder.

## Ders eklemek

1. `/admin` → **Yeni ders**.
2. **Program ve kategori** seç: örneğin **FLL / Programlama**.
3. Başlık, kısa açıklama ve ders içeriğini gir.
4. YouTube paylaşım bağlantısını, `https://www.youtube.com/embed/...` adresini veya iframe kodunu yapıştır. Sistem yalnızca YouTube video kimliğini ayıklar; yapıştırdığın HTML'i çalıştırmaz.
5. Gerçek video süresini `dakika:saniye` biçiminde gir. Örneğin 1 dakika 54 saniye için `1:54`. `saat:dakika:saniye` veya toplam saniye de kabul edilir. Bu değer izleme yüzdesinde kullanılır.
6. **Alıştırma PDF’i** alanından en fazla 10 MB PDF seç. Dosya özel Supabase Storage alanına yüklenir.
7. **Kategori içindeki sıra** küçük olan ders önce görünür. Eşit sayılarda ders kimliği sıralaması uygulanır.
8. **Taslak kaydet** öğrencilerden gizler. **Yayımla**, video+süre+PDF tamam olduğunda dersi açar. Yayımlanınca **Dersi sitede aç** bağlantısıyla kontrol et.

Örnek video bağlantın `https://www.youtube.com/embed/EhA8PaoGqfE` ve süresi `1:54`. Kendi PDF'ini seçip yayımla. Bu örnek otomatik olarak üretim sitesine eklenmemiştir.

Mevcut bir dersi soldaki listeden açıp metnini, PDF'ini ve sırasını güncelleyebilirsin. **Yayından kaldır ve kaydet**, katalog ve materyal erişimini kapatır. Bir kere yayımlanmış videonun kimliği/süresi değiştirilmez; farklı video için yeni ders oluştur. Öğrencilerin önceki ilerlemesi ve kazanılmış tamamlama kayıtları silinmez. Kategori, ders ilk kaydedildikten sonra değişmez.

Başlangıçtaki dokuz örnek açıklama, önceki görünümü korumak için katalogda listelenir; materyalleri henüz yayımlanmamıştır. Panelde taslak olarak görülürler. Taslak kaydetmek bu açıklamayı da katalogdan gizler.

## Ekip için kod haritası

- `src/features/admin/`: rol kontrolü, yönetim paneli, doğrulama ve Supabase işlemleri.
- `src/features/catalog/catalogService.ts`: Supabase `lesson_catalog` tablosundan herkese açık açıklamaları okur. Bağlantısız geliştirmede mock dosyalarını kullanır. Yapılandırılmış Supabase hata verirse sessizce mock veriye dönmez.
- `supabase/migrations/*_admin_content.sql`: roller, katalog, özel kategori eşlemesi, yükleme kuralları ve atomik kaydetme işlemi.
- `public.user_roles`: yalnızca proje sahibinin atadığı adminler; kullanıcılar sadece kendi rol satırını okuyabilir.
- `public.lesson_catalog`: açıklama ve sıralama. YouTube kimliği/PDF yolu içermez. Katalogda yalnızca `is_listed=true` satırlar görünür.
- `public.lesson_materials`: giriş gerektiren, yayımlanmış YouTube kimliği, süre ve PDF yolu.
- `storage` / `lesson-exercises`: özel PDF alanı. Adminler benzersiz yollarla yükler; öğrenciler yalnızca yayımlanmış dosyalar için süreli indirme bağlantısı alır.
- `admin_save_lesson`: sunucuda her istekte rol kontrolü, kategori doğrulama, ders+materyal+kurs üyeliğini tek işlemde kaydetme. Eşzamanlı düzenleme çakışması halinde tekrar açılması gerekir.
- `tests/admin-database.test.ts`: gerçek PostgreSQL motorunda rol yükseltme, öğrenci erişimi, PDF kuralları, taslak/yayın, ilerleme ve yetki kaldırma testleri.

PDF yükleme ile veritabanı kaydı iki ayrı ağ isteğidir. Kayıt başarısız olursa form yüklü PDF'i tekrar kullanır. Yanıt kaybolursa aynı ders kimliği ikinci bir ders oluşturulmasını engeller; listeyi yenileyip dersi aç. Terk edilen formlardaki ilişkisiz PDF'ler Storage'da kalabilir; proje sahibi daha sonra temizleyebilir. Referans verilen PDF'ler panel yetkileriyle silinemez, üzerine yazma yetkisi verilmez. Üretimde test hesabı veya hazır admin kullanıcı oluşturulmamıştır.

Yeni içerikler girilen dilde görünür. Başlangıç derslerinin dört dildeki çevirileri korunur; metinleri değiştirilen derslerde yanlış çeviri göstermemek için eski çeviriler kaldırılır. Panel etiketleri Türkçe, İngilizce, Çince ve Hiligaynon destekler.

Supabase güvenlik referansları: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage erişim kuralları](https://supabase.com/docs/guides/storage/security/access-control).
