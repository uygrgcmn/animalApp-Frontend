import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { petshopCampaigns } from "../../../shared/mocks/marketplace";
import {
  getManagedCampaignRows,
  petshopPerformanceSummary,
  petshopStores
} from "../../../shared/mocks/petshop";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { MetricCard } from "../../../shared/ui/MetricCard";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useSessionStore } from "../../auth/store/sessionStore";
import { getPetshopModePresentation } from "../../profile/utils/modeStatus";

export function PetshopDashboardScreen() {
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const heroStore = petshopStores[0];
  const featuredCampaign = petshopCampaigns[0];
  const managedRows = getManagedCampaignRows();

  if (!heroStore || !featuredCampaign) {
    return (
      <ScreenContainer contentContainerStyle={styles.content}>
        <AppHeader
          description="Petshop dashboard verisi su an gosterilemiyor."
          showBackButton
          title="Petshop Dashboard"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Petshop hesabinin kurumsal kontrol merkezi: dogrulama, performans ve kampanyalar bir arada."
        showBackButton
        title="Petshop Dashboard"
      />

      <InfoCard
        description={petshopPresentation.description}
        title={heroStore.storeName}
        variant="accent"
      >
        <View style={styles.metaRow}>
          <MetaPill icon="shield-check-outline" label={petshopPresentation.label} tone="primary" />
          <MetaPill icon="chart-line" label={petshopPerformanceSummary.monthlyViews} tone="success" />
          <MetaPill icon="message-badge-outline" label={`${petshopPerformanceSummary.unreadMessages} okunmamis mesaj`} tone="warning" />
        </View>
      </InfoCard>

      <View style={styles.metricGrid}>
        <View style={styles.metricItem}>
          <MetricCard
            caption="Dogrulama"
            icon="shield-check-outline"
            title="Magaza durumu"
            tone="success"
            value={petshopPerformanceSummary.verificationLabel}
          />
        </View>
        <View style={styles.metricItem}>
          <MetricCard
            caption="Etkilesim"
            icon="chart-timeline-variant"
            title="Donusum"
            tone="primary"
            value={petshopPerformanceSummary.conversion}
          />
        </View>
      </View>

      <InfoCard
        description="Kampanya olusturma ve mevcut listeyi yonetme aksiyonlari tek blokta."
        title="Hizli yonetim"
      >
        <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
          <AppButton
            label="Yeni Kampanya Olustur"
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={18} />}
          />
        </Link>
        <Link href={routes.app.petshopCampaignManagement} asChild>
          <AppButton
            label="Kampanyalarim"
            leftSlot={<AppIcon backgrounded={false} name="tag-multiple-outline" size={18} />}
            variant="secondary"
          />
        </Link>
        <Link href={routes.app.petshopActivation} asChild>
          <AppButton
            label="Dogrulama Bilgilerini Guncelle"
            leftSlot={<AppIcon backgrounded={false} name="file-edit-outline" size={18} />}
            variant="ghost"
          />
        </Link>
      </InfoCard>

      <InfoCard
        description="En guclu kampanyalar ve hizli performans sinyalleri."
        title="Performans ozeti"
      >
        <View style={styles.performanceList}>
          {managedRows.slice(0, 2).map((row) =>
            row.campaign ? (
              <View key={row.campaignId} style={styles.performanceRow}>
                <View style={styles.performanceTexts}>
                  <Text style={styles.performanceTitle}>{row.campaign.title}</Text>
                  <Text style={styles.performanceMeta}>
                    {row.impressions} goruntulenme • {row.savedCount} kaydetme • {row.messageCount} mesaj
                  </Text>
                </View>
                <MetaPill icon="chart-box-outline" label={row.status} tone="neutral" />
              </View>
            ) : null
          )}
        </View>
      </InfoCard>

      <InfoCard
        description="Magaza vitrininde one cikan kampanya karti."
        title="One cikan kampanya"
      >
        <PetshopCampaignCard
          campaignLabel={featuredCampaign.campaignLabel}
          deadline={featuredCampaign.deadline}
          description={featuredCampaign.summary}
          priceLabel={`${featuredCampaign.discount} • ${featuredCampaign.priceLabel}`}
          storeName={featuredCampaign.storeName}
          title={featuredCampaign.title}
          verificationState={heroStore.verifiedState}
          visualLabel={featuredCampaign.visualLabel}
        />
      </InfoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  metricItem: {
    width: "48%"
  },
  performanceList: {
    gap: spacing.compact
  },
  performanceMeta: {
    color: colors.textMuted,
    ...typography.body
  },
  performanceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  performanceTexts: {
    flex: 1,
    gap: spacing.micro
  },
  performanceTitle: {
    color: colors.text,
    ...typography.h3
  }
});
