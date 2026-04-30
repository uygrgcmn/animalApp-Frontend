import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { z } from "zod";

import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { useMyProfile, useUpdateMyProfile } from "../hooks/useMyProfile";

const profileEditSchema = z.object({
  fullName: z.string().trim().min(2, "Ad Soyad en az 2 karakter olmalı."),
  bio: z.string().trim().max(300, "Biyografi en fazla 300 karakter olabilir.").optional(),
  phoneNumber: z.string().trim().optional(),
  city: z.string().trim().min(2, "Şehir en az 2 karakter olmalı."),
  district: z.string().trim().optional()
});

type ProfileEditValues = z.infer<typeof profileEditSchema>;

export function ProfileEditScreen() {
  const profileQuery = useMyProfile();
  const updateMutation = useUpdateMyProfile();
  const profile = profileQuery.data;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    values: {
      bio: profile?.bio ?? "",
      city: profile?.city ?? "",
      district: profile?.district ?? "",
      fullName: profile?.fullName ?? "",
      phoneNumber: profile?.phoneNumber ?? ""
    }
  });

  async function onSubmit(values: ProfileEditValues) {
    await updateMutation.mutateAsync({
      bio: values.bio || undefined,
      city: values.city || undefined,
      district: values.district || undefined,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || undefined
    });
    router.back();
  }

  if (profileQuery.isLoading) {
    return (
      <ScreenContainer contentContainerStyle={styles.content}>
        <ActivityIndicator color="primary" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <InfoCard description="Profilinde görünen temel bilgiler." title="Kimlik bilgileri">
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextField
              error={errors.fullName?.message}
              label="Ad Soyad"
              onChangeText={field.onChange}
              placeholder="Adın ve soyadın"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <TextField
              error={errors.phoneNumber?.message}
              keyboardType="phone-pad"
              label="Telefon numarası"
              onChangeText={field.onChange}
              placeholder="+90 555 000 00 00"
              value={field.value}
            />
          )}
        />
      </InfoCard>

      <InfoCard description="Diğer kullanıcıların seni daha iyi tanımasını sağlar." title="Hakkımda">
        <Controller
          control={control}
          name="bio"
          render={({ field }) => (
            <TextField
              error={errors.bio?.message}
              label="Biyografi"
              multiline
              onChangeText={field.onChange}
              placeholder="Kendin hakkında kısa bir şeyler yaz..."
              value={field.value}
            />
          )}
        />
      </InfoCard>

      <InfoCard description="Keşfet ve yakındakiler özelliklerinde kullanılır." title="Konum">
        <View style={styles.row}>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <TextField
                  error={errors.city?.message}
                  label="Şehir"
                  onChangeText={field.onChange}
                  placeholder="İstanbul"
                  value={field.value}
                />
              )}
            />
          </View>
          <View style={styles.flex}>
            <Controller
              control={control}
              name="district"
              render={({ field }) => (
                <TextField
                  error={errors.district?.message}
                  label="İlçe"
                  onChangeText={field.onChange}
                  placeholder="Kadıköy"
                  value={field.value}
                />
              )}
            />
          </View>
        </View>
      </InfoCard>

      {updateMutation.isError ? (
        <InfoCard
          description="Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
          title="Hata oluştu"
          variant="accent"
        />
      ) : null}

      <View style={styles.actions}>
        <AppButton
          disabled={!isDirty || updateMutation.isPending}
          label={updateMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          leftSlot={
            <AppIcon backgrounded={false} color="#FFFFFF" name="content-save-outline" size={18} />
          }
          onPress={handleSubmit(onSubmit)}
        />
        <AppButton
          disabled={updateMutation.isPending}
          label="Vazgeç"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.compact
  },
  content: {
    gap: spacing.xl
  },
  flex: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    gap: spacing.compact
  }
});
