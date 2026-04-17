import { Link } from "expo-router";
import { RefreshControl, StyleSheet, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { useSavedItems } from "../hooks/useSavedItems";

export function ProfileSavedScreen() {
  const savedItemsQuery = useSavedItems();
  const savedItems = savedItemsQuery.data ?? [];
  const refreshing = savedItemsQuery.isFetching && !savedItemsQuery.isLoading;

  return (
    <ScreenContainer
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => void savedItemsQuery.refetch()}
          refreshing={refreshing}
          tintColor={colors.primary}
        />
      }
    >
      {savedItemsQuery.isError ? (
        <EmptyState
          actionSlot={
            <AppButton
              label="Tekrar dene"
              onPress={() => void savedItemsQuery.refetch()}
              variant="secondary"
            />
          }
          description="Kaydedilen icerikler su an yuklenemedi. Baglantiyi yenileyip tekrar deneyebilirsin."
          icon="wifi-off"
          title="Kaydedilenler getirilemedi"
        />
      ) : savedItems.length ? (
        <View style={styles.list}>
          {savedItems.map((item) => (
            <ManagementItemCard
              key={item.id}
              actions={
                <Link href={item.href} asChild>
                  <AppButton label="Detayi Ac" variant="secondary" />
                </Link>
              }
              description={item.subtitle}
              pills={
                <MetaPill
                  icon="bookmark-outline"
                  label={item.statusLabel}
                  tone="neutral"
                />
              }
              supportingText="Kaydedilenler daha sonra hizli karsilastirma ve geri donus icin tek listede tutulur."
              title={item.title}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          description="Daha sonra donmek istedigin icerikler burada toplanacak."
          icon="bookmark-outline"
          title="Kaydedilen icerik yok"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  list: {
    gap: spacing.compact
  }
});
