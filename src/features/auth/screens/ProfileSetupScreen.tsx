import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { FilterChip } from "../../../shared/ui/FilterChip";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { UploadBox } from "../../../shared/ui/UploadBox";
import { VisualHero } from "../../../shared/ui/VisualHero";
import {
  profileSetupSchema,
  type ProfileGoal,
  type ProfileSetupValues
} from "../schemas";
import { useSessionStore } from "../store/sessionStore";

const goalCards: {
  description: string;
  icon: ComponentProps<typeof AppIcon>["name"];
  label: string;
  value: ProfileGoal;
}[] = [
  {
    description: "Bakıcı, ilan ve topluluk tarafını incelemek istiyorum.",
    icon: "compass-outline",
    label: "Keşfetmek istiyorum",
    value: "kesfetmek-istiyorum"
  },
  {
    description: "Bakıcı modunu tamamlayıp ilanlara başvurmak istiyorum.",
    icon: "account-heart-outline",
    label: "Bakıcı olmak istiyorum",
    value: "bakici-olmak-istiyorum"
  },
  {
    description: "Hayvanım için uygun bakıcılar bulmak istiyorum.",
    icon: "dog-side",
    label: "Hayvanım için bakıcı arıyorum",
    value: "hayvanim-icin-bakici-ariyorum"
  },
  {
    description: "Petshop hesabımı hazırlayıp kampanya yönetmek istiyorum.",
    icon: "storefront-outline",
    label: "Petshop hesabı açmak istiyorum",
    value: "petshop-hesabi-acmak-istiyorum"
  }
];

export function ProfileSetupScreen() {
  const user = useSessionStore((state) => state.user);
  const profileGoal = useSessionStore((state) => state.profileGoal);
  const completeProfileSetup = useSessionStore(
    (state) => state.completeProfileSetup
  );
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileSetupValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      city: user?.city ?? "",
      district: user?.district ?? "",
      photoUri: user?.avatar ?? "",
      goal: profileGoal ?? "kesfetmek-istiyorum"
    }
  });
  const selectedGoal = watch("goal");
  const photoUri = watch("photoUri");

  const handlePickImage = async () => {
    setPickerError(null);
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPickerError("Fotoğraf seçmek için galeri izni gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!asset) {
      setPickerError("Fotoğraf seçimi tamamlanamadı.");
      return;
    }

    setValue("photoUri", asset.uri, {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const onSubmit = async (values: ProfileSetupValues) => {
    setSubmissionError(null);

    try {
      await completeProfileSetup(values);
      router.replace(routes.app.home);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Profil kurulumu tamamlanırken beklenmeyen bir sorun oluştu."
      );
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Temel bilgilerini tamamla; tüm yönlendirmeler ve mod önerileri bu profilden şekillenir."
        icon="account-check-outline"
        metrics={[
          { icon: "account-outline", label: "Temel bilgiler", tone: "primary" },
          { icon: "shield-check-outline", label: "Güven veren profil", tone: "success" }
        ]}
        title="Profil kurulumu"
      />

      <InfoCard
        description="Kısa, net ve kolay okunur alanlarla profilini hazırla."
        title="Temel bilgiler"
      >
        <View style={styles.formFields}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <TextField
                label="Ad Soyad"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.fullName?.message}
              />
            )}
          />
          <View style={styles.locationRow}>
            <View style={styles.locationField}>
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
            <View style={styles.locationField}>
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
          <UploadBox
            description="Güven veren bir ilk izlenim için tek bir kare yeterli."
            error={pickerError ?? errors.photoUri?.message}
            imageUri={photoUri}
            label="Profil fotoğrafı"
            onPress={handlePickImage}
          />
        </View>
      </InfoCard>

      <InfoCard
        description="Sana uygun ana aksiyonları ve yönlendirmeleri buna göre hazırlarız."
        title="Kullanım amacı"
        variant="accent"
      >
        <View style={styles.goalGrid}>
          {goalCards.map((goal) => (
            <PressableGoalCard
              key={goal.value}
              description={goal.description}
              icon={goal.icon}
              isSelected={selectedGoal === goal.value}
              label={goal.label}
              onPress={() => {
                setValue("goal", goal.value, {
                  shouldDirty: true,
                  shouldValidate: true
                });
              }}
            />
          ))}
        </View>
        {errors.goal?.message ? <Text style={styles.error}>{errors.goal.message}</Text> : null}
      </InfoCard>

      {submissionError ? <Text style={styles.error}>{submissionError}</Text> : null}

      <AppButton
        disabled={isSubmitting}
        label={isSubmitting ? "Profil hazırlanıyor…" : "Profili Tamamla"}
        leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="check-bold" size={18} />}
        onPress={handleSubmit(onSubmit)}
      />
    </ScreenContainer>
  );
}

type GoalCardProps = {
  description: string;
  icon: ComponentProps<typeof AppIcon>["name"];
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

function PressableGoalCard({
  description,
  icon,
  isSelected,
  label,
  onPress
}: GoalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.goalCard, isSelected ? styles.goalCardSelected : null]}
    >
      {isSelected ? <View style={styles.goalCardAccentBar} /> : null}
      <View style={styles.goalHeader}>
        <AppIcon
          backgrounded={false}
          color={isSelected ? colors.primary : colors.textMuted}
          name={icon}
          size={20}
        />
        <FilterChip
          icon={isSelected ? "check-circle-outline" : "circle-outline"}
          label={isSelected ? "Seçildi" : "Seç"}
          onPress={onPress}
          selected={isSelected}
        />
      </View>
      <Text style={[styles.goalTitle, isSelected ? styles.goalTitleSelected : null]}>{label}</Text>
      <Text style={styles.goalDescription}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  error: {
    color: colors.error,
    ...typography.caption
  },
  formFields: {
    gap: spacing.standard
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.tight,
    overflow: "hidden",
    padding: spacing.standard
  },
  goalCardAccentBar: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: 4
  },
  goalCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  goalDescription: {
    color: colors.textMuted,
    ...typography.caption
  },
  goalGrid: {
    gap: spacing.compact
  },
  goalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  goalTitle: {
    color: colors.text,
    ...typography.bodyStrong
  },
  goalTitleSelected: {
    color: colors.primary
  },
  locationField: {
    flex: 1
  },
  locationRow: {
    flexDirection: "row",
    gap: spacing.compact
  }
});
