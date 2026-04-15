import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { MetricCard } from "../../../shared/ui/MetricCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";

export function WelcomeScreen() {
  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Bakici, sahip, topluluk ve petshop deneyimini guclu ikonlar ve temiz kartlarla tek merkezde bulustur."
        icon="paw"
        metrics={[
          { icon: "shield-check", label: "Guven odakli", tone: "success" },
          { icon: "view-grid", label: "4 ana alan", tone: "primary" },
          { icon: "lightning-bolt", label: "Hizli akis", tone: "neutral" }
        ]}
        title="Hayvan ekosistemi icin modern mobil deneyim"
      />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <MetricCard
            caption="Bakici, sahip ve isletme rolleri"
            icon="account-switch"
            title="Rol yapisi"
            value="3"
          />
        </View>
        <View style={styles.gridItem}>
          <MetricCard
            caption="Kesif ve yayin ekranlari"
            icon="cards-outline"
            title="Akis sayisi"
            value="4"
          />
        </View>
        <View style={styles.gridItem}>
          <MetricCard
            caption="Topluluk + ticari denge"
            icon="star-four-points-circle"
            title="Deneyim"
            tone="success"
            value="Pro"
          />
        </View>
        <View style={styles.gridItem}>
          <MetricCard
            caption="Tek giris, net yonlendirme"
            icon="gesture-tap-button"
            title="Katilim"
            tone="neutral"
            value="Hizli"
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Link href={routes.auth.signUp} asChild>
          <AppButton label="Kayit Ol" leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="account-plus" size={18} />} />
        </Link>
        <Link href={routes.auth.signIn} asChild>
          <AppButton label="Giris Yap" leftSlot={<AppIcon backgrounded={false} name="login" size={18} />} variant="secondary" />
        </Link>
        <Link href={routes.auth.onboarding} asChild>
          <AppButton
            label="Deneyimi Incele"
            leftSlot={<AppIcon backgrounded={false} name="gesture-tap-button" size={18} />}
            variant="ghost"
          />
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  actions: {
    gap: spacing.compact
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  gridItem: {
    width: "48%"
  }
});

