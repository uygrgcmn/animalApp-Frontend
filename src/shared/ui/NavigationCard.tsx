import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";
import type { AppIconName } from "./AppIcon";

type NavigationCardProps = {
  description: string;
  icon: AppIconName;
  iconColor?: string;
  rightMeta?: ReactNode;
  title: string;
} & PressableProps;

export function NavigationCard({
  description,
  icon,
  iconColor = colors.primary,
  rightMeta,
  title,
  ...pressableProps
}: NavigationCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
      {...pressableProps}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}18` }]}>
        <MaterialCommunityIcons color={iconColor} name={icon as any} size={20} />
      </View>

      <View style={styles.content}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={1} style={styles.description}>{description}</Text>
        </View>

        <View style={styles.trailing}>
          {rightMeta}
          <MaterialCommunityIcons color={colors.textSubtle} name="chevron-right" size={18} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2
  },
  content: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.sm + 2
  },
  description: {
    color: colors.textMuted,
    ...typography.caption
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  pressed: {
    opacity: 0.65
  },
  texts: {
    flex: 1,
    gap: 3
  },
  title: {
    color: colors.text,
    ...typography.bodyStrong
  },
  trailing: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  }
});
