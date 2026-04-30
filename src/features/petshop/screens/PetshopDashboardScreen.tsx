import { Link } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { MetricCard } from "../../../shared/ui/MetricCard";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { useSessionStore } from "../../auth/store/sessionStore";
import { getPetshopModePresentation } from "../../profile/utils/modeStatus";
import { usePetshopDashboard } from "../hooks/usePetshopQueries";

function campaignStatusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "aktif") return "success";
  if (status === "taslak") return "warning";
  return "neutral";
}

export function PetshopDashboardScreen() {
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const dashboardQuery = usePetshopDashboard();
  const dashboard = dashboardQuery.data;
  const heroStore = dashboard?.heroStore;
  const featuredCampaign = dashboard?.featuredCampaign;
  const managedRows = dashboard?.managedRows ?? [];
  const summary = dashboard?.summary;
  const refreshing = dashboardQuery.isFetching && !dashboardQuery.isLoading;

  if (dashboardQuery.isError) {
    return (
      <ScreenContainer
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={() => void dashboardQuery.refetch()}
            refreshing={refreshing}
            tintColor={colors.primary}
          />
        }
      >
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void dashboardQuery.refetch()}
              variant="secondary"
            />
          }
          description="Performans özeti şu an yüklenemedi. Bağlantıyı yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="Dashboard getirilemedi"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void dashboardQuery.refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      {heroStore && summary ? (
        <>
          <InfoCard
            description={petshopPresentation.description}
            title={heroStore.storeName}
            variant="accent"
          >
            <View style={styles.metaRow}>
              <MetaPill icon="shield-check-outline" label={petshopPresentation.label} tone="primary" />
              <MetaPill
                icon="tag-multiple-outline"
                label={`${summary.activeCampaignCount} aktif kampanya`}
                tone="success"
              />
              {summary.unreadMessageCount > 0 ? (
                <MetaPill
                  icon="message-badge-outline"
                  label={`${summary.unreadMessageCount} yeni mesaj`}
                  tone="warning"
                />
              ) : null}
            </View>
          </InfoCard>

            <SectionHeader
              eyebrow="Performans özeti"
              title="Mağaza özeti"
              description="Gerçek kampanya ve mesaj verilerinden üretilen özet."
            />

            <View style={styles.metricGrid}>
              <View style={styles.metricItem}>
                <MetricCard
                  caption="Şu an yayında"
                  icon="tag-multiple-outline"
                  title="Aktif kampanya"
                  tone="primary"
                  value={String(summary.activeCampaignCount)}
                />
              </View>
              <View style={styles.metricItem}>
                <MetricCard
                  caption="Toplam kampanya sayısı"
                  icon="playlist-check"
                  title="Kampanyalar"
                  tone="success"
                  value={String(summary.campaignCount)}
                />
              </View>
              <View style={styles.metricItem}>
                <MetricCard
                  caption="Katılımcı toplamı"
                  icon="account-group-outline"
                  title="Katılım"
                  tone="primary"
                  value={String(summary.totalParticipantCount)}
                />
              </View>
              <View style={styles.metricItem}>
                <MetricCard
                  caption="Okunmamış mesajlar"
                  icon="message-text-outline"
                  title="Yeni mesajlar"
                  tone={summary.unreadMessageCount > 0 ? "warning" : "neutral"}
                  value={String(summary.unreadMessageCount)}
                />
              </View>
            </View>

          <InfoCard
            description="Yeni kampanya aç, mevcut listeni yönet veya doğrulama bilgilerini güncelle."
            title="Hızlı işlemler"
          >
            <Link href={routeBuilders.createWithType("petshop-campaign")} asChild>
              <AppButton
                label="Yeni Kampanya Oluştur"
                leftSlot={<AppIcon backgrounded={false} color={colors.textInverse} name="plus" size={18} />}
              />
            </Link>
            <Link href={routes.app.petshopCampaignManagement} asChild>
              <AppButton
                label="Kampanya Yönetimine Git"
                leftSlot={<AppIcon backgrounded={false} name="tag-multiple-outline" size={18} />}
                variant="secondary"
              />
            </Link>
            <Link href={routes.app.petshopActivation} asChild>
              <AppButton
                label="Doğrulama Bilgilerini Güncelle"
                leftSlot={<AppIcon backgrounded={false} name="file-edit-outline" size={18} />}
                variant="ghost"
              />
            </Link>
          </InfoCard>

          {managedRows.length > 0 ? (
            <>
              <SectionHeader
                eyebrow="Kampanya yönetimi"
                title="Aktif kampanyalar"
                description="En güçlü kampanyaların performans sinyalleri."
              />
              <View style={styles.performanceList}>
                {managedRows.slice(0, 3).map((row) => (
                  <ManagementItemCard
                    key={row.campaignId}
                    description={row.campaign.summary}
                    title={row.campaign.title}
                    rightSlot={<StatusPill label={row.status} tone={campaignStatusTone(row.status)} />}
                    pills={
                      <>
                        <MetaPill icon="tag-outline" label={row.campaign.campaignLabel} tone="primary" />
                        <MetaPill
                          icon="account-group-outline"
                          label={`${row.participantCount}/${row.targetParticipantCount} katılım`}
                          tone="success"
                        />
                        <MetaPill icon="calendar-clock-outline" label={row.campaign.deadline} tone="warning" />
                      </>
                    }
                  />
                ))}
              </View>
            </>
          ) : null}

          {featuredCampaign ? (
            <>
              <SectionHeader
                eyebrow="Vitrin"
                title="Öne çıkan kampanya"
                description="Mağaza vitrininizde öne çıkan kampanya kartı."
              />
              <PetshopCampaignCard
                campaignLabel={featuredCampaign.campaignLabel}
                coverImageUri={featuredCampaign.coverImageUri}
                deadline={featuredCampaign.deadline}
                description={featuredCampaign.summary}
                priceLabel={`${featuredCampaign.discount} • ${featuredCampaign.priceLabel}`}
                storeName={featuredCampaign.storeName}
                title={featuredCampaign.title}
                verificationState={heroStore.verifiedState}
                visualLabel={featuredCampaign.visualLabel}
              />
            </>
          ) : null}
        </>
      ) : (
        <EmptyState
          description="Dashboard verileri hazırlanıyor. Petshop profili aktif olduğunda performans kartları burada listelenecek."
          icon="view-dashboard-outline"
          title="Dashboard henüz hazır değil"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl
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
  }
});
