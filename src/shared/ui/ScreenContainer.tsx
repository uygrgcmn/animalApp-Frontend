import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { spacing } from "../../core/theme/tokens";

type ScreenContainerProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function ScreenContainer({ children, contentContainerStyle }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    gap: spacing.section,
    paddingBottom: spacing.large,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  }
});

