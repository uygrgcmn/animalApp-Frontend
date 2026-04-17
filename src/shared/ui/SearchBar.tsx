import type { TextInputProps } from "react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";

type SearchBarProps = TextInputProps & {
  onFilterPress?: () => void;
  showFilterButton?: boolean;
};

export function SearchBar({
  onFilterPress,
  placeholder = "Ara...",
  showFilterButton = false,
  ...props
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputWrap}>
        <MaterialCommunityIcons color={colors.textTertiary} name="magnify" size={20} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          style={styles.input}
          {...props}
        />
        {props.value ? (
          <Pressable onPress={() => props.onChangeText?.("")} style={styles.clearButton}>
            <MaterialCommunityIcons color={colors.textTertiary} name="close-circle" size={18} />
          </Pressable>
        ) : null}
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
  clearButton: {
    padding: spacing.micro
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderWidth: 1.5,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body.fontSize
  },
  inputWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 48,
    paddingHorizontal: spacing.standard
  },
  wrapper: {
    flexDirection: "row",
    gap: spacing.compact
  }
});
