import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon } from "./AppIcon";
import { StatusPill } from "./StatusPill";
import { MetaPill } from "./MetaPill";
import { VerificationBadge } from "./VerificationBadge";

type PetshopCampaignCardProps = {
  actionSlot?: ReactNode;
  campaignLabel: string;
  deadline: string;
  description: string;
  priceLabel: string;
  storeName: string;
  title: string;
  verificationState?: "verified" | "pending" | "rejected" | "unverified";
  visualLabel?: string;
};

export function PetshopCampaignCard({
  actionSlot,
  campaignLabel,
  deadline,
  description,
  priceLabel,
  storeName,
  title,
  verificationState = "verified",
  visualLabel
}: PetshopCampaignCardProps) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <LinearGradient colors={["#F5F3FF", "#EEF6FF"]} style={styles.visual}>
        <View style={styles.visualTextBlock}>
          <AppIcon name="storefront-outline" size={28} />
          {visualLabel ? <Text style={styles.visualLabel}>{visualLabel}</Text> : null}
        </View>
        <StatusPill label={campaignLabel} tone="warning" />
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.heading}>
          <View style={styles.texts}>
            <Text style={styles.store}>{storeName}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <VerificationBadge state={verificationState} />
        </View>

        <Text numberOfLines={3} style={styles.description}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <MetaPill icon="cash" label={priceLabel} tone="success" />
          <MetaPill icon="calendar-clock-outline" label={deadline} tone="warning" />
        </View>
      </View>

      {actionSlot}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.tight
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    overflow: "hidden",
    padding: spacing.standard
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  heading: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  pressed: {
    opacity: 0.92
  },
  store: {
    color: colors.textSubtle,
    ...typography.caption
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  visual: {
    alignItems: "center",
    borderRadius: radius.large,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 120,
    paddingHorizontal: spacing.standard
  },
  visualLabel: {
    color: colors.textMuted,
    ...typography.caption
  },
  visualTextBlock: {
    gap: spacing.tight
  }
});
