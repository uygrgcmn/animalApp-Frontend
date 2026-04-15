import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import { petshopCampaigns } from "../../../shared/mocks/marketplace";
import { getStoreById, petshopPerformanceSummary } from "../../../shared/mocks/petshop";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
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

type DiscoveryFilter = "all" | "discount" | "verified" | "nearby";

const discoveryFilters: {
  icon: React.ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: DiscoveryFilter;
}[] = [
  { icon: "view-grid-outline", label: "Tum kampanyalar", value: "all" },
  { icon: "sale-outline", label: "Indirimli", value: "discount" },
  { icon: "shield-check-outline", label: "Dogrulananlar", value: "verified" },
  { icon: "map-marker-outline", label: "Yakindakiler", value: "nearby" }
];

export function PetshopScreen() {
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<DiscoveryFilter>("all");

  const discoveryRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return petshopCampaigns.filter((campaign) => {
      const store = getStoreById(campaign.storeId);

      if (filter === "discount" && !campaign.discount.includes("20") && !campaign.discount.includes("15")) {
        return false;
      }

      if (filter === "verified" && store?.verifiedState !== "verified") {
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
        campaign.summary.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [filter, searchValue]);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Kurumsal, guven veren ve kampanya odakli petshop deneyimi; kesif ve magaza yonetimini ayni dilde toplar."
        title="Petshop"
      />

      <InfoCard
        description="Normal kullanici kampanyalari kesfeder; petshop hesabi ise dashboard ve kampanya yonetimine gecis alir."
        title="Petshop merkezi"
        variant="accent"
      >
        <View style={styles.metaRow}>
          <MetaPill icon="storefront-outline" label="Kesfet + magaza profili" tone="primary" />
          <MetaPill icon="chart-line" label="Performans ozeti" tone="success" />
          <MetaPill icon="shield-check-outline" label={petshopPerformanceSummary.verificationLabel} tone="warning" />
        </View>
      </InfoCard>

      <InfoCard
        description={petshopPresentation.description}
        title="Petshop hesabi tarafi"
      >
        <View style={styles.managementGrid}>
          <Link href={routes.app.petshopDashboard} asChild>
            <AppButton
              label="Magaza Dashboard'u"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="view-dashboard-outline" size={18} />}
            />
          </Link>
          <Link href={routes.app.petshopCampaignManagement} asChild>
            <AppButton
              label="Kampanyalarim"
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
                label="Yeni Kampanya Olustur"
                leftSlot={<AppIcon backgrounded={false} name="plus" size={18} />}
                variant="ghost"
              />
            </Link>
          )}
        </View>
      </InfoCard>

      <SectionHeader
        description="Normal kullanici tarafi icin kampanyalari ve magazalari sade ama premium bir kart duzeniyle listeliyoruz."
        title="Petshop kesfet listesi"
      />

      <SearchBar
        placeholder="Magaza, kampanya veya sehir ara"
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
        <MetaPill icon="view-agenda-outline" label={`${discoveryRows.length} kampanya`} tone="primary" />
        <MetaPill icon="tune-variant" label={discoveryFilters.find((item) => item.value === filter)?.label ?? "Tum kampanyalar"} tone="neutral" />
      </View>

      {discoveryRows.length > 0 ? (
        <View style={styles.list}>
          {discoveryRows.map((campaign) => {
            const store = getStoreById(campaign.storeId);

            return (
              <PetshopCampaignCard
                key={campaign.id}
                actionSlot={
                  <View style={styles.actionRow}>
                    {store ? (
                      <AppButton
                        label="Magaza"
                        onPress={() => {
                          router.push(routeBuilders.petshopStoreProfile(store.id));
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
                verificationState={store?.verifiedState}
                visualLabel={campaign.visualLabel}
              />
            );
          })}
        </View>
      ) : (
        <EmptyState
          description="Secili filtreler ve arama kelimesiyle eslesen petshop kampanyasi bulunamadi. Filtreyi sifirlayip yeniden kesfe cikabilirsin."
          icon="store-search-outline"
          title="Kampanya bulunamadi"
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
