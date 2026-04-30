import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type QuickActionCardProps = {
  description: string;
  href: any; // Type-safe routes are usually complex, using any for brevity in this step
  icon: AppIconName;
  title: string;
};

export function QuickActionCard({ description, href, icon, title }: QuickActionCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
        <View style={styles.iconContainer}>
          <AppIcon name={icon} size={24} color={colors.primary} />
          <View style={styles.iconBg} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.standard,
    minHeight: 160,
    padding: spacing.standard,
    width: "48%"
  },
  content: {
    gap: spacing.micro
  },
  description: {
    color: colors.textMuted,
    ...typography.body,
    fontSize: 13,
    lineHeight: 18
  },
  iconBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    opacity: 0.5,
    transform: [{ rotate: "12deg" }]
  },
  iconContainer: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 48
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }]
  },
  title: {
    color: colors.text,
    ...typography.h3,
    fontSize: 16
  }
});
