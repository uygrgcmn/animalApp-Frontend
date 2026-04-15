import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";
import { AppIcon, type AppIconName } from "./AppIcon";

type UploadBoxProps = {
  description: string;
  error?: string;
  icon?: AppIconName;
  imageUri?: string;
  label: string;
  onPress?: () => void;
};

export function UploadBox({
  description,
  error,
  icon = "camera-outline",
  imageUri,
  label,
  onPress
}: UploadBoxProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        style={[styles.box, imageUri ? styles.filledBox : null, error ? styles.errorBox : null]}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <AppIcon name={icon} size={22} />
          </View>
        )}
        <View style={styles.texts}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <AppIcon name="plus" size={18} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.large,
    borderStyle: "dashed",
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.standard,
    minHeight: 88,
    padding: spacing.standard
  },
  description: {
    color: colors.textMuted,
    ...typography.caption
  },
  error: {
    color: colors.error,
    ...typography.caption
  },
  errorBox: {
    borderColor: colors.error
  },
  filledBox: {
    borderColor: colors.primaryBorder
  },
  image: {
    borderRadius: radius.medium,
    height: 56,
    width: 56
  },
  label: {
    color: colors.text,
    ...typography.bodyStrong
  },
  placeholder: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.medium,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  texts: {
    flex: 1,
    gap: spacing.micro
  },
  wrapper: {
    gap: spacing.tight
  }
});
