import { Link, router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { routeBuilders } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import { getManagedCampaignRows } from "../../../shared/mocks/petshop";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";

export function PetshopCampaignManagementScreen() {
  const managedRows = getManagedCampaignRows();

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Kampanya listesi, durumlar ve yeni kampanya olusturma aksiyonu tek yonetim ekraninda."
        showBackButton
        title="Kampanya Yonetimi"
      />

      <InfoCard
        description="Yeni kampanya, taslak ve pasif kampanyalar tek duzende izlenir."
        title="Kampanyalarim"
        variant="accent"
      >
        <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
          <AppButton
            label="Yeni Kampanya Olustur"
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={18} />}
          />
        </Link>
      </InfoCard>

      <View style={styles.list}>
        {managedRows.map((row) =>
          row.campaign ? (
            <InfoCard
              key={row.campaignId}
              description={row.campaign.summary}
              title={row.campaign.title}
              rightSlot={<MetaPill icon="chart-box-outline" label={row.status} tone="neutral" />}
            >
              <View style={styles.metaRow}>
                <MetaPill icon="eye-outline" label={row.impressions} tone="primary" />
                <MetaPill icon="bookmark-outline" label={`${row.savedCount} kaydetme`} tone="success" />
                <MetaPill icon="message-text-outline" label={`${row.messageCount} mesaj`} tone="warning" />
              </View>
              <View style={styles.actionRow}>
                <AppButton
                  label="Kampanya Detayi"
                  onPress={() => {
                    router.push(routeBuilders.petshopCampaignDetail(row.campaignId));
                  }}
                  variant="secondary"
                />
                <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
                  <AppButton label="Kopyala / Yeni Ac" variant="ghost" />
                </Link>
              </View>
            </InfoCard>
          ) : null
        )}
      </View>
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
  list: {
    gap: spacing.compact
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
