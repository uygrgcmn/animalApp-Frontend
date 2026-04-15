import type { CreatePetRequest, PetRecord, UpdatePetRequest } from "../contracts";
import { httpClient } from "../httpClient";

export const petsApi = {
  findAll: () => httpClient.get<PetRecord[]>("/pets", { auth: true }),
  findOne: (petId: string) => httpClient.get<PetRecord>(`/pets/${petId}`, { auth: true }),
  create: (payload: CreatePetRequest) =>
    httpClient.post<PetRecord>("/pets", payload, { auth: true }),
  update: (petId: string, payload: UpdatePetRequest) =>
    httpClient.patch<PetRecord>(`/pets/${petId}`, payload, { auth: true }),
  remove: (petId: string) => httpClient.delete<PetRecord>(`/pets/${petId}`, { auth: true })
};

