import type {
  FindCommunityListingsQuery,
  FindListingsQuery,
  FindPublicUsersQuery,
  ProximityCommunityListingsQuery
} from "../api/contracts";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const
  },
  users: {
    me: ["users", "me"] as const,
    discovery: (query?: FindPublicUsersQuery) => ["users", "discovery", query] as const,
    detail: (userId: string) => ["users", "detail", userId] as const
  },
  listings: {
    all: (query?: FindListingsQuery) => ["listings", "all", query] as const,
    detail: (listingId: string) => ["listings", "detail", listingId] as const,
    myApplications: ["listings", "applications", "me"] as const,
    applications: (listingId: string) => ["listings", "applications", listingId] as const,
    applicationDetail: (applicationId: string) =>
      ["listings", "application", applicationId] as const
  },
  community: {
    all: (query?: FindCommunityListingsQuery) => ["community", "all", query] as const,
    proximity: (query: ProximityCommunityListingsQuery) =>
      ["community", "proximity", query] as const,
    detail: (listingId: string) => ["community", "detail", listingId] as const
  },
  petshop: {
    discovery: ["petshop", "discovery"] as const,
    dashboard: ["petshop", "dashboard"] as const,
    campaigns: ["petshop", "campaigns"] as const,
    store: (storeId: string) => ["petshop", "store", storeId] as const
  },
  profile: {
    saved: ["profile", "saved"] as const,
    settings: ["profile", "settings"] as const
  },
  pets: {
    all: ["pets", "all"] as const,
    detail: (petId: string) => ["pets", "detail", petId] as const
  }
};

