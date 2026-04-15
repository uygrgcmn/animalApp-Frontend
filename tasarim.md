# Frontend Tasarim ve UX Anayasasi

Bu dokuman, uygulamanin tum ekranlari icin kalici tasarim, navigasyon ve UX standartlarini tanimlar. Bundan sonra uretilecek her ekran, bilesen ve akis bu dosyaya sadik kalinarak gelistirilir.

## 1. Urun Ozeti

Uygulama, **tek hesap + acilabilir modlar** mantigi ile calisir. Her kullanici tek bir hesapla sisteme girer; ihtiyacina gore standart kullanici deneyimini kullanir, bakici modunu aktive eder veya petshop modunu dogrulatir.

Temel mod yapisi:

- **Standart kullanici:** Toplulugu kullanabilir, ilanlari goruntuleyebilir, kesif yapabilir ve temel profil islemlerini yonetebilir.
- **Bakici modu:** Bakici ilanlarina basvuru yapabilmek icin aktif olmali; gerekli profil bilgileri eksiksiz tamamlanmis olmalidir.
- **Petshop modu:** Petshop kampanyasi veya ticari ilan paylasabilmek icin dogrulanmis olmalidir.

Topluluk bolumu, tum kullanicilar tarafindan ortak kullanilan sosyal ve destek odakli alandir. Ancak mod bazli ticari veya profesyonel aksiyonlar, ilgili kosullar saglanmadan acilmamalidir.

Uygulama deneyimi; kullaniciyi modlar arasinda kaybettirmeyen, hangi ozelligin neden kapali oldugunu net gosteren ve engellemek yerine bir sonraki dogru adima yonlendiren bir yapi uzerine kurulur.

## 2. Tasarim Prensipleri

Uygulamanin genel hissi:

- Modern
- Temiz
- Guven veren
- Profesyonel
- Uretime hazir mobil kalite

Tasarim dili:

- Cocuksu olmamali
- Asiri renkli olmamali
- Gorsel karmasa yaratmamali
- Her ekranda ayni sistem hissini korumali

Ana ilkeler:

- **Bol beyaz alan:** Icerik nefes almali, ekranlar kalabalik gorunmemeli.
- **Guclu tipografi:** Baslik, alt baslik, govde ve yardimci metin hiyerarsisi net olmali.
- **Net CTA yapisi:** Her ekranda ana aksiyon acikca belli olmali; ikincil aksiyonlar onunla yarismamali.
- **Kart tabanli yapi:** Liste, ozet, durum, ilan ve topluluk icerikleri kart tabanli sunulmali.
- **Tutarlilik:** Spacing, border radius, iconografi, buton dili ve input davranislari tum urunde ortak olmali.
- **Yonlendiren UX:** Kullaniciya sadece "yapamazsin" denmemeli; neden yapamadigi ve ne yaparsa devam edebilecegi acikca gosterilmeli.

## 3. Navigasyon Yapisi

Ana navigasyon, **bottom tab** tabanli bir yapida kurgulanir.

Bottom tab ana bolumleri:

1. **Ana Sayfa**
2. **Kesfet**
3. **Topluluk**
4. **Mesajlar**
5. **Profil**

Ek aksiyon yapisi:

- **Global create action / FAB:** Icerik uretimi veya ilan olusturma icin her zaman hizli erisilebilir bir global aksiyon bulunur.
- Bu aksiyon, tab yapisiyla yarismayacak; ama urunun ana degerlerinden biri olan "ilan olusturma" davranisini hizlandiracak sekilde konumlanir.

Navigasyon kurallari:

- Bottom tab, urunun ana omurgasidir.
- Alt seviye ekranlar stack mantigiyla acilmali; kullaniciyi ana tablar arasinda kaybettirmemelidir.
- Mod bazli akislar mevcut navigasyon yapisini bozmadan katmanli bicimde acilmalidir.
- Her ekran, geldigi baglamin neresinde oldugunu kullaniciya hissettirmelidir.

## 4. Ekran Aileleri

Uygulama asagidaki ana ekran ailelerinden olusur:

### Auth
- Giris yap
- Kayit ol
- Sifre yenileme / dogrulama yardim akislari

### Onboarding
- Uygulama degeri anlatimi
- Mod mantigi tanitimi
- Ilk kurulum ve yonlendirme

### Ana Sayfa
- Kullanicinin genel ozet ekranidir
- Mod durumu, ozet kartlar, hizli aksiyonlar ve kisilestirilmis alanlar burada yer alir

### Kesfet
- Ilanlar, filtreler, arama ve kategori bazli kesif deneyimi burada yasanir

### Ilan Detay
- Bir ilanin tum detaylari, guven unsurlari, durum bilgisi ve aksiyonlari bu ekranda toplanir

### Basvuru Akisi
- Bakici ilanina veya ilgili deneyime basvuru sureci adimlandirilmis ve net olmalidir

### Ilan Olusturma Wizard
- Uzun ve kritik veri girisi gerektiren ilan olusturma surecleri tek ekran yerine adim adim ilerlemelidir

### Topluluk
- Sosyal destek, sahiplendirme, yardimlasma ve topluluk paylasimlari burada sunulur

### Petshop
- Ticari kampanyalar, urun odakli kartlar ve dogrulanmis isletme deneyimi burada toplanir

### Mesajlar
- Kullanici ile kullanici veya kullanici ile ilgili akisin devam ettigi sohbet ve mesajlasma alani

### Profil
- Kullanici kimligi, mod durumu, dogrulama seviyesi ve kisisel yonetim alanlari

### Ayarlar
- Hesap, bildirim, guvenlik, tercih ve teknik ayarlar

## 5. Ortak Bilesenler

Tum urunde tekrar kullanilacak ortak bilesen seti:

- **AppHeader:** Sayfa basligi, geri aksiyonu, sag ust aksiyonlari ve baglam bilgisini tasir.
- **SearchBar:** Arama girisi icin sade, okunakli ve filtrelerle uyumlu bir ust bilesen.
- **FilterChip:** Secilebilir filtre etiketleri; aktif/pasif durumlari net olmali.
- **SegmentedTabs:** Ekran ici kategori veya durum gecisleri icin kullanilir.
- **ListingCard:** Ilan ozetlerinin ana kart yapisi.
- **CommunityCard:** Topluluk icerikleri icin sosyal ama temiz kart dili.
- **PetshopCampaignCard:** Fiyat, kampanya, guven ve CTA dengesini tasiyan ticari kart.
- **VerificationBadge:** Dogrulanmis hesap, mod veya guven durumunu gosterir.
- **ModeStatusCard:** Standart / bakici / petshop mod durumunu aciklar ve yonlendirir.
- **EmptyState:** Bos liste veya sonuc olmayan alanlarda kullaniciya net yonlendirme verir.
- **StickyBottomActionBar:** Kritik form ve detay ekranlarinda ana aksiyonu sabit tutar.
- **SectionHeader:** Baslik, aciklama ve gerekirse sag aksiyonla bolum hiyerarsisi kurar.
- **FormSection:** Uzun formlari mantikli alt gruplara ayirir.
- **UploadBox:** Gorsel veya belge yukleme alanlari icin kullanilir.
- **StatusPill:** Kisa durum etiketleri icin kullanilir.

Bu bilesenlerin her biri, tekrar tasarlanmak yerine sistem mantigiyla gelistirilmeli ve tum urunde ayni dili korumalidir.

## 6. Gorsel Stil

Tasarim sistemi temel gorsel kurallari:

- **8pt grid:** Tum spacing kararlarinda 8 tabanli sistem esas alinmali.
- **Yumusak koseler:** Kartlar, butonlar, inputlar ve modal yapilar modern, yumusak radius degerleri kullanmali.
- **Hafif golgeler:** Sert ve agir shadow yerine temiz, ince ve premium hissiyat veren yuzey ayrimi tercih edilmeli.
- **Ana renk:** Guven veren modern bir ton secilmeli; abartili ve yorucu olmamali.
- **Yardimci renkler:** Basari, uyari ve hata durumlari semantik olarak ayrismali.
- **Acik arka plan:** Genel deneyim acik zemin uzerinde yuksek okunabilirlik sunmali.
- **Yuksek okunabilirlik:** Metin-kontrast iliskisi profesyonel mobil standartta olmali.

Iconografi:

- Ikonlar dekorasyon degil, bilgi mimarisinin parcasi olmali.
- Ayni kategoriye ait aksiyonlarda ayni ikon dili korunmali.
- Asiri buyuk, oyuncak gibi veya rastgele secilmis ikonlar kullanilmamali.

## 7. Ekran Bazli Kisa Kurallar

### Auth
1. Odak tek birincil aksiyon olmali.
2. Formlar kisa ve kaygi yaratmayacak kadar sade olmali.
3. Yardimci metinler gerektiginde kullanilmali, ekran yaziya bogulmamalidir.
4. Guven hissi veren baslik, alt aciklama ve net CTA yapisi korunmalidir.
5. Hata mesajlari teknik degil, yonlendirici olmali.
6. Alternatif aksiyonlar ana CTA ile yarismamalidir.

### Onboarding
1. Deger onerisi ilk bakista anlasilmali.
2. Ekranlar fazla metinle degil, net mesaj bloklariyla kurulmalidir.
3. Mod mantigi kafa karistirmadan anlatilmalidir.
4. Gecisler hizli, kolay ve atlanabilir mantikta tasarlanmalidir.
5. Son adimda kullanici bir sonraki dogru aksiyona yonlendirilmelidir.

### Ana Sayfa
1. Kullanicinin mevcut durumu tek bakista gorulmelidir.
2. Mod durumu net ve okunakli kartlarla sunulmalidir.
3. Hemen yapilabilecek aksiyonlar yukarida konumlanmalidir.
4. Kalabalik veri yigini yerine secilmis ozet bloklar kullanilmalidir.
5. Kisisellestirme, ancak okunabilirligi bozmayacak olcude uygulanmalidir.
6. Ana Sayfa, kullaniciyi urunun dogru bolumlerine dagitan merkez gorevi gormelidir.

### Kesfet
1. Arama ve filtre deneyimi ana omurgayi olusturmalidir.
2. Kartlar hizli taramaya uygun olmali.
3. Liste yogun ama boğucu olmamali.
4. Kategori, sehir, fiyat, durum gibi meta bilgiler iyi gruplanmalidir.
5. Scroll esnasinda kullanici baglamini kaybetmemelidir.
6. Bos sonuc durumlari alternatif yonlendirme icermelidir.

### Ilan Detay
1. Ilanin ana gorseli veya ana odak alani ustte guclu sekilde konumlanmalidir.
2. Guven unsurlari ve dogrulama bilgileri kolay fark edilmelidir.
3. Ana CTA her zaman acik secik olmalidir.
4. Icerik bloklari mantikli sira ile ilerlemelidir.
5. Fazla metin yerine sindirilmis bilgi bloklari kullanilmalidir.
6. Ilan detayinda kullanici bir sonraki karari rahat vermelidir.

### Basvuru Akisi
1. Akis adimlandirilmis olmalidir.
2. Kullanici her adimda nerede oldugunu bilmeli.
3. Gerekli bilgiler net ve az sayida blok halinde toplanmalidir.
4. Tamamlanmayan kosullar gizlenmemeli, acikca gosterilmelidir.
5. Basvuru CTA’si ancak dogru anda one cikmalidir.
6. Onay ve geri bildirim asamalari guven vermelidir.

### Ilan Olusturma Wizard
1. Uzun formlar bolunmus adimlar halinde ilerlemelidir.
2. Her adim tek bir konuya odaklanmalidir.
3. Kullanici ilerleme durumunu gormelidir.
4. Zorunlu alanlar net ayirt edilmelidir.
5. Yukleme alanlari sade ve hatasiz kullanilabilir olmalidir.
6. Son onizleme veya kontrol asamasi bulunmalidir.

### Topluluk
1. Daha sicak ama hala profesyonel bir ton korunmalidir.
2. Sosyal his ugruna tasarim dili bozulmamalidir.
3. Kategori ve durum bilgileri kolay taranmalidir.
4. Yardim ve sahiplendirme gibi hassas icerikler net ayrismalidir.
5. Icerik kartlari gereksiz kalabalik olmamalidir.
6. Etkilesim aksiyonlari sade tutulmalidir.

### Petshop
1. Ticari guven hissi net olmalidir.
2. Kampanya bilgisi, fiyat ve fayda hiyerarsisi iyi kurulmalidir.
3. Dogrulanmis isletme vurgusu gorunur olmalidir.
4. Kartlar profesyonel e-ticaret duygusu vermelidir.
5. CTA’ler satisa iten ama rahatsiz etmeyen dengede olmamalidir.
6. Ticari icerik ile topluluk dili birbirine karistirilmamalidir.

### Mesajlar
1. Mesaj listesi hizli taranabilir olmali.
2. Okunmamis / aktif / arsiv gibi durumlar net ayirt edilmelidir.
3. Sohbet ekranlari sade ve dikkat dagitmayacak kadar temiz olmalidir.
4. Giris alani kolay kullanilir ve erisilebilir olmalidir.
5. Tarih, durum ve iletim gibi meta bilgiler ikincil seviyede kalmalidir.

### Profil
1. Kullanici kimligi ve mod durumu ust bolumde net gosterilmelidir.
2. Dogrulama, tamamlanma ve eksik adimlar acikca sunulmalidir.
3. Mod gecisleri veya mod detaylari karisik olmamalidir.
4. Hizli ayarlar ve yonetim aksiyonlari gruplu sunulmalidir.
5. Kritik aksiyonlar dikkatli ama abartisiz vurgulanmalidir.

### Ayarlar
1. Ayarlar kategorilere ayrilmalidir.
2. Guvenlik, bildirim, hesap ve destek mantikli bloklar halinde sunulmalidir.
3. Kritik aksiyonlar kazara tetiklenmeyecek bicimde tasarlanmalidir.
4. Toggle, secim ve baglanti tipleri tutarli olmali.
5. Teknik ayarlar sade dille ifade edilmelidir.

## 8. Yasaklar

Asagidaki yaklasimlar urun genelinde uygulanmamalidir:

- Her ekranda farkli tasarim dili kullanmak
- Asiri sikisik layout kurmak
- Gereksiz renk patlamasi yaratmak
- Modlar arasi akisi birbirine karistirmak
- Uzun formlari tek sayfada bogucu hale getirmek
- Her ihtiyaci yeni bir bilesen tasarlayarak cozmeye calismak
- Ikonlari veya gorselleri sadece dekoratif doldurma amaciyla kullanmak
- CTA hiyerarsisini bozmak
- Gereksiz metin yukune sebep olmak

## Son Kural

Bu dosya, uygulamanin kalici tasarim ve UX referansidir. Bundan sonra uretilecek tum ekranlar, bilesenler ve navigasyon kararlarinda bu anayasa esas alinacaktir.
