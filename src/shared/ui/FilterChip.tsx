import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";
import type { AppIconName } from "./AppIcon";

type FilterChipProps = {
  count?: number;
  icon?: AppIconName;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export function FilterChip({
  count,
  icon,
  label,
  onPress,
  selected = false
}: FilterChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.selectedChip : null]}>
      {icon ? (
        <MaterialCommunityIcons
          color={selected ? colors.primary : colors.textSubtle}
          name={icon}
          size={16}
        />
      ) : null}
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
      {typeof count === "number" ? (
        <View style={[styles.countWrap, selected ? styles.selectedCountWrap : null]}>
          <Text style={[styles.count, selected ? styles.selectedCount : null]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 40,
    paddingHorizontal: 14
  },
  count: {
    color: colors.textMuted,
    ...typography.caption
  },
  countWrap: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.tight,
    paddingVertical: spacing.micro
  },
  label: {
    color: colors.text,
    ...typography.label
  },
  selectedChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder
  },
  selectedCount: {
    color: colors.primary
  },
  selectedCountWrap: {
    backgroundColor: "#FFFFFFAA"
  },
  selectedLabel: {
    color: colors.primary
  }
});
