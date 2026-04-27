import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ConversationSummary } from "../../../core/api/contracts";
import { colors } from "../../../core/theme/colors";
import { shadows, spacing, typography } from "../../../core/theme/tokens";
import { routeBuilders } from "../../../core/navigation/routes";
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
      {/* WhatsApp style Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Mesajlar</Text>
          <View style={styles.headerIcons}>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <MaterialCommunityIcons name="camera-outline" size={24} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <MaterialCommunityIcons name="magnify" size={24} color={colors.text} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.filterRow}>
          <SegmentedTabs 
            onChange={setFilter} 
            options={filterOptions} 
            value={filter}
          />
        </View>
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
    paddingHorizontal: spacing.comfortable
  },
  header: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.compact,
    paddingHorizontal: spacing.comfortable,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 22,
    color: colors.text,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.standard,
  },
  iconBtn: {
    padding: spacing.micro,
  },
  filterRow: {
    marginTop: spacing.compact,
  },
  listContent: {
    paddingBottom: 160
  },
  root: {
    backgroundColor: colors.surface,
    flex: 1
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.card,
  }
});
