import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/queryKeys";
import { petshopCampaigns as mockPetshopCampaigns } from "../../../shared/mocks/marketplace";
import {
  getCampaignsByStore,
  getManagedCampaignRows,
  getStoreById,
  getStoreByName,
  petshopPerformanceSummary,
  type PetshopStoreProfile
} from "../../../shared/mocks/petshop";
import { useSessionStore } from "../../auth/store/sessionStore";
import type { LocalPetshopCampaign } from "../utils/campaigns";

export type PetshopDiscoveryItem = (typeof mockPetshopCampaigns)[number] & {
  city: string;
  coverImageUri?: string;
  createdAt?: string;
  description?: string;
  district?: string;
  mediaUrls?: string[];
  store?: NonNullable<PetshopStoreProfile>;
  updatedAt?: string;
  verificationState?: NonNullable<PetshopStoreProfile>["verifiedState"];
};

export type PetshopManagedCampaignRow = {
  campaign: PetshopDiscoveryItem;
  campaignId: string;
  impressions: string;
  messageCount: number;
  savedCount: number;
  status: "aktif" | "taslak" | "pasif";
  store?: NonNullable<PetshopStoreProfile>;
};

function buildCampaignSignature(localCampaigns: LocalPetshopCampaign[]) {
  return localCampaigns.map((item) => `${item.id}:${item.updatedAt}`).join("|");
}

function buildLocalStoreProfile(
  campaign: LocalPetshopCampaign,
  fallbackUser: ReturnType<typeof useSessionStore.getState>["user"]
): PetshopStoreProfile {
  return {
    campaignIds: [campaign.id],
    city: campaign.city || fallbackUser?.city || "Konum belirtilmemiş",
    district: campaign.district || fallbackUser?.district || "Merkez",
    id: campaign.storeId,
    responseRate: "%100 geri dönüş",
    responseTime: "Ortalama 15 dk",
    storeName: campaign.storeName,
    tagline: `${campaign.storeName} için yayında olan kampanyalar`,
    summary: `${campaign.storeName} mağazası tarafından oluşturulan kampanyalar burada listelenir.`,
    trustNotes: [
      "Kampanya bu hesap üzerinden oluşturuldu.",
      "Fiyat ve son tarih bilgileri kaydedildi.",
      "İletişim petshop ekranından sürdürülebilir."
    ],
    verifiedState: campaign.verificationState
  };
}

function buildLocalDiscoveryItems(
  localCampaigns: LocalPetshopCampaign[],
  fallbackUser: ReturnType<typeof useSessionStore.getState>["user"]
): PetshopDiscoveryItem[] {
  return localCampaigns.map((campaign) => {
    const matchedStore = getStoreByName(campaign.storeName);
    const store = matchedStore ?? buildLocalStoreProfile(campaign, fallbackUser);

    return {
      campaignLabel: campaign.campaignLabel,
      city: campaign.city || store.city,
      coverImageUri: campaign.coverImageUri,
      createdAt: campaign.createdAt,
      description: campaign.description,
      discount: campaign.discount,
      district: campaign.district || store.district,
      id: campaign.id,
      mediaUrls: campaign.mediaUrls,
      priceLabel: campaign.priceLabel,
      store: store ?? undefined,
      storeId: matchedStore?.id ?? campaign.storeId,
      storeName: campaign.storeName,
      summary: campaign.description,
      title: campaign.title,
      updatedAt: campaign.updatedAt,
      verificationState: matchedStore?.verifiedState ?? campaign.verificationState,
      visualLabel: campaign.visualLabel,
      deadline: campaign.deadline
    };
  });
}

function buildDiscoveryItems(
  localCampaigns: LocalPetshopCampaign[],
  fallbackUser: ReturnType<typeof useSessionStore.getState>["user"]
): PetshopDiscoveryItem[] {
  const localItems = buildLocalDiscoveryItems(localCampaigns, fallbackUser);
  const mockItems = mockPetshopCampaigns.map((campaign) => {
    const store = getStoreById(campaign.storeId);

    return {
      ...campaign,
      city: campaign.city,
      store: store ?? undefined,
      verificationState: store?.verifiedState
    };
  });

  return [...localItems, ...mockItems];
}

function buildManagedRows(
  localCampaigns: LocalPetshopCampaign[],
  fallbackUser: ReturnType<typeof useSessionStore.getState>["user"]
): PetshopManagedCampaignRow[] {
  const localRows: PetshopManagedCampaignRow[] = buildLocalDiscoveryItems(
    localCampaigns,
    fallbackUser
  ).map((campaign) => ({
    campaign,
    campaignId: campaign.id,
    impressions: "Yeni",
    messageCount: 0,
    savedCount: 0,
    status: "aktif",
    store: campaign.store
  }));

  const mockRows: PetshopManagedCampaignRow[] = getManagedCampaignRows().flatMap((row) => {
    if (!row.campaign) {
      return [];
    }

    const store = getStoreById(row.campaign.storeId);

    return [
      {
        campaign: {
          ...row.campaign,
          city: row.campaign.city,
          store: store ?? undefined,
          verificationState: store?.verifiedState
        },
        campaignId: row.campaignId,
        impressions: row.impressions,
        messageCount: row.messageCount,
        savedCount: row.savedCount,
        status: row.status,
        store: store ?? undefined
      }
    ];
  });

  return [...localRows, ...mockRows];
}

export function usePetshopDiscovery() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const localCampaigns = useSessionStore((state) => state.petshopCampaigns);
  const user = useSessionStore((state) => state.user);
  const signature = useMemo(() => buildCampaignSignature(localCampaigns), [localCampaigns]);

  return useQuery({
    queryKey: [...queryKeys.petshop.discovery, signature, user?.id ?? null],
    queryFn: async () => buildDiscoveryItems(localCampaigns, user),
    enabled: isAuthenticated
  });
}

export function usePetshopDashboard() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const localCampaigns = useSessionStore((state) => state.petshopCampaigns);
  const user = useSessionStore((state) => state.user);
  const signature = useMemo(() => buildCampaignSignature(localCampaigns), [localCampaigns]);

  return useQuery({
    queryKey: [...queryKeys.petshop.dashboard, signature, user?.id ?? null],
    queryFn: async () => {
      const discoveryItems = buildDiscoveryItems(localCampaigns, user);
      const heroCampaign = discoveryItems[0];

      return {
        featuredCampaign: heroCampaign,
        heroStore: heroCampaign?.store,
        managedRows: buildManagedRows(localCampaigns, user),
        performanceSummary: petshopPerformanceSummary
      };
    },
    enabled: isAuthenticated
  });
}

export function usePetshopCampaignManagement() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const localCampaigns = useSessionStore((state) => state.petshopCampaigns);
  const user = useSessionStore((state) => state.user);
  const signature = useMemo(() => buildCampaignSignature(localCampaigns), [localCampaigns]);

  return useQuery({
    queryKey: [...queryKeys.petshop.campaigns, signature, user?.id ?? null],
    queryFn: async () => buildManagedRows(localCampaigns, user),
    enabled: isAuthenticated
  });
}

export function usePetshopStoreProfile(storeId: string) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const localCampaigns = useSessionStore((state) => state.petshopCampaigns);
  const user = useSessionStore((state) => state.user);
  const signature = useMemo(() => buildCampaignSignature(localCampaigns), [localCampaigns]);

  return useQuery({
    queryKey: [...queryKeys.petshop.store(storeId), signature, user?.id ?? null],
    queryFn: async () => {
      const mockStore = getStoreById(storeId);

      if (mockStore) {
        return {
          campaigns: getCampaignsByStore(storeId).map((campaign) => ({
            ...campaign,
            city: campaign.city,
            store: mockStore,
            verificationState: mockStore.verifiedState
          })),
          store: mockStore
        };
      }

      const localStoreCampaigns = buildLocalDiscoveryItems(localCampaigns, user).filter(
        (campaign) => campaign.storeId === storeId
      );

      return {
        campaigns: localStoreCampaigns,
        store: localStoreCampaigns[0]?.store
      };
    },
    enabled: isAuthenticated && Boolean(storeId)
  });
}
