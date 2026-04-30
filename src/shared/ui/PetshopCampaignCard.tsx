import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
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
  coverImageUri?: string;
  deadline: string;
  description: string;
  onPress?: () => void;
  priceLabel: string;
  storeName: string;
  title: string;
  verificationState?: "verified" | "pending" | "rejected" | "unverified";
  visualLabel?: string;
};

export function PetshopCampaignCard({
  actionSlot,
  campaignLabel,
  coverImageUri,
  deadline,
  description,
  onPress,
  priceLabel,
  storeName,
  title,
  verificationState = "verified",
  visualLabel
}: PetshopCampaignCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      {coverImageUri ? (
        <View style={styles.visualArea}>
          <Image source={{ uri: coverImageUri }} style={styles.visualImage} />
          <LinearGradient
            colors={["transparent", "rgba(9,9,11,0.60)"]}
            style={styles.visualOverlay}
          >
            <StatusPill label={campaignLabel} tone="warning" />
            {visualLabel ? <Text style={styles.visualLabel}>{visualLabel}</Text> : null}
          </LinearGradient>
        </View>
      ) : (
        <LinearGradient
          colors={[colors.accentSoft, colors.primarySoft]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.visual}
        >
          <View style={styles.visualTextBlock}>
            <AppIcon name="storefront-outline" size={28} tone="primary" />
            {visualLabel ? <Text style={styles.visualLabelMuted}>{visualLabel}</Text> : null}
          </View>
          <StatusPill label={campaignLabel} tone="warning" />
        </LinearGradient>
      )}

      <View style={styles.body}>
        <View style={styles.heading}>
          <View style={styles.texts}>
            <Text style={styles.store}>{storeName}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <VerificationBadge state={verificationState} />
        </View>

        <Text numberOfLines={2} style={styles.description}>{description}</Text>

        <View style={styles.metaRow}>
          <MetaPill icon="tag-outline" label={priceLabel} tone="warning" />
          <MetaPill icon="calendar-clock-outline" label={deadline} tone="neutral" />
        </View>
      </View>

      {actionSlot}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.sm
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.md
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  heading: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  pressed: {
    opacity: 0.9
  },
  store: {
    color: colors.primary,
    ...typography.caption,
    fontWeight: "700"
  },
  texts: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  visual: {
    alignItems: "center",
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 120,
    paddingHorizontal: spacing.md
  },
  visualArea: {
    borderRadius: radius.lg,
    height: 168,
    overflow: "hidden",
    position: "relative"
  },
  visualImage: {
    height: "100%",
    width: "100%"
  },
  visualLabel: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: "600"
  },
  visualLabelMuted: {
    color: colors.textMuted,
    ...typography.caption
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
  },
  visualTextBlock: {
    gap: spacing.sm
  }
});
