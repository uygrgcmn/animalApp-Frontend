import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ListingType } from "../../../core/api/contracts";
import { colors } from "../../../core/theme/colors";
import { shadows, spacing, typography } from "../../../core/theme/tokens";
import { routeBuilders } from "../../../core/navigation/routes";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { formatRelativeDate } from "../../../shared/utils/formatDate";
import { useConversations } from "../hooks/useMessages";
import { ConversationPreviewCard } from "../components/ConversationPreviewCard";

type MessageFilter = "all" | "unread" | "archived";

const filterOptions: { label: string; value: MessageFilter }[] = [
  { label: "Tüm Konuşmalar", value: "all" },
  { label: "Okunmamış", value: "unread" },
  { label: "Arşiv", value: "archived" }
];

const listingTypeLabels: Record<ListingType, string> = {
  SITTING: "Bakıcı İlanı",
  HELP_REQUEST: "Bakıcı Arıyorum",
  FREE_ITEM: "Ücretsiz Eşya",
  ACTIVITY: "Etkinlik",
  COMMUNITY: "Topluluk",
  ADOPTION: "Sahiplendirme"
};

function getListingHref(listingId: string, listingType?: ListingType): string {
  if (listingType === "SITTING") return String(routeBuilders.caregiverListingDetail(listingId));
  if (listingType === "HELP_REQUEST") return String(routeBuilders.ownerRequestDetail(listingId));
  if (listingType === "ADOPTION" || listingType === "COMMUNITY" || listingType === "FREE_ITEM" || listingType === "ACTIVITY") {
    return String(routeBuilders.communityPostDetail(listingId));
  }
  return String(routeBuilders.petshopCampaignDetail(listingId));
}

function getParticipantRole(participant?: { isSitter?: boolean; isPetshop?: boolean }): string {
  if (!participant) return "";
  if (participant.isSitter) return "Bakıcı";
  if (participant.isPetshop) return "Mağaza hesabı";
  return "Evcil hayvan sahibi";
}

export function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const { data: conversations = [], isLoading } = useConversations();

  const filteredConversations = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return conversations.filter((item) => {
      if (filter === "unread" && item.unreadCount === 0) return false;
      if (filter === "archived" && !item.isArchived) return false;
      if (filter === "all" && item.isArchived) return false;
      if (!q) return true;
      const name = item.otherParticipant?.fullName?.toLowerCase() ?? "";
      const title = item.listing?.title?.toLowerCase() ?? "";
      const preview = item.lastMessagePreview?.toLowerCase() ?? "";
      return name.includes(q) || title.includes(q) || preview.includes(q);
    });
  }, [conversations, filter, searchValue]);

  const totalUnread = useMemo(
    () => conversations.filter((c) => !c.isArchived && c.unreadCount > 0).length,
    [conversations]
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerOverline}>MESAJLAR</Text>
            <Text style={styles.headerTitle}>Konuşmalar</Text>
          </View>
          {totalUnread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{totalUnread}</Text>
              <Text style={styles.unreadLabel}>okunmamış</Text>
            </View>
          )}
        </View>

        <SearchBar
          onChangeText={setSearchValue}
          placeholder="Konuşma veya kişi ara..."
          value={searchValue}
        />

        <SegmentedTabs onChange={setFilter} options={filterOptions} value={filter} />

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : filteredConversations.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredConversations.map((conversation) => (
            <ConversationPreviewCard
              key={conversation.id}
              href={{
                params: { conversationId: conversation.id },
                pathname: "/(app)/messages/[conversationId]"
              }}
              lastMessage={conversation.lastMessagePreview ?? ""}
              listingHref={getListingHref(conversation.listingId, conversation.listing?.type)}
              listingTitle={conversation.listing?.title ?? "İlan"}
              listingType={
                conversation.listing?.type
                  ? (listingTypeLabels[conversation.listing.type] ?? conversation.listing.type)
                  : "İlan"
              }
              participantName={conversation.otherParticipant?.fullName ?? "Kullanıcı"}
              participantRole={getParticipantRole(conversation.otherParticipant)}
              unreadCount={conversation.unreadCount}
              updatedAt={formatRelativeDate(conversation.lastMessageAt ?? conversation.updatedAt)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            description={
              filter === "unread"
                ? "Tüm mesajlarınızı okudunuz."
                : filter === "archived"
                  ? "Arşivlenmiş konuşmanız bulunmuyor."
                  : searchValue
                    ? "Aradığınız kriterlere uygun konuşma bulunamadı."
                    : "Henüz mesajlaşma başlatılmamış."
            }
            icon="message-text-outline"
            title={filter === "unread" ? "Tamamdır!" : "Konuşma Yok"}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginHorizontal: -spacing.comfortable,
    marginTop: spacing.compact
  },
  emptyWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.comfortable
  },
  header: {
    ...shadows.card,
    backgroundColor: colors.surface,
    gap: spacing.compact,
    paddingBottom: spacing.standard,
    paddingHorizontal: spacing.comfortable,
    zIndex: 10
  },
  headerOverline: {
    ...typography.overline,
    color: colors.primary
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2
  },
  headerTitleBlock: {
    flex: 1
  },
  headerTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listContent: {
    paddingBottom: 110
  },
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  unreadBadge: {
    alignItems: "flex-end"
  },
  unreadCount: {
    ...typography.h2,
    color: colors.primary
  },
  unreadLabel: {
    ...typography.caption,
    color: colors.textMuted
  }
});
