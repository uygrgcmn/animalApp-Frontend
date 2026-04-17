import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../core/theme/colors";
import { radius, spacing, typography } from "../../core/theme/tokens";

type VerificationState = "verified" | "pending" | "rejected" | "unverified";

type VerificationBadgeProps = {
  state: VerificationState;
};

const stateConfig: Record<
  VerificationState,
  { bg: string; color: string; icon: "check-decagram" | "clock-outline" | "close-octagon-outline" | "shield-outline"; label: string }
> = {
  pending: {
    bg: colors.warningSoft,
    color: colors.warning,
    icon: "clock-outline",
    label: "İncelemede"
  },
  rejected: {
    bg: colors.errorSoft,
    color: colors.error,
    icon: "close-octagon-outline",
    label: "Reddedildi"
  },
  unverified: {
    bg: colors.surfaceMuted,
    color: colors.textMuted,
    icon: "shield-outline",
    label: "Doğrulanmadı"
  },
  verified: {
    bg: colors.successSoft,
    color: colors.success,
    icon: "check-decagram",
    label: "Doğrulandı"
  }
};

export function VerificationBadge({ state }: VerificationBadgeProps) {
  const config = stateConfig[state];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <MaterialCommunityIcons color={config.color} name={config.icon} size={16} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.tight,
    minHeight: 34,
    paddingHorizontal: 12
  },
  label: {
    ...typography.caption
  }
});
