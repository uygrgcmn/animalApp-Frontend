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
            colors={["transparent", "rgba(15,23,42,0.60)"]}
            style={styles.visualOverlay}
          >
            <StatusPill label={campaignLabel} tone="warning" />
            {visualLabel ? <Text style={styles.visualLabel}>{visualLabel}</Text> : null}
          </LinearGradient>
        </View>
      ) : (
        <LinearGradient
          colors={["#FFF7ED", "#F0FDFA"]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.visual}
        >
          <View style={styles.visualTextBlock}>
            <AppIcon name="storefront-outline" size={28} />
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

        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>

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
    gap: spacing.tight
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
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
    color: colors.primary,
    ...typography.caption,
    fontWeight: "600"
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
  visualArea: {
    borderRadius: radius.medium,
    height: 160,
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
    padding: spacing.compact,
    position: "absolute",
    right: 0
  },
  visualTextBlock: {
    gap: spacing.tight
  }
});
