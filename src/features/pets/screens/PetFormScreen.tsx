import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { z } from "zod";

import { useToast } from "../../../core/providers/ToastProvider";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { useCreatePet, usePet, useUpdatePet } from "../hooks/usePets";

const petSchema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  species: z.string().min(1, "Tür zorunludur"),
  breed: z.string().optional(),
  age: z.coerce.number().min(0, "Yaş 0 veya üzeri olmalı").max(50),
  healthStatus: z.string().min(1, "Sağlık durumu zorunludur"),
  microchipId: z.string().optional(),
  description: z.string().optional()
});

type PetFormValues = z.infer<typeof petSchema>;

export function PetFormScreen() {
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const isEdit = Boolean(petId);

  const petQuery = usePet(petId ?? "");
  const createPet = useCreatePet();
  const updatePet = useUpdatePet(petId ?? "");
  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: 1,
      healthStatus: "Sağlıklı",
      microchipId: "",
      description: ""
    }
  });

  useEffect(() => {
    if (isEdit && petQuery.data) {
      const p = petQuery.data;
      reset({
        name: p.name,
        species: p.species,
        breed: p.breed ?? "",
        age: p.age,
        healthStatus: p.healthStatus,
        microchipId: p.microchipId ?? "",
        description: p.description ?? ""
      });
    }
  }, [petQuery.data, isEdit, reset]);

  async function onSubmit(values: PetFormValues) {
    try {
      const payload = {
        name: values.name,
        species: values.species,
        breed: values.breed ?? "",
        age: values.age,
        healthStatus: values.healthStatus,
        microchipId: values.microchipId || undefined,
        description: values.description || undefined
      };
      if (isEdit) {
        await updatePet.mutateAsync(payload);
        toast.success("Hayvan bilgileri güncellendi.");
      } else {
        await createPet.mutateAsync(payload);
        toast.success("Hayvan profili oluşturuldu.");
      }
      router.back();
    } catch {
      toast.error("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }

  if (isEdit && petQuery.isLoading) {
    return (
      <ScreenContainer contentContainerStyle={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <InfoCard
        description="Hayvanınızın temel bilgilerini girin. Bu bilgiler ilanlarda gösterilecektir."
        title={isEdit ? "Hayvanı Düzenle" : "Yeni Hayvan"}
      >
        <View style={styles.fields}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                error={errors.name?.message}
                label="İsim"
                onChangeText={field.onChange}
                placeholder="Örn: Boncuk"
                value={field.value}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Controller
                control={control}
                name="species"
                render={({ field }) => (
                  <TextField
                    error={errors.species?.message}
                    label="Tür"
                    onChangeText={field.onChange}
                    placeholder="Kedi, Köpek..."
                    value={field.value}
                  />
                )}
              />
            </View>
            <View style={styles.flex1}>
              <Controller
                control={control}
                name="breed"
                render={({ field }) => (
                  <TextField
                    label="Cins (opsiyonel)"
                    onChangeText={field.onChange}
                    placeholder="Örn: British"
                    value={field.value}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flex1}>
              <Controller
                control={control}
                name="age"
                render={({ field }) => (
                  <TextField
                    error={errors.age?.message}
                    keyboardType="numeric"
                    label="Yaş"
                    onChangeText={field.onChange}
                    placeholder="0"
                    value={String(field.value)}
                  />
                )}
              />
            </View>
            <View style={styles.flex1}>
              <Controller
                control={control}
                name="healthStatus"
                render={({ field }) => (
                  <TextField
                    error={errors.healthStatus?.message}
                    label="Sağlık Durumu"
                    onChangeText={field.onChange}
                    placeholder="Sağlıklı"
                    value={field.value}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="microchipId"
            render={({ field }) => (
              <TextField
                label="Mikroçip No (opsiyonel)"
                onChangeText={field.onChange}
                placeholder="123456789012345"
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextField
                label="Notlar (opsiyonel)"
                multiline
                numberOfLines={3}
                onChangeText={field.onChange}
                placeholder="Karakter özelliği, özel ihtiyaçlar..."
                value={field.value}
              />
            )}
          />
        </View>
      </InfoCard>

      <View style={styles.actions}>
        <AppButton
          label="İptal"
          onPress={() => router.back()}
          variant="ghost"
        />
        <View style={styles.flex1}>
          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Kaydediliyor…" : isEdit ? "Güncelle" : "Kaydet"}
            leftSlot={
              <AppIcon backgrounded={false} color="#FFFFFF" name="check-circle-outline" size={18} />
            }
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.compact
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  content: {
    gap: spacing.xl
  },
  fields: {
    gap: spacing.standard
  },
  flex1: {
    flex: 1
  },
  row: {
    flexDirection: "row",
    gap: spacing.compact
  }
});

