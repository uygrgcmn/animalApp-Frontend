import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type MetricCardProps = {
  caption: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: AppIconName;
  title: string;
  tone?: "primary" | "success" | "warning" | "neutral";
  value: string;
};

export function MetricCard({
  caption,
  delta,
  deltaPositive,
  icon,
  title,
  tone = "primary",
  value
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppIcon name={icon} tone={tone} />
        {delta ? (
          <View
            style={[
              styles.deltaPill,
              deltaPositive ? styles.deltaPositive : styles.deltaNeutral
            ]}
          >
            <Text
              style={[
                styles.deltaText,
                deltaPositive ? styles.deltaPositiveText : styles.deltaNeutralText
              ]}
            >
              {delta}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.texts}>
        <Text style={styles.value}>{value}</Text>
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
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.compact,
    minHeight: 120,
    padding: spacing.standard
  },
  deltaNeutral: {
    backgroundColor: colors.surfaceMuted
  },
  deltaNeutralText: {
    color: colors.textMuted
  },
  deltaPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.tight,
    paddingVertical: 3
  },
  deltaPositive: {
    backgroundColor: colors.successSoft
  },
  deltaPositiveText: {
    color: colors.success
  },
  deltaText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2
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
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600"
  },
  value: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5
  }
});
