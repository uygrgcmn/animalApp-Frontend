import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";

type ConversationPreviewCardProps = {
  href: {
    params: {
      conversationId: string;
    };
    pathname: "/(app)/messages/[conversationId]";
  };
  lastMessage: string;
  participantName: string;
  participantRole?: string;
  unreadCount: number;
  updatedAt: string;
};

export function ConversationPreviewCard({
  href,
  lastMessage,
  participantName,
  participantRole,
  unreadCount,
  updatedAt
}: ConversationPreviewCardProps) {
  const hasUnread = unreadCount > 0;
  const initials = participantName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Top row: name + time */}
          <View style={styles.topRow}>
            <Text numberOfLines={1} style={styles.name}>
              {participantName}
            </Text>
            <Text style={[styles.time, hasUnread && styles.timeUnread]}>{updatedAt}</Text>
          </View>

          {/* Message preview + unread badge */}
          <View style={styles.messageRow}>
            <Text numberOfLines={1} style={[styles.message, hasUnread && styles.messageUnread]}>
              {lastMessage}
            </Text>
            {hasUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarContainer: {
    justifyContent: "center"
  },
  avatarText: {
    color: colors.textSubtle,
    fontSize: 18,
    fontWeight: "600"
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 6
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "700"
  },
  card: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    gap: spacing.standard,
    paddingHorizontal: spacing.comfortable,
    height: 76,
  },
  content: {
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: "center",
    paddingRight: spacing.micro,
  },
  message: {
    color: colors.textSubtle,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  messageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight,
    marginTop: 2
  },
  messageUnread: {
    color: colors.textMuted,
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    backgroundColor: colors.surfaceMuted
  },
  time: {
    color: colors.textSubtle,
    fontSize: 12,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: "600"
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
