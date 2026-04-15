import type { StatusPillTone } from "../../../shared/ui/StatusPill";
import type { AppIconName } from "../../../shared/ui/AppIcon";
import type {
  CaregiverActivationValues
} from "../../caregiver/schemas";
import type { PetshopActivationValues } from "../../petshop/schemas";

export type CaregiverModeStatus = "inactive" | "incomplete" | "active";
export type PetshopModeStatus =
  | "inactive"
  | "incomplete"
  | "in_review"
  | "rejected"
  | "active";

type ProfileDefaults = {
  city?: string | null;
  district?: string | null;
  email?: string | null;
  fullName?: string | null;
};

type ChecklistItem = {
  done: boolean;
  label: string;
};

type ModePresentation = {
  description: string;
  icon: AppIconName;
  label: string;
  shortLabel: string;
  tone: StatusPillTone;
};

function asRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function readString(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function readStringArray(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function splitLegacyList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCompletion(items: ChecklistItem[]) {
  const completed = items.filter((item) => item.done).length;
  return Math.round((completed / items.length) * 100);
}

export function normalizeCaregiverProfile(
  value: unknown,
  defaults?: ProfileDefaults
): CaregiverActivationValues {
  const record = asRecord(value);
  const legacyAnimalTypes = splitLegacyList(readString(record, "animalTypes"));
  const serviceTypes = readStringArray(record, "serviceTypes");

  return {
    city: readString(record, "city") || defaults?.city || "",
    district: readString(record, "district") || defaults?.district || "",
    experienceYears: readString(record, "experienceYears"),
    serviceTypes: serviceTypes.length > 0 ? serviceTypes : legacyAnimalTypes,
    availability:
      readString(record, "availability") === "hafta-ici" ||
      readString(record, "availability") === "hafta-sonu" ||
      readString(record, "availability") === "esnek"
        ? (readString(record, "availability") as CaregiverActivationValues["availability"])
        : "esnek",
    rateExpectation: readString(record, "rateExpectation"),
    profileBio: readString(record, "profileBio"),
    supportingAssets: readStringArray(record, "supportingAssets")
  };
}

export function normalizePetshopProfile(
  value: unknown,
  defaults?: ProfileDefaults
): PetshopActivationValues {
  const record = asRecord(value);
  const businessType = readString(record, "businessType");

  return {
    businessName: readString(record, "businessName"),
    authorizedPerson: readString(record, "authorizedPerson") || defaults?.fullName || "",
    address: readString(record, "address") || readString(record, "campaignFocus"),
    contactPhone: readString(record, "contactPhone"),
    contactEmail: readString(record, "contactEmail") || defaults?.email || "",
    taxNumber: readString(record, "taxNumber"),
    businessType:
      businessType === "petshop" ||
      businessType === "veteriner" ||
      businessType === "bakim-merkezi" ||
      businessType === "karma-magaza"
        ? (businessType as PetshopActivationValues["businessType"])
        : "petshop",
    storeImages: readStringArray(record, "storeImages"),
    verificationDocuments: readStringArray(record, "verificationDocuments")
  };
}

export function getCaregiverChecklist(profile: CaregiverActivationValues) {
  return [
    { done: profile.city.trim().length > 1, label: "Hizmet bolgesi" },
    { done: profile.district.trim().length > 1, label: "Ilce bilgisi" },
    { done: profile.experienceYears.trim().length > 0, label: "Deneyim" },
    { done: profile.serviceTypes.length > 0, label: "Hizmet turleri" },
    { done: profile.availability.trim().length > 0, label: "Uygunluk" },
    { done: profile.rateExpectation.trim().length > 0, label: "Ucret beklentisi" },
    { done: profile.profileBio.trim().length >= 20, label: "Profil aciklamasi" }
  ] satisfies ChecklistItem[];
}

export function getPetshopChecklist(profile: PetshopActivationValues) {
  return [
    { done: profile.businessName.trim().length > 1, label: "Magaza adi" },
    { done: profile.authorizedPerson.trim().length > 1, label: "Yetkili kisi" },
    { done: profile.address.trim().length > 7, label: "Adres" },
    { done: profile.contactPhone.trim().length > 9, label: "Iletisim telefonu" },
    { done: profile.contactEmail.trim().length > 4, label: "Iletisim e-postasi" },
    { done: profile.taxNumber.trim().length > 7, label: "Vergi / isletme bilgisi" },
    { done: profile.businessType.trim().length > 0, label: "Isletme tipi" },
    { done: profile.storeImages.length > 0, label: "Magaza gorselleri" },
    {
      done: profile.verificationDocuments.length > 0,
      label: "Dogrulama belgeleri"
    }
  ] satisfies ChecklistItem[];
}

export function getCaregiverCompletion(profile: CaregiverActivationValues) {
  return toCompletion(getCaregiverChecklist(profile));
}

export function getPetshopCompletion(profile: PetshopActivationValues) {
  return toCompletion(getPetshopChecklist(profile));
}

export function getCaregiverMissingItems(profile: CaregiverActivationValues) {
  return getCaregiverChecklist(profile)
    .filter((item) => !item.done)
    .map((item) => item.label);
}

export function getPetshopMissingItems(profile: PetshopActivationValues) {
  return getPetshopChecklist(profile)
    .filter((item) => !item.done)
    .map((item) => item.label);
}

export function deriveCaregiverDraftStatus(
  profile: CaregiverActivationValues,
  previousStatus?: CaregiverModeStatus
): CaregiverModeStatus {
  const completion = getCaregiverCompletion(profile);

  if (previousStatus === "active" && completion === 100) {
    return "active";
  }

  if (completion === 0) {
    return "inactive";
  }

  return completion === 100 ? "active" : "incomplete";
}

export function derivePetshopDraftStatus(
  profile: PetshopActivationValues,
  previousStatus?: PetshopModeStatus
): PetshopModeStatus {
  const completion = getPetshopCompletion(profile);

  if (previousStatus === "active" && completion === 100) {
    return "active";
  }

  if (previousStatus === "in_review" && completion > 0) {
    return "in_review";
  }

  if (previousStatus === "rejected" && completion > 0) {
    return "rejected";
  }

  if (completion === 0) {
    return "inactive";
  }

  return completion === 100 ? "active" : "incomplete";
}

export function getCaregiverModePresentation(status: CaregiverModeStatus): ModePresentation {
  switch (status) {
    case "active":
      return {
        label: "Aktif",
        shortLabel: "aktif",
        tone: "success",
        icon: "shield-check",
        description:
          "Bakici modu hazir. Basvuru ve eslesme akislarinda bu profil kullanilir."
      };
    case "incomplete":
      return {
        label: "Eksik bilgi",
        shortLabel: "eksik",
        tone: "warning",
        icon: "progress-alert",
        description:
          "Birkaç alan eksik. Tamamladiginda basvuru aksiyonlari dogrudan acilir."
      };
    default:
      return {
        label: "Pasif",
        shortLabel: "pasif",
        tone: "neutral",
        icon: "shield-account-outline",
        description:
          "Bakici modu kapali. Istersen adim adim acip profesyonel profilini hazirla."
      };
  }
}

export function getPetshopModePresentation(status: PetshopModeStatus): ModePresentation {
  switch (status) {
    case "active":
      return {
        label: "Aktif",
        shortLabel: "aktif",
        tone: "success",
        icon: "store-check",
        description:
          "Petshop modu aktif. Kampanya ve magaza alanlari kullanima hazir."
      };
    case "in_review":
      return {
        label: "Incelemede",
        shortLabel: "incelemede",
        tone: "info",
        icon: "store-clock-outline",
        description:
          "Basvurun alindi. Belgeler dogrulanirken kayitlarini buradan yonetebilirsin."
      };
    case "rejected":
      return {
        label: "Reddedildi",
        shortLabel: "reddedildi",
        tone: "error",
        icon: "store-remove-outline",
        description:
          "Belgelerde duzeltme gerekiyor. Guncelleyip basvuruyu yeniden gonderebilirsin."
      };
    case "incomplete":
      return {
        label: "Eksik bilgi",
        shortLabel: "eksik",
        tone: "warning",
        icon: "file-alert-outline",
        description:
          "Magaza bilgileri veya belgeler eksik. Basvuru oncesi net sekilde tamamlanir."
      };
    default:
      return {
        label: "Pasif",
        shortLabel: "pasif",
        tone: "neutral",
        icon: "storefront-outline",
        description:
          "Petshop modu kapali. Magaza bilgilerini girdiginde basvuru akisi baslar."
      };
  }
}

export function getCaregiverActionLabel(status: CaregiverModeStatus) {
  if (status === "active") {
    return "Duzenle";
  }

  if (status === "incomplete") {
    return "Tamamla";
  }

  return "Aktif Et";
}

export function getPetshopActionLabel(status: PetshopModeStatus) {
  if (status === "active") {
    return "Duzenle";
  }

  if (status === "in_review") {
    return "Basvuruyu Guncelle";
  }

  if (status === "rejected") {
    return "Basvuruyu Yenile";
  }

  if (status === "incomplete") {
    return "Tamamla";
  }

  return "Basvuruyu Baslat";
}
