import { z } from "zod";

import { caregiverAvailabilityOptions, caregiverServiceOptions } from "../caregiver/schemas";

export const createListingTypeOptions = [
  "caregiver-listing",
  "owner-request",
  "community-post",
  "petshop-campaign"
] as const;

export const ownerPetTypeOptions = ["Kopek", "Kedi", "Kus", "Diger"] as const;
export const ownerCareNeedOptions = [
  "gunluk-rutin",
  "gece-konaklama",
  "ilac-takibi",
  "kopek-gezdirme"
] as const;
export const communityCategoryOptions = [
  "ucretsiz-mama",
  "sahiplendirme",
  "diger"
] as const;
export const communityContactPreferenceOptions = ["mesaj", "telefon", "yorum"] as const;
export const petshopCampaignTypeOptions = [
  "mama",
  "aksesuar",
  "saglik",
  "bakim"
] as const;

export type CreateListingType = (typeof createListingTypeOptions)[number];

export const createTypeMeta: Record<
  CreateListingType,
  {
    description: string;
    icon:
      | "shield-account-outline"
      | "paw-outline"
      | "hand-heart-outline"
      | "storefront-outline";
    label: string;
    shortLabel: string;
  }
> = {
  "caregiver-listing": {
    description: "Bakici profiline uygun, guven veren ve hizmet odakli bir ilan olustur.",
    icon: "shield-account-outline",
    label: "Bakici ilani paylas",
    shortLabel: "Bakici Ilani"
  },
  "community-post": {
    description: "Topluluga daha sicak ama duzenli bir paylasim akisi ac.",
    icon: "hand-heart-outline",
    label: "Topluluk paylasimi olustur",
    shortLabel: "Topluluk"
  },
  "owner-request": {
    description: "Evcil hayvanin icin bakici aradigin net bir talep akisi hazirla.",
    icon: "paw-outline",
    label: "Bakici ariyorum ilani paylas",
    shortLabel: "Bakici Ariyorum"
  },
  "petshop-campaign": {
    description: "Magazana ait kampanyayi kurumsal bir sunumla yayina hazirla.",
    icon: "storefront-outline",
    label: "Petshop kampanyasi olustur",
    shortLabel: "Petshop"
  }
};

const createWizardBaseSchema = z.object({
  listingType: z.enum(createListingTypeOptions).optional(),
  title: z.string().trim().default(""),
  city: z.string().trim().default(""),
  district: z.string().trim().default(""),
  description: z.string().trim().default(""),
  media: z.array(z.string()).default([]),
  caregiverServiceTypes: z.array(z.enum(caregiverServiceOptions)).default([]),
  caregiverAvailability: z.enum(caregiverAvailabilityOptions).default("esnek"),
  caregiverRate: z.string().trim().default(""),
  caregiverExperience: z.string().trim().default(""),
  ownerPetType: z.enum(ownerPetTypeOptions).default("Kopek"),
  ownerDatePlan: z.string().trim().default(""),
  ownerBudget: z.string().trim().default(""),
  ownerCareNeeds: z.array(z.enum(ownerCareNeedOptions)).default([]),
  communityCategory: z.enum(communityCategoryOptions).default("diger"),
  communityContactPreference: z.enum(communityContactPreferenceOptions).default("mesaj"),
  communitySupportWindow: z.string().trim().default(""),
  petshopStoreName: z.string().trim().default(""),
  petshopCampaignType: z.enum(petshopCampaignTypeOptions).default("mama"),
  petshopDiscount: z.string().trim().default(""),
  petshopPrice: z.string().trim().default(""),
  petshopDeadline: z.string().trim().default(""),
  petshopCampaignBadge: z.string().trim().default("")
});

export const createWizardSchema = createWizardBaseSchema.superRefine((values, context) => {
  if (!values.listingType) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Devam etmek icin bir icerik tipi sec.",
      path: ["listingType"]
    });
    return;
  }

  if (values.title.length < 4) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Baslik en az 4 karakter olmali.",
      path: ["title"]
    });
  }

  if (values.city.length < 2) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sehir gerekli.",
      path: ["city"]
    });
  }

  if (values.district.length < 2) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ilce gerekli.",
      path: ["district"]
    });
  }

  if (values.description.length < 24) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Aciklama en az 24 karakter olmali.",
      path: ["description"]
    });
  }

  if (values.media.length < 1) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "En az bir gorsel ekle.",
      path: ["media"]
    });
  }

  if (values.listingType === "caregiver-listing") {
    if (values.caregiverServiceTypes.length < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "En az bir hizmet turu sec.",
        path: ["caregiverServiceTypes"]
      });
    }

    if (values.caregiverRate.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ucret beklentisi gerekli.",
        path: ["caregiverRate"]
      });
    }

    if (values.caregiverExperience.length < 12) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deneyim ozeti en az 12 karakter olmali.",
        path: ["caregiverExperience"]
      });
    }
  }

  if (values.listingType === "owner-request") {
    if (values.ownerDatePlan.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bakim tarihini veya plani belirt.",
        path: ["ownerDatePlan"]
      });
    }

    if (values.ownerBudget.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Butce bilgisi gerekli.",
        path: ["ownerBudget"]
      });
    }

    if (values.ownerCareNeeds.length < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "En az bir bakim ihtiyaci sec.",
        path: ["ownerCareNeeds"]
      });
    }
  }

  if (values.listingType === "community-post") {
    if (values.communitySupportWindow.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paylasimin ne kadar sure gecerli oldugunu belirt.",
        path: ["communitySupportWindow"]
      });
    }
  }

  if (values.listingType === "petshop-campaign") {
    if (values.petshopStoreName.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Magaza adi gerekli.",
        path: ["petshopStoreName"]
      });
    }

    if (values.petshopDiscount.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indirim bilgisi gerekli.",
        path: ["petshopDiscount"]
      });
    }

    if (values.petshopPrice.length < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fiyat bilgisi gerekli.",
        path: ["petshopPrice"]
      });
    }

    if (values.petshopDeadline.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kampanya son tarihi gerekli.",
        path: ["petshopDeadline"]
      });
    }

    if (values.petshopCampaignBadge.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kampanya rozeti gerekli.",
        path: ["petshopCampaignBadge"]
      });
    }
  }
});

export type CreateWizardValues = z.input<typeof createWizardSchema>;
export type CreateWizardResolvedValues = z.output<typeof createWizardSchema>;

export type CreateWizardDraft = {
  currentStep: number;
  updatedAt: string;
  values: CreateWizardValues;
};

export const defaultCreateWizardValues: CreateWizardValues = {
  listingType: undefined,
  title: "",
  city: "",
  district: "",
  description: "",
  media: [],
  caregiverServiceTypes: [],
  caregiverAvailability: "esnek",
  caregiverRate: "",
  caregiverExperience: "",
  ownerPetType: "Kopek",
  ownerDatePlan: "",
  ownerBudget: "",
  ownerCareNeeds: [],
  communityCategory: "diger",
  communityContactPreference: "mesaj",
  communitySupportWindow: "",
  petshopStoreName: "",
  petshopCampaignType: "mama",
  petshopDiscount: "",
  petshopPrice: "",
  petshopDeadline: "",
  petshopCampaignBadge: ""
};
