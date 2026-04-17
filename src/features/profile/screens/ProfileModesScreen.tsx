import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import { useSessionStore } from "../../auth/store/sessionStore";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ModeStatusCard } from "../../../shared/ui/ModeStatusCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import {
  getCaregiverActionLabel,
  getCaregiverCompletion,
  getCaregiverMissingItems,
  getCaregiverModePresentation,
  getPetshopActionLabel,
  getPetshopCompletion,
  getPetshopMissingItems,
  getPetshopModePresentation,
  normalizeCaregiverProfile,
  normalizePetshopProfile
} from "../utils/modeStatus";

export function ProfileModesScreen() {
  const user = useSessionStore((state) => state.user);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const caregiverProfile = useSessionStore((state) => state.caregiverProfile);
  const petshopProfile = useSessionStore((state) => state.petshopProfile);
  const caregiverSummary = getCaregiverModePresentation(caregiverStatus);
  const petshopSummary = getPetshopModePresentation(petshopStatus);
  const normalizedCaregiver = normalizeCaregiverProfile(caregiverProfile, {
    city: user?.city,
    district: user?.district
  });
  const normalizedPetshop = normalizePetshopProfile(petshopProfile, {
    email: user?.email,
    fullName: user?.fullName
  });

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <InfoCard
        description="Basvuru sirasinda eksiksen veya petshop alani icin dogrulamaya ihtiyacin varsa bu merkez yonlendirme noktasi olarak calisir."
        title="Mod yonetim merkezi"
        variant="accent"
      >
        <View style={styles.inlineActions}>
          <Link href={routes.app.caregiverActivation} asChild>
            <AppButton
              label="Bakici akisina git"
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="shield-account-outline" size={18} />}
            />
          </Link>
          <Link href={routes.app.petshopActivation} asChild>
            <AppButton
              label="Petshop basvurusuna git"
              leftSlot={<AppIcon backgrounded={false} name="store-cog-outline" size={18} />}
              variant="secondary"
            />
          </Link>
        </View>
      </InfoCard>

      <ModeStatusCard
        actionSlot={
          <Link href={routes.app.caregiverActivation} asChild>
            <AppButton
              label={getCaregiverActionLabel(caregiverStatus)}
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="shield-account-outline" size={18} />}
            />
          </Link>
        }
        completion={getCaregiverCompletion(normalizedCaregiver)}
        description={caregiverSummary.description}
        detailItems={[
          {
            label: "Destekleyici belge / fotograf",
            statusLabel:
              normalizedCaregiver.supportingAssets.length > 0
                ? `${normalizedCaregiver.supportingAssets.length} eklendi`
                : "Opsiyonel",
            tone: normalizedCaregiver.supportingAssets.length > 0 ? "success" : "neutral"
          }
        ]}
        detailTitle="Profil guveni"
        emptyMissingLabel="Bakici modu ilanlara basvuru icin hazir."
        icon="shield-account-outline"
        metaItems={[
          {
            icon: "briefcase-outline",
            label:
              normalizedCaregiver.serviceTypes.length > 0
                ? `${normalizedCaregiver.serviceTypes.length} hizmet secildi`
                : "Hizmet secilmedi",
            tone: normalizedCaregiver.serviceTypes.length > 0 ? "primary" : "neutral"
          },
          {
            icon: "calendar-check-outline",
            label:
              normalizedCaregiver.availability === "hafta-ici"
                ? "Hafta ici uygun"
                : normalizedCaregiver.availability === "hafta-sonu"
                  ? "Hafta sonu uygun"
                  : "Esnek uygunluk",
            tone: "success"
          },
          {
            icon: "cash-multiple",
            label:
              normalizedCaregiver.rateExpectation.trim().length > 0
                ? normalizedCaregiver.rateExpectation
                : "Ucret bekleniyor",
            tone: normalizedCaregiver.rateExpectation.trim().length > 0 ? "warning" : "neutral"
          }
        ]}
        missingItems={getCaregiverMissingItems(normalizedCaregiver)}
        statusLabel={caregiverSummary.label}
        statusTone={caregiverSummary.tone}
        supportingText="Bakici ilanina basvururken eksik alan varsa kullaniciyi hata ile durdurmak yerine dogrudan bu ekrana yonlendirebilirsin."
        title="Bakici modu"
      />

      <ModeStatusCard
        actionSlot={
          <Link href={routes.app.petshopActivation} asChild>
            <AppButton
              label={getPetshopActionLabel(petshopStatus)}
              leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="store-cog-outline" size={18} />}
            />
          </Link>
        }
        completion={getPetshopCompletion(normalizedPetshop)}
        description={petshopSummary.description}
        detailItems={[
          {
            label: "Vergi / isletme belgesi",
            statusLabel:
              normalizedPetshop.verificationDocuments.length > 0 ? "Yuklendi" : "Bekleniyor",
            tone:
              normalizedPetshop.verificationDocuments.length > 0 ? "success" : "warning"
          },
          {
            label: "Magaza gorselleri",
            statusLabel:
              normalizedPetshop.storeImages.length > 0
                ? `${normalizedPetshop.storeImages.length} gorsel`
                : "Bekleniyor",
            tone: normalizedPetshop.storeImages.length > 0 ? "success" : "warning"
          },
          {
            label: "Basvuru durumu",
            statusLabel: petshopSummary.label,
            tone: petshopSummary.tone
          }
        ]}
        detailTitle="Dogrulama ve basvuru"
        emptyMissingLabel="Petshop basvurusu gonderime hazir."
        icon="storefront-outline"
        metaItems={[
          {
            icon: "account-tie-outline",
            label:
              normalizedPetshop.authorizedPerson.trim().length > 0
                ? normalizedPetshop.authorizedPerson
                : "Yetkili bekleniyor",
            tone:
              normalizedPetshop.authorizedPerson.trim().length > 0
                ? "primary"
                : "neutral"
          },
          {
            icon: "map-marker-outline",
            label:
              normalizedPetshop.address.trim().length > 0
                ? "Adres eklendi"
                : "Adres eksik",
            tone: normalizedPetshop.address.trim().length > 0 ? "success" : "neutral"
          },
          {
            icon: "file-certificate-outline",
            label:
              normalizedPetshop.businessType === "veteriner"
                ? "Veteriner"
                : normalizedPetshop.businessType === "bakim-merkezi"
                  ? "Bakim merkezi"
                  : normalizedPetshop.businessType === "karma-magaza"
                    ? "Karma magaza"
                    : "Petshop",
            tone: "warning"
          }
        ]}
        missingItems={getPetshopMissingItems(normalizedPetshop)}
        statusLabel={petshopSummary.label}
        statusTone={petshopSummary.tone}
        supportingText="Petshop kampanyasi veya ticari alan acilmadan once eksik belge ve durum bilgisi burada net gorunur."
        title="Petshop modu"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  inlineActions: {
    gap: spacing.compact
  }
});
