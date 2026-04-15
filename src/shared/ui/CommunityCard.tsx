import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon } from "./AppIcon";
import { MetaPill } from "./MetaPill";
import { StatusPill } from "./StatusPill";
import { VerificationBadge } from "./VerificationBadge";

type CommunityCardProps = {
  actionSlot?: ReactNode;
  author: string;
  authorRole?: string;
  category: string;
  dateLabel: string;
  description: string;
  imageUri?: string;
  location: string;
  onPress?: () => void;
  title: string;
  verificationState?: "verified" | "pending" | "rejected" | "unverified";
  visualLabel?: string;
};

export function CommunityCard({
  actionSlot,
  author,
  authorRole,
  category,
  dateLabel,
  description,
  imageUri,
  location,
  onPress,
  title,
  verificationState = "verified",
  visualLabel
}: CommunityCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.visualArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.visualFallback}>
            <AppIcon name="hand-heart-outline" size={28} tone="success" />
          </View>
        )}
        <View style={styles.visualOverlay}>
          <StatusPill label={category} tone="success" />
          {visualLabel ? <Text style={styles.visualLabel}>{visualLabel}</Text> : null}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={3} style={styles.description}>
          {description}
        </Text>
        <View style={styles.metaRow}>
          <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
          <MetaPill icon="account-outline" label={author} tone="primary" />
          <MetaPill icon="clock-outline" label={dateLabel} tone="warning" />
        </View>
        <View style={styles.footerRow}>
          {authorRole ? (
            <MetaPill icon="account-group-outline" label={authorRole} tone="neutral" />
          ) : null}
          <VerificationBadge state={verificationState} />
        </View>
      </View>

      {actionSlot}
    </Pressable>
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
  content: {
    gap: spacing.tight
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    justifyContent: "space-between"
  },
  image: {
    height: "100%",
    width: "100%"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  pressed: {
    opacity: 0.92
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  visualArea: {
    backgroundColor: "#FFF7ED",
    borderRadius: radius.large,
    minHeight: 148,
    overflow: "hidden",
    position: "relative"
  },
  visualFallback: {
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    flex: 1,
    justifyContent: "center"
  },
  visualLabel: {
    color: colors.textInverse,
    ...typography.caption
  },
  visualOverlay: {
    backgroundColor: "#0F172A55",
    bottom: 0,
    gap: spacing.tight,
    left: 0,
    minHeight: 72,
    padding: spacing.standard,
    position: "absolute",
    right: 0
  }
});
