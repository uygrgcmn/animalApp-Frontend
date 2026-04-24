import type { Href } from "expo-router";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { communityApi } from "../../../core/api/services/communityApi";
import { listingsApi } from "../../../core/api/services/listingsApi";
import { routeBuilders } from "../../../core/navigation/routes";
import { queryKeys } from "../../../core/query/queryKeys";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { useSessionStore } from "../../auth/store/sessionStore";
import { getCommunityCategoryKey, getCommunityCategoryLabel } from "../../listings/utils/adapters";
import { isCaregiverListing, isOwnerRequestListing } from "../../listings/utils/listingGuards";
import { formatRelativeDate } from "../../../shared/utils/formatDate";

type DisplayStatus = "active" | "passive" | "draft";

type ManagedListingItem = {
  applicationCount: number;
  href: Href;
  id: string;
  status: DisplayStatus;
  title: string;
  typeLabel: string;
  updatedAt: string;
};

const options: { label: string; value: DisplayStatus }[] = [
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "passive" },
  { label: "Taslak", value: "draft" }
];

function toDisplayStatus(status: "ACTIVE" | "DRAFT" | "PAUSED" | "CLOSED" | "ARCHIVED"): DisplayStatus {
  if (status === "ACTIVE") return "active";
  if (status === "DRAFT") return "draft";
  return "passive";
}

export function ProfileListingsScreen() {
  const [status, setStatus] = useState<DisplayStatus>("active");
  const user = useSessionStore((state) => state.user);
  const localPetshopCampaigns = useSessionStore((state) => state.petshopCampaigns);

  const listingsQuery = useQuery({
    queryKey: queryKeys.listings.all({ creatorId: user?.id }),
    queryFn: async () => {
      const listings = await listingsApi.findAll({ creatorId: user!.id });
      return listings.filter((item) => isCaregiverListing(item) || isOwnerRequestListing(item));
    },
    enabled: Boolean(user?.id)
  });

  const communityQuery = useQuery({
    queryKey: queryKeys.community.all({ creatorId: user?.id }),
    queryFn: () => communityApi.findAll({ creatorId: user!.id }),
    enabled: Boolean(user?.id)
  });

  const allItems = useMemo<ManagedListingItem[]>(() => {
    const standardItems = (listingsQuery.data ?? []).map((listing) => ({
      applicationCount: listing.applications?.length ?? 0,
      href:
        listing.type === "SITTING"
          ? routeBuilders.caregiverListingDetail(listing.id)
          : routeBuilders.ownerRequestDetail(listing.id),
      id: listing.id,
      status: toDisplayStatus(listing.status),
      title: listing.title,
      typeLabel: listing.type === "SITTING" ? "Bakıcı İlanı" : "Bakıcı Arıyorum",
      updatedAt: listing.updatedAt
    }));

    const communityItems = (communityQuery.data ?? []).map((listing) => ({
      applicationCount: 0,
      href: routeBuilders.communityPostDetail(listing.id),
      id: listing.id,
      status: toDisplayStatus(listing.status),
      title: listing.title,
      typeLabel: `Topluluk • ${getCommunityCategoryLabel(getCommunityCategoryKey(listing))}`,
      updatedAt: listing.updatedAt
    }));

    const petshopItems = localPetshopCampaigns
      .filter((campaign) => campaign.creatorId === user?.id)
      .map((campaign) => ({
        applicationCount: 0,
        href: routeBuilders.petshopCampaignDetail(campaign.id),
        id: campaign.id,
        status: campaign.status === "DRAFT" ? ("draft" as const) : ("active" as const),
        title: campaign.title,
        typeLabel: "Petshop Kampanyası",
        updatedAt: campaign.updatedAt
      }));

    return [...petshopItems, ...communityItems, ...standardItems].sort((left, right) =>
      right.updatedAt.localeCompare(left.updatedAt)
    );
  }, [communityQuery.data, listingsQuery.data, localPetshopCampaigns, user?.id]);

  const activeCount = useMemo(
    () => allItems.filter((item) => item.status === "active").length,
    [allItems]
  );
  const passiveCount = useMemo(
    () => allItems.filter((item) => item.status === "passive").length,
    [allItems]
  );
  const draftCount = useMemo(
    () => allItems.filter((item) => item.status === "draft").length,
    [allItems]
  );

  const items = useMemo(
    () => allItems.filter((item) => item.status === status),
    [allItems, status]
  );

  if (listingsQuery.isLoading || communityQuery.isLoading) {
    return (
      <ScreenContainer contentContainerStyle={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (listingsQuery.isError || communityQuery.isError) {
    return (
      <ScreenContainer contentContainerStyle={styles.content}>
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => {
                void listingsQuery.refetch();
                void communityQuery.refetch();
              }}
              variant="secondary"
            />
          }
          description="İlanların tamamı şu an yüklenemedi. Biraz sonra tekrar deneyebilirsin."
          icon="wifi-off"
          title="İlanlar getirilemedi"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.summaryRow}>
        <MetaPill icon="check-circle-outline" label={`${activeCount} aktif`} tone="success" />
        <MetaPill icon="pause-circle-outline" label={`${passiveCount} pasif`} tone="warning" />
        <MetaPill icon="file-document-edit-outline" label={`${draftCount} taslak`} tone="primary" />
      </View>

      <SegmentedTabs onChange={setStatus} options={options} value={status} />

      {items.length > 0 ? (
        <View style={styles.list}>
          {items.map((item) => {
            const hasApplications = item.applicationCount > 0;

            return (
              <ManagementItemCard
                key={item.id}
                actions={
                  <>
                    {hasApplications ? (
                      <Link href={routeBuilders.listingApplications(item.id)} asChild>
                        <AppButton
                          label={`${item.applicationCount} Başvuru`}
                          leftSlot={
                            <AppIcon
                              backgrounded={false}
                              name="account-group-outline"
                              size={16}
                            />
                          }
                        />
                      </Link>
                    ) : null}
                    <Link href={item.href} asChild>
                      <AppButton label="Önizleme" variant="secondary" />
                    </Link>
                    <AppButton label="Düzenle" variant="ghost" />
                  </>
                }
                description={`${item.typeLabel} • ${formatRelativeDate(item.updatedAt)}`}
                pills={
                  <>
                    {hasApplications ? (
                      <MetaPill
                        icon="account-group-outline"
                        label={`${item.applicationCount} başvuru`}
                        tone="warning"
                      />
                    ) : null}
                    <MetaPill
                      icon={
                        item.status === "active"
                          ? "check-circle-outline"
                          : item.status === "passive"
                            ? "pause-circle-outline"
                            : "file-document-edit-outline"
                      }
                      label={
                        item.status === "active"
                          ? "Aktif"
                          : item.status === "passive"
                            ? "Pasif"
                            : "Taslak"
                      }
                      tone={
                        item.status === "active"
                          ? "success"
                          : item.status === "passive"
                            ? "warning"
                            : "primary"
                      }
                    />
                  </>
                }
                title={item.title}
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
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
