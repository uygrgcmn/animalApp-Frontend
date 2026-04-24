import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { FindListingsQuery } from "../../../core/api/contracts";
import { listingsApi } from "../../../core/api/services/listingsApi";
import { queryKeys } from "../../../core/query/queryKeys";

export function useInfiniteListings(query?: Omit<FindListingsQuery, "limit" | "offset">) {
  return useInfiniteQuery({
    queryKey: queryKeys.listings.infinite(query),
    queryFn: () => listingsApi.findAll(query),
    initialPageParam: 0,
    getNextPageParam: () => undefined
  });
}

export function useListings(query?: FindListingsQuery) {
  return useQuery({
    queryKey: queryKeys.listings.all(query),
    queryFn: () => listingsApi.findAll(query)
  });
}

export function useListingDetail(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(listingId),
    queryFn: () => listingsApi.findOne(listingId),
    enabled: Boolean(listingId)
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: queryKeys.listings.myApplications,
    queryFn: () => listingsApi.listMyApplications()
  });
}

export function useListingApplications(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listings.applications(listingId),
    queryFn: () => listingsApi.listApplications(listingId),
    enabled: Boolean(listingId)
  });
}
