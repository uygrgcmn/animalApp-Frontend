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
    { done: profile.city.trim().length > 1, label: "Hizmet bölgesi" },
    { done: profile.district.trim().length > 1, label: "İlçe bilgisi" },
    { done: profile.experienceYears.trim().length > 0, label: "Deneyim" },
    { done: profile.serviceTypes.length > 0, label: "Hizmet türleri" },
    { done: profile.availability.trim().length > 0, label: "Uygunluk" },
    { done: profile.rateExpectation.trim().length > 0, label: "Ücret beklentisi" },
    { done: profile.profileBio.trim().length >= 20, label: "Profil açıklaması" }
  ] satisfies ChecklistItem[];
}

export function getPetshopChecklist(profile: PetshopActivationValues) {
  return [
    { done: profile.businessName.trim().length > 1, label: "Mağaza adı" },
    { done: profile.authorizedPerson.trim().length > 1, label: "Yetkili kişi" },
    { done: profile.address.trim().length > 7, label: "Adres" },
    { done: profile.contactPhone.trim().length > 9, label: "İletişim telefonu" },
    { done: profile.contactEmail.trim().length > 4, label: "İletişim e-postası" },
    { done: profile.taxNumber.trim().length > 7, label: "Vergi / işletme bilgisi" },
    { done: profile.businessType.trim().length > 0, label: "İşletme tipi" },
    { done: profile.storeImages.length > 0, label: "Mağaza görselleri" },
    {
      done: profile.verificationDocuments.length > 0,
      label: "Doğrulama belgeleri"
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
          "Bakıcı modu hazır. Başvuru ve eşleşme akışlarında bu profil kullanılır."
      };
    case "incomplete":
      return {
        label: "Eksik bilgi",
        shortLabel: "eksik",
        tone: "warning",
        icon: "progress-alert",
        description:
          "Birkaç alan eksik. Tamamladığında başvuru aksiyonları doğrudan açılır."
      };
    default:
      return {
        label: "Pasif",
        shortLabel: "pasif",
        tone: "neutral",
        icon: "shield-account-outline",
        description:
          "Bakıcı modu kapalı. İstersen adım adım açıp profesyonel profilini hazırla."
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
          "Petshop modu aktif. Kampanya ve mağaza alanları kullanıma hazır."
      };
    case "in_review":
      return {
        label: "İncelemede",
        shortLabel: "incelemede",
        tone: "info",
        icon: "store-clock-outline",
        description:
          "Başvurun alındı. Belgeler doğrulanırken kayıtlarını buradan yönetebilirsin."
      };
    case "rejected":
      return {
        label: "Reddedildi",
        shortLabel: "reddedildi",
        tone: "error",
        icon: "store-remove-outline",
        description:
          "Belgelerde düzeltme gerekiyor. Güncelleyip başvuruyu yeniden gönderebilirsin."
      };
    case "incomplete":
      return {
        label: "Eksik bilgi",
        shortLabel: "eksik",
        tone: "warning",
        icon: "file-alert-outline",
        description:
          "Mağaza bilgileri veya belgeler eksik. Başvuru öncesi net şekilde tamamlanır."
      };
    default:
      return {
        label: "Pasif",
        shortLabel: "pasif",
        tone: "neutral",
        icon: "storefront-outline",
        description:
          "Petshop modu kapalı. Mağaza bilgilerini girdiğinde başvuru akışı başlar."
      };
  }
}

export function getCaregiverActionLabel(status: CaregiverModeStatus) {
  if (status === "active") {
    return "Düzenle";
  }

  if (status === "incomplete") {
    return "Tamamla";
  }

  return "Aktif Et";
}

export function getPetshopActionLabel(status: PetshopModeStatus) {
  if (status === "active") {
    return "Düzenle";
  }

  if (status === "in_review") {
    return "Başvuruyu Güncelle";
  }

  if (status === "rejected") {
    return "Başvuruyu Yenile";
  }

  if (status === "incomplete") {
    return "Tamamla";
  }

  return "Başvuruyu Başlat";
}
