import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "../../../core/theme/tokens";
import { applicationItems } from "../../../shared/mocks/profile";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppHeader } from "../../../shared/ui/AppHeader";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { ManagementItemCard } from "../../../shared/ui/ManagementItemCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ModeBadge } from "../../../shared/ui/ModeBadge";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { getMockItemHref } from "../../../shared/utils/mockNavigation";

type ApplicationStatus = "pending" | "accepted" | "rejected";

const options: { label: string; value: ApplicationStatus }[] = [
  { label: "Beklemede", value: "pending" },
  { label: "Kabul", value: "accepted" },
  { label: "Red", value: "rejected" }
];

export function ProfileApplicationsScreen() {
  const [status, setStatus] = useState<ApplicationStatus>("pending");

  const items = useMemo(
    () => applicationItems.filter((item) => item.status === status),
    [status]
  );

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <AppHeader
        description="Basvurular bekleme, kabul ve red durumlarina gore takip edilir."
        showBackButton
        title="Basvurularim"
      />

      <View style={styles.summaryRow}>
        <MetaPill
          icon="clock-outline"
          label={`${applicationItems.filter((item) => item.status === "pending").length} beklemede`}
          tone="warning"
        />
        <MetaPill
          icon="check-circle-outline"
          label={`${applicationItems.filter((item) => item.status === "accepted").length} kabul`}
          tone="success"
        />
        <MetaPill
          icon="close-circle-outline"
          label={`${applicationItems.filter((item) => item.status === "rejected").length} red`}
          tone="neutral"
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
                    <AppButton label="Ilan Detayi" variant="secondary" />
                  </Link>
                  <AppButton label="Mesaj" variant="ghost" />
                </>
              }
              description={`${item.owner} • ${item.updatedAt}`}
              pills={
                <>
                  <MetaPill icon="map-marker-outline" label={item.location} tone="neutral" />
                  <MetaPill icon="cash" label={item.priceLabel} tone="success" />
                  <MetaPill icon="shape-outline" label={item.type} tone="primary" />
                </>
              }
              rightSlot={
                <ModeBadge
                  label={
                    item.status === "pending"
                      ? "Beklemede"
                      : item.status === "accepted"
                        ? "Kabul edildi"
                        : "Reddedildi"
                  }
                  tone={
                    item.status === "pending"
                      ? "warning"
                      : item.status === "accepted"
                        ? "success"
                        : "muted"
                  }
                />
              }
              supportingText={item.note}
              title={item.title}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          description="Bu durum grubunda gosterilecek basvuru bulunmuyor."
          icon="file-document-outline"
          title="Gosterilecek basvuru yok"
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
