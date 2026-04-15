import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";
import { StatusPill, type StatusPillTone } from "./StatusPill";

type ModeMetaItem = {
  icon: AppIconName;
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

type ModeDetailItem = {
  label: string;
  statusLabel: string;
  tone?: StatusPillTone;
};

type ModeStatusCardProps = {
  actionSlot?: ReactNode;
  completion: number;
  description: string;
  detailItems?: ModeDetailItem[];
  detailTitle?: string;
  emptyMissingLabel?: string;
  icon: AppIconName;
  metaItems?: ModeMetaItem[];
  missingItems: string[];
  statusLabel: string;
  statusTone?: StatusPillTone;
  supportingText?: string;
  title: string;
};

export function ModeStatusCard({
  actionSlot,
  completion,
  description,
  detailItems,
  detailTitle,
  emptyMissingLabel = "Tum zorunlu alanlar hazir.",
  icon,
  metaItems,
  missingItems,
  statusLabel,
  statusTone = "neutral",
  supportingText,
  title
}: ModeStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leading}>
          <AppIcon name={icon} size={22} />
          <View style={styles.texts}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
        <StatusPill label={statusLabel} tone={statusTone} />
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(Math.max(completion, 0), 100)}%` }]} />
        </View>
        <Text style={styles.progressLabel}>Tamamlanma %{completion}</Text>
      </View>

      {metaItems?.length ? (
        <View style={styles.metaRow}>
          {metaItems.map((item) => (
            <View key={item.label} style={styles.metaItem}>
              <AppIcon name={item.icon} size={16} tone={item.tone ?? "neutral"} />
              <Text style={styles.metaText}>{item.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eksik alanlar</Text>
        <View style={styles.missingList}>
          {missingItems.length > 0 ? (
            missingItems.map((item) => (
              <View key={item} style={styles.missingItem}>
                <View style={styles.missingDot} />
                <Text style={styles.missingText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.completeText}>{emptyMissingLabel}</Text>
          )}
        </View>
      </View>

      {detailItems?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{detailTitle ?? "Durum detaylari"}</Text>
          <View style={styles.detailList}>
            {detailItems.map((item) => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <StatusPill label={item.statusLabel} tone={item.tone ?? "neutral"} />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {supportingText ? <Text style={styles.supportingText}>{supportingText}</Text> : null}

      <View style={styles.actionWrap}>{actionSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionWrap: {
    gap: spacing.compact
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
  completeText: {
    color: colors.success,
    ...typography.bodyStrong
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  detailItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  detailLabel: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  detailList: {
    gap: spacing.tight
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  leading: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.compact
  },
  metaItem: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 40,
    paddingHorizontal: spacing.compact
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  metaText: {
    color: colors.text,
    ...typography.caption
  },
  missingDot: {
    backgroundColor: colors.warning,
    borderRadius: radius.pill,
    height: 8,
    marginTop: 7,
    width: 8
  },
  missingItem: {
    flexDirection: "row",
    gap: spacing.tight
  },
  missingList: {
    gap: spacing.tight
  },
  missingText: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  progressFill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 8
  },
  progressLabel: {
    color: colors.textSubtle,
    ...typography.caption
  },
  progressTrack: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    height: 8,
    overflow: "hidden"
  },
  progressWrap: {
    gap: spacing.tight
  },
  section: {
    gap: spacing.tight
  },
  sectionTitle: {
    color: colors.text,
    ...typography.label
  },
  supportingText: {
    color: colors.textMuted,
    ...typography.body
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  title: {
    color: colors.text,
    ...typography.h3
  }
});
