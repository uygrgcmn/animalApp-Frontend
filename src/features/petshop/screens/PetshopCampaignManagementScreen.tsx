import { Link, router } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import { routeBuilders } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { usePetshopCampaignManagement } from "../hooks/usePetshopQueries";

function campaignStatusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "aktif") return "success";
  if (status === "taslak") return "warning";
  return "neutral";
}

export function PetshopCampaignManagementScreen() {
  const campaignsQuery = usePetshopCampaignManagement();
  const managedRows = campaignsQuery.data ?? [];
  const activeCount = managedRows.filter((r) => r.status === "aktif").length;
  const passiveCount = managedRows.filter((r) => r.status === "pasif").length;
  const refreshing = campaignsQuery.isFetching && !campaignsQuery.isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void campaignsQuery.refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.actionHeader}>
        <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
          <AppButton
            label="Yeni Kampanya Oluştur"
            leftSlot={<AppIcon backgrounded={false} color={colors.textInverse} name="plus" size={18} />}
          />
        </Link>
      </View>

      {managedRows.length > 0 ? (
        <>
          <SectionHeader
            eyebrow="Kampanyalarım"
            title={`${managedRows.length} kampanya`}
            description="Gerçek petshop kampanyaların bu panelde listelenir."
          />

          <View style={styles.summaryRow}>
            <MetaPill icon="check-circle-outline" label={`${activeCount} aktif`} tone="success" />
            <MetaPill
              icon="pause-circle-outline"
              label={`${passiveCount} pasif`}
              tone="neutral"
            />
          </View>

          <View style={styles.list}>
            {managedRows.map((row) => (
              <ManagementItemCard
                key={row.campaignId}
                description={row.campaign.summary}
                title={row.campaign.title}
                rightSlot={<StatusPill label={row.status} tone={campaignStatusTone(row.status)} />}
                pills={
                  <>
                    <MetaPill
                      icon="account-group-outline"
                      label={`${row.participantCount}/${row.targetParticipantCount} katılım`}
                      tone="success"
                    />
                    <MetaPill icon="calendar-clock-outline" label={row.campaign.deadline} tone="warning" />
                  </>
                }
                actions={
                  <>
                    <AppButton
                      label="Detay"
                      onPress={() => {
                        router.push(routeBuilders.petshopCampaignDetail(row.campaignId));
                      }}
                      variant="secondary"
                    />
                    <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
                      <AppButton label="Kopyala / Yeni Aç" variant="ghost" />
                    </Link>
                  </>
                }
              />
            ))}
          </View>
        </>
      ) : campaignsQuery.isError ? (
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void campaignsQuery.refetch()}
              variant="secondary"
            />
          }
          description="Kampanya listesi şu an yüklenemedi. Bağlantıyı yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="Kampanyalar getirilemedi"
        />
      ) : (
        <EmptyState
          description="Henüz yönetilecek petshop kampanyası yok. İlk kampanyayı oluşturduğunda burada listelenecek."
          icon="tag-multiple-outline"
          title="Kampanya bulunamadı"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionHeader: {
    gap: spacing.compact
  },
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
