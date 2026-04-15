import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { resolveAuthenticatedRoute, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { useSessionStore } from "../store/sessionStore";

const onboardingSlides = [
  {
    description:
      "Ana sayfa, modlar ve basvurular ayni hesapta duzenli bir merkez gibi calisir.",
    highlights: [
      { icon: "view-dashboard-outline", label: "Kisisel dashboard" },
      { icon: "account-switch-outline", label: "Acilabilir modlar" },
      { icon: "gesture-tap-button", label: "Net CTA yapisi" }
    ],
    icon: "view-dashboard-outline" as const,
    title: "Duzenli bir baslangic"
  },
  {
    description:
      "Bakici ilanlari, bakici arayanlar ve petshop kampanyalari ayni kesif yapisinda ayrisir.",
    highlights: [
      { icon: "compass-outline", label: "3 ana kesif akisi" },
      { icon: "map-marker-outline", label: "Konum odakli kartlar" },
      { icon: "shield-check-outline", label: "Guven gostergeleri" }
    ],
    icon: "compass-outline" as const,
    title: "Kesfetmek daha net"
  },
  {
    description:
      "Topluluk, mesajlar ve mod basvurulari seni durdurmadan yonlendiren bir deneyimle ilerler.",
    highlights: [
      { icon: "hand-heart-outline", label: "Topluluk alani" },
      { icon: "message-text-outline", label: "Mesaj ozeti" },
      { icon: "progress-check", label: "Yonlendiren gating" }
    ],
    icon: "hand-heart-outline" as const,
    title: "Guven veren akis"
  }
] as const;

export function OnboardingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const completeOnboarding = useSessionStore((state) => state.completeOnboarding);
  const hasCompletedProfileSetup = useSessionStore(
    (state) => state.hasCompletedProfileSetup
  );
  const slide = onboardingSlides[activeStep] ?? onboardingSlides[0];
  const isLastStep = activeStep === onboardingSlides.length - 1;

  const footerDescription = useMemo(() => {
    if (isAuthenticated) {
      return "Bir sonraki adimda temel profilini tamamlayip dogru akislarla esleseceksin.";
    }

    return "Hazirsan hesap olusturup ilk profil kurulumuna gec.";
  }, [isAuthenticated]);

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((current) => current + 1);
      return;
    }

    completeOnboarding();

    if (!isAuthenticated) {
      router.replace(routes.auth.signUp);
      return;
    }

    router.replace(
      resolveAuthenticatedRoute({
        hasCompletedOnboarding: true,
        hasCompletedProfileSetup
      })
    );
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Sade ama premium bir kurgu ile uygulamanin temel akisini kisa adimlarda tani."
        icon={slide.icon}
        metrics={[
          { icon: "circle-slice-3", label: `${activeStep + 1}/3`, tone: "primary" },
          { icon: "shield-check-outline", label: "Guven veren", tone: "success" }
        ]}
        title="Ilk bakista net deneyim"
      />

      <View style={styles.progress}>
        {onboardingSlides.map((item, index) => (
          <View
            key={item.title}
            style={[styles.progressBar, index === activeStep ? styles.progressBarActive : null]}
          />
        ))}
      </View>

      <InfoCard description={slide.description} title={slide.title}>
        <View style={styles.highlights}>
          {slide.highlights.map((highlight) => (
            <FilterChip
              key={highlight.label}
              icon={highlight.icon}
              label={highlight.label}
              selected
            />
          ))}
        </View>
      </InfoCard>

      <InfoCard
        description={footerDescription}
        title={isLastStep ? "Devam etmeye hazirsin" : "Bir sonraki adim"}
        variant="accent"
      >
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Onboarding oyuncak hissi vermeden sadece ihtiyacin olan resmi gosterir.
          </Text>
          <View style={styles.actions}>
            {activeStep > 0 ? (
              <AppButton
                label="Geri"
                onPress={() => {
                  setActiveStep((current) => current - 1);
                }}
                variant="secondary"
              />
            ) : null}
            <AppButton
              label={isLastStep ? "Devam Et" : "Ileri"}
              leftSlot={
                <AppIcon backgrounded={false} color="#FFFFFF" name="arrow-right" size={18} />
              }
              onPress={handleNext}
            />
          </View>
        </View>
      </InfoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.compact
  },
  content: {
    gap: spacing.section
  },
  footer: {
    gap: spacing.standard
  },
  footerText: {
    color: colors.textMuted,
    ...typography.body
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  progress: {
    flexDirection: "row",
    gap: spacing.tight
  },
  progressBar: {
    backgroundColor: colors.primaryBorder,
    borderRadius: 999,
    flex: 1,
    height: 6
  },
  progressBarActive: {
    backgroundColor: colors.primary
  }
});
