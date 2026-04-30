import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { routeBuilders } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import type { ApplicationRecord, ApplicationStatus, ListingType } from "../../../core/api/contracts";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { useMyApplications } from "../../listings/hooks/useListings";
import { formatRelativeDate } from "../../../shared/utils/formatDate";

type DisplayStatus = "pending" | "accepted" | "rejected";

const options: { label: string; value: DisplayStatus }[] = [
  { label: "Beklemede", value: "pending" },
  { label: "Kabul", value: "accepted" },
  { label: "Red", value: "rejected" }
];

const listingTypeLabels: Record<string, string> = {
  SITTING: "Bakıcı İlanı",
  HELP_REQUEST: "Bakıcı Talebi",
  FREE_ITEM: "Ücretsiz Eşya",
  ACTIVITY: "Etkinlik",
  COMMUNITY: "Topluluk",
  ADOPTION: "Sahiplendirme"
};

function toDisplayStatus(status: ApplicationStatus): DisplayStatus {
  if (status === "APPROVED" || status === "COMPLETED") return "accepted";
  if (status === "REJECTED" || status === "CANCELLED") return "rejected";
  return "pending";
}

function getDetailHref(app: ApplicationRecord) {
  const type = app.listing?.type;
  const id = app.listingId;
  if (type === "SITTING") return routeBuilders.caregiverListingDetail(id);
  if (type === "HELP_REQUEST") return routeBuilders.ownerRequestDetail(id);
  return routeBuilders.communityPostDetail(id);
}

export function ProfileApplicationsScreen() {
  const [status, setStatus] = useState<DisplayStatus>("pending");
  const { data: applications = [], isLoading } = useMyApplications();

  const pendingCount = useMemo(
    () => applications.filter((a) => toDisplayStatus(a.status) === "pending").length,
    [applications]
  );
  const acceptedCount = useMemo(
    () => applications.filter((a) => toDisplayStatus(a.status) === "accepted").length,
    [applications]
  );
  const rejectedCount = useMemo(
    () => applications.filter((a) => toDisplayStatus(a.status) === "rejected").length,
    [applications]
  );

  const items = useMemo(
    () => applications.filter((a) => toDisplayStatus(a.status) === status),
    [applications, status]
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      {isLoading ? (
        <ActivityIndicator color="primary" />
      ) : (
        <>
          <View style={styles.summaryRow}>
            <MetaPill
              icon="clock-outline"
              label={`${pendingCount} beklemede`}
              tone="warning"
            />
            <MetaPill
              icon="check-circle-outline"
              label={`${acceptedCount} kabul`}
              tone="success"
            />
            <MetaPill
              icon="close-circle-outline"
              label={`${rejectedCount} red`}
              tone="neutral"
            />
          </View>

          <SegmentedTabs onChange={setStatus} options={options} value={status} />

          {items.length > 0 ? (
            <View style={styles.list}>
              {items.map((app) => {
                const displayStatus = toDisplayStatus(app.status);
                const listingType = app.listing?.type;
                const typeLabel = listingType
                  ? (listingTypeLabels[listingType] ?? listingType)
                  : "İlan";
                const ownerName = app.listing?.creator?.fullName ?? "İlan Sahibi";
                const city = app.listing?.creator?.city;

                return (
                  <ManagementItemCard
                    key={app.id}
                    actions={
                      <>
                        <Link href={getDetailHref(app)} asChild>
                          <AppButton label="İlan Detayı" variant="secondary" />
                        </Link>
                        <AppButton label="Mesaj" variant="ghost" />
                      </>
                    }
                    description={`${ownerName} • ${formatRelativeDate(app.updatedAt)}`}
                    pills={
                      <>
                        {city ? (
                          <MetaPill icon="map-marker-outline" label={city} tone="neutral" />
                        ) : null}
                        <MetaPill icon="shape-outline" label={typeLabel} tone="primary" />
                      </>
                    }
                    rightSlot={
                      <ModeBadge
                        label={
                          displayStatus === "pending"
                            ? "Beklemede"
                            : displayStatus === "accepted"
                              ? "Kabul edildi"
                              : "Reddedildi"
                        }
                        tone={
                          displayStatus === "pending"
                            ? "warning"
                            : displayStatus === "accepted"
                              ? "success"
                              : "muted"
                        }
                      />
                    }
                    supportingText={app.message}
                    title={app.listing?.title ?? "İlan"}
                  />
                );
              })}
            </View>
          ) : (
            <EmptyState
              description="Bu durum grubunda gösterilecek başvuru bulunmuyor."
              icon="file-document-outline"
              title="Gösterilecek başvuru yok"
            />
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl
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
