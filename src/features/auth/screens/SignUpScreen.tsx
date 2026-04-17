import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../../../core/api/errors";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { TextField } from "../../../shared/ui/TextField";
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
    defaultValues: { fullName: "", email: "", password: "" }
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
        error instanceof Error ? error.message : "Kayıt tamamlanırken bir sorun oluştu."
      );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brand}>
          <LinearGradient
            colors={[colors.primary, "#2DD4BF"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.brandIcon}
          >
            <MaterialCommunityIcons name="account-plus" size={32} color={colors.textInverse} />
          </LinearGradient>
          <View style={styles.brandTexts}>
            <Text style={styles.brandTitle}>Hesap oluştur</Text>
            <Text style={styles.brandSubtitle}>
              Tek hesapla bakıcı, sahip ve petshop deneyimine tam erişim.
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <TextField
                label="Ad Soyad"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.fullName?.message}
                returnKeyType="next"
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
                returnKeyType="next"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                label="Şifre"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
                hint="En az 8 karakter"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          {submissionError ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.errorText}>{submissionError}</Text>
            </View>
          ) : null}

          <AppButton
            disabled={isSubmitting}
            loading={isSubmitting}
            label="Kaydı Tamamla"
            size="lg"
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerLabel}>ya da</Text>
          <View style={styles.divider} />
        </View>

        <Link href={routes.auth.signIn} asChild>
          <AppButton label="Zaten hesabım var" variant="secondary" size="lg" />
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    flex: 1,
    gap: spacing.section,
    justifyContent: "center",
    paddingHorizontal: spacing.comfortable,
    paddingVertical: spacing.comfortable
  },
  brand: {
    alignItems: "center",
    gap: spacing.standard
  },
  brandIcon: {
    alignItems: "center",
    borderRadius: radius.xlarge,
    height: 80,
    justifyContent: "center",
    width: 80,
    ...shadows.card
  },
  brandTexts: {
    alignItems: "center",
    gap: spacing.tight
  },
  brandTitle: {
    color: colors.text,
    ...typography.h1,
    textAlign: "center"
  },
  brandSubtitle: {
    color: colors.textMuted,
    ...typography.body,
    textAlign: "center"
  },
  form: {
    gap: spacing.standard
  },
  errorBox: {
    alignItems: "center",
    backgroundColor: colors.errorSoft,
    borderRadius: radius.medium,
    flexDirection: "row",
    gap: spacing.tight,
    padding: spacing.standard
  },
  errorText: {
    color: colors.error,
    flex: 1,
    ...typography.caption
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.standard
  },
  divider: {
    backgroundColor: colors.divider,
    flex: 1,
    height: 1
  },
  dividerLabel: {
    color: colors.textTertiary,
    ...typography.caption
  }
});
