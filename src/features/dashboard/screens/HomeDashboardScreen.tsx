import { Link } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import {
  caregiverListings,
  communityPosts,
  ownerRequests,
  petshopCampaigns
} from "../../../shared/mocks/marketplace";
import { conversations } from "../../../shared/mocks/messages";
import { applicationItems } from "../../../shared/mocks/profile";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ModeOverviewCard } from "../../../shared/ui/ModeOverviewCard";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { QuickActionCard } from "../../../shared/ui/QuickActionCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { ConversationPreviewCard } from "../../messages/components/ConversationPreviewCard";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  getCaregiverActionLabel,
  getCaregiverCompletion,
  getCaregiverModePresentation,
  getPetshopActionLabel,
  getPetshopCompletion,
  getPetshopModePresentation,
  normalizeCaregiverProfile,
  normalizePetshopProfile
} from "../../profile/utils/modeStatus";

export function HomeDashboardScreen() {
  const user = useSessionStore((state) => state.user);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const caregiverProfile = useSessionStore((state) => state.caregiverProfile);
  const petshopProfile = useSessionStore((state) => state.petshopProfile);
  const caregiverPresentation = getCaregiverModePresentation(caregiverStatus);
  const petshopPresentation = getPetshopModePresentation(petshopStatus);
  const caregiverProgress = getCaregiverCompletion(
    normalizeCaregiverProfile(caregiverProfile, {
      city: user?.city,
      district: user?.district
    })
  );
  const petshopProgress = getPetshopCompletion(
    normalizePetshopProfile(petshopProfile, {
      email: user?.email,
      fullName: user?.fullName
    })
  );
  const unreadConversations = conversations.filter((item) => item.unreadCount > 0);
  const unreadCount = unreadConversations.reduce(
    (total, item) => total + item.unreadCount,
    0
  );
  const pendingApplications = applicationItems.filter((item) => item.status === "pending");

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <HomeHeader unreadCount={unreadCount} user={user} />

      <VisualHero
        description="Uygulama uzerindeki tum kontrolun ve aktif rollerin bu merkezde toplanir."
        icon="view-dashboard"
        title={`Merhaba${user ? `, ${user.fullName.split(" ")[0]}` : ""}`}
      />

      <View style={styles.summarySection}>
        <InfoCard
          description="Bugunun kritik gelismeleri ve profil hazirlik durumun."
          title="Gunluk Ozet"
          variant="accent"
        >
          <View style={styles.badgeRow}>
            <ModeBadge label={`${user?.profileCompletion ?? 0}% Profil`} tone="primary" />
            <ModeBadge label={`${pendingApplications.length} Bekleyen`} tone="warning" />
            <ModeBadge label={`${unreadCount} Mesaj`} tone="success" />
          </View>
        </InfoCard>
      </View>

      <DashboardSection title="Aktif Modlariniz">
        <View style={styles.modeGrid}>
          <ModeOverviewCard
            actionHref={routes.app.profileModes}
            actionLabel={getCaregiverActionLabel(caregiverStatus)}
            completion={caregiverProgress}
            description={caregiverPresentation.description}
            icon={caregiverPresentation.icon}
            statusLabel={caregiverPresentation.label}
            statusTone={mapModeBadgeTone(caregiverPresentation.tone)}
            title="Bakici Modu"
          />
          <ModeOverviewCard
            actionHref={routes.app.profileModes}
            actionLabel={getPetshopActionLabel(petshopStatus)}
            completion={petshopProgress}
            description={petshopPresentation.description}
            icon={petshopPresentation.icon}
            statusLabel={petshopPresentation.label}
            statusTone={mapModeBadgeTone(petshopPresentation.tone)}
            title="Petshop Modu"
          />
        </View>
      </DashboardSection>

      <DashboardSection title="Hizli Aksiyonlar">
        <ScrollView
          contentContainerStyle={styles.horizontalScrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <QuickActionCard
            description="Yeni bakici ilani hazirla"
            href={routes.app.create}
            icon="plus-circle-outline"
            title="Ilan Olustur"
          />
          <QuickActionCard
            description="Bakicilari incele"
            href={routes.app.explore}
            icon="compass-outline"
            title="Bakici Ara"
          />
          <QuickActionCard
            description="Duyuru paylas"
            href={routes.app.community}
            icon="hand-heart-outline"
            title="Paylasim Yap"
          />
          <QuickActionCard
            description="Kampanyalari gor"
            href={routes.app.explore}
            icon="storefront-outline"
            title="Petshoplar"
          />
        </ScrollView>
      </DashboardSection>

      <DashboardSection title="Sizin Icin Sectiklerimiz">
        <ScrollView
          contentContainerStyle={styles.horizontalScrollContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {caregiverListings.map((listing) => (
            <View key={listing.id} style={styles.horizontalCard}>
              <ListingCard
                actions={
                  <Link href={routeBuilders.caregiverListingDetail(listing.id)} asChild>
                    <AppButton label="Detaya Git" variant="secondary" />
                  </Link>
                }
                badges={[
                  { icon: "calendar-range", label: listing.schedule, tone: "primary" },
                  { icon: "star", label: listing.badge, tone: "warning" }
                ]}
                description={listing.summary}
                location={listing.city}
                priceLabel={listing.budget}
                title={listing.caretakerName}
              />
            </View>
          ))}
        </ScrollView>
      </DashboardSection>

      <DashboardSection title="Yakininizdaki Talepler">
        <View style={styles.list}>
          {ownerRequests.slice(0, 3).map((request) => (
            <ListingCard
              key={request.id}
              actions={
                <Link href={routeBuilders.ownerRequestDetail(request.id)} asChild>
                  <AppButton label="Incele" variant="secondary" />
                </Link>
              }
              badges={[
                { icon: "paw", label: request.petType, tone: "primary" },
                { icon: "map-marker", label: request.distanceLabel, tone: "warning" }
              ]}
              description={request.summary}
              location={`${request.city} • ${request.schedule}`}
              priceLabel={request.budget}
              title={request.title}
              verificationState="pending"
            />
          ))}
        </View>
        <AppButton label="Tumunu Gor" variant="ghost" />
      </DashboardSection>

      <DashboardSection title="Topluluk Nabzi">
        <View style={styles.list}>
          {communityPosts.slice(0, 2).map((post) => (
            <CommunityCard
              key={post.id}
              author={post.author}
              category={post.category}
              dateLabel={post.dateLabel}
              description={post.summary}
              location={post.city}
              title={post.title}
            />
          ))}
        </View>
        <AppButton label="Topluluga Git" variant="ghost" />
      </DashboardSection>

      <DashboardSection title="Okunmamis Mesajlar">
        {unreadConversations.length > 0 ? (
          <View style={styles.list}>
            {unreadConversations.map((conversation) => (
              <ConversationPreviewCard
                key={conversation.id}
                href={{
                  pathname: "/(app)/messages/[conversationId]",
                  params: { conversationId: conversation.id }
                }}
                lastMessage={conversation.lastMessage}
                listingTitle={conversation.listingTitle}
                listingType={conversation.listingType}
                participantName={conversation.participantName}
                unreadCount={conversation.unreadCount}
                updatedAt={conversation.updatedAt}
              />
            ))}
          </View>
        ) : (
          <InfoCard
            description="Tum mesajlar okundu. Yeni bir bildirim geldiginde burada gorebilirsiniz."
            title="Yeni Mesajiniz Yok"
          />
        )}
      </DashboardSection>

      <DashboardSection title="One Cikan Kampanya">
        {petshopCampaigns.slice(0, 1).map((campaign) => (
          <PetshopCampaignCard
            key={campaign.id}
            actionSlot={
              <Link href={routeBuilders.petshopCampaignDetail(campaign.id)} asChild>
                <AppButton label="Kampanyayi Gor" variant="secondary" />
              </Link>
            }
            campaignLabel={campaign.campaignLabel}
            deadline={campaign.deadline}
            description={campaign.summary}
            priceLabel={campaign.priceLabel}
            storeName={campaign.storeName}
            title={campaign.title}
            visualLabel={campaign.visualLabel}
          />
        ))}
      </DashboardSection>
    </ScreenContainer>
  );
}

function HomeHeader({ user, unreadCount }: { user: any; unreadCount: number }) {
  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.fullName?.[0] || "U"}</Text>
        </View>
        <View>
          <Text style={styles.greeting}>Hos Geldin,</Text>
          <Text style={styles.userName}>{user?.fullName || "Kullanici"}</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <Link href={routes.app.messages} asChild>
          <Pressable style={styles.iconButton}>
            <AppIcon name="bell-outline" size={24} />
            {unreadCount > 0 && <View style={styles.notifBadge} />}
          </Pressable>
        </Link>
        <Link href={routes.app.profile} asChild>
          <Pressable style={styles.iconButton}>
            <AppIcon name="cog-outline" size={24} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

type DashboardSectionProps = {
  children: ReactNode;
  title: string;
};

function DashboardSection({ children, title }: DashboardSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function mapModeBadgeTone(tone: string): "muted" | "success" | "warning" {
  if (tone === "success") return "success";
  if (tone === "warning") return "warning";
  return "muted";
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.medium,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarText: {
    color: colors.primary,
    ...typography.h3
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
  greeting: {
    color: colors.textMuted,
    ...typography.caption
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.tight,
    paddingHorizontal: spacing.micro
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.compact
  },
  horizontalCard: {
    width: 300
  },
  horizontalScroll: {
    marginHorizontal: -spacing.comfortable
  },
  horizontalScrollContent: {
    gap: spacing.compact,
    paddingHorizontal: spacing.comfortable
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.medium,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  list: {
    gap: spacing.compact
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  notifBadge: {
    backgroundColor: colors.error,
    borderRadius: 5,
    height: 10,
    position: "absolute",
    right: 12,
    top: 12,
    width: 10
  },
  section: {
    gap: spacing.standard
  },
  sectionTitle: {
    color: colors.text,
    paddingHorizontal: spacing.micro,
    ...typography.h2
  },
  summarySection: {
    marginTop: -spacing.tight
  },
  userName: {
    color: colors.text,
    ...typography.h3
  },
  userSection: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  }
});
