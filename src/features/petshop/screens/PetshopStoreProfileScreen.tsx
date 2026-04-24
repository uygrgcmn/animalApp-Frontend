import { Link, router, useLocalSearchParams } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";
import { usePetshopStoreProfile } from "../hooks/usePetshopQueries";

export function PetshopStoreProfileScreen() {
  const params = useLocalSearchParams<{ storeId: string }>();
  const storeQuery = usePetshopStoreProfile(params.storeId);
  const store = storeQuery.data?.store;
  const campaigns = storeQuery.data?.campaigns ?? [];
  const refreshing = storeQuery.isFetching && !storeQuery.isLoading;

  if (storeQuery.isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              onRefresh={() => void storeQuery.refetch()}
              refreshing={refreshing}
              tintColor={colors.primary}
            />
          }
        >
          <EmptyState
            actionSlot={
              <AppButton
                label="Tekrar dene"
                onPress={() => void storeQuery.refetch()}
                variant="secondary"
              />
            }
            description="Mağaza profili şu an getirilemedi. Biraz sonra tekrar deneyebilirsin."
            icon="wifi-off"
            title="Mağaza bulunamadı"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() => void storeQuery.refetch()}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {store ? (
          <>
            <InfoCard description={store.tagline} title="Mağaza kimlik kartı" variant="accent">
              <View style={styles.heroRow}>
                <View style={styles.storeIcon}>
                  <AppIcon name="storefront-outline" size={26} color={colors.primary} />
                </View>
                <View style={styles.heroTexts}>
                  <Text style={styles.storeTitle}>{store.storeName}</Text>
                  <Text style={styles.storeSummary}>{store.summary}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <VerificationBadge state={store.verifiedState} />
                <MetaPill icon="map-marker-outline" label={`${store.city} / ${store.district}`} tone="neutral" />
              </View>
              <View style={styles.metaRow}>
                <MetaPill icon="clock-fast" label={store.responseTime} tone="primary" />
                <MetaPill icon="percent-outline" label={store.responseRate} tone="success" />
              </View>
            </InfoCard>

            <InfoCard
              description="Doğrulama belgesi ve güncel bilgi sinyalleri."
              title="Güven ve doğrulama"
            >
              <View style={styles.noteList}>
                {store.trustNotes.map((note) => (
                  <View key={note} style={styles.noteRow}>
                    <View style={styles.noteIcon}>
                      <AppIcon backgrounded={false} name="check-circle-outline" size={16} tone="success" />
                    </View>
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                ))}
              </View>
            </InfoCard>

            {campaigns.length > 0 ? (
              <>
                <SectionHeader
                  eyebrow="Aktif kampanyalar"
                  title={`${campaigns.length} kampanya`}
                  description="Bu mağazanın şu an yayında olan indirim ve fırsatları."
                />
                <View style={styles.list}>
                  {campaigns.map((campaign) => (
                    <PetshopCampaignCard
                      key={campaign.id}
                      actionSlot={
                        <AppButton
                          label="Kampanyayi Incele"
                          onPress={() => {
                            router.push(routeBuilders.petshopCampaignDetail(campaign.id));
                          }}
                          variant="secondary"
                        />
                      }
                      campaignLabel={campaign.campaignLabel}
                      coverImageUri={"coverImageUri" in campaign ? campaign.coverImageUri : undefined}
                      deadline={campaign.deadline}
                      description={campaign.summary}
                      priceLabel={`${campaign.discount} • ${campaign.priceLabel}`}
                      storeName={campaign.storeName}
                      title={campaign.title}
                      verificationState={store.verifiedState}
                      visualLabel={campaign.visualLabel}
                    />
                  ))}
                </View>
              </>
            ) : (
              <EmptyState
                description="Bu mağazanın şu an görünen bir kampanyası bulunmuyor."
                icon="store-search-outline"
                title="Kampanya yok"
              />
            )}
          </>
        ) : (
          <EmptyState
            description="Bu mağaza kimliği için henüz bir petshop profili bulunamadı."
            icon="store-remove-outline"
            title="Mağaza bulunamadı"
          />
        )}
      </ScrollView>

      <StickyBottomActionBar>
        <Link href={routes.app.messages} asChild>
          <AppButton
            label="İletişime Geç"
            leftSlot={<AppIcon backgrounded={false} color={colors.textInverse} name="message-text-outline" size={18} />}
          />
        </Link>
        <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
          <AppButton
            label="Benzer Kampanya"
            leftSlot={<AppIcon backgrounded={false} name="plus" size={18} />}
            variant="secondary"
          />
        </Link>
      </StickyBottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  heroRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact
  },
  heroTexts: {
    flex: 1,
    gap: spacing.tight
  },
  list: {
    gap: spacing.compact
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  noteIcon: {
    marginTop: 2
  },
  noteList: {
    gap: spacing.compact
  },
  noteRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.tight
  },
  noteText: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  storeIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.large,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  storeSummary: {
    color: colors.textMuted,
    ...typography.body
  },
  storeTitle: {
    color: colors.text,
    ...typography.h2
  }
});
