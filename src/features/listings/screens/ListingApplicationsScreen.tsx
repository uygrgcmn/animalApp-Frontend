import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ApplicationStatus } from "../../../core/api/contracts";
import { colors } from "../../../core/theme/colors";
import { shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { formatRelativeDate } from "../../../shared/utils/formatDate";
import { useTransitionApplication } from "../hooks/useApplicationMutation";
import { useListingApplications, useListingDetail } from "../hooks/useListings";

type DisplayStatus = "pending" | "accepted" | "rejected";

const tabs: { label: string; value: DisplayStatus }[] = [
  { label: "Beklemede", value: "pending" },
  { label: "Kabul", value: "accepted" },
  { label: "Reddedilen", value: "rejected" }
];

function toDisplayStatus(status: ApplicationStatus): DisplayStatus {
  if (status === "APPROVED" || status === "COMPLETED") return "accepted";
  if (status === "REJECTED" || status === "CANCELLED") return "rejected";
  return "pending";
}

export function ListingApplicationsScreen() {
  const { listingId } = useLocalSearchParams<{ listingId: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DisplayStatus>("pending");

  const listingQuery = useListingDetail(listingId);
  const applicationsQuery = useListingApplications(listingId);
  const transition = useTransitionApplication(listingId);

  const applications = applicationsQuery.data ?? [];

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
    () => applications.filter((a) => toDisplayStatus(a.status) === activeTab),
    [applications, activeTab]
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <Pressable hitSlop={8} onPress={() => router.back()} style={styles.backButton}>
            <AppIcon backgrounded={false} color={colors.text} name="arrow-left" size={24} />
          </Pressable>
          <View style={styles.headerTexts}>
            <Text style={styles.overline}>BAŞVURU YÖNETİMİ</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {listingQuery.data?.title ?? "İlan"}
            </Text>
          </View>
        </View>
        <View style={styles.headerCounts}>
          <MetaPill icon="clock-outline" label={`${pendingCount} beklemede`} tone="warning" />
          <MetaPill icon="check-circle-outline" label={`${acceptedCount} kabul`} tone="success" />
          <MetaPill icon="close-circle-outline" label={`${rejectedCount} red`} tone="neutral" />
        </View>
        <View style={styles.divider} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedTabs onChange={setActiveTab} options={tabs} value={activeTab} />

        {applicationsQuery.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : items.length > 0 ? (
          <View style={styles.list}>
            {items.map((app) => {
              const displayStatus = toDisplayStatus(app.status);
              const applicantName = app.applicant?.fullName ?? "Başvuran";
              const city = app.applicant?.city;
              const isPending = app.status === "PENDING";

              return (
                <ManagementItemCard
                  key={app.id}
                  actions={
                    isPending ? (
                      <>
                        <AppButton
                          label="Onayla"
                          leftSlot={
                            <AppIcon
                              backgrounded={false}
                              color="#FFFFFF"
                              name="check-circle-outline"
                              size={16}
                            />
                          }
                          loading={transition.isPending}
                          onPress={() =>
                            transition.mutate({ applicationId: app.id, status: "APPROVED" })
                          }
                          size="sm"
                        />
                        <AppButton
                          label="Reddet"
                          leftSlot={
                            <AppIcon
                              backgrounded={false}
                              color={colors.error}
                              name="close-circle-outline"
                              size={16}
                            />
                          }
                          loading={transition.isPending}
                          onPress={() =>
                            transition.mutate({ applicationId: app.id, status: "REJECTED" })
                          }
                          size="sm"
                          variant="danger"
                        />
                      </>
                    ) : undefined
                  }
                  description={`${applicantName} • ${formatRelativeDate(app.createdAt)}`}
                  pills={
                    <>
                      {city ? (
                        <MetaPill icon="map-marker-outline" label={city} tone="neutral" />
                      ) : null}
                      {app.startDate ? (
                        <MetaPill
                          icon="calendar-start"
                          label={formatRelativeDate(app.startDate)}
                          tone="primary"
                        />
                      ) : null}
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
                  supportingText={app.message || undefined}
                  title={applicantName}
                />
              );
            })}
          </View>
        ) : (
          <EmptyState
            description="Bu durum grubunda gösterilecek başvuru bulunmuyor."
            icon="account-group-outline"
            title="Başvuru yok"
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36
  },
  content: {
    gap: spacing.section,
    paddingBottom: 110,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.section
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginTop: spacing.standard
  },
  header: {
    ...shadows.card,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.comfortable,
    paddingBottom: 0
  },
  headerCounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    marginTop: spacing.compact
  },
  headerTexts: {
    flex: 1
  },
  headerTitle: {
    color: colors.text,
    ...typography.h2
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  list: {
    gap: spacing.compact
  },
  loader: {
    marginTop: spacing.large
  },
  overline: {
    color: colors.primary,
    ...typography.overline
  },
  root: {
    backgroundColor: colors.background,
    flex: 1
  }
});
