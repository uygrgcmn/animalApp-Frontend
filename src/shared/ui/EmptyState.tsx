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
      <AppIcon name={icon} size={24} />
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
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: spacing.standard,
    padding: spacing.comfortable
  },
  description: {
    color: colors.textMuted,
    ...typography.body,
    textAlign: "center"
  },
  texts: {
    gap: spacing.tight
  },
  title: {
    color: colors.text,
    ...typography.h3,
    textAlign: "center"
  }
});
