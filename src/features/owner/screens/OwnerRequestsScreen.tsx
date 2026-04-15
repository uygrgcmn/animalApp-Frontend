import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { ownerRequests } from "../../../shared/mocks/marketplace";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MarketplaceCard } from "../../../shared/ui/MarketplaceCard";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";

export function OwnerRequestsScreen() {
  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Sahip talepleri; pet tipi, zamanlama ve sehir bilgisini ilk bakista gosteren kartlarla sunulur."
        icon="home-heart"
        metrics={[
          { icon: "timer-sand", label: "Zaman odakli", tone: "warning" },
          { icon: "map-marker-radius", label: "Lokasyon secili", tone: "primary" }
        ]}
        title="Bakici ariyorum"
      />

      <InfoCard
        variant="accent"
        title="Talep merkezi"
        description="Liste sade tutulur; kullanici ilk bakista sehir, tur ve zamanlama bilgisini kolayca kavrar."
      >
        <ModeBadge label={`${ownerRequests.length} acik talep`} tone="primary" />
      </InfoCard>

      <View style={styles.list}>
        {ownerRequests.map((request) => (
          <MarketplaceCard
            key={request.id}
            chips={[
              { icon: "map-marker-outline", label: request.city, tone: "neutral" },
              { icon: "paw-outline", label: request.petType, tone: "success" },
              { icon: "calendar-range", label: request.schedule, tone: "warning" }
            ]}
            icon="clipboard-text-clock-outline"
            summary={request.summary}
            title={request.title}
            tone="success"
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

