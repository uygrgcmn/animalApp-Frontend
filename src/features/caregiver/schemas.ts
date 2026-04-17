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
  city: z.string().min(2, "Şehir gerekli."),
  district: z.string().min(2, "İlçe gerekli."),
  experienceYears: z.string().min(1, "Deneyim süresi gerekli."),
  serviceTypes: z.array(z.string()).min(1, "En az bir hizmet türü seç."),
  availability: z.enum(caregiverAvailabilityOptions, {
    message: "Uygunluk tercih et."
  }),
  rateExpectation: z.string().min(2, "Ücret beklentisi gerekli."),
  profileBio: z.string().min(20, "Kısa bir profil açıklaması ekle."),
  supportingAssets: z.array(z.string())
});

export type CaregiverActivationValues = z.infer<typeof caregiverActivationSchema>;

