import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon } from "./AppIcon";
import { MetaPill } from "./MetaPill";
import { VerificationBadge } from "./VerificationBadge";

type ListingCardProps = {
  actions?: ReactNode;
  avatarLabel?: string;
  badges?: { icon: Parameters<typeof MetaPill>[0]["icon"]; label: string; tone?: Parameters<typeof MetaPill>[0]["tone"] }[];
  description: string;
  location: string;
  priceLabel: string;
  subtitle?: string;
  title: string;
  verificationState?: "verified" | "pending" | "rejected" | "unverified";
};

export function ListingCard({
  actions,
  avatarLabel,
  badges = [],
  description,
  location,
  priceLabel,
  subtitle,
  title,
  verificationState = "verified"
}: ListingCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {avatarLabel ? (
            <Text style={styles.avatarLabel}>{avatarLabel}</Text>
          ) : (
            <AppIcon backgrounded={false} name="account-outline" size={26} />
          )}
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.metaRow}>
            <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
            <MetaPill icon="cash" label={priceLabel} tone="success" />
          </View>
        </View>
      </View>

      <Text numberOfLines={3} style={styles.description}>
        {description}
      </Text>

      <View style={styles.footer}>
        <VerificationBadge state={verificationState} />
        <View style={styles.badgeRow}>
          {badges.map((badge) => (
            <MetaPill key={`${badge.label}-${badge.icon}`} {...badge} />
          ))}
        </View>
      </View>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.tight
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.large,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  avatarLabel: {
    color: colors.primary,
    ...typography.bodyStrong
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.standard
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  footer: {
    gap: spacing.tight
  },
  header: {
    flexDirection: "row",
    gap: spacing.compact
  },
  headerTexts: {
    flex: 1,
    gap: spacing.tight
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  pressed: {
    opacity: 0.92
  },
  subtitle: {
    color: colors.textSubtle,
    ...typography.caption
  },
  title: {
    color: colors.text,
    ...typography.h3
  }
});
