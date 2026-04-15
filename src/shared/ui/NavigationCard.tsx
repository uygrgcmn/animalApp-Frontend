import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type NavigationCardProps = {
  description: string;
  icon: AppIconName;
  rightMeta?: ReactNode;
  title: string;
} & PressableProps;

export function NavigationCard({
  description,
  icon,
  rightMeta,
  title,
  ...pressableProps
}: NavigationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
      {...pressableProps}
    >
      <View style={styles.leading}>
        <AppIcon name={icon} size={20} />
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={styles.trailing}>
        {rightMeta}
        <MaterialCommunityIcons color={colors.textSubtle} name="chevron-right" size={20} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 84,
    padding: spacing.standard
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20
  },
  leading: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing.compact
  },
  pressed: {
    opacity: 0.92
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  trailing: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight
  }
});
