import { z } from "zod";

export const petshopBusinessTypeOptions = [
  "petshop",
  "veteriner",
  "bakim-merkezi",
  "karma-magaza"
] as ["petshop", "veteriner", "bakim-merkezi", "karma-magaza"];

export const petshopActivationSchema = z.object({
  businessName: z.string().min(2, "Isletme adi gerekli."),
  authorizedPerson: z.string().min(2, "Yetkili kisi gerekli."),
  address: z.string().min(8, "Adres bilgisi gerekli."),
  contactPhone: z.string().min(10, "Iletisim telefonu gerekli."),
  contactEmail: z.string().email("Gecerli bir e-posta gir."),
  taxNumber: z.string().min(8, "Vergi numarasi gerekli."),
  businessType: z.enum(petshopBusinessTypeOptions, {
    message: "Isletme turunu sec."
  }),
  storeImages: z.array(z.string()).min(1, "En az bir magaza gorseli ekle."),
  verificationDocuments: z
    .array(z.string())
    .min(1, "En az bir dogrulama belgesi ekle.")
});

export type PetshopActivationValues = z.infer<typeof petshopActivationSchema>;

