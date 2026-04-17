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
  variant?: "primary" | "secondary" | "ghost" | "danger";
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
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    }
  }, [disabled, loading, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const isDisabled = disabled || loading;

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
          isDisabled && styles.disabled
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === "primary" || variant === "danger" ? colors.textInverse : colors.primary}
            />
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
    minHeight: 52,
    paddingHorizontal: spacing.comfortable,
    paddingVertical: 14
  },
  sm: {
    minHeight: 38,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.tight
  },
  lg: {
    minHeight: 58,
    paddingHorizontal: spacing.section
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight,
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
  disabled: {
    opacity: 0.45
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1
  },
  labelSm: {
    fontSize: 13
  },
  labelLg: {
    fontSize: 17
  },
  primaryLabel: {
    color: colors.textInverse
  },
  secondaryLabel: {
    color: colors.text
  },
  dangerLabel: {
    color: colors.textInverse
  }
});
