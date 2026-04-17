import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../core/theme/tokens";
import { AppIcon } from "./AppIcon";
import { MetaPill } from "./MetaPill";
import { StatusPill } from "./StatusPill";

type OwnerRequestCardProps = {
  actions?: ReactNode;
  budget?: string;
  coverImageUri?: string;
  dateLabel?: string;
  description: string;
  distanceLabel?: string;
  location: string;
  onPress?: () => void;
  petType: string;
  title: string;
};

export function OwnerRequestCard({
  actions,
  budget,
  coverImageUri,
  dateLabel,
  description,
  distanceLabel,
  location,
  onPress,
  petType,
  title
}: OwnerRequestCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.visualArea}>
        {coverImageUri ? (
          <Image source={{ uri: coverImageUri }} style={styles.visualImage} />
        ) : (
          <View style={styles.visualFallback}>
            <AppIcon backgrounded={false} color={colors.warning} name="paw" size={44} />
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(15,23,42,0.55)"]}
          style={styles.visualOverlay}
        >
          <StatusPill label={petType} tone="warning" />
          {dateLabel ? <Text style={styles.overlayDate}>{dateLabel}</Text> : null}
        </LinearGradient>
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          {location ? (
            <MetaPill icon="map-marker-outline" label={location} tone="neutral" />
          ) : null}
          {distanceLabel ? (
            <MetaPill icon="map-marker-radius-outline" label={distanceLabel} tone="neutral" />
          ) : null}
          {budget ? <MetaPill icon="cash" label={budget} tone="success" /> : null}
        </View>
      </View>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.tight
  },
  body: {
    gap: spacing.tight
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xlarge,
    gap: spacing.standard,
    overflow: "hidden",
    padding: spacing.standard
  },
  description: {
    color: colors.textMuted,
    ...typography.body
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  overlayDate: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.92
  },
  title: {
    color: colors.text,
    ...typography.h3
  },
  visualArea: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.medium,
    height: 160,
    overflow: "hidden",
    position: "relative"
  },
  visualFallback: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  visualImage: {
    height: "100%",
    width: "100%"
  },
  visualOverlay: {
    alignItems: "center",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    padding: spacing.compact,
    position: "absolute",
    right: 0
  }
});
