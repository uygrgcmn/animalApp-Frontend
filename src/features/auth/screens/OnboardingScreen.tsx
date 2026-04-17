import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { resolveAuthenticatedRoute, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useSessionStore } from "../store/sessionStore";

const onboardingSlides = [
  {
    icon: "view-dashboard-outline" as const,
    accent: colors.primary,
    title: "Düzenli bir başlangıç",
    description:
      "Ana sayfa, modlar ve başvurular aynı hesapta düzenli bir merkez gibi çalışır.",
    features: [
      { icon: "view-dashboard-outline", label: "Kişisel dashboard" },
      { icon: "account-switch-outline", label: "Açılabilir modlar" },
      { icon: "gesture-tap-button", label: "Net navigasyon" }
    ]
  },
  {
    icon: "compass-outline" as const,
    accent: "#7C3AED",
    title: "Keşfetmek daha net",
    description:
      "Bakıcı ilanları, bakıcı arayanlar ve petshop kampanyaları aynı keşif yapısında ayrışır.",
    features: [
      { icon: "compass-outline", label: "3 ana keşif akışı" },
      { icon: "map-marker-outline", label: "Konum odaklı" },
      { icon: "shield-check-outline", label: "Güven göstergeleri" }
    ]
  },
  {
    icon: "hand-heart-outline" as const,
    accent: "#F97316",
    title: "Güven veren akış",
    description:
      "Topluluk, mesajlar ve mod başvuruları seni durdurmadan yönlendiren bir deneyimle ilerler.",
    features: [
      { icon: "hand-heart-outline", label: "Topluluk alanı" },
      { icon: "message-text-outline", label: "Mesaj özeti" },
      { icon: "progress-check", label: "Yönlendiren akış" }
    ]
  }
] as const;

export function OnboardingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const completeOnboarding = useSessionStore((state) => state.completeOnboarding);
  const hasCompletedProfileSetup = useSessionStore((state) => state.hasCompletedProfileSetup);

  const slide = onboardingSlides[activeStep] ?? onboardingSlides[0];
  const isLastStep = activeStep === onboardingSlides.length - 1;

  const ctaLabel = useMemo(() => {
    if (isLastStep) return isAuthenticated ? "Devam Et" : "Kayıt Ol";
    return "İleri";
  }, [isLastStep, isAuthenticated]);

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((c) => c + 1);
      return;
    }
    completeOnboarding();
    if (!isAuthenticated) {
      router.replace(routes.auth.signUp);
      return;
    }
    router.replace(
      resolveAuthenticatedRoute({ hasCompletedOnboarding: true, hasCompletedProfileSetup })
    );
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content} scrollable={false}>
      {/* Slide hero */}
      <View style={styles.slideHero}>
        <LinearGradient
          colors={[slide.accent + "20", slide.accent + "05"]}
          style={styles.slideIconBg}
        >
          <View style={[styles.slideIconShell, { backgroundColor: slide.accent + "18" }]}>
            <MaterialCommunityIcons name={slide.icon} size={40} color={slide.accent} />
          </View>
        </LinearGradient>

        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>

        <View style={styles.featureList}>
          {slide.features.map((feature) => (
            <View key={feature.label} style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: slide.accent + "20" }]}>
                <MaterialCommunityIcons name={feature.icon} size={16} color={slide.accent} />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Progress + actions */}
      <View style={styles.footer}>
        <View style={styles.progress}>
          {onboardingSlides.map((item, index) => (
            <Pressable key={item.title} onPress={() => setActiveStep(index)} style={styles.progressBarWrap}>
              <View
                style={[
                  styles.progressBar,
                  index === activeStep ? [styles.progressBarActive, { backgroundColor: slide.accent }] : null
                ]}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          {activeStep > 0 ? (
            <Pressable
              onPress={() => setActiveStep((c) => c - 1)}
              style={styles.backBtn}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
          <View style={styles.nextBtnWrap}>
            <AppButton label={ctaLabel} onPress={handleNext} />
          </View>
        </View>

        <Pressable onPress={() => {
          completeOnboarding();
          if (!isAuthenticated) router.replace(routes.auth.welcome);
        }}>
          <Text style={styles.skipLabel}>Atla</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.section,
    justifyContent: "space-between",
    paddingBottom: spacing.comfortable
  },
  slideHero: {
    flex: 1,
    gap: spacing.comfortable,
    justifyContent: "center"
  },
  slideIconBg: {
    alignSelf: "flex-start",
    borderRadius: radius.xlarge,
    padding: spacing.comfortable
  },
  slideIconShell: {
    alignItems: "center",
    borderRadius: radius.large,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  slideTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 40
  },
  slideDescription: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 26,
    maxWidth: "90%"
  },
  featureList: {
    gap: spacing.compact
  },
  featureItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  featureDot: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  featureLabel: {
    color: colors.text,
    ...typography.bodyStrong
  },
  footer: {
    gap: spacing.standard
  },
  progress: {
    flexDirection: "row",
    gap: spacing.compact
  },
  progressBarWrap: {
    flex: 1,
    paddingVertical: spacing.micro
  },
  progressBar: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 4
  },
  progressBarActive: {
    height: 4
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  backBtn: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  nextBtnWrap: {
    flex: 1
  },
  skipLabel: {
    color: colors.textTertiary,
    ...typography.label,
    textAlign: "center"
  }
});
