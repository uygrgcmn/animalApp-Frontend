import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Gecerli bir e-posta girin."),
  password: z.string().min(6, "Sifre en az 6 karakter olmali.")
});

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali."),
  email: z.string().email("Gecerli bir e-posta girin."),
  password: z.string().min(6, "Sifre en az 6 karakter olmali.")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Gecerli bir e-posta girin.")
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
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali."),
  city: z.string().min(2, "Sehir bilgisini ekleyin."),
  district: z.string().min(2, "Ilce bilgisini ekleyin."),
  photoUri: z.string().min(1, "Profil fotografi ekleyin."),
  goal: z.enum(profileGoalOptions, {
    message: "Kullanim amacinizi secin."
  })
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileGoal = (typeof profileGoalOptions)[number];
export type ProfileSetupValues = z.infer<typeof profileSetupSchema>;

