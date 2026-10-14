# Supabase / PostgreSQL üyelik kurulumu

## Kapsam

Kayıt, e-posta doğrulama, giriş, çıkış, şifre sıfırlama ve oturum kalıcılığı uygulanmıştır. Uygulama örnek hesap veya sahte oturum oluşturmaz.

## Mevcut bağlantı — 14 Ekim 2026

- Supabase projesi: `ProfNazif-Test` (`dsojqqywohmmuhfmhnmz`).
- Yayın: https://profesor-nazif.vercel.app — Vercel bağlantı değişkenleri production, preview ve development ortamlarına eklendi; yayın yenilendi.
- `20261014173655_profiles.sql` migration'ı uygulandı. Dosyanın sürümü canlı migration geçmişiyle aynıdır; bu projede tekrar çalıştırmayın.
- E-posta ile giriş ve kayıt açık, e-posta doğrulama zorunlu, minimum şifre 8 karakter. Anonim hesap açma kapalıdır.
- Site URL ve yalnızca `/auth/callback` yolu için yayın/yerel dönüş izinleri kaydedildi. Rastgele Vercel preview alan adlarına dönüş izni verilmedi.
- Yerel bağlantı `.env.local` içindedir ve Git tarafından yok sayılır. Yeni ekip üyeleri kendi yerel dosyalarını aşağıdaki adımlarla oluşturabilir.
- Kullanıcı kararıyla **e-posta gönderimi test aşamasında** bırakıldı. Özel SMTP bağlı değildir. Varsayılan gönderici yalnızca Supabase organizasyonu ekibindeki adreslere doğrulama/yenileme e-postası gönderebilir; genel kullanıma açmadan önce SMTP gerekir.

Canlı kontrol: Auth ayarları HTTP 200 döndü, geçersiz giriş doğru biçimde reddedildi, anonim profil okuma engellendi. İşlem sonunda geri alınan iki geçici kayıtla profil trigger'ı, yalnızca kendi profilini görme/değiştirme ve başka kullanıcının profilini değiştirememe canlı PostgreSQL üzerinde doğrulandı; test hesabı kalmadı. Güvenlik advisor'ı uyarı vermedi. Gerçek e-posta teslimi ve e-postadan başlayan doğrulama/şifre yenileme henüz uçtan uca test edilmedi.

İzleme ilerlemesi, sertifika bildirimi, öneriler, Google ile giriş ve video erişim entegrasyonu bu değişikliğin kapsamında değildir. Yalnızca sayfa saklamak veya bir oynatıcıyı frontend'de gizlemek sunucu yetkilendirmesi yerine geçmez.

## 1. Projeyi oluşturun

Supabase Dashboard'da proje açın. Veritabanı şifresini güvenli tutun; frontend'e eklemeyin.

Yeni bir Supabase projesi için SQL Editor'da `supabase/migrations/20261014173655_profiles.sql` dosyasını bir kez çalıştırın. Daha sonra migration dosyalarını sırayla versiyonlayın; aynı migration'ı tekrar çalıştırmayın. Yukarıda belirtilen mevcut projede bu adım tamamlanmıştır.

Migration:

- Kimliği `auth.users` kaydına bağlı `public.profiles` tablosu oluşturur.
- Yeni kullanıcı için profil oluşturur; mevcut kullanıcıları da doldurur.
- Her öğrenciye yalnızca kendi profilini okuma ve kendi `full_name` alanını değiştirme izni verir.
- Anonim erişimi, istemciden profil ekleme/silmeyi, kimlik/tarih değiştirmeyi kapatır.
- Şifre veya rol alanı tutmaz; kimlik doğrulama Supabase Auth'a aittir.

## 2. Frontend bağlantısı

`.env.example` dosyasını `.env.local` olarak kopyalayın. Projenin Connect bölümünden şu iki değeri alın:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
```

Eski projelerde `anon` anahtarı da kabul edilir. `sb_secret_*` veya `service_role` anahtarı kullanmayın. Vite yapılandırma kontrolü, yanlış türde anahtarla build veya dev başlangıcını durdurur.

Yerel geliştirme sunucusunu yeniden başlatın. Vercel için aynı değişkenleri projenin Environment Variables bölümüne ekleyip yeniden deploy edin. `.env.local` Git'e gönderilmez.

API katalog adresi `VITE_API_BASE_URL` bundan bağımsızdır; üyelik eklemek mevcut ders verisi akışını değiştirmez.

## 3. Auth ve e-posta ayarları

Authentication ayarlarında Email sağlayıcısını açın; e-posta doğrulamasını açık tutun. Minimum şifre uzunluğunu en az 8 yapın. Kayıt formu da en az 8 karakter ister; daha sıkı sunucu politikaları ayrıca uygulanabilir.

Site URL'yi gerçek yayın adresinize ayarlayın. Redirect URL listesine yerel geliştirme ve gerçek yayın alan adınızın `/auth/callback` adresini, uygulamanın `next` sorgusunu da kapsayacak biçimde ekleyin. Örnek izin listesi (kendi alan adınızı kullanın):

```text
http://localhost:5173/auth/callback**
http://127.0.0.1:4174/auth/callback**
https://YOUR_SITE_DOMAIN/auth/callback**
```

Buradaki wildcard yalnızca callback adresinin sonundaki `next` sorgusunu kapsamak içindir; bütün üretim alan adına `/**` izni vermeyin. Vercel preview adreslerini kullanıyorsanız gerekli adresleri ayrıca izin listesine alın.

Standart Supabase e-posta şablonlarını koruyun (`ConfirmationURL`). Uygulama PKCE ile callback'teki tek kullanımlık kodu oturuma dönüştürür. Doğrulama ve şifre sıfırlama e-postasını isteği başlattığınız aynı tarayıcıda açın. Farklı tarayıcı/cihazda kod doğrulaması çalışmaz; yeniden bağlantı isteyin.

Herkese açık kayıt doğrulama ve şifre sıfırlama için kendi SMTP hizmetinizi bağlayın. Supabase'in varsayılan göndericisi test amaçlıdır ve proje ekibindeki adreslerle sınırlıdır. Ücretsiz Supabase planında da özel SMTP bağlanabilir. SMTP parolaları yalnızca Supabase ayarlarında tutulur.

## Dosya sorumlulukları

| Dosya | Görev |
| --- | --- |
| `src/lib/supabase.ts` | Tek resmi SDK istemcisi, kalıcılık, token yenileme, PKCE |
| `src/features/auth/authConfig.ts` | Tarayıcıya uygun URL/anahtar kontrolü |
| `src/features/auth/AuthProvider.tsx` | Ortak oturum, yüklenme/hata durumu, sekmeler arası değişimler |
| `src/features/auth/authService.ts` | Kayıt/giriş/çıkış, e-posta ve callback işlemleri |
| `src/features/auth/authHelpers.ts` | Yerel hata metinleri ve güvenli dönüş adresleri |
| `src/features/auth/pages/` | Form, callback ve hesap ekranları |
| `src/features/auth/components/` | Ortak form alanları, durumlar ve navbar hesabı |
| `supabase/migrations/` | PostgreSQL tablo, trigger ve RLS izinleri |

Kullanıcıya ait görünen ad Supabase Auth metadata'sından okunur. Profil tablosu kayıt sırasında aynı adla oluşturulur. İleride ad düzenleme eklenirse iki kaydı servis katmanında birlikte güncelleyin; metadata'yı yetki/rol kaynağı olarak kullanmayın.

## Rotalar

- `/kayit`: öğrenci hesabı oluşturma.
- `/giris`: giriş; güvenli `next` parametresiyle önceki site sayfasına dönme.
- `/sifremi-unuttum`: e-postayla yenileme bağlantısı isteme.
- `/auth/callback`: e-posta doğrulama ve şifre yenileme callback'i.
- `/sifre-yenile`: geçerli oturumla yeni şifre belirleme.
- `/hesabim`: hesap özeti ve çıkış; oturum yoksa giriş sayfasına yönlendirilir.

## Doğrulama

`npm test` yapılandırmayı, güvenli yönlendirmeleri ve migration'ın PostgreSQL motorunda (PGlite) profil izolasyonunu kontrol eder. PGlite yalnızca geliştirme/test bağımlılığıdır; uygulamaya veya üretim veritabanına eklenmez.

Gerçek bir test e-postasıyla kayıt → doğrulama → giriş → yenilemede oturum → şifre sıfırlama → çıkış akışını ayrıca kontrol edin. Genel kullanıma geçerken SMTP'yi bağlayın ve takım dışındaki bir test adresiyle de deneyin. Önceki yerel tarayıcı testlerinde Supabase HTTP cevapları taklit edildi; bunlar canlı e-posta teslimini doğrulamaz. Bu projedeki canlı kontroller yukarıda ayrı listelenmiştir.

## Kaynaklar

- [Supabase React Auth](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Şifre tabanlı giriş](https://supabase.com/docs/guides/auth/passwords)
- [Profil yönetimi](https://supabase.com/docs/guides/auth/managing-user-data)
- [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
- [Redirect URL ayarları](https://supabase.com/docs/guides/auth/redirect-urls)
- [SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
