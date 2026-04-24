import type { ListingRecord } from "../../../core/api/contracts";
import { formatExpiresAt, formatRelativeDate } from "../../../shared/utils/formatDate";
import {
  getPrimaryMediaUrl,
  parseEmbeddedListingMetadata
} from "./embeddedListingMetadata";

// ─── Caregiver Listing ───────────────────────────────────────────────────────

export type CaregiverDisplay = {
  id: string;
  avatarLabel: string;
  coverImageUri?: string;
  caretakerName: string;
  title: string;
  city: string;
  schedule: string;
  summary: string;
  budget: string;
  verificationState: "verified" | "pending";
};

export function toCaregiverDisplay(listing: ListingRecord): CaregiverDisplay {
  const creator = listing.creator;
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);
  const fullName = creator?.fullName ?? "Bakıcı";
  const parts = fullName.trim().split(/\s+/);
  const firstChar = parts[0]?.[0] ?? "";
  const lastChar = parts.length >= 2 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  const initials =
    parts.length >= 2
      ? `${firstChar}${lastChar}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase();

  return {
    id: listing.id,
    avatarLabel: initials,
    coverImageUri: getPrimaryMediaUrl(metadata),
    caretakerName: fullName,
    title: listing.title,
    city: creator?.city ?? metadata.city ?? metadata.district ?? "",
    schedule:
      metadata.availabilityLabel ?? [creator?.city ?? metadata.city, creator?.district ?? metadata.district].filter(Boolean).join(" / "),
    summary: description,
    budget: metadata.priceLabel ?? "",
    verificationState: creator?.isSitter ? "verified" : "pending"
  };
}

// ─── Owner Request ───────────────────────────────────────────────────────────

export type OwnerRequestDisplay = {
  coverImageUri?: string;
  id: string;
  title: string;
  city: string;
  petType: string;
  dateLabel: string;
  schedule: string;
  summary: string;
  budget: string;
  distanceLabel: string;
};

export function toOwnerRequestDisplay(listing: ListingRecord): OwnerRequestDisplay {
  const creator = listing.creator;
  const pet = listing.pet;
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);

  return {
    coverImageUri: getPrimaryMediaUrl(metadata),
    id: listing.id,
    title: listing.title,
    city: creator?.city ?? metadata.city ?? metadata.district ?? "",
    petType: metadata.petType ?? pet?.species ?? "Evcil Hayvan",
    dateLabel: metadata.datePlan ?? formatExpiresAt(listing.expiresAt),
    schedule: metadata.datePlan ?? formatExpiresAt(listing.expiresAt),
    summary: description,
    budget: metadata.priceLabel ?? "",
    distanceLabel:
      listing.distanceKm != null ? `${listing.distanceKm.toFixed(1)} km` : ""
  };
}

// ─── Community Post ──────────────────────────────────────────────────────────

export type CommunityPostDisplay = {
  id: string;
  title: string;
  categoryKey: string;
  category: string;
  city: string;
  district: string;
  summary: string;
  author: string;
  authorRole: string;
  dateLabel: string;
  imageUri?: string;
  trustState: "verified" | "pending";
  quickActionLabel: string;
  visualLabel?: string;
};

const communityCategoryLabels: Record<string, string> = {
  "ucretsiz-mama": "Ücretsiz Mama",
  sahiplendirme: "Sahiplendirme",
  diger: "Destek Çağrısı",
  FREE_ITEM: "Ücretsiz Mama",
  ACTIVITY: "Etkinlik",
  HELP_REQUEST: "Destek Çağrısı"
};

export function getCommunityCategoryKey(listing: ListingRecord) {
  return listing.communityItem?.category ?? listing.type;
}

export function getCommunityCategoryLabel(categoryKey: string) {
  return communityCategoryLabels[categoryKey] ?? "Topluluk";
}

export function getCommunityQuickActionLabel(categoryKey: string) {
  if (categoryKey === "ucretsiz-mama" || categoryKey === "FREE_ITEM") {
    return "Destek Ol";
  }

  if (categoryKey === "sahiplendirme") {
    return "İncele";
  }

  return "İletişime Geç";
}

export function toCommunityDisplay(listing: ListingRecord): CommunityPostDisplay {
  const creator = listing.creator;
  const rawCategory = getCommunityCategoryKey(listing);
  const { description, metadata } = parseEmbeddedListingMetadata(listing.description);

  return {
    id: listing.id,
    title: listing.title,
    categoryKey: rawCategory,
    category: getCommunityCategoryLabel(rawCategory),
    city: creator?.city ?? metadata.city ?? "",
    district: creator?.district ?? metadata.district ?? "",
    summary: description,
    author: creator?.fullName ?? "Anonim",
    authorRole: creator?.isPetshop
      ? "Petshop"
      : creator?.isSitter
        ? "Bakıcı"
        : "Kullanıcı",
    dateLabel: formatRelativeDate(listing.createdAt),
    imageUri: getPrimaryMediaUrl(metadata),
    trustState: "pending",
    quickActionLabel: getCommunityQuickActionLabel(rawCategory),
    visualLabel: metadata.supportWindow
  };
}
