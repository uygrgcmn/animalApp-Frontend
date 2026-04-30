import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";
import { MetaPill } from "./MetaPill";

type MarketplaceCardProps = {
  chips: {
    icon: AppIconName;
    label: string;
    tone?: "primary" | "success" | "warning" | "neutral";
  }[];
  coverImageUri?: string;
  icon: AppIconName;
  onPress?: () => void;
  summary: string;
  title: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

export function MarketplaceCard({
  chips,
  coverImageUri,
  icon,
  onPress,
  summary,
  title,
  tone = "primary"
}: MarketplaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      {coverImageUri ? (
        <View style={styles.visualArea}>
          <Image source={{ uri: coverImageUri }} style={styles.visualImage} />
        </View>
      ) : null}
      <View style={styles.header}>
        <AppIcon name={icon} size={22} tone={tone} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.summary}>{summary}</Text>
      <View style={styles.chips}>
        {chips.map((chip) => (
          <MetaPill
            key={`${chip.icon}-${chip.label}`}
            icon={chip.icon}
            label={chip.label}
            tone={chip.tone}
          />
        ))}
      </View>
    </Pressable>
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
    padding: spacing.standard
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  pressed: {
    opacity: 0.92
  },
  summary: {
    color: colors.textMuted,
    ...typography.body
  },
  title: {
    color: colors.text,
    flex: 1,
    ...typography.subheading
  },
  visualArea: {
    borderRadius: radius.md,
    height: 180,
    overflow: "hidden"
  },
  visualImage: {
    height: "100%",
    width: "100%"
  }
});
