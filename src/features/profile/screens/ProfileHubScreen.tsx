import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated as RNAnimated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { NavigationCard } from "../../../shared/ui/NavigationCard";
import { useSessionStore } from "../../auth/store/sessionStore";
import { useMyApplications } from "../../listings/hooks/useListings";
import { useMyProfile } from "../hooks/useMyProfile";
import {
  getCaregiverModePresentation,
  getPetshopModePresentation
} from "../utils/modeStatus";

export function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((state) => state.user);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const signOut = useSessionStore((state) => state.signOut);

  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);

  const profileQuery = useMyProfile();
  const profile = profileQuery.data;

  const applicationsQuery = useMyApplications();
  const applicationCount = applicationsQuery.data?.length ?? 0;

  const completionAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (profile?.profileCompletion !== undefined) {
      RNAnimated.timing(completionAnim, {
        toValue: profile.profileCompletion,
        duration: 900,
        useNativeDriver: false
      }).start();
    }
  }, [completionAnim, profile?.profileCompletion]);
  const completionWidth = completionAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  async function handleSignOut() {
    await signOut();
    router.replace(routes.auth.welcome);
  }

  const displayName = profile?.fullName ?? user?.fullName ?? "Kullanıcı";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayAvatar = profile?.avatar ?? user?.avatar;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const completion = profile?.profileCompletion ?? 0;
  const locationText = profile?.city
    ? `${profile.city}${profile.district ? `, ${profile.district}` : ""}`
    : null;

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 110, 130) }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <LinearGradient
        colors={["#0D9488", "#0F7A6E", "#0A5C52"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.hero, { paddingTop: insets.top + 20 }]}
      >
        {/* Action buttons */}
        <View style={styles.heroActions}>
          <Link asChild href={routes.app.profileEdit}>
            <Pressable style={styles.heroIconBtn}>
              <MaterialCommunityIcons color="#FFFFFF" name="pencil-outline" size={18} />
            </Pressable>
          </Link>
          <Link asChild href={routes.app.profileSettings}>
            <Pressable style={styles.heroIconBtn}>
              <MaterialCommunityIcons color="#FFFFFF" name="cog-outline" size={18} />
            </Pressable>
          </Link>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {displayAvatar ? (
            <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
          ) : (
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.12)"]}
              style={styles.avatarFallback}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          )}
        </View>

        {/* Identity */}
        <View style={styles.heroIdentity}>
          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroEmail}>{displayEmail}</Text>
          {locationText && (
            <View style={styles.locationRow}>
              <MaterialCommunityIcons color="rgba(255,255,255,0.7)" name="map-marker-outline" size={13} />
              <Text style={styles.locationText}>{locationText}</Text>
            </View>
          )}
        </View>

        {/* Completion bar */}
        {completion > 0 && completion < 100 && (
          <View style={styles.completionWrap}>
            <View style={styles.completionLabelRow}>
              <MaterialCommunityIcons color="rgba(255,255,255,0.7)" name="chart-arc" size={13} />
              <Text style={styles.completionLabel}>
                Profil tamamlanma — %{Math.round(completion)}
              </Text>
            </View>
            <View style={styles.completionTrack}>
              <RNAnimated.View style={[styles.completionFill, { width: completionWidth }]} />
            </View>
          </View>
        )}

        {/* Mode badges */}
        <View style={styles.modeBadgeRow}>
          <ModePill
            icon={caregiverPresentation.icon}
            label={`Bakıcı · ${caregiverPresentation.shortLabel}`}
            active={caregiverStatus === "active"}
          />
          <ModePill
            icon={petshopPresentation.icon}
            label={`Petshop · ${petshopPresentation.shortLabel}`}
            active={petshopStatus === "active"}
          />
        </View>
      </LinearGradient>

      {/* ── Stats ── */}
      <View style={styles.statsCard}>
        <StatItem
          icon="file-document-outline"
          label="Başvuru"
          value={applicationsQuery.isLoading ? "…" : String(applicationCount)}
        />
        <View style={styles.statDivider} />
        <StatItem icon="cards-outline" label="İlanım" value="–" />
        <View style={styles.statDivider} />
        <StatItem icon="bookmark-outline" label="Kayıtlı" value="–" />
      </View>

      {/* ── Navigation ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HESAP YÖNETİMİ</Text>
        <View style={styles.navCard}>
          <Link asChild href={routes.app.profileModes}>
            <NavigationCard
              description="Rollerini ve aktif durumunu yönet"
              icon="toggle-switch-outline"
              iconColor="#6366F1"
              title="Modlarım"
            />
          </Link>
          <Link asChild href={routes.app.profileListings}>
            <NavigationCard
              description="İlanlarını görüntüle ve düzenle"
              icon="cards-outline"
              iconColor="#EC4899"
              title="İlanlarım"
            />
          </Link>
          <Link asChild href={routes.app.profileApplications}>
            <NavigationCard
              description="Başvurularının durumunu gör"
              icon="file-document-outline"
              iconColor="#F59E0B"
              rightMeta={
                applicationCount > 0 ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{applicationCount}</Text>
                  </View>
                ) : undefined
              }
              title="Başvurularım"
            />
          </Link>
          <Link asChild href={routes.app.profileSaved}>
            <NavigationCard
              description="Kaydettiğin ilanları incele"
              icon="bookmark-outline"
              iconColor="#10B981"
              title="Kaydettiklerim"
            />
          </Link>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <AppButton
          label="Çıkış Yap"
          leftSlot={<MaterialCommunityIcons color={colors.error} name="logout" size={18} />}
          onPress={handleSignOut}
          variant="ghost"
        />
        <Text style={styles.versionText}>Sürüm 1.0.0 · Beta</Text>
      </View>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons color={colors.primary} name={icon as any} size={18} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ModePill({
  active,
  icon,
  label
}: {
  active: boolean;
  icon: string;
  label: string;
}) {
  return (
    <View style={[styles.modePill, active && styles.modePillActive]}>
      <MaterialCommunityIcons
        color={active ? colors.primary : "rgba(255,255,255,0.7)"}
        name={icon as any}
        size={13}
      />
      <Text style={[styles.modePillLabel, active && styles.modePillLabelActive]}>{label}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  avatarContainer: {
    alignSelf: "center",
    marginTop: spacing.compact
  },
  avatarFallback: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 84,
    justifyContent: "center",
    width: 84
  },
  avatarImage: {
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: radius.full,
    borderWidth: 3,
    height: 84,
    width: 84
  },
  avatarInitials: {
    color: colors.textInverse,
    fontSize: 28,
    fontWeight: "800"
  },
  completionFill: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radius.pill,
    height: "100%"
  },
  completionLabel: {
    color: "rgba(255,255,255,0.75)",
    ...typography.caption
  },
  completionLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.micro
  },
  completionTrack: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
    height: 6,
    overflow: "hidden"
  },
  completionWrap: {
    gap: spacing.tight
  },
  content: {
    gap: spacing.section
  },
  countBadge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: spacing.micro
  },
  countBadgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "800"
  },
  footer: {
    alignItems: "center",
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable
  },
  hero: {
    gap: spacing.standard,
    paddingBottom: spacing.comfortable,
    paddingHorizontal: spacing.comfortable
  },
  heroActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight,
    justifyContent: "flex-end"
  },
  heroEmail: {
    color: "rgba(255,255,255,0.75)",
    ...typography.body
  },
  heroIconBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.full,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  heroIdentity: {
    alignItems: "center",
    gap: spacing.micro
  },
  heroName: {
    color: colors.textInverse,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.micro
  },
  locationText: {
    color: "rgba(255,255,255,0.65)",
    ...typography.caption
  },
  modeBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  modePill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: spacing.compact,
    paddingVertical: 6
  },
  modePillActive: {
    backgroundColor: colors.surface,
    borderColor: colors.surface
  },
  modePillLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600"
  },
  modePillLabelActive: {
    color: colors.primary
  },
  navCard: {
    ...shadows.micro,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden"
  },
  section: {
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textSubtle,
    paddingHorizontal: spacing.micro
  },
  statDivider: {
    backgroundColor: colors.divider,
    height: "60%",
    width: 1
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    gap: spacing.micro,
    paddingVertical: spacing.comfortable
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSubtle
  },
  statsCard: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    marginHorizontal: spacing.comfortable
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary
  }
});
