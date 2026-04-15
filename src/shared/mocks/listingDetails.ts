import { caregiverListings, ownerRequests, petshopCampaigns } from "./marketplace";

type DetailMeta = {
  icon:
    | "map-marker-outline"
    | "calendar-range"
    | "cash"
    | "clock-outline"
    | "paw-outline"
    | "storefront-outline"
    | "sale-outline";
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

type TrustSignal = {
  description: string;
  label: string;
  state: "verified" | "pending" | "rejected" | "unverified";
};

type OwnerSummary = {
  description: string;
  headline: string;
  location: string;
  name: string;
};

export type CaregiverListingDetail = {
  description: string[];
  id: string;
  info: DetailMeta[];
  owner: OwnerSummary;
  similarIds: string[];
  subtitle: string;
  title: string;
  trustSignals: TrustSignal[];
};

export type OwnerRequestDetail = {
  description: string[];
  id: string;
  info: DetailMeta[];
  owner: OwnerSummary;
  similarIds: string[];
  subtitle: string;
  title: string;
  trustSignals: TrustSignal[];
};

export type PetshopCampaignDetail = {
  description: string[];
  id: string;
  info: DetailMeta[];
  managementNote: string;
  owner: OwnerSummary;
  similarIds: string[];
  storeId: string;
  subtitle: string;
  title: string;
  trustSignals: TrustSignal[];
};

export const caregiverListingDetails: Record<string, CaregiverListingDetail> = {
  "cg-1": {
    description: [
      "Evde bakim, gunluk raporlama ve ilac takibi ayni akista ilerler. Rutin bozulmadan ilerlemek isteyen aileler icin net bir hizmet cizgisi sunar.",
      "Ozellikle duzenli geri bildirim bekleyen kullanicilar icin guven veren, sakin ve programli bir profil yapisi vardir."
    ],
    id: "cg-1",
    info: [
      { icon: "map-marker-outline", label: "Istanbul / Kadikoy", tone: "neutral" },
      { icon: "calendar-range", label: "Hafta ici yarim gun", tone: "primary" },
      { icon: "cash", label: "5.000 - 7.500 TL", tone: "success" },
      { icon: "clock-outline", label: "Gunluk raporlama", tone: "warning" }
    ],
    owner: {
      description:
        "Asili takip, ilac rutini ve gun sonu bilgilendirmesi konularinda disiplinli calisir.",
      headline: "Dogrulanmis bakici profili",
      location: "Istanbul",
      name: "Derya Acar"
    },
    similarIds: ["cg-2", "cg-3"],
    subtitle: "Bakici Ilani",
    title: "Deneyimli evde bakici",
    trustSignals: [
      {
        description: "Kimlik ve temel profil bilgileri dogrulanmis.",
        label: "Profil dogrulamasi",
        state: "verified"
      },
      {
        description: "Takvim bilgisi guncel tutuluyor.",
        label: "Uygunluk guncelligi",
        state: "verified"
      },
      {
        description: "Hizmet kapsami ve gunluk akis net sekilde belirtilmis.",
        label: "Net hizmet kapsami",
        state: "verified"
      }
    ]
  },
  "cg-2": {
    description: [
      "Uzun sureli seyahatlerde yatili bakim, ilac takibi ve gece rutini sunan daha premium bir hizmet paketi vardir.",
      "Ozellikle konaklamali destek arayan kullanicilar icin ayrintili planlama ve once gorusme onceliklidir."
    ],
    id: "cg-2",
    info: [
      { icon: "map-marker-outline", label: "Ankara / Cankaya", tone: "neutral" },
      { icon: "calendar-range", label: "Haftalik plan", tone: "primary" },
      { icon: "cash", label: "8.000 - 12.000 TL", tone: "success" },
      { icon: "clock-outline", label: "Esnek uygunluk", tone: "warning" }
    ],
    owner: {
      description:
        "Yatili bakim, uzun sureli planlama ve once gorusme gerektiren taleplerde deneyimlidir.",
      headline: "Yatili bakim odakli bakici",
      location: "Ankara",
      name: "Baris Tan"
    },
    similarIds: ["cg-1", "cg-3"],
    subtitle: "Bakici Ilani",
    title: "Yatili bakim destegi",
    trustSignals: [
      {
        description: "Profil temel olarak hazir ancak musaitlik dogrulamasi bekleniyor.",
        label: "Profil incelemede",
        state: "pending"
      },
      {
        description: "Hizmet kapsami net girilmis.",
        label: "Hizmet netligi",
        state: "verified"
      },
      {
        description: "Konaklamali bakim deneyimi belirtilmis.",
        label: "Deneyim bilgisi",
        state: "verified"
      }
    ]
  },
  "cg-3": {
    description: [
      "Kediler icin gunluk ziyaret, mama-su-kum takibi ve fotograflu bilgilendirme yapan duzenli bir destek profili.",
      "Kisa sureli ama aksatilmamasi gereken ziyaretler icin sakin ve kontrollu bir akisa sahiptir."
    ],
    id: "cg-3",
    info: [
      { icon: "map-marker-outline", label: "Izmir / Bornova", tone: "neutral" },
      { icon: "calendar-range", label: "Gunluk ziyaret", tone: "primary" },
      { icon: "cash", label: "2.400 - 3.200 TL", tone: "success" },
      { icon: "paw-outline", label: "Kedi odakli", tone: "warning" }
    ],
    owner: {
      description:
        "Ozellikle kediler ve kisa rutin takibi isteyen aileler icin uygun bir profil akisi sunar.",
      headline: "Kedi odakli bakici",
      location: "Izmir",
      name: "Selin Yalcin"
    },
    similarIds: ["cg-1", "cg-2"],
    subtitle: "Bakici Ilani",
    title: "Kedi odakli gunluk ziyaret",
    trustSignals: [
      {
        description: "Profil ve iletisim bilgileri dogrulanmis.",
        label: "Hesap guveni",
        state: "verified"
      },
      {
        description: "Ayni gun donus beklentisine uygun hizli yanit veriyor.",
        label: "Hizli geri donus",
        state: "verified"
      },
      {
        description: "Hizmet kapsami sade ve net tanimlanmis.",
        label: "Acik hizmet kapsamı",
        state: "verified"
      }
    ]
  }
};

export const ownerRequestDetails: Record<string, OwnerRequestDetail> = {
  "ow-1": {
    description: [
      "Hafta sonu iki gun boyunca Golden icin gezdirme, beslenme ve temel oyun rutini destegi araniyor.",
      "Kullanici duzenli iletisim ve seans sonu kisa bilgilendirme bekliyor."
    ],
    id: "ow-1",
    info: [
      { icon: "paw-outline", label: "Kopek", tone: "primary" },
      { icon: "calendar-range", label: "26-27 Nisan", tone: "warning" },
      { icon: "map-marker-outline", label: "Izmir / 2,4 km", tone: "neutral" },
      { icon: "cash", label: "3.500 TL", tone: "success" }
    ],
    owner: {
      description:
        "Daha once de bakici destegi kullanan, beklentilerini net yazan bir evcil hayvan sahibi.",
      headline: "Planli bakim talebi",
      location: "Izmir",
      name: "Cem Arin"
    },
    similarIds: ["ow-2", "ow-3"],
    subtitle: "Bakici Ariyorum",
    title: "Golden icin hafta sonu bakici ariyorum",
    trustSignals: [
      {
        description: "Tarih, butce ve temel beklentiler net sekilde paylasilmis.",
        label: "Net ilan bilgisi",
        state: "verified"
      },
      {
        description: "Konum dogrulandi, plan tarihi belirli.",
        label: "Plan dogrulandi",
        state: "verified"
      },
      {
        description: "Ilk kez yeni bir bakici ariyor.",
        label: "Yeni eslesme",
        state: "pending"
      }
    ]
  },
  "ow-2": {
    description: [
      "Iki kedi icin 10 gun boyunca gunluk kontrol, mama-su takibi ve kisa oyun rutini isteniyor.",
      "Ozellikle duzenli fotograf guncellemesi ve sessiz bir hizmet akisi bekleniyor."
    ],
    id: "ow-2",
    info: [
      { icon: "paw-outline", label: "Kedi", tone: "primary" },
      { icon: "calendar-range", label: "10 gunluk plan", tone: "warning" },
      { icon: "map-marker-outline", label: "Bursa / 5,1 km", tone: "neutral" },
      { icon: "cash", label: "2.200 TL", tone: "success" }
    ],
    owner: {
      description:
        "Yurt disi seyahatinde kedilerin rutininin bozulmamasini isteyen dikkatli bir kullanici.",
      headline: "Fotograf guncellemesi oncelikli",
      location: "Bursa",
      name: "Mert Aydin"
    },
    similarIds: ["ow-1", "ow-3"],
    subtitle: "Bakici Ariyorum",
    title: "Iki kediye gunluk kontrol",
    trustSignals: [
      {
        description: "Ilan beklentileri net tanimlanmis.",
        label: "Net beklenti",
        state: "verified"
      },
      {
        description: "Takvim ve butce hazir.",
        label: "Takvim hazir",
        state: "verified"
      },
      {
        description: "Bakici secim sureci devam ediyor.",
        label: "Basvuru acik",
        state: "pending"
      }
    ]
  },
  "ow-3": {
    description: [
      "Muhabbet kusu icin 5 gunluk yem degisimi ve kisa kafes temizligi destegi isteniyor.",
      "Gunluk ziyaret kisa sureli olacak ancak duzenli saat onemli."
    ],
    id: "ow-3",
    info: [
      { icon: "paw-outline", label: "Kus", tone: "primary" },
      { icon: "calendar-range", label: "Bu hafta", tone: "warning" },
      { icon: "map-marker-outline", label: "Istanbul / 1,1 km", tone: "neutral" },
      { icon: "cash", label: "1.200 TL", tone: "success" }
    ],
    owner: {
      description:
        "Kisa ama duzenli ziyaret gerektiren bir talep. Dakik ve sakin calisma bekleniyor.",
      headline: "Rutin odakli talep",
      location: "Istanbul",
      name: "Seda Onur"
    },
    similarIds: ["ow-1", "ow-2"],
    subtitle: "Bakici Ariyorum",
    title: "Muhabbet kusu icin gunluk ziyaret",
    trustSignals: [
      {
        description: "Tarih ve beklentiler belirgin.",
        label: "Talep netligi",
        state: "verified"
      },
      {
        description: "Konum bilgisi eklendi.",
        label: "Konum acik",
        state: "verified"
      },
      {
        description: "Eslesme icin gorusme bekleniyor.",
        label: "Gorusme asamasi",
        state: "pending"
      }
    ]
  }
};

export const petshopCampaignDetails: Record<string, PetshopCampaignDetail> = {
  "ps-1": {
    description: [
      "Premium mama serisinde sezon kampanyasi sunuluyor. Ayni gun teslimat ve belirli paketlerde ek indirim var.",
      "Kampanya stoğa bagli ilerliyor, detayli urun bilgisi ve teslimat secenekleri magaza tarafindan hizli donuluyor."
    ],
    id: "ps-1",
    info: [
      { icon: "storefront-outline", label: "Pati Market", tone: "primary" },
      { icon: "sale-outline", label: "%20 indirim", tone: "warning" },
      { icon: "cash", label: "799 TL", tone: "success" },
      { icon: "clock-outline", label: "3 gun kaldi", tone: "neutral" }
    ],
    managementNote:
      "Kampanya yonetimi, dogrulanmis petshop moduna sahip hesaplar icin acilir.",
    owner: {
      description:
        "Hizli teslimat ve guvenli stok bilgisini one cikan, aktif kampanya yoneten petshop profili.",
      headline: "Dogrulanmis magaza profili",
      location: "Istanbul",
      name: "Pati Market"
    },
    similarIds: ["ps-2", "ps-3"],
    storeId: "store-1",
    subtitle: "Petshop Kampanyasi",
    title: "Premium mama bahar kampanyasi",
    trustSignals: [
      {
        description: "Magaza profili ve kampanya bilgisi dogrulanmis.",
        label: "Magaza dogrulamasi",
        state: "verified"
      },
      {
        description: "Teslimat ve stok bilgisi guncel.",
        label: "Stok guncelligi",
        state: "verified"
      },
      {
        description: "Kampanya suresi sinirli.",
        label: "Son tarih aktif",
        state: "pending"
      }
    ]
  },
  "ps-2": {
    description: [
      "Tasma ve oyuncak setinde sezon indirimi var. Kampanya stoklarla sinirli ve paket bazli ilerliyor.",
      "Magaza, paket icerigini ve teslimat kosullarini mesaj uzerinden hizli paylasiyor."
    ],
    id: "ps-2",
    info: [
      { icon: "storefront-outline", label: "Miyav Store", tone: "primary" },
      { icon: "sale-outline", label: "%15 indirim", tone: "warning" },
      { icon: "cash", label: "549 TL", tone: "success" },
      { icon: "clock-outline", label: "Hafta sonuna kadar", tone: "neutral" }
    ],
    managementNote:
      "Bu kampanyayi guncellemek veya yonetmek icin dogrulanmis petshop modu gerekir.",
    owner: {
      description:
        "Aksesuar kategorisinde guclu kampanyalar acan, gorsel sunumu duzenli bir magaza.",
      headline: "Aksesuar odakli kampanya profili",
      location: "Ankara",
      name: "Miyav Store"
    },
    similarIds: ["ps-1", "ps-3"],
    storeId: "store-2",
    subtitle: "Petshop Kampanyasi",
    title: "Tasma ve oyuncak seti",
    trustSignals: [
      {
        description: "Magaza profili aktif.",
        label: "Magaza guveni",
        state: "verified"
      },
      {
        description: "Kampanya son tarihi tanimli.",
        label: "Sure siniri",
        state: "pending"
      },
      {
        description: "Gorsel ve fiyat bilgisi acik.",
        label: "Net fiyat bilgisi",
        state: "verified"
      }
    ]
  },
  "ps-3": {
    description: [
      "Mini irk kopek mamasi icin kisa sureli stok temizleme kampanyasi acik. Stok durumu gunluk guncelleniyor.",
      "Kampanya daha uygun fiyat ve hizli teslimat beklentisi olan kullanicilar icin hazirlandi."
    ],
    id: "ps-3",
    info: [
      { icon: "storefront-outline", label: "Dost Petshop", tone: "primary" },
      { icon: "sale-outline", label: "%10 indirim", tone: "warning" },
      { icon: "cash", label: "459 TL", tone: "success" },
      { icon: "clock-outline", label: "Son 48 saat", tone: "neutral" }
    ],
    managementNote:
      "Kampanya uzerinde yonetici islemleri yalnizca yetkili petshop modunda acilir.",
    owner: {
      description:
        "Mini irk urun gaminda hizli kampanya acan ve kullanici sorularina hizli donen bir magaza profili.",
      headline: "Mini irk urun kampanyasi",
      location: "Izmir",
      name: "Dost Petshop"
    },
    similarIds: ["ps-1", "ps-2"],
    storeId: "store-3",
    subtitle: "Petshop Kampanyasi",
    title: "Mini irk kuru mama paketi",
    trustSignals: [
      {
        description: "Magaza dogrulanmis.",
        label: "Profil dogrulamasi",
        state: "verified"
      },
      {
        description: "Kampanya kisa sureli oldugu icin stok degisimi hizli olabilir.",
        label: "Dinamik stok",
        state: "pending"
      },
      {
        description: "Fiyat ve son tarih belirtilmis.",
        label: "Net kampanya kosulu",
        state: "verified"
      }
    ]
  }
};

export function getSimilarCaregiverListings(ids: string[]) {
  return caregiverListings.filter((item) => ids.includes(item.id));
}

export function getSimilarOwnerRequests(ids: string[]) {
  return ownerRequests.filter((item) => ids.includes(item.id));
}

export function getSimilarPetshopCampaigns(ids: string[]) {
  return petshopCampaigns.filter((item) => ids.includes(item.id));
}
