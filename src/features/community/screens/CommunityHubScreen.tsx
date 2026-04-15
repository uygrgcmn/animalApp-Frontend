import { Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { communityPosts } from "../../../shared/mocks/marketplace";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";

type CommunityTab = "all" | "ucretsiz-mama" | "sahiplendirme" | "diger";
type QuickFilter = "all" | "today" | "verified" | "message-open";

const communityTabs: { label: string; value: CommunityTab }[] = [
  { label: "Tumu", value: "all" },
  { label: "Ucretsiz Mama", value: "ucretsiz-mama" },
  { label: "Sahiplendirme", value: "sahiplendirme" },
  { label: "Diger", value: "diger" }
];

const quickFilters: {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: QuickFilter;
}[] = [
  { icon: "view-grid-outline", label: "Tum feed", value: "all" },
  { icon: "calendar-today", label: "Bugun", value: "today" },
  { icon: "shield-check-outline", label: "Guvenli paylasim", value: "verified" },
  { icon: "message-text-fast-outline", label: "Mesaja acik", value: "message-open" }
];

export function CommunityHubScreen() {
  const [activeTab, setActiveTab] = useState<CommunityTab>("all");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 280);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeTab, quickFilter, searchValue]);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return communityPosts.filter((post) => {
      if (activeTab !== "all" && post.categoryKey !== activeTab) {
        return false;
      }

      if (quickFilter === "today" && post.dateLabel !== "Bugun") {
        return false;
      }

      if (quickFilter === "verified" && post.trustState !== "verified") {
        return false;
      }

      if (
        quickFilter === "message-open" &&
        !post.quickActionLabel.toLowerCase().includes("mesaj")
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.summary.toLowerCase().includes(normalizedSearch) ||
        post.author.toLowerCase().includes(normalizedSearch) ||
        post.city.toLowerCase().includes(normalizedSearch) ||
        post.district.toLowerCase().includes(normalizedSearch) ||
        post.category.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, quickFilter, searchValue]);

  const featuredPosts = useMemo(
    () =>
      filteredPosts.filter(
        (post) => post.trustState === "verified" || post.dateLabel === "Bugun"
      ).slice(0, 2),
    [filteredPosts]
  );

  const verifiedCount = communityPosts.filter((post) => post.trustState === "verified").length;
  const urgentCount = communityPosts.filter((post) => post.dateLabel === "Bugun").length;

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Topluluk</Text>
      </View>

      <InfoCard
        description="Topluluk akisi guven sinyalleri, hizli filtreler ve acik aksiyonlarla daha rahat taranir."
        title="Topluluk Ozeti"
        variant="accent"
      >
        <View style={styles.metaSummary}>
          <MetaPill icon="hand-heart-outline" label={`${communityPosts.length} paylasim`} tone="success" />
          <MetaPill icon="shield-check-outline" label={`${verifiedCount} dogrulanmis`} tone="primary" />
          <MetaPill icon="clock-outline" label={`${urgentCount} bugun oncelikli`} tone="warning" />
        </View>
      </InfoCard>

      <InfoCard
        description="Ucretsiz mama, sahiplendirme veya farkli destek ihtiyaclarini topluluk tipinde hizlica acabilirsin."
        title="Yeni paylasim baslat"
      >
        <View style={styles.composeCard}>
          <View style={styles.composeIcon}>
            <AppIcon name="pencil-box-outline" size={22} tone="warning" />
          </View>
          <View style={styles.composeTexts}>
            <Text style={styles.composeTitle}>Topluluga katki sun</Text>
            <Text style={styles.composeDescription}>
              Ihtiyacini veya destek teklifini ayni akisin icine duzenli bir kart olarak ekle.
            </Text>
          </View>
        </View>
        <Link href={routeBuilders.createWithType("community-post")} asChild>
          <AppButton
            label="Topluluk Paylasimi Olustur"
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={18} />}
          />
        </Link>
      </InfoCard>

      <View style={styles.tabSection}>
        <SegmentedTabs onChange={setActiveTab} options={communityTabs} value={activeTab} />
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          placeholder="Paylasim, kisi veya konum ara"
          showFilterButton
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>

      <View style={styles.filterSection}>
        <FilterRow items={quickFilters} onSelect={setQuickFilter} selectedValue={quickFilter} />
      </View>

      <CommunityMetaSummary
        activeTab={activeTab}
        quickFilter={quickFilter}
        resultCount={filteredPosts.length}
      />

      {featuredPosts.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            description="Guven veren veya bugun hareketli olan paylasimlar ustte one cikar."
            title="One Cikan Paylasimlar"
          />
          <View style={styles.list}>
            {featuredPosts.map((post) => (
              <CommunityCard
                key={`featured-${post.id}`}
                actionSlot={
                  <View style={styles.actionRow}>
                    <Link href={routeBuilders.communityPostDetail(post.id)} asChild>
                      <AppButton label="Detaya Git" variant="secondary" />
                    </Link>
                    <AppButton
                      label={post.quickActionLabel}
                      leftSlot={
                        <AppIcon
                          backgrounded={false}
                          color="#FFFFFF"
                          name={getQuickActionIcon(post.quickActionLabel)}
                          size={18}
                        />
                      }
                      onPress={() => {
                        handleQuickAction(post.quickActionLabel, post.id);
                      }}
                    />
                  </View>
                }
                author={post.author}
                authorRole={post.authorRole}
                category={post.category}
                dateLabel={post.dateLabel}
                description={post.summary}
                imageUri={post.imageUri}
                location={`${post.city} / ${post.district}`}
                onPress={() => {
                  router.push(routeBuilders.communityPostDetail(post.id));
                }}
                title={post.title}
                verificationState={post.trustState}
                visualLabel={post.visualLabel}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          description="Filtrelenmis topluluk akisi okunabilir kartlar ve net aksiyonlarla listelenir."
          title="Topluluk Akisi"
        />
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <CommunityLoadingCards count={3} />
          ) : filteredPosts.length > 0 ? (
            <View style={styles.list}>
              {filteredPosts.map((post) => (
                <CommunityCard
                  key={post.id}
                  actionSlot={
                    <View style={styles.actionRow}>
                      <AppButton
                        label="Mesaj"
                        leftSlot={
                          <AppIcon backgrounded={false} name="message-text-outline" size={18} />
                        }
                        onPress={() => {
                          router.push(routes.app.messages);
                        }}
                        variant="secondary"
                      />
                      <AppButton
                        label={post.quickActionLabel}
                        leftSlot={
                          <AppIcon
                            backgrounded={false}
                            color="#FFFFFF"
                            name={getQuickActionIcon(post.quickActionLabel)}
                            size={18}
                          />
                        }
                        onPress={() => {
                          handleQuickAction(post.quickActionLabel, post.id);
                        }}
                      />
                    </View>
                  }
                  author={post.author}
                  authorRole={post.authorRole}
                  category={post.category}
                  dateLabel={post.dateLabel}
                  description={post.summary}
                  imageUri={post.imageUri}
                  location={`${post.city} / ${post.district}`}
                  onPress={() => {
                    router.push(routeBuilders.communityPostDetail(post.id));
                  }}
                  title={post.title}
                  verificationState={post.trustState}
                  visualLabel={post.visualLabel}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              actionSlot={
                <AppButton
                  label="Filtreleri Temizle"
                  onPress={() => {
                    resetCommunityState(setActiveTab, setQuickFilter, setSearchValue);
                  }}
                  variant="secondary"
                />
              }
              description="Secili kategori ve filtrelerde gosterilecek bir topluluk paylasimi bulunamadi."
              icon="hand-heart-outline"
              title="Sonuc Yok"
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

type FilterRowProps<T extends string> = {
  items: { icon: React.ComponentProps<typeof AppIcon>["name"]; label: string; value: T }[];
  onSelect: (value: T) => void;
  selectedValue: T;
};

function FilterRow<T extends string>({ items, onSelect, selectedValue }: FilterRowProps<T>) {
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

function CommunityMetaSummary({
  activeTab,
  quickFilter,
  resultCount
}: {
  activeTab: CommunityTab;
  quickFilter: QuickFilter;
  resultCount: number;
}) {
  return (
    <View style={styles.metaSummary}>
      <MetaPill icon="view-agenda-outline" label={`${resultCount} sonuc`} tone="primary" />
      <MetaPill icon="shape-outline" label={getTabLabel(activeTab)} tone="neutral" />
      <MetaPill icon="tune-variant" label={getFilterLabel(quickFilter)} tone="warning" />
    </View>
  );
}

function CommunityLoadingCards({ count }: { count: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Topluluk paylasimlari yukleniyor...</Text>
        </View>
      ))}
    </View>
  );
}

function getTabLabel(activeTab: CommunityTab) {
  return communityTabs.find((item) => item.value === activeTab)?.label ?? "Tumu";
}

function getFilterLabel(quickFilter: QuickFilter) {
  return quickFilters.find((item) => item.value === quickFilter)?.label ?? "Tum feed";
}

function getQuickActionIcon(label: string) {
  if (label === "Basvur") return "file-document-outline";
  if (label.toLowerCase().includes("mesaj")) return "message-text-outline";
  return "hand-heart-outline";
}

function handleQuickAction(label: string, postId: string) {
  if (label.toLowerCase().includes("mesaj")) {
    router.push(routes.app.messages);
    return;
  }

  router.push(routeBuilders.communityPostDetail(postId));
}

function resetCommunityState(
  setActiveTab: React.Dispatch<React.SetStateAction<CommunityTab>>,
  setQuickFilter: React.Dispatch<React.SetStateAction<QuickFilter>>,
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
) {
  setActiveTab("all");
  setQuickFilter("all");
  setSearchValue("");
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: spacing.tight
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  composeCard: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: "#FFF7ED",
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.compact,
    padding: spacing.standard
  },
  composeDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  composeBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.standard,
    padding: spacing.compact,
    ...shadows.card,
    shadowOpacity: 0.04
  },
  composeIcon: {
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: radius.large,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  composePlaceholder: {
    color: colors.textSubtle,
    flex: 1,
    ...typography.body
  },
  composeSection: {
    paddingHorizontal: spacing.micro
  },
  composeTexts: {
    flex: 1,
    gap: spacing.micro
  },
  composeTitle: {
    color: colors.text,
    ...typography.h3
  },
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large
  },
  featuredCardWidth: {
    width: 280
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
  horizontalScroll: {
    marginHorizontal: -spacing.comfortable
  },
  horizontalScrollContent: {
    gap: spacing.standard,
    paddingHorizontal: spacing.comfortable
  },
  list: {
    gap: spacing.standard
  },
  loadingCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    minHeight: 120,
    justifyContent: "center",
    padding: spacing.comfortable
  },
  loadingText: {
    color: colors.textMuted,
    ...typography.body
  },
  metaSummary: {
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.micro
  },
  resultsContainer: {
    gap: spacing.standard
  },
  searchSection: {
    paddingHorizontal: spacing.micro
  },
  section: {
    gap: spacing.standard
  },
  sectionTitle: {
    color: colors.text,
    paddingHorizontal: spacing.micro,
    ...typography.h2
  },
  tabSection: {
    paddingHorizontal: spacing.micro
  }
});
