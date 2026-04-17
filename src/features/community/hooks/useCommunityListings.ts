import { useQuery } from "@tanstack/react-query";

import type { FindCommunityListingsQuery } from "../../../core/api/contracts";
import { communityApi } from "../../../core/api/services/communityApi";
import { queryKeys } from "../../../core/query/queryKeys";

export function useCommunityListings(query?: FindCommunityListingsQuery) {
  return useQuery({
    queryKey: queryKeys.community.all(query),
    queryFn: () => communityApi.findAll(query)
  });
}

export function useCommunityListingDetail(listingId: string) {
  return useQuery({
    queryKey: queryKeys.community.detail(listingId),
    queryFn: () => communityApi.findOne(listingId),
    enabled: Boolean(listingId)
  });
}
