import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";

export type StatusPillTone =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

type StatusPillProps = {
  label: string;
  tone?: StatusPillTone;
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <View
      style={[
        styles.base,
        tone === "primary" && styles.primary,
        tone === "success" && styles.success,
        tone === "warning" && styles.warning,
        tone === "error" && styles.error,
        tone === "info" && styles.info,
        tone === "neutral" && styles.neutral
      ]}
    >
      <View
        style={[
          styles.dot,
          tone === "primary" && styles.primaryDot,
          tone === "success" && styles.successDot,
          tone === "warning" && styles.warningDot,
          tone === "error" && styles.errorDot,
          tone === "info" && styles.infoDot,
          tone === "neutral" && styles.neutralDot
        ]}
      />
      <Text
        style={[
          styles.label,
          tone === "primary" && styles.primaryLabel,
          tone === "success" && styles.successLabel,
          tone === "warning" && styles.warningLabel,
          tone === "error" && styles.errorLabel,
          tone === "info" && styles.infoLabel,
          tone === "neutral" && styles.neutralLabel
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 32,
    paddingHorizontal: 12
  },
  dot: {
    borderRadius: radius.pill,
    height: 8,
    width: 8
  },
  error: { backgroundColor: colors.errorSoft },
  errorDot: { backgroundColor: colors.error },
  errorLabel: { color: colors.error },
  info: { backgroundColor: colors.infoSoft },
  infoDot: { backgroundColor: colors.info },
  infoLabel: { color: colors.info },
  label: {
    ...typography.caption
  },
  neutral: { backgroundColor: colors.surfaceMuted },
  neutralDot: { backgroundColor: colors.textSubtle },
  neutralLabel: { color: colors.textMuted },
  primary: { backgroundColor: colors.primarySoft },
  primaryDot: { backgroundColor: colors.primary },
  primaryLabel: { color: colors.primary },
  success: { backgroundColor: colors.successSoft },
  successDot: { backgroundColor: colors.success },
  successLabel: { color: colors.success },
  warning: { backgroundColor: colors.warningSoft },
  warningDot: { backgroundColor: colors.warning },
  warningLabel: { color: colors.warning }
});
