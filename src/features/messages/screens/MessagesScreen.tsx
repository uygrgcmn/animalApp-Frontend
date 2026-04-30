import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ConversationSummary } from "../../../core/api/contracts";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { formatRelativeDate } from "../../../shared/utils/formatDate";
import { useConversations } from "../hooks/useMessages";
import { ConversationPreviewCard } from "../components/ConversationPreviewCard";

type MessageFilter = "all" | "unread";

const filterOptions: { label: string; value: MessageFilter }[] = [
  { label: "Tüm Konuşmalar", value: "all" },
  { label: "Okunmamış", value: "unread" }
];

function getPeerRole(peerRole?: string): string {
  if (!peerRole) return "";
  if (peerRole === "ADMIN") return "Yönetici";
  return "Kullanıcı";
}

function filterConversations(
  list: ConversationSummary[],
  filter: MessageFilter,
  query: string
): ConversationSummary[] {
  const q = query.trim().toLowerCase();
  return list.filter((item) => {
    if (filter === "unread" && item.unreadCount === 0) return false;
    if (!q) return true;
    return (
      item.peerName.toLowerCase().includes(q) ||
      item.lastMessage.toLowerCase().includes(q)
    );
  });
}

export function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const { data: conversations = [], isLoading } = useConversations();

  const filteredConversations = useMemo(
    () => filterConversations(conversations, filter, searchValue),
    [conversations, filter, searchValue]
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerOverline}>MESAJLAR</Text>
            <Text style={styles.headerTitle}>Konuşmalar</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <MaterialCommunityIcons name="magnify" size={22} color={colors.textSecondary} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <SearchBar
          onChangeText={setSearchValue}
          placeholder="Konuşma veya kişi ara..."
          value={searchValue}
        />

        <SegmentedTabs
          onChange={setFilter}
          options={filterOptions}
          value={filter}
        />

        <View style={styles.divider} />
      </View>

      {isLoading ? (
        <View style={styles.emptyWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : filteredConversations.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredConversations.map((conversation) => (
            <ConversationPreviewCard
              key={conversation.peerId}
              href={{
                params: { conversationId: conversation.peerId },
                pathname: "/(app)/messages/[conversationId]"
              }}
              lastMessage={conversation.lastMessage}
              participantName={conversation.peerName}
              participantRole={getPeerRole(conversation.peerRole)}
              unreadCount={conversation.unreadCount}
              updatedAt={formatRelativeDate(conversation.lastMessageAt)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            description={
              filter === "unread"
                ? "Tüm mesajlarınızı okudunuz."
                : searchValue
                  ? "Aradığınız kriterlere uygun konuşma bulunamadı."
                  : "Henüz mesajlaşma başlatılmamış."
            }
            icon="message-text-outline"
            title={filter === "unread" ? "Tamamdır!" : "Konuşma Yok"}
          />
        </View>
      )}

      {/* Floating Action Button */}
      <Pressable style={[styles.fab, { bottom: 100 }]}>
        <MaterialCommunityIcons name="message-plus" size={24} color={colors.textInverse} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  header: {
    ...shadows.card,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    zIndex: 10
  },
  headerTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
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
  headerIcons: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  iconBtn: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1,
    marginHorizontal: -spacing.lg,
    marginTop: spacing.xs
  },
  listContent: {
    paddingBottom: 160
  },
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: spacing.lg,
    width: 56,
    ...shadows.floating
  }
});
