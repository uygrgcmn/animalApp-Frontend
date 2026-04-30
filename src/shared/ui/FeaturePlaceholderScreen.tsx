import type { Href } from "expo-router";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../core/theme/tokens";
import { AppButton } from "./AppButton";
import { AppIcon, type AppIconName } from "./AppIcon";
import { EmptyState } from "./EmptyState";
import { InfoCard } from "./InfoCard";
import { MetaPill } from "./MetaPill";
import { MetricCard } from "./MetricCard";
import { ScreenContainer } from "./ScreenContainer";
import { VisualHero } from "./VisualHero";

type MetricItem = {
  caption: string;
  icon: AppIconName;
  title: string;
  tone?: "primary" | "success" | "warning" | "neutral";
  value: string;
};

type PillItem = {
  icon: AppIconName;
  label: string;
  tone?: "primary" | "success" | "warning" | "neutral";
};

type SectionItem = {
  description: string;
  pills: PillItem[];
  title: string;
};

type ActionItem = {
  href: Href;
  icon: AppIconName;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

type FeaturePlaceholderScreenProps = {
  actions?: ActionItem[];
  description: string;
  emptyState: {
    description: string;
    icon: AppIconName;
    title: string;
  };
  heroIcon: AppIconName;
  heroMetrics?: PillItem[];
  metrics: MetricItem[];
  sections: SectionItem[];
  title: string;
};

export function FeaturePlaceholderScreen({
  actions = [],
  description,
  emptyState,
  heroIcon,
  heroMetrics,
  metrics,
  sections,
  title
}: FeaturePlaceholderScreenProps) {
  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description={description}
        icon={heroIcon}
        metrics={heroMetrics}
        title={title}
      />

      <View style={styles.metricGrid}>
        {metrics.map((metric) => (
          <View key={`${metric.title}-${metric.value}`} style={styles.metricItem}>
            <MetricCard {...metric} />
          </View>
        ))}
      </View>

      {sections.map((section) => (
        <InfoCard
          key={section.title}
          description={section.description}
          title={section.title}
        >
          <View style={styles.pillRow}>
            {section.pills.map((pill) => (
              <MetaPill
                key={`${section.title}-${pill.label}`}
                icon={pill.icon}
                label={pill.label}
                tone={pill.tone}
              />
            ))}
          </View>
        </InfoCard>
      ))}

      <EmptyState
        actionSlot={
          actions.length ? (
            <View style={styles.actions}>
              {actions.map((action) => (
                <Link key={action.label} href={action.href} asChild>
                  <AppButton
                    label={action.label}
                    leftSlot={
                      <AppIcon
                        backgrounded={false}
                        color={action.variant === "primary" ? "#FFFFFF" : undefined}
                        name={action.icon}
                        size={18}
                      />
                    }
                    variant={action.variant}
                  />
                </Link>
              ))}
            </View>
          ) : null
        }
        description={emptyState.description}
        icon={emptyState.icon}
        title={emptyState.title}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignSelf: "stretch",
    gap: spacing.compact
  },
  content: {
    gap: spacing.xl
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.compact
  },
  metricItem: {
    width: "48%"
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
