import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "../../../core/api/errors";
import { colors } from "../../../core/theme/colors";
import { radius, shadows, spacing, typography } from "../../../core/theme/tokens";
import { AppButton } from "../../../shared/ui/AppButton";
import { TextField } from "../../../shared/ui/TextField";
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
    defaultValues: { email: "", password: "" }
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
        error instanceof Error ? error.message : "Giriş yapılırken bir sorun oluştu."
      );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.content}>
        {/* Brand area */}
        <View style={styles.brand}>
          <LinearGradient
            colors={[colors.primary, "#2DD4BF"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.brandIcon}
          >
            <MaterialCommunityIcons name="paw" size={32} color={colors.textInverse} />
          </LinearGradient>
          <View style={styles.brandTexts}>
            <Text style={styles.brandTitle}>Tekrar hoş geldin</Text>
            <Text style={styles.brandSubtitle}>
              Hesabına giriş yap ve kaldığın yerden devam et.
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
                returnKeyType="next"
              />
            )}
          />

          <View>
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
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />
            <Link href={routes.auth.forgotPassword} asChild>
              <Pressable style={styles.forgotLinkWrap}>
                <Text style={styles.forgotLink}>Şifremi unuttum</Text>
              </Pressable>
            </Link>
          </View>

          {submissionError ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={colors.error} />
              <Text style={styles.errorText}>{submissionError}</Text>
            </View>
          ) : null}

          <AppButton
            disabled={isSubmitting}
            loading={isSubmitting}
            label="Giriş Yap"
            size="lg"
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerLabel}>ya da</Text>
          <View style={styles.divider} />
        </View>

        <Link href={routes.auth.signUp} asChild>
          <AppButton label="Yeni hesap oluştur" variant="secondary" size="lg" />
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
  forgotLinkWrap: {
    alignSelf: "flex-end",
    marginTop: spacing.tight,
    paddingVertical: spacing.micro
  },
  forgotLink: {
    color: colors.primary,
    ...typography.label
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
