import type { Href } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/queryKeys";
import { savedItems } from "../../../shared/mocks/profile";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";
import { useSessionStore } from "../../auth/store/sessionStore";

export type SavedItemViewModel = (typeof savedItems)[number] & {
  href: Href;
};

export function useSavedItems() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.profile.saved,
    queryFn: async (): Promise<SavedItemViewModel[]> =>
      savedItems.map((item) => ({
        ...item,
        href: getMockItemHref(item.kind, item.listingId)
      })),
    enabled: isAuthenticated
  });
}
