import { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
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
  toOwnerRequestDisplay,
  type OwnerRequestDisplay
} from "../../listings/utils/adapters";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { OwnerRequestCard } from "../../../shared/ui/OwnerRequestCard";
import { SearchBar } from "../../../shared/ui/SearchBar";

export function OwnerRequestsScreen() {
  const insets = useSafeAreaInsets();
  const [searchValue, setSearchValue] = useState("");

  const query = useInfiniteListings({ type: "HELP_REQUEST" });

  const allRequests = useMemo(
    () => (query.data?.pages.flat() ?? []).map(toOwnerRequestDisplay),
    [query.data]
  );

  const filteredRequests = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return allRequests;
    return allRequests.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.petType.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
    );
  }, [allRequests, searchValue]);

  const refreshing = query.isFetching && !query.isFetchingNextPage && !query.isLoading;

  function handleEndReached() {
    if (query.hasNextPage) void query.fetchNextPage();
  }

  const renderItem = useCallback(({ item }: ListRenderItemInfo<OwnerRequestDisplay>) => (
    <OwnerRequestCard
      budget={item.budget || "Bütçe belirtilmemiş"}
      coverImageUri={item.coverImageUri}
      dateLabel={item.dateLabel}
      description={item.summary}
      distanceLabel={item.distanceLabel}
      location={item.city}
      onPress={() => router.push(routeBuilders.ownerRequestDetail(item.id))}
      petType={item.petType}
      title={item.title}
    />
  ), []);

  return (
    <View style={styles.root}>
      {/* ── Sticky header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerOverline}>BAKICI ARIYORUM</Text>
            <Text style={styles.headerTitle}>Açık Talepler</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>
              {query.isLoading ? "—" : filteredRequests.length}
            </Text>
            <Text style={styles.countLabel}>talep</Text>
          </View>
        </View>

        <SearchBar
          onChangeText={setSearchValue}
          placeholder="İlan, tür veya şehir ara..."
          value={searchValue}
        />

        <View style={styles.pillRow}>
          <MetaPill icon="timer-sand" label="Zaman odaklı" tone="warning" />
          <MetaPill icon="map-marker-radius" label="Lokasyon seçili" tone="primary" />
        </View>

        <View style={styles.divider} />
      </View>

      {/* ── Content ── */}
      {query.isLoading ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          <SkeletonCards count={3} />
        </ScrollView>
      ) : query.isError ? (
        <View style={styles.centerWrap}>
          <EmptyState
            actionSlot={
              <AppButton
                label="Tekrar dene"
                onPress={() => void query.refetch()}
                variant="secondary"
              />
            }
            description="Talepler şu an yüklenemedi. Bağlantıyı yenileyip tekrar deneyebilirsin."
            icon="wifi-off"
            title="Talepler getirilemedi"
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={
            filteredRequests.length === 0 ? styles.listContentEmpty : styles.listContent
          }
          data={filteredRequests}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.centerWrap}>
              <EmptyState
                actionSlot={
                  searchValue ? (
                    <AppButton
                      label="Aramayı Temizle"
                      onPress={() => setSearchValue("")}
                      variant="secondary"
                    />
                  ) : undefined
                }
                description={
                  searchValue
                    ? "Aradığınız kriterlere uygun talep bulunamadı."
                    : "Şu an aktif bakıcı talebi bulunmuyor."
                }
                icon="file-search-outline"
                title="Talep Yok"
              />
            </View>
          }
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              onRefresh={() => void query.refetch()}
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
            <View style={[skeletonStyles.line, { width: "60%" }]} />
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
  centerWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.comfortable
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
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
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
    height: 140
  },
  line: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.small,
    height: 14
  }
});
