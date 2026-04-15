import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ApiError } from "../../../core/api/errors";
import { colors } from "../../../core/theme/colors";
import { spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { AppIcon } from "../../../shared/ui/AppIcon";
import { InfoCard } from "../../../shared/ui/InfoCard";
import { ScreenContainer } from "../../../shared/ui/ScreenContainer";
import { TextField } from "../../../shared/ui/TextField";
import { VisualHero } from "../../../shared/ui/VisualHero";
import { signUpSchema, type SignUpValues } from "../schemas";
import { useSessionStore } from "../store/sessionStore";
import { routes } from "../../../core/navigation/routes";

export function SignUpScreen() {
  const signUp = useSessionStore((state) => state.signUp);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: SignUpValues) => {
    setSubmissionError(null);

    try {
      await signUp(values);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmissionError(error.message);
        return;
      }

      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Kayit tamamlanirken beklenmeyen bir sorun olustu."
      );
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Kayit sonrasi tum alanlara yonlenebilecegin gorsel agirlikli ana deneyim hemen hazir olacak."
        icon="account-plus"
        metrics={[
          { icon: "paw", label: "Bakici ve sahip", tone: "primary" },
          { icon: "storefront-outline", label: "Petshop", tone: "neutral" }
        ]}
        title="Yeni hesabini olustur"
      />

      <InfoCard title="Kayit bilgileri" description="Temel bilgilerini ekleyerek uygulamaya dahil ol.">
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

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                label="E-posta"
                autoCapitalize="none"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                label="Sifre"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Text style={styles.helper}>
            Kayit sonrasi kisa onboarding ve ilk profil kurulumu ile seni uygun akislara yonlendiririz.
          </Text>

          {submissionError ? <Text style={styles.error}>{submissionError}</Text> : null}

          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Hesap hazirlaniyor..." : "Kaydi Tamamla"}
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="check-bold" size={18} />}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </InfoCard>

      <Link href={routes.auth.signIn} asChild>
        <AppButton
          label="Zaten hesabim var"
          leftSlot={<AppIcon backgrounded={false} name="login" size={18} />}
          variant="ghost"
        />
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.section
  },
  formFields: {
    gap: spacing.standard
  },
  error: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "600"
  },
  helper: {
    color: colors.textMuted,
    ...typography.caption
  }
});

