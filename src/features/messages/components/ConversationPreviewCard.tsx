import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { AppIcon } from "../../../shared/ui/AppIcon";

type ConversationPreviewCardProps = {
  href: {
    params: {
      conversationId: string;
    };
    pathname: "/(app)/messages/[conversationId]";
  };
  lastMessage: string;
  listingHref?: string;
  listingTitle: string;
  listingType: string;
  participantName: string;
  participantRole?: string;
  unreadCount: number;
  updatedAt: string;
};

export function ConversationPreviewCard({
  href,
  lastMessage,
  listingTitle,
  listingType,
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
          <View style={[styles.avatar, hasUnread && styles.avatarUnread]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {hasUnread && <View style={styles.onlineDot} />}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Top row: name + time */}
          <View style={styles.topRow}>
            <Text numberOfLines={1} style={[styles.name, hasUnread && styles.nameUnread]}>
              {participantName}
            </Text>
            <Text style={[styles.time, hasUnread && styles.timeUnread]}>{updatedAt}</Text>
          </View>

          {/* Participant role (subtitle) */}
          {participantRole ? (
            <Text numberOfLines={1} style={styles.role}>
              {participantRole}
            </Text>
          ) : null}

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

          {/* Listing context */}
          <View style={styles.listingRow}>
            <AppIcon color={colors.primary} name="link-variant" size={11} />
            <Text numberOfLines={1} style={styles.listingTitle}>
              {listingTitle}
            </Text>
            <View style={styles.listingTypePill}>
              <Text style={styles.listingTypeText}>{listingType}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: "transparent",
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarContainer: {
    paddingTop: spacing.micro
  },
  avatarText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800"
  },
  avatarUnread: {
    borderColor: colors.primary
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 5
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center"
  },
  card: {
    backgroundColor: colors.background,
    flexDirection: "row",
    gap: spacing.standard,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.compact
  },
  content: {
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    flex: 1,
    gap: 3,
    paddingBottom: spacing.compact
  },
  listingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 2
  },
  listingTitle: {
    color: colors.primary,
    flex: 1,
    fontSize: 12,
    fontWeight: "600"
  },
  listingTypePill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  listingTypeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700"
  },
  message: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body,
    lineHeight: 18
  },
  messageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight
  },
  messageUnread: {
    color: colors.text,
    fontWeight: "600"
  },
  name: {
    color: colors.text,
    flex: 1,
    ...typography.subheading
  },
  nameUnread: {
    fontWeight: "800"
  },
  onlineDot: {
    backgroundColor: colors.primary,
    borderColor: colors.background,
    borderRadius: radius.full,
    borderWidth: 2,
    bottom: 2,
    height: 12,
    position: "absolute",
    right: 2,
    width: 12
  },
  pressed: {
    backgroundColor: colors.surfaceAlt
  },
  role: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16
  },
  time: {
    color: colors.textSubtle,
    ...typography.caption
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: "700"
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
