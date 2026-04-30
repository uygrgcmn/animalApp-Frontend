import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { CommunityCard } from "../../../shared/ui/CommunityCard";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ListingCard } from "../../../shared/ui/ListingCard";
import { PetshopCampaignCard } from "../../../shared/ui/PetshopCampaignCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SearchBar } from "../../../shared/ui/SearchBar";
import { SectionHeader } from "../../../shared/ui/SectionHeader";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { StatusPill } from "../../../shared/ui/StatusPill";
import { StickyBottomActionBar } from "../../../shared/ui/StickyBottomActionBar";
import { VerificationBadge } from "../../../shared/ui/VerificationBadge";
import { ModeStatusCard } from "../../../shared/ui/ModeStatusCard";

const segmentedOptions = [
  { label: "Tumu", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Taslak", value: "draft" }
] as const;

type SegmentedValue = (typeof segmentedOptions)[number]["value"];

export function DesignSystemShowcaseScreen() {
  const [value, setValue] = useState<SegmentedValue>("all");

  return (
    <View style={styles.page}>
      <ScreenContainer contentContainerStyle={styles.content}>
        <SectionHeader
          description="Tema, arama, filtre ve kart sistemi burada tek bir dille orneklenir."
          eyebrow="Design System"
          title="Ortak UI Dili"
        />

        <InfoCard
          description="Arama, filtreleme ve segmented navigation ornekleri."
          title="Arama & Filtre"
        >
          <SearchBar placeholder="Ilan, kampanya veya kullanici ara" showFilterButton />
          <View style={styles.row}>
            <FilterChip icon="dog-side" label="Bakici" selected />
            <FilterChip count={12} icon="storefront-outline" label="Petshop" />
            <FilterChip icon="hand-heart-outline" label="Topluluk" />
          </View>
          <SegmentedTabs onChange={setValue} options={[...segmentedOptions]} value={value} />
        </InfoCard>

        <InfoCard
          description="Durum ve guven bilesenleri ortak semantik renk diliyle calisir."
          title="Durum Bilesenleri"
        >
          <View style={styles.row}>
            <StatusPill label="Aktif" tone="success" />
            <StatusPill label="Eksik bilgi" tone="warning" />
            <StatusPill label="Reddedildi" tone="error" />
          </View>
          <View style={styles.row}>
            <VerificationBadge state="verified" />
            <VerificationBadge state="pending" />
            <VerificationBadge state="rejected" />
          </View>
        </InfoCard>

        <SectionHeader
          description="Ilan, topluluk, kampanya ve mod yonetimi kartlari ayni sistemde yer alir."
          title="Kart Sistemi"
        />

        <ListingCard
          actions={
            <View style={styles.row}>
              <AppButton
                label="Mesaj Gonder"
                leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="message-outline" size={16} />}
              />
              <AppButton
                label="Kaydet"
                leftSlot={<AppIcon backgrounded={false} name="bookmark-outline" size={16} />}
                variant="secondary"
              />
            </View>
          }
          badges={[
            { icon: "shield-check-outline", label: "Dogrulandi", tone: "primary" },
            { icon: "calendar-range", label: "Hafta ici", tone: "neutral" }
          ]}
          description="Kedi ve kopek bakiminda deneyimli, gunluk raporlama ve ilac takibi sunan profesyonel profil."
          location="Istanbul"
          priceLabel="5.000 - 7.500 TL"
          title="Deneyimli Evde Bakici"
        />

        <CommunityCard
          actionSlot={
            <AppButton
              label="Mesaj At"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="send-outline" size={16} />}
            />
          }
          author="Merve Kaya"
          category="Sahiplendirme"
          dateLabel="Bugun"
          description="Asilari tamamlanmis, oyuncu karakterli tekir icin kalici yuva araniyor."
          location="Kadikoy"
          title="Yuva Arayan Tekir"
        />

        <PetshopCampaignCard
          actionSlot={
            <AppButton
              label="Detayi Gor"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="tag-outline" size={16} />}
            />
          }
          campaignLabel="%20 indirim"
          deadline="3 gun kaldi"
          description="Premium mama ve oyuncak setlerinde kampanyali fiyatlar, ayni gun teslimat secenegi ile."
          priceLabel="799 TL"
          storeName="Pati Market"
          title="Bahar Kampanyasi"
        />

        <ModeStatusCard
          actionSlot={
            <AppButton
              label="Modu Tamamla"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="arrow-right" size={16} />}
            />
          }
          completion={68}
          description="Bakici modu acilmadan once temel alanlarin tamamlanmasi gerekir."
          icon="shield-account-outline"
          missingItems={["Ucret beklentisi", "Profil aciklamasi", "Belge / fotograf"]}
          statusLabel="Eksik bilgi"
          statusTone="warning"
          title="Bakici Modu"
        />

        <EmptyState
          actionSlot={
            <AppButton
              label="Yeni Icerik Olustur"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="plus" size={16} />}
            />
          }
          description="Liste verisi gelmediginde kullanici ne yapacagini anlayabilecegi temiz bir bos durum gormelidir."
          icon="inbox-outline"
          title="Henuz icerik yok"
        />
      </ScreenContainer>

      <StickyBottomActionBar>
        <AppButton
          label="Birincil CTA"
          leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="check" size={18} />}
        />
      </StickyBottomActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: 120
  },
  page: {
    backgroundColor: colors.background,
    flex: 1
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});
