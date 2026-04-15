import type {
  DiscoverableProfile,
  FindPublicUsersQuery,
  MyProfile,
  PublicProfile,
  RequestPetshopProfileRequest,
  RequestSitterProfileRequest,
  UpdateMyProfileRequest
} from "../contracts";
import { httpClient } from "../httpClient";

export const usersApi = {
  getMyProfile: () => httpClient.get<MyProfile>("/users/me", { auth: true }),
  updateMyProfile: (payload: UpdateMyProfileRequest) =>
    httpClient.patch<MyProfile>("/users/me", payload, { auth: true }),
  convertToPetshop: (payload: RequestPetshopProfileRequest) =>
    httpClient.post<MyProfile>("/users/me/convert-petshop", payload, { auth: true }),
  convertToSitter: (payload: RequestSitterProfileRequest) =>
    httpClient.post<MyProfile>("/users/me/convert-sitter", payload, { auth: true }),
  findDiscoverableProfiles: (query?: FindPublicUsersQuery) =>
    httpClient.get<DiscoverableProfile[]>("/users/discovery", { query }),
  findPublicProfile: (userId: string) => httpClient.get<PublicProfile>(`/users/${userId}`)
};

