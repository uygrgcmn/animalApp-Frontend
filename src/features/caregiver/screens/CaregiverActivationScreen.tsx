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
  caregiverActivationSchema,
  caregiverServiceOptions,
  type CaregiverActivationValues
} from "../schemas";
import {
  deriveCaregiverDraftStatus,
  getCaregiverCompletion,
  getCaregiverMissingItems,
  getCaregiverModePresentation,
  normalizeCaregiverProfile
} from "../../profile/utils/modeStatus";

const availabilityOptions = [
  { label: "Hafta içi", value: "hafta-ici" },
  { label: "Hafta sonu", value: "hafta-sonu" },
  { label: "Esnek", value: "esnek" }
] as const;

const serviceTypeLabels: Record<(typeof caregiverServiceOptions)[number], string> = {
  "evde-bakim": "Evde bakım",
  "geceli-bakim": "Geceli bakım",
  "gunluk-ziyaret": "Günlük ziyaret",
  "ilac-takibi": "İlaç takibi",
  "kopek-gezdirme": "Köpek gezdirme"
};

export function CaregiverActivationScreen() {
  const user = useSessionStore((state) => state.user);
  const caregiverProfile = useSessionStore((state) => state.caregiverProfile);
  const caregiverStatus = useSessionStore((state) => state.caregiverStatus);
  const saveCaregiverDraft = useSessionStore((state) => state.saveCaregiverDraft);
  const submitCaregiverProfile = useSessionStore((state) => state.submitCaregiverProfile);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const defaultValues = useMemo(
    () =>
      normalizeCaregiverProfile(caregiverProfile, {
        city: user?.city,
        district: user?.district
      }),
    [caregiverProfile, user?.city, user?.district]
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CaregiverActivationValues>({
    resolver: zodResolver(caregiverActivationSchema),
    defaultValues
  });
  const values = watch();
  const modeState = deriveCaregiverDraftStatus(values, caregiverStatus);
  const modeSummary = getCaregiverModePresentation(modeState);

  const handlePickAsset = async () => {
    setPickerError(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPickerError("Belge veya fotoğraf eklemek için galeri izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.8
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    setValue("supportingAssets", [...values.supportingAssets, result.assets[0].uri], {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const handleSaveDraft = (draftValues: CaregiverActivationValues) => {
    saveCaregiverDraft(draftValues);
    router.replace(routes.app.profileModes);
  };

  const onSubmit = (submittedValues: CaregiverActivationValues) => {
    submitCaregiverProfile(submittedValues);
    router.replace(routes.app.profileModes);
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Konum, deneyim ve hizmet alanıyla bakıcı profilini görsel ağırlıklı marketplace'e hazırla."
        icon="shield-account"
        metrics={[
          { icon: "map-marker-radius", label: "Lokasyon", tone: "primary" },
          { icon: "timer-outline", label: "Deneyim", tone: "success" }
        ]}
        title="Bakıcı profilini aktive et"
      />

      <InfoCard
        variant="accent"
        title="Hazırlık durumu"
        description={modeSummary.description}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>Tamamlanma %{getCaregiverCompletion(values)}</Text>
          <Text style={styles.summaryLabel}>
            {getCaregiverMissingItems(values).length > 0
              ? `${getCaregiverMissingItems(values).length} alan eksik`
              : "Tüm zorunlu alanlar hazır"}
          </Text>
        </View>
      </InfoCard>

      <InfoCard
        title="Temel profil"
        description="Formu parçalara bölüp sadece gerekli alanları görünür tuttuk."
      >
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  label="Şehir"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.city?.message}
                />
              )}
            />
          </View>
          <View style={styles.gridItem}>
            <Controller
              control={control}
              name="district"
              render={({ field }) => (
                <TextField
                  label="İlçe"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.district?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="experienceYears"
          render={({ field }) => (
            <TextField
              label="Deneyim"
              placeholder="Örn. 3 yıl aktif bakım deneyimi"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.experienceYears?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="rateExpectation"
          render={({ field }) => (
            <TextField
              label="Ücret beklentisi"
              placeholder="Örn. Günlük 900 TL"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.rateExpectation?.message}
            />
          )}
        />
      </InfoCard>

      <InfoCard
        title="Hizmet ve uygunluk"
        description="Hangi işleri aldığını ve nasıl uygun olduğunu hızlı seçimlerle belirt."
      >
        <Controller
          control={control}
          name="serviceTypes"
          render={({ field }) => (
            <View style={styles.optionGrid}>
              {caregiverServiceOptions.map((option) => {
                const selected = field.value.includes(option);

                return (
                  <FilterChip
                    key={option}
                    icon={selected ? "check-circle-outline" : "briefcase-outline"}
                    label={serviceTypeLabels[option]}
                    onPress={() => {
                      field.onChange(
                        selected
                          ? field.value.filter((item) => item !== option)
                          : [...field.value, option]
                      );
                    }}
                    selected={selected}
                  />
                );
              })}
            </View>
          )}
        />
        {errors.serviceTypes?.message ? (
          <Text style={styles.error}>{errors.serviceTypes.message}</Text>
        ) : null}

        <Controller
          control={control}
          name="availability"
          render={({ field }) => (
            <SegmentedTabs
              options={[...availabilityOptions]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="profileBio"
          render={({ field }) => (
            <TextField
              label="Profil açıklaması"
              multiline
              placeholder="Rutin, deneyim ve nasıl bir bakım sunduğunu kısa ve güven veren bir dille anlat."
              value={field.value}
              onChangeText={field.onChange}
              error={errors.profileBio?.message}
            />
          )}
        />
      </InfoCard>

      <InfoCard
        title="Destekleyici belge / fotoğraf"
        description="Zorunlu değil; ama eklediğin her belge güven hissini artırır."
      >
        <UploadBox
          description={
            values.supportingAssets.length > 0
              ? `${values.supportingAssets.length} dosya eklendi`
              : "Referans, sertifika veya profil fotoğrafı ekleyebilirsin."
          }
          error={pickerError ?? undefined}
          imageUri={values.supportingAssets[0]}
          label="Belge veya fotoğraf ekle"
          onPress={handlePickAsset}
        />
        {values.supportingAssets.length > 0 ? (
          <View style={styles.optionGrid}>
            {values.supportingAssets.map((asset, index) => (
              <FilterChip
                key={asset}
                icon="paperclip"
                label={`Dosya ${index + 1}`}
                onPress={() => {
                  setValue(
                    "supportingAssets",
                    values.supportingAssets.filter((item) => item !== asset),
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
            label="Taslağı Kaydet"
            leftSlot={<AppIcon backgrounded={false} name="content-save-outline" size={18} />}
            onPress={handleSubmit(handleSaveDraft)}
            variant="secondary"
          />
          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Kaydediliyor..." : "Bakıcı Modunu Aktif Et"}
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="check-circle-outline" size={18} />}
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
  error: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600"
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
