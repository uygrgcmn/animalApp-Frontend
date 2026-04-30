import { Link, router } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import { routeBuilders } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MarketplaceCard } from "../../../shared/ui/MarketplaceCard";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { useSessionStore } from "../../auth/store/sessionStore";
import { useListings } from "../../listings/hooks/useListings";
import { toCaregiverDisplay } from "../../listings/utils/adapters";
import {
  getCaregiverActionLabel,
  getCaregiverModePresentation
} from "../../profile/utils/modeStatus";

export function CaregiverMarketplaceScreen() {
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);
  const listingsQuery = useListings({ type: "SITTING" });
  const listings = (listingsQuery.data ?? [])
    .map(toCaregiverDisplay);
  const refreshing = listingsQuery.isFetching && !listingsQuery.isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void listingsQuery.refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      <VisualHero
        description="Bakıcı profilleri burada güven, rutin ve lokasyon odaklı kartlarla öne çıkar."
        icon="dog-side"
        metrics={[
          { icon: "map-marker-radius", label: "Şehir bazlı", tone: "primary" },
          { icon: "calendar-clock", label: "Planlı bakım", tone: "neutral" }
        ]}
        title="Bakıcı marketplace"
      />

      <InfoCard
        variant="accent"
        title="Profil durumu"
        description={
          caregiverPresentation.description
        }
        rightSlot={
          <View style={styles.statusBadges}>
            <ModeBadge
              label={caregiverPresentation.label}
              tone={
                caregiverPresentation.tone === "success"
                  ? "success"
                  : caregiverPresentation.tone === "warning"
                    ? "warning"
                    : "muted"
              }
            />
            <ModeBadge
              label={
                listingsQuery.isLoading ? "İlanlar yükleniyor" : `${listings.length} aktif ilan`
              }
              tone="primary"
            />
          </View>
        }
      >
        {caregiverStatus !== "active" ? (
          <Link href="/(app)/caregiver-activation" asChild>
            <AppButton
              label={`Bakıcı Modunu ${getCaregiverActionLabel(caregiverStatus)}`}
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="shield-plus" size={18} />}
            />
          </Link>
        ) : null}
      </InfoCard>

      {listingsQuery.isError ? (
        <EmptyState
          actionSlot={<AppButton label="Tekrar dene" onPress={() => void listingsQuery.refetch()} variant="secondary" />}
          description="Bakıcı ilanları şu an yüklenemedi. Bağlantıyı yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="İlanlar getirilemedi"
        />
      ) : listings.length > 0 ? (
        <View style={styles.list}>
          {listings.map((listing) => (
            <MarketplaceCard
              key={listing.id}
              chips={[
                {
                  icon: "map-marker-outline",
                  label: listing.city || "Konum bekleniyor",
                  tone: "neutral"
                },
                {
                  icon: "calendar-range",
                  label: listing.schedule || "Rutin bilgisi bekleniyor",
                  tone: "primary"
                },
                listing.budget
                  ? { icon: "cash-multiple", label: listing.budget, tone: "success" as const }
                  : {
                      icon: listing.verificationState === "verified"
                        ? "shield-check-outline"
                        : "clock-outline",
                      label:
                        listing.verificationState === "verified"
                          ? "Doğrulanmış bakıcı"
                          : "Profil incelemede",
                      tone: listing.verificationState === "verified" ? "success" as const : "warning" as const
                    }
              ]}
              coverImageUri={listing.coverImageUri}
              icon="paw-outline"
              onPress={() => router.push(routeBuilders.caregiverListingDetail(listing.id))}
              summary={`${listing.caretakerName} • ${listing.summary}`}
              title={listing.title}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          actionSlot={
            caregiverStatus !== "active" ? (
              <Link href="/(app)/caregiver-activation" asChild>
                <AppButton label="Bakıcı modunu tamamla" variant="secondary" />
              </Link>
            ) : undefined
          }
          description="Şu an yayında bakıcı ilanı yok. Biraz sonra tekrar kontrol edebilirsin."
          icon="compass-outline"
          title="Aktif ilan bulunamadı"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl
  },
  list: {
    gap: spacing.compact
  },
  statusBadges: {
    alignItems: "flex-end",
    gap: spacing.tight
  }
});

