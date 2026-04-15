import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppButton } from "./AppButton";
import { AppIcon, type AppIconName } from "./AppIcon";
import { ModeBadge } from "./ModeBadge";

type ModeOverviewCardProps = {
  actionHref: any;
  actionLabel: string;
  completion: number;
  description: string;
  icon: AppIconName;
  statusLabel: string;
  statusTone: "muted" | "success" | "warning";
  title: string;
};

export function ModeOverviewCard({
  actionHref,
  actionLabel,
  completion,
  description,
  icon,
  statusLabel,
  statusTone,
  title
}: ModeOverviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <AppIcon name={icon} size={22} color={colors.primary} />
          <View style={styles.iconBg} />
        </View>
        <ModeBadge label={statusLabel} tone={statusTone} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Tamamlanma</Text>
          <Text style={styles.progressPercent}>%{completion}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${completion}%` }]} />
        </View>
      </View>

      <Link href={actionHref} asChild>
        <AppButton label={actionLabel} variant="secondary" />
      </Link>
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
    padding: spacing.standard,
    width: "48%"
  },
  content: {
    gap: spacing.micro
  },
  description: {
    color: colors.textMuted,
    ...typography.body,
    fontSize: 13,
    lineHeight: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    opacity: 0.6
  },
  iconContainer: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40
  },
  progressBarBg: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    height: 6,
    overflow: "hidden"
  },
  progressBarFill: {
    backgroundColor: colors.primary,
    height: "100%"
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  progressPercent: {
    color: colors.primary,
    ...typography.caption
  },
  progressSection: {
    gap: spacing.micro
  },
  progressText: {
    color: colors.textSubtle,
    ...typography.caption
  },
  title: {
    color: colors.text,
    ...typography.h3,
    fontSize: 17
  }
});
