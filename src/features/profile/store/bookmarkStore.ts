import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ListingType } from "../../../core/api/contracts";
import { sessionStorage } from "../../../core/storage/sessionStorage";

export type BookmarkedItem = {
  id: string;
  title: string;
  type: ListingType;
  location: string;
  savedAt: string;
};

type BookmarkState = {
  items: Record<string, BookmarkedItem>;
  toggle: (item: Omit<BookmarkedItem, "savedAt">) => void;
  isBookmarked: (listingId: string) => boolean;
  getAll: () => BookmarkedItem[];
  count: () => number;
  clear: () => void;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: {},

      toggle: (item) => {
        set((state) => {
          const next = { ...state.items };
          if (next[item.id]) {
            delete next[item.id];
          } else {
            next[item.id] = { ...item, savedAt: new Date().toISOString() };
          }
          return { items: next };
        });
      },

      isBookmarked: (listingId) => Boolean(get().items[listingId]),

      getAll: () =>
        Object.values(get().items).sort(
          (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        ),

      count: () => Object.keys(get().items).length,

      clear: () => set({ items: {} })
    }),
    {
      name: "bookmarks-v1",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
