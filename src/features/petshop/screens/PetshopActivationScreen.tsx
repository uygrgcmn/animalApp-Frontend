import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { useSessionStore } from "../../auth/store/sessionStore";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
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
  { label: "Bakim merkezi", value: "bakim-merkezi" },
  { label: "Karma magaza", value: "karma-magaza" }
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
      const message = "Dosya secmek icin galeri izni gerekiyor.";
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
        description="Magaza kimligi ve kampanya odagini ekleyerek petshop alanini profesyonel olarak ac."
        icon="store-check-outline"
        metrics={[
          { icon: "store-marker-outline", label: "Magaza bilgisi", tone: "primary" },
          { icon: "sale-outline", label: "Kampanya hazir", tone: "warning" }
        ]}
        title="Petshop modunu aktif et"
      />

      <InfoCard
        variant="accent"
        title="Basvuru durumu"
        description={modeSummary.description}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>Tamamlanma %{getPetshopCompletion(values)}</Text>
          <Text style={styles.summaryLabel}>
            {getPetshopMissingItems(values).length > 0
              ? `${getPetshopMissingItems(values).length} alan eksik`
              : petshopStatus === "in_review"
                ? "Belgeler incelemede"
                : "Basvuru gonderime hazir"}
          </Text>
        </View>
      </InfoCard>

      <InfoCard
        title="Magaza kimligi"
        description="Kurumsal gorunen ama uzun hissettirmeyen temel kimlik alanlari."
      >
        <Controller
          control={control}
          name="businessName"
          render={({ field }) => (
            <TextField
              label="Magaza adi"
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
              label="Yetkili kisi"
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
        title="Adres ve iletisim"
        description="Magazaya ulasim ve guven icin kritik bilgileri tek blokta topla."
      >
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField
              label="Adres"
              multiline
              placeholder="Mahalle, sokak, bina no ve ilce bilgisi"
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
                  label="Iletisim telefonu"
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
                  label="Iletisim e-postasi"
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
              label="Vergi / isletme bilgisi"
              placeholder="Vergi no veya isletme kaydi"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.taxNumber?.message}
            />
          )}
        />
      </InfoCard>

      <InfoCard
        title="Gorseller ve belgeler"
        description="Magaza guvenini gosteren iki alan: vitrin ve dogrulama belgeleri."
      >
        <UploadBox
          description={
            values.storeImages.length > 0
              ? `${values.storeImages.length} magaza gorseli eklendi`
              : "Dis cephe, raf veya ic mekan gorseli ekle."
          }
          error={storeImageError ?? errors.storeImages?.message}
          imageUri={values.storeImages[0]}
          label="Magaza gorselleri"
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
                label={`Gorsel ${index + 1}`}
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
              : "Vergi levhasi veya isletme yetki belgesi ekle."
          }
          error={documentError ?? errors.verificationDocuments?.message}
          imageUri={values.verificationDocuments[0]}
          label="Dogrulama belgeleri"
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
            label={isSubmitting ? "Gonderiliyor..." : "Basvuruyu Gonder"}
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="send-outline" size={18} />}
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
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600"
  },
  summaryRow: {
    gap: spacing.tight
  },
  summaryValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  }
});

