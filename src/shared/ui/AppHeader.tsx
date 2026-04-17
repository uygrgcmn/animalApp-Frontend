import type { ReactNode } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";

type AppHeaderProps = {
  description?: string;
  rightSlot?: ReactNode;
  showBackButton?: boolean;
  title: string;
};

export function AppHeader({
  description,
  rightSlot,
  showBackButton = false,
  title
}: AppHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {showBackButton ? (
          <Pressable
            accessibilityLabel="Geri git"
            onPress={() => {
              router.back();
            }}
            style={styles.backButton}
          >
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={20} />
          </Pressable>
        ) : null}

        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  rightSlot: {
    marginLeft: spacing.compact
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  title: {
    color: colors.text,
    ...typography.h1
  },
  wrapper: {
    gap: spacing.tight
  }
});
