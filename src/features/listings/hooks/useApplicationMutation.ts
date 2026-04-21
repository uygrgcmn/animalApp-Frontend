import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApplicationStatus, CreateApplicationRequest } from "../../../core/api/contracts";
import { listingsApi } from "../../../core/api/services/listingsApi";
import { queryKeys } from "../../../core/query/queryKeys";

export function useCreateApplication(listingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApplicationRequest) =>
      listingsApi.createApplication(listingId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.listings.myApplications });
      void queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(listingId) });
    }
  });
}

export function useTransitionApplication(listingId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      status
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => listingsApi.transitionApplicationStatus(applicationId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.listings.myApplications });
      if (listingId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.listings.applications(listingId) });
      }
    }
  });
}
