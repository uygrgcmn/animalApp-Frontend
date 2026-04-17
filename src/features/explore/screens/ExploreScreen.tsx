import { useMemo, useState } from "react";
import { Link, router } from "expo-router";
import {
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
import { useListings } from "../../listings/hooks/useListings";
import { toCaregiverDisplay, toOwnerRequestDisplay } from "../../listings/utils/adapters";
import { petshopCampaigns } from "../../../shared/mocks/marketplace";
import { AppButton } from "../../../shared/ui/AppButton";
import type { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { OwnerRequestCard } from "../../../shared/ui/OwnerRequestCard";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";

type ExploreTab = "caregiver-listings" | "owner-requests" | "petshop-campaigns";
type CaregiverFilter = "all" | "verified" | "weekend";
type OwnerFilter = "all" | "dog" | "cat";
type CampaignFilter = "all" | "discount" | "nearby";

type FilterItem<T extends string> = {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: T;
};

const exploreTabs: { label: string; value: ExploreTab }[] = [
  { label: "Bakıcı İlanları", value: "caregiver-listings" },
  { label: "Bakıcı Arayanlar", value: "owner-requests" },
  { label: "Petshop", value: "petshop-campaigns" }
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

const campaignFilters: FilterItem<CampaignFilter>[] = [
  { icon: "view-grid-outline", label: "Tümü", value: "all" },
  { icon: "sale-outline", label: "İndirimli", value: "discount" },
  { icon: "map-marker-outline", label: "Yakında", value: "nearby" }
];

const emptyMeta = {
  "caregiver-listings": {
    description: "Aradığınız kriterlere uygun bakıcı ilanı bulunamadı.",
    icon: "compass-off-outline" as const
  },
  "owner-requests": {
    description: "Kriterlere uygun bakıcı arayan bulunamadı.",
    icon: "file-search-outline" as const
  },
  "petshop-campaigns": {
    description: "Şu an aktif bir kampanya bulunmuyor.",
    icon: "store-search-outline" as const
  }
};

const searchPlaceholders = {
  "caregiver-listings": "Bakıcı, şehir veya hizmet ara...",
  "owner-requests": "İlan, tür veya şehir ara...",
  "petshop-campaigns": "Mağaza veya kampanya ara..."
};

export function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ExploreTab>("caregiver-listings");
  const [searchValue, setSearchValue] = useState("");
  const [caregiverFilter, setCaregiverFilter] = useState<CaregiverFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>("all");

  const caregiverQuery = useListings({ type: "SITTING" });
  const allCaregivers = useMemo(
    () => (caregiverQuery.data ?? []).map(toCaregiverDisplay),
    [caregiverQuery.data]
  );

  const ownerQuery = useListings({ type: "HELP_REQUEST" });
  const allOwnerRequests = useMemo(
    () => (ownerQuery.data ?? []).map(toOwnerRequestDisplay),
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
          item.petType.toLowerCase().includes("köpek") ||
          item.petType.toLowerCase().includes("dog")
      );
    }
    if (ownerFilter === "cat") {
      results = results.filter(
        (item) =>
          item.petType.toLowerCase().includes("kedi") ||
          item.petType.toLowerCase().includes("cat")
      );
    }
    return results;
  }, [allOwnerRequests, ownerFilter, searchValue]);

  const campaignResults = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    let results = petshopCampaigns.filter((item) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.storeName.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });
    if (campaignFilter === "discount") {
      results = results.filter((item) => item.discount.includes("%"));
    }
    return results;
  }, [campaignFilter, searchValue]);

  const isLoading =
    activeTab === "caregiver-listings"
      ? caregiverQuery.isLoading
      : activeTab === "owner-requests"
        ? ownerQuery.isLoading
        : false;

  const activeCount =
    activeTab === "caregiver-listings"
      ? caregiverResults.length
      : activeTab === "owner-requests"
        ? ownerResults.length
        : campaignResults.length;

  const refreshing =
    (caregiverQuery.isFetching || ownerQuery.isFetching) &&
    !caregiverQuery.isLoading &&
    !ownerQuery.isLoading;

  const activeFilterItems =
    activeTab === "caregiver-listings"
      ? caregiverFilters
      : activeTab === "owner-requests"
        ? ownerFilters
        : campaignFilters;

  const activeFilterValue =
    activeTab === "caregiver-listings"
      ? caregiverFilter
      : activeTab === "owner-requests"
        ? ownerFilter
        : campaignFilter;

  function onFilterSelect(value: string) {
    if (activeTab === "caregiver-listings") setCaregiverFilter(value as CaregiverFilter);
    else if (activeTab === "owner-requests") setOwnerFilter(value as OwnerFilter);
    else setCampaignFilter(value as CampaignFilter);
  }

  function onRefresh() {
    void caregiverQuery.refetch();
    void ownerQuery.refetch();
  }

  function clearFilters() {
    setSearchValue("");
    if (activeTab === "caregiver-listings") setCaregiverFilter("all");
    else if (activeTab === "owner-requests") setOwnerFilter("all");
    else setCampaignFilter("all");
  }

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
            <Text style={styles.countNumber}>{isLoading ? "—" : activeCount}</Text>
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
              onPress={() => {
                onFilterSelect(item.value);
              }}
              selected={item.value === activeFilterValue}
            />
          ))}
        </ScrollView>

        <View style={styles.divider} />
      </View>

      {/* ── Scrollable results ── */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <SkeletonCards count={4} />
        ) : activeCount > 0 ? (
          <>
            {activeTab === "caregiver-listings" &&
              caregiverResults.map((listing) => (
                <ListingCard
                  key={listing.id}
                  actions={
                    <View style={styles.actionRow}>
                      <Link asChild href={routeBuilders.caregiverListingDetail(listing.id)}>
                        <AppButton label="İncele" size="sm" variant="secondary" />
                      </Link>
                    </View>
                  }
                  avatarLabel={listing.avatarLabel}
                  badges={[
                    { icon: "map-marker-outline", label: listing.schedule, tone: "primary" }
                  ]}
                  coverImageUri={listing.coverImageUri}
                  description={listing.summary}
                  location={listing.city}
                  onPress={() => router.push(routeBuilders.caregiverListingDetail(listing.id))}
                  priceLabel={listing.budget || "Fiyat belirtilmemiş"}
                  subtitle={listing.title}
                  title={listing.caretakerName}
                  verificationState={listing.verificationState}
                />
              ))}

            {activeTab === "owner-requests" &&
              ownerResults.map((request) => (
                <OwnerRequestCard
                  key={request.id}
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
              ))}

            {activeTab === "petshop-campaigns" &&
              campaignResults.map((campaign) => (
                <PetshopCampaignCard
                  key={campaign.id}
                  actionSlot={
                    <View style={styles.actionRow}>
                      <Link asChild href={routeBuilders.petshopCampaignDetail(campaign.id)}>
                        <AppButton label="İncele" size="sm" variant="secondary" />
                      </Link>
                    </View>
                  }
                  campaignLabel={campaign.campaignLabel}
                  deadline={campaign.deadline}
                  description={campaign.summary}
                  priceLabel={`${campaign.discount} • ${campaign.priceLabel}`}
                  storeName={campaign.storeName}
                  title={campaign.title}
                  visualLabel={campaign.visualLabel}
                />
              ))}
          </>
        ) : (
          <View style={styles.emptyWrap}>
            <EmptyState
              actionSlot={
                <AppButton label="Filtreleri Temizle" onPress={clearFilters} variant="secondary" />
              }
              description={emptyMeta[activeTab].description}
              icon={emptyMeta[activeTab].icon}
              title="Sonuç Yok"
            />
          </View>
        )}
      </ScrollView>
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
    paddingTop: spacing.large
  },
  filterContent: {
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable
  },
  filterScroll: {
    marginHorizontal: -spacing.comfortable
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
    gap: spacing.standard,
    paddingBottom: 110,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  root: {
    backgroundColor: colors.background,
    flex: 1
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
