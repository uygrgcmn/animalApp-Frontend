import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/queryKeys";
import { petshopCampaigns } from "../../../shared/mocks/marketplace";
import {
  getCampaignsByStore,
  getManagedCampaignRows,
  getStoreById,
  petshopPerformanceSummary
} from "../../../shared/mocks/petshop";
import { useSessionStore } from "../../auth/store/sessionStore";

type PetshopStore = ReturnType<typeof getStoreById>;
type ManagedCampaignRow = ReturnType<typeof getManagedCampaignRows>[number];

export type PetshopDiscoveryItem = (typeof petshopCampaigns)[number] & {
  store?: NonNullable<PetshopStore>;
  verificationState?: NonNullable<PetshopStore>["verifiedState"];
};

export type PetshopManagedCampaignRow = ManagedCampaignRow & {
  campaign: NonNullable<ManagedCampaignRow["campaign"]>;
  store?: NonNullable<PetshopStore>;
};

function buildDiscoveryItems(): PetshopDiscoveryItem[] {
  return petshopCampaigns.map((campaign) => {
    const store = getStoreById(campaign.storeId);

    return {
      ...campaign,
      store: store ?? undefined,
      verificationState: store?.verifiedState
    };
  });
}

function buildManagedRows(): PetshopManagedCampaignRow[] {
  return getManagedCampaignRows().flatMap((row) => {
    if (!row.campaign) {
      return [];
    }

    return [
      {
        ...row,
        campaign: row.campaign,
        store: getStoreById(row.campaign.storeId) ?? undefined
      }
    ];
  });
}

export function usePetshopDiscovery() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.discovery,
    queryFn: async () => buildDiscoveryItems(),
    enabled: isAuthenticated
  });
}

export function usePetshopDashboard() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.dashboard,
    queryFn: async () => {
      const discoveryItems = buildDiscoveryItems();

      return {
        featuredCampaign: discoveryItems[0],
        heroStore: discoveryItems[0]?.store,
        managedRows: buildManagedRows(),
        performanceSummary: petshopPerformanceSummary
      };
    },
    enabled: isAuthenticated
  });
}

export function usePetshopCampaignManagement() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.campaigns,
    queryFn: async () => buildManagedRows(),
    enabled: isAuthenticated
  });
}

export function usePetshopStoreProfile(storeId: string) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.petshop.store(storeId),
    queryFn: async () => {
      const store = getStoreById(storeId);

      return {
        campaigns: store ? getCampaignsByStore(store.id) : [],
        store: store ?? undefined
      };
    },
    enabled: isAuthenticated && Boolean(storeId)
  });
}
