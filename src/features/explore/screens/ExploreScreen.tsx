import { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import {
  caregiverListings,
  ownerRequests,
  petshopCampaigns
} from "../../../shared/mocks/marketplace";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";

type ExploreTab = "caregiver-listings" | "owner-requests" | "petshop-campaigns";
type CaregiverFilter = "all" | "verified" | "weekend";
type OwnerFilter = "all" | "dog" | "cat";
type CampaignFilter = "all" | "discount" | "nearby";
type CaregiverSort = "recommended" | "price-low" | "latest";
type OwnerSort = "nearest" | "budget-high" | "soonest";
type CampaignSort = "featured" | "discount-high" | "deadline";

const exploreTabs: { label: string; value: ExploreTab }[] = [
  { label: "Bakici Ilanlari", value: "caregiver-listings" },
  { label: "Bakici Arayanlar", value: "owner-requests" },
  { label: "Petshop Kampanyalari", value: "petshop-campaigns" }
];

const caregiverFilters: { icon: React.ComponentProps<typeof AppIcon>["name"]; label: string; value: CaregiverFilter }[] = [
  { icon: "view-grid-outline", label: "Tum ilanlar", value: "all" },
  { icon: "shield-check-outline", label: "Dogrulananlar", value: "verified" },
  { icon: "calendar-weekend-outline", label: "Hafta sonu", value: "weekend" }
];

const ownerFilters: { icon: React.ComponentProps<typeof AppIcon>["name"]; label: string; value: OwnerFilter }[] = [
  { icon: "view-grid-outline", label: "Tum talepler", value: "all" },
  { icon: "dog-side", label: "Kopek", value: "dog" },
  { icon: "cat", label: "Kedi", value: "cat" }
];

const campaignFilters: { icon: React.ComponentProps<typeof AppIcon>["name"]; label: string; value: CampaignFilter }[] = [
  { icon: "view-grid-outline", label: "Tum kampanyalar", value: "all" },
  { icon: "sale-outline", label: "Indirimliler", value: "discount" },
  { icon: "map-marker-outline", label: "Yakindakiler", value: "nearby" }
];

const caregiverSortOptions: { label: string; value: CaregiverSort }[] = [
  { label: "Onerilen", value: "recommended" },
  { label: "Ucret artan", value: "price-low" },
  { label: "Yeni", value: "latest" }
];

const ownerSortOptions: { label: string; value: OwnerSort }[] = [
  { label: "En yakin", value: "nearest" },
  { label: "Butce yuksek", value: "budget-high" },
  { label: "En yakin tarih", value: "soonest" }
];

const campaignSortOptions: { label: string; value: CampaignSort }[] = [
  { label: "One cikan", value: "featured" },
  { label: "Indirim yuksek", value: "discount-high" },
  { label: "Son tarih", value: "deadline" }
];

export function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<ExploreTab>("caregiver-listings");
  const [searchValue, setSearchValue] = useState("");
  const [caregiverFilter, setCaregiverFilter] = useState<CaregiverFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");
  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>("all");
  const [caregiverSort, setCaregiverSort] = useState<CaregiverSort>("recommended");
  const [ownerSort, setOwnerSort] = useState<OwnerSort>("nearest");
  const [campaignSort, setCampaignSort] = useState<CampaignSort>("featured");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 280);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    activeTab,
    campaignFilter,
    campaignSort,
    caregiverFilter,
    caregiverSort,
    ownerFilter,
    ownerSort,
    searchValue
  ]);

  const caregiverResults = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    let results = caregiverListings.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        item.caretakerName.toLowerCase().includes(normalizedSearch) ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.city.toLowerCase().includes(normalizedSearch) ||
        item.summary.toLowerCase().includes(normalizedSearch)
      );
    });

    if (caregiverFilter === "verified") {
      results = results.filter((item) => item.verificationState === "verified");
    }

    if (caregiverFilter === "weekend") {
      results = results.filter((item) => item.availability === "Hafta sonu");
    }

    if (caregiverSort === "price-low") {
      results = [...results].sort((left, right) => parseCurrency(left.budget) - parseCurrency(right.budget));
    }

    if (caregiverSort === "latest") {
      results = [...results].reverse();
    }

    return results;
  }, [caregiverFilter, caregiverSort, searchValue]);

  const ownerResults = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    let results = ownerRequests.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.city.toLowerCase().includes(normalizedSearch) ||
        item.petType.toLowerCase().includes(normalizedSearch) ||
        item.summary.toLowerCase().includes(normalizedSearch)
      );
    });

    if (ownerFilter === "dog") {
      results = results.filter((item) => item.petType === "Kopek");
    }

    if (ownerFilter === "cat") {
      results = results.filter((item) => item.petType === "Kedi");
    }

    if (ownerSort === "budget-high") {
      results = [...results].sort((left, right) => parseCurrency(right.budget) - parseCurrency(left.budget));
    }

    if (ownerSort === "soonest") {
      results = [...results].sort((left, right) => left.dateLabel.localeCompare(right.dateLabel));
    }

    return results;
  }, [ownerFilter, ownerSort, searchValue]);

  const campaignResults = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    let results = petshopCampaigns.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.storeName.toLowerCase().includes(normalizedSearch) ||
        item.city.toLowerCase().includes(normalizedSearch) ||
        item.summary.toLowerCase().includes(normalizedSearch)
      );
    });

    if (campaignFilter === "discount") {
      results = results.filter((item) => item.discount.includes("20") || item.discount.includes("15"));
    }

    if (campaignFilter === "nearby") {
      results = results.filter((item) => item.city === "Istanbul");
    }

    if (campaignSort === "discount-high") {
      results = [...results].sort((left, right) => parseDiscount(right.discount) - parseDiscount(left.discount));
    }

    if (campaignSort === "deadline") {
      results = [...results].reverse();
    }

    return results;
  }, [campaignFilter, campaignSort, searchValue]);

  const activeResultCount =
    activeTab === "caregiver-listings"
      ? caregiverResults.length
      : activeTab === "owner-requests"
        ? ownerResults.length
        : campaignResults.length;

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kesfet</Text>
      </View>

      <View style={styles.tabSection}>
        <SegmentedTabs onChange={setActiveTab} options={exploreTabs} value={activeTab} />
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          placeholder={
            activeTab === "caregiver-listings"
              ? "Bakici, sehir veya hizmet ara"
              : activeTab === "owner-requests"
                ? "Ilan basligi, tur veya sehir ara"
                : "Magaza, kampanya veya urun ara"
          }
          showFilterButton
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>

      <View style={styles.filterSection}>
        {activeTab === "caregiver-listings" && (
          <FilterRow
            items={caregiverFilters}
            selectedValue={caregiverFilter}
            onSelect={setCaregiverFilter}
          />
        )}
        {activeTab === "owner-requests" && (
          <FilterRow items={ownerFilters} selectedValue={ownerFilter} onSelect={setOwnerFilter} />
        )}
        {activeTab === "petshop-campaigns" && (
          <FilterRow
            items={campaignFilters}
            selectedValue={campaignFilter}
            onSelect={setCampaignFilter}
          />
        )}
      </View>

      <ExploreMetaSummary
        activeTab={activeTab}
        resultCount={activeResultCount}
        sortLabel={
          activeTab === "caregiver-listings"
            ? caregiverSortOptions.find((item) => item.value === caregiverSort)?.label ?? ""
            : activeTab === "owner-requests"
              ? ownerSortOptions.find((item) => item.value === ownerSort)?.label ?? ""
              : campaignSortOptions.find((item) => item.value === campaignSort)?.label ?? ""
        }
      />

      <View style={styles.resultsContainer}>
        {activeTab === "caregiver-listings" && (
          <View style={styles.list}>
            {isLoading ? (
              <ExploreLoadingCards count={3} />
            ) : caregiverResults.length > 0 ? (
              caregiverResults.map((listing) => (
                <ListingCard
                  key={listing.id}
                  actions={
                    <View style={styles.actionRow}>
                      <Link href={routeBuilders.caregiverListingDetail(listing.id)} asChild>
                        <AppButton label="Incele" variant="secondary" />
                      </Link>
                      <AppButton label="Kaydet" variant="ghost" />
                    </View>
                  }
                  avatarLabel={listing.avatarLabel}
                  badges={[
                    { icon: "calendar-range", label: listing.schedule, tone: "primary" },
                    { icon: "star", label: listing.badge, tone: "warning" }
                  ]}
                  description={listing.summary}
                  location={listing.city}
                  priceLabel={listing.budget}
                  subtitle={listing.title}
                  title={listing.caretakerName}
                  verificationState={listing.verificationState}
                />
              ))
            ) : (
              <EmptyState
                actionSlot={<AppButton label="Filtreleri Temizle" onPress={resetCaregiverState.bind(null, setSearchValue, setCaregiverFilter, setCaregiverSort)} variant="secondary" />}
                description="Aradiginiz kriterlere uygun bakici ilani bulunamadi."
                icon="compass-off-outline"
                title="Sonuc Yok"
              />
            )}
          </View>
        )}

        {activeTab === "owner-requests" && (
          <View style={styles.list}>
            {isLoading ? (
              <ExploreLoadingCards count={3} />
            ) : ownerResults.length > 0 ? (
              ownerResults.map((request) => (
                <OwnerRequestCard
                  key={request.id}
                  budget={request.budget}
                  dateLabel={request.dateLabel}
                  description={request.summary}
                  listingId={request.id}
                  location={`${request.city} • ${request.distanceLabel}`}
                  petType={request.petType}
                  title={request.title}
                />
              ))
            ) : (
              <EmptyState
                actionSlot={<AppButton label="Filtreleri Temizle" onPress={resetOwnerState.bind(null, setSearchValue, setOwnerFilter, setOwnerSort)} variant="secondary" />}
                description="Kriterlere uygun bakici arayan bulunamadi."
                icon="file-search-outline"
                title="Sonuc Yok"
              />
            )}
          </View>
        )}

        {activeTab === "petshop-campaigns" && (
          <View style={styles.list}>
            {isLoading ? (
              <ExploreLoadingCards count={2} />
            ) : campaignResults.length > 0 ? (
              campaignResults.map((campaign) => (
                <PetshopCampaignCard
                  key={campaign.id}
                  actionSlot={
                    <View style={styles.actionRow}>
                      <Link href={routeBuilders.petshopCampaignDetail(campaign.id)} asChild>
                        <AppButton label="Incele" variant="secondary" />
                      </Link>
                      <AppButton label="Kaydet" variant="ghost" />
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
              ))
            ) : (
              <EmptyState
                actionSlot={<AppButton label="Filtreleri Temizle" onPress={resetCampaignState.bind(null, setSearchValue, setCampaignFilter, setCampaignSort)} variant="secondary" />}
                description="Su an aktif bir kampanya bulunmuyor."
                icon="store-search-outline"
                title="Sonuc Yok"
              />
            )}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

type ExploreSectionProps = {
  children: React.ReactNode;
  description: string;
  title: string;
};

function ExploreSection({ children, description, title }: ExploreSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader description={description} title={title} />
      {children}
    </View>
  );
}

type FilterRowProps<T extends string> = {
  items: { icon: React.ComponentProps<typeof AppIcon>["name"]; label: string; value: T }[];
  onSelect: (value: T) => void;
  selectedValue: T;
};

function FilterRow<T extends string>({
  items,
  onSelect,
  selectedValue
}: FilterRowProps<T>) {
  return (
    <ScrollView
      contentContainerStyle={styles.filterScrollContent}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
    >
      {items.map((item) => (
        <FilterChip
          key={item.value}
          icon={item.icon}
          label={item.label}
          onPress={() => {
            onSelect(item.value);
          }}
          selected={item.value === selectedValue}
        />
      ))}
    </ScrollView>
  );
}

type SortRowProps<T extends string> = {
  onSelect: (value: T) => void;
  options: { label: string; value: T }[];
  selectedValue: T;
};

function SortRow<T extends string>({ onSelect, options, selectedValue }: SortRowProps<T>) {
  return (
    <View style={styles.sortRow}>
      <Text style={styles.sortLabel}>Siralama</Text>
      <ScrollView
        contentContainerStyle={styles.filterScrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {options.map((option) => (
          <FilterChip
            key={option.value}
            icon="swap-vertical"
            label={option.label}
            onPress={() => {
              onSelect(option.value);
            }}
            selected={option.value === selectedValue}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ExploreMetaSummary({
  activeTab,
  resultCount,
  sortLabel
}: {
  activeTab: ExploreTab;
  resultCount: number;
  sortLabel: string;
}) {
  return (
    <View style={styles.metaSummary}>
      <MetaPill
        icon="view-agenda-outline"
        label={`${resultCount} sonuc`}
        tone="primary"
      />
      <MetaPill
        icon="shape-outline"
        label={
          activeTab === "caregiver-listings"
            ? "Bakici Ilanlari"
            : activeTab === "owner-requests"
              ? "Bakici Arayanlar"
              : "Petshop Kampanyalari"
        }
        tone="neutral"
      />
    </View>
  );
}

function ExploreLoadingCards({ count }: { count: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Sonuclar yukleniyor...</Text>
        </View>
      ))}
    </View>
  );
}

function OwnerRequestCard({
  budget,
  dateLabel,
  description,
  listingId,
  location,
  petType,
  title
}: {
  budget: string;
  dateLabel: string;
  description: string;
  listingId: string;
  location: string;
  petType: string;
  title: string;
}) {
  return (
    <View style={styles.ownerCard}>
      <View style={styles.ownerHeader}>
        <View style={styles.ownerTexts}>
          <Text style={styles.ownerTitle}>{title}</Text>
          <Text style={styles.ownerDescription}>{description}</Text>
        </View>
        <VerificationBadge state="pending" />
      </View>
      <View style={styles.metaRow}>
        <MetaPill icon="paw-outline" label={petType} tone="primary" />
        <MetaPill icon="calendar-clock-outline" label={dateLabel} tone="warning" />
      </View>
      <View style={styles.metaRow}>
        <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
        <MetaPill icon="cash" label={budget} tone="success" />
      </View>
      <View style={styles.actionRow}>
        <Link href={routeBuilders.ownerRequestDetail(listingId)} asChild>
          <AppButton label="Incele" variant="secondary" />
        </Link>
        <AppButton label="Kaydet" variant="ghost" />
      </View>
    </View>
  );
}

function parseCurrency(value: string) {
  const match = value.match(/\d[\d.]*/);
  return match ? Number(match[0].replace(/\./g, "")) : 0;
}

function parseDiscount(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function resetCaregiverState(
  setSearchValue: (value: string) => void,
  setFilter: (value: CaregiverFilter) => void,
  setSort: (value: CaregiverSort) => void
) {
  setSearchValue("");
  setFilter("all");
  setSort("recommended");
}

function resetOwnerState(
  setSearchValue: (value: string) => void,
  setFilter: (value: OwnerFilter) => void,
  setSort: (value: OwnerSort) => void
) {
  setSearchValue("");
  setFilter("all");
  setSort("nearest");
}

function resetCampaignState(
  setSearchValue: (value: string) => void,
  setFilter: (value: CampaignFilter) => void,
  setSort: (value: CampaignSort) => void
) {
  setSearchValue("");
  setFilter("all");
  setSort("featured");
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: spacing.tight
  },
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large
  },
  filterScroll: {
    marginHorizontal: -spacing.comfortable
  },
  filterScrollContent: {
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable
  },
  filterSection: {
    marginTop: -spacing.tight
  },
  header: {
    gap: spacing.micro,
    paddingHorizontal: spacing.micro
  },
  headerSubtitle: {
    color: colors.textMuted,
    ...typography.body
  },
  headerTitle: {
    color: colors.text,
    ...typography.display
  },
  loadingCard: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.tight,
    minHeight: 120,
    justifyContent: "center",
    padding: spacing.standard
  },
  loadingText: {
    color: colors.textMuted,
    ...typography.body
  },
  list: {
    gap: spacing.standard
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  metaSummary: {
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.micro
  },
  ownerCard: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.standard
  },
  ownerDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  ownerHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  ownerTexts: {
    flex: 1,
    gap: spacing.tight
  },
  ownerTitle: {
    color: colors.text,
    ...typography.h3
  },
  resultsContainer: {
    marginTop: -spacing.micro
  },
  searchSection: {
    paddingHorizontal: spacing.micro
  },
  section: {
    gap: spacing.compact
  },
  sortLabel: {
    color: colors.textSubtle,
    ...typography.label,
    paddingHorizontal: spacing.comfortable
  },
  sortRow: {
    gap: spacing.tight
  },
  tabSection: {
    paddingHorizontal: spacing.micro
  }
});
