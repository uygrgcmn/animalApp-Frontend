import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated as RNAnimated,
  Image,
  Pressable,
  type PressableProps,
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
import { NavigationCard } from "../../../shared/ui/NavigationCard";
import { useSessionStore } from "../../auth/store/sessionStore";
import { useMyApplications, useListings } from "../../listings/hooks/useListings";
import { useCommunityListings } from "../../community/hooks/useCommunityListings";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useMyProfile, useUpdateMyProfile } from "../hooks/useMyProfile";
import { uploadMediaAsset } from "../../../core/media/uploadMediaAsset";
import {
  isCaregiverListing,
  isOwnerRequestListing
} from "../../listings/utils/listingGuards";
import { usePetshopCampaignManagement } from "../../petshop/hooks/usePetshopQueries";
import {
  getCaregiverModePresentation,
  getPetshopModePresentation
} from "../utils/modeStatus";

// ─── Status chip config ───────────────────────────────────────────────────────

const FALLBACK_CHIP = { bg: colors.surfaceMuted, text: colors.textSubtle, icon: "circle-outline" };

const MODE_STATUS_CHIP: Record<string, { bg: string; text: string; icon: string }> = {
  active:     { bg: colors.successSoft,  text: colors.success,  icon: "check-circle" },
  inactive:   FALLBACK_CHIP,
  incomplete: { bg: colors.warningSoft,  text: colors.warning,  icon: "alert-circle-outline" },
  in_review:  { bg: colors.infoSoft,     text: colors.info,     icon: "clock-outline" },
  rejected:   { bg: colors.errorSoft,    text: colors.error,    icon: "close-circle-outline" }
};

// ─── Screen ──────────────────────────────────────────────────────────────────

export function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((state) => state.user);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const signOut = useSessionStore((state) => state.signOut);

  const profileQuery = useMyProfile();
  const profile = profileQuery.data;
  const updateProfile = useUpdateMyProfile();

  const applicationsQuery = useMyApplications();
  const applicationCount = applicationsQuery.data?.length ?? 0;
  const myListingsQuery = useListings({ creatorId: user?.id });
  const myCommunityQuery = useCommunityListings({ creatorId: user?.id });
  const petshopCampaignsQuery = usePetshopCampaignManagement();
  const standardListingCount =
    myListingsQuery.data?.filter((item) => isCaregiverListing(item) || isOwnerRequestListing(item)).length ?? 0;
  const communityListingCount = myCommunityQuery.data?.length ?? 0;
  const petshopCampaignCount = petshopCampaignsQuery.data?.length ?? 0;
  const listingCount = standardListingCount + communityListingCount + petshopCampaignCount;
  const bookmarkCount = useBookmarkStore((s) => s.count)();

  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const displayName = profile?.fullName ?? user?.fullName ?? "Kullanıcı";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayAvatar = localAvatar ?? profile?.avatar ?? user?.avatar ?? null;
  const locationText = profile?.city
    ? `${profile.city}${profile.district ? `, ${profile.district}` : ""}`
    : null;
  const rating = profile?.rating ? Number(profile.rating) : null;
  const completion = profile?.profileCompletion ?? user?.profileCompletion ?? 0;

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  // Animated completion bar
  const completionAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (completion > 0) {
      RNAnimated.timing(completionAnim, {
        toValue: completion,
        duration: 900,
        useNativeDriver: false
      }).start();
    }
  }, [completionAnim, completion]);
  const completionWidth = completionAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp"
  });

  async function handleAvatarPress() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85
    });

    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setLocalAvatar(uri);
    setUploadingAvatar(true);

    try {
      const publicUrl = await uploadMediaAsset({ folder: "avatars", uri });
      if (!publicUrl.startsWith("file:")) {
        await updateProfile.mutateAsync({ avatar: publicUrl });
      }
      // If still file://, upload failed — local preview stays until next session
    } catch {
      // Revert optimistic update on unexpected error
      setLocalAvatar(null);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace(routes.auth.welcome);
  }

  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);

  return (
    <ScrollView
      contentContainerStyle={[styles.root, { paddingBottom: Math.max(insets.bottom + 110, 130) }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <LinearGradient
        colors={["#0D9488", "#0A7068", "#075C56"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.hero, { paddingTop: insets.top + 12 }]}
      >
        {/* Settings button */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroTopSpacer} />
          <Link asChild href={routes.app.profileSettings}>
            <Pressable style={styles.heroIconBtn} hitSlop={8}>
              <MaterialCommunityIcons color="#FFFFFF" name="cog-outline" size={20} />
            </Pressable>
          </Link>
        </View>

        {/* Avatar */}
        <Pressable
          style={styles.avatarWrapper}
          onPress={handleAvatarPress}
          disabled={uploadingAvatar}
        >
          {displayAvatar ? (
            <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
          ) : (
            <LinearGradient
              colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.14)"]}
              style={styles.avatarFallback}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          )}

          {/* Camera overlay */}
          {uploadingAvatar ? (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="#FFFFFF" size="small" />
            </View>
          ) : (
            <View style={styles.cameraBtn}>
              <MaterialCommunityIcons color={colors.primary} name="camera" size={14} />
            </View>
          )}
        </Pressable>

        {/* Identity */}
        <View style={styles.identity}>
          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroEmail}>{displayEmail}</Text>

          {(locationText || rating !== null) && (
            <View style={styles.heroPills}>
              {locationText && (
                <View style={styles.heroPill}>
                  <MaterialCommunityIcons color="rgba(255,255,255,0.7)" name="map-marker-outline" size={12} />
                  <Text style={styles.heroPillText}>{locationText}</Text>
                </View>
              )}
              {rating !== null && rating > 0 && (
                <View style={styles.heroPill}>
                  <MaterialCommunityIcons color="#FCD34D" name="star" size={12} />
                  <Text style={styles.heroPillText}>{rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ── Stats ── */}
      <View style={styles.statsCard}>
        <StatItem
          icon="cards-outline"
          label="İlan"
          loading={myListingsQuery.isLoading || myCommunityQuery.isLoading}
          value={listingCount}
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="file-document-outline"
          label="Başvuru"
          loading={applicationsQuery.isLoading}
          value={applicationCount}
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="bookmark-outline"
          label="Kayıtlı"
          loading={false}
          value={bookmarkCount}
        />
      </View>

      {/* ── Completion banner ── */}
      {completion > 0 && completion < 100 && (
        <Link asChild href={routes.app.profileEdit}>
          <Pressable style={({ pressed }) => [styles.completionCard, pressed && styles.pressed]}>
            <View style={styles.completionLeft}>
              <View style={styles.completionLabelRow}>
                <Text style={styles.completionTitle}>Profil tamamlanma</Text>
                <Text style={styles.completionPct}>%{Math.round(completion)}</Text>
              </View>
              <View style={styles.completionTrack}>
                <RNAnimated.View style={[styles.completionFill, { width: completionWidth }]} />
              </View>
              <Text style={styles.completionHint}>Profilini tamamla, daha fazla etkileşim al</Text>
            </View>
            <MaterialCommunityIcons color={colors.primary} name="chevron-right" size={20} />
          </Pressable>
        </Link>
      )}

      {/* ── Aktiviteler ── */}
      <MenuSection label="AKTİVİTELER">
        <Link asChild href={routes.app.profileListings}>
          <NavigationCard
            icon="cards-outline"
            iconColor="#EC4899"
            title="İlanlarım"
            description="İlanlarını görüntüle ve yönet"
            rightMeta={
              listingCount > 0 ? (
                <CountBadge value={listingCount} />
              ) : undefined
            }
          />
        </Link>
        <Link asChild href={routes.app.profileApplications}>
          <NavigationCard
            icon="file-document-outline"
            iconColor="#F59E0B"
            title="Başvurularım"
            description="Başvurularının durumunu takip et"
            rightMeta={
              applicationCount > 0 ? (
                <CountBadge value={applicationCount} highlight />
              ) : undefined
            }
          />
        </Link>
        <Link asChild href={routes.app.profileSaved}>
          <NavigationCard
            icon="bookmark-outline"
            iconColor="#10B981"
            title="Kaydettiklerim"
            description="Kaydettiğin ilanları incele"
            rightMeta={
              bookmarkCount > 0 ? (
                <CountBadge value={bookmarkCount} />
              ) : undefined
            }
          />
        </Link>
        <Link asChild href={routes.app.profilePets}>
          <NavigationCard
            icon="paw-outline"
            iconColor="#8B5CF6"
            title="Hayvanlarım"
            description="Hayvan profillerini yönet"
          />
        </Link>
      </MenuSection>

      {/* ── Mod Yönetimi ── */}
      <MenuSection label="MOD YÖNETİMİ">
        <Link asChild href={routes.app.profileModes}>
          <ModeRow
            icon="shield-account-outline"
            iconColor="#6366F1"
            label="Bakıcı Modu"
            status={caregiverStatus}
            statusLabel={caregiverPresentation.shortLabel}
          />
        </Link>
        <Link asChild href={routes.app.profileModes}>
          <ModeRow
            icon="storefront-outline"
            iconColor="#F97316"
            label="Petshop Modu"
            status={petshopStatus}
            statusLabel={petshopPresentation.shortLabel}
          />
        </Link>
      </MenuSection>

      {/* ── Hesap ── */}
      <MenuSection label="HESAP">
        <Link asChild href={routes.app.profileEdit}>
          <NavigationCard
            icon="account-edit-outline"
            iconColor={colors.primary}
            title="Profili Düzenle"
            description="Ad, fotoğraf, konum ve biyografi"
          />
        </Link>
        <Link asChild href={routes.app.profileSettings}>
          <NavigationCard
            icon="cog-outline"
            iconColor={colors.textMuted}
            title="Ayarlar"
            description="Bildirim, gizlilik ve uygulama tercihleri"
          />
        </Link>
      </MenuSection>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <MaterialCommunityIcons color={colors.error} name="logout" size={18} />
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </Pressable>
        <Text style={styles.versionText}>Sürüm 1.0.0 · Beta</Text>
      </View>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenuSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.menuCard}>{children}</View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  loading,
  value
}: {
  icon: string;
  label: string;
  loading: boolean;
  value: number;
}) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons color={colors.primary} name={icon as any} size={18} />
      {loading ? (
        <ActivityIndicator color={colors.textTertiary} size="small" />
      ) : (
        <Text style={styles.statValue}>{value}</Text>
      )}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CountBadge({ value, highlight = false }: { value: number; highlight?: boolean }) {
  return (
    <View style={[styles.countBadge, highlight && styles.countBadgeHighlight]}>
      <Text style={[styles.countBadgeText, highlight && styles.countBadgeTextHighlight]}>
        {value}
      </Text>
    </View>
  );
}

function ModeRow({
  icon,
  iconColor,
  label,
  status,
  statusLabel,
  ...pressableProps
}: {
  icon: string;
  iconColor: string;
  label: string;
  status: string;
  statusLabel: string;
} & Omit<PressableProps, "style">) {
  const chip = MODE_STATUS_CHIP[status] ?? FALLBACK_CHIP;

  return (
    <Pressable
      style={({ pressed }) => [styles.modeRow, pressed && styles.pressed]}
      {...pressableProps}
    >
      <View style={[styles.modeIconContainer, { backgroundColor: `${iconColor}18` }]}>
        <MaterialCommunityIcons color={iconColor} name={icon as any} size={20} />
      </View>
      <Text style={styles.modeLabel}>{label}</Text>
      <View style={styles.modeTrailing}>
        <View style={[styles.modeChip, { backgroundColor: chip.bg }]}>
          <MaterialCommunityIcons color={chip.text} name={chip.icon as any} size={12} />
          <Text style={[styles.modeChipText, { color: chip.text }]}>{statusLabel}</Text>
        </View>
        <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
      </View>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: spacing.section
  },
  // Hero
  hero: {
    gap: spacing.comfortable,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable
  },
  heroTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  heroTopSpacer: {
    width: 38
  },
  heroIconBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.full,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  avatarWrapper: {
    alignSelf: "center",
    position: "relative"
  },
  avatarImage: {
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: radius.full,
    borderWidth: 3,
    height: 96,
    width: 96
  },
  avatarFallback: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.full,
    borderWidth: 2,
    height: 96,
    justifyContent: "center",
    width: 96
  },
  avatarInitials: {
    color: colors.textInverse,
    fontSize: 30,
    fontWeight: "800"
  },
  avatarOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: radius.full,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  cameraBtn: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: radius.full,
    borderWidth: 2,
    bottom: 0,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 28
  },
  identity: {
    alignItems: "center",
    gap: spacing.tight
  },
  heroName: {
    color: colors.textInverse,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3
  },
  heroEmail: {
    color: "rgba(255,255,255,0.7)",
    ...typography.caption
  },
  heroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    justifyContent: "center",
    marginTop: spacing.micro
  },
  heroPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: spacing.compact,
    paddingVertical: 5
  },
  heroPillText: {
    color: "rgba(255,255,255,0.85)",
    ...typography.caption
  },
  // Stats
  statsCard: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    marginHorizontal: spacing.comfortable
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    gap: spacing.micro,
    paddingVertical: spacing.comfortable
  },
  statDivider: {
    backgroundColor: colors.divider,
    height: "55%",
    width: 1
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSubtle
  },
  // Completion
  completionCard: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    gap: spacing.standard,
    marginHorizontal: spacing.comfortable,
    padding: spacing.standard
  },
  completionLeft: {
    flex: 1,
    gap: spacing.tight
  },
  completionLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  completionTitle: {
    ...typography.bodyStrong,
    color: colors.text
  },
  completionPct: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800"
  },
  completionTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 6,
    overflow: "hidden"
  },
  completionFill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: "100%"
  },
  completionHint: {
    ...typography.caption,
    color: colors.textSubtle
  },
  // Sections
  section: {
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textSubtle,
    paddingHorizontal: spacing.micro
  },
  menuCard: {
    ...shadows.micro,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden"
  },
  // Mode row
  modeRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    flexDirection: "row",
    gap: spacing.standard,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact + 2
  },
  modeIconContainer: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  modeLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "700"
  },
  modeTrailing: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight
  },
  modeChip: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  modeChipText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize"
  },
  // Count badge
  countBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 22,
    justifyContent: "center",
    minWidth: 22,
    paddingHorizontal: spacing.micro + 2
  },
  countBadgeHighlight: {
    backgroundColor: colors.primary
  },
  countBadgeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800"
  },
  countBadgeTextHighlight: {
    color: colors.textInverse
  },
  // Footer
  footer: {
    alignItems: "center",
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable
  },
  signOutBtn: {
    alignItems: "center",
    backgroundColor: colors.errorSoft,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.compact
  },
  signOutText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "700"
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary
  },
  pressed: {
    opacity: 0.65
  }
});
