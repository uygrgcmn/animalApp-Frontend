import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";
import { MetaPill } from "./MetaPill";

type MarketplaceCardProps = {
  chips: {
    icon: AppIconName;
    label: string;
    tone?: "primary" | "success" | "warning" | "neutral";
  }[];
  icon: AppIconName;
  summary: string;
  title: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

export function MarketplaceCard({
  chips,
  icon,
  summary,
  title,
  tone = "primary"
}: MarketplaceCardProps) {
  return (
    <View style={styles.card}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
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
  summary: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800"
  }
});
