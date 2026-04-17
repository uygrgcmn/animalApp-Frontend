import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { spacing, typography } from "../../core/theme/tokens";

type SectionHeaderProps = {
  description: string;
  eyebrow?: string;
  title: string;
};

export function SectionHeader({ title, description, eyebrow }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.tight
  },
  eyebrow: {
    color: colors.primary,
    ...typography.overline,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    ...typography.h1
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  }
});

