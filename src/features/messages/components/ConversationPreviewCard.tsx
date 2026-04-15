import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing } from "../../../core/theme/tokens";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ModeBadge } from "../../../shared/ui/ModeBadge";

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
  listingHref,
  listingTitle,
  listingType,
  participantName,
  participantRole,
  unreadCount,
  updatedAt
}: ConversationPreviewCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <AppIcon name="account-circle-outline" size={20} />
            <View style={styles.texts}>
              <Text style={styles.name}>{participantName}</Text>
              <Text style={styles.time}>
                {participantRole ? `${participantRole} • ${updatedAt}` : updatedAt}
              </Text>
            </View>
          </View>
          {unreadCount > 0 ? <ModeBadge label={`${unreadCount} yeni`} tone="warning" /> : null}
        </View>

        <Text numberOfLines={2} style={styles.message}>
          {lastMessage}
        </Text>

        <View style={styles.footer}>
          <MetaPill icon="link-variant" label={listingType} tone="neutral" />
          <Text numberOfLines={1} style={styles.listing}>
            {listingTitle}
          </Text>
          {listingHref ? (
            <Text numberOfLines={1} style={styles.linkHint}>
              Bagli ilana hizli gecis detay ekrani icinde mevcut
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.standard
  },
  footer: {
    gap: spacing.tight
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  identity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.compact
  },
  listing: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20
  },
  linkHint: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "600"
  },
  message: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.92
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  time: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "600"
  }
});
