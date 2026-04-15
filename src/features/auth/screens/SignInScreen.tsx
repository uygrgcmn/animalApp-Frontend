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
import { signInSchema, type SignInValues } from "../schemas";
import { useSessionStore } from "../store/sessionStore";
import { routes } from "../../../core/navigation/routes";

export function SignInScreen() {
  const signIn = useSessionStore((state) => state.signIn);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: SignInValues) => {
    setSubmissionError(null);

    try {
      await signIn(values);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmissionError(error.message);
        return;
      }

      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Giris yapilirken beklenmeyen bir sorun olustu."
      );
    }
  };

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <VisualHero
        description="Mevcut hesabinla ana alanlara tek akista don ve ikonlarla desteklenen dashboard'a ulas."
        icon="login-variant"
        metrics={[
          { icon: "account-circle", label: "Tek hesap", tone: "primary" },
          { icon: "view-dashboard", label: "Ana merkez", tone: "success" }
        ]}
        title="Hesabina hizli donus"
      />

      <InfoCard title="Giris bilgileri" description="E-posta ve sifreni girerek oturumu baslat.">
        <View style={styles.formFields}>
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

          <Link href={routes.auth.forgotPassword} asChild>
            <Text style={styles.link}>Sifremi unuttum</Text>
          </Link>

          {submissionError ? <Text style={styles.error}>{submissionError}</Text> : null}

          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
            leftSlot={<AppIcon backgrounded={false} color="#FFFFFF" name="arrow-right" size={18} />}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </InfoCard>

      <Link href={routes.auth.signUp} asChild>
        <AppButton
          label="Yeni hesap olustur"
          leftSlot={<AppIcon backgrounded={false} name="account-plus" size={18} />}
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
  link: {
    alignSelf: "flex-end",
    color: colors.primary,
    ...typography.label
  }
});

