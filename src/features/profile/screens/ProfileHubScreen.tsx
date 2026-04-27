import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useSessionStore } from "../../auth/store/sessionStore";
import { useMyApplications, useListings } from "../../listings/hooks/useListings";
import { useCommunityListings } from "../../community/hooks/useCommunityListings";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useMyProfile, useUpdateMyProfile } from "../hooks/useMyProfile";
import { uploadMediaAsset } from "../../../core/media/uploadMediaAsset";
import { isCaregiverListing, isOwnerRequestListing } from "../../listings/utils/listingGuards";
import { usePetshopCampaignManagement } from "../../petshop/hooks/usePetshopQueries";
import { getCaregiverModePresentation, getPetshopModePresentation } from "../utils/modeStatus";

const FALLBACK_CHIP = { bg: colors.surfaceMuted, text: colors.textSubtle, icon: "circle-outline" } as const;

const MODE_CHIP: Record<string, { bg: string; text: string; icon: string }> = {
  active:     { bg: colors.successSoft,  text: colors.success,  icon: "check-circle"          },
  inactive:   FALLBACK_CHIP,
  incomplete: { bg: colors.warningSoft,  text: colors.warning,  icon: "alert-circle-outline"  },
  in_review:  { bg: colors.infoSoft,     text: colors.info,     icon: "clock-outline"          },
  rejected:   { bg: colors.errorSoft,    text: colors.error,    icon: "close-circle-outline"   }
};

export function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const user = useSessionStore((s) => s.user);
  const caregiverStatus = useSessionStore((s) => s.caregiverStatus);
  const petshopStatus  = useSessionStore((s) => s.petshopStatus);
  const signOut = useSessionStore((s) => s.signOut);

  const profileQuery   = useMyProfile();
  const profile        = profileQuery.data;
  const updateProfile  = useUpdateMyProfile();

  const applicationsQuery = useMyApplications();
  const applicationCount  = applicationsQuery.data?.length ?? 0;
  const myListingsQuery   = useListings({ creatorId: user?.id });
  const myCommunityQuery  = useCommunityListings({ creatorId: user?.id });
  const petshopQuery      = usePetshopCampaignManagement();
  const listingCount =
    (myListingsQuery.data?.filter((l) => isCaregiverListing(l) || isOwnerRequestListing(l)).length ?? 0) +
    (myCommunityQuery.data?.length ?? 0) +
    (petshopQuery.data?.length ?? 0);
  const bookmarkCount = useBookmarkStore((s) => s.count)();

  const [localAvatar,    setLocalAvatar]    = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const displayName   = profile?.fullName ?? user?.fullName ?? "Kullanıcı";
  const displayEmail  = profile?.email    ?? user?.email    ?? "";
  const displayAvatar = localAvatar ?? profile?.avatar ?? user?.avatar ?? null;
  const locationText  = profile?.city
    ? [profile.city, profile.district].filter(Boolean).join(", ")
    : null;
  const rating     = profile?.rating ? Number(profile.rating) : null;
  const completion = profile?.profileCompletion ?? user?.profileCompletion ?? 0;
  const initials   = displayName.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

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
    } catch {
      setLocalAvatar(null);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace(routes.auth.welcome);
  }

  const caregiverChip  = MODE_CHIP[caregiverStatus]  ?? FALLBACK_CHIP;
  const petshopChip    = MODE_CHIP[petshopStatus]    ?? FALLBACK_CHIP;
  const caregiverLabel = getCaregiverModePresentation(caregiverStatus).shortLabel;
  const petshopLabel   = getPetshopModePresentation(petshopStatus).shortLabel;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.root,
        { paddingBottom: Math.max(insets.bottom + 100, 120) }
      ]}
      showsVerticalScrollIndicator={false}
    >

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={["#0D9488", "#075C56"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.hero, { paddingTop: insets.top + 16 }]}
      >
        {/* Üst satır — ayarlar butonu */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroSpacer} />
          <Link asChild href={routes.app.profileSettings}>
            <Pressable hitSlop={10} style={styles.settingsBtn}>
              <MaterialCommunityIcons color="#fff" name="cog-outline" size={20} />
            </Pressable>
          </Link>
        </View>

        {/* Avatar */}
        <Pressable disabled={uploadingAvatar} onPress={handleAvatarPress} style={styles.avatarWrap}>
          {displayAvatar ? (
            <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
          ) : (
            <LinearGradient
              colors={["rgba(255,255,255,0.30)", "rgba(255,255,255,0.12)"]}
              style={styles.avatarFallback}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          )}
          {uploadingAvatar ? (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          ) : (
            <View style={styles.cameraChip}>
              <MaterialCommunityIcons color={colors.primary} name="camera" size={13} />
            </View>
          )}
        </Pressable>

        {/* İsim + meta */}
        <View style={styles.identity}>
          <Text style={styles.heroName}>{displayName}</Text>
          {(locationText || rating !== null || displayEmail) ? (
            <View style={styles.metaRow}>
              {locationText ? (
                <View style={styles.metaPill}>
                  <MaterialCommunityIcons color="rgba(255,255,255,0.65)" name="map-marker-outline" size={12} />
                  <Text style={styles.metaPillText}>{locationText}</Text>
                </View>
              ) : null}
              {rating !== null && rating > 0 ? (
                <View style={styles.metaPill}>
                  <MaterialCommunityIcons color="#FCD34D" name="star" size={12} />
                  <Text style={styles.metaPillText}>{rating.toFixed(1)}</Text>
                </View>
              ) : null}
              {displayEmail ? (
                <View style={styles.metaPill}>
                  <MaterialCommunityIcons color="rgba(255,255,255,0.65)" name="email-outline" size={12} />
                  <Text style={styles.metaPillText}>{displayEmail}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </LinearGradient>

      {/* ── İstatistikler — hero'nun üstüne biner ────────────────────────── */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          {myListingsQuery.isLoading || myCommunityQuery.isLoading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={styles.statValue}>{listingCount}</Text>
          )}
          <View style={styles.statMeta}>
            <MaterialCommunityIcons color={colors.textSubtle} name="cards-outline" size={13} />
            <Text style={styles.statLabel}>İlan</Text>
          </View>
        </View>

        <View style={styles.statSep} />

        <View style={styles.statCol}>
          {applicationsQuery.isLoading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={styles.statValue}>{applicationCount}</Text>
          )}
          <View style={styles.statMeta}>
            <MaterialCommunityIcons color={colors.textSubtle} name="file-document-outline" size={13} />
            <Text style={styles.statLabel}>Başvuru</Text>
          </View>
        </View>

        <View style={styles.statSep} />

        <View style={styles.statCol}>
          <Text style={styles.statValue}>{bookmarkCount}</Text>
          <View style={styles.statMeta}>
            <MaterialCommunityIcons color={colors.textSubtle} name="bookmark-outline" size={13} />
            <Text style={styles.statLabel}>Kayıtlı</Text>
          </View>
        </View>
      </View>

      {/* ── Profil tamamlanma ─────────────────────────────────────────────── */}
      {completion > 0 && completion < 100 ? (
        <Link asChild href={routes.app.profileEdit}>
          <Pressable style={({ pressed }) => [styles.completionBanner, pressed && { opacity: 0.75 }]}>
            <View style={styles.completionLeft}>
              <View style={styles.completionLabelRow}>
                <Text style={styles.completionTitle}>Profil tamamlanma</Text>
                <Text style={styles.completionPct}>%{Math.round(completion)}</Text>
              </View>
              <View style={styles.completionTrack}>
                <RNAnimated.View style={[styles.completionFill, { width: completionWidth }]} />
              </View>
            </View>
            <MaterialCommunityIcons color={colors.primary} name="chevron-right" size={18} />
          </Pressable>
        </Link>
      ) : null}

      {/* ── Hızlı Erişim 2 × 2 ───────────────────────────────────────────── */}
      <View style={styles.gridSection}>
        <View style={styles.gridRow}>
          <Link asChild href={routes.app.profileListings}>
            <Pressable style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.7 }]}>
              <View style={styles.gridIconWrap}>
                <View style={[styles.gridIconCircle, { backgroundColor: "#EC489915" }]}>
                  <MaterialCommunityIcons color="#EC4899" name="cards-outline" size={26} />
                </View>
                {listingCount > 0 ? (
                  <View style={styles.gridBadge}>
                    <Text style={styles.gridBadgeText}>{listingCount > 99 ? "99+" : listingCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.gridLabel}>İlanlarım</Text>
            </Pressable>
          </Link>

          <Link asChild href={routes.app.profileApplications}>
            <Pressable style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.7 }]}>
              <View style={styles.gridIconWrap}>
                <View style={[styles.gridIconCircle, { backgroundColor: "#F59E0B15" }]}>
                  <MaterialCommunityIcons color="#F59E0B" name="file-document-outline" size={26} />
                </View>
                {applicationCount > 0 ? (
                  <View style={[styles.gridBadge, styles.gridBadgeHL]}>
                    <Text style={[styles.gridBadgeText, styles.gridBadgeTextHL]}>
                      {applicationCount > 99 ? "99+" : applicationCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.gridLabel}>Başvurularım</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.gridRow}>
          <Link asChild href={routes.app.profileSaved}>
            <Pressable style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.7 }]}>
              <View style={styles.gridIconWrap}>
                <View style={[styles.gridIconCircle, { backgroundColor: "#10B98115" }]}>
                  <MaterialCommunityIcons color="#10B981" name="bookmark-outline" size={26} />
                </View>
                {bookmarkCount > 0 ? (
                  <View style={styles.gridBadge}>
                    <Text style={styles.gridBadgeText}>{bookmarkCount > 99 ? "99+" : bookmarkCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.gridLabel}>Kaydettiklerim</Text>
            </Pressable>
          </Link>

          <Link asChild href={routes.app.profilePets}>
            <Pressable style={({ pressed }) => [styles.gridCard, pressed && { opacity: 0.7 }]}>
              <View style={styles.gridIconWrap}>
                <View style={[styles.gridIconCircle, { backgroundColor: "#8B5CF615" }]}>
                  <MaterialCommunityIcons color="#8B5CF6" name="paw-outline" size={26} />
                </View>
              </View>
              <Text style={styles.gridLabel}>Hayvanlarım</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* ── Modlar ────────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MODLAR</Text>
        <View style={styles.listCard}>
          <Link asChild href={routes.app.profileModes}>
            <Pressable style={({ pressed }) => [styles.listRow, pressed && { opacity: 0.65 }]}>
              <View style={[styles.listIcon, { backgroundColor: "#6366F118" }]}>
                <MaterialCommunityIcons color="#6366F1" name="shield-account-outline" size={20} />
              </View>
              <Text style={styles.listLabel} numberOfLines={1}>Bakıcı Modu</Text>
              <View style={[styles.modeChip, { backgroundColor: caregiverChip.bg }]}>
                <MaterialCommunityIcons
                  color={caregiverChip.text}
                  name={caregiverChip.icon as any}
                  size={11}
                />
                <Text style={[styles.modeChipText, { color: caregiverChip.text }]}>
                  {caregiverLabel}
                </Text>
              </View>
              <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
            </Pressable>
          </Link>

          <View style={styles.rowDivider} />

          <Link asChild href={routes.app.profileModes}>
            <Pressable style={({ pressed }) => [styles.listRow, pressed && { opacity: 0.65 }]}>
              <View style={[styles.listIcon, { backgroundColor: "#F9731618" }]}>
                <MaterialCommunityIcons color="#F97316" name="storefront-outline" size={20} />
              </View>
              <Text style={styles.listLabel} numberOfLines={1}>Petshop Modu</Text>
              <View style={[styles.modeChip, { backgroundColor: petshopChip.bg }]}>
                <MaterialCommunityIcons
                  color={petshopChip.text}
                  name={petshopChip.icon as any}
                  size={11}
                />
                <Text style={[styles.modeChipText, { color: petshopChip.text }]}>
                  {petshopLabel}
                </Text>
              </View>
              <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
            </Pressable>
          </Link>
        </View>
      </View>

      {/* ── Hesap ─────────────────────────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>HESAP</Text>
        <View style={styles.listCard}>
          <Link asChild href={routes.app.profileEdit}>
            <Pressable style={({ pressed }) => [styles.listRow, pressed && { opacity: 0.65 }]}>
              <View style={[styles.listIcon, { backgroundColor: `${colors.primary}18` }]}>
                <MaterialCommunityIcons color={colors.primary} name="account-edit-outline" size={20} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listLabel}>Profili Düzenle</Text>
                <Text style={styles.listSub}>Ad, fotoğraf, konum</Text>
              </View>
              <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
            </Pressable>
          </Link>

          <View style={styles.rowDivider} />

          <Link asChild href={routes.app.profileSettings}>
            <Pressable style={({ pressed }) => [styles.listRow, pressed && { opacity: 0.65 }]}>
              <View style={[styles.listIcon, { backgroundColor: colors.surfaceMuted }]}>
                <MaterialCommunityIcons color={colors.textMuted} name="cog-outline" size={20} />
              </View>
              <View style={styles.listContent}>
                <Text style={styles.listLabel}>Ayarlar</Text>
                <Text style={styles.listSub}>Bildirim ve gizlilik</Text>
              </View>
              <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
            </Pressable>
          </Link>
        </View>
      </View>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutRow, pressed && { opacity: 0.6 }]}
        >
          <MaterialCommunityIcons color={colors.error} name="logout-variant" size={16} />
          <Text style={styles.signOutText}>Çıkış Yap</Text>
        </Pressable>
        <Text style={styles.versionText}>Sürüm 1.0.0 · Beta</Text>
      </View>

    </ScrollView>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const GRID_GAP = spacing.compact;

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background
  },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    alignItems: "center",
    gap: spacing.standard,
    paddingBottom: 52,
    paddingHorizontal: spacing.comfortable
  },
  heroTopRow: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  heroSpacer: {
    width: 40
  },
  settingsBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  avatarWrap: {
    position: "relative"
  },
  avatarImg: {
    borderColor: "rgba(255,255,255,0.40)",
    borderRadius: radius.full,
    borderWidth: 3,
    height: 108,
    width: 108
  },
  avatarFallback: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.full,
    borderWidth: 2,
    height: 108,
    justifyContent: "center",
    width: 108
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800"
  },
  avatarOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.42)",
    borderRadius: radius.full,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  cameraChip: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: radius.full,
    borderWidth: 2,
    bottom: 2,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 2,
    width: 28
  },
  identity: {
    alignItems: "center",
    gap: spacing.compact
  },
  heroName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    justifyContent: "center"
  },
  metaPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  metaPillText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500"
  },

  // ── İstatistikler ────────────────────────────────────────────────────────
  statsCard: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    marginHorizontal: spacing.comfortable,
    marginTop: -32
  },
  statCol: {
    alignItems: "center",
    flex: 1,
    gap: 6,
    paddingVertical: spacing.comfortable
  },
  statSep: {
    backgroundColor: colors.divider,
    height: 32,
    width: 1
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5
  },
  statMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4
  },
  statLabel: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "500"
  },

  // ── Profil tamamlanma ────────────────────────────────────────────────────
  completionBanner: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.large,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.standard,
    marginHorizontal: spacing.comfortable,
    marginTop: spacing.section,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact + 2
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
    color: colors.text,
    ...typography.label
  },
  completionPct: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800"
  },
  completionTrack: {
    backgroundColor: colors.primaryBorder,
    borderRadius: radius.pill,
    height: 5,
    overflow: "hidden"
  },
  completionFill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: "100%"
  },

  // ── Grid ─────────────────────────────────────────────────────────────────
  gridSection: {
    gap: GRID_GAP,
    marginHorizontal: spacing.comfortable,
    marginTop: spacing.section
  },
  gridRow: {
    flexDirection: "row",
    gap: GRID_GAP
  },
  gridCard: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flex: 1,
    gap: spacing.compact,
    paddingVertical: spacing.comfortable
  },
  gridIconWrap: {
    position: "relative"
  },
  gridIconCircle: {
    alignItems: "center",
    borderRadius: radius.large,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  gridBadge: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.background,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 3,
    position: "absolute",
    right: -4,
    top: -4
  },
  gridBadgeHL: {
    backgroundColor: colors.primary
  },
  gridBadgeText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800"
  },
  gridBadgeTextHL: {
    color: "#fff"
  },
  gridLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },

  // ── Liste bölümleri ──────────────────────────────────────────────────────
  section: {
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable,
    marginTop: spacing.section
  },
  sectionLabel: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: spacing.micro
  },
  listCard: {
    ...shadows.micro,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden"
  },
  listRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard,
    paddingHorizontal: spacing.standard,
    paddingVertical: 14
  },
  listIcon: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  listLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "600"
  },
  listContent: {
    flex: 1,
    gap: 2
  },
  listSub: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "400"
  },
  rowDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginLeft: spacing.standard + 40 + spacing.standard
  },

  // ── Mod chip ─────────────────────────────────────────────────────────────
  modeChip: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  modeChipText: {
    fontSize: 11,
    fontWeight: "700"
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    alignItems: "center",
    gap: spacing.compact,
    marginHorizontal: spacing.comfortable,
    marginTop: spacing.section
  },
  signOutRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.compact
  },
  signOutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "700"
  },
  versionText: {
    color: colors.textTertiary,
    ...typography.caption
  }
});
