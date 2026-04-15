import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type MetricCardProps = {
  caption: string;
  icon: AppIconName;
  title: string;
  tone?: "primary" | "success" | "warning" | "neutral";
  value: string;
};

export function MetricCard({
  caption,
  icon,
  title,
  tone = "primary",
  value
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppIcon name={icon} tone={tone} />
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 18
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    gap: spacing.standard,
    minHeight: 138,
    padding: spacing.standard
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  texts: {
    gap: spacing.micro
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800"
  }
});
