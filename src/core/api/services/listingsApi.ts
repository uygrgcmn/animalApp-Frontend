import type {
  ApplicationRecord,
  CreateApplicationRequest,
  CreateListingRequest,
  FindListingsQuery,
  ListingRecord,
  TransitionApplicationRequest,
  UpdateListingRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const listingsApi = {
  findAll: (query?: FindListingsQuery) =>
    httpClient.get<ListingRecord[]>("/listings", { auth: true, query }),
  findOne: (listingId: string) =>
    httpClient.get<ListingRecord>(`/listings/${listingId}`, { auth: true }),
  create: (payload: CreateListingRequest) =>
    httpClient.post<ListingRecord>("/listings", payload, { auth: true }),
  update: (listingId: string, payload: UpdateListingRequest) =>
    httpClient.patch<ListingRecord>(`/listings/${listingId}`, payload, { auth: true }),
  remove: (listingId: string) => httpClient.delete<ListingRecord>(`/listings/${listingId}`, { auth: true }),
  createApplication: (listingId: string, payload: CreateApplicationRequest) =>
    httpClient.post<ApplicationRecord>(`/listings/${listingId}/applications`, payload, {
      auth: true
    }),
  listMyApplications: () =>
    httpClient.get<ApplicationRecord[]>("/listings/applications/me", { auth: true }),
  listApplications: (listingId: string) =>
    httpClient.get<ApplicationRecord[]>(`/listings/${listingId}/applications`, { auth: true }),
  findApplication: (applicationId: string) =>
    httpClient.get<ApplicationRecord>(`/listings/applications/${applicationId}`, {
      auth: true
    }),
  transitionApplicationStatus: (
    applicationId: string,
    payload: TransitionApplicationRequest
  ) =>
    httpClient.patch<ApplicationRecord>(
      `/listings/applications/${applicationId}/status`,
      payload,
      { auth: true }
    )
};

