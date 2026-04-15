import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";

type ModeBadgeProps = {
  label: string;
  tone?: "primary" | "success" | "muted" | "warning";
};

export function ModeBadge({ label, tone = "primary" }: ModeBadgeProps) {
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

