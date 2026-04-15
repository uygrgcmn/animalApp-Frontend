import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";

type InfoCardProps = PropsWithChildren<{
  description: string;
  rightSlot?: ReactNode;
  title: string;
  variant?: "default" | "accent";
}>;

export function InfoCard({
  title,
  description,
  rightSlot,
  variant = "default",
  children
}: InfoCardProps) {
  return (
    <View style={[styles.card, variant === "accent" ? styles.accentCard : null]}>
      <View style={styles.header}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {rightSlot}
      </View>
      {children ? <View style={styles.body}>{children}</View> : null}
    </View>
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
    padding: spacing.comfortable
  },
  accentCard: {
    backgroundColor: colors.backgroundAccent,
    borderColor: colors.primaryBorder
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  texts: {
    flex: 1,
    gap: 6
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  body: {
    gap: spacing.compact
  }
});

