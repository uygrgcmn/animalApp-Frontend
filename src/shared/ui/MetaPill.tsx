import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type MetaPillProps = {
  icon: AppIconName;
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral" | "error";
};

export function MetaPill({ icon, label, tone = "neutral" }: MetaPillProps) {
  return (
    <View
      style={[
        styles.container,
        tone === "primary" && styles.primary,
        tone === "success" && styles.success,
        tone === "warning" && styles.warning,
        tone === "neutral" && styles.neutral,
        tone === "error" && styles.error
      ]}
    >
      <AppIcon backgrounded={false} name={icon} size={12} tone={tone === "error" ? "warning" : tone} />
      <Text
        style={[
          styles.label,
          tone === "primary" && styles.primaryLabel,
          tone === "success" && styles.successLabel,
          tone === "warning" && styles.warningLabel,
          tone === "neutral" && styles.neutralLabel,
          tone === "error" && styles.errorLabel
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  label: {
    fontSize: 12,
    fontWeight: "600"
  },
  neutral: {
    backgroundColor: colors.surfaceMuted
  },
  neutralLabel: {
    color: colors.textSecondary
  },
  primary: {
    backgroundColor: colors.primarySoft
  },
  primaryLabel: {
    color: colors.primary
  },
  success: {
    backgroundColor: colors.successSoft
  },
  successLabel: {
    color: colors.success
  },
  warning: {
    backgroundColor: colors.warningSoft
  },
  warningLabel: {
    color: colors.warning
  },
  error: {
    backgroundColor: colors.errorSoft
  },
  errorLabel: {
    color: colors.error
  }
});
