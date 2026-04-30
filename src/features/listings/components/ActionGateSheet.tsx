import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon, type AppIconName } from "../../../shared/ui/AppIcon";
import { StatusPill, type StatusPillTone } from "../../../shared/ui/StatusPill";

type ActionGateSheetProps = {
  ctaLabel: string;
  description: string;
  icon: AppIconName;
  missingItems: string[];
  onClose: () => void;
  onCtaPress: () => void;
  reasonLabel: string;
  reasonTone: StatusPillTone;
  title: string;
  visible: boolean;
};

export function ActionGateSheet({
  ctaLabel,
  description,
  icon,
  missingItems,
  onClose,
  onCtaPress,
  reasonLabel,
  reasonTone,
  title,
  visible
}: ActionGateSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFillObject} />
        <View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, spacing.lg)
            }
          ]}
        >
          <View style={styles.handle} />

          {/* Icon + status pill row */}
          <View style={styles.headerRow}>
            <View style={styles.iconContainer}>
              <AppIcon backgrounded={false} color={colors.primary} name={icon} size={26} />
            </View>
            <StatusPill label={reasonLabel} tone={reasonTone} />
          </View>

          {/* Title + description */}
          <View style={styles.texts}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {/* Missing items checklist */}
          {missingItems.length > 0 ? (
            <View style={styles.list}>
              {missingItems.map((item) => (
                <View key={item} style={styles.listItem}>
                  <AppIcon backgrounded={false} color={colors.warning} name="alert-circle-outline" size={16} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.divider} />

          {/* Actions */}
          <View style={styles.actions}>
            <AppButton
              label={ctaLabel}
              leftSlot={
                <AppIcon
                  backgrounded={false}
                  color={colors.textInverse}
                  name="arrow-right"
                  size={18}
                />
              }
              onPress={onCtaPress}
            />
            <AppButton label="Daha sonra" onPress={onClose} variant="ghost" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.compact
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  divider: {
    backgroundColor: colors.divider,
    height: 1
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.borderStrong,
    borderRadius: radius.pill,
    height: 4,
    width: 40
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact,
    justifyContent: "space-between"
  },
  iconContainer: {
    ...shadows.micro,
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  list: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.accentBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.compact,
    padding: spacing.standard
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  listText: {
    color: colors.textMuted,
    flex: 1,
    ...typography.body
  },
  overlay: {
    backgroundColor: "#0F172A80",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    ...shadows.floating,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    gap: spacing.standard,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  texts: {
    gap: spacing.tight
  },
  title: {
    color: colors.text,
    ...typography.h2
  }
});

