import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { FindCommunityListingsQuery } from "../../../core/api/contracts";
import { communityApi } from "../../../core/api/services/communityApi";
import { queryKeys } from "../../../core/query/queryKeys";

const PAGE_SIZE = 10;

export function useInfiniteCommunityListings(
  query?: Omit<FindCommunityListingsQuery, "limit" | "offset">
) {
  return useInfiniteQuery({
    queryKey: queryKeys.community.infinite(query),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      communityApi.findAll({ ...query, limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.flat().length : undefined
  });
}

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
