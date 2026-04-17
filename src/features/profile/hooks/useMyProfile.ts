import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UpdateMyProfileRequest } from "../../../core/api/contracts";
import { usersApi } from "../../../core/api/services/usersApi";
import { queryKeys } from "../../../core/query/queryKeys";
import { useSessionStore } from "../../auth/store/sessionStore";

export function useMyProfile() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: () => usersApi.getMyProfile(),
    enabled: isAuthenticated
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMyProfileRequest) => usersApi.updateMyProfile(payload),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.users.me, updatedProfile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    }
  });
}
