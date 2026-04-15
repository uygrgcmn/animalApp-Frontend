import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { routeBuilders, routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { communityPosts } from "../../../shared/mocks/marketplace";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";

export function CommunityDetailScreen() {
  const params = useLocalSearchParams<{ postId: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const post = communityPosts.find((item) => item.id === params.postId);
  const similarPosts = useMemo(
    () =>
      post
        ? communityPosts.filter((item) => post.similarIds.includes(item.id))
        : [],
    [post]
  );

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <AppHeader
            description="Paylasim bulunamadi."
            showBackButton
            title="Topluluk Detayi"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          description="Topluluk detayi, destek ihtiyacini ve guven notlarini net bir duzende sunar."
          showBackButton
          title="Topluluk Detayi"
        />

        <View style={styles.heroCard}>
          <Image source={{ uri: post.imageUri }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <MetaPill icon="shape-outline" label={post.category} tone="success" />
            <MetaPill icon="clock-outline" label={post.dateLabel} tone="warning" />
          </View>
        </View>

        <InfoCard description={post.visualLabel} title={post.title}>
          <View style={styles.metaRow}>
            <MetaPill icon="map-marker-outline" label={`${post.city} / ${post.district}`} tone="neutral" />
            <MetaPill icon="calendar-range" label={post.supportWindow} tone="warning" />
            <MetaPill icon="progress-clock" label={post.status} tone="primary" />
          </View>
        </InfoCard>

        <InfoCard
          description="Paylasim aciklamasi, neden acildigi ve topluluk icindeki beklenti burada toplanir."
          title="Paylasim aciklamasi"
        >
          <View style={styles.textBlock}>
            {post.description.map((paragraph) => (
              <Text key={paragraph} style={styles.bodyText}>
                {paragraph}
              </Text>
            ))}
          </View>
        </InfoCard>

        <InfoCard
          description="Paylasan kisinin veya toplulugun guven veren kisa ozeti."
          title="Paylasan kisi"
        >
          <View style={styles.authorRow}>
            <View style={styles.authorBadge}>
              <AppIcon name="account-group-outline" size={22} tone="success" />
            </View>
            <View style={styles.authorTexts}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.authorRole}>{post.authorRole}</Text>
            </View>
            <VerificationBadge state={post.trustState} />
          </View>
          <Text style={styles.bodyText}>{post.trustLabel}</Text>
        </InfoCard>

        <InfoCard
          description="Topluluga guven veren bilgiler acik ve sade tutulur."
          title="Guven hissi"
          variant="accent"
        >
          <View style={styles.textBlock}>
            {post.trustNotes.map((note) => (
              <View key={note} style={styles.trustRow}>
                <AppIcon backgrounded={false} name="check-circle-outline" size={16} tone="success" />
                <Text style={styles.bodyText}>{note}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        <InfoCard
          description="Benzer yardimlasma veya sahiplendirme paylasimlari ayni sicak ama duzenli yapida listelenir."
          title="Benzer paylasimlar"
        >
          {similarPosts.length > 0 ? (
            <View style={styles.list}>
              {similarPosts.map((item) => (
                <CommunityCard
                  key={item.id}
                  actionSlot={
                    <AppButton
                      label="Incele"
                      onPress={() => {
                        router.push(routeBuilders.communityPostDetail(item.id));
                      }}
                      variant="secondary"
                    />
                  }
                  author={item.author}
                  authorRole={item.authorRole}
                  category={item.category}
                  dateLabel={item.dateLabel}
                  description={item.summary}
                  imageUri={item.imageUri}
                  location={`${item.city} / ${item.district}`}
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
              description="Bu paylasima yakin kategoride yeni bir topluluk ilani henuz yok."
              icon="hand-heart-outline"
              title="Benzer paylasim bulunamadi"
            />
          )}
        </InfoCard>

        <InfoCard
          description="Istersen ayni ihtiyac tipinde kendi topluluk paylasimini da acabilirsin."
          title="Sen de katki sun"
        >
          <Link href={routeBuilders.createWithType("community-post")} asChild>
            <AppButton
              label="Topluluk Paylasimi Olustur"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={18} />}
            />
          </Link>
        </InfoCard>
      </ScrollView>

      <StickyBottomActionBar>
        <AppButton
          label={isApplied ? "Talep Iletildi" : post.quickActionLabel}
          leftSlot={
            <AppIcon
              backgrounded={false}
              color="#FFFFFF"
              name={post.quickActionLabel === "Basvur" ? "file-document-outline" : "hand-heart-outline"}
              size={18}
            />
          }
          onPress={() => {
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
    </SafeAreaView>
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
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  },
  heroCard: {
    ...shadows.card,
    borderRadius: radius.xlarge,
    minHeight: 220,
    overflow: "hidden",
    position: "relative"
  },
  heroImage: {
    height: 220,
    width: "100%"
  },
  heroOverlay: {
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    left: 0,
    padding: spacing.standard,
    position: "absolute",
    right: 0
  },
  list: {
    gap: spacing.compact
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
  textBlock: {
    gap: spacing.compact
  },
  trustRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.tight
  }
});
