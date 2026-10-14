# İlgi alanları ve ders önerileri

## Öğrenci akışı

Kayıt `/kayit` sayfasında üç adımdır: programlar → ilgi alanları → hesap bilgileri. FRC, FTC ve FLL birlikte seçilebilir. Mühendislik ve Business Management birlikte seçilebilir. Kararsız öğrenciler tercihleri atlayabilir; hesap bilgileri yalnızca son adımda gönderilir. Şifreler adımlar arasında tarayıcı depolamasına yazılmaz.

Kayıt tercihlerinin Supabase Auth metadata'sına gönderilmesinin nedeni, henüz e-posta doğrulaması yapılmadan oturum olmamasıdır. `handle_new_student` trigger'ı desteklenen değerleri süzüp `profiles` tablosuna kaydeder. Öneriler için asıl kaynak bu tablodur; sonradan değiştirilen tercihler metadata'dan geri yüklenmez.

Oturum açmış öğrenciler `/hesabim` ve ana sayfada önerileri görür. `/ilgi-alanlarim` tercih düzenleme sayfasıdır. Boş tercihler genel keşif önerileri gösterir. Mevcut üyeler yeniden kayıt olmadan bu sayfadan seçim yapabilir.

## Dosya sorumlulukları

| Konum | Sorumluluk |
| --- | --- |
| `src/features/auth/pages/RegisterPage.tsx` | Kayıt adımları ve e-posta doğrulama bekleme ekranı |
| `src/features/interests/types.ts` | Sabit program/alan kimlikleri ve normalizasyon |
| `src/features/interests/components/InterestChoices.tsx` | Çoklu seçim ve tercih özeti |
| `src/features/interests/PreferencesProvider.tsx` | Oturuma bağlı profil yükleme, güncelleme, hata ve tekrar deneme |
| `src/features/interests/preferencesService.ts` | Supabase profil okuma/yazma; kullanıcı kimliği filtresi |
| `src/features/interests/pages/InterestsPage.tsx` | Tercih düzenleme, kaydetme ve iptal |
| `src/features/recommendations/recommendLessons.ts` | Saf, test edilebilir öneri seçimi |
| `src/features/recommendations/components/RecommendationsSection.tsx` | Hesap/ana sayfa önerileri ve boş/yüklenme/hata durumları |
| `supabase/migrations/*_learning_preferences.sql` | Tercih sütunları, doğrulamalar ve kayıt trigger'ı |

## Öneri mantığı

Bu sürüm, öğrencinin açıkça seçtiği ilgi alanlarıyla mevcut kataloğu eşleştirir. İzleme geçmişi, beceri seviyesi veya yapay zekâ tahmini kullanmaz.

1. Program seçildiyse sadece o programların dersleri alınır.
2. Alan seçildiyse sadece o alanların dersleri alınır. Kategori eşlemesi çevrilmiş başlıklarla değil sabit route slug'larıyla yapılır. FLL robot yapımı/programlama mühendislik; özdeğerler/proje takım ve proje yönetimi alanındadır.
3. Geçerli kategori bağlantısı olmayan dersler ve yinelenen kimlikler elenir.
4. Video adresi olan dersler önce değerlendirilir. Seçilen program/alan çiftlerine yer açılır; uzun bir FRC listesi FLL veya Business Management seçimlerini gizlemez. Ardından kategori çeşitliliği için bir kategoriden ikinci ders gelmeden diğer uygun kategoriler gösterilir.
5. En fazla dört ders gösterilir. Uygun ders yoksa başka programın dersiyle doldurulmaz. İçeriği olmayan programlar açıkça belirtilir; videosu olmayan dersler “İçerik hazırlanıyor” olarak gösterilir.

Gerçek YouTube videolarını mevcut katalogdaki `youtubeVideoId` alanına ekleyebilirsiniz. Yeni dersler `useCatalog` üzerinden otomatik olarak öneri havuzuna girer. Yeni eğitim kategorisi eklerken `areasByCategory` eşlemesini de güncelleyin. Daha ayrıntılı ilgi etiketleri veya geçmişe dayanan öneriler aynı feature altında geliştirilebilir.

## Veritabanı ve yetkilendirme

`profiles.interest_programs` ve `profiles.focus_areas`, izin verilen kimliklerden oluşan metin dizileridir. Boş dizi geçerlidir. Bilinmeyen değerler ve NULL öğeler tablo kısıtlarıyla reddedilir; kayıt metadata'sındaki hatalı değerler güvenle süzülür. Eski profiller boş tercihlerle korunur.

Mevcut RLS politikaları geçerlidir: öğrenci sadece kendi profilini okuyup güncelleyebilir. Güncelleme izni yalnızca ad ve tercih sütunlarındadır; kimlik/tarih değiştirilemez. Metadata yetkilendirme amacıyla kullanılmaz.

## Doğrulama

Canlı `ProfNazif-Test` projesine `20261014190439_learning_preferences` migration'ı uygulandı. Yerel dosya sürümü Supabase migration geçmişiyle eşleştirildi.

Yeni tablo/RLS sorunu bulunmadı. Supabase güvenlik advisor'ı mevcut Auth ayarındaki sızmış şifre kontrolünün kapalı olduğunu bildirdi. Bu kontrol mevcut Free planın üstündeki planlarda sunulur; bu değişiklikte plan yükseltilmedi veya Auth güvenlik ayarları azaltılmadı. [Supabase şifre güvenliği ve sızmış şifre denetimi](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

- `npm test`: tercihler, program/alan kesişimi, boş katalog, çeşitlilik, geçerli route'lar ve PostgreSQL kısıtları/RLS.
- `npm run build`: TypeScript ve üretim derlemesi.
- Tarayıcı kontrolleri gerçek hesap açmadan yerel test servisiyle yapılır. Masaüstü/açık ve mobil/karanlık tema; dört dil; adımlar arasında geri dönüş, şifre eşleşmesi, tercih kalıcılığı, kaydetme hatasından kurtarma, eksik FTC içeriği, ana sayfa önerileri ve tercihler atlanarak kayıt kontrol edilir.

İsteğe bağlı yerel tarayıcı testi için bir terminalde `node tests/fixtures/auth-server.mjs` çalıştırın. İkinci terminalde:

```sh
VITE_SUPABASE_URL=http://127.0.0.1:54329 VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_browser_fixture npm run dev -- --host 127.0.0.1 --port 4176 --strictPort
```

Fixture yalnızca 127.0.0.1 üzerinde, bellekte çalışır. Gerçek Supabase hesabı veya e-posta oluşturmaz. Üretime deploy edilmez; varsayılan `dev`/`build` komutlarında kullanılmaz. Sahte hesapla yapılan tarayıcı kontrolü gerçek e-posta tesliminin testi değildir.
