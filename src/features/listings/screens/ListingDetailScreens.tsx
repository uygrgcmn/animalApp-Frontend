import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import {
  caregiverListingDetails,
  getSimilarCaregiverListings,
  getSimilarOwnerRequests,
  getSimilarPetshopCampaigns,
  ownerRequestDetails,
  petshopCampaignDetails
} from "../../../shared/mocks/listingDetails";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";
import { useSessionStore } from "../../auth/store/sessionStore";
import { ActionGateSheet } from "../components/ActionGateSheet";
import {
  getCaregiverMissingItems,
  getCaregiverModePresentation,
  getPetshopMissingItems,
  getPetshopModePresentation,
  normalizeCaregiverProfile,
  normalizePetshopProfile
} from "../../profile/utils/modeStatus";

type GateConfig = {
  ctaLabel: string;
  ctaRoute: typeof routes.app.caregiverActivation | typeof routes.app.petshopActivation;
  description: string;
  icon: React.ComponentProps<typeof AppIcon>["name"];
  missingItems: string[];
  reasonLabel: string;
  reasonTone: "warning" | "error" | "info" | "neutral";
  title: string;
};

type GateState = GateConfig & {
  closeGate: () => void;
  isReady: boolean;
  openGate: () => void;
  visible: boolean;
};

type SharedDetailProps = {
  actionSlot?: React.ReactNode;
  basicInfo: {
    icon: React.ComponentProps<typeof AppIcon>["name"];
    label: string;
    tone?: "primary" | "success" | "warning" | "neutral";
  }[];
  description: string[];
  emptyTitle: string;
  notFoundDescription: string;
  owner: {
    description: string;
    headline: string;
    location: string;
    name: string;
  };
  ownerTitle: string;
  primaryActionLabel: string;
  primaryActionUsesGate?: boolean;
  similarListings: React.ReactNode;
  stickyGate?: GateState | null;
  subtitle: string;
  title: string;
  trustSignals: {
    description: string;
    label: string;
    state: "verified" | "pending" | "rejected" | "unverified";
  }[];
};

export function CaregiverListingDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const detail = caregiverListingDetails[params.listingId];
  const similar = detail ? getSimilarCaregiverListings(detail.similarIds) : [];
  const gate = useCaregiverGate({
    fallbackTitle: "Bu ilana basvurmak icin bakici modu hazir olmali."
  });

  if (!detail) {
    return <MissingDetailState description="Bakici ilani bulunamadi." title="Ilan detayi" />;
  }

  return (
    <ListingDetailLayout
      basicInfo={detail.info}
      description={detail.description}
      emptyTitle="Benzer bakici ilani yok"
      notFoundDescription="Bakici ilani bulunamadi."
      owner={detail.owner}
      ownerTitle="Ilan sahibi ozeti"
      primaryActionLabel="Basvur"
      similarListings={
        similar.length > 0 ? (
          <View style={styles.list}>
            {similar.map((item) => (
              <Link href={routeBuilders.caregiverListingDetail(item.id)} key={item.id} asChild>
                <Pressable>
                  <ListingCard
                    avatarLabel={item.avatarLabel}
                    badges={[
                      { icon: "calendar-range", label: item.schedule, tone: "primary" },
                      { icon: "star-four-points-circle", label: item.badge, tone: "warning" }
                    ]}
                    description={item.summary}
                    location={item.city}
                    priceLabel={item.budget}
                    subtitle={item.title}
                    title={item.caretakerName}
                    verificationState={item.verificationState}
                  />
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null
      }
      stickyGate={gate}
      subtitle={detail.subtitle}
      title={detail.title}
      trustSignals={detail.trustSignals}
    />
  );
}

export function OwnerRequestDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const detail = ownerRequestDetails[params.listingId];
  const similar = detail ? getSimilarOwnerRequests(detail.similarIds) : [];
  const gate = useCaregiverGate({
    fallbackTitle: "Bu talebe basvurmak icin bakici modu hazir olmali."
  });

  if (!detail) {
    return <MissingDetailState description="Bakici arayan ilani bulunamadi." title="Ilan detayi" />;
  }

  return (
    <ListingDetailLayout
      basicInfo={detail.info}
      description={detail.description}
      emptyTitle="Benzer talep bulunmuyor"
      notFoundDescription="Bakici arayan ilani bulunamadi."
      owner={detail.owner}
      ownerTitle="Ilan sahibi ozeti"
      primaryActionLabel="Basvur"
      similarListings={
        similar.length > 0 ? (
          <View style={styles.list}>
            {similar.map((item) => (
              <Link href={routeBuilders.ownerRequestDetail(item.id)} key={item.id} asChild>
                <Pressable style={styles.relatedCard}>
                  <Text style={styles.relatedTitle}>{item.title}</Text>
                  <Text style={styles.relatedDescription}>{item.summary}</Text>
                  <View style={styles.metaRow}>
                    <MetaPill icon="paw-outline" label={item.petType} tone="primary" />
                    <MetaPill icon="calendar-range" label={item.dateLabel} tone="warning" />
                    <MetaPill icon="cash" label={item.budget} tone="success" />
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null
      }
      stickyGate={gate}
      subtitle={detail.subtitle}
      title={detail.title}
      trustSignals={detail.trustSignals}
    />
  );
}

export function PetshopCampaignDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const detail = petshopCampaignDetails[params.listingId];
  const similar = detail ? getSimilarPetshopCampaigns(detail.similarIds) : [];
  const gate = usePetshopGate();

  if (!detail) {
    return <MissingDetailState description="Petshop kampanyasi bulunamadi." title="Kampanya detayi" />;
  }

  return (
    <ListingDetailLayout
      actionSlot={
        <InfoCard
          description={detail.managementNote}
          title="Yonetici islemleri"
          variant="accent"
        >
          <AppButton
            label="Magaza Profiline Git"
            leftSlot={<AppIcon backgrounded={false} name="storefront-outline" size={18} />}
            onPress={() => {
              router.push(routeBuilders.petshopStoreProfile(detail.storeId));
            }}
            variant="secondary"
          />
          <AppButton
            label="Kampanyayi Yonet"
            leftSlot={
              <AppIcon
                backgrounded={false}
                color="#FFFFFF"
                name="store-cog-outline"
                size={18}
              />
            }
            onPress={() => {
              if (gate.isReady) {
                router.push(routes.app.petshopCampaignManagement);
                return;
              }

              gate.openGate();
            }}
          />
        </InfoCard>
      }
      basicInfo={detail.info}
      description={detail.description}
      emptyTitle="Benzer kampanya bulunmuyor"
      notFoundDescription="Petshop kampanyasi bulunamadi."
      owner={detail.owner}
      ownerTitle="Magaza ozeti"
      primaryActionLabel="Iletisime Gec"
      similarListings={
        similar.length > 0 ? (
          <View style={styles.list}>
            {similar.map((item) => (
              <Link href={routeBuilders.petshopCampaignDetail(item.id)} key={item.id} asChild>
                <Pressable>
                  <PetshopCampaignCard
                    campaignLabel={item.campaignLabel}
                    deadline={item.deadline}
                    description={item.summary}
                    priceLabel={`${item.discount} • ${item.priceLabel}`}
                    storeName={item.storeName}
                    title={item.title}
                    visualLabel={item.visualLabel}
                  />
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null
      }
      primaryActionUsesGate={false}
      stickyGate={gate}
      subtitle={detail.subtitle}
      title={detail.title}
      trustSignals={detail.trustSignals}
    />
  );
}

function ListingDetailLayout({
  actionSlot,
  basicInfo,
  description,
  emptyTitle,
  notFoundDescription,
  owner,
  ownerTitle,
  primaryActionLabel,
  primaryActionUsesGate = true,
  similarListings,
  stickyGate,
  subtitle,
  title,
  trustSignals
}: SharedDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader description={subtitle} showBackButton title={title} />

        <InfoCard description="Temel bilgiler bir bakista gorunur." title="Baslik alani">
          <View style={styles.metaRow}>
            {basicInfo.map((item) => (
              <MetaPill key={`${item.icon}-${item.label}`} {...item} />
            ))}
          </View>
        </InfoCard>

        <InfoCard description="Ilanin acik kapsami ve beklentileri." title="Aciklama">
          <View style={styles.textList}>
            {description.map((paragraph) => (
              <Text key={paragraph} style={styles.supportingText}>
                {paragraph}
              </Text>
            ))}
          </View>
        </InfoCard>

        <InfoCard description={owner.headline} title={ownerTitle}>
          <View style={styles.ownerHeader}>
            <View style={styles.ownerBadge}>
              <AppIcon name="account-outline" size={22} />
            </View>
            <View style={styles.ownerTexts}>
              <Text style={styles.ownerName}>{owner.name}</Text>
              <Text style={styles.ownerLocation}>{owner.location}</Text>
            </View>
          </View>
          <Text style={styles.supportingText}>{owner.description}</Text>
        </InfoCard>

        <InfoCard
          description="Dogrulama sinyalleri ve guven notlari burada toplanir."
          title="Guven / dogrulama gostergeleri"
        >
          <View style={styles.list}>
            {trustSignals.map((signal) => (
              <View key={signal.label} style={styles.trustRow}>
                <VerificationBadge state={signal.state} />
                <View style={styles.trustTexts}>
                  <Text style={styles.trustTitle}>{signal.label}</Text>
                  <Text style={styles.trustDescription}>{signal.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </InfoCard>

        {actionSlot}

        <InfoCard description="Benzer yapidaki ilanlar hizli karsilastirma icin listelenir." title="Benzer ilanlar">
          {similarListings ?? (
            <EmptyState
              description={notFoundDescription}
              icon="cards-outline"
              title={emptyTitle}
            />
          )}
        </InfoCard>
      </ScrollView>

      <StickyBottomActionBar>
        <AppButton
          label={isApplied ? "Basvuru Hazir" : primaryActionLabel}
          leftSlot={
            <AppIcon
              backgrounded={false}
              color="#FFFFFF"
              name="send-outline"
              size={18}
            />
          }
          onPress={() => {
            if (stickyGate && primaryActionUsesGate) {
              stickyGate.openGate();
              return;
            }

            setIsApplied(true);
          }}
        />
        <Link href={routes.app.messages} asChild>
          <AppButton
            label="Mesaj Gonder"
            leftSlot={<AppIcon backgrounded={false} name="message-text-outline" size={18} />}
            variant="secondary"
          />
        </Link>
        <AppButton
          label={isSaved ? "Kaydedildi" : "Kaydet"}
          leftSlot={<AppIcon backgrounded={false} name="bookmark-outline" size={18} />}
          onPress={() => {
            setIsSaved((current) => !current);
          }}
          variant="ghost"
        />
      </StickyBottomActionBar>

      {stickyGate ? (
        <ActionGateSheet
          ctaLabel={stickyGate.ctaLabel}
          description={stickyGate.description}
          icon={stickyGate.icon}
          missingItems={stickyGate.missingItems}
          onClose={stickyGate.closeGate}
          onCtaPress={() => {
            stickyGate.closeGate();
            router.push(stickyGate.ctaRoute);
          }}
          reasonLabel={stickyGate.reasonLabel}
          reasonTone={stickyGate.reasonTone}
          title={stickyGate.title}
          visible={stickyGate.visible}
        />
      ) : null}
    </SafeAreaView>
  );
}

function useCaregiverGate({
  fallbackTitle
}: {
  fallbackTitle: string;
}) {
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const caregiverProfile = useSessionStore((state) => state.caregiverProfile);
  const user = useSessionStore((state) => state.user);
  const [visible, setVisible] = useState(false);
  const normalizedProfile = useMemo(
    () =>
      normalizeCaregiverProfile(caregiverProfile, {
        city: user?.city,
        district: user?.district
      }),
    [caregiverProfile, user?.city, user?.district]
  );
  const missingItems = getCaregiverMissingItems(normalizedProfile);
  const presentation = getCaregiverModePresentation(caregiverStatus);

  if (caregiverStatus === "active") {
    return null;
  }

  return {
    closeGate: () => setVisible(false),
    ctaLabel: "Bakici Modunu Tamamla",
    ctaRoute: routes.app.caregiverActivation,
    description:
      caregiverStatus === "inactive"
        ? "Basvuru akisini acabilmek icin once bakici modunu baslatman gerekiyor."
        : "Bakici modun olusmus ancak basvuruya cikmak icin bazi alanlarin tamamlanmasi gerekiyor.",
    icon: presentation.icon,
    isReady: false,
    missingItems:
      missingItems.length > 0
        ? missingItems
        : ["Deneyim", "Hizmet turleri", "Uygunluk", "Profil aciklamasi"],
    openGate: () => setVisible(true),
    reasonLabel: presentation.label,
    reasonTone: presentation.tone === "warning" ? "warning" : "neutral",
    title: fallbackTitle,
    visible
  } satisfies GateState;
}

function usePetshopGate() {
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const petshopProfile = useSessionStore((state) => state.petshopProfile);
  const user = useSessionStore((state) => state.user);
  const [visible, setVisible] = useState(false);
  const normalizedProfile = useMemo(
    () =>
      normalizePetshopProfile(petshopProfile, {
        email: user?.email,
        fullName: user?.fullName
      }),
    [petshopProfile, user?.email, user?.fullName]
  );
  const missingItems = getPetshopMissingItems(normalizedProfile);
  const presentation = getPetshopModePresentation(petshopStatus);

  return {
    closeGate: () => setVisible(false),
    ctaLabel: "Petshop Modunu Tamamla",
    ctaRoute: routes.app.petshopActivation,
    description:
      petshopStatus === "active"
        ? "Yonetici islemleri icin petshop modun hazir."
        : petshopStatus === "in_review"
          ? "Petshop modun incelemede. Eksik bir alan varsa guncelleyip sureci hizlandirabilirsin."
          : "Kampanya yonetimi ve kisitli ticari alanlar icin dogrulanmis petshop moduna ihtiyacin var.",
    icon: presentation.icon,
    isReady: petshopStatus === "active",
    missingItems:
      petshopStatus === "active"
        ? []
        : missingItems.length > 0
          ? missingItems
          : ["Magaza bilgisi", "Dogrulama belgeleri", "Gorseller"],
    openGate: () => {
      if (petshopStatus !== "active") {
        setVisible(true);
      }
    },
    reasonLabel: presentation.label,
    reasonTone:
      presentation.tone === "error"
        ? "error"
        : presentation.tone === "warning"
          ? "warning"
          : presentation.tone === "info"
            ? "info"
            : "neutral",
    title: "Bu alani yonetmek icin petshop modu hazir olmali.",
    visible
  } satisfies GateState;
}

function MissingDetailState({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader description={description} showBackButton title={title} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  list: {
    gap: spacing.compact
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  ownerBadge: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  ownerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  ownerLocation: {
    color: colors.textSubtle,
    ...typography.caption
  },
  ownerName: {
    color: colors.text,
    ...typography.h3
  },
  ownerTexts: {
    gap: spacing.micro
  },
  relatedCard: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.standard
  },
  relatedDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  relatedTitle: {
    color: colors.text,
    ...typography.h3
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  supportingText: {
    color: colors.textMuted,
    ...typography.body
  },
  textList: {
    gap: spacing.compact
  },
  trustDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  trustRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact
  },
  trustTexts: {
    flex: 1,
    gap: spacing.micro
  },
  trustTitle: {
    color: colors.text,
    ...typography.bodyStrong
  }
});
