import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from "react-native-svg";

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
      colors={[colors.surface, colors.backgroundAccent]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
    >
      <View style={styles.artwork}>
        <Svg height="160" style={StyleSheet.absoluteFillObject} width="240">
          <Defs>
            <SvgLinearGradient id="heroAccent" x1="0%" x2="100%" y1="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.05" />
            </SvgLinearGradient>
            <SvgLinearGradient id="circleAccent" x1="0%" x2="100%" y1="0%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="180" cy="40" fill="url(#heroAccent)" r="60" />
          <Circle cx="140" cy="120" fill="url(#circleAccent)" r="40" />
          <Rect fill={colors.surface} opacity="0.6" height="80" rx="32" ry="32" width="80" x="110" y="30" />
          <Circle cx="190" cy="100" fill={colors.primary} opacity="0.03" r="30" />
        </Svg>
        <View style={styles.iconShell}>
          <AppIcon name={icon} size={40} color={colors.primary} />
          <View style={styles.iconRing} />
        </View>
      </View>

      <View style={styles.content}>
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  artwork: {
    alignItems: "flex-end",
    height: 110,
    justifyContent: "center",
    overflow: "hidden"
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xlarge,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.comfortable,
    paddingTop: spacing.standard
  },
  content: {
    gap: spacing.tight,
    marginTop: -spacing.compact
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: "92%"
  },
  iconRing: {
    ...StyleSheet.absoluteFillObject,
    borderColor: colors.primarySoft,
    borderRadius: 30,
    borderWidth: 1,
    margin: -4,
    opacity: 0.5
  },
  iconShell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 26,
    height: 72,
    justifyContent: "center",
    marginRight: spacing.micro,
    width: 72,
    ...shadows.card,
    shadowOpacity: 0.04
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight,
    marginTop: spacing.micro
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 34
  }
});
