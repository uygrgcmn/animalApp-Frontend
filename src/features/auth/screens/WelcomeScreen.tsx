import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";

export function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[colors.primary, "#A78BFA", "#8B5CF6"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.iconShell}
          >
            <MaterialCommunityIcons name="paw" size={52} color={colors.textInverse} />
          </LinearGradient>

          <View style={styles.heroTexts}>
            <Text style={styles.heroTitle}>
              Hayvanlar için{"\n"}modern platform
            </Text>
            <Text style={styles.heroSubtitle}>
              Bakıcı bul, bakıcı ol, topluluğa katıl ve petshop keşfet.
              Tüm deneyim tek hesapta.
            </Text>
          </View>

          <View style={styles.chips}>
            <Chip icon="shield-check" label="Güven odaklı" color={colors.success} />
            <Chip icon="account-switch" label="3 farklı rol" color={colors.primary} />
            <Chip icon="flash" label="Hızlı kurulum" color={colors.accent} />
          </View>
        </View>

        {/* CTA */}
        <View style={styles.actions}>
          <Link href={routes.auth.signUp} asChild>
            <AppButton
              label="Ücretsiz Başla"
              size="lg"
              leftSlot={
                <MaterialCommunityIcons name="account-plus-outline" size={20} color={colors.textInverse} />
              }
            />
          </Link>
          <Link href={routes.auth.signIn} asChild>
            <AppButton
              label="Zaten hesabım var"
              variant="secondary"
              size="lg"
            />
          </Link>
          <Link href={routes.auth.onboarding} asChild>
            <AppButton
              label="Nasıl çalışır?"
              variant="ghost"
            />
          </Link>
        </View>

        <Text style={styles.legal}>
          Kayıt olarak{" "}
          <Text style={styles.legalLink}>Kullanım Koşulları</Text>
          {" "}ve{" "}
          <Text style={styles.legalLink}>Gizlilik Politikası</Text>
          {"'nı"} kabul etmiş olursunuz.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Chip({ color, icon, label }: { color: string; icon: string; label: string }) {
  return (
    <View style={[styles.chip, { borderColor: color + "30", backgroundColor: color + "12" }]}>
      <MaterialCommunityIcons name={icon as any} size={14} color={color} />
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: "flex-end",
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg
  },
  hero: {
    alignItems: "flex-start",
    flex: 1,
    gap: spacing.lg,
    justifyContent: "center"
  },
  iconShell: {
    alignItems: "center",
    borderRadius: radius.xl,
    height: 104,
    justifyContent: "center",
    width: 104,
    ...shadows.card
  },
  heroTexts: {
    gap: spacing.sm
  },
  heroTitle: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1.0,
    lineHeight: 48
  },
  heroSubtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 26,
    maxWidth: "88%"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  actions: {
    gap: spacing.sm
  },
  legal: {
    color: colors.textSubtle,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center"
  },
  legalLink: {
    color: colors.primary,
    fontWeight: "600"
  }
});
