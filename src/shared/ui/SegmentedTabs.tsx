import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useCallback } from "react";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing } from "../../core/theme/tokens";

type SegmentedOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedTabsProps<T extends string> = {
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  value: T;
};

export function SegmentedTabs<T extends string>({
  onChange,
  options,
  value
}: SegmentedTabsProps<T>) {
  return (
    <View style={styles.wrapper}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <SegmentTab
            key={option.value}
            isActive={isActive}
            label={option.label}
            onPress={() => onChange(option.value)}
          />
        );
      })}
    </View>
  );
}

function SegmentTab({
  isActive,
  label,
  onPress
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[styles.tabWrap, animStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tab, isActive ? styles.activeTab : null]}
      >
        <Text style={[styles.label, isActive ? styles.activeLabel : null]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xlarge,
    flexDirection: "row",
    gap: spacing.micro,
    padding: spacing.micro
  },
  tabWrap: {
    flex: 1
  },
  tab: {
    alignItems: "center",
    borderRadius: radius.large,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: spacing.tight
  },
  activeTab: {
    ...shadows.micro,
    backgroundColor: colors.surface
  },
  label: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "600"
  },
  activeLabel: {
    color: colors.primary
  }
});
