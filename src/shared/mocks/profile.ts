export const applicationItems = [
  {
    id: "app-1",
    kind: "caregiver-listing",
    listingId: "cg-1",
    location: "İstanbul / Kadıköy",
    note: "Görüşme aşaması bekleniyor.",
    owner: "Ece Demir",
    priceLabel: "5.000 - 7.500 TL",
    status: "pending",
    title: "Deneyimli evde bakıcı",
    type: "Bakıcı İlanı",
    updatedAt: "Bugün"
  },
  {
    id: "app-2",
    kind: "caregiver-listing",
    listingId: "cg-2",
    location: "Ankara / Çankaya",
    note: "Ön görüşme olumlu tamamlandı.",
    owner: "Ayşe Karaca",
    priceLabel: "8.000 - 12.000 TL",
    status: "accepted",
    title: "Yatılı bakım desteği",
    type: "Bakıcı İlanı",
    updatedAt: "2 gün önce"
  },
  {
    id: "app-3",
    kind: "owner-request",
    listingId: "ow-2",
    location: "Bursa / 5,1 km",
    note: "Yeni adayla ilerleme tercih edildi.",
    owner: "Mert Aydın",
    priceLabel: "2.200 TL",
    status: "rejected",
    title: "İki kediye günlük kontrol",
    type: "Bakıcı Arıyorum",
    updatedAt: "Geçen hafta"
  }
] as const;

export const listingItems = [
  {
    applications: 4,
    id: "lst-1",
    kind: "caregiver-listing",
    listingId: "cg-1",
    status: "active",
    title: "Deneyimli evde bakıcı",
    type: "Bakıcı İlanı",
    updatedAt: "Bugün",
    views: 24
  },
  {
    applications: 1,
    id: "lst-2",
    kind: "caregiver-listing",
    listingId: "cg-2",
    status: "passive",
    title: "Hafta sonu köpek gezdirme desteği",
    type: "Bakıcı İlanı",
    updatedAt: "3 gün önce",
    views: 11
  },
  {
    applications: 0,
    id: "lst-3",
    kind: "community-post",
    listingId: "cm-1",
    status: "draft",
    title: "Topluluk mama desteği duyurusu",
    type: "Topluluk Paylaşımı",
    updatedAt: "Taslak",
    views: 0
  }
] as const;

export const savedItems = [
  {
    id: "sv-1",
    kind: "caregiver-listing",
    listingId: "cg-1",
    statusLabel: "Bakıcı İlanı",
    subtitle: "İstanbul - 5.000 / 7.500 TL",
    title: "Deneyimli evde bakıcı"
  },
  {
    id: "sv-2",
    kind: "petshop-campaign",
    listingId: "ps-1",
    statusLabel: "Petshop Kampanyası",
    subtitle: "Pati Market - %20 indirim",
    title: "Premium mama bahar kampanyası"
  },
  {
    id: "sv-3",
    kind: "community-post",
    listingId: "cm-2",
    statusLabel: "Topluluk",
    subtitle: "İstanbul - Sahiplendirme",
    title: "Yuva arayan tekir"
  }
] as const;
