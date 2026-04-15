import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { spacing, typography } from "../../core/theme/tokens";
import { InfoCard } from "./InfoCard";

type ManagementItemCardProps = {
  actions?: ReactNode;
  description: string;
  pills?: ReactNode;
  rightSlot?: ReactNode;
  supportingText?: string;
  title: string;
  variant?: "default" | "accent";
};

export function ManagementItemCard({
  actions,
  description,
  pills,
  rightSlot,
  supportingText,
  title,
  variant = "default"
}: ManagementItemCardProps) {
  return (
    <InfoCard
      description={description}
      rightSlot={rightSlot}
      title={title}
      variant={variant}
    >
      {pills ? <View style={styles.pills}>{pills}</View> : null}
      {supportingText ? <Text style={styles.supportingText}>{supportingText}</Text> : null}
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  supportingText: {
    color: colors.textMuted,
    ...typography.body
  }
});
