import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import type { ReactNode } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { useCommunityListings } from "../../community/hooks/useCommunityListings";
import { useListings } from "../../listings/hooks/useListings";
import { usePetshopDiscovery } from "../../petshop/hooks/usePetshopQueries";
import {
  toCaregiverDisplay,
  toCommunityDisplay,
  toOwnerRequestDisplay
} from "../../listings/utils/adapters";
import { isOwnerRequestListing } from "../../listings/utils/listingGuards";
import { SkeletonBox } from "../../../shared/ui/SkeletonBox";
import { useSessionStore } from "../../auth/store/sessionStore";

type SessionUser = {
  id: string;
  fullName: string;
  email: string;
  city: string | null;
  district: string | null;
  avatar: string | null;
  profileCompletion: number;
};

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────

export function HomeDashboardScreen() {
  const user = useSessionStore((s) => s.user) as SessionUser | null;
  const insets = useSafeAreaInsets();

  const caregiverQuery = useListings({ type: "SITTING" });
  const caregiverListings = (caregiverQuery.data ?? []).slice(0, 6).map(toCaregiverDisplay);

  const ownerQuery = useListings({ type: "HELP_REQUEST" });
  const ownerRequests = (ownerQuery.data ?? [])
    .filter(isOwnerRequestListing)
    .slice(0, 4)
    .map(toOwnerRequestDisplay);

  const communityQuery = useCommunityListings();
  const communityPosts = (communityQuery.data ?? []).slice(0, 4).map(toCommunityDisplay);

  const petshopQuery = usePetshopDiscovery();
  const petshopCampaigns = (petshopQuery.data ?? []).slice(0, 4);

  const refreshing =
    (caregiverQuery.isFetching || ownerQuery.isFetching ||
     communityQuery.isFetching || petshopQuery.isFetching) &&
    !caregiverQuery.isLoading && !ownerQuery.isLoading &&
    !communityQuery.isLoading && !petshopQuery.isLoading;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            void caregiverQuery.refetch();
            void ownerQuery.refetch();
            void communityQuery.refetch();
            void petshopQuery.refetch();
          }}
          tintColor={colors.textInverse}
        />
      }
    >
      {/* ─── Hero ─── */}
      <LinearGradient
        colors={["#0D9488", "#0F7A6E", "#0A5C52"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.standard }]}
      >
        {/* Top row */}
        <View style={styles.heroTopRow}>
          <View style={styles.heroAvatarRow}>
            <View style={styles.avatarRing}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {(user?.fullName ?? "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </LinearGradient>
              )}
            </View>
            <View>
              <Text style={styles.heroGreeting}>{timeGreeting()}</Text>
              <Text style={styles.heroName}>
                {user?.fullName?.split(" ")[0] ?? "Kullanıcı"}
              </Text>
              {user?.city ? (
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.locationText}>
                    {user.district ? `${user.district}, ${user.city}` : user.city}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.heroButtons}>
            <Link href={routes.app.messages} asChild>
              <Pressable style={styles.heroIconBtn}>
                <MaterialCommunityIcons name="bell-outline" size={20} color="rgba(255,255,255,0.9)" />
              </Pressable>
            </Link>
            <Link href={routes.app.profileSettings} asChild>
              <Pressable style={styles.heroIconBtn}>
                <MaterialCommunityIcons name="cog-outline" size={20} color="rgba(255,255,255,0.9)" />
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="paw"
            label="Bakıcılar"
            color="#2DD4BF"
            onPress={() => router.push(routes.app.explore)}
          />
          <QuickAction
            icon="account-search"
            label="Talepler"
            color="#F97316"
            onPress={() =>
              router.push({ pathname: "/(app)/(tabs)/explore", params: { tab: "owner-requests" } })
            }
          />
          <QuickAction
            icon="hand-heart"
            label="Topluluk"
            color="#A78BFA"
            onPress={() => router.push(routes.app.community)}
          />
          <QuickAction
            icon="storefront"
            label="Petshop"
            color="#34D399"
            onPress={() => router.push(routes.app.petshop)}
          />
        </View>
      </LinearGradient>

      {/* ─── İçerik ─── */}
      <View style={styles.body}>

        {/* Bakıcı İlanları */}
        <Section
          title="Bakıcı İlanları"
          label="SİZİN İÇİN"
          href={routes.app.explore}
        >
          {caregiverQuery.isLoading ? (
            <CardSkeleton />
          ) : caregiverListings.length > 0 ? (
            <HScroll>
              {caregiverListings.map((item) => (
                <CaregiverCard
                  key={item.id}
                  name={item.caretakerName}
                  location={item.city}
                  price={item.budget}
                  schedule={item.schedule}
                  imageUri={item.coverImageUri}
                  verified={item.verificationState === "verified"}
                  onPress={() => router.push(routeBuilders.caregiverListingDetail(item.id))}
                />
              ))}
            </HScroll>
          ) : (
            <EmptyCard icon="paw-outline" message="Henüz bakıcı ilanı yok." />
          )}
        </Section>

        {/* Yakındaki Talepler */}
        <Section
          title="Yakındaki Talepler"
          label="KOMŞU"
          href={routes.app.explore}
        >
          {ownerQuery.isLoading ? (
            <CardSkeleton />
          ) : ownerRequests.length > 0 ? (
            <HScroll>
              {ownerRequests.map((item) => (
                <RequestCard
                  key={item.id}
                  title={item.title}
                  petType={item.petType}
                  location={item.city}
                  date={item.dateLabel}
                  budget={item.budget}
                  imageUri={item.coverImageUri}
                  onPress={() => router.push(routeBuilders.ownerRequestDetail(item.id))}
                />
              ))}
            </HScroll>
          ) : (
            <EmptyCard icon="dog-side" message="Yakında bakıcı arayan yok." />
          )}
        </Section>

        {/* Topluluk */}
        <Section
          title="Topluluk"
          label="NABIZ"
          href={routes.app.community}
        >
          {communityQuery.isLoading ? (
            <CardSkeleton />
          ) : communityPosts.length > 0 ? (
            <HScroll>
              {communityPosts.map((item) => (
                <CommunityCard
                  key={item.id}
                  title={item.title}
                  author={item.author}
                  category={item.category}
                  date={item.dateLabel}
                  imageUri={item.imageUri}
                  onPress={() => router.push(routeBuilders.communityPostDetail(item.id))}
                />
              ))}
            </HScroll>
          ) : (
            <EmptyCard icon="hand-heart-outline" message="Henüz topluluk paylaşımı yok." />
          )}
        </Section>

        {/* Petshop Kampanyaları */}
        <Section
          title="Kampanyalar"
          label="PETSHOP"
          href={routes.app.petshop}
        >
          {petshopQuery.isLoading ? (
            <CardSkeleton />
          ) : petshopCampaigns.length > 0 ? (
            <HScroll>
              {petshopCampaigns.map((item) => (
                <CampaignCard
                  key={item.id}
                  title={item.title}
                  storeName={item.storeName}
                  discount={item.discount}
                  deadline={item.deadline}
                  campaignLabel={item.campaignLabel}
                  imageUri={item.coverImageUri}
                  onPress={() => router.push(routeBuilders.petshopCampaignDetail(item.id))}
                />
              ))}
            </HScroll>
          ) : (
            <EmptyCard icon="tag-outline" message="Aktif kampanya yok." />
          )}
        </Section>

      </View>
    </ScrollView>
  );
}

// ─── Yardımcı Fonksiyon ───────────────────────────────────────────────────────

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Günaydın ☀️";
  if (h < 17) return "İyi günler 👋";
  return "İyi akşamlar 🌙";
}

// ─── Alt Bileşenler ───────────────────────────────────────────────────────────

function QuickAction({
  color,
  icon,
  label,
  onPress
}: {
  color: string;
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + "25" }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function Section({
  children,
  href,
  label,
  title
}: {
  children: ReactNode;
  href: any;
  label: string;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionLabel}>{label}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Link href={href} asChild>
          <Pressable style={styles.seeAll}>
            <Text style={styles.seeAllText}>Tümü</Text>
            <MaterialCommunityIcons name="arrow-right" size={14} color={colors.primary} />
          </Pressable>
        </Link>
      </View>
      {children}
    </View>
  );
}

function HScroll({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hScrollContent}
      style={styles.hScroll}
    >
      {children}
    </ScrollView>
  );
}

function CaregiverCard({
  imageUri,
  location,
  name,
  onPress,
  price,
  schedule,
  verified
}: {
  imageUri?: string;
  location: string;
  name: string;
  onPress: () => void;
  price?: string;
  schedule?: string;
  verified: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.93 }]}
      onPress={onPress}
    >
      {/* Image */}
      <View style={styles.cardImageArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.cardImageBg} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[colors.primarySoft, colors.backgroundAccent]}
            style={styles.cardImageBg}
          >
            <MaterialCommunityIcons name="account" size={44} color={colors.primary} />
          </LinearGradient>
        )}
        {verified && (
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={14} color={colors.success} />
          </View>
        )}
        {price ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{price}</Text>
          </View>
        ) : null}
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{name}</Text>
        <View style={styles.cardMeta}>
          <MaterialCommunityIcons name="map-marker-outline" size={12} color={colors.textTertiary} />
          <Text style={styles.cardMetaText} numberOfLines={1}>{location}</Text>
        </View>
        {schedule ? (
          <View style={[styles.cardTag, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.cardTagText, { color: colors.primary }]}>{schedule}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function RequestCard({
  budget,
  date,
  imageUri,
  location,
  onPress,
  petType,
  title
}: {
  budget?: string;
  date?: string;
  imageUri?: string;
  location: string;
  onPress: () => void;
  petType: string;
  title: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.93 }]}
      onPress={onPress}
    >
      <View style={styles.cardImageArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.cardImageBg} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={["#FFF7ED", "#FFFBEB"]}
            style={styles.cardImageBg}
          >
            <MaterialCommunityIcons name="paw" size={40} color={colors.warning} />
          </LinearGradient>
        )}
        <View style={[styles.priceBadge, { backgroundColor: colors.warningSoft }]}>
          <Text style={[styles.priceBadgeText, { color: colors.warning }]}>{petType}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.cardMeta}>
          <MaterialCommunityIcons name="map-marker-outline" size={12} color={colors.textTertiary} />
          <Text style={styles.cardMetaText}>{location}</Text>
        </View>
        <View style={styles.cardTagRow}>
          {date ? (
            <View style={[styles.cardTag, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.cardTagText, { color: colors.textSubtle }]}>{date}</Text>
            </View>
          ) : null}
          {budget ? (
            <View style={[styles.cardTag, { backgroundColor: colors.successSoft }]}>
              <Text style={[styles.cardTagText, { color: colors.success }]}>{budget}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function CommunityCard({
  author,
  category,
  date,
  imageUri,
  onPress,
  title
}: {
  author: string;
  category: string;
  date: string;
  imageUri?: string;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.93 }]}
      onPress={onPress}
    >
      <View style={styles.cardImageArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.cardImageBg} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={["#F0FDF4", "#ECFDF5"]}
            style={styles.cardImageBg}
          >
            <MaterialCommunityIcons name="hand-heart" size={40} color={colors.success} />
          </LinearGradient>
        )}
        <View style={[styles.priceBadge, { backgroundColor: colors.successSoft }]}>
          <Text style={[styles.priceBadgeText, { color: colors.success }]}>{category}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.cardMeta}>
          <MaterialCommunityIcons name="account-outline" size={12} color={colors.textTertiary} />
          <Text style={styles.cardMetaText}>{author}</Text>
        </View>
        <View style={[styles.cardTag, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.cardTagText, { color: colors.textSubtle }]}>{date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function CampaignCard({
  campaignLabel,
  deadline,
  discount,
  imageUri,
  onPress,
  storeName,
  title
}: {
  campaignLabel: string;
  deadline: string;
  discount: string;
  imageUri?: string;
  onPress: () => void;
  storeName: string;
  title: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.93 }]}
      onPress={onPress}
    >
      <View style={styles.cardImageArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.cardImageBg} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={["#FFF7ED", "#FFFBEB"]}
            style={styles.cardImageBg}
          >
            <MaterialCommunityIcons name="tag" size={40} color={colors.accent} />
          </LinearGradient>
        )}
        <View style={[styles.discountBadge]}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardStore}>{storeName}</Text>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.cardTagRow}>
          <View style={[styles.cardTag, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.cardTagText, { color: colors.accent }]}>{campaignLabel}</Text>
          </View>
          <View style={[styles.cardTag, { backgroundColor: colors.surfaceMuted }]}>
            <Text style={[styles.cardTagText, { color: colors.textSubtle }]}>{deadline}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CardSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.hScrollContent}
      style={styles.hScroll}
    >
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <SkeletonBox style={styles.skeletonImg} />
          <View style={styles.skeletonBody}>
            <SkeletonBox style={{ height: 14, width: "70%", borderRadius: 7, backgroundColor: colors.surfaceMuted }} />
            <SkeletonBox style={{ height: 11, width: "50%", borderRadius: 6, backgroundColor: colors.surfaceMuted }} />
            <SkeletonBox style={{ height: 22, width: "40%", borderRadius: 11, backgroundColor: colors.surfaceMuted }} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function EmptyCard({ icon, message }: { icon: string; message: string }) {
  return (
    <View style={styles.emptyCard}>
      <MaterialCommunityIcons name={icon as any} size={28} color={colors.textTertiary} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const CARD_WIDTH = 188;

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  scrollContent: {
    paddingBottom: 110
  },

  // Hero
  hero: {
    paddingHorizontal: spacing.comfortable,
    paddingBottom: spacing.section
  },
  heroTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.section
  },
  heroAvatarRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  avatarRing: {
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: radius.full,
    borderWidth: 2,
    padding: 2
  },
  avatar: {
    alignItems: "center",
    borderRadius: radius.full,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: "800"
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "500"
  },
  heroName: {
    color: colors.textInverse,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 1
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginTop: 2
  },
  locationText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    fontWeight: "500"
  },
  heroButtons: {
    flexDirection: "row",
    gap: spacing.tight,
    marginTop: spacing.micro
  },
  heroIconBtn: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.medium,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },

  // Quick actions
  quickActions: {
    flexDirection: "row",
    gap: spacing.tight
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
    gap: spacing.micro
  },
  quickActionIcon: {
    alignItems: "center",
    borderRadius: radius.large,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  quickActionLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "600"
  },

  // Body
  body: {
    gap: spacing.section,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.section
  },

  // Section
  section: {
    gap: spacing.standard
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 1
  },
  seeAll: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2
  },
  seeAllText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600"
  },

  // Horizontal scroll
  hScroll: {
    marginHorizontal: -spacing.comfortable
  },
  hScrollContent: {
    gap: spacing.compact,
    paddingHorizontal: spacing.comfortable
  },

  // Card
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden",
    width: CARD_WIDTH
  },
  cardImageArea: {
    alignItems: "center",
    height: 140,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative"
  },
  cardImageBg: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  verifiedBadge: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    bottom: spacing.compact,
    left: spacing.compact,
    padding: 3,
    position: "absolute"
  },
  priceBadge: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    bottom: spacing.compact,
    paddingHorizontal: spacing.compact,
    paddingVertical: 4,
    position: "absolute",
    right: spacing.compact
  },
  priceBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700"
  },
  discountBadge: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    bottom: spacing.compact,
    paddingHorizontal: spacing.compact,
    paddingVertical: 4,
    position: "absolute",
    right: spacing.compact
  },
  discountText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "800"
  },
  cardBody: {
    gap: spacing.tight,
    padding: spacing.compact
  },
  cardStore: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 19
  },
  cardMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3
  },
  cardMetaText: {
    color: colors.textTertiary,
    fontSize: 11,
    fontWeight: "500"
  },
  cardTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4
  },
  cardTag: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.compact,
    paddingVertical: 3
  },
  cardTagText: {
    fontSize: 10,
    fontWeight: "600"
  },

  // Skeleton
  skeletonCard: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    overflow: "hidden",
    width: CARD_WIDTH
  },
  skeletonImg: {
    backgroundColor: colors.surfaceMuted,
    height: 140
  },
  skeletonBody: {
    gap: spacing.tight,
    padding: spacing.compact
  },

  // Empty
  emptyCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    gap: spacing.compact,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.comfortable,
    ...shadows.micro
  },
  emptyText: {
    color: colors.textSubtle,
    fontSize: 14,
    fontWeight: "500"
  }
});
