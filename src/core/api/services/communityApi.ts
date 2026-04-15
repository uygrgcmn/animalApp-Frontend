import type {
  CreateCommunityListingRequest,
  FindCommunityListingsQuery,
  ListingRecord,
  ProximityCommunityListingsQuery,
  UpdateCommunityListingRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const communityApi = {
  create: (payload: CreateCommunityListingRequest) =>
    httpClient.post<ListingRecord>("/community/listings", payload, { auth: true }),
  findAll: (query?: FindCommunityListingsQuery) =>
    httpClient.get<ListingRecord[]>("/community/listings", { auth: true, query }),
  findByProximity: (query: ProximityCommunityListingsQuery) =>
    httpClient.get<ListingRecord[]>("/community/listings/proximity", { auth: true, query }),
  findOne: (listingId: string) =>
    httpClient.get<ListingRecord>(`/community/listings/${listingId}`, { auth: true }),
  update: (listingId: string, payload: UpdateCommunityListingRequest) =>
    httpClient.patch<ListingRecord>(`/community/listings/${listingId}`, payload, {
      auth: true
    }),
  remove: (listingId: string) =>
    httpClient.delete<ListingRecord>(`/community/listings/${listingId}`, { auth: true })
};

