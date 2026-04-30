import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { shadows, spacing } from "../../core/theme/tokens";

type StickyBottomActionBarProps = PropsWithChildren<{
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function StickyBottomActionBar({
  bottomOffset = 0,
  children,
  style
}: StickyBottomActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          marginBottom: bottomOffset,
          paddingBottom: Math.max(insets.bottom, spacing.standard)
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...shadows.floating,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.compact,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.standard
  }
});
