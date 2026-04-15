import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  leftSlot?: ReactNode;
};

export function AppButton({
  disabled = false,
  label,
  onPress,
  variant = "primary",
  leftSlot
}: AppButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <View style={styles.content}>
        {leftSlot}
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.primaryLabel,
            variant !== "primary" && styles.secondaryLabel
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.large,
    borderWidth: 1,
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.standard
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight,
    justifyContent: "center"
  },
  primary: {
    ...shadows.card,
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong
  },
  ghost: {
    backgroundColor: colors.surfaceAlt,
    borderColor: "transparent"
  },
  pressed: {
    opacity: 0.92
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    fontSize: 15,
    fontWeight: "700"
  },
  primaryLabel: {
    color: colors.textInverse
  },
  secondaryLabel: {
    color: colors.text
  }
});

