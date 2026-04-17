import type { ReactNode } from "react";
import type { PressableProps } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";
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
          <Text numberOfLines={1} style={styles.description}>
            {description}
          </Text>
        </View>

        <View style={styles.trailing}>
          {rightMeta}
          <MaterialCommunityIcons color={colors.textTertiary} name="chevron-right" size={18} />
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
    gap: spacing.standard,
    paddingHorizontal: spacing.standard,
    paddingVertical: spacing.compact + 2
  },
  content: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.compact + 2
  },
  description: {
    color: colors.textSubtle,
    fontSize: 13,
    lineHeight: 18
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: radius.medium,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  pressed: {
    opacity: 0.65
  },
  texts: {
    flex: 1,
    gap: 2
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  trailing: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.tight
  }
});
