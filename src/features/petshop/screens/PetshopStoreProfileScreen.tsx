import { Link, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";
import { getCampaignsByStore, getStoreById } from "../../../shared/mocks/petshop";

export function PetshopStoreProfileScreen() {
  const params = useLocalSearchParams<{ storeId: string }>();
  const store = getStoreById(params.storeId);
  const campaigns = store ? getCampaignsByStore(store.id) : [];

  if (!store) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <AppHeader description="Magaza bulunamadi." showBackButton title="Magaza Profili" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          description="Magaza profili, kampanya dilini ve guven sinyallerini kurumsal ama sicak olmayan bir netlikte sunar."
          showBackButton
          title={store.storeName}
        />

        <InfoCard description={store.tagline} title="Magaza ozeti" variant="accent">
          <View style={styles.heroRow}>
            <View style={styles.storeIcon}>
              <AppIcon name="storefront-outline" size={24} />
            </View>
            <View style={styles.heroTexts}>
              <Text style={styles.storeTitle}>{store.storeName}</Text>
              <Text style={styles.storeSummary}>{store.summary}</Text>
            </View>
            <VerificationBadge state={store.verifiedState} />
          </View>
          <View style={styles.metaRow}>
            <MetaPill icon="map-marker-outline" label={`${store.city} / ${store.district}`} tone="neutral" />
            <MetaPill icon="message-text-fast-outline" label={store.responseTime} tone="primary" />
            <MetaPill icon="percent-outline" label={store.responseRate} tone="success" />
          </View>
        </InfoCard>

        <InfoCard
          description="Magazanin guven veren taraflarini sade maddelerle gosteriyoruz."
          title="Dogrulama durumu"
        >
          <View style={styles.noteList}>
            {store.trustNotes.map((note) => (
              <View key={note} style={styles.noteRow}>
                <AppIcon backgrounded={false} name="check-circle-outline" size={16} tone="success" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        <InfoCard
          description="Magaza profili ile kampanyalar ayni kurumsal hizada listelenir."
          title="Aktif kampanyalar"
        >
          {campaigns.length > 0 ? (
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
          ) : (
            <EmptyState
              description="Bu magazanin su an gorunen bir kampanyasi bulunmuyor."
              icon="store-search-outline"
              title="Kampanya yok"
            />
          )}
        </InfoCard>
      </ScrollView>

      <StickyBottomActionBar>
        <Link href={routes.app.messages} asChild>
          <AppButton
            label="Iletisime Gec"
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="message-text-outline" size={18} />}
          />
        </Link>
        <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
          <AppButton
            label="Benzer Kampanya Olustur"
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
    borderRadius: radius.large,
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
