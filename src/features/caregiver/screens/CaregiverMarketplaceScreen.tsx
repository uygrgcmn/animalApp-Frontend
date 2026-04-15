import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { caregiverListings } from "../../../shared/mocks/marketplace";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MarketplaceCard } from "../../../shared/ui/MarketplaceCard";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  getCaregiverActionLabel,
  getCaregiverModePresentation
} from "../../profile/utils/modeStatus";

export function CaregiverMarketplaceScreen() {
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Bakici profilleri burada guven, rutin ve lokasyon odakli kartlarla one cikar."
        icon="dog-side"
        metrics={[
          { icon: "map-marker-radius", label: "Sehir bazli", tone: "primary" },
          { icon: "calendar-clock", label: "Planli bakim", tone: "neutral" }
        ]}
        title="Bakici marketplace"
      />

      <InfoCard
        variant="accent"
        title="Profil durumu"
        description={
          caregiverPresentation.description
        }
        rightSlot={
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
        }
      >
        {caregiverStatus !== "active" ? (
          <Link href="/(app)/caregiver-activation" asChild>
            <AppButton
              label={`Bakici Modunu ${getCaregiverActionLabel(caregiverStatus)}`}
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="shield-plus" size={18} />}
            />
          </Link>
        ) : null}
      </InfoCard>

      <View style={styles.list}>
        {caregiverListings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            chips={[
              { icon: "map-marker-outline", label: listing.city, tone: "neutral" },
              { icon: "calendar-range", label: listing.schedule, tone: "primary" },
              { icon: "cash-multiple", label: listing.budget, tone: "success" }
            ]}
            icon="paw-outline"
            summary={listing.summary}
            title={listing.title}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  }
});

