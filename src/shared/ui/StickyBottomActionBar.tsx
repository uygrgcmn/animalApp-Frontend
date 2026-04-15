import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { shadows, spacing } from "../../core/theme/tokens";

export function StickyBottomActionBar({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing.standard)
        }
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
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  }
});
