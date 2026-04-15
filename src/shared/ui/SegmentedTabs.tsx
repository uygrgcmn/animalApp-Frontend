import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing } from "../../core/theme/tokens";

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
          <Pressable
            key={option.value}
            onPress={() => {
              onChange(option.value);
            }}
            style={[styles.tab, isActive ? styles.activeTab : null]}
          >
            <Text style={[styles.label, isActive ? styles.activeLabel : null]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeLabel: {
    color: colors.primary
  },
  activeTab: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryBorder
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  tab: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radius.medium,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: spacing.tight
  },
  wrapper: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.large,
    flexDirection: "row",
    gap: spacing.tight,
    padding: spacing.tight
  }
});
