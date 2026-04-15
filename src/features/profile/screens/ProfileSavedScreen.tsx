import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { savedItems } from "../../../shared/mocks/profile";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";

export function ProfileSavedScreen() {
  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Kaydedilen ilan ve kampanyalar daha sonra kolayca geri donulebilecek sekilde saklanir."
        showBackButton
        title="Kaydettiklerim"
      />

      {savedItems.length ? (
        <View style={styles.list}>
          {savedItems.map((item) => (
            <ManagementItemCard
              key={item.id}
              actions={
                <Link href={getMockItemHref(item.kind, item.listingId)} asChild>
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
