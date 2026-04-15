import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { listingItems } from "../../../shared/mocks/profile";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";

type ListingStatus = "active" | "passive" | "draft";

const options: { label: string; value: ListingStatus }[] = [
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "passive" },
  { label: "Taslak", value: "draft" }
];

export function ProfileListingsScreen() {
  const [status, setStatus] = useState<ListingStatus>("active");

  const items = useMemo(
    () => listingItems.filter((item) => item.status === status),
    [status]
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Ilanlar aktif, pasif ve taslak gruplari altinda sade bicimde yonetilir."
        showBackButton
        title="Ilanlarim"
      />

      <View style={styles.summaryRow}>
        <MetaPill
          icon="check-circle-outline"
          label={`${listingItems.filter((item) => item.status === "active").length} aktif`}
          tone="success"
        />
        <MetaPill
          icon="pause-circle-outline"
          label={`${listingItems.filter((item) => item.status === "passive").length} pasif`}
          tone="warning"
        />
        <MetaPill
          icon="file-document-edit-outline"
          label={`${listingItems.filter((item) => item.status === "draft").length} taslak`}
          tone="primary"
        />
      </View>

      <SegmentedTabs onChange={setStatus} options={options} value={status} />

      {items.length ? (
        <View style={styles.list}>
          {items.map((item) => (
            <ManagementItemCard
              key={item.id}
              actions={
                <>
                  <Link href={getMockItemHref(item.kind, item.listingId)} asChild>
                    <AppButton label="Onizleme" variant="secondary" />
                  </Link>
                  <AppButton label="Duzenle" variant="ghost" />
                </>
              }
              description={`${item.type} • ${item.updatedAt}`}
              pills={
                <>
                  <MetaPill
                    icon="eye-outline"
                    label={`${item.views} goruntuleme`}
                    tone="neutral"
                  />
                  <MetaPill
                    icon="account-group-outline"
                    label={`${item.applications} basvuru`}
                    tone="warning"
                  />
                  <MetaPill
                    icon={
                      item.status === "active"
                        ? "check-circle-outline"
                        : item.status === "passive"
                          ? "pause-circle-outline"
                          : "file-document-edit-outline"
                    }
                    label={
                      item.status === "active"
                        ? "Aktif"
                        : item.status === "passive"
                          ? "Pasif"
                          : "Taslak"
                    }
                    tone={
                      item.status === "active"
                        ? "success"
                        : item.status === "passive"
                          ? "warning"
                          : "primary"
                    }
                  />
                </>
              }
              supportingText="Liste, mobilde hizli taranacak sekilde durum, tip ve performans ozetiyle sunulur."
              title={item.title}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          description="Bu durum grubunda gosterilecek ilan bulunmuyor."
          icon="cards-outline"
          title="Gosterilecek ilan yok"
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
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
