import { z } from "zod";

export const caregiverAvailabilityOptions = [
  "hafta-ici",
  "hafta-sonu",
  "esnek"
] as ["hafta-ici", "hafta-sonu", "esnek"];

export const caregiverServiceOptions = [
  "evde-bakim",
  "gunluk-ziyaret",
  "kopek-gezdirme",
  "ilac-takibi",
  "geceli-bakim"
] as const;

export const caregiverActivationSchema = z.object({
  city: z.string().min(2, "Sehir gerekli."),
  district: z.string().min(2, "Ilce gerekli."),
  experienceYears: z.string().min(1, "Deneyim suresi gerekli."),
  serviceTypes: z.array(z.string()).min(1, "En az bir hizmet turu sec."),
  availability: z.enum(caregiverAvailabilityOptions, {
    message: "Uygunluk tercih et."
  }),
  rateExpectation: z.string().min(2, "Ucret beklentisi gerekli."),
  profileBio: z.string().min(20, "Kisa bir profil aciklamasi ekle."),
  supportingAssets: z.array(z.string())
});

export type CaregiverActivationValues = z.infer<typeof caregiverActivationSchema>;

