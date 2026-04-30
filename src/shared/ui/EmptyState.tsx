import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type EmptyStateProps = {
  actionSlot?: ReactNode;
  description: string;
  icon: AppIconName;
  title: string;
};

export function EmptyState({ actionSlot, description, icon, title }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <AppIcon name={icon} size={28} tone="neutral" />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {actionSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["2xl"]
  },
  description: {
    color: colors.textMuted,
    ...typography.body,
    textAlign: "center"
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  texts: {
    alignItems: "center",
    gap: spacing.sm
  },
  title: {
    color: colors.textSecondary,
    ...typography.subheading,
    textAlign: "center"
  }
});
