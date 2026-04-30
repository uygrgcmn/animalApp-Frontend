import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
            <AppIcon name="hand-heart-outline" size={36} tone="success" />
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(9,9,11,0.6)"]}
          style={styles.visualOverlay}
        >
          <StatusPill label={category} tone="success" />
          {visualLabel ? <Text style={styles.visualLabel}>{visualLabel}</Text> : null}
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.description}>{description}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
            <MetaPill icon="clock-outline" label={dateLabel} tone="warning" />
          </View>
          <View style={styles.metaRow}>
            <MetaPill
              icon="account-outline"
              label={authorRole ? `${author} · ${authorRole}` : author}
              tone="primary"
            />
            <VerificationBadge state={verificationState} />
          </View>
        </View>
      </View>

      {actionSlot && <View style={styles.actionArea}>{actionSlot}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionArea: {
    marginTop: spacing.sm
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    padding: spacing.md,
    width: "100%"
  },
  content: {
    gap: spacing.sm,
    marginTop: spacing.md
  },
  description: {
    color: colors.textMuted,
    minHeight: 44,
    ...typography.body
  },
  image: {
    height: "100%",
    width: "100%"
  },
  metaContainer: {
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  pressed: {
    opacity: 0.9
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  visualArea: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    height: 168,
    overflow: "hidden",
    position: "relative"
  },
  visualFallback: {
    alignItems: "center",
    backgroundColor: colors.successSoft,
    flex: 1,
    justifyContent: "center"
  },
  visualLabel: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: "600"
  },
  visualOverlay: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: spacing.sm,
    position: "absolute",
    right: 0
  }
});
