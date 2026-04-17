import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  getPetshopActionLabel,
  getPetshopModePresentation
} from "../../profile/utils/modeStatus";
import { usePetshopDiscovery } from "../hooks/usePetshopQueries";

type DiscoveryFilter = "all" | "discount" | "verified" | "nearby";

const discoveryFilters: {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: DiscoveryFilter;
}[] = [
  { icon: "view-grid-outline", label: "Tüm kampanyalar", value: "all" },
  { icon: "sale-outline", label: "İndirimli", value: "discount" },
  { icon: "shield-check-outline", label: "Doğrulananlar", value: "verified" },
  { icon: "map-marker-outline", label: "Yakındakiler", value: "nearby" }
];

export function PetshopScreen() {
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const discoveryQuery = usePetshopDiscovery();
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<DiscoveryFilter>("all");

  const discoveryRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return (discoveryQuery.data ?? []).filter((campaign) => {
      const isDiscounted = /\b(15|20)\b/.test(campaign.discount);

      if (filter === "discount" && !isDiscounted) {
        return false;
      }

      if (filter === "verified" && campaign.verificationState !== "verified") {
        return false;
      }

      if (filter === "nearby" && campaign.city !== "Istanbul") {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        campaign.title.toLowerCase().includes(normalizedSearch) ||
        campaign.storeName.toLowerCase().includes(normalizedSearch) ||
        campaign.city.toLowerCase().includes(normalizedSearch) ||
        campaign.summary.toLowerCase().includes(normalizedSearch) ||
        campaign.campaignLabel.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [discoveryQuery.data, filter, searchValue]);
  const refreshing = discoveryQuery.isFetching && !discoveryQuery.isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void discoveryQuery.refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      <InfoCard
        description={petshopPresentation.description}
        title="Mağaza yönetimi"
        variant="accent"
      >
        <View style={styles.metaRow}>
          <MetaPill icon="shield-check-outline" label={petshopPresentation.label} tone="primary" />
          <MetaPill
            icon="storefront-outline"
            label={discoveryQuery.isLoading ? "Yüklüyor..." : `${discoveryQuery.data?.length ?? 0} mağaza`}
            tone="neutral"
          />
        </View>
        <View style={styles.managementGrid}>
          <Link href={routes.app.petshopDashboard} asChild>
            <AppButton
              label="Mağaza Dashboard"
              leftSlot={<AppIcon backgrounded={false} color={colors.textInverse} name="view-dashboard-outline" size={18} />}
            />
          </Link>
          <Link href={routes.app.petshopCampaignManagement} asChild>
            <AppButton
              label="Kampanya Yönetimi"
              leftSlot={<AppIcon backgrounded={false} name="tag-multiple-outline" size={18} />}
              variant="secondary"
            />
          </Link>
          {petshopStatus !== "active" ? (
            <Link href={routes.app.petshopActivation} asChild>
              <AppButton
                label={getPetshopActionLabel(petshopStatus)}
                leftSlot={<AppIcon backgrounded={false} name="store-edit-outline" size={18} />}
                variant="ghost"
              />
            </Link>
          ) : (
            <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
              <AppButton
                label="Yeni Kampanya Oluştur"
                leftSlot={<AppIcon backgrounded={false} name="plus" size={18} />}
                variant="ghost"
              />
            </Link>
          )}
        </View>
      </InfoCard>

      <SectionHeader
        eyebrow="Keşfet"
        title="Petshop kampanyaları"
        description="İndirimli ürünler, doğrulanan mağazalar ve yakındaki fırsatlar."
      />

      <SearchBar
        placeholder="Mağaza, kampanya veya şehir ara"
        showFilterButton
        value={searchValue}
        onChangeText={setSearchValue}
      />

      <View style={styles.filterRow}>
        {discoveryFilters.map((item) => (
          <FilterChip
            key={item.value}
            icon={item.icon}
            label={item.label}
            onPress={() => {
              setFilter(item.value);
            }}
            selected={filter === item.value}
          />
        ))}
      </View>

      <View style={styles.metaRow}>
        <MetaPill icon="storefront-outline" label={`${discoveryRows.length} sonuç`} tone="primary" />
        <MetaPill
          icon="tune-variant"
          label={discoveryFilters.find((item) => item.value === filter)?.label ?? "Tum kampanyalar"}
          tone="neutral"
        />
        {searchValue.trim() ? (
          <MetaPill icon="magnify" label={`"${searchValue.trim()}"`} tone="neutral" />
        ) : null}
      </View>

      {discoveryQuery.isError ? (
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void discoveryQuery.refetch()}
              variant="secondary"
            />
          }
          description="Petshop kampanyaları şu an yüklenemedi. Bağlantıyı yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="Kampanyalar getirilemedi"
        />
      ) : discoveryRows.length > 0 ? (
        <View style={styles.list}>
          {discoveryRows.map((campaign) => (
            <PetshopCampaignCard
              key={campaign.id}
              actionSlot={
                <View style={styles.actionRow}>
                  {campaign.storeId ? (
                    <AppButton
                      label="Magaza"
                      onPress={() => {
                        router.push(routeBuilders.petshopStoreProfile(campaign.storeId));
                      }}
                      variant="secondary"
                    />
                  ) : null}
                  <AppButton
                    label="Incele"
                    onPress={() => {
                      router.push(routeBuilders.petshopCampaignDetail(campaign.id));
                    }}
                  />
                </View>
              }
              campaignLabel={campaign.campaignLabel}
              deadline={campaign.deadline}
              description={campaign.summary}
              priceLabel={`${campaign.discount} • ${campaign.priceLabel}`}
              storeName={campaign.storeName}
              title={campaign.title}
              verificationState={campaign.verificationState}
              visualLabel={campaign.visualLabel}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          description="Seçili filtreler ve arama kelimesiyle eşleşen petshop kampanyası bulunamadı. Filtreyi sıfırlayıp yeniden keşfe çıkabilirsin."
          icon="store-search-outline"
          title="Kampanya bulunamadı"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: spacing.compact
  },
  content: {
    gap: spacing.section
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  list: {
    gap: spacing.compact
  },
  managementGrid: {
    gap: spacing.compact
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
