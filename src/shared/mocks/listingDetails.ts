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
      "Evde bakım, günlük raporlama ve ilaç takibi aynı akışta ilerler. Rutin bozulmadan ilerlemek isteyen aileler için net bir hizmet çizgisi sunar.",
      "Özellikle düzenli geri bildirim bekleyen kullanıcılar için güven veren, sakin ve programlı bir profil yapısı vardır."
    ],
    id: "cg-1",
    info: [
      { icon: "map-marker-outline", label: "İstanbul / Kadıköy", tone: "neutral" },
      { icon: "calendar-range", label: "Hafta içi yarım gün", tone: "primary" },
      { icon: "cash", label: "5.000 - 7.500 TL", tone: "success" },
      { icon: "clock-outline", label: "Günlük raporlama", tone: "warning" }
    ],
    owner: {
      description:
        "Asılı takip, ilaç rutini ve gün sonu bilgilendirmesi konularında disiplinli çalışır.",
      headline: "Doğrulanmış bakıcı profili",
      location: "Istanbul",
      name: "Derya Acar"
    },
    similarIds: ["cg-2", "cg-3"],
    subtitle: "Bakıcı İlanı",
    title: "Deneyimli evde bakıcı",
    trustSignals: [
      {
        description: "Kimlik ve temel profil bilgileri doğrulanmış.",
        label: "Profil doğrulaması",
        state: "verified"
      },
      {
        description: "Takvim bilgisi güncel tutuluyor.",
        label: "Uygunluk güncelliği",
        state: "verified"
      },
      {
        description: "Hizmet kapsamı ve günlük akış net şekilde belirtilmiş.",
        label: "Net hizmet kapsamı",
        state: "verified"
      }
    ]
  },
  "cg-2": {
    description: [
      "Uzun süreli seyahatlerde yatılı bakım, ilaç takibi ve gece rutini sunan daha premium bir hizmet paketi vardır.",
      "Özellikle konaklamalı destek arayan kullanıcılar için ayrıntılı planlama ve önce görüşme önceliklidir."
    ],
    id: "cg-2",
    info: [
      { icon: "map-marker-outline", label: "Ankara / Cankaya", tone: "neutral" },
      { icon: "calendar-range", label: "Haftalık plan", tone: "primary" },
      { icon: "cash", label: "8.000 - 12.000 TL", tone: "success" },
      { icon: "clock-outline", label: "Esnek uygunluk", tone: "warning" }
    ],
    owner: {
      description:
        "Yatılı bakım, uzun süreli planlama ve önce görüşme gerektiren taleplerde deneyimlidir.",
      headline: "Yatılı bakım odaklı bakıcı",
      location: "Ankara",
      name: "Baris Tan"
    },
    similarIds: ["cg-1", "cg-3"],
    subtitle: "Bakıcı İlanı",
    title: "Yatılı bakım desteği",
    trustSignals: [
      {
        description: "Profil temel olarak hazır ancak müsaitlik doğrulaması bekleniyor.",
        label: "Profil incelemede",
        state: "pending"
      },
      {
        description: "Hizmet kapsamı net girilmiş.",
        label: "Hizmet netliği",
        state: "verified"
      },
      {
        description: "Konaklamalı bakım deneyimi belirtilmiş.",
        label: "Deneyim bilgisi",
        state: "verified"
      }
    ]
  },
  "cg-3": {
    description: [
      "Kediler için günlük ziyaret, mama-su-kum takibi ve fotoğraflı bilgilendirme yapan düzenli bir destek profili.",
      "Kısa süreli ama aksatılmaması gereken ziyaretler için sakin ve kontrollü bir akışa sahiptir."
    ],
    id: "cg-3",
    info: [
      { icon: "map-marker-outline", label: "Izmir / Bornova", tone: "neutral" },
      { icon: "calendar-range", label: "Günlük ziyaret", tone: "primary" },
      { icon: "cash", label: "2.400 - 3.200 TL", tone: "success" },
      { icon: "paw-outline", label: "Kedi odaklı", tone: "warning" }
    ],
    owner: {
      description:
        "Özellikle kediler ve kısa rutin takibi isteyen aileler için uygun bir profil akışı sunar.",
      headline: "Kedi odaklı bakıcı",
      location: "Izmir",
      name: "Selin Yalcin"
    },
    similarIds: ["cg-1", "cg-2"],
    subtitle: "Bakıcı İlanı",
    title: "Kedi odaklı günlük ziyaret",
    trustSignals: [
      {
        description: "Profil ve iletişim bilgileri doğrulanmış.",
        label: "Hesap güveni",
        state: "verified"
      },
      {
        description: "Aynı gün dönüş beklentisine uygun hızlı yanıt veriyor.",
        label: "Hızlı geri dönüş",
        state: "verified"
      },
      {
        description: "Hizmet kapsamı sade ve net tanımlanmış.",
        label: "Açık hizmet kapsamı",
        state: "verified"
      }
    ]
  }
};

export const ownerRequestDetails: Record<string, OwnerRequestDetail> = {
  "ow-1": {
    description: [
      "Hafta sonu iki gün boyunca Golden için gezdirme, beslenme ve temel oyun rutini desteği aranıyor.",
      "Kullanıcı düzenli iletişim ve seans sonu kısa bilgilendirme bekliyor."
    ],
    id: "ow-1",
    info: [
      { icon: "paw-outline", label: "Köpek", tone: "primary" },
      { icon: "calendar-range", label: "26-27 Nisan", tone: "warning" },
      { icon: "map-marker-outline", label: "Izmir / 2,4 km", tone: "neutral" },
      { icon: "cash", label: "3.500 TL", tone: "success" }
    ],
    owner: {
      description:
        "Daha önce de bakıcı desteği kullanan, beklentilerini net yazan bir evcil hayvan sahibi.",
      headline: "Planlı bakım talebi",
      location: "Izmir",
      name: "Cem Arin"
    },
    similarIds: ["ow-2", "ow-3"],
    subtitle: "Bakıcı Arıyorum",
    title: "Golden için hafta sonu bakıcı arıyorum",
    trustSignals: [
      {
        description: "Tarih, bütçe ve temel beklentiler net şekilde paylaşılmış.",
        label: "Net ilan bilgisi",
        state: "verified"
      },
      {
        description: "Konum doğrulandı, plan tarihi belirli.",
        label: "Plan doğrulandı",
        state: "verified"
      },
      {
        description: "İlk kez yeni bir bakıcı arıyor.",
        label: "Yeni eşleşme",
        state: "pending"
      }
    ]
  },
  "ow-2": {
    description: [
      "İki kedi için 10 gün boyunca günlük kontrol, mama-su takibi ve kısa oyun rutini isteniyor.",
      "Özellikle düzenli fotoğraf güncellemesi ve sessiz bir hizmet akışı bekleniyor."
    ],
    id: "ow-2",
    info: [
      { icon: "paw-outline", label: "Kedi", tone: "primary" },
      { icon: "calendar-range", label: "10 günlük plan", tone: "warning" },
      { icon: "map-marker-outline", label: "Bursa / 5,1 km", tone: "neutral" },
      { icon: "cash", label: "2.200 TL", tone: "success" }
    ],
    owner: {
      description:
        "Yurt dışı seyahatinde kedilerin rutininin bozulmamasını isteyen dikkatli bir kullanıcı.",
      headline: "Fotoğraf güncellemesi öncelikli",
      location: "Bursa",
      name: "Mert Aydin"
    },
    similarIds: ["ow-1", "ow-3"],
    subtitle: "Bakıcı Arıyorum",
    title: "İki kediye günlük kontrol",
    trustSignals: [
      {
        description: "İlan beklentileri net tanımlanmış.",
        label: "Net beklenti",
        state: "verified"
      },
      {
        description: "Takvim ve bütçe hazır.",
        label: "Takvim hazır",
        state: "verified"
      },
      {
        description: "Bakıcı seçim süreci devam ediyor.",
        label: "Başvuru açık",
        state: "pending"
      }
    ]
  },
  "ow-3": {
    description: [
      "Muhabbet kuşu için 5 günlük yem değişimi ve kısa kafes temizliği desteği isteniyor.",
      "Günlük ziyaret kısa süreli olacak ancak düzenli saat önemli."
    ],
    id: "ow-3",
    info: [
      { icon: "paw-outline", label: "Kuş", tone: "primary" },
      { icon: "calendar-range", label: "Bu hafta", tone: "warning" },
      { icon: "map-marker-outline", label: "İstanbul / 1,1 km", tone: "neutral" },
      { icon: "cash", label: "1.200 TL", tone: "success" }
    ],
    owner: {
      description:
        "Kısa ama düzenli ziyaret gerektiren bir talep. Dakik ve sakin çalışma bekleniyor.",
      headline: "Rutin odaklı talep",
      location: "Istanbul",
      name: "Seda Onur"
    },
    similarIds: ["ow-1", "ow-2"],
    subtitle: "Bakıcı Arıyorum",
    title: "Muhabbet kuşu için günlük ziyaret",
    trustSignals: [
      {
        description: "Tarih ve beklentiler belirgin.",
        label: "Talep netliği",
        state: "verified"
      },
      {
        description: "Konum bilgisi eklendi.",
        label: "Konum açık",
        state: "verified"
      },
      {
        description: "Eşleşme için görüşme bekleniyor.",
        label: "Görüşme aşaması",
        state: "pending"
      }
    ]
  }
};

export const petshopCampaignDetails: Record<string, PetshopCampaignDetail> = {
  "ps-1": {
    description: [
      "Premium mama serisinde sezon kampanyası sunuluyor. Aynı gün teslimat ve belirli paketlerde ek indirim var.",
      "Kampanya stoğa bağlı ilerliyor, detaylı ürün bilgisi ve teslimat seçenekleri mağaza tarafından hızlı dönülüyor."
    ],
    id: "ps-1",
    info: [
      { icon: "storefront-outline", label: "Pati Market", tone: "primary" },
      { icon: "sale-outline", label: "%20 indirim", tone: "warning" },
      { icon: "cash", label: "799 TL", tone: "success" },
      { icon: "clock-outline", label: "3 gün kaldı", tone: "neutral" }
    ],
    managementNote:
      "Kampanya yönetimi, doğrulanmış petshop moduna sahip hesaplar için açılır.",
    owner: {
      description:
        "Hızlı teslimat ve güvenli stok bilgisini öne çıkaran, aktif kampanya yöneten petshop profili.",
      headline: "Doğrulanmış mağaza profili",
      location: "Istanbul",
      name: "Pati Market"
    },
    similarIds: ["ps-2", "ps-3"],
    storeId: "store-1",
    subtitle: "Petshop Kampanyası",
    title: "Premium mama bahar kampanyası",
    trustSignals: [
      {
        description: "Mağaza profili ve kampanya bilgisi doğrulanmış.",
        label: "Mağaza doğrulaması",
        state: "verified"
      },
      {
        description: "Teslimat ve stok bilgisi güncel.",
        label: "Stok güncelliği",
        state: "verified"
      },
      {
        description: "Kampanya süresi sınırlı.",
        label: "Son tarih aktif",
        state: "pending"
      }
    ]
  },
  "ps-2": {
    description: [
      "Tasma ve oyuncak setinde sezon indirimi var. Kampanya stoklarla sınırlı ve paket bazlı ilerliyor.",
      "Mağaza, paket içeriğini ve teslimat koşullarını mesaj üzerinden hızlı paylaşıyor."
    ],
    id: "ps-2",
    info: [
      { icon: "storefront-outline", label: "Miyav Store", tone: "primary" },
      { icon: "sale-outline", label: "%15 indirim", tone: "warning" },
      { icon: "cash", label: "549 TL", tone: "success" },
      { icon: "clock-outline", label: "Hafta sonuna kadar", tone: "neutral" }
    ],
    managementNote:
      "Bu kampanyayı güncellemek veya yönetmek için doğrulanmış petshop modu gerekir.",
    owner: {
      description:
        "Aksesuar kategorisinde güçlü kampanyalar açan, görsel sunumu düzenli bir mağaza.",
      headline: "Aksesuar odaklı kampanya profili",
      location: "Ankara",
      name: "Miyav Store"
    },
    similarIds: ["ps-1", "ps-3"],
    storeId: "store-2",
    subtitle: "Petshop Kampanyası",
    title: "Tasma ve oyuncak seti",
    trustSignals: [
      {
        description: "Mağaza profili aktif.",
        label: "Mağaza güveni",
        state: "verified"
      },
      {
        description: "Kampanya son tarihi tanımlı.",
        label: "Süre sınırı",
        state: "pending"
      },
      {
        description: "Görsel ve fiyat bilgisi açık.",
        label: "Net fiyat bilgisi",
        state: "verified"
      }
    ]
  },
  "ps-3": {
    description: [
      "Mini ırk köpek maması için kısa süreli stok temizleme kampanyası açık. Stok durumu günlük güncelleniyor.",
      "Kampanya daha uygun fiyat ve hızlı teslimat beklentisi olan kullanıcılar için hazırlandı."
    ],
    id: "ps-3",
    info: [
      { icon: "storefront-outline", label: "Dost Petshop", tone: "primary" },
      { icon: "sale-outline", label: "%10 indirim", tone: "warning" },
      { icon: "cash", label: "459 TL", tone: "success" },
      { icon: "clock-outline", label: "Son 48 saat", tone: "neutral" }
    ],
    managementNote:
      "Kampanya üzerinde yönetici işlemleri yalnızca yetkili petshop modunda açılır.",
    owner: {
      description:
        "Mini ırk ürün gamında hızlı kampanya açan ve kullanıcı sorularına hızlı dönen bir mağaza profili.",
      headline: "Mini ırk ürün kampanyası",
      location: "Izmir",
      name: "Dost Petshop"
    },
    similarIds: ["ps-1", "ps-2"],
    storeId: "store-3",
    subtitle: "Petshop Kampanyası",
    title: "Mini ırk kuru mama paketi",
    trustSignals: [
      {
        description: "Mağaza doğrulanmış.",
        label: "Profil doğrulaması",
        state: "verified"
      },
      {
        description: "Kampanya kısa süreli olduğu için stok değişimi hızlı olabilir.",
        label: "Dinamik stok",
        state: "pending"
      },
      {
        description: "Fiyat ve son tarih belirtilmiş.",
        label: "Net kampanya koşulu",
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
