export const applicationItems = [
  {
    id: "app-1",
    kind: "caregiver-listing",
    listingId: "cg-1",
    location: "Istanbul / Kadikoy",
    note: "Gorusme asamasi bekleniyor.",
    owner: "Ece Demir",
    priceLabel: "5.000 - 7.500 TL",
    status: "pending",
    title: "Deneyimli evde bakıcı",
    type: "Bakıcı İlanı",
    updatedAt: "Bugun"
  },
  {
    id: "app-2",
    kind: "caregiver-listing",
    listingId: "cg-2",
    location: "Ankara / Cankaya",
    note: "On gorusme olumlu tamamlandi.",
    owner: "Ayse Karaca",
    priceLabel: "8.000 - 12.000 TL",
    status: "accepted",
    title: "Yatili bakim destegi",
    type: "Bakıcı İlanı",
    updatedAt: "2 gun once"
  },
  {
    id: "app-3",
    kind: "owner-request",
    listingId: "ow-2",
    location: "Bursa / 5,1 km",
    note: "Yeni adayla ilerleme tercih edildi.",
    owner: "Mert Aydin",
    priceLabel: "2.200 TL",
    status: "rejected",
    title: "Iki kediye gunluk kontrol",
    type: "Bakıcı Arıyorum",
    updatedAt: "Gecen hafta"
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
    updatedAt: "Bugun",
    views: 24
  },
  {
    applications: 1,
    id: "lst-2",
    kind: "caregiver-listing",
    listingId: "cg-2",
    status: "passive",
    title: "Hafta sonu kopek gezdirme destegi",
    type: "Bakıcı İlanı",
    updatedAt: "3 gun once",
    views: 11
  },
  {
    applications: 0,
    id: "lst-3",
    kind: "community-post",
    listingId: "cm-1",
    status: "draft",
    title: "Topluluk mama destegi duyurusu",
    type: "Topluluk Paylasimi",
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
    subtitle: "Istanbul - 5.000 / 7.500 TL",
    title: "Deneyimli evde bakıcı"
  },
  {
    id: "sv-2",
    kind: "petshop-campaign",
    listingId: "ps-1",
    statusLabel: "Petshop Kampanyasi",
    subtitle: "Pati Market - %20 indirim",
    title: "Premium mama bahar kampanyasi"
  },
  {
    id: "sv-3",
    kind: "community-post",
    listingId: "cm-2",
    statusLabel: "Topluluk",
    subtitle: "Istanbul - Sahiplendirme",
    title: "Yuva arayan tekir"
  }
] as const;
