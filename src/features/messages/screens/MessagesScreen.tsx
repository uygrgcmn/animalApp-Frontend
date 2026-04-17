import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../../core/theme/colors";
import { shadows, spacing, typography } from "../../../core/theme/tokens";
import { conversations } from "../../../shared/mocks/messages";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { ConversationPreviewCard } from "../components/ConversationPreviewCard";

type MessageFilter = "all" | "unread" | "archived";

const filterOptions: { label: string; value: MessageFilter }[] = [
  { label: "Tüm Konuşmalar", value: "all" },
  { label: "Okunmamış", value: "unread" },
  { label: "Arşiv", value: "archived" }
];

export function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  const filteredConversations = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return conversations.filter((item) => {
      if (filter === "unread" && item.unreadCount === 0) return false;
      if (filter === "archived" && !item.archived) return false;
      if (filter === "all" && item.archived) return false;
      if (!q) return true;
      return (
        item.participantName.toLowerCase().includes(q) ||
        item.listingTitle.toLowerCase().includes(q) ||
        item.lastMessage.toLowerCase().includes(q)
      );
    });
  }, [filter, searchValue]);

  const totalUnread = useMemo(
    () => conversations.filter((c) => !c.archived && c.unreadCount > 0).length,
    []
  );

  return (
    <View style={styles.root}>
      {/* ── Sticky header ── */}
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

      {/* ── Conversation list ── */}
      {filteredConversations.length > 0 ? (
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
              lastMessage={conversation.lastMessage}
              listingHref={String(getMockItemHref(conversation.listingKind, conversation.listingId))}
              listingTitle={conversation.listingTitle}
              listingType={conversation.listingType}
              participantName={conversation.participantName}
              participantRole={conversation.participantRole}
              unreadCount={conversation.unreadCount}
              updatedAt={conversation.updatedAt}
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
                  : "Aradığınız kriterlere uygun konuşma bulunamadı."
            }
            icon="message-text-outline"
            title={filter === "unread" ? "Tamamdır!" : "Konuşma Yok"}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
