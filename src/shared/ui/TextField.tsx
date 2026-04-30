import { useState } from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, ...props }: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.primary}
        style={[
          styles.input,
          props.multiline ? styles.multiline : null,
          isFocused && !error ? styles.inputFocused : null,
          error ? styles.inputError : null
        ]}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        {...props}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm
  },
  label: {
    color: colors.textSecondary,
    ...typography.label
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1.5,
    color: colors.text,
    fontSize: typography.body.fontSize,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: 15
  },
  multiline: {
    minHeight: 128,
    paddingTop: 16,
    textAlignVertical: "top"
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surfaceAlt
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
    backgroundColor: colors.errorSoft
  },
  error: {
    color: colors.error,
    ...typography.caption
  },
  hint: {
    color: colors.textMuted,
    ...typography.caption
  }
});
