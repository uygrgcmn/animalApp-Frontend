import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius } from "../../core/theme/tokens";

export type AppIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type AppIconProps = {
  backgrounded?: boolean;
  color?: string;
  name: AppIconName;
  size?: number;
  tone?: "primary" | "success" | "warning" | "neutral";
};

export function AppIcon({
  backgrounded = true,
  color,
  name,
  size = 20,
  tone = "primary"
}: AppIconProps) {
  const resolvedColor =
    color ??
    (tone === "primary"
      ? colors.primary
      : tone === "success"
        ? colors.success
        : tone === "warning"
          ? colors.warning
          : colors.textMuted);

  if (!backgrounded) {
    return <MaterialCommunityIcons color={resolvedColor} name={name} size={size} />;
  }

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
      <MaterialCommunityIcons color={resolvedColor} name={name} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44
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
