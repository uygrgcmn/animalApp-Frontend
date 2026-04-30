import { useCallback } from "react";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";

type AppButtonProps = {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  leftSlot?: ReactNode;
};

export function AppButton({
  disabled = false,
  label,
  loading = false,
  onPress,
  size = "md",
  variant = "primary",
  leftSlot
}: AppButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, { damping: 18, stiffness: 450 });
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 450 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const isDisabled = disabled || loading;

  const spinnerColor =
    variant === "primary" || variant === "danger" || variant === "accent"
      ? colors.textInverse
      : colors.primary;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.base,
          size === "sm" && styles.sm,
          size === "lg" && styles.lg,
          variant === "primary" && styles.primary,
          variant === "secondary" && styles.secondary,
          variant === "ghost" && styles.ghost,
          variant === "danger" && styles.danger,
          variant === "accent" && styles.accentVariant,
          isDisabled && styles.disabled
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <>
              {leftSlot}
              <Text
                style={[
                  styles.label,
                  size === "sm" && styles.labelSm,
                  size === "lg" && styles.labelLg,
                  variant === "primary" && styles.primaryLabel,
                  variant === "danger" && styles.dangerLabel,
                  variant === "accent" && styles.accentLabel,
                  (variant === "secondary" || variant === "ghost") && styles.secondaryLabel
                ]}
              >
                {label}
              </Text>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    paddingVertical: 15
  },
  sm: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  lg: {
    minHeight: 60,
    paddingHorizontal: spacing.xl
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center"
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent"
  },
  danger: {
    backgroundColor: colors.error,
    borderColor: colors.error
  },
  accentVariant: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  disabled: {
    opacity: 0.4
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.1
  },
  labelSm: {
    fontSize: 14
  },
  labelLg: {
    fontSize: 18
  },
  primaryLabel: {
    color: colors.textInverse
  },
  secondaryLabel: {
    color: colors.text
  },
  dangerLabel: {
    color: colors.textInverse
  },
  accentLabel: {
    color: colors.textInverse
  }
});
