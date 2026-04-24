import type {
  CreatePetshopCampaignRequest,
  PetshopCampaignRecord,
  PetshopDashboardRecord,
  PetshopStoreRecord
} from "../contracts";
import { httpClient } from "../httpClient";

export const petshopsApi = {
  createCampaign: (payload: CreatePetshopCampaignRequest) =>
    httpClient.post<PetshopCampaignRecord>("/petshops/campaigns", payload, {
      auth: true
    }),
  discoverCampaigns: () =>
    httpClient.get<PetshopCampaignRecord[]>("/petshops/campaigns/discovery", {
      auth: true
    }),
  findCampaign: (campaignId: string) =>
    httpClient.get<PetshopCampaignRecord>(`/petshops/campaigns/${campaignId}`, {
      auth: true
    }),
  getDashboard: () =>
    httpClient.get<PetshopDashboardRecord>("/petshops/dashboard/me", {
      auth: true
    }),
  listMyCampaigns: () =>
    httpClient.get<PetshopCampaignRecord[]>("/petshops/campaigns/me", {
      auth: true
    }),
  findStore: (storeId: string) =>
    httpClient.get<PetshopStoreRecord>(`/petshops/stores/${storeId}`, {
      auth: true
    }),
  joinCampaign: (campaignId: string) =>
    httpClient.post<PetshopCampaignRecord>(
      `/petshops/campaigns/${campaignId}/join`,
      undefined,
      { auth: true }
    )
};
