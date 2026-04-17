import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { ApplyModal } from "../../listings/components/ApplyModal";
import { toCommunityDisplay } from "../../listings/utils/adapters";
import {
  getPrimaryMediaUrl,
  parseEmbeddedListingMetadata
} from "../../listings/utils/embeddedListingMetadata";
import { formatRelativeDate } from "../../../shared/utils/formatDate";
import { useCommunityListingDetail, useCommunityListings } from "../hooks/useCommunityListings";

const categoryLabels: Record<string, string> = {
  FREE_ITEM: "Ücretsiz Eşya",
  ADOPTION: "Sahiplendirme",
  ACTIVITY: "Etkinlik",
  HELP_REQUEST: "Yardım Talebi",
  COMMUNITY: "Topluluk"
};

const quickActionLabel = (type: string) => {
  if (type === "ACTIVITY") return "Katıl";
  if (type === "ADOPTION") return "Sahiplen";
  return "Başvur";
};

export function CommunityDetailScreen() {
  const params = useLocalSearchParams<{ postId: string }>();
  const postQuery = useCommunityListingDetail(params.postId);
  const listing = postQuery.data;
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Similar posts from cache
  const communityQuery = useCommunityListings();
  const similarPosts = useMemo(
    () =>
      (communityQuery.data ?? [])
        .filter((p) => p.id !== params.postId)
        .slice(0, 3)
        .map(toCommunityDisplay),
    [communityQuery.data, params.postId]
  );

  if (postQuery.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Paylaşım yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!listing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <EmptyState
            description="Aradığın topluluk paylaşımı bulunamadı."
            icon="hand-heart-outline"
            title="Paylaşım bulunamadı"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const creator = listing.creator;
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);
  const category = categoryLabels[listing.type] ?? "Topluluk";
  const location = [creator?.city ?? metadata.city, creator?.district ?? metadata.district].filter(Boolean).join(" / ");
  const authorRole = creator?.isPetshop ? "Petshop" : creator?.isSitter ? "Bakıcı" : "Kullanıcı";
  const actionLabel = quickActionLabel(listing.type);
  const coverImageUri = getPrimaryMediaUrl(metadata);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {coverImageUri ? (
            <View style={styles.heroImageArea}>
              <Image source={{ uri: coverImageUri }} style={styles.heroImage} />
            </View>
          ) : null}

          {/* Kategori başlık kartı */}
          <View style={styles.categoryBanner}>
            <MetaPill icon="shape-outline" label={category} tone="success" />
            <MetaPill icon="clock-outline" label={formatRelativeDate(listing.createdAt)} tone="warning" />
            {listing.status === "ACTIVE" && (
              <MetaPill icon="check-circle-outline" label="Aktif" tone="success" />
            )}
          </View>

          <InfoCard description={location || "Topluluk paylaşımı"} title={listing.title}>
            <View style={styles.metaRow}>
              {location ? (
                <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
              ) : null}
              <MetaPill icon="shape-outline" label={category} tone="primary" />
            </View>
          </InfoCard>

          <InfoCard
            description="Paylaşım açıklaması, neden açıldığı ve topluluk içindeki beklenti."
            title="Paylaşım açıklaması"
          >
            <Text style={styles.bodyText}>{description}</Text>
          </InfoCard>

          <InfoCard description="Paylaşan kişinin kısa özeti." title="Paylaşan kişi">
            <View style={styles.authorRow}>
              <View style={styles.authorBadge}>
                <AppIcon name="account-group-outline" size={22} tone="success" />
              </View>
              <View style={styles.authorTexts}>
                <Text style={styles.authorName}>{creator?.fullName ?? "Kullanıcı"}</Text>
                <Text style={styles.authorRole}>{authorRole}</Text>
              </View>
            </View>
          </InfoCard>

          <InfoCard description="Topluluk güvenini destekleyen bilgiler." title="Güven hissi" variant="accent">
            <View style={styles.trustList}>
              <View style={styles.trustRow}>
                <AppIcon backgrounded={false} name="check-circle-outline" size={16} tone="success" />
                <Text style={styles.bodyText}>İlan aktif ve topluluk tarafından görüntülenebilir.</Text>
              </View>
              <View style={styles.trustRow}>
                <AppIcon backgrounded={false} name="check-circle-outline" size={16} tone="success" />
                <Text style={styles.bodyText}>İlan sahibi platformda kayıtlı kullanıcıdır.</Text>
              </View>
            </View>
          </InfoCard>

          <InfoCard
            description="Benzer yardımlaşma veya sahiplendirme paylaşımları."
            title="Benzer paylaşımlar"
          >
            {similarPosts.length > 0 ? (
              <View style={styles.list}>
                {similarPosts.map((item) => (
                  <CommunityCard
                    key={item.id}
                    actionSlot={
                      <AppButton
                        label="İncele"
                        onPress={() => {
                          router.push(routeBuilders.communityPostDetail(item.id));
                        }}
                        variant="secondary"
                      />
                    }
                    author={item.author}
                    category={item.category}
                    dateLabel={item.dateLabel}
                    description={item.summary}
                    imageUri={item.imageUri}
                    location={[item.city, item.district].filter(Boolean).join(" / ")}
                    onPress={() => {
                      router.push(routeBuilders.communityPostDetail(item.id));
                    }}
                    title={item.title}
                    verificationState={item.trustState}
                    visualLabel={item.visualLabel}
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                description="Bu paylaşıma yakın kategoride yeni bir topluluk ilanı henüz yok."
                icon="hand-heart-outline"
                title="Benzer paylaşım bulunamadı"
              />
            )}
          </InfoCard>

          <InfoCard
            description="İstersen aynı ihtiyaç tipinde kendi topluluk paylaşımını da açabilirsin."
            title="Sen de katkı sun"
          >
            <Link href={routeBuilders.createWithType("community-post")} asChild>
              <AppButton
                label="Topluluk Paylaşımı Oluştur"
                leftSlot={
                  <AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={18} />
                }
              />
            </Link>
          </InfoCard>
        </ScrollView>

        <StickyBottomActionBar>
          <AppButton
            label={isApplied ? "Talep İletildi" : actionLabel}
            leftSlot={
              <AppIcon
                backgrounded={false}
                color="#FFFFFF"
                name={isApplied ? "check-circle-outline" : "send-outline"}
                size={18}
              />
            }
            onPress={() => {
              if (!isApplied) {
                setIsApplyModalOpen(true);
              }
            }}
          />
          <Link href={routes.app.messages} asChild>
            <AppButton
              label="Mesaj Gönder"
              leftSlot={<AppIcon backgrounded={false} name="message-text-outline" size={18} />}
              variant="secondary"
            />
          </Link>
          <AppButton
            label={isSaved ? "Kaydedildi" : "Kaydet"}
            leftSlot={<AppIcon backgrounded={false} name="bookmark-outline" size={18} />}
            onPress={() => setIsSaved((current) => !current)}
            variant="ghost"
          />
        </StickyBottomActionBar>
      </SafeAreaView>

      <ApplyModal
        listingId={listing.id}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          setIsApplyModalOpen(false);
          setIsApplied(true);
        }}
        visible={isApplyModalOpen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  authorBadge: {
    alignItems: "center",
    backgroundColor: colors.successSoft,
    borderRadius: radius.large,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  authorName: {
    color: colors.text,
    ...typography.h3
  },
  authorRole: {
    color: colors.textSubtle,
    ...typography.caption
  },
  authorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  authorTexts: {
    flex: 1,
    gap: spacing.micro
  },
  bodyText: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  categoryBanner: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  heroImage: {
    height: "100%",
    width: "100%"
  },
  heroImageArea: {
    borderRadius: radius.large,
    height: 220,
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
  safeArea: {
    backgroundColor: colors.background,
    flex: 1
  },
  trustList: {
    gap: spacing.compact
  },
  trustRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.tight
  }
});
