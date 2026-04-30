import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { MetaPill } from "./MetaPill";
import { VerificationBadge } from "./VerificationBadge";

type ListingCardProps = {
  actions?: ReactNode;
  avatarLabel?: string;
  badges?: { icon: Parameters<typeof MetaPill>[0]["icon"]; label: string; tone?: Parameters<typeof MetaPill>[0]["tone"] }[];
  coverImageUri?: string;
  description: string;
  location: string;
  onPress?: () => void;
  priceLabel: string;
  subtitle?: string;
  title: string;
  verificationState?: "verified" | "pending" | "rejected" | "unverified";
};

export function ListingCard({
  actions,
  avatarLabel,
  badges = [],
  coverImageUri,
  description,
  location,
  onPress,
  priceLabel,
  subtitle,
  title,
  verificationState = "verified"
}: ListingCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      {coverImageUri ? (
        <View style={styles.visualArea}>
          <Image source={{ uri: coverImageUri }} style={styles.visualImage} />
          <LinearGradient
            colors={["transparent", "rgba(9,9,11,0.72)"]}
            style={styles.visualOverlay}
          >
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>{priceLabel}</Text>
            </View>
            {avatarLabel ? (
              <View style={styles.avatarChip}>
                <Text style={styles.avatarChipLabel}>{avatarLabel}</Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>
      ) : null}

      <View style={styles.body}>
        {!coverImageUri ? (
          <View style={styles.noImageHeader}>
            <View style={styles.avatar}>
              {avatarLabel ? (
                <Text style={styles.avatarLabel}>{avatarLabel}</Text>
              ) : null}
            </View>
            <View style={styles.priceTagInline}>
              <Text style={styles.priceTagInlineText}>{priceLabel}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
          <VerificationBadge state={verificationState} />
        </View>

        <Text numberOfLines={2} style={styles.description}>{description}</Text>

        <View style={styles.footer}>
          <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
          {badges.map((badge) => (
            <MetaPill key={`${badge.label}-${badge.icon}`} {...badge} />
          ))}
        </View>

        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarChip: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.md,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  avatarChipLabel: {
    color: colors.textInverse,
    ...typography.label
  },
  avatarLabel: {
    color: colors.primary,
    ...typography.bodyStrong
  },
  body: {
    gap: spacing.sm,
    padding: spacing.md
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden"
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  noImageHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  pressed: {
    opacity: 0.88
  },
  priceTag: {
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  priceTagInline: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  priceTagInlineText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700"
  },
  priceTagText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "700"
  },
  subtitle: {
    color: colors.textMuted,
    ...typography.caption
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  visualArea: {
    height: 216,
    overflow: "hidden",
    position: "relative"
  },
  visualImage: {
    height: "100%",
    width: "100%"
  },
  visualOverlay: {
    alignItems: "flex-end",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: spacing.md,
    position: "absolute",
    right: 0
  }
});
