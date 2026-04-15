import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { routes } from "../../../core/navigation/routes";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { VisualHero } from "../../../shared/ui/VisualHero";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues
} from "../schemas";

export function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async () => undefined;

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Sifre yenileme adimini tek bir alanla baslat, gereksiz form kalabaligi olmadan devam et."
        icon="shield-lock-outline"
        metrics={[
          { icon: "email-fast-outline", label: "Tek adim", tone: "primary" },
          { icon: "account-check-outline", label: "Guvenli akis", tone: "success" }
        ]}
        title="Sifre yenileme"
      />

      {isSubmitSuccessful ? (
        <EmptyState
          actionSlot={
            <Link href={routes.auth.signIn} asChild>
              <AppButton label="Giris ekranina don" variant="secondary" />
            </Link>
          }
          description="Baglantili e-posta adresin dogrulanirsa sifre yenileme adimi bu hesap icin baslatilir."
          icon="email-check-outline"
          title="Talebin alindi"
        />
      ) : (
        <InfoCard
          description="Kayitli e-posta adresini gir. Devami tek bir akista ilerler."
          title="E-posta bilgisi"
        >
          <View style={styles.formFields}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  autoCapitalize="none"
                  keyboardType="email-address"
                  label="E-posta"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                />
              )}
            />
            <AppButton
              disabled={isSubmitting}
              label={isSubmitting ? "Hazirlaniyor..." : "Yenileme Baglantisi Gonder"}
              leftSlot={
                <AppIcon backgrounded={false} color="#FFFFFF" name="email-outline" size={18} />
              }
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </InfoCard>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  formFields: {
    gap: spacing.standard
  }
});
