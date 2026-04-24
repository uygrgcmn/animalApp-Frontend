import { useQuery } from "@tanstack/react-query";

import type {
  PetshopCampaignRecord,
  PetshopDashboardRecord,
  PetshopVerificationStatus,
  PetshopStoreRecord
} from "../../../core/api/contracts";
import { petshopsApi } from "../../../core/api/services/petshopsApi";
import { queryKeys } from "../../../core/query/queryKeys";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  getPrimaryMediaUrl,
  parseEmbeddedListingMetadata
} from "../../listings/utils/embeddedListingMetadata";

type VerificationState = "verified" | "pending" | "rejected" | "unverified";

export type PetshopStoreProfile = {
  address: string;
  campaignCount: number;
  city: string;
  district: string;
  id: string;
  phoneNumber: string;
  storeName: string;
  summary: string;
  totalParticipantCount: number;
  trustNotes: string[];
  verifiedState: VerificationState;
};

export type PetshopDiscoveryItem = {
  campaignLabel: string;
  city: string;
  coverImageUri?: string;
  createdAt: string;
  deadline: string;
  discount: string;
  district: string;
  id: string;
  mediaUrls: string[];
  participantCount: number;
  priceLabel: string;
  status: "aktif" | "pasif";
  store?: PetshopStoreProfile;
  storeId: string;
  storeName: string;
  summary: string;
  targetParticipantCount: number;
  title: string;
  updatedAt: string;
  verificationState: VerificationState;
  visualLabel?: string;
};

export type PetshopManagedCampaignRow = {
  campaign: PetshopDiscoveryItem;
  campaignId: string;
  participantCount: number;
  status: "aktif" | "pasif";
  targetParticipantCount: number;
};

export type PetshopDashboardData = {
  featuredCampaign?: PetshopDiscoveryItem;
  heroStore?: PetshopStoreProfile;
  managedRows: PetshopManagedCampaignRow[];
  summary: {
    activeCampaignCount: number;
    campaignCount: number;
    totalParticipantCount: number;
    unreadMessageCount: number;
  };
};

function mapVerificationState(
  status?: PetshopVerificationStatus
): VerificationState {
  if (status === "APPROVED") {
    return "verified";
  }

  if (status === "PENDING") {
    return "pending";
  }

  if (status === "REJECTED") {
    return "rejected";
  }

  return "unverified";
}

function toStoreProfile(store: PetshopStoreRecord | PetshopCampaignRecord["petshop"] | undefined): PetshopStoreProfile | undefined {
  if (!store) {
    return undefined;
  }

  const storeName = store.businessName?.trim() || "Petshop";
  const address = store.businessAddress?.trim() || "Adres belirtilmemiş";
  const phoneNumber = store.businessPhoneNumber?.trim() || "Telefon belirtilmemiş";
  const city = store.city?.trim() || "Konum belirtilmemiş";
  const district = store.district?.trim() || "";
  const campaigns =
    "campaigns" in store && Array.isArray(store.campaigns) ? store.campaigns.length : 0;
  const totalParticipantCount =
    "totalParticipantCount" in store && typeof store.totalParticipantCount === "number"
      ? store.totalParticipantCount
      : 0;

  const trustNotes = [
    mapVerificationState(store.petshopVerificationStatus) === "verified"
      ? "Mağaza doğrulaması onaylandı."
      : "Mağaza doğrulama süreci devam ediyor.",
    store.businessPhoneNumber?.trim()
      ? "İletişim telefonu mağaza profiline eklendi."
      : "İletişim telefonu henüz eklenmemiş.",
    campaigns > 0
      ? `${campaigns} aktif kampanya yayında.`
      : "Şu anda yayında aktif kampanya bulunmuyor."
  ];

  return {
    address,
    campaignCount: campaigns,
    city,
    district,
    id: store.id,
    phoneNumber,
    storeName,
    summary: `${storeName} mağazasının aktif kampanyaları ve mağaza bilgileri burada listelenir.`,
    totalParticipantCount,
    trustNotes,
    verifiedState: mapVerificationState(store.petshopVerificationStatus)
  };
}

function toDiscoveryItem(record: PetshopCampaignRecord): PetshopDiscoveryItem {
  const { description, metadata } = parseEmbeddedListingMetadata(record.description);
  const store = toStoreProfile(record.petshop);

  return {
    campaignLabel: metadata.campaignLabel ?? "Petshop Kampanyası",
    city: record.petshop?.city?.trim() || "Konum belirtilmemiş",
    coverImageUri: getPrimaryMediaUrl(metadata),
    createdAt: record.createdAt,
    deadline: metadata.deadlineLabel ?? "Süre belirtilmemiş",
    discount: metadata.discountLabel ?? "İndirim belirtilmemiş",
    district: record.petshop?.district?.trim() || "",
    id: record.id,
    mediaUrls: metadata.mediaUrls ?? [],
    participantCount: record.currentParticipantCount,
    priceLabel: metadata.priceLabel ?? "Fiyat belirtilmemiş",
    status: record.isActive ? "aktif" : "pasif",
    store,
    storeId: record.petshopId,
    storeName: record.petshop?.businessName?.trim() || "Petshop",
    summary: description || "Kampanya açıklaması paylaşılmadı.",
    targetParticipantCount: record.targetParticipantCount,
    title: record.title,
    updatedAt: record.updatedAt,
    verificationState: mapVerificationState(record.petshop?.petshopVerificationStatus),
    visualLabel: metadata.visualLabel
  };
}

function toManagedRow(record: PetshopCampaignRecord): PetshopManagedCampaignRow {
  return {
    campaign: toDiscoveryItem(record),
    campaignId: record.id,
    participantCount: record.currentParticipantCount,
    status: record.isActive ? "aktif" : "pasif",
    targetParticipantCount: record.targetParticipantCount
  };
}

function toDashboardData(record: PetshopDashboardRecord): PetshopDashboardData {
  const managedRows = record.campaigns.map(toManagedRow);

  return {
    featuredCampaign: managedRows[0]?.campaign,
    heroStore: toStoreProfile(record.store),
    managedRows,
    summary: {
      activeCampaignCount: record.activeCampaignCount,
      campaignCount: record.campaigns.length,
      totalParticipantCount: record.totalParticipantCount,
      unreadMessageCount: record.unreadMessageCount
    }
  };
}

export function usePetshopDiscovery() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.discovery,
    queryFn: async () => (await petshopsApi.discoverCampaigns()).map(toDiscoveryItem),
    enabled: isAuthenticated
  });
}

export function usePetshopDashboard() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.dashboard,
    queryFn: async () => toDashboardData(await petshopsApi.getDashboard()),
    enabled: isAuthenticated
  });
}

export function usePetshopCampaignManagement() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.campaigns,
    queryFn: async () => (await petshopsApi.listMyCampaigns()).map(toManagedRow),
    enabled: isAuthenticated
  });
}

export function usePetshopStoreProfile(storeId: string) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.store(storeId),
    queryFn: async () => {
      const store = await petshopsApi.findStore(storeId);

      return {
        campaigns: store.campaigns.map(toDiscoveryItem),
        store: toStoreProfile(store)
      };
    },
    enabled: isAuthenticated && Boolean(storeId)
  });
}

export function usePetshopCampaignDetail(campaignId: string) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.detail(campaignId),
    queryFn: async () => toDiscoveryItem(await petshopsApi.findCampaign(campaignId)),
    enabled: isAuthenticated && Boolean(campaignId)
  });
}
