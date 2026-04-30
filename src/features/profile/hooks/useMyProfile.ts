import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UpdateMyProfileRequest } from "../../../core/api/contracts";
import { usersApi } from "../../../core/api/services/usersApi";
import { resolveMediaUrl } from "../../../core/media/resolveMediaUrl";
import { queryKeys } from "../../../core/query/queryKeys";
import { useSessionStore } from "../../auth/store/sessionStore";

function normalizeProfileMedia<T extends { avatar: string | null }>(profile: T): T {
  return {
    ...profile,
    avatar: resolveMediaUrl(profile.avatar)
  };
}

export function useMyProfile() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.users.me,
    queryFn: async () => normalizeProfileMedia(await usersApi.getMyProfile()),
    enabled: isAuthenticated
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateMyProfileRequest) =>
      normalizeProfileMedia(await usersApi.updateMyProfile(payload)),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.users.me, updatedProfile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    }
  });
}
