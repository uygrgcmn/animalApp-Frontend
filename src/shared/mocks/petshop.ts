import { petshopCampaigns } from "./marketplace";

export type PetshopStoreProfile = {
  campaignIds: string[];
  city: string;
  district: string;
  id: string;
  responseRate: string;
  responseTime: string;
  storeName: string;
  tagline: string;
  summary: string;
  trustNotes: string[];
  verifiedState: "verified" | "pending" | "rejected" | "unverified";
};

export const petshopStores: PetshopStoreProfile[] = [
  {
    campaignIds: ["ps-1"],
    city: "Istanbul",
    district: "Kadikoy",
    id: "store-1",
    responseRate: "%96 geri donus",
    responseTime: "Ortalama 18 dk",
    storeName: "Pati Market",
    tagline: "Premium mama ve hizli teslimat odakli magaza",
    summary:
      "Mamalar, hijyen urunleri ve ayni gun teslimat odakli kampanyalarla guven veren bir magaza profili. Kurumsal tonunu korurken uygulamanin genel diline uyumlu kalir.",
    trustNotes: [
      "Magaza dogrulama belgeleri aktif.",
      "Teslimat ve stok bilgileri gunluk guncelleniyor.",
      "Musteri mesajlarina hizli geri donus sagliyor."
    ],
    verifiedState: "verified"
  },
  {
    campaignIds: ["ps-2"],
    city: "Ankara",
    district: "Cankaya",
    id: "store-2",
    responseRate: "%91 geri donus",
    responseTime: "Ortalama 24 dk",
    storeName: "Miyav Store",
    tagline: "Aksesuar ve sezon kampanyalari odakli vitrin",
    summary:
      "Aksesuar kategorisinde duzenli kampanyalar acan, urun sunumunu temiz gorsellerle destekleyen magaza. Kisa sureli kampanyalarda hizli iletisim one cikiyor.",
    trustNotes: [
      "Kampanya sartlari net yaziliyor.",
      "Gorsel ve fiyat bilgisi tutarli.",
      "Destek hattina hizli ulasilabiliyor."
    ],
    verifiedState: "verified"
  },
  {
    campaignIds: ["ps-3"],
    city: "Izmir",
    district: "Bornova",
    id: "store-3",
    responseRate: "%88 geri donus",
    responseTime: "Ortalama 31 dk",
    storeName: "Dost Petshop",
    tagline: "Kisa sureli firsatlar ve stok odakli kampanya dili",
    summary:
      "Stok bazli kampanyalari hizli acan ve mini irk urunlerinde guclu secenekler sunan bir magaza profili. Acik kampanya kosullari ile guven vermeyi hedefler.",
    trustNotes: [
      "Stok kampanyalari aktif takip ediliyor.",
      "Kampanya kosullari acik belirtiliyor.",
      "Mesajlasma ile teslimat detaylari hizli netlesiyor."
    ],
    verifiedState: "pending"
  }
];

export const managedPetshopCampaigns = [
  {
    campaignId: "ps-1",
    impressions: "12.4K",
    messageCount: 34,
    status: "aktif",
    savedCount: 128
  },
  {
    campaignId: "ps-2",
    impressions: "8.1K",
    messageCount: 19,
    status: "taslak",
    savedCount: 74
  },
  {
    campaignId: "ps-3",
    impressions: "6.7K",
    messageCount: 14,
    status: "pasif",
    savedCount: 51
  }
] as const;

export const petshopPerformanceSummary = {
  conversion: "%7.8 etkileşim",
  monthlyViews: "27.2K aylik goruntulenme",
  unreadMessages: 11,
  verificationLabel: "Belge ve magaza kimligi guncel"
};

export function getStoreById(storeId: string) {
  return petshopStores.find((item) => item.id === storeId);
}

export function getStoreByName(storeName: string) {
  return petshopStores.find((item) => item.storeName === storeName);
}

export function getCampaignsByStore(storeId: string) {
  const store = getStoreById(storeId);

  if (!store) {
    return [];
  }

  return petshopCampaigns.filter((item) => store.campaignIds.includes(item.id));
}

export function getManagedCampaignRows() {
  return managedPetshopCampaigns.map((item) => {
    const campaign = petshopCampaigns.find((campaignItem) => campaignItem.id === item.campaignId);

    return {
      ...item,
      campaign
    };
  });
}
