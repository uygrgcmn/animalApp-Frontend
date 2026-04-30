import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { AppIcon } from "../../../shared/ui/AppIcon";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <AppIcon name="paw" backgrounded={false} color={colors.textInverse} size={30} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>Animal App</Text>
        <Text style={styles.description}>
          Guven veren bakici, topluluk ve petshop deneyimi hazirlaniyor.
        </Text>
      </View>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 28,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  description: {
    color: colors.textMuted,
    ...typography.body,
    textAlign: "center"
  },
  dot: {
    backgroundColor: colors.primaryBorder,
    borderRadius: 999,
    height: 8,
    width: 8
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24
  },
  dots: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight
  },
  texts: {
    gap: spacing.tight,
    marginBottom: spacing.xl,
    marginTop: spacing.xl
  },
  title: {
    color: colors.text,
    ...typography.display,
    textAlign: "center"
  }
});
