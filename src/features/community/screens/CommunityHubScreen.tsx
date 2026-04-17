import { router } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { useCommunityListings } from "../hooks/useCommunityListings";
import { toCommunityDisplay } from "../../listings/utils/adapters";
import { AppButton } from "../../../shared/ui/AppButton";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";

type CommunityTab = "all" | "ucretsiz-mama" | "sahiplendirme" | "diger";

const communityTabs: { label: string; value: CommunityTab }[] = [
  { label: "Tümü", value: "all" },
  { label: "Ücretsiz Mama", value: "ucretsiz-mama" },
  { label: "Sahiplendirme", value: "sahiplendirme" },
  { label: "Diğer", value: "diger" }
];

export function CommunityHubScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<CommunityTab>("all");
  const [searchValue, setSearchValue] = useState("");

  const { data: rawPosts = [], isLoading, isError, isFetching, refetch } = useCommunityListings();
  const allPosts = useMemo(() => rawPosts.map(toCommunityDisplay), [rawPosts]);

  const filteredPosts = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return allPosts.filter((post) => {
      if (activeTab !== "all" && post.categoryKey !== activeTab) return false;
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

  const refreshing = isFetching && !isLoading;

  function resetFilters() {
    setActiveTab("all");
    setSearchValue("");
  }

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
            <Text style={styles.countNumber}>{isLoading ? "—" : filteredPosts.length}</Text>
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

      {/* ── Scrollable feed ── */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            onRefresh={() => void refetch()}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <SkeletonCards count={4} />
        ) : isError ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              actionSlot={
                <AppButton label="Yenile" onPress={() => void refetch()} variant="secondary" />
              }
              description="Paylaşımlar yüklenirken bir hata oluştu."
              icon="wifi-off"
              title="Bağlantı Hatası"
            />
          </View>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <CommunityCard
              key={post.id}
              actionSlot={
                <View style={styles.actionRow}>
                  <AppButton
                    label="Mesaj"
                    onPress={() => router.push(routes.app.messages)}
                    size="sm"
                    variant="secondary"
                  />
                  <AppButton
                    label={post.quickActionLabel}
                    onPress={() => router.push(routeBuilders.communityPostDetail(post.id))}
                    size="sm"
                  />
                </View>
              }
              author={post.author}
              category={post.category}
              dateLabel={post.dateLabel}
              description={post.summary}
              imageUri={post.imageUri}
              location={`${post.city}${post.district ? ` / ${post.district}` : ""}`}
              onPress={() => router.push(routeBuilders.communityPostDetail(post.id))}
              title={post.title}
              verificationState={post.trustState}
              visualLabel={post.visualLabel}
            />
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <EmptyState
              actionSlot={
                <AppButton label="Filtreleri Temizle" onPress={resetFilters} variant="secondary" />
              }
              description="Bu kategoride henüz paylaşım bulunmuyor."
              icon="hand-heart-outline"
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
            <View style={[skeletonStyles.line, { width: "60%" }]} />
            <View style={[skeletonStyles.line, { width: "90%", height: 12 }]} />
            <View style={[skeletonStyles.line, { width: "90%", height: 12 }]} />
            <View style={[skeletonStyles.line, { width: "40%", height: 10, marginTop: 4 }]} />
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
