import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { radius, spacing, typography } from "../../../core/theme/tokens";
import { useSessionStore } from "../../auth/store/sessionStore";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { MetaPill } from "../../../shared/ui/MetaPill";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { SegmentedTabs } from "../../../shared/ui/SegmentedTabs";
import { TextField } from "../../../shared/ui/TextField";
import { UploadBox } from "../../../shared/ui/UploadBox";
import { VisualHero } from "../../../shared/ui/VisualHero";
import {
  petshopActivationSchema,
  type PetshopActivationValues
} from "../schemas";
import {
  derivePetshopDraftStatus,
  getPetshopCompletion,
  getPetshopMissingItems,
  getPetshopModePresentation,
  normalizePetshopProfile
} from "../../profile/utils/modeStatus";

const businessTypeOptions = [
  { label: "Petshop", value: "petshop" },
  { label: "Veteriner", value: "veteriner" },
  { label: "Bakım merkezi", value: "bakim-merkezi" },
  { label: "Karma mağaza", value: "karma-magaza" }
] as const;

export function PetshopActivationScreen() {
  const user = useSessionStore((state) => state.user);
  const petshopProfile = useSessionStore((state) => state.petshopProfile);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const savePetshopDraft = useSessionStore((state) => state.savePetshopDraft);
  const submitPetshopApplication = useSessionStore(
    (state) => state.submitPetshopApplication
  );
  const [storeImageError, setStoreImageError] = useState<string | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const defaultValues = useMemo(
    () =>
      normalizePetshopProfile(petshopProfile, {
        email: user?.email,
        fullName: user?.fullName
      }),
    [petshopProfile, user?.email, user?.fullName]
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PetshopActivationValues>({
    resolver: zodResolver(petshopActivationSchema),
    defaultValues
  });
  const values = watch();
  const modeState = derivePetshopDraftStatus(values, petshopStatus);
  const modeSummary = getPetshopModePresentation(modeState);

  const pickAsset = async (kind: "verificationDocuments" | "storeImages") => {
    if (kind === "verificationDocuments") {
      setDocumentError(null);
    } else {
      setStoreImageError(null);
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      const message = "Dosya seçmek için galeri izni gerekiyor.";
      if (kind === "verificationDocuments") {
        setDocumentError(message);
      } else {
        setStoreImageError(message);
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: kind === "storeImages" ? [4, 3] : [3, 4],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const nextValues = [...values[kind], result.assets[0].uri];
    setValue(kind, nextValues, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const handleSaveDraft = (draftValues: PetshopActivationValues) => {
    savePetshopDraft(draftValues);
    router.replace(routes.app.profileModes);
  };

  const onSubmit = (submittedValues: PetshopActivationValues) => {
    submitPetshopApplication(submittedValues);
    router.replace(routes.app.profileModes);
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Mağaza kimliği, iletişim ve belge bilgilerini ekleyerek petshop alanını profesyonel olarak aç."
        icon="store-check-outline"
        metrics={[
          { icon: "store-marker-outline", label: "Mağaza kimlik bilgisi", tone: "primary" },
          { icon: "shield-check-outline", label: "Belge doğrulaması", tone: "success" },
          { icon: "sale-outline", label: "Kampanya erişimi", tone: "warning" }
        ]}
        title="Petshop modunu aktif et"
      />

      <InfoCard
        variant="accent"
        title="Basvuru durumu"
        description={modeSummary.description}
      >
        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${getPetshopCompletion(values)}%` as `${number}%` }
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>%{getPetshopCompletion(values)}</Text>
        </View>
        <View style={styles.summaryRow}>
          {getPetshopMissingItems(values).length > 0 ? (
            <MetaPill
              icon="alert-circle-outline"
              label={`${getPetshopMissingItems(values).length} alan eksik`}
              tone="warning"
            />
          ) : petshopStatus === "in_review" ? (
            <MetaPill icon="clock-outline" label="Belgeler incelemede" tone="primary" />
          ) : (
            <MetaPill icon="check-circle-outline" label="Gönderime hazır" tone="success" />
          )}
        </View>
      </InfoCard>

      <InfoCard
        title="Mağaza kimliği"
        description="Kurumsal görünen ama uzun hissettirmeyen temel kimlik alanları."
      >
        <Controller
          control={control}
          name="businessName"
          render={({ field }) => (
            <TextField
              label="Mağaza adı"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.businessName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="authorizedPerson"
          render={({ field }) => (
            <TextField
              label="Yetkili kişi"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.authorizedPerson?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="businessType"
          render={({ field }) => (
            <SegmentedTabs
              options={[...businessTypeOptions]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </InfoCard>

      <InfoCard
        title="Adres ve iletişim"
        description="Mağazaya ulaşım ve güven için kritik bilgileri tek blokta topla."
      >
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField
              label="Adres"
              multiline
              placeholder="Mahalle, sokak, bina no ve ilçe bilgisi"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.address?.message}
            />
          )}
        />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Controller
              control={control}
              name="contactPhone"
              render={({ field }) => (
                <TextField
                  keyboardType="phone-pad"
                  label="İletişim telefonu"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.contactPhone?.message}
                />
              )}
            />
          </View>
          <View style={styles.gridItem}>
            <Controller
              control={control}
              name="contactEmail"
              render={({ field }) => (
                <TextField
                  autoCapitalize="none"
                  keyboardType="email-address"
                  label="İletişim e-postası"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.contactEmail?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="taxNumber"
          render={({ field }) => (
            <TextField
              keyboardType="number-pad"
              label="Vergi / işletme bilgisi"
              placeholder="Vergi no veya işletme kaydı"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.taxNumber?.message}
            />
          )}
        />
      </InfoCard>

      <InfoCard
        title="Görseller ve belgeler"
        description="Mağaza güvenini gösteren iki alan: vitrin ve doğrulama belgeleri."
      >
        <UploadBox
          description={
            values.storeImages.length > 0
              ? `${values.storeImages.length} mağaza görseli eklendi`
              : "Dış cephe, raf veya iç mekân görseli ekle."
          }
          error={storeImageError ?? errors.storeImages?.message}
          imageUri={values.storeImages[0]}
          label="Mağaza görselleri"
          onPress={() => {
            void pickAsset("storeImages");
          }}
        />
        {values.storeImages.length > 0 ? (
          <View style={styles.optionGrid}>
            {values.storeImages.map((asset, index) => (
              <FilterChip
                key={asset}
                icon="image-outline"
                label={`Görsel ${index + 1}`}
                onPress={() => {
                  setValue(
                    "storeImages",
                    values.storeImages.filter((item) => item !== asset),
                    { shouldDirty: true, shouldValidate: true }
                  );
                }}
                selected
              />
            ))}
          </View>
        ) : null}

        <UploadBox
          description={
            values.verificationDocuments.length > 0
              ? `${values.verificationDocuments.length} belge eklendi`
              : "Vergi levhası veya işletme yetki belgesi ekle."
          }
          error={documentError ?? errors.verificationDocuments?.message}
          imageUri={values.verificationDocuments[0]}
          label="Doğrulama belgeleri"
          onPress={() => {
            void pickAsset("verificationDocuments");
          }}
        />
        {values.verificationDocuments.length > 0 ? (
          <View style={styles.optionGrid}>
            {values.verificationDocuments.map((asset, index) => (
              <FilterChip
                key={asset}
                icon="file-document-outline"
                label={`Belge ${index + 1}`}
                onPress={() => {
                  setValue(
                    "verificationDocuments",
                    values.verificationDocuments.filter((item) => item !== asset),
                    { shouldDirty: true, shouldValidate: true }
                  );
                }}
                selected
              />
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            disabled={isSubmitting}
            label="Taslagi Kaydet"
            leftSlot={<AppIcon backgrounded={false} name="content-save-outline" size={18} />}
            onPress={handleSubmit(handleSaveDraft)}
            variant="secondary"
          />
          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            leftSlot={<AppIcon backgrounded={false} color={colors.textInverse} name="send-outline" size={18} />}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </InfoCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.compact
  },
  content: {
    gap: spacing.section
  },
  grid: {
    flexDirection: "row",
    gap: spacing.compact
  },
  gridItem: {
    flex: 1
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  },
  progressBarFill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: "100%"
  },
  progressBarTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    flex: 1,
    height: 8,
    overflow: "hidden"
  },
  progressPercent: {
    color: colors.primary,
    ...typography.label,
    minWidth: 36,
    textAlign: "right"
  },
  progressRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.compact
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.tight
  }
});

