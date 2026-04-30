import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { formatRelativeDate } from "../../../shared/utils/formatDate";
import { useBookmarkStore } from "../store/bookmarkStore";
import { useSavedItems } from "../hooks/useSavedItems";

export function ProfileSavedScreen() {
  const savedItems = useSavedItems();
  const clear = useBookmarkStore((s) => s.clear);

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      {savedItems.length > 0 ? (
        <>
          <View style={styles.summaryRow}>
            <MetaPill
              icon="bookmark-multiple-outline"
              label={`${savedItems.length} kayıtlı ilan`}
              tone="primary"
            />
            <AppButton
              label="Tümünü Temizle"
              leftSlot={
                <AppIcon
                  backgrounded={false}
                  color={colors.error}
                  name="bookmark-remove-outline"
                  size={16}
                />
              }
              onPress={clear}
              size="sm"
              variant="ghost"
            />
          </View>

          <View style={styles.list}>
            {savedItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIcon}>
                    <AppIcon
                      backgrounded={false}
                      color={colors.primary}
                      name="bookmark"
                      size={18}
                    />
                  </View>
                  <View style={styles.cardTexts}>
                    <Text numberOfLines={2} style={styles.cardTitle}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.cardDate}>{formatRelativeDate(item.savedAt)}</Text>
                </View>

                <Link href={item.href} asChild>
                  <AppButton label="İlana Git" size="sm" variant="secondary" />
                </Link>
              </View>
            ))}
          </View>
        </>
      ) : (
        <EmptyState
          description="Daha sonra dönmek istediğin ilanlar burada toplanacak. İlan detayından kaydet butonunu kullanabilirsin."
          icon="bookmark-outline"
          title="Kayıtlı ilan yok"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    gap: spacing.compact,
    padding: spacing.standard
  },
  cardDate: {
    ...typography.caption,
    color: colors.textSubtle,
    flexShrink: 0
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.compact
  },
  cardIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2
  },
  cardTexts: {
    flex: 1
  },
  cardTitle: {
    ...typography.bodyStrong,
    color: colors.text
  },
  content: {
    gap: spacing.xl
  },
  list: {
    gap: spacing.compact
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
