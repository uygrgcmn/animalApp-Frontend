import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { conversations } from "../../../shared/mocks/messages";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";
import { ConversationPreviewCard } from "../components/ConversationPreviewCard";

type MessageFilter = "all" | "unread" | "archived";

const filterOptions: { label: string; value: MessageFilter }[] = [
  { label: "Tum Konusmalar", value: "all" },
  { label: "Okunmamis", value: "unread" },
  { label: "Arsiv", value: "archived" }
];

export function MessagesScreen() {
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchValue, setSearchValue] = useState("");

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return conversations.filter((item) => {
      if (filter === "unread" && item.unreadCount === 0) {
        return false;
      }

      if (filter === "archived" && !item.archived) {
        return false;
      }

      if (filter === "all" && item.archived) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        item.participantName.toLowerCase().includes(normalizedSearch) ||
        item.listingTitle.toLowerCase().includes(normalizedSearch) ||
        item.lastMessage.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [filter, searchValue]);

  const unreadCount = conversations.reduce((total, item) => total + item.unreadCount, 0);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          onChangeText={setSearchValue}
          placeholder="Kisi, ilan veya mesaj ara..."
          value={searchValue}
        />
      </View>

      <View style={styles.tabSection}>
        <SegmentedTabs onChange={setFilter} options={filterOptions} value={filter} />
      </View>

      <View style={styles.metaSummary}>
        <MetaPill
          icon="message-text-outline"
          label={`${filteredConversations.length} Konusma`}
          tone="primary"
        />
        {unreadCount > 0 && (
          <MetaPill
            icon="message-alert-outline"
            label={`${unreadCount} Okunmamis`}
            tone="warning"
          />
        )}
      </View>

      <View style={styles.resultsContainer}>
        {filteredConversations.length > 0 ? (
          <View style={styles.list}>
            {filteredConversations.map((conversation) => (
              <ConversationPreviewCard
                key={conversation.id}
                href={{
                  params: {
                    conversationId: conversation.id
                  },
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
          </View>
        ) : (
          <EmptyState
            description="Aradiginiz kriterlere uygun bir yazisma bulunamadi."
            icon="message-text-outline"
            title="Mesaj Yok"
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large
  },
  header: {
    gap: spacing.micro,
    paddingHorizontal: spacing.micro
  },
  headerSubtitle: {
    color: colors.textMuted,
    ...typography.body
  },
  headerTitle: {
    color: colors.text,
    ...typography.display
  },
  list: {
    gap: spacing.compact
  },
  metaSummary: {
    flexDirection: "row",
    gap: spacing.tight,
    paddingHorizontal: spacing.micro
  },
  resultsContainer: {
    marginTop: -spacing.micro
  },
  searchSection: {
    paddingHorizontal: spacing.micro
  },
  tabSection: {
    paddingHorizontal: spacing.micro
  }
});
