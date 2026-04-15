import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { applicationItems, listingItems, savedItems } from "../../../shared/mocks/profile";
import { AppButton } from "../../../shared/ui/AppButton";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { MetricCard } from "../../../shared/ui/MetricCard";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { NavigationCard } from "../../../shared/ui/NavigationCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  getCaregiverModePresentation,
  getPetshopModePresentation
} from "../utils/modeStatus";

export function ProfileHubScreen() {
  const user = useSessionStore((state) => state.user);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>{user?.fullName?.[0] || "U"}</Text>
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.headerTitle}>{user?.fullName || "Kullanici"}</Text>
          <Text style={styles.headerSubtitle}>{user?.email || "demo@animalapp.dev"}</Text>
        </View>
      </View>

      <View style={styles.modeSection}>
        <InfoCard
          description="Profil tamamlama ve aktif rol durumlarini tek bakista ozetler."
          title="Mod Durumu"
          variant="accent"
        >
          <View style={styles.badgeRow}>
            <ModeBadge
              label={`Bakici ${caregiverPresentation.shortLabel}`}
              tone={caregiverPresentation.tone === "success" ? "success" : "muted"}
            />
            <ModeBadge
              label={`Petshop ${petshopPresentation.shortLabel}`}
              tone={petshopPresentation.tone === "success" ? "success" : "muted"}
            />
            {user?.profileCompletion === 100 && (
              <MetaPill icon="shield-check" label="Dogrulanmis Profil" tone="primary" />
            )}
          </View>
        </InfoCard>
      </View>

      <View style={styles.metricRow}>
        <MetricCard
          caption="Devam eden ve gecmis talepler"
          icon="file-document-outline"
          title="Basvurular"
          value={String(applicationItems.length)}
        />
        <MetricCard
          caption="Yayindaki ve taslak ilanlar"
          icon="cards-outline"
          title="Ilanlarim"
          value={String(listingItems.length)}
        />
        <MetricCard
          caption="Sonra bakmak icin ayirdiklarin"
          icon="bookmark-outline"
          title="Kayitli"
          value={String(savedItems.length)}
        />
      </View>

      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Yonetim Panelleri</Text>
        <View style={styles.navList}>
          <Link href={routes.app.profileModes} asChild>
            <NavigationCard
              description="Bakici ve petshop rollerini yonet."
              icon="toggle-switch-outline"
              title="Modlarim"
            />
          </Link>

          <Link href={routes.app.profileListings} asChild>
            <NavigationCard
              description="Yayindaki ilanlarini gor ve duzenle."
              icon="cards-outline"
              title="Ilanlarim"
            />
          </Link>

          <Link href={routes.app.profileApplications} asChild>
            <NavigationCard
              description="Yaptigin basvurularin durumunu takip et."
              icon="file-document-outline"
              title="Basvurularim"
            />
          </Link>

          <Link href={routes.app.profileSaved} asChild>
            <NavigationCard
              description="Kaydettigin ilan ve paylasimlari ac."
              icon="bookmark-outline"
              title="Kaydettiklerim"
            />
          </Link>

          <Link href={routes.app.profileSettings} asChild>
            <NavigationCard
              description="Hesap ve uygulama tercihlerini guncelle."
              icon="cog-outline"
              title="Ayarlar"
            />
          </Link>
        </View>
      </View>

      <AppButton label="Cikis Yap" variant="ghost" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  avatarLarge: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.xlarge,
    height: 80,
    justifyContent: "center",
    width: 80
  },
  avatarTextLarge: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 32
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard,
    paddingHorizontal: spacing.micro,
    marginTop: spacing.tight
  },
  headerTexts: {
    flex: 1,
    gap: spacing.micro
  },
  headerSubtitle: {
    color: colors.textMuted,
    ...typography.body
  },
  headerTitle: {
    color: colors.text,
    ...typography.h1
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.compact,
    paddingHorizontal: spacing.micro
  },
  modeSection: {
    marginTop: -spacing.micro
  },
  navList: {
    gap: spacing.compact
  },
  navigationSection: {
    gap: spacing.standard
  },
  sectionTitle: {
    color: colors.text,
    paddingHorizontal: spacing.micro,
    ...typography.h2
  }
});
