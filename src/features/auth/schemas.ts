import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı.")
});

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı.")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin.")
});

export const profileGoalOptions = [
  "kesfetmek-istiyorum",
  "bakici-olmak-istiyorum",
  "hayvanim-icin-bakici-ariyorum",
  "petshop-hesabi-acmak-istiyorum"
] as [
  "kesfetmek-istiyorum",
  "bakici-olmak-istiyorum",
  "hayvanim-icin-bakici-ariyorum",
  "petshop-hesabi-acmak-istiyorum"
];

export const profileSetupSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı."),
  city: z.string().min(2, "Şehir bilgisini ekleyin."),
  district: z.string().min(2, "İlçe bilgisini ekleyin."),
  photoUri: z.string().min(1, "Profil fotoğrafı ekleyin."),
  goal: z.enum(profileGoalOptions, {
    message: "Kullanım amacınızı seçin."
  })
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileGoal = (typeof profileGoalOptions)[number];
export type ProfileSetupValues = z.infer<typeof profileSetupSchema>;

