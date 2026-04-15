# Animal App Frontend

Expo Router tabanli, React Native odakli bu temel kurulum; auth, bakici, hayvan sahibi, topluluk ve petshop domainlerini ayri moduller halinde buyutmek icin hazirlandi.

## Teknoloji tercihi

- Expo SDK `55.0.x`
- React Native `0.85.0`
- React `19.2.3`
- Expo Router, Zustand persist, React Query, React Hook Form, Zod

Expo'nun guncel stabil cizgisine uygun olacak sekilde package surumleri resmi Expo 55 template'ine yaklastirildi.

## Backend baglanti ayari

Expo config, backend taban URL bilgisini `EXPO_PUBLIC_API_BASE_URL` degiskeninden okur.

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

Notlar:

- Android emulator icin genelde: `http://10.0.2.2:3000/api`
- Fiziksel cihazda: `http://<bilgisayar-lan-ip>:3000/api`
- Degisken verilmezse uygulama gelistirme modunda host IP'yi algilamayi dener; bulamazsa Android'de `10.0.2.2`, diger ortamlarda `localhost` fallback'i kullanir.

## Kurulum

```bash
npm install
npm run start
```

## Klasor yapisi

```text
app/
  (auth)/                Auth rotalari
  (app)/                 Oturum sonrasi rotalar
src/
  core/                  Provider, query, storage, theme
  features/
    auth/
    caregiver/
    community/
    dashboard/
    owner/
    petshop/
    profile/
  shared/                Ortak UI ve mock veri
```

## Mevcut temel akislari

1. Kayit ol / giris yap
2. Bakici profil aktivasyonu
3. Hayvan sahibi bakici ariyorum akisi icin ayri sekme
4. Toplulukta ucretsiz mama ve sahiplendirme kartlari
5. Petshop modu aktivasyonu ve kampanya kartlari

## Sonraki genisleme alani

- Gercek API istemcisi ve sunucu entegrasyonu
- Rol bazli yetkilendirme ve basvuru durum yonetimi
- Medya yukleme, konum, sohbet ve bildirim akislari

## Hazir API temeli

- Typed HTTP client
- Token storage yardimcilari
- Auth, users, listings, community, pets ve media servis katmani
- React Query key factory

