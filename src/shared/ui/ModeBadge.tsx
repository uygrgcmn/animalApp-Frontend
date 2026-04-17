import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";

type ModeBadgeProps = {
  icon?: string;
  label: string;
  tone?: "primary" | "success" | "muted" | "warning";
};

const toneColors: Record<NonNullable<ModeBadgeProps["tone"]>, string> = {
  primary: colors.primary,
  success: colors.success,
  muted: colors.textMuted,
  warning: colors.warning
};

export function ModeBadge({ icon, label, tone = "primary" }: ModeBadgeProps) {
  const iconColor = toneColors[tone];

  return (
    <View
      style={[
        styles.badge,
        tone === "primary" && styles.primaryBadge,
        tone === "success" && styles.successBadge,
        tone === "muted" && styles.mutedBadge,
        tone === "warning" && styles.warningBadge
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons color={iconColor} name={icon as any} size={13} />
      ) : null}
      <Text
        style={[
          styles.text,
          tone === "primary" && styles.primaryText,
          tone === "success" && styles.successText,
          tone === "muted" && styles.mutedText,
          tone === "warning" && styles.warningText
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: spacing.tight
  },
  primaryBadge: {
    backgroundColor: colors.primarySoft
  },
  successBadge: {
    backgroundColor: colors.successSoft
  },
  mutedBadge: {
    backgroundColor: colors.surfaceMuted
  },
  warningBadge: {
    backgroundColor: colors.warningSoft
  },
  text: {
    fontSize: 12,
    fontWeight: "700"
  },
  primaryText: {
    color: colors.primary
  },
  successText: {
    color: colors.success
  },
  mutedText: {
    color: colors.textMuted
  },
  warningText: {
    color: colors.warning
  }
});

