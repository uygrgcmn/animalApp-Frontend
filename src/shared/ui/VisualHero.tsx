import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";
import { MetaPill } from "./MetaPill";

type HeroMetric = {
  icon: AppIconName;
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

type VisualHeroProps = {
  description: string;
  icon: AppIconName;
  metrics?: HeroMetric[];
  title: string;
};

export function VisualHero({ description, icon, metrics = [], title }: VisualHeroProps) {
  return (
    <LinearGradient
      colors={[colors.primarySoft, colors.backgroundAccent, colors.surface]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.iconArea}>
        <LinearGradient
          colors={[colors.primary, "#2DD4BF"]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.iconShell}
        >
          <AppIcon backgrounded={false} name={icon} size={36} color={colors.textInverse} />
        </LinearGradient>
        <View style={styles.iconRing} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {metrics.length ? (
        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <MetaPill
              key={`${metric.icon}-${metric.label}`}
              icon={metric.icon}
              label={metric.label}
              tone={metric.tone}
            />
          ))}
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    borderRadius: radius.xlarge,
    gap: spacing.compact,
    overflow: "hidden",
    padding: spacing.comfortable,
    paddingTop: spacing.large
  },
  iconArea: {
    alignSelf: "flex-start",
    marginBottom: spacing.compact
  },
  iconShell: {
    alignItems: "center",
    borderRadius: radius.large + 2,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  iconRing: {
    borderColor: colors.primaryBorder,
    borderRadius: radius.large + 6,
    borderWidth: 1,
    bottom: -4,
    left: -4,
    position: "absolute",
    right: -4,
    top: -4
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    maxWidth: "94%"
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    marginTop: spacing.micro
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 38
  }
});
