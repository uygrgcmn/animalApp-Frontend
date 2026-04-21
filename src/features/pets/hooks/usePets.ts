import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreatePetRequest, UpdatePetRequest } from "../../../core/api/contracts";
import { petsApi } from "../../../core/api/services/petsApi";
import { queryKeys } from "../../../core/query/queryKeys";

export function usePets() {
  return useQuery({
    queryKey: queryKeys.pets.all,
    queryFn: () => petsApi.findAll()
  });
}

export function usePet(petId: string) {
  return useQuery({
    queryKey: queryKeys.pets.detail(petId),
    queryFn: () => petsApi.findOne(petId),
    enabled: Boolean(petId)
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePetRequest) => petsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    }
  });
}

export function useUpdatePet(petId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePetRequest) => petsApi.update(petId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) });
    }
  });
}

export function useDeletePet(callbacks?: { onSuccess?: () => void; onError?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => petsApi.remove(petId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      callbacks?.onSuccess?.();
    },
    onError: () => {
      callbacks?.onError?.();
    }
  });
}
