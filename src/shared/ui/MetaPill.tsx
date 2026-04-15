import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type MetaPillProps = {
  icon: AppIconName;
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

export function MetaPill({ icon, label, tone = "neutral" }: MetaPillProps) {
  return (
    <View
      style={[
        styles.container,
        tone === "primary" && styles.primary,
        tone === "success" && styles.success,
        tone === "warning" && styles.warning,
        tone === "neutral" && styles.neutral
      ]}
    >
      <AppIcon backgrounded={false} name={icon} size={14} tone={tone} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.micro,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  },
  neutral: {
    backgroundColor: colors.surfaceMuted
  },
  primary: {
    backgroundColor: colors.primarySoft
  },
  success: {
    backgroundColor: colors.successSoft
  },
  warning: {
    backgroundColor: colors.warningSoft
  }
});
