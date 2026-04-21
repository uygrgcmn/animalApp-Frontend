import { routeBuilders } from "../../../core/navigation/routes";
import type { ListingType } from "../../../core/api/contracts";
import { useBookmarkStore } from "../store/bookmarkStore";

const listingTypeLabels: Record<ListingType, string> = {
  SITTING: "Bakıcı İlanı",
  HELP_REQUEST: "Bakıcı Talebi",
  FREE_ITEM: "Ücretsiz Eşya",
  ACTIVITY: "Etkinlik",
  COMMUNITY: "Topluluk",
  ADOPTION: "Sahiplendirme"
};

function getDetailHref(id: string, type: ListingType) {
  if (type === "SITTING") return routeBuilders.caregiverListingDetail(id);
  if (type === "HELP_REQUEST") return routeBuilders.ownerRequestDetail(id);
  return routeBuilders.communityPostDetail(id);
}

export function useSavedItems() {
  const getAll = useBookmarkStore((s) => s.getAll);
  const items = getAll();

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: `${listingTypeLabels[item.type] ?? item.type} · ${item.location}`,
    typeLabel: listingTypeLabels[item.type] ?? item.type,
    savedAt: item.savedAt,
    href: getDetailHref(item.id, item.type)
  }));
}
