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
    description: "Bakici, ilan ve topluluk tarafini incelemek istiyorum.",
    icon: "compass-outline",
    label: "Kesfetmek istiyorum",
    value: "kesfetmek-istiyorum"
  },
  {
    description: "Bakici modunu tamamlayip ilanlara basvurmak istiyorum.",
    icon: "account-heart-outline",
    label: "Bakici olmak istiyorum",
    value: "bakici-olmak-istiyorum"
  },
  {
    description: "Hayvanim icin uygun bakicilar bulmak istiyorum.",
    icon: "dog-side",
    label: "Hayvanim icin bakici ariyorum",
    value: "hayvanim-icin-bakici-ariyorum"
  },
  {
    description: "Petshop hesabimi hazirlayip kampanya yonetmek istiyorum.",
    icon: "storefront-outline",
    label: "Petshop hesabi acmak istiyorum",
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
      setPickerError("Fotograf secmek icin galeri izni gerekiyor.");
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
      setPickerError("Fotograf secimi tamamlanamadi.");
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
          : "Profil kurulumu tamamlanirken beklenmeyen bir sorun olustu."
      );
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Seni yormadan temel profilini tamamlayalim; sonraki tum yonlendirmeler bu bilgilerle netlesir."
        icon="account-check-outline"
        metrics={[
          { icon: "account-outline", label: "Temel bilgiler", tone: "primary" },
          { icon: "shield-check-outline", label: "Guven veren profil", tone: "success" }
        ]}
        title="Ilk profil kurulumu"
      />

      <InfoCard
        description="Kisa, net ve kolay okunur alanlarla profilini hazirla."
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
                    label="Sehir"
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
                    label="Ilce"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.district?.message}
                  />
                )}
              />
            </View>
          </View>
          <UploadBox
            description="Guven veren bir ilk izlenim icin tek bir kare yeterli."
            error={pickerError ?? errors.photoUri?.message}
            imageUri={photoUri}
            label="Profil fotografi"
            onPress={handlePickImage}
          />
        </View>
      </InfoCard>

      <InfoCard
        description="Sana uygun ana aksiyonlari ve yonlendirmeleri buna gore hazirlariz."
        title="Kullanim amaci"
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
        label={isSubmitting ? "Profil hazirlaniyor..." : "Profili Tamamla"}
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
    <Pressable onPress={onPress} style={[styles.goalCard, isSelected ? styles.goalCardSelected : null]}>
      <View style={styles.goalHeader}>
        <AppIcon name={icon} size={18} />
        <FilterChip
          icon={isSelected ? "check-circle-outline" : "circle-outline"}
          label={isSelected ? "Secildi" : "Sec"}
          onPress={onPress}
          selected={isSelected}
        />
      </View>
      <Text style={styles.goalTitle}>{label}</Text>
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
    padding: spacing.standard
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft
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
  locationField: {
    flex: 1
  },
  locationRow: {
    flexDirection: "row",
    gap: spacing.compact
  }
});
