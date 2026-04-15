import type { Href } from "expo-router";

import { routeBuilders } from "../../core/navigation/routes";

export type MockLinkedItemKind =
  | "caregiver-listing"
  | "owner-request"
  | "community-post"
  | "petshop-campaign"
  | "petshop-store";

export function getMockItemHref(kind: MockLinkedItemKind, id: string): Href {
  switch (kind) {
    case "caregiver-listing":
      return routeBuilders.caregiverListingDetail(id) as Href;
    case "owner-request":
      return routeBuilders.ownerRequestDetail(id) as Href;
    case "community-post":
      return routeBuilders.communityPostDetail(id) as Href;
    case "petshop-campaign":
      return routeBuilders.petshopCampaignDetail(id) as Href;
    case "petshop-store":
      return routeBuilders.petshopStoreProfile(id) as Href;
  }
}
