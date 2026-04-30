import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";
import { useBookmarkStore, type BookmarkedItem } from "../../profile/store/bookmarkStore";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  usePetshopCampaignDetail,
  usePetshopDiscovery
} from "../../petshop/hooks/usePetshopQueries";
import {
  getCaregiverMissingItems,
  getCaregiverModePresentation,
  getPetshopMissingItems,
  getPetshopModePresentation,
  normalizeCaregiverProfile,
  normalizePetshopProfile
} from "../../profile/utils/modeStatus";
import { ActionGateSheet } from "../components/ActionGateSheet";
import { ApplyModal } from "../components/ApplyModal";
import { SendMessageModal } from "../components/SendMessageModal";
import { useListingDetail, useListings } from "../hooks/useListings";
import { toCaregiverDisplay, toOwnerRequestDisplay } from "../utils/adapters";
import { isCaregiverListing, isOwnerRequestListing } from "../utils/listingGuards";
import {
  getPrimaryMediaUrl,
  parseEmbeddedListingMetadata
} from "../utils/embeddedListingMetadata";
import { formatExpiresAt } from "../../../shared/utils/formatDate";

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
  applyDone?: boolean;
  isOwnListing?: boolean;
  bookmarkPayload?: Omit<BookmarkedItem, "savedAt">;
  basicInfo: {
    icon: React.ComponentProps<typeof AppIcon>["name"];
    label: string;
    tone?: "primary" | "success" | "warning" | "neutral";
  }[];
  coverImageUri?: string;
  description: string[];
  emptyTitle: string;
  notFoundDescription: string;
  onApplyPress?: () => void;
  onMessagePress?: () => void;
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

// ─── Caregiver Listing Detail ────────────────────────────────────────────────

export function CaregiverListingDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const listingQuery = useListingDetail(params.listingId);
  const listing = listingQuery.data;
  const currentUser = useSessionStore((state) => state.user);
  const isOwnListing = Boolean(listing && currentUser && listing.creatorId === currentUser.id);
  const gate = useCaregiverGate({
    fallbackTitle: "Bu ilana başvurmak için bakıcı modu hazır olmalı."
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);

  // Similar listings from cache
  const sittingQuery = useListings({ type: "SITTING" });
  const similarListings = useMemo(
    () =>
      (sittingQuery.data ?? [])
        .filter((l) => l.id !== params.listingId)
        .slice(0, 3)
        .map(toCaregiverDisplay),
    [sittingQuery.data, params.listingId]
  );

  if (listingQuery.isLoading) {
    return <LoadingDetailState title="Bakıcı İlanı" />;
  }

  if (!listing) {
    return <MissingDetailState description="Bakıcı ilanı bulunamadı." title="İlan detayı" />;
  }

  if (!isCaregiverListing(listing)) {
    return <MissingDetailState description="Bakıcı ilanı bulunamadı." title="İlan detayı" />;
  }

  const creator = listing.creator;
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);
  const creatorLocation = [creator?.city ?? metadata.city, creator?.district ?? metadata.district].filter(Boolean).join(" / ");

  return (
    <>
      <ListingDetailLayout
        applyDone={isApplied}
        bookmarkPayload={{
          id: listing.id,
          title: listing.title,
          type: listing.type,
          location: creatorLocation || "Konum belirtilmemiş"
        }}
        basicInfo={[
          {
            icon: "map-marker-outline",
            label: creatorLocation || "Konum belirtilmemiş",
            tone: "primary"
          },
          ...(metadata.priceLabel
            ? [
                {
                  icon: "cash" as const,
                  label: metadata.priceLabel,
                  tone: "success" as const
                }
              ]
            : []),
          ...(metadata.availabilityLabel
            ? [
                {
                  icon: "calendar-range" as const,
                  label: metadata.availabilityLabel,
                  tone: "warning" as const
                }
              ]
            : []),
          ...(listing.expiresAt
            ? [
                {
                  icon: "calendar-clock-outline" as const,
                  label: formatExpiresAt(listing.expiresAt),
                  tone: "warning" as const
                }
              ]
            : []),
          ...(creator?.isSitter
            ? [
                {
                  icon: "shield-check-outline" as const,
                  label: "Doğrulanmış Bakıcı",
                  tone: "success" as const
                }
              ]
            : [])
        ]}
        coverImageUri={getPrimaryMediaUrl(metadata)}
        description={[description]}
        emptyTitle="Benzer bakıcı ilanı yok"
        notFoundDescription="Bakıcı ilanı bulunamadı."
        onApplyPress={() => setIsApplyModalOpen(true)}
        owner={{
          description: creatorLocation
            ? `${creatorLocation} bölgesinden aktif bakıcı.`
            : "Bakıcı profil bilgisi mevcut değil.",
          headline: creator?.isSitter ? "Aktif Bakıcı" : "Kullanıcı",
          location: creatorLocation || "Konum belirtilmemiş",
          name: creator?.fullName ?? "Bakıcı"
        }}
        ownerTitle="İlan sahibi özeti"
        isOwnListing={isOwnListing}
        onMessagePress={!isOwnListing ? () => setIsSendMessageModalOpen(true) : undefined}
        primaryActionLabel="Başvur"
        similarListings={
          similarListings.length > 0 ? (
            <View style={styles.list}>
              {similarListings.map((item) => (
                <Link href={routeBuilders.caregiverListingDetail(item.id)} key={item.id} asChild>
                  <Pressable>
                    <ListingCard
                      avatarLabel={item.avatarLabel}
                      badges={[
                        { icon: "map-marker-outline", label: item.schedule, tone: "primary" }
                      ]}
                      coverImageUri={item.coverImageUri}
                      description={item.summary}
                      location={item.city}
                      priceLabel={item.budget || "Fiyat belirtilmemiş"}
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
        subtitle={creatorLocation || "Bakıcı İlanı"}
        title={listing.title}
        trustSignals={[
          {
            description: creator?.isSitter
              ? "Bu kişi bakıcı profilini tamamlamış ve onaylatmıştır."
              : "Bakıcı profili doğrulama sürecindedir.",
            label: "Bakıcı Doğrulaması",
            state: creator?.isSitter ? "verified" : "pending"
          },
          {
            description:
              listing.status === "ACTIVE"
                ? "İlan şu anda aktif ve başvuru kabul ediyor."
                : "İlan aktif değil.",
            label: "İlan Durumu",
            state: listing.status === "ACTIVE" ? "verified" : "pending"
          }
        ]}
      />
      <ApplyModal
        listingId={listing.id}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setIsApplyModalOpen(false);
          setIsApplied(true);
        }}
        visible={isApplyModalOpen}
      />
      {creator?.id ? (
        <SendMessageModal
          recipientId={creator.id}
          onClose={() => setIsSendMessageModalOpen(false)}
          visible={isSendMessageModalOpen}
        />
      ) : null}
    </>
  );
}

// ─── Owner Request Detail ─────────────────────────────────────────────────────

export function OwnerRequestDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const listingQuery = useListingDetail(params.listingId);
  const listing = listingQuery.data;
  const currentUser = useSessionStore((state) => state.user);
  const isOwnListing = Boolean(listing && currentUser && listing.creatorId === currentUser.id);
  const gate = useCaregiverGate({
    fallbackTitle: "Bu talebe başvurmak için bakıcı modu hazır olmalı."
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);

  // Similar listings from cache
  const helpRequestQuery = useListings({ type: "HELP_REQUEST" });
  const similarRequests = useMemo(
    () =>
      (helpRequestQuery.data ?? [])
        .filter(isOwnerRequestListing)
        .filter((l) => l.id !== params.listingId)
        .slice(0, 3)
        .map(toOwnerRequestDisplay),
    [helpRequestQuery.data, params.listingId]
  );

  if (listingQuery.isLoading) {
    return <LoadingDetailState title="Bakıcı Talebi" />;
  }

  if (!listing) {
    return (
      <MissingDetailState description="Bakıcı arayan ilanı bulunamadı." title="İlan detayı" />
    );
  }

  if (!isOwnerRequestListing(listing)) {
    return (
      <MissingDetailState description="Bakıcı arayan ilanı bulunamadı." title="İlan detayı" />
    );
  }

  const creator = listing.creator;
  const pet = listing.pet;
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);
  const creatorLocation = [creator?.city ?? metadata.city, creator?.district ?? metadata.district].filter(Boolean).join(" / ");

  return (
    <>
      <ListingDetailLayout
        applyDone={isApplied}
        bookmarkPayload={{
          id: listing.id,
          title: listing.title,
          type: listing.type,
          location: creatorLocation || "Konum belirtilmemiş"
        }}
        basicInfo={[
          {
            icon: "paw-outline",
            label: metadata.petType ?? pet?.species ?? "Evcil Hayvan",
            tone: "primary"
          },
          {
            icon: "map-marker-outline",
            label: creatorLocation || "Konum belirtilmemiş",
            tone: "neutral"
          },
          ...(metadata.priceLabel
            ? [
                {
                  icon: "cash" as const,
                  label: metadata.priceLabel,
                  tone: "success" as const
                }
              ]
            : []),
          ...(metadata.datePlan
            ? [
                {
                  icon: "calendar-range" as const,
                  label: metadata.datePlan,
                  tone: "warning" as const
                }
              ]
            : []),
          ...(listing.expiresAt
            ? [
                {
                  icon: "calendar-clock-outline" as const,
                  label: formatExpiresAt(listing.expiresAt),
                  tone: "warning" as const
                }
              ]
            : [])
        ]}
        coverImageUri={getPrimaryMediaUrl(metadata)}
        description={[description]}
        emptyTitle="Benzer talep bulunmuyor"
        notFoundDescription="Bakıcı arayan ilanı bulunamadı."
        onApplyPress={() => setIsApplyModalOpen(true)}
        owner={{
          description: pet
            ? `${metadata.petType ?? pet.species}${pet.breed ? ` (${pet.breed})` : ""} sahibi, bakıcı arıyor.`
            : "Evcil hayvanı için bakıcı arıyor.",
          headline: "Bakıcı Arıyor",
          location: creatorLocation || "Konum belirtilmemiş",
          name: creator?.fullName ?? "İlan Sahibi"
        }}
        isOwnListing={isOwnListing}
        onMessagePress={!isOwnListing ? () => setIsSendMessageModalOpen(true) : undefined}
        ownerTitle="İlan sahibi özeti"
        primaryActionLabel="Başvur"
        similarListings={
          similarRequests.length > 0 ? (
            <View style={styles.list}>
              {similarRequests.map((item) => (
                <Link href={routeBuilders.ownerRequestDetail(item.id)} key={item.id} asChild>
                  <Pressable style={styles.relatedCard}>
                    {item.coverImageUri ? (
                      <View style={styles.relatedVisualArea}>
                        <Image source={{ uri: item.coverImageUri }} style={styles.relatedVisualImage} />
                      </View>
                    ) : null}
                    <Text style={styles.relatedTitle}>{item.title}</Text>
                    <Text style={styles.relatedDescription}>{item.summary}</Text>
                    <View style={styles.metaRow}>
                      <MetaPill icon="paw-outline" label={item.petType} tone="primary" />
                      {item.budget ? (
                        <MetaPill icon="cash" label={item.budget} tone="success" />
                      ) : null}
                      {item.dateLabel ? (
                        <MetaPill icon="calendar-range" label={item.dateLabel} tone="warning" />
                      ) : null}
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          ) : null
        }
        stickyGate={gate}
        subtitle={creatorLocation || "Bakıcı Talebi"}
        title={listing.title}
        trustSignals={[
          {
            description: "İlan sahibinin kimlik doğrulaması yapılmamıştır.",
            label: "Kimlik Doğrulaması",
            state: "pending"
          },
          {
            description:
              listing.status === "ACTIVE"
                ? "Talep aktif ve başvuru kabul ediyor."
                : "Talep şu anda aktif değil.",
            label: "Talep Durumu",
            state: listing.status === "ACTIVE" ? "verified" : "pending"
          }
        ]}
      />
      <ApplyModal
        listingId={listing.id}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setIsApplyModalOpen(false);
          setIsApplied(true);
        }}
        visible={isApplyModalOpen}
      />
      {creator?.id ? (
        <SendMessageModal
          recipientId={creator.id}
          onClose={() => setIsSendMessageModalOpen(false)}
          visible={isSendMessageModalOpen}
        />
      ) : null}
    </>
  );
}

// ─── Petshop Campaign Detail ──────────────────────────────────────────────────

export function PetshopCampaignDetailScreen() {
  const params = useLocalSearchParams<{ listingId: string }>();
  const discoveryQuery = usePetshopDiscovery();
  const detailQuery = usePetshopCampaignDetail(params.listingId);
  const campaign =
    detailQuery.data ??
    (discoveryQuery.data ?? []).find((item) => item.id === params.listingId);
  const detail = campaign
    ? {
        description: [campaign.summary],
        info: [
          { icon: "storefront-outline" as const, label: campaign.storeName, tone: "primary" as const },
          { icon: "sale-outline" as const, label: campaign.discount, tone: "warning" as const },
          { icon: "cash" as const, label: campaign.priceLabel, tone: "success" as const },
          {
            icon: "account-group-outline" as const,
            label: `${campaign.participantCount}/${campaign.targetParticipantCount} katılım`,
            tone: "neutral" as const
          },
          { icon: "clock-outline" as const, label: campaign.deadline, tone: "neutral" as const }
        ],
        managementNote:
          campaign.status === "aktif"
            ? "Kampanya yayında. Yönetim ekranından tüm aktif kampanyalarını takip edebilirsin."
            : "Kampanya pasif durumda. Mağaza yönetimi ekranından güncel durumunu kontrol edebilirsin.",
        owner: {
          description:
            campaign.store?.summary ??
            `${campaign.storeName} mağazasının kampanya ve mağaza bilgileri burada yer alır.`,
          headline:
            campaign.verificationState === "verified"
              ? "Doğrulanmış mağaza profili"
              : "Petshop mağaza profili",
          location:
            [campaign.city, campaign.district].filter(Boolean).join(" / ") ||
            "Konum belirtilmemiş",
          name: campaign.storeName
        },
        subtitle: "Petshop Kampanyası",
        title: campaign.title,
        trustSignals: [
          {
            description:
              campaign.verificationState === "verified"
                ? "Mağaza doğrulaması onaylanmış durumda."
                : "Mağaza doğrulama bilgileri henüz tamamlanmamış olabilir.",
            label: "Mağaza doğrulaması",
            state: campaign.verificationState === "verified" ? ("verified" as const) : ("pending" as const)
          },
          {
            description:
              campaign.coverImageUri
                ? "Kampanya için kapak görseli eklendi."
                : "Kampanya kapak görseli henüz eklenmemiş.",
            label: "Görsel sunum",
            state: campaign.coverImageUri ? ("verified" as const) : ("pending" as const)
          },
          {
            description:
              campaign.deadline !== "Süre belirtilmemiş"
                ? "Kampanya son tarihi kullanıcılarla paylaşılmış."
                : "Kampanya için net bir süre bilgisi girilmemiş.",
            label: "Kampanya süresi",
            state:
              campaign.deadline !== "Süre belirtilmemiş"
                ? ("verified" as const)
                : ("pending" as const)
          }
        ]
      }
    : null;
  const similar = useMemo(() => {
    if (!campaign) {
      return [];
    }

    return (discoveryQuery.data ?? [])
      .filter((item) => item.id !== campaign.id)
      .filter((item) => item.storeId === campaign.storeId || item.city === campaign.city)
      .slice(0, 3);
  }, [campaign, discoveryQuery.data]);
  const gate = usePetshopGate();

  if ((detailQuery.isLoading || discoveryQuery.isLoading) && !detail) {
    return <LoadingDetailState title="Petshop Kampanyası" />;
  }

  if (!detail) {
    return <MissingDetailState description="Petshop kampanyası bulunamadı." title="Kampanya detayı" />;
  }

  const resolvedCampaign = campaign;

  if (!resolvedCampaign) {
    return <MissingDetailState description="Petshop kampanyası bulunamadı." title="Kampanya detayı" />;
  }

  return (
    <ListingDetailLayout
      actionSlot={
        <InfoCard
          description={detail.managementNote}
          title="Yönetici işlemleri"
          variant="accent"
        >
          <AppButton
            label="Mağaza Profiline Git"
            leftSlot={<AppIcon backgrounded={false} name="storefront-outline" size={18} />}
            onPress={() => {
              if (resolvedCampaign.storeId) {
                router.push(routeBuilders.petshopStoreProfile(resolvedCampaign.storeId));
              }
            }}
            variant="secondary"
          />
          <AppButton
            label="Kampanyayı Yönet"
            leftSlot={
              <AppIcon backgrounded={false} color="#FFFFFF" name="store-cog-outline" size={18} />
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
      coverImageUri={resolvedCampaign.coverImageUri}
      description={detail.description}
      emptyTitle="Benzer kampanya bulunmuyor"
      notFoundDescription="Petshop kampanyası bulunamadı."
      owner={detail.owner}
      ownerTitle="Mağaza özeti"
      primaryActionLabel="İletişime Geç"
      similarListings={
        similar.length > 0 ? (
          <View style={styles.list}>
             {similar.map((item) => (
               <Link href={routeBuilders.petshopCampaignDetail(item.id)} key={item.id} asChild>
                 <Pressable>
                   <PetshopCampaignCard
                     campaignLabel={item.campaignLabel}
                     coverImageUri={
                       "coverImageUri" in item && typeof item.coverImageUri === "string"
                         ? item.coverImageUri
                         : undefined
                     }
                     deadline={item.deadline}
                     description={item.summary}
                      priceLabel={`${item.discount} • ${item.priceLabel}`}
                      storeName={item.storeName}
                      title={item.title}
                      verificationState={item.verificationState}
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

// ─── Shared Layout ────────────────────────────────────────────────────────────

function ListingDetailLayout({
  actionSlot,
  applyDone = false,
  isOwnListing = false,
  basicInfo,
  bookmarkPayload,
  coverImageUri,
  description,
  emptyTitle,
  notFoundDescription,
  onApplyPress,
  onMessagePress,
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
  const toggleBookmark = useBookmarkStore((s) => s.toggle);
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked);
  const isSaved = bookmarkPayload ? isBookmarked(bookmarkPayload.id) : false;
  const [isAppliedFallback, setIsAppliedFallback] = useState(false);
  const appliedState = applyDone || isAppliedFallback;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {coverImageUri ? (
          <View style={styles.heroImageArea}>
            <Image source={{ uri: coverImageUri }} style={styles.heroImage} />
            <LinearGradient
              colors={["transparent", "rgba(15,23,42,0.45)"]}
              locations={[0.45, 1]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ) : null}

        <InfoCard title="Genel Bilgiler">
          <View style={styles.metaRow}>
            {basicInfo.map((item) => (
              <MetaPill key={`${item.icon}-${item.label}`} {...item} />
            ))}
          </View>
        </InfoCard>

        <InfoCard title="Açıklama">
          <View style={styles.textList}>
            {description.map((paragraph) => (
              <Text key={paragraph} style={styles.supportingText}>
                {paragraph}
              </Text>
            ))}
          </View>
        </InfoCard>

        <InfoCard description={owner.description} title={ownerTitle}>
          <View style={styles.ownerHeader}>
            <View style={styles.ownerBadge}>
              <AppIcon backgrounded={false} color={colors.primary} name="account-outline" size={24} />
            </View>
            <View style={styles.ownerTexts}>
              <Text style={styles.ownerRole}>{owner.headline}</Text>
              <Text style={styles.ownerName}>{owner.name}</Text>
              <Text style={styles.ownerLocation}>{owner.location}</Text>
            </View>
          </View>
        </InfoCard>

        <InfoCard title="Güven Sinyalleri" description="Platform doğrulama ve güven göstergeleri">
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

        <InfoCard title="Benzer İlanlar">
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
          disabled={isOwnListing}
          label={isOwnListing ? "Kendi İlanın" : appliedState ? "Başvuru Yapıldı" : primaryActionLabel}
          leftSlot={
            <AppIcon
              backgrounded={false}
              color={colors.textInverse}
              name={isOwnListing ? "account-outline" : appliedState ? "check-circle-outline" : "send-outline"}
              size={18}
            />
          }
          onPress={() => {
            if (isOwnListing || appliedState) return;
            if (stickyGate && primaryActionUsesGate) {
              stickyGate.openGate();
              return;
            }
            if (onApplyPress) {
              onApplyPress();
            } else {
              setIsAppliedFallback(true);
            }
          }}
        />
        <View style={styles.ctaSecondaryRow}>
          <View style={styles.ctaSecondaryItem}>
            <AppButton
              label="Mesaj Gönder"
              leftSlot={<AppIcon backgrounded={false} name="message-text-outline" size={18} />}
              onPress={onMessagePress}
              variant="secondary"
            />
          </View>
          <View style={styles.ctaGhostItem}>
            <AppButton
              label={isSaved ? "Kaydedildi" : "Kaydet"}
              leftSlot={
                <AppIcon
                  backgrounded={false}
                  color={isSaved ? colors.primary : colors.textMuted}
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={18}
                />
              }
              onPress={() => {
                if (bookmarkPayload) toggleBookmark(bookmarkPayload);
              }}
              variant="ghost"
            />
          </View>
        </View>
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

// ─── Gate hooks ───────────────────────────────────────────────────────────────

function useCaregiverGate({ fallbackTitle }: { fallbackTitle: string }) {
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
    ctaLabel: "Bakıcı Modunu Tamamla",
    ctaRoute: routes.app.caregiverActivation,
    description:
      caregiverStatus === "inactive"
        ? "Başvuru akışını açabilmek için önce bakıcı modunu başlatman gerekiyor."
        : "Bakıcı modun oluşmuş ancak başvuruya çıkmak için bazı alanların tamamlanması gerekiyor.",
    icon: presentation.icon,
    isReady: false,
    missingItems:
      missingItems.length > 0
        ? missingItems
        : ["Deneyim", "Hizmet türleri", "Uygunluk", "Profil açıklaması"],
    openGate: () => setVisible(true),
    reasonLabel: presentation.label,
    reasonTone: presentation.tone === "warning" ? "warning" : ("neutral" as const),
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
        ? "Yönetici işlemleri için petshop modun hazır."
        : petshopStatus === "in_review"
          ? "Petshop modun incelemede. Eksik alan varsa günceleyip süreci hızlandırabilirsin."
          : "Kampanya yönetimi için doğrulanmış petshop moduna ihtiyacın var.",
    icon: presentation.icon,
    isReady: petshopStatus === "active",
    missingItems:
      petshopStatus === "active"
        ? []
        : missingItems.length > 0
          ? missingItems
          : ["Mağaza bilgisi", "Doğrulama belgeleri", "Görseller"],
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
            : ("neutral" as const),
    title: "Bu alanı yönetmek için petshop modu hazır olmalı.",
    visible
  } satisfies GateState;
}

// ─── Utility screens ──────────────────────────────────────────────────────────

function LoadingDetailState({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>{title} yükleniyor...</Text>
      </View>
    </SafeAreaView>
  );
}

function MissingDetailState({ description, title }: { description: string; title: string }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <EmptyState description={description} icon="cards-outline" title={title} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stiller ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.standard
  },
  ctaGhostItem: {
    flex: 0,
    minWidth: 100
  },
  ctaSecondaryItem: {
    flex: 1
  },
  ctaSecondaryRow: {
    flexDirection: "row",
    gap: spacing.compact
  },
  heroImage: {
    height: "100%",
    width: "100%"
  },
  heroImageArea: {
    borderRadius: radius.lg,
    height: 260,
    overflow: "hidden"
  },
  list: {
    gap: spacing.compact
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    gap: spacing.standard,
    justifyContent: "center"
  },
  loadingText: {
    color: colors.textMuted,
    ...typography.body
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  ownerBadge: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  ownerHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard
  },
  ownerLocation: {
    color: colors.textSubtle,
    ...typography.caption
  },
  ownerName: {
    color: colors.text,
    ...typography.bodyStrong
  },
  ownerRole: {
    color: colors.primary,
    ...typography.overline
  },
  ownerTexts: {
    flex: 1,
    gap: spacing.nano
  },
  relatedCard: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.standard
  },
  relatedDescription: {
    color: colors.textMuted,
    ...typography.body
  },
  relatedVisualArea: {
    borderRadius: radius.md,
    height: 140,
    overflow: "hidden"
  },
  relatedVisualImage: {
    height: "100%",
    width: "100%"
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
    gap: spacing.nano
  },
  trustTitle: {
    color: colors.text,
    ...typography.bodyStrong
  }
});
