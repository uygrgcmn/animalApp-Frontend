import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type {
  CreateCommunityListingRequest,
  CreateListingRequest,
  ListingRecord
} from "../../../core/api/contracts";
import { uploadMediaAsset } from "../../../core/media/uploadMediaAsset";
import { communityApi } from "../../../core/api/services/communityApi";
import { listingsApi } from "../../../core/api/services/listingsApi";
import { useSessionStore } from "../../auth/store/sessionStore";
import {
  MAX_CREATE_MEDIA_COUNT,
  type CreateWizardValues
} from "../schemas";
import { embedListingMetadata } from "../../listings/utils/embeddedListingMetadata";
import {
  createLocalPetshopCampaign,
  type LocalPetshopCampaign
} from "../../petshop/utils/campaigns";

// ─── Description builders ────────────────────────────────────────────────────

const serviceLabels: Record<string, string> = {
  "evde-bakim": "Evde bakım",
  "geceli-bakim": "Geceli bakım",
  "gunluk-ziyaret": "Günlük ziyaret",
  "ilac-takibi": "İlaç takibi",
  "kopek-gezdirme": "Köpek gezdirme"
};

const availabilityLabels: Record<string, string> = {
  esnek: "Esnek",
  "hafta-ici": "Hafta içi",
  "hafta-sonu": "Hafta sonu"
};

const careNeedLabels: Record<string, string> = {
  "gunluk-rutin": "Günlük rutin",
  "gece-konaklama": "Gece konaklama",
  "ilac-takibi": "İlaç takibi",
  "kopek-gezdirme": "Köpek gezdirme"
};

function buildCaregiverDescription(values: CreateWizardValues): string {
  const parts: string[] = [values.description ?? ""];
  const services = (values.caregiverServiceTypes ?? []).map((s) => serviceLabels[s] ?? s);
  if (services.length > 0) parts.push(`Hizmet türleri: ${services.join(", ")}`);
  if (values.caregiverAvailability) {
    parts.push(`Müsaitlik: ${availabilityLabels[values.caregiverAvailability] ?? values.caregiverAvailability}`);
  }
  if (values.caregiverRate) parts.push(`Ücret beklentisi: ${values.caregiverRate}`);
  if (values.caregiverExperience) parts.push(`Deneyim: ${values.caregiverExperience}`);
  return parts.filter(Boolean).join("\n\n");
}

function buildOwnerDescription(values: CreateWizardValues): string {
  const parts: string[] = [values.description ?? ""];
  if (values.ownerPetType) parts.push(`Hayvan türü: ${values.ownerPetType}`);
  if (values.ownerDatePlan) parts.push(`Bakım tarihi / planı: ${values.ownerDatePlan}`);
  if (values.ownerBudget) parts.push(`Bütçe: ${values.ownerBudget}`);
  const needs = (values.ownerCareNeeds ?? []).map((n) => careNeedLabels[n] ?? n);
  if (needs.length > 0) parts.push(`Bakım ihtiyaçları: ${needs.join(", ")}`);
  return parts.filter(Boolean).join("\n\n");
}

function buildCommunityDescription(values: CreateWizardValues): string {
  const parts: string[] = [values.description ?? ""];
  if (values.communitySupportWindow) {
    parts.push(`Destek süresi: ${values.communitySupportWindow}`);
  }
  if (values.communityContactPreference) {
    parts.push(`İletişim tercihi: ${values.communityContactPreference}`);
  }

  return parts.filter(Boolean).join("\n\n");
}

// ─── Community type mapping ──────────────────────────────────────────────────

type CommunityType = CreateCommunityListingRequest["type"];

function mapCommunityType(category: string | undefined): CommunityType {
  if (category === "ucretsiz-mama") return "FREE_ITEM";
  return "HELP_REQUEST";
}

async function uploadMediaList(media: string[], folder: string) {
  return Promise.all(
    media.map((uri) =>
      uploadMediaAsset({
        folder,
        uri
      })
    )
  );
}

function normalizeMediaList(media: string[] | undefined) {
  return Array.from(
    new Set((media ?? []).map((item) => item.trim()).filter(Boolean))
  ).slice(0, MAX_CREATE_MEDIA_COUNT);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function usePublishListing() {
  const queryClient = useQueryClient();
  const currentUser = useSessionStore((state) => state.user);
  const petshopStatus = useSessionStore((state) => state.petshopStatus);
  const publishPetshopCampaign = useSessionStore((state) => state.publishPetshopCampaign);
  const [isPublishingPetshop, setIsPublishingPetshop] = useState(false);

  const listingMutation = useMutation({
    mutationFn: (payload: CreateListingRequest) => listingsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
    }
  });

  const communityMutation = useMutation({
    mutationFn: (payload: CreateCommunityListingRequest) => communityApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["community"] });
    }
  });

  async function publish(values: CreateWizardValues): Promise<ListingRecord | LocalPetshopCampaign | null> {
    if (!values.listingType) {
      return null;
    }

    const normalizedMedia = normalizeMediaList(values.media);

    if (normalizedMedia.length < 1) {
      throw new Error("En az bir görsel ekle.");
    }

    if (values.listingType === "petshop-campaign" && petshopStatus !== "active") {
      throw new Error("Petshop kampanyası yayınlamak için önce mağaza başvurusunu tamamlayıp hesabını aktifleştir.");
    }

    const uploadedUrls = await uploadMediaList(
      normalizedMedia,
      values.listingType === "community-post"
        ? "community"
        : values.listingType === "petshop-campaign"
          ? "petshop-campaigns"
          : "listings"
    );
    const mediaUrls = uploadedUrls;

    if (values.listingType === "caregiver-listing") {
      return listingMutation.mutateAsync({
        type: "SITTING",
        title: values.title ?? "",
        description: embedListingMetadata(buildCaregiverDescription(values), {
          availabilityLabel: values.caregiverAvailability
            ? (availabilityLabels[values.caregiverAvailability] ?? values.caregiverAvailability)
            : undefined,
          city: values.city,
          district: values.district,
          experience: values.caregiverExperience,
          mediaUrls,
          priceLabel: values.caregiverRate,
          serviceLabels: (values.caregiverServiceTypes ?? []).map((item) => serviceLabels[item] ?? item)
        }),
        status: "ACTIVE"
      });
    }

    if (values.listingType === "owner-request") {
      return listingMutation.mutateAsync({
        type: "HELP_REQUEST",
        title: values.title ?? "",
        description: embedListingMetadata(buildOwnerDescription(values), {
          careNeedLabels: (values.ownerCareNeeds ?? []).map((item) => careNeedLabels[item] ?? item),
          city: values.city,
          datePlan: values.ownerDatePlan,
          district: values.district,
          mediaUrls,
          petType: values.ownerPetType,
          priceLabel: values.ownerBudget
        }),
        status: "ACTIVE"
      });
    }

    if (values.listingType === "petshop-campaign") {
      if (!currentUser?.id) {
        throw new Error("Petshop kampanyası yayınlamak için aktif oturum gerekli.");
      }

      setIsPublishingPetshop(true);

      try {
        const campaign = createLocalPetshopCampaign({
          creatorId: currentUser.id,
          mediaUrls,
          values
        });

        publishPetshopCampaign(campaign);
        await queryClient.invalidateQueries({ queryKey: ["petshop"] });
        return campaign;
      } finally {
        setIsPublishingPetshop(false);
      }
    }

    // community-post
    return communityMutation.mutateAsync({
      type: mapCommunityType(values.communityCategory),
      title: values.title ?? "",
      description: embedListingMetadata(buildCommunityDescription(values), {
        city: values.city,
        contactPreferenceLabel: values.communityContactPreference,
        district: values.district,
        mediaUrls,
        supportWindow: values.communitySupportWindow
      }),
      status: "ACTIVE",
      latitude: 0,
      longitude: 0,
      itemCondition: "iyi",
      quantity: 1,
      category: values.communityCategory ?? "diger"
    });
  }

  return {
    isError: listingMutation.isError || communityMutation.isError,
    isPending: listingMutation.isPending || communityMutation.isPending || isPublishingPetshop,
    publish
  };
}
