import type { Href } from "expo-router";

import type { CreateWizardValues } from "../../create/schemas";

export type LocalPetshopCampaignStatus = "ACTIVE" | "DRAFT";

export type LocalPetshopCampaign = {
  campaignLabel: string;
  campaignType: CreateWizardValues["petshopCampaignType"];
  city: string;
  coverImageUri?: string;
  createdAt: string;
  creatorId: string;
  deadline: string;
  description: string;
  discount: string;
  district: string;
  id: string;
  mediaUrls: string[];
  priceLabel: string;
  status: LocalPetshopCampaignStatus;
  storeId: string;
  storeName: string;
  title: string;
  updatedAt: string;
  verificationState: "verified" | "pending" | "rejected" | "unverified";
  visualLabel: string;
};

type BuildLocalPetshopCampaignInput = {
  creatorId: string;
  mediaUrls: string[];
  values: CreateWizardValues;
};

const campaignTypeLabels: Record<NonNullable<CreateWizardValues["petshopCampaignType"]>, string> = {
  aksesuar: "Aksesuar Kampanyası",
  bakim: "Bakım Fırsatı",
  mama: "Mama Fırsatı",
  saglik: "Sağlık Kampanyası"
};

export function createLocalPetshopCampaign({
  creatorId,
  mediaUrls,
  values
}: BuildLocalPetshopCampaignInput): LocalPetshopCampaign {
  const timestamp = new Date().toISOString();
  const campaignType = values.petshopCampaignType ?? "mama";

  return {
    campaignLabel: values.petshopCampaignBadge || "Yeni kampanya",
    campaignType,
    city: values.city ?? "",
    coverImageUri: mediaUrls[0],
    createdAt: timestamp,
    creatorId,
    deadline: values.petshopDeadline ?? "",
    description: values.description ?? "",
    discount: values.petshopDiscount ?? "",
    district: values.district ?? "",
    id: `local-petshop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    mediaUrls,
    priceLabel: values.petshopPrice ?? "",
    status: "ACTIVE",
    storeId: `local-store-${creatorId}`,
    storeName: values.petshopStoreName ?? "",
    title: values.title ?? "",
    updatedAt: timestamp,
    verificationState: "verified",
    visualLabel: campaignTypeLabels[campaignType]
  };
}

type PetshopCampaignLike = {
  city?: string;
  description?: string;
  deadline?: string;
  discount?: string;
  district?: string;
  priceLabel?: string;
  storeName?: string;
  title?: string;
};

export function buildLocalPetshopCampaignDetail(
  campaign: PetshopCampaignLike,
  managementHref: Href
) {
  return {
    description: [campaign.description ?? ""],
    info: [
      { icon: "storefront-outline" as const, label: campaign.storeName ?? "Petshop", tone: "primary" as const },
      { icon: "sale-outline" as const, label: campaign.discount ?? "", tone: "warning" as const },
      { icon: "cash" as const, label: campaign.priceLabel ?? "", tone: "success" as const },
      { icon: "clock-outline" as const, label: campaign.deadline ?? "", tone: "neutral" as const }
    ],
    managementNote: "Bu kampanya uygulama içinde yerel olarak kaydedildi ve petshop yönetim ekranından takip edilebilir.",
    owner: {
      description: `${campaign.storeName ?? "Petshop"} mağazası için oluşturulan kampanya.`,
      headline: "Petshop Kampanyası",
      location: [campaign.city, campaign.district].filter(Boolean).join(" / ") || "Konum belirtilmemiş",
      name: campaign.storeName ?? "Petshop"
    },
    primaryActionHref: managementHref,
    subtitle: "Petshop Kampanyası",
    title: campaign.title ?? "Petshop Kampanyası",
    trustSignals: [
      {
        description: "Kampanya bu hesap üzerinden oluşturuldu ve mağaza ekranlarına bağlandı.",
        label: "Yayın bağlantısı hazır",
        state: "verified" as const
      },
      {
        description: "Görsel, fiyat ve kampanya etiketi birlikte kaydedildi.",
        label: "Kampanya bilgileri tamam",
        state: "verified" as const
      }
    ]
  };
}
