import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";

import { routeBuilders } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import type { ListingRecord, ListingStatus as ApiListingStatus } from "../../../core/api/contracts";
import { listingsApi } from "../../../core/api/services/listingsApi";
import { queryKeys } from "../../../core/query/queryKeys";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { useSessionStore } from "../../auth/store/sessionStore";
import { formatRelativeDate } from "../../../shared/utils/formatDate";

type DisplayStatus = "active" | "passive" | "draft";

const options: { label: string; value: DisplayStatus }[] = [
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "passive" },
  { label: "Taslak", value: "draft" }
];

const listingTypeLabels: Record<string, string> = {
  SITTING: "Bakıcı İlanı",
  HELP_REQUEST: "Bakıcı Talebi",
  FREE_ITEM: "Ücretsiz Eşya",
  ACTIVITY: "Etkinlik",
  COMMUNITY: "Topluluk",
  ADOPTION: "Sahiplendirme"
};

function toDisplayStatus(status: ApiListingStatus): DisplayStatus {
  if (status === "ACTIVE") return "active";
  if (status === "DRAFT") return "draft";
  return "passive"; // PAUSED, CLOSED, ARCHIVED
}

function getListingDetailHref(listing: ListingRecord) {
  if (listing.type === "SITTING") return routeBuilders.caregiverListingDetail(listing.id);
  if (listing.type === "HELP_REQUEST") return routeBuilders.ownerRequestDetail(listing.id);
  return routeBuilders.communityPostDetail(listing.id);
}

export function ProfileListingsScreen() {
  const [status, setStatus] = useState<DisplayStatus>("active");
  const user = useSessionStore((state) => state.user);

  const listingsQuery = useQuery({
    queryKey: queryKeys.listings.all({ creatorId: user?.id }),
    queryFn: () => listingsApi.findAll({ creatorId: user!.id }),
    enabled: Boolean(user?.id)
  });
  const allListings = listingsQuery.data ?? [];

  const activeCount = useMemo(
    () => allListings.filter((l) => toDisplayStatus(l.status) === "active").length,
    [allListings]
  );
  const passiveCount = useMemo(
    () => allListings.filter((l) => toDisplayStatus(l.status) === "passive").length,
    [allListings]
  );
  const draftCount = useMemo(
    () => allListings.filter((l) => toDisplayStatus(l.status) === "draft").length,
    [allListings]
  );

  const items = useMemo(
    () => allListings.filter((l) => toDisplayStatus(l.status) === status),
    [allListings, status]
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      {listingsQuery.isLoading ? (
        <ActivityIndicator color="primary" />
      ) : (
        <>
          <View style={styles.summaryRow}>
            <MetaPill
              icon="check-circle-outline"
              label={`${activeCount} aktif`}
              tone="success"
            />
            <MetaPill
              icon="pause-circle-outline"
              label={`${passiveCount} pasif`}
              tone="warning"
            />
            <MetaPill
              icon="file-document-edit-outline"
              label={`${draftCount} taslak`}
              tone="primary"
            />
          </View>

          <SegmentedTabs onChange={setStatus} options={options} value={status} />

          {items.length > 0 ? (
            <View style={styles.list}>
              {items.map((listing) => {
                const displayStatus = toDisplayStatus(listing.status);
                const typeLabel = listingTypeLabels[listing.type] ?? listing.type;
                const applicationCount = listing.applications?.length ?? 0;

                return (
                  <ManagementItemCard
                    key={listing.id}
                    actions={
                      <>
                        <Link href={getListingDetailHref(listing)} asChild>
                          <AppButton label="Önizleme" variant="secondary" />
                        </Link>
                        <AppButton label="Düzenle" variant="ghost" />
                      </>
                    }
                    description={`${typeLabel} • ${formatRelativeDate(listing.updatedAt)}`}
                    pills={
                      <>
                        {applicationCount > 0 ? (
                          <MetaPill
                            icon="account-group-outline"
                            label={`${applicationCount} başvuru`}
                            tone="warning"
                          />
                        ) : null}
                        <MetaPill
                          icon={
                            displayStatus === "active"
                              ? "check-circle-outline"
                              : displayStatus === "passive"
                                ? "pause-circle-outline"
                                : "file-document-edit-outline"
                          }
                          label={
                            displayStatus === "active"
                              ? "Aktif"
                              : displayStatus === "passive"
                                ? "Pasif"
                                : "Taslak"
                          }
                          tone={
                            displayStatus === "active"
                              ? "success"
                              : displayStatus === "passive"
                                ? "warning"
                                : "primary"
                          }
                        />
                      </>
                    }
                    title={listing.title}
                  />
                );
              })}
            </View>
          ) : (
            <EmptyState
              description="Bu durum grubunda gösterilecek ilan bulunmuyor."
              icon="cards-outline"
              title="Gösterilecek ilan yok"
            />
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
