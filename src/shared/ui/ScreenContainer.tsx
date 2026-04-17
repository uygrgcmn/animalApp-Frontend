import type { PropsWithChildren } from "react";
import type { RefreshControlProps, StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../core/theme/colors";
import { spacing } from "../../core/theme/tokens";

type ScreenContainerProps = PropsWithChildren<{
  contentContainerStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  scrollable?: boolean;
}>;

export function ScreenContainer({
  children,
  contentContainerStyle,
  refreshControl,
  scrollable = true
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>
          {children}
        </View>
      )}
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
    paddingBottom: 110,
    paddingHorizontal: spacing.comfortable,
    paddingTop: spacing.standard
  }
});
