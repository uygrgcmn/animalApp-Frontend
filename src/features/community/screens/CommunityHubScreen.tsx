import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { useInfiniteCommunityListings } from "../hooks/useCommunityListings";
import {
  toCommunityDisplay,
  type CommunityPostDisplay
} from "../../listings/utils/adapters";
import { AppButton } from "../../../shared/ui/AppButton";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";

type CommunityTab = "all" | "ucretsiz" | "sahiplendirme" | "destek";

const communityTabs: { label: string; value: CommunityTab }[] = [
  { label: "Tümü", value: "all" },
  { label: "Ücretsiz", value: "ucretsiz" },
  { label: "Sahiplendirme", value: "sahiplendirme" },
  { label: "Destek", value: "destek" }
];

const TAB_CATEGORY_MAP: Record<CommunityTab, string[]> = {
  all: [],
  ucretsiz: ["FREE_ITEM", "ucretsiz-mama"],
  sahiplendirme: ["sahiplendirme"],
  destek: ["diger", "HELP_REQUEST", "ACTIVITY"]
};

export function CommunityHubScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<CommunityTab>("all");
  const [searchValue, setSearchValue] = useState("");

  const communityQuery = useInfiniteCommunityListings();

  const allPosts = useMemo(
    () => (communityQuery.data?.pages.flat() ?? []).map(toCommunityDisplay),
    [communityQuery.data]
  );

  const filteredPosts = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    const allowedKeys = activeTab !== "all" ? TAB_CATEGORY_MAP[activeTab] : [];
    return allPosts.filter((post) => {
      if (activeTab !== "all" && !allowedKeys.includes(post.categoryKey)) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.city.toLowerCase().includes(q) ||
        post.district.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    });
  }, [allPosts, activeTab, searchValue]);

  const refreshing =
    communityQuery.isFetching &&
    !communityQuery.isFetchingNextPage &&
    !communityQuery.isLoading;

  function resetFilters() {
    setActiveTab("all");
    setSearchValue("");
  }

  function handleEndReached() {
    if (communityQuery.hasNextPage) {
      void communityQuery.fetchNextPage();
    }
  }

  const renderItem = useCallback(({ item }: ListRenderItemInfo<CommunityPostDisplay>) => {
    return (
      <CommunityCard
        actionSlot={
          <View style={styles.actionRow}>
            <AppButton
              label="Mesaj"
              onPress={() => router.push(routes.app.messages)}
              size="sm"
              variant="secondary"
            />
            <AppButton
              label={item.quickActionLabel}
              onPress={() => router.push(routeBuilders.communityPostDetail(item.id))}
              size="sm"
            />
          </View>
        }
        author={item.author}
        category={item.category}
        dateLabel={item.dateLabel}
        description={item.summary}
        imageUri={item.imageUri}
        location={`${item.city}${item.district ? ` / ${item.district}` : ""}`}
        onPress={() => router.push(routeBuilders.communityPostDetail(item.id))}
        title={item.title}
        verificationState={item.trustState}
        visualLabel={item.visualLabel}
      />
    );
  }, []);

  return (
    <View style={styles.root}>
      {/* ── Sticky header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerOverline}>TOPLULUK</Text>
            <Text style={styles.headerTitle}>Paylaşımlar</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>
              {communityQuery.isLoading ? "—" : filteredPosts.length}
            </Text>
            <Text style={styles.countLabel}>paylaşım</Text>
          </View>
        </View>

        <SearchBar
          onChangeText={setSearchValue}
          placeholder="Paylaşım, yazar veya konum ara..."
          value={searchValue}
        />

        <SegmentedTabs onChange={setActiveTab} options={communityTabs} value={activeTab} />

        <View style={styles.divider} />
      </View>

      {/* ── Feed ── */}
      {communityQuery.isLoading ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={Array.from({ length: 4 }, (_, i) => ({ id: String(i) }))}
          keyExtractor={(item) => item.id}
          renderItem={() => <SkeletonCard />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
        />
      ) : communityQuery.isError ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            actionSlot={
              <AppButton
                label="Yenile"
                onPress={() => void communityQuery.refetch()}
                variant="secondary"
              />
            }
            description="Paylaşımlar yüklenirken bir hata oluştu."
            icon="wifi-off"
            title="Bağlantı Hatası"
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={
            filteredPosts.length === 0 ? styles.listContentEmpty : styles.listContent
          }
          data={filteredPosts}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <EmptyState
                actionSlot={
                  <AppButton
                    label="Filtreleri Temizle"
                    onPress={resetFilters}
                    variant="secondary"
                  />
                }
                description="Bu kategoride henüz paylaşım bulunmuyor."
                icon="hand-heart-outline"
                title="Sonuç Yok"
              />
            </View>
          }
          ListFooterComponent={
            communityQuery.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              onRefresh={() => void communityQuery.refetch()}
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

function SkeletonCard() {
  return (
    <View style={skeletonStyles.card}>
      <View style={skeletonStyles.image} />
      <View style={skeletonStyles.body}>
        <View style={[skeletonStyles.line, { width: "60%" }]} />
        <View style={[skeletonStyles.line, { width: "90%", height: 12 }]} />
        <View style={[skeletonStyles.line, { width: "90%", height: 12 }]} />
        <View style={[skeletonStyles.line, { width: "40%", height: 10, marginTop: 4 }]} />
      </View>
    </View>
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
