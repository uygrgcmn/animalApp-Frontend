import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";

type InfoCardProps = PropsWithChildren<{
  description?: string;
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
          {description ? <Text style={styles.description}>{description}</Text> : null}
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
    borderRadius: radius.xl,
    gap: spacing.md,
    padding: spacing.lg
  },
  accentCard: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: 1
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  texts: {
    flex: 1,
    gap: spacing.sm
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
    gap: spacing.sm
  }
});
