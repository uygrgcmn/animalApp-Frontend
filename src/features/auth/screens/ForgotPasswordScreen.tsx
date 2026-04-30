import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ApiError } from "../../../core/api/errors";
import { routes } from "../../../core/navigation/routes";
import { colors } from "../../../core/theme/colors";
import { spacing } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues
} from "../schemas";

export function ForgotPasswordScreen() {
  const forgotPasswordMutation = useForgotPassword();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setSubmissionError(null);

    try {
      await forgotPasswordMutation.mutateAsync(values);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmissionError(error.message);
        return;
      }

      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Şifre yenileme talebi gönderilirken beklenmeyen bir sorun oluştu."
      );
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="E-posta adresini gir, sana şifre sıfırlama bağlantısı gönderelim. Tek adım, hızlı akış."
        icon="shield-lock-outline"
        metrics={[
          { icon: "email-fast-outline", label: "Tek adım", tone: "primary" },
          { icon: "account-check-outline", label: "Güvenli akış", tone: "success" }
        ]}
        title="Şifre yenileme"
      />

      {isSubmitSuccessful ? (
        <EmptyState
          actionSlot={
            <Link href={routes.auth.signIn} asChild>
              <AppButton label="Giriş ekranına dön" variant="secondary" />
            </Link>
          }
          description="Kayıtlı e-posta adresin doğrulanırsa şifre yenileme bağlantısı bu hesap için başlatılır. Gelen kutunu kontrol et."
          icon="email-check-outline"
          title="Talebiniz alındı"
        />
      ) : (
        <InfoCard
          description="Kayıtlı e-posta adresini gir. Şifre sıfırlama bağlantısı tek adımda iletilir."
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
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                />
              )}
            />
            {submissionError ? <Text style={styles.error}>{submissionError}</Text> : null}
            <AppButton
              disabled={forgotPasswordMutation.isPending}
              label={
                forgotPasswordMutation.isPending
                  ? "Talep gönderiliyor…"
                  : "Yenileme Bağlantısı Gönder"
              }
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
    gap: spacing.xl
  },
  formFields: {
    gap: spacing.standard
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "600"
  }
});
