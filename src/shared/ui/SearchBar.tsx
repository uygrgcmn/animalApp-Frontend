import type { TextInputProps } from "react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";

type SearchBarProps = TextInputProps & {
  onFilterPress?: () => void;
  showFilterButton?: boolean;
};

export function SearchBar({
  onFilterPress,
  placeholder = "Ara",
  showFilterButton = false,
  ...props
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons color={colors.textSubtle} name="magnify" size={20} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          style={styles.input}
          {...props}
        />
      </View>

      {showFilterButton ? (
        <Pressable onPress={onFilterPress} style={styles.filterButton}>
          <MaterialCommunityIcons color={colors.text} name="tune-variant" size={20} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  input: {
    color: colors.text,
    flex: 1,
    ...typography.body
  },
  inputWrap: {
    ...shadows.card,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 56,
    paddingHorizontal: spacing.standard
  },
  wrapper: {
    flexDirection: "row",
    gap: spacing.compact
  }
});
