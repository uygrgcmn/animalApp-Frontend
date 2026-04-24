import { useCallback, useMemo, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routeBuilders } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { useInfiniteListings } from "../../listings/hooks/useListings";
import {
  toCaregiverDisplay,
  toOwnerRequestDisplay,
  type CaregiverDisplay,
  type OwnerRequestDisplay
} from "../../listings/utils/adapters";
import {
  isCaregiverListing,
  isOwnerRequestListing
} from "../../listings/utils/listingGuards";
import { AppButton } from "../../../shared/ui/AppButton";
import type { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { OwnerRequestCard } from "../../../shared/ui/OwnerRequestCard";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";

type ExploreTab = "caregiver-listings" | "owner-requests";
type CaregiverFilter = "all" | "verified" | "weekend";
type OwnerFilter = "all" | "dog" | "cat";

type FilterItem<T extends string> = {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: T;
};

const exploreTabs: { label: string; value: ExploreTab }[] = [
  { label: "Bakıcı İlanları", value: "caregiver-listings" },
  { label: "Bakıcı Arayanlar", value: "owner-requests" }
];

const caregiverFilters: FilterItem<CaregiverFilter>[] = [
  { icon: "view-grid-outline", label: "Tümü", value: "all" },
  { icon: "shield-check-outline", label: "Doğrulananlar", value: "verified" },
  { icon: "calendar-weekend-outline", label: "Hafta sonu", value: "weekend" }
];

const ownerFilters: FilterItem<OwnerFilter>[] = [
  { icon: "view-grid-outline", label: "Tümü", value: "all" },
  { icon: "dog-side", label: "Köpek", value: "dog" },
  { icon: "cat", label: "Kedi", value: "cat" }
];

const emptyMeta = {
  "caregiver-listings": {
    description: "Aradığınız kriterlere uygun bakıcı ilanı bulunamadı.",
    icon: "compass-off-outline" as const
  },
  "owner-requests": {
    description: "Kriterlere uygun bakıcı arayan bulunamadı.",
    icon: "file-search-outline" as const
  }
};

const searchPlaceholders = {
  "caregiver-listings": "Bakıcı, şehir veya hizmet ara...",
  "owner-requests": "İlan, tür veya şehir ara..."
};

export function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const initialTab: ExploreTab =
    params.tab === "owner-requests" ? "owner-requests" : "caregiver-listings";

  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);
  const [searchValue, setSearchValue] = useState("");
  const [caregiverFilter, setCaregiverFilter] = useState<CaregiverFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");

  const caregiverQuery = useInfiniteListings({ type: "SITTING" });
  const ownerQuery = useInfiniteListings({ type: "HELP_REQUEST" });

  const allCaregivers = useMemo(
    () => (caregiverQuery.data?.pages.flat() ?? []).filter(isCaregiverListing).map(toCaregiverDisplay),
    [caregiverQuery.data]
  );
  const allOwnerRequests = useMemo(
    () => (ownerQuery.data?.pages.flat() ?? []).filter(isOwnerRequestListing).map(toOwnerRequestDisplay),
    [ownerQuery.data]
  );


  const caregiverResults = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let results = allCaregivers.filter((item) => {
      if (!q) return true;
      return (
        item.caretakerName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });
    if (caregiverFilter === "verified") {
      results = results.filter((item) => item.verificationState === "verified");
    }
    return results;
  }, [allCaregivers, caregiverFilter, searchValue]);

  const ownerResults = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let results = allOwnerRequests.filter((item) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.petType.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });
    if (ownerFilter === "dog") {
      results = results.filter(
        (item) =>
          item.petType.toLowerCase().includes("köpek") || item.petType.toLowerCase().includes("dog")
      );
    }
    if (ownerFilter === "cat") {
      results = results.filter(
        (item) =>
          item.petType.toLowerCase().includes("kedi") || item.petType.toLowerCase().includes("cat")
      );
    }
    return results;
  }, [allOwnerRequests, ownerFilter, searchValue]);

  const activeData = useMemo((): Array<{ id: string }> => {
    if (activeTab === "caregiver-listings") return caregiverResults;
    return ownerResults;
  }, [activeTab, caregiverResults, ownerResults]);

  const isInitialLoading =
    (activeTab === "caregiver-listings" && caregiverQuery.isLoading) ||
    (activeTab === "owner-requests" && ownerQuery.isLoading);

  const isFetchingNextPage =
    (activeTab === "caregiver-listings" && caregiverQuery.isFetchingNextPage) ||
    (activeTab === "owner-requests" && ownerQuery.isFetchingNextPage);

  const refreshing =
    activeTab === "caregiver-listings"
      ? caregiverQuery.isFetching && !caregiverQuery.isFetchingNextPage && !caregiverQuery.isLoading
      : ownerQuery.isFetching && !ownerQuery.isFetchingNextPage && !ownerQuery.isLoading;

  const activeFilterItems =
    activeTab === "caregiver-listings" ? caregiverFilters : ownerFilters;

  const activeFilterValue =
    activeTab === "caregiver-listings" ? caregiverFilter : ownerFilter;

  function onFilterSelect(value: string) {
    if (activeTab === "caregiver-listings") setCaregiverFilter(value as CaregiverFilter);
    else setOwnerFilter(value as OwnerFilter);
  }

  function onRefresh() {
    if (activeTab === "caregiver-listings") void caregiverQuery.refetch();
    else void ownerQuery.refetch();
  }

  function handleEndReached() {
    if (activeTab === "caregiver-listings" && caregiverQuery.hasNextPage) {
      void caregiverQuery.fetchNextPage();
    } else if (activeTab === "owner-requests" && ownerQuery.hasNextPage) {
      void ownerQuery.fetchNextPage();
    }
  }

  function clearFilters() {
    setSearchValue("");
    if (activeTab === "caregiver-listings") setCaregiverFilter("all");
    else setOwnerFilter("all");
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<{ id: string }>) => {
      if (activeTab === "caregiver-listings") {
        const listing = item as CaregiverDisplay;
        return (
          <ListingCard
            actions={
              <View style={styles.actionRow}>
                <Link asChild href={routeBuilders.caregiverListingDetail(listing.id)}>
                  <AppButton label="İncele" size="sm" variant="secondary" />
                </Link>
              </View>
            }
            avatarLabel={listing.avatarLabel}
            badges={[{ icon: "map-marker-outline", label: listing.schedule, tone: "primary" }]}
            coverImageUri={listing.coverImageUri}
            description={listing.summary}
            location={listing.city}
            onPress={() => router.push(routeBuilders.caregiverListingDetail(listing.id))}
            priceLabel={listing.budget || "Fiyat belirtilmemiş"}
            subtitle={listing.title}
            title={listing.caretakerName}
            verificationState={listing.verificationState}
          />
        );
      }

      if (activeTab === "owner-requests") {
        const request = item as OwnerRequestDisplay;
        return (
          <OwnerRequestCard
            actions={
              <View style={styles.actionRow}>
                <Link asChild href={routeBuilders.ownerRequestDetail(request.id)}>
                  <AppButton label="İncele" size="sm" variant="secondary" />
                </Link>
              </View>
            }
            budget={request.budget || "Bütçe belirtilmemiş"}
            coverImageUri={request.coverImageUri}
            dateLabel={request.dateLabel}
            description={request.summary}
            distanceLabel={request.distanceLabel}
            location={request.city}
            onPress={() => router.push(routeBuilders.ownerRequestDetail(request.id))}
            petType={request.petType}
            title={request.title}
          />
        );
      }

      return null;
    },
    [activeTab]
  );

  return (
    <View style={styles.root}>
      {/* ── Sticky header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerOverline}>KEŞFET</Text>
            <Text style={styles.headerTitle}>Ne arıyorsunuz?</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{isInitialLoading ? "—" : activeData.length}</Text>
            <Text style={styles.countLabel}>sonuç</Text>
          </View>
        </View>

        <SearchBar
          onChangeText={setSearchValue}
          placeholder={searchPlaceholders[activeTab]}
          value={searchValue}
        />

        <SegmentedTabs onChange={setActiveTab} options={exploreTabs} value={activeTab} />

        <ScrollView
          contentContainerStyle={styles.filterContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {activeFilterItems.map((item) => (
            <FilterChip
              key={item.value}
              icon={item.icon}
              label={item.label}
              onPress={() => onFilterSelect(item.value)}
              selected={item.value === activeFilterValue}
            />
          ))}
        </ScrollView>

        <View style={styles.divider} />
      </View>

      {/* ── Content ── */}
      {isInitialLoading ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          <SkeletonCards count={4} />
        </ScrollView>
      ) : (
        <FlatList
          contentContainerStyle={
            activeData.length === 0 ? styles.listContentEmpty : styles.listContent
          }
          data={activeData}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <EmptyState
                actionSlot={
                  <AppButton
                    label="Filtreleri Temizle"
                    onPress={clearFilters}
                    variant="secondary"
                  />
                }
                description={emptyMeta[activeTab].description}
                icon={emptyMeta[activeTab].icon}
                title="Sonuç Yok"
              />
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor={colors.primary}
            />
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCards({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={skeletonStyles.card}>
          <View style={skeletonStyles.image} />
          <View style={skeletonStyles.body}>
            <View style={[skeletonStyles.line, { width: "55%" }]} />
            <View style={[skeletonStyles.line, { width: "85%", height: 12 }]} />
            <View style={[skeletonStyles.line, { width: "40%", height: 10 }]} />
          </View>
        </View>
      ))}
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: spacing.tight
  },
  countBadge: {
    alignItems: "flex-end"
  },
  countLabel: {
    ...typography.caption,
    color: colors.textMuted
  },
  countNumber: {
    ...typography.h2,
    color: colors.primary
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginHorizontal: -spacing.comfortable,
    marginTop: spacing.compact
  },
  emptyWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: spacing.large
  },
  filterContent: {
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable
  },
  filterScroll: {
    marginHorizontal: -spacing.comfortable
  },
  footerLoader: {
    paddingVertical: spacing.section
  },
  header: {
    ...shadows.card,
    backgroundColor: colors.surface,
    gap: spacing.compact,
    paddingBottom: spacing.standard,
    paddingHorizontal: spacing.comfortable,
    zIndex: 10
  },
  headerOverline: {
    ...typography.overline,
    color: colors.primary
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2
  },
  headerTitleBlock: {
    flex: 1
  },
  headerTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listContent: {
    paddingBottom: 110,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  listContentEmpty: {
    flexGrow: 1,
    paddingBottom: 110,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  separator: {
    height: spacing.standard
  }
});

const skeletonStyles = StyleSheet.create({
  body: {
    gap: spacing.compact,
    padding: spacing.standard
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden"
  },
  image: {
    backgroundColor: colors.surfaceMuted,
    height: 160
  },
  line: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.small,
    height: 14
  }
});
