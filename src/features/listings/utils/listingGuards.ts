import type { ListingRecord } from "../../../core/api/contracts";

export function isCommunityListing(listing: ListingRecord) {
  return Boolean(listing.communityItem);
}

export function isCaregiverListing(listing: ListingRecord) {
  return listing.type === "SITTING" && !isCommunityListing(listing);
}

export function isOwnerRequestListing(listing: ListingRecord) {
  return listing.type === "HELP_REQUEST" && !isCommunityListing(listing);
}
