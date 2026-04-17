import { z } from "zod";

export const petshopBusinessTypeOptions = [
  "petshop",
  "veteriner",
  "bakim-merkezi",
  "karma-magaza"
] as ["petshop", "veteriner", "bakim-merkezi", "karma-magaza"];

export const petshopActivationSchema = z.object({
  businessName: z.string().min(2, "İşletme adı gerekli."),
  authorizedPerson: z.string().min(2, "Yetkili kişi gerekli."),
  address: z.string().min(8, "Adres bilgisi gerekli."),
  contactPhone: z.string().min(10, "İletişim telefonu gerekli."),
  contactEmail: z.string().email("Geçerli bir e-posta gir."),
  taxNumber: z.string().min(8, "Vergi numarası gerekli."),
  businessType: z.enum(petshopBusinessTypeOptions, {
    message: "İşletme türünü seç."
  }),
  storeImages: z.array(z.string()).min(1, "En az bir mağaza görseli ekle."),
  verificationDocuments: z
    .array(z.string())
    .min(1, "En az bir doğrulama belgesi ekle.")
});

export type PetshopActivationValues = z.infer<typeof petshopActivationSchema>;

