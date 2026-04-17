import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback } from "react";

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
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.chip, selected ? styles.selectedChip : null]}
      >
        {icon ? (
          <MaterialCommunityIcons
            color={selected ? colors.primary : colors.textSubtle}
            name={icon}
            size={14}
          />
        ) : null}
        <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
        {typeof count === "number" ? (
          <View style={[styles.countWrap, selected ? styles.selectedCountWrap : null]}>
            <Text style={[styles.count, selected ? styles.selectedCount : null]}>{count}</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: spacing.micro + 2,
    minHeight: 36,
    paddingHorizontal: spacing.compact
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
    color: colors.textMuted,
    ...typography.label
  },
  selectedChip: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  selectedCount: {
    color: colors.primary
  },
  selectedCountWrap: {
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  selectedLabel: {
    color: colors.primary
  }
});
